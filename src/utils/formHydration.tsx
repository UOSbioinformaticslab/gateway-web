import {
    Control,
    FieldValues,
    UseFormClearErrors,
    UseFormGetValues,
    UseFormTrigger,
} from "react-hook-form";
import dayjs from "dayjs";
import { get, isArray, isEmpty, isObject, set } from "lodash";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { Metadata, Revision } from "@/interfaces/Dataset";
import { FileUploadFields } from "@/interfaces/FileUpload";
import {
    FormHydration,
    FormHydrationField,
    FormHydrationValidation,
} from "@/interfaces/FormHydration";
import { LegendItem, LegendStatus } from "@/interfaces/FormLegend";
import InputWrapper from "@/components/InputWrapper";
import { inputComponents } from "@/config/forms";
import {
    INITIAL_FORM_SECTION,
    SUBMISSON_FORM_SECTION,
} from "@/consts/createDataset";
import { getLastSplitPart } from "./string";

type FormValues = Record<string, unknown>;

const formGetAllSectionFields = (
    schemaFields: FormHydration[] | undefined,
    section: string
) =>
    (schemaFields ?? [])
        .filter(schemaField => !schemaField.field?.hidden)
        .filter(({ location }) => location && location.startsWith(section));

const formSectionHasAllEmptyFields = (
    schemaFields: FormHydration[],
    section: string,
    getValues: UseFormGetValues<FieldValues>,
    dirtyFields: Partial<FieldValues>
) => {
    const allSectionFields = formGetAllSectionFields(schemaFields, section).map(
        field => field.title
    );
    const hasDirtyFields = Object.keys(dirtyFields).some(key =>
        allSectionFields.some(item => item.includes(key))
    );

    if (!hasDirtyFields) {
        return true;
    }

    return getValues(allSectionFields).every(value =>
        Array.isArray(value)
            ? value.every(obj => Object.values(obj).every(val => val == null))
            : value == null
    );
};

const formGetFieldsCompletedCount = (
    schemaFields: FormHydration[] | undefined,
    getValues: UseFormGetValues<FieldValues>,
    optionalFieldsOnly: boolean
) => {
    const fields = schemaFields ?? [];
    let fieldCount = 0;
    let fieldsWithValue = 0;

    // Filter out hidden fields and any array fields
    const allFields = fields
        .filter(
            schemaField =>
                !schemaField.field?.hidden &&
                (optionalFieldsOnly
                    ? !schemaField.field?.required
                    : schemaField.field?.required) &&
                !schemaField?.is_array_form
        )
        .map(field => field.title);

    fieldCount += allFields.length;

    const fieldValues = getValues(allFields);

    if (allFields && fieldValues) {
        const nonEmptyCount = fieldValues.filter(
            value => value !== null && !isEmpty(value)
        ).length;

        fieldsWithValue = nonEmptyCount;
    }

    const arrayFields = fields.filter(
        schemaField => schemaField?.is_array_form
    );

    // Handle field array counts
    arrayFields.forEach(array => {
        const arrayEntries = getValues(array.title);
        const arraySubFields = array.fields
            ?.filter(field =>
                optionalFieldsOnly
                    ? !field.field?.required
                    : field.field?.required
            )
            ?.map(field => field.title);

        if (arrayEntries && arraySubFields) {
            fieldCount += arraySubFields.length * arrayEntries.length;
            fieldsWithValue += arrayEntries.reduce(
                (totalCount: number, obj: { [x: string]: unknown }) => {
                    return (
                        totalCount +
                        arraySubFields.filter(field => obj[field]).length
                    );
                },
                0
            );
        }
    });

    return fieldCount === 0 ? 0 : Math.round((fieldsWithValue / fieldCount) * 100);
};

