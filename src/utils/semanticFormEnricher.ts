import {
    FormHydration,
    FormHydrationSchema,
    FormHydrationValidation,
} from "@/interfaces/FormHydration";

/**
 * Maps canonical section keys from cruk-semantic-schema (visibleSections)
 * to the location prefixes used in formData.js and CreateDataset.tsx.
 */
export const SECTION_MAP: Record<string, string> = {
    // 1. Direct 1:1 Matches
    summary: "summary",
    documentation: "documentation",
    coverage: "coverage",
    accessibility: "accessibility",
    provenance: "provenance",
    enrichmentAndLinkage: "enrichmentAndLinkage",
    structuralMetadata: "structuralMetadata",
    demographicFrequency: "demographicFrequency",
    observations: "observations",
    omics: "omics",

    // 2. Aliased UI Sections
    welcome: "Welcome & Guide",
    version: "Dataset Version",
    datasetFilters: "Dataset Filters",
    otherDataTypes: "Other", // in formData.js: "Other.data.types"
    erd: "Entity Relationship Diagram",
    projectGrants: "Associated Project Grants",
};

/**
 * Reverse mapping from location prefix to canonical semantic section key.
 */
export const REVERSE_SECTION_MAP: Record<string, string> = {
    ...Object.entries(SECTION_MAP).reduce(
        (acc, [canonical, location]) => {
            acc[location] = canonical;
            return acc;
        },
        {} as Record<string, string>
    ),
    "Other.data.types": "otherDataTypes",
};

/**
 * Top-level system metadata fields in formData.js that must be preserved
 * in the background (field.hidden === true) for API payload integrity.
 */
export const SYSTEM_METADATA_LOCATIONS = new Set([
    "identifier",
    "revisions",
    "issued",
    "modified",
]);

/**
 * Multi-segment path traversal checking whether a field location is permitted
 * under semanticSchema.included rules.
 *
 * E.g., for location "accessibility.access.accessRights":
 * - checks if "access" is in included["accessibility"] (true)
 * - checks if "accessRights" is in included["access"] (true) -> returns true
 *
 * For location "accessibility.access.deliveryLeadTime":
 * - "deliveryLeadTime" is NOT in included["access"] -> returns false
 */
