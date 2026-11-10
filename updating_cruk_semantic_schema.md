# Updating CRUK Semantic Schema & Dynamic Form Hydration

This document provides a concise summary for Ayo and the frontend engineering team explaining:
1. **What has been done** to dynamically hydrate the dataset creation/edit form from `cruk-semantic-schema`.
2. **Why it was done** (architectural motivation & decoupling).
3. **How to pull and test schema updates** using `npm update cruk-semantic-schema`.
4. **The verification tests run** to ensure all sections and fields are dynamic.

---

## 1. Context & Motivation

Previously, the dataset creation form in `gateway-web` relied on static, hardcoded structures:
- Guidance text was largely static inside individual components (such as `DatasetFiltersGuidancePanel.tsx`) or locked in the legacy mock file `formData.js`.
- Section visibility and ordering were hardcoded in `createDataset.ts`.
- Field requirements and validation rules were fixed, meaning changes to domain requirements (e.g. adding pan-cancer filters, updating guidelines, hiding experimental sections) required manual code updates in `gateway-web`.

### The Solution:
We integrated **[`cruk-semantic-schema`](https://github.com/UOSBioinformaticslab/cruk-semantic-schema)** directly as a Git dependency (`#dev` branch). The baseline form data is now dynamically enriched on the fly via an enrichment engine (`semanticFormEnricher.ts`). 

Domain researchers can now update section order, visibility, field guidance, descriptions, and rules directly on GitHub, and the frontend updates seamlessly.

---

## 2. Key Architecture & File Changes

### 1. `src/utils/semanticFormEnricher.ts` (New Core Engine)
- **Section Mapping (`SECTION_MAP` & `REVERSE_SECTION_MAP`)**: Maps canonical semantic schema keys (`visibleSections`) to internal form locations (e.g. `datasetFilters` ➔ `Dataset Filters`, `otherDataTypes` ➔ `Other.data.types`, `erd` ➔ `Entity Relationship Diagram`).
- **Section Ordering**: `FORM_SECTION_ORDER` in `src/consts/createDataset.ts` is now dynamically derived from `semanticSchema.visibleSections`.
- **Inclusion & Pruning (`isLocationIncluded`)**: Prunes sub-accordions and fields according to `semanticSchema.included`.
- **Property & Definition Overrides (`getSemanticPropertyOverride`)**: Resolves titles, descriptions, markdown guidance, and placeholder examples from both:
  - Top-level `semanticSchema.properties` (including multi-segment roots like `Other.data.types`).
  - Schema definitions in `semanticSchema.$defs` (e.g. `$defs.Summary`, `$defs.Access`, `$defs.Temporal`, `$defs.FormatAndStandards`, `$defs.Project`, `$defs.Image`, `$defs.Organisation`).
- **Validation Synchronization**: Automatically cleans `data.validation` so fields dropped by `visibleSections` or `included` rules don't leave behind invisible orphaned validation blockers.

### 2. `src/utils/localFormHydration.ts`
- Imports `cruk-semantic-schema` directly and passes baseline data through `enrichFormHydration(formHydrationData, semanticSchema)`.

### 3. `src/app/api/form-hydration/route.ts`
- Added `"Cache-Control": "no-store, must-revalidate"` so schema updates pulled via npm appear immediately in the browser on page refresh without being held by a 1-hour cache.

### 4. `CreateDataset.tsx` & `DatasetFiltersGuidancePanel.tsx`
- **`DatasetFiltersGuidancePanel.tsx`**: Updated to accept a dynamic `guidance` prop and render rich text via `<MarkDownSanitizedWithHtml content={guidance} />` (with graceful fallback).
- **`CreateDataset.tsx`**: Wired `guidanceText` to all guidance panels and removed duplicate hardcoded title renderings.
- **Other guidance panels**: Confirmed all other sections render through `{guidanceText && <MarkDownSanitizedWithHtml content={guidanceText} />}` followed by `<GuidanceDownloads />`.

### 5. `package.json`
- Added dependency pointing directly to the active development branch:
  ```json
  "cruk-semantic-schema": "git+https://github.com/UOSBioinformaticslab/cruk-semantic-schema.git#dev"
  ```

---

## 3. How to Update & Test Schema Changes (Workflow)

Whenever changes are pushed to the `dev` branch of `cruk-semantic-schema` (e.g. modified guidance, altered `visibleSections`, or updated field rules):

```bash
# 1. From within the gateway-web directory, pull the latest commit:
npm update cruk-semantic-schema

# 2. Start (or restart) the Next.js development server:
npm run dev
```

Next.js will load the fresh schema, and `/api/form-hydration` will immediately supply the enriched structure to the UI.

---

## 4. Verification & Testing Completed

We performed comprehensive verification tests to guarantee that all guidance panels and fields are dynamic:

### A. All 15 Visible Sections Verified Dynamic
An automated resolution test was executed injecting unique test markers into every visible section in `semanticSchema.visibleSections`:
- `welcome` ➔ Verified dynamic (renders dynamic markdown at top of welcome guidance).
- `version` ➔ Verified dynamic (`properties.version.guidance`).
- `datasetFilters` ➔ Verified dynamic (`properties.datasetFilters.guidance` passed to `DatasetFiltersGuidancePanel`).
- `structuralMetadata` ➔ Verified dynamic (`properties.structuralMetadata.guidance`).
- `otherDataTypes` ➔ Verified dynamic (`properties.otherDataTypes.guidance` mapped to `Other.data.types`).
- `erd` ➔ Verified dynamic (`properties.erd.guidance` or `$defs.Image.properties.image.guidance`).
- `coverage` ➔ Verified dynamic (`properties.coverage.guidance`).
- `provenance` ➔ Verified dynamic (`properties.provenance.guidance`).
- `accessibility` ➔ Verified dynamic (`properties.accessibility.guidance`).
- `enrichmentAndLinkage` ➔ Verified dynamic (`properties.enrichmentAndLinkage.guidance`).
- `observations` ➔ Verified dynamic (`properties.observations.guidance`).
- `demographicFrequency` ➔ Verified dynamic (`properties.demographicFrequency.guidance`).
- `omics` ➔ Verified dynamic (`properties.omics.guidance`).
- `summary` ➔ Verified dynamic (`properties.summary.guidance`).
- `documentation` ➔ Verified dynamic (`properties.documentation.guidance`).

**Result:** `ALL 15 VISIBLE SECTIONS DYNAMIC: true`

### B. Nested Sub-Object & Field-Level Overrides
Tested candidate definition lookups across nested sub-objects (`$defs.Access`, `$defs.Temporal`, `$defs.FormatAndStandards`, `$defs.Project`, `$defs.Organisation`). Overridden dynamic field guidance now covers **31 fields** (e.g., `summary.title`, `accessibility.access.accessRights`, `provenance.temporal.startDate`, `accessibility.formatAndStandards.format`, `Associated Project Grants.projectStartDate`).

### C. Live End-to-End Verification
The user modified `datasetFilters.guidance` on GitHub (`#dev`), ran `npm update cruk-semantic-schema`, and confirmed in the live browser UI at `http://localhost:3000` that the guidance updated immediately.

### D. TypeScript Verification
Ran `tsc -p tsconfig.json --noEmit` and verified **0 TypeScript errors** on all modified and newly created files.