const formSectionHasEmptyOptionalFields = (
    schemaFields: FormHydration[],
    section: string,
    getValues: UseFormGetValues<FieldValues>
): boolean => {
    const allSectionFields = formGetAllSectionFields(schemaFields, section);
    const isArrayForm = allSectionFields[0]?.is_array_form;
    const fields = isArrayForm ? allSectionFields[0].fields! : allSectionFields;

    const optionalFields = fields
        ?.filter(schemaField => !schemaField.field?.required)
        .map(schemaField => schemaField.title);

    return isArrayForm
        ? getValues(allSectionFields[0].title)?.some((item: FieldValues) =>
              optionalFields?.every(
                  field => item[field] == null || item[field] === ""
              )
          )
        : getValues(optionalFields).some(
              value => value == null || value === ""
          );
};

const formGetSectionStatus = (
    isSectionActive: boolean,
    isSectionValid: boolean,
    schemaFields: FormHydration[],
    section: string,
    getValues: UseFormGetValues<FieldValues>,
    submissionRequested: boolean,
    dirtyFields: Partial<FieldValues>
) => {
    if (isSectionActive) {
        return LegendStatus.ACTIVE;
    }
    if (
        (!submissionRequested &&
            formSectionHasAllEmptyFields(
                schemaFields,
                section,
                getValues,
                dirtyFields
            )) ||
        section === INITIAL_FORM_SECTION ||
        section === SUBMISSON_FORM_SECTION
    ) {
        return LegendStatus.UNTOUCHED;
    }
    if (!isSectionValid) {
        return LegendStatus.INVALID;
    }
    if (formSectionHasEmptyOptionalFields(schemaFields, section, getValues)) {
        return LegendStatus.OPTIONAL_REMAIN;
    }
    return LegendStatus.VALID;
};

const formValidateSection = async (
    schemaFields: FormHydration[],
    section: string,
    trigger: UseFormTrigger<FieldValues>
) => {
    const allSectionFields = formGetAllSectionFields(schemaFields, section);
    const isArrayForm = allSectionFields[0]?.is_array_form;
    const rawFields = isArrayForm
        ? [allSectionFields[0]?.title]
        : allSectionFields
              .filter(schemaField => !schemaField?.field?.hidden)
              .map(field => field.title);
    const fields = rawFields.filter(
        (name): name is string => name != null && typeof name === "string"
    );

    if (fields.length === 0) return true;
    return await trigger(fields, { shouldFocus: false });
};

const formIsSectionActive = (section: string, activeSectionName: string) =>
    section === activeSectionName;

const hasVisibleFieldsForLocation = (
    schemaFields: FormHydration[] | undefined,
    location: string
): boolean => {
    const fields = schemaFields ?? [];
    const fieldsForLocation = fields
        .filter(field => field.location)
        .filter(field => field.location?.startsWith(location))
        .some(field => !field?.field?.hidden);
    return fieldsForLocation;
};