export function isLocationIncluded(
    location: string | undefined,
    included: Record<string, string[]> | undefined
): boolean {
    if (!location || !included) {
        return true;
    }

    const segments = location.split(".");

    for (let i = 0; i < segments.length - 1; i++) {
        const parent = segments[i];
        const child = segments[i + 1];

        const allowedChildren = included[parent];
        if (Array.isArray(allowedChildren)) {
            if (!allowedChildren.includes(child)) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Helper to look up property metadata overrides from semanticSchema
 * by checking top-level properties and relevant $defs.
 */
export function getSemanticPropertyOverride(
    location: string,
    semanticSchema: Record<string, any>
): {
    title?: string;
    description?: string;
    guidance?: string;
    examples?: string[];
    required?: boolean;
} | null {
    if (!location || !semanticSchema) {
        return null;
    }

    const segments = location.split(".");
    const sectionRoot = segments[0];
    const canonicalSection = REVERSE_SECTION_MAP[sectionRoot] || sectionRoot;

    // Check 1: Top-level section guidance/title
    const isTopLevelSection =
        segments.length === 1 ||
        location === "Other.data.types" ||
        location === SECTION_MAP[canonicalSection];

    if (isTopLevelSection) {
        const prop = semanticSchema.properties?.[canonicalSection];
        if (prop) {
            return {
                title: prop.title,
                description: prop.description,
                guidance: prop.guidance,
            };
        }
        // Fallback for ERD if not in properties.erd but in $defs.Image
        if (
            canonicalSection === "erd" &&
            semanticSchema.$defs?.Image?.properties?.image
        ) {
            const imgProp = semanticSchema.$defs.Image.properties.image;
            return {
                guidance: imgProp.guidance,
            };
        }
    }

    // Check 2: Direct nested property in semanticSchema.properties
    let current = semanticSchema.properties?.[canonicalSection];
    if (current?.properties) {
        let found = true;
        for (let i = 1; i < segments.length; i++) {
            if (current.properties && current.properties[segments[i]]) {
                current = current.properties[segments[i]];
            } else {
                found = false;
                break;
            }
        }
        if (found && current) {
            return {
                title: current.title,
                description: current.description,
                guidance: current.guidance,
                examples: current.examples,
            };
        }
    }

    // Check 3: Check $defs corresponding to sections and sub-objects
    const defMap: Record<string, string> = {
        summary: "Summary",
        documentation: "Documentation",
        accessibility: "Accessibility",
        access: "Access",
        formatAndStandards: "FormatAndStandards",
        coverage: "Coverage",
        provenance: "Provenance",
        temporal: "Temporal",
        enrichmentAndLinkage: "EnrichmentAndLinkage",
        structuralMetadata: "StructuralMetadata",
        DataTable: "DataTable",
        DataColumn: "DataColumn",
        projectGrants: "Project",
        project: "Project",
        erd: "Image",
        image: "Image",
        organisation: "Organisation",
        dataCustodian: "Organisation",
    };

    const candidateKeys = [
        segments[1] ? defMap[segments[1]] : undefined,
        defMap[canonicalSection],
        defMap[sectionRoot],
    ].filter(Boolean) as string[];

    const lastSegment = segments[segments.length - 1];

    for (const defKey of candidateKeys) {
        const defObj = semanticSchema.$defs?.[defKey];
        if (defObj?.properties?.[lastSegment]) {
            const propDef = defObj.properties[lastSegment];
            return {
                title: propDef.title,
                description: propDef.description,
                guidance: propDef.guidance,
                examples: propDef.examples,
            };
        }
    }

    // Check Organisation def for dataCustodian fields
    if (location.includes("dataCustodian.")) {
        const lastSegment = segments[segments.length - 1];
        const orgDef = semanticSchema.$defs?.Organisation;
        if (orgDef?.properties?.[lastSegment]) {
            const propDef = orgDef.properties[lastSegment];
            return {
                title: propDef.title,
                description: propDef.description,
                guidance: propDef.guidance,
                examples: propDef.examples,
            };
        }
    }

    return null;
}

/**
 * Enriches and filters formHydrationData dynamically using semanticSchema.json:
 * 1. Removes any section not in semanticSchema.visibleSections (via SECTION_MAP).
 * 2. Removes any sub-section/field whose location violates semanticSchema.included.
 * 3. Enriches guidance, description, title, and placeholders from semanticSchema.
 * 4. Deduplicates version field.
 * 5. Synchronizes data.validation so dropped fields do not trigger invisible errors.
 */
export function enrichFormHydration(
    baseFormJSON: FormHydrationSchema,
    semanticSchema: Record<string, any>
): FormHydrationSchema {
    if (!semanticSchema || !baseFormJSON?.schema_fields) {
        return baseFormJSON;
    }

    const visibleSections = semanticSchema.visibleSections || [];
    const included = semanticSchema.included || {};

    // Build the set of allowed root locations from visibleSections
    const allowedRootLocations = new Set<string>();
    visibleSections.forEach((secKey: string) => {
        const mappedRoot = SECTION_MAP[secKey];
        if (mappedRoot) {
            allowedRootLocations.add(mappedRoot);
        }
    });

    // Filter schema_fields
    const filteredFields: FormHydration[] = [];

    for (const field of baseFormJSON.schema_fields) {
        const location = field.location ?? "";
        const rootLocation = location.split(".")[0];

        // Step 1: Check section visibility
        const isSystemMetadata = SYSTEM_METADATA_LOCATIONS.has(rootLocation);
        const isVisibleSection = allowedRootLocations.has(rootLocation);

        if (!isSystemMetadata && !isVisibleSection) {
            continue; // Dropped: Section not in visibleSections
        }

        // Step 2: Check sub-section filtering (included)
        if (!isSystemMetadata && !isLocationIncluded(location, included)) {
            continue; // Dropped: Not in included list for this section
        }

        // Step 3: Handle array fields with nested sub-fields
        let fieldCopy = { ...field };
        if (fieldCopy.is_array_form && Array.isArray(fieldCopy.fields)) {
            const filteredSubFields = fieldCopy.fields.filter(sub =>
                isLocationIncluded(sub.location, included)
            );
            fieldCopy.fields = filteredSubFields;
        }

        // Step 4: Enrich with overrides from semanticSchema
        const override = getSemanticPropertyOverride(location, semanticSchema);
        if (override) {
            if (override.title) {
                fieldCopy.title = override.title;
                if (fieldCopy.field) {
                    fieldCopy.field = { ...fieldCopy.field, label: override.title };
                }
            }
            if (override.description !== undefined) {
                fieldCopy.description = override.description;
            }
            if (override.guidance !== undefined) {
                fieldCopy.guidance = override.guidance;
            }
            if (override.examples && override.examples.length > 0 && fieldCopy.field) {
                fieldCopy.field = {
                    ...fieldCopy.field,
                    placeholder: override.examples.join(", "),
                };
            }
        }

        filteredFields.push(fieldCopy);
    }

    // Step 5: Synchronize validation rules to avoid invisible blockers
    const visibleFieldTitles = new Set(filteredFields.map(f => f.title));
    const synchronizedValidation: FormHydrationValidation[] = (
        baseFormJSON.validation || []
    ).filter(rule => visibleFieldTitles.has(rule.title));

    return {
        ...baseFormJSON,
        schema_fields: filteredFields,
        validation: synchronizedValidation,
    };
}
