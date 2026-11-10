# Semantic Schema Integration Analysis

**Repository Context**: `ayo/gateway-web`  
**Reference Schema Repository**: [`git@github.com:UOSbioinformaticslab/cruk-semantic-schema.git`](https://github.com/UOSbioinformaticslab/cruk-semantic-schema)  
**Date**: 2026-11-09  

---

## 1. Executive Summary

This document evaluates how dataset metadata displays, upload forms, and live previews are hydrated across the CRUK Data Hub platform repositories:
- **Prototype Sandbox**: `CRUK_datahub_landing_page`
- **Production Application**: `ayo/gateway-web`
- **Canonical Semantic Schema Repository**: [`git@github.com:UOSbioinformaticslab/cruk-semantic-schema.git`](https://github.com/UOSbioinformaticslab/cruk-semantic-schema) (npm package: `cruk-semantic-schema`)

### Key Finding
> **`gateway-web` does NOT currently use `semanticSchema` or dynamic schema deep-merging for its dataset detail page (`/dataset/[datasetId]`) or its create form.**  
> In `gateway-web`, section definitions, field paths, labels, and tooltips are **statically hard-coded** in TypeScript (`config.tsx` and `DatasetContent.tsx`). The package `cruk-semantic-schema` is not installed as a dependency in `gateway-web`.

---

## 2. Detailed Technical Comparison

### 2.1. Dataset Display Page: `meta.html` vs `/dataset/[datasetId]`

| Dimension | `CRUK_datahub_landing_page` (`meta.html`) | `ayo/gateway-web` (`/dataset/[datasetId]`) |
| :--- | :--- | :--- |
| **Component Entry** | `MetaDataPage.jsx` / `DatasetDetailsContent` | `page.tsx` $\rightarrow$ `DatasetContent.tsx` |
| **Data Source** | `basic_backend` `/datasets/{id}` (`metadata_blob`) | HDRUK Gateway API v2 `/datasets/v2/{id}` (`x-gwdm-version: 2.1`) |
| **Schema Ingestion** | Reads saved `metadata_blob` JSON produced by `SchemaPage.jsx` | Calls `getDataset(id, "CRUK", "1.0.0")` |
| **`semanticSchema` Used?** | **No** (Direct schema parsing is in `SchemaPage.jsx`; `meta.html` is data-conditional) | **No** (Not imported, not installed) |
| **Field/Section Definitions** | Conditionally rendered JSX checking data existence (`hasData`) | Hardcoded TypeScript array in `config.tsx` (`datasetFields`) |
| **Section Filtering** | Dynamically hides navigation items if data is absent | Static `datasetFields` list; displays fallback text if empty |
| **Taxonomy Tag Derivation** | Dynamic lookup from `filterData` / `flattenedFilterData` | `FilterTags.tsx` component mapping stored tag IDs |

#### Does `meta.html` dynamically adapt?
- **It dynamically adapts to data presence, NOT to schema definitions.**
  - **What it does dynamically**: Sections and navigation links are conditionally rendered (`filter(item => item.hasData)`). If a dataset lacks "Omics" or "Demographics", those tabs and cards disappear. In the live upload preview (`PreviewMainContent.jsx`), it reactively re-renders as the user fills out the form.
  - **What it does NOT do dynamically**: Its layout, section titles, stat card labels ("Population", "Age Range", "Access"), and object paths are manually written in React JSX. If a new property is defined or renamed in `semanticSchema.json`, `meta.html` will **not** display it unless a developer writes explicit JSX for that property.

#### How `gateway-web` displays `/dataset/[datasetId]`
In `ayo/gateway-web/src/app/[locale]/(logged-out)/dataset/[datasetId]/page.tsx`:
1. It requests the dataset from Gateway API v2:
   ```typescript
   const data = await getDataset(datasetId, "CRUK", "1.0.0");
   ```
2. The UI sections, labels, tooltips, and object paths are imported from a static TypeScript file (`config.tsx`):
   ```typescript
   // config.tsx
   const datasetFields: DatasetSection[] = [
       { sectionName: "Project", fields: [] },
       {
           sectionName: "Summary",
           fields: [
               { path: "metadata.metadata.summary.abstract", type: FieldType.TEXT },
               { path: "metadata.metadata.summary.doiName", type: FieldType.TEXT, label: "DOI for dataset", ... }
           ]
       },
       { sectionName: "Documentation", fields: [ ... ] },
       { sectionName: "Structural Metadata", fields: [ ... ] },
       ...
   ];
   ```
3. `DatasetContent.tsx` walks `datasetFields` and extracts values using `lodash.get(data, field.path)`.
4. There is no call to Traser or `semanticSchema.json` for the detail view.

---

### 2.2. Upload Form & Ingestion: `upload.html` vs `/datasets/create`

| Dimension | `CRUK_datahub_landing_page` (`upload.html`) | `ayo/gateway-web` (`/datasets/create`) |
| :--- | :--- | :--- |
| **Component Entry** | `SchemaPage.jsx` | `CreateDataset.tsx` |
| **Schema Dependency** | `cruk-semantic-schema` (`git+https://...#main`) | Built-in static hydration (`localFormHydration.ts`) |
| **Schema Merging** | `deepMerge(crukSchema, OVERLAY_SCHEMA)` | None (section order hard-coded in `consts/createDataset.ts`) |
| **Field Hydration** | Dynamic field generation from merged JSON schema | Hybrid: Traser defs for types + static section components |
| **Live Preview** | Embedded `PreviewMainContent.jsx` with reactive `formData` | Submission summary screen (`SubmissionScreen.tsx`) |
| **Guidance & Overrides** | Dynamically pulled from `OVERLAY_SCHEMA` properties | Hard-coded guidance functions in `formHydration.tsx` |

In `CRUK_datahub_landing_page/src/components/SchemaPage.jsx`:
```javascript
import cruk_SCHEMA from '../utils/CRUKv.1.0.0.json';
import semanticSchema from 'cruk-semantic-schema';

// Utility: Deep Merge Schemas
const deepMerge = (target, source) => { ... };
const OVERLAY_SCHEMA = semanticSchema.properties ? semanticSchema : (semanticSchema.fullContent || semanticSchema);
const DATA_SCHEMA = deepMerge(cruk_SCHEMA, OVERLAY_SCHEMA);
```
This deep merge dynamically drives the form inputs, required field checklist, descriptions, and guidance.

In `ayo/gateway-web`, the section order in `src/consts/createDataset.ts` was manually patterned after `cruk-semantic-schema`, but the schema file itself is never imported:
```typescript
/** Matches visibleSections in cruk-semantic-schema (excluding welcome, prepended separately). */
const FORM_SECTION_ORDER = [
    "Dataset Version",
    "Associated Project Grants",
    "summary",
    ...
] as const;
```

---

## 3. Implications for Production Maintenance

1. **Schema Desynchronization**:
   - If updates are committed to [`cruk-semantic-schema`](https://github.com/UOSbioinformaticslab/cruk-semantic-schema) (e.g. updating guidance text, changing required fields, adding regex rules, or modifying included sub-sections), **`gateway-web` will not reflect them**.
   - Developers must manually locate and update the matching strings in `gateway-web`'s `config.tsx`, `formHydration.tsx`, and `CreateDataset.tsx`.
2. **Missing Live Preview in Production**:
   - The prototype's `upload.html` provides an interactive side-by-side preview (`PreviewMainContent.jsx` $\rightarrow$ `DatasetDetailsContent`) that re-renders in real-time as users type.
   - `gateway-web` has only an accordion-based wizard and a final `SubmissionScreen.tsx`, lacking a live rendered preview of the resulting public dataset page.

---

## 4. Canonical Repository Reference

All authoritative semantic schema modifications (overrides, guidance, required field rules, and schema doc viewer components) are maintained at:

- **Git Remote**: `git@github.com:UOSbioinformaticslab/cruk-semantic-schema.git`
- **GitHub URL**: [https://github.com/UOSbioinformaticslab/cruk-semantic-schema](https://github.com/UOSbioinformaticslab/cruk-semantic-schema)
- **Primary Artifacts**:
  - `semanticSchema.json`: Semantic overlay rules, property guidance, examples, format regexes, and included/visible sections.
  - `src/SchemaDocViewer.jsx`: Interactive schema documentation explorer component.