const formGenerateLegendItems = async (
    formSections: string[],
    activeSectionName: string,
    shouldValidate: boolean,
    schemaFields: FormHydration[],
    clearErrors: UseFormClearErrors<FieldValues>,
    getValues: UseFormGetValues<FieldValues>,
    trigger: UseFormTrigger<FieldValues>,
    submissionRequested: boolean,
    dirtyFields: Partial<FieldValues>
) => {
    const legendItems: LegendItem[] = await Promise.all(
        formSections.map(async section => {
            const sectionIsValid = shouldValidate
                ? await formValidateSection(schemaFields, section, trigger)
                : false;

            // Reset form error state
            if (!submissionRequested) {
                clearErrors();
            }

            // Get status of section
            const getSectionStatus = formGetSectionStatus(
                formIsSectionActive(section, activeSectionName),
                sectionIsValid,
                schemaFields,
                section,
                getValues,
                submissionRequested,
                dirtyFields
            );

            return {
                name: section,
                label:
                    section === ASSOCIATED_PROJECT_GRANTS_SECTION
                        ? schemaFields.find(
                              field =>
                                  field.location ===
                                  ASSOCIATED_PROJECT_GRANTS_SECTION
                          )?.title
                        : section === "Other"
                        ? schemaFields.find(
                              field => field.location === "Other.data.types"
                          )?.title
                        : section === ENTITY_RELATIONSHIP_DIAGRAM_SECTION
                          ? schemaFields.find(
                                field =>
                                    field.location ===
                                    ENTITY_RELATIONSHIP_DIAGRAM_SECTION
                            )?.title
                          : section === COVERAGE_SECTION
                            ? schemaFields.find(
                                  field => field.location === COVERAGE_SECTION
                              )?.title
                            : section === PROVENANCE_SECTION
                              ? schemaFields.find(
                                    field =>
                                        field.location === PROVENANCE_SECTION
                                )?.title
                              : section === ACCESSIBILITY_SECTION
                                ? schemaFields.find(
                                      field =>
                                          field.location ===
                                          ACCESSIBILITY_SECTION
                                  )?.title
                                : section === TOOLS_AND_PUBLICATIONS_SECTION
                                  ? schemaFields.find(
                                        field =>
                                            field.location ===
                                            TOOLS_AND_PUBLICATIONS_SECTION
                                    )?.title
                                  : section === OBSERVATIONS_SECTION
                                    ? schemaFields
                                          .find(
                                              field =>
                                                  field.location ===
                                                  OBSERVATIONS_SECTION
                                          )
                                          ?.title?.replace(" Array", "")
                                    : section === DEMOGRAPHIC_FREQUENCY_SECTION
                                      ? schemaFields.find(
                                            field =>
                                                field.location ===
                                                DEMOGRAPHIC_FREQUENCY_SECTION
                                        )?.title
                                      : section === OMICS_SECTION
                                        ? schemaFields.find(
                                              field =>
                                                  field.location ===
                                                  OMICS_SECTION
                                          )?.title
                                        : undefined,
                status: getSectionStatus,
            };
        })
    );

    return legendItems;
};

const isFirstSection = (currentSectionIndex: number) =>
    currentSectionIndex === 0;

const isLastSection = (formSections: string[], currentSectionIndex: number) =>
    formSections.length - 1 <= currentSectionIndex;

const getFirstLocationValues = (schemaFields: FormHydration[] | undefined) => {
    const fields = schemaFields ?? [];
    const locationSet = new Set<string>(
        fields
            .filter(field => field.location)
            .map(({ location }) => location.split(".")[0])
    );

    return Array.from(locationSet);
};

const getFormHydrationFieldHeaderProps = ({
    title,
    description,
    field,
}: {
    title: string;
    description?: string | null;
    field?: { label?: string | null };
}) => {
    const trimmedDescription = description?.trim();

    if (!trimmedDescription) {
        return { show: false as const, title, description: undefined };
    }

    const trimmedLabel = field?.label?.trim();

    return {
        show: true as const,
        title,
        description:
            trimmedLabel && trimmedDescription === trimmedLabel
                ? undefined
                : trimmedDescription,
    };
};

const ASSOCIATED_PROJECT_GRANTS_SECTION = "Associated Project Grants";
const ENTITY_RELATIONSHIP_DIAGRAM_SECTION = "Entity Relationship Diagram";
const COVERAGE_SECTION = "coverage";
const PROVENANCE_SECTION = "provenance";
const ACCESSIBILITY_SECTION = "accessibility";
const TOOLS_AND_PUBLICATIONS_SECTION = "enrichmentAndLinkage";
const OBSERVATIONS_SECTION = "observations";
const DEMOGRAPHIC_FREQUENCY_SECTION = "demographicFrequency";
const OMICS_SECTION = "omics";

const SUMMARY_SECTION = "summary";
const DOCUMENTATION_SECTION = "documentation";
const SUMMARY_DATA_CUSTODIAN_PREFIX = `${SUMMARY_SECTION}.dataCustodian.`;

const SUMMARY_DATA_CUSTODIAN_ACCORDION_LOCATIONS = new Set([
    `${SUMMARY_DATA_CUSTODIAN_PREFIX}identifier`,
    `${SUMMARY_DATA_CUSTODIAN_PREFIX}name`,
    `${SUMMARY_DATA_CUSTODIAN_PREFIX}description`,
]);

const isPanelOnlyFormField = (location?: string) =>
    location?.startsWith(`${ASSOCIATED_PROJECT_GRANTS_SECTION}.`) ||
    location?.startsWith(`${ENTITY_RELATIONSHIP_DIAGRAM_SECTION}.`) ||
    location?.startsWith(`${COVERAGE_SECTION}.`) ||
    location?.startsWith(`${PROVENANCE_SECTION}.`) ||
    location?.startsWith(`${ACCESSIBILITY_SECTION}.`) ||
    location?.startsWith(`${TOOLS_AND_PUBLICATIONS_SECTION}.`) ||
    location === OBSERVATIONS_SECTION ||
    location?.startsWith(`${OBSERVATIONS_SECTION}.`) ||
    location?.startsWith(`${SUMMARY_SECTION}.`) ||
    location?.startsWith(`${DOCUMENTATION_SECTION}.`) ||
    location?.startsWith(`${OMICS_SECTION}.`);

const isSummaryDataCustodianAccordionField = (location?: string) =>
    !!location && SUMMARY_DATA_CUSTODIAN_ACCORDION_LOCATIONS.has(location);

const SUMMARY_STANDALONE_ACCORDION_LOCATIONS = new Set([
    `${SUMMARY_DATA_CUSTODIAN_PREFIX}contactPoint`,
    `${SUMMARY_SECTION}.keywords`,
    `${SUMMARY_SECTION}.datasetAliases`,
]);

const isSummaryStandaloneAccordionField = (location?: string) =>
    !!location && SUMMARY_STANDALONE_ACCORDION_LOCATIONS.has(location);

const DOCUMENTATION_STANDALONE_ACCORDION_LOCATIONS = new Set([
    `${DOCUMENTATION_SECTION}.associatedMedia`,
]);

const isDocumentationStandaloneAccordionField = (location?: string) =>
    !!location && DOCUMENTATION_STANDALONE_ACCORDION_LOCATIONS.has(location);

const getAssociatedProjectGrantsGuidance = (
    schemaFields: FormHydration[]
) =>
    schemaFields.find(
        ({ location }) => location === ASSOCIATED_PROJECT_GRANTS_SECTION
    )?.guidance;

const getSummarySectionHeaderProps = (schemaFields: FormHydration[]) => {
    const summarySection = schemaFields.find(
        ({ location }) => location === SUMMARY_SECTION
    );

    if (!summarySection) {
        return null;
    }

    return getFormHydrationFieldHeaderProps(summarySection);
};

const getSummarySectionGuidance = (schemaFields: FormHydration[]) =>
    schemaFields.find(({ location }) => location === SUMMARY_SECTION)?.guidance;

const getDocumentationSectionHeaderProps = (schemaFields: FormHydration[]) => {
    const documentationSection = schemaFields.find(
        ({ location }) => location === DOCUMENTATION_SECTION
    );

    if (!documentationSection) {
        return null;
    }

    return getFormHydrationFieldHeaderProps(documentationSection);
};

const getDocumentationSectionGuidance = (schemaFields: FormHydration[]) =>
    schemaFields.find(({ location }) => location === DOCUMENTATION_SECTION)
        ?.guidance;

const getEntityRelationshipDiagramSectionHeaderProps = (
    schemaFields: FormHydration[]
) => {
    const entityRelationshipDiagramSection = schemaFields.find(
        ({ location }) => location === ENTITY_RELATIONSHIP_DIAGRAM_SECTION
    );

    if (!entityRelationshipDiagramSection) {
        return null;
    }

    return getFormHydrationFieldHeaderProps(entityRelationshipDiagramSection);
};

const getCoverageSectionHeaderProps = (schemaFields: FormHydration[]) => {
    const coverageSection = schemaFields.find(
        ({ location }) => location === COVERAGE_SECTION
    );

    if (!coverageSection) {
        return null;
    }

    return getFormHydrationFieldHeaderProps(coverageSection);
};

const getCoverageSectionGuidance = (schemaFields: FormHydration[]) =>
    schemaFields.find(({ location }) => location === COVERAGE_SECTION)?.guidance;

const getDatasetTimelinesSectionGuidance = (schemaFields: FormHydration[]) =>
    schemaFields.find(({ location }) => location === PROVENANCE_SECTION)?.guidance;

const getAccessibilitySectionHeaderProps = (schemaFields: FormHydration[]) => {
    const accessibilitySection = schemaFields.find(
        ({ location }) => location === ACCESSIBILITY_SECTION
    );

    if (!accessibilitySection) {
        return null;
    }

    return getFormHydrationFieldHeaderProps(accessibilitySection);
};

const getAccessibilitySectionGuidance = (schemaFields: FormHydration[]) =>
    schemaFields.find(({ location }) => location === ACCESSIBILITY_SECTION)
        ?.guidance;

const getToolsAndPublicationsSectionHeaderProps = (
    schemaFields: FormHydration[]
) => {
    const toolsAndPublicationsSection = schemaFields.find(
        ({ location }) => location === TOOLS_AND_PUBLICATIONS_SECTION
    );

    if (!toolsAndPublicationsSection) {
        return null;
    }

    return getFormHydrationFieldHeaderProps(toolsAndPublicationsSection);
};

const getToolsAndPublicationsSectionGuidance = (schemaFields: FormHydration[]) =>
    schemaFields.find(
        ({ location }) => location === TOOLS_AND_PUBLICATIONS_SECTION
    )?.guidance;

const getObservationsSectionHeaderProps = (schemaFields: FormHydration[]) => {
    const observationsSection = schemaFields.find(
        ({ location }) => location === OBSERVATIONS_SECTION
    );

    if (!observationsSection) {
        return null;
    }

    return getFormHydrationFieldHeaderProps({
        ...observationsSection,
        title: observationsSection.title.replace(" Array", ""),
    });
};

const getObservationsSectionGuidance = (schemaFields: FormHydration[]) =>
    schemaFields.find(({ location }) => location === OBSERVATIONS_SECTION)
        ?.guidance;

const getDemographicFrequencySectionHeaderProps = (
    schemaFields: FormHydration[]
) => {
    const section = schemaFields.find(
        ({ location }) => location === DEMOGRAPHIC_FREQUENCY_SECTION
    );

    if (!section) {
        return null;
    }

    return getFormHydrationFieldHeaderProps(section);
};

const getDemographicFrequencySectionGuidance = (
    schemaFields: FormHydration[]
) =>
    schemaFields.find(
        ({ location }) => location === DEMOGRAPHIC_FREQUENCY_SECTION
    )?.guidance;

const getOmicsSectionHeaderProps = (schemaFields: FormHydration[]) => {
    const section = schemaFields.find(
        ({ location }) => location === OMICS_SECTION
    );

    if (!section) {
        return null;
    }

    return getFormHydrationFieldHeaderProps(section);
};

const getOmicsSectionGuidance = (schemaFields: FormHydration[]) =>
    schemaFields.find(({ location }) => location === OMICS_SECTION)?.guidance;

const isDemographicBreakdownArray = (location?: string) =>
    location === "demographicFrequency.age" ||
    location === "demographicFrequency.ethnicity";

const getDemographicBreakdownBinOptions = (
    fieldParent: FormHydration
): string[] => {
    const binField = fieldParent.fields?.find(field =>
        field.location?.endsWith(".bin")
    );

    return (binField?.field?.options ?? []).map(option => String(option.value));
};

const getDemographicBreakdownFieldTitles = (fieldParent: FormHydration) => {
    const binField = fieldParent.fields?.find(field =>
        field.location?.endsWith(".bin")
    );
    const countField = fieldParent.fields?.find(field =>
        field.location?.endsWith(".count")
    );

    return {
        binTitle: binField?.title ?? "",
        countTitle: countField?.title ?? "",
        countField: countField?.field,
    };
};

const buildDemographicBreakdownRows = (
    fieldParent: FormHydration,
    existingRows: Record<string, unknown>[] = []
) => {
    const options = getDemographicBreakdownBinOptions(fieldParent);
    const { binTitle, countTitle } =
        getDemographicBreakdownFieldTitles(fieldParent);

    return options.map(option => {
        const match = existingRows.find(row => row[binTitle] === option);

        return {
            [binTitle]: option,
            [countTitle]: match?.[countTitle] ?? "",
        };
    });
};

const getWelcomeSectionGuidance = (schemaFields: FormHydration[]) =>
    schemaFields.find(({ location }) => location === INITIAL_FORM_SECTION)
        ?.guidance;

const withFormHydrationFieldPanelContent = (
    field: FormHydrationField,
    fieldParent: Pick<FormHydration, "title" | "description" | "field">
): FormHydrationField => {
    const header = getFormHydrationFieldHeaderProps(fieldParent);

    if (!header.show) {
        return field;
    }

    const description = fieldParent.description?.trim();

    return {
        ...field,
        ...(description && !field.info ? { info: description } : {}),
    };
};

const withFormHydrationPanelOnlyFieldContent = (
    field: FormHydrationField,
    fieldParent: Pick<FormHydration, "title" | "description" | "field">
): FormHydrationField => {
    const title = fieldParent.title?.trim();
    const description = fieldParent.description?.trim();

    return {
        ...field,
        ...(title ? { label: title } : {}),
        ...(description && !field.info ? { info: description } : {}),
    };
};

const renderFormHydrationField = (
    { name, required, component, placeholder, ...rest }: FormHydrationField,
    control: Control<FormValues>,
    nameOverride?: string,
    setActiveField?: (fieldName: string) => void,
    fileUploadFields?: FileUploadFields
) => {
    const componentType = inputComponents[component as ComponentTypes];
    const {
        options,
        selectOnFocus: _selectOnFocus,
        clearOnBlur: _clearOnBlur,
        handleHomeEndKeys: _handleHomeEndKeys,
        ...safeRest
    } = rest;

    if (!componentType) {
        return null;
    }

    const fieldOptions = options ?? [];

    const autocompleteOnlyProps =
        component === "Autocomplete"
            ? {
                  options: fieldOptions,
                  selectOnFocus: true,
                  clearOnBlur: true,
                  handleHomeEndKeys: true,
                  multiple: true,
                  isOptionEqualToValue: (
                      option: {
                          value: string | number;
                          label: string;
                      },
                      value: string | number
                  ) => option.value === value,
                  getChipLabel: (
                      options: {
                          value: string | number;
                          label: string;
                      }[],
                      selectedOption: {
                          value: string | number;
                          label: string;
                      }
                  ) =>
                      options.find(option => option === selectedOption)?.label ||
                      selectedOption?.value ||
                      selectedOption,
              }
            : {};

    const selectOnlyProps =
        component === "Select" ? { options: fieldOptions } : {};

    return (
        <InputWrapper
            name={nameOverride || name}
            key={nameOverride || name}
            placeholder={placeholder || ""}
            component={componentType}
            required={required}
            control={control}
            showClearButton={false}
            canCreate={component === "Autocomplete" && !fieldOptions.length}
            {...autocompleteOnlyProps}
            {...selectOnlyProps}
            onFocus={() => setActiveField && setActiveField(name)}
            {...safeRest}
            label={(safeRest.label as string | undefined) ?? name ?? ""}
            {...fileUploadFields}
        />
    );
};

const formatValidationItems = (items: Partial<FormHydrationValidation>[]) => ({
    type: "object",
    properties: items
        .filter(item => item !== null)
        .reduce(
            (acc, { title, ...rest }) => ({
                ...acc,
                [title as string]: rest,
            }),
            []
        ),
});

const convertRevisionsToArray = (data: {
    revisions: Revision | Revision[] | null;
}) => {
    return {
        ...data,
        revisions: Array.isArray(data.revisions)
            ? data.revisions
            : data.revisions
            ? [data.revisions]
            : [],
    };
};

const mapFormFieldsForSubmission = (
    formData: Metadata,
    schemaFields: FormHydration[]
) => {
    // Create a dictionary to map titles to locations using reduce
    const mappedSchemaFields = schemaFields.reduce(
        (
            acc: { [key: string]: string },
            { title, location, is_array_form, fields }
        ) => {
            if (is_array_form) {
                fields?.forEach(field => {
                    acc[field.title] = getLastSplitPart(field.location!, ".");
                });
            }

            acc[title] = location || "";
            return acc;
        },
        {}
    );

    const parentField = (title: string) =>
        schemaFields.find(field => field.title === title);

    // Transform the data object using Object.entries and reduce
    const transformedObject = Object.entries(formData).reduce(
        (acc: { [key: string]: string }, [key, value]) => {
            if (mappedSchemaFields[key]) {
                if (parentField(key)?.is_array_form) {
                    const fieldParent = parentField(key);
                    const arrayEntries = isDemographicBreakdownArray(
                        fieldParent?.location
                    )
                        ? (value as Record<string, unknown>[]).filter(entry => {
                              const countTitle = fieldParent?.fields?.find(
                                  field => field.location?.endsWith(".count")
                              )?.title;
                              const count = countTitle
                                  ? entry[countTitle]
                                  : undefined;

                              return (
                                  count !== "" &&
                                  count !== null &&
                                  count !== undefined
                              );
                          })
                        : value;

                    arrayEntries.forEach(
                        (entry: { [x: string]: string }, index: number) => {
                            const arrayLocation = fieldParent?.location;

                            Object.keys(entry).forEach(entryKey => {
                                acc[
                                    `${arrayLocation}.${index}.${mappedSchemaFields[entryKey]}`
                                ] = entry[entryKey];
                            });
                        }
                    );
                } else {
                    acc[mappedSchemaFields[key]] = value;
                }
            }
            return acc;
        },
        {}
    );

    // Use a utility function to set nested properties
    const formattedFormData = {};

    Object.entries(transformedObject).forEach(([key, value]) => {
        set(formattedFormData, key, value);
    });

    formattedFormData.provenance.origin.datasetType = formData[
        "Dataset Type Array"
    ].map(item => ({
        name: item["Dataset type"],
        subTypes: item["Dataset subtypes"] ?? [],
    }));
    const cleanUndefinedObjects = (
        obj: Record<string, unknown>
    ): Record<string, unknown> | undefined => {
        const newObj = { ...obj };
        Object.keys(newObj).forEach(key => {
            const value = newObj[key];
            if (
                value &&
                typeof value === "object" &&
                !Array.isArray(value) &&
                !(value instanceof Date)
            ) {
                if (Object.values(value).every(val => val === undefined)) {
                    newObj[key] = null;
                }
            }
        });
        return newObj;
    };
    // this makes sure that any nested objects are not left as {}
    // - the schema needs them as either null or filled to be valid
    const cleanedFormattedFormData = cleanUndefinedObjects(
        formattedFormData
    ) as {
        revisions: Revision | Revision[] | null;
    };

    return convertRevisionsToArray(cleanedFormattedFormData);
};

const mapExistingDatasetToFormFields = (
    schema: FormHydration[],
    metadata: Metadata
) => {
    const values = {};

    // Function to recursively traverse the schema
    function traverseSchema(
        schema: FormHydration[] | FormHydration,
        currentPath?: string
    ): void {
        if (isArray(schema)) {
            schema.forEach(item => {
                traverseSchema(item, currentPath);
            });
        } else if (isObject(schema)) {
            // If schema is an object with a field location
            const { location, is_array_form, field, title } = schema;
            const fullPath = currentPath
                ? `${currentPath}.${location}`
                : location || "";

            if (is_array_form) {
                // Handle array form case
                const defaultValue = get(metadata, fullPath, []);

                if (isArray(defaultValue)) {
                    const test = defaultValue.map((item, index) => {
                        const itemValues = {};

                        // Map fields of each item in the array
                        schema?.fields?.forEach(fieldSchema => {
                            const fieldLocation =
                                fieldSchema?.location?.split(".");
                            const requiredLocation =
                                fieldLocation?.[fieldLocation.length - 1];

                            const defaultValue = get(
                                metadata,
                                `${fullPath}.${index}.${requiredLocation}`,
                                null
                            );

                            const { field } = fieldSchema;
                            if (
                                defaultValue &&
                                field?.component === inputComponents.DatePicker
                            ) {
                                return set(
                                    itemValues,
                                    fieldSchema.title,
                                    dayjs(defaultValue)
                                );
                            }

                            if (
                                field?.component ===
                                    inputComponents.Autocomplete &&
                                !isArray(defaultValue)
                            ) {
                                return set(values, title, []);
                            }

                            return set(
                                itemValues,
                                fieldSchema.title,
                                defaultValue
                            );
                        });
                        return itemValues;
                    });

                    set(values, title, test);
                }
            } else {
                // Handle non-array form case
                const defaultValue = get(metadata, fullPath);

                if (
                    defaultValue &&
                    field?.component === inputComponents.DatePicker
                ) {
                    set(values, title, dayjs(defaultValue));
                } else if (
                    field?.component === inputComponents.Autocomplete &&
                    !isArray(defaultValue)
                ) {
                    set(values, title, []);
                } else if (fullPath.includes("revisions")) {
                    const revisions = get(metadata, "revisions");
                    const latestRevision = revisions?.[revisions.length - 1];

                    if (latestRevision) {
                        switch (fullPath) {
                            case "revisions.version":
                                set(
                                    values,
                                    "revision version",
                                    latestRevision.version
                                );
                                break;
                            default:
                                set(values, "revision url", latestRevision.url);
                                break;
                        }
                    }
                } else {
                    set(values, title, defaultValue);
                }
            }

            // Recursively traverse nested fields
            if (schema.fields) {
                traverseSchema(schema.fields, fullPath);
            }
        }
    }

    // Start traversal from the root of the schema
    traverseSchema(schema);

    schema.forEach(field => {
        if (!isDemographicBreakdownArray(field.location)) {
            return;
        }

        const existingRows = get(values, field.title, []) as Record<
            string,
            unknown
        >[];

        set(
            values,
            field.title,
            buildDemographicBreakdownRows(field, existingRows)
        );
    });

    return values as Metadata;
};

export {
    formGetAllSectionFields,
    formGetSectionStatus,
    formSectionHasAllEmptyFields,
    formSectionHasEmptyOptionalFields,
    formGenerateLegendItems,
    formValidateSection,
    isLastSection,
    isFirstSection,
    getFirstLocationValues,
    hasVisibleFieldsForLocation,
    getFormHydrationFieldHeaderProps,
    isPanelOnlyFormField,
    isSummaryDataCustodianAccordionField,
    isSummaryStandaloneAccordionField,
    isDocumentationStandaloneAccordionField,
    getAssociatedProjectGrantsGuidance,
    getSummarySectionHeaderProps,
    getSummarySectionGuidance,
    getDocumentationSectionHeaderProps,
    getDocumentationSectionGuidance,
    getEntityRelationshipDiagramSectionHeaderProps,
    getCoverageSectionHeaderProps,
    getCoverageSectionGuidance,
    getDatasetTimelinesSectionGuidance,
    getAccessibilitySectionHeaderProps,
    getAccessibilitySectionGuidance,
    getToolsAndPublicationsSectionHeaderProps,
    getToolsAndPublicationsSectionGuidance,
    getObservationsSectionHeaderProps,
    getObservationsSectionGuidance,
    getDemographicFrequencySectionHeaderProps,
    getDemographicFrequencySectionGuidance,
    getOmicsSectionHeaderProps,
    getOmicsSectionGuidance,
    isDemographicBreakdownArray,
    getDemographicBreakdownBinOptions,
    getDemographicBreakdownFieldTitles,
    buildDemographicBreakdownRows,
    getWelcomeSectionGuidance,
    withFormHydrationFieldPanelContent,
    withFormHydrationPanelOnlyFieldContent,
    renderFormHydrationField,
    formatValidationItems,
    formGetFieldsCompletedCount,
    mapFormFieldsForSubmission,
    mapExistingDatasetToFormFields,
};
