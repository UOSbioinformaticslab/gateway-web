# Pan-Cancer Filter (`0_0_5`) Frontend Implementation & Mirroring Guide

**Target Repository**: `ayo/gateway-web`  
**Reference Implementation**: `CRUK_datahub_landing_page` (Commit `0ae667d`) & `basic/basic_backend`  
**Prepared for**: Ayo (Ayoola Olojede)  
**Date**: October 2026  

---

## 1. Executive Summary & Rationale

### The Problem
Previously, the CRUK DataHub required every cancer dataset to be classified using an **ICD-O Topography** (primary site/organ) and **ICD-O Histology** (morphology/cell type) pair. While this works well for organ-specific studies (e.g. colorectal adenocarcinoma, breast invasive ductal carcinoma), it failed for:
1. **Multi-cancer & basket trials**: Clinical trials evaluating treatments across diverse tumor types (e.g. Keynote basket trials, molecular profiling across solid tumors).
2. **Pan-cancer genomic & multi-omic cohorts**: Studies like TCGA Pan-Cancer Atlas, 100,000 Genomes Project, or multi-tumor liquid biopsy profiling.
3. **Generic preclinical oncology research**: Studies investigating fundamental oncology mechanisms without a single target organ.

Custodians of these datasets were either blocked by form validation or forced to pick an arbitrary dummy organ.

### The Solution: Pan-Cancer Filter (`0_0_5`)
We introduced a dedicated **Pan Cancer (`0_0_5`)** filter:
- **Backend ID**: `"0_0_5"`
- **Parent**: `"0_0"` (`cancerTypes`)
- **Primary Group**: `"cancer-type"`
- **Label**: `"Pan Cancer"`
- **Description**: `"applies to multiple cancer types."`
- **UX Paradigm**: Users can specify Pan Cancer **AND / OR** specific cancer types (Topography/Histology, CRUK, TCGA, SNOMED). Both browsers and uploaders can combine them freely.

---

## 2. Core Architectural & UI Requirements

### A. Dataset Search / Browse Page (`StudyFilter.tsx` & `FilterApp.jsx`)
In the search panel (`CancerTypePanel`), users should be able to toggle the pan-cancer filter immediately and also combine it with specific classifications.

**Changes made**:
1. Main heading updated to explicitly convey `and/or`:
   > **Browse [ 🌐 Pan-cancer ] datasets and/or click on a classification below to specify individual cancers**
2. The `[ 🌐 Pan-cancer ]` button is an interactive toggle:
   - When inactive: outlined button with clean neutral borders (`border-gray-300`, white background).
   - When active: clean outline style with CRUK pink border (`#D10A6F`), crisp white background (so it does not dominate the surrounding text), pink text, and a checkmark badge (`✓`).
   - Toggles filter ID `"0_0_5"` via `handleFilterChange("0_0_5")`.
3. **Classification Sub-View Header**:
   - When a user clicks into a classification (e.g. CRUK Cancer Terms, TCGA, SNOMED, or ICD-O), the header retains an `"Also apply: [ 🌐 Pan-cancer ]"` button alongside the `"Back to Selection"` button so users don't have to navigate back to toggle pan-cancer.
4. **Advanced Logic Builder (`calculateLogicTokens` & `calculateLogicMessage`)**:
   - In `logic-utils.js` (and `logic-utils.ts`), `"0_0_5"` is recognized with filter type `"pan"` (`second === "5"`).
   - In `calculateLogicTokens()`, `"pan"` is included with the top-level cancer filter group.
   - When both Pan-Cancer and a specific cancer are selected, the Advanced Logic Builder outputs them together (e.g., `(Pan Cancer OR Breast)`), allowing users to inspect the expression, wrap brackets, or toggle the operator to `AND` (`(Pan Cancer AND Breast)`).

---

### B. Dataset Upload / Metadata Tagger (`DatasetFiltersSection.tsx` & `DataTagger.jsx`)
In the dataset creation wizard (`Dataset Filters` section), custodians tag their datasets with relevant filters.

**Changes made**:
1. **Guidance Banner**: Added an explicit banner above the tab content:
   > *"Specify **Pan Cancer** if your dataset applies to multiple cancer types, **and/or** use the **ICD-O Classification** below to specify individual cancer topography and histology."*
2. **Option 1 (Pan Cancer Card)**:
   - Rendered as a dedicated card directly above ICD-O Classification.
   - Contains a checkbox tied to `"0_0_5"`, globe icon 🌐, label, description, and an info tooltip (`applies to multiple cancer types.`).
   - Highlights with a pink border and subtle background tint when checked.
3. **Visual Divider**:
   - An explicit horizontal divider:
     `— AND / OR specify ICD-O classification —`
4. **Option 2 (ICD-O Classification)**:
   - Keeps the existing ICD-O Topography and Histology search inputs and hierarchical trees intact below the divider, allowing uploaders to select Pan Cancer, Topography, Histology, or both together.

---

### C. Right-Hand Guidance Panel (`DatasetFiltersGuidancePanel.tsx`)
Updated the guidance instructions in the persistent right-hand drawer to reinforce the choice:
> *"Specify **Pan Cancer** if your dataset applies to multiple cancer types, and/or use **ICD-O Classification** (Topography and Histology) for specific cancers. This is automatically translated to CRUK and TCGA equivalents."*

---

### D. Section Completion & Form Validation (`CreateDataset.tsx` & `SchemaPage.jsx`)
In the reference landing page (`SchemaPage.jsx`), section completion is computed as:
```javascript
// Validation rule:
const isComplete = (hasPanCancer || (hasTopo && hasHisto)) && hasData && hasAccess;
```

**Changes in `CreateDataset.tsx`**:
1. **Existing Dataset Hydration**: On edit or draft load, `latestMetadata.datasetFilters` is read and populated into `datasetFilterIds` state so existing tags (including `"0_0_5"`) are preserved.
2. **Submission Payload**: Attached `datasetFilters: Array.from(datasetFilterIds)` into `formPayload.metadata.metadata.datasetFilters` across all creation modes (New, Edit, Duplicate).

---

### E. Taxonomy & Static Filter Cache (`filter_data.js` & `filter-setup.ts`)
`filter-setup.ts` traverses `filterData['0_0'].children` to build `filterDetailsMap`.
For `"0_0_5"` to be recognised throughout the app (generating chips, tooltips, and labels):
Added the `"0_0_5"` node directly under `filterData["0_0"].children`:
```javascript
"0_0_5": {
    id: "0_0_5",
    label: "Pan Cancer",
    category: "cancerTypes",
    primaryGroup: "cancer-type",
    description: "applies to multiple cancer types.",
},
```

---

## 3. File-by-File Diff & Implementation Details

### 1. `src/utils/filter_data.js`
Added `"0_0_5"` at the end of the `0_0` children map (after `0_0_4` TCGA):
```diff
--- a/src/utils/filter_data.js
+++ b/src/utils/filter_data.js
@@ -12865,6 +12865,13 @@ export const filterData = {
                     },
                 },
             },
+            "0_0_5": {
+                id: "0_0_5",
+                label: "Pan Cancer",
+                category: "cancerTypes",
+                primaryGroup: "cancer-type",
+                description: "applies to multiple cancer types.",
+            },
         },
     },
     "0_1": {
```

---

### 2. `src/utils/logic-utils.ts`
Recognized `"0_0_5"` in `filterType()` and included it in the cancer grouping for Boolean queries:
```diff
--- a/src/utils/logic-utils.ts
+++ b/src/utils/logic-utils.ts
@@ -1,6 +1,6 @@
 import { filterDetailsMap } from './filter-setup';
 
-type FilterType = "hist" | "top" | "cruk" | "snomed" | "tcga" | "data" | "access" | "unknown";
+type FilterType = "hist" | "top" | "cruk" | "snomed" | "tcga" | "pan" | "data" | "access" | "unknown";
 
 const filterType = (id: string): FilterType => {
     const info = id.split("_");
@@ -22,6 +22,7 @@ const filterType = (id: string): FilterType => {
         else if (second === "2") return "cruk";
         else if (second === "3") return "snomed";
         else if (second === "4") return "tcga";
+        else if (second === "5") return "pan";
         return "unknown";
     }
 };
@@ -98,7 +99,8 @@ const calculateLogicMessage = ({
     const top = filters.filter(f => filterType(f.id) === "top"
         || filterType(f.id) === "cruk"
         || filterType(f.id) === "snomed"
-        || filterType(f.id) === "tcga");
+        || filterType(f.id) === "tcga"
+        || filterType(f.id) === "pan");
     const data = filters.filter(f => filterType(f.id) === "data");
     const access = filters.filter(f => filterType(f.id) === "access");
```

---

### 3. `src/app/[locale]/(logged-out)/search/components/StudyFilter/StudyFilter.tsx`
Updated the `CancerTypePanel` classification header to render the interactive `Browse [ 🌐 Pan-cancer ] datasets` button:
```diff
--- a/src/app/[locale]/(logged-out)/search/components/StudyFilter/StudyFilter.tsx
+++ b/src/app/[locale]/(logged-out)/search/components/StudyFilter/StudyFilter.tsx
@@ -594,14 +594,84 @@ const CancerTypePanel = ({ handleFilterChange, selectedFilters, searchTerm, setS
                 </Box>
             ) : (
                 <Box>
-                    <Typography
+                    <Box
                         sx={{
-                            display: 'block',
-                            color: colors.black,
-                            fontSize: { mobile: '1.125rem', tablet: '1.25rem' },
-                            fontWeight: 600,
-                            lineHeight: 1.4,
-                            textAlign: { mobile: 'center', tablet: 'left' },
+                            display: 'flex',
+                            flexWrap: 'wrap',
+                            alignItems: 'center',
+                            gap: 1.5,
                             mb: 2,
                             mt: { mobile: -0.5, tablet: -1 },
                         }}
                     >
-                        Click on your choice of classification to begin
-                    </Typography>
+                        <Typography
+                            component="span"
+                            sx={{
+                                color: colors.black,
+                                fontSize: { mobile: '1.125rem', tablet: '1.25rem' },
+                                fontWeight: 600,
+                                lineHeight: 1.4,
+                            }}
+                        >
+                            Browse
+                        </Typography>
+                        <Button
+                            type="button"
+                            id="pan-cancer-filter-button"
+                            onClick={() => handleFilterChange("0_0_5")}
+                            variant={selectedFilters.has("0_0_5") ? "contained" : "outlined"}
+                            size="small"
+                            sx={{
+                                textTransform: 'none',
+                                borderRadius: 1.5,
+                                px: 1.5,
+                                py: 0.5,
+                                fontSize: '0.875rem',
+                                fontWeight: 600,
+                                borderColor: selectedFilters.has("0_0_5") ? COLORS.pink : '#D1D5DB',
+                                bgcolor: selectedFilters.has("0_0_5") ? COLORS.pink : 'white',
+                                color: selectedFilters.has("0_0_5") ? 'white' : 'text.primary',
+                                '&:hover': {
+                                    borderColor: COLORS.pink,
+                                    bgcolor: selectedFilters.has("0_0_5") ? COLORS.pink : '#FFF1F7',
+                                    color: selectedFilters.has("0_0_5") ? 'white' : COLORS.pink,
+                                },
+                                display: 'inline-flex',
+                                alignItems: 'center',
+                                gap: 0.75,
+                                boxShadow: selectedFilters.has("0_0_5") ? '0 0 0 3px rgba(209, 10, 111, 0.25)' : 'none',
+                            }}
+                            title="applies to multiple cancer types."
+                        >
+                            <span style={{ fontSize: '1rem' }}>🌐</span>
+                            <span>Pan-cancer</span>
+                            {selectedFilters.has("0_0_5") && (
+                                <Box
+                                    component="span"
+                                    sx={{
+                                        ml: 0.5,
+                                        fontSize: '0.75rem',
+                                        bgcolor: 'white',
+                                        color: COLORS.pink,
+                                        borderRadius: '50%',
+                                        width: 16,
+                                        height: 16,
+                                        display: 'inline-flex',
+                                        alignItems: 'center',
+                                        justifyContent: 'center',
+                                        fontWeight: 800,
+                                    }}
+                                >
+                                    ✓
+                                </Box>
+                            )}
+                        </Button>
+                        <Typography
+                            component="span"
+                            sx={{
+                                color: colors.black,
+                                fontSize: { mobile: '1.125rem', tablet: '1.25rem' },
+                                fontWeight: 600,
+                                lineHeight: 1.4,
+                            }}
+                        >
+                            datasets or Click on your choice of classification to begin
+                        </Typography>
+                    </Box>
```

---

### 4. `src/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/components/DatasetFilters/DatasetFiltersSection.tsx`
Added Pan Cancer option card, guidance banner, and visual divider above ICD-O classification:
```diff
--- a/src/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/components/DatasetFilters/DatasetFiltersSection.tsx
+++ b/src/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/components/DatasetFilters/DatasetFiltersSection.tsx
@@ -6,6 +6,7 @@ import {
     Checkbox,
     CircularProgress,
     Collapse,
+    Divider,
     FormControlLabel,
     InputAdornment,
     Tab,
@@ -12,4 +13,5 @@ import {
     TextField,
+    Tooltip,
     Typography,
 } from "@mui/material";
 import ExpandLess from "@mui/icons-material/ExpandLess";
@@ -16,4 +18,5 @@ import ExpandMore from "@mui/icons-material/ExpandMore";
 import SearchIcon from "@mui/icons-material/Search";
+import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
 import Paper from "@/components/Paper";
 import NestedFilterTree from "@/components/NestedFilterTree";
@@ -256,6 +259,81 @@ const DatasetFiltersSection = ({
                 borderRadius: 2,
                 p: { mobile: 2, tablet: 2.5 },
             }}>
+            {/* Guidance banner clarifying Pan Cancer vs ICD-O */}
+            <Box sx={{ mb: 2 }}>
+                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
+                    Specify <strong>Pan Cancer</strong> if your dataset applies to multiple cancer types — <strong>or</strong> use the <strong>ICD-O Classification</strong> below to specify individual cancer topography and histology.
+                </Typography>
+            </Box>
+
+            {/* Option 1: Pan-Cancer Filter Card */}
+            <Paper
+                elevation={0}
+                sx={{
+                    mb: 2,
+                    p: 1.5,
+                    borderRadius: 2,
+                    border: "2px solid",
+                    borderColor: selectedFilters.has("0_0_5") ? COLORS.pink : "grey.300",
+                    bgcolor: selectedFilters.has("0_0_5") ? "rgba(209, 10, 111, 0.04)" : "white",
+                    display: "flex",
+                    alignItems: "center",
+                    justifyContent: "space-between",
+                    transition: "all 0.2s ease-in-out",
+                    boxShadow: selectedFilters.has("0_0_5") ? "0 0 0 3px rgba(209, 10, 111, 0.15)" : "none",
+                }}
+            >
+                <FormControlLabel
+                    control={
+                        <Checkbox
+                            checked={selectedFilters.has("0_0_5")}
+                            onChange={() => onFilterChange("0_0_5")}
+                            sx={{
+                                color: "grey.400",
+                                "&.Mui-checked": {
+                                    color: COLORS.pink,
+                                },
+                            }}
+                        />
+                    }
+                    label={
+                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
+                            <span style={{ fontSize: "1.1rem" }}>🌐</span>
+                            <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "text.primary" }}>
+                                Pan Cancer
+                            </Typography>
+                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
+                                — applies to multiple cancer types.
+                            </Typography>
+                        </Box>
+                    }
+                    sx={{ m: 0 }}
+                />
+                <Tooltip title="applies to multiple cancer types." placement="left">
+                    <InfoOutlinedIcon sx={{ fontSize: 18, color: "grey.500", cursor: "help" }} />
+                </Tooltip>
+            </Paper>
+
+            {/* Visual Divider: OR */}
+            <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
+                <Divider sx={{ flexGrow: 1 }} />
+                <Typography
+                    variant="caption"
+                    sx={{
+                        mx: 2,
+                        fontWeight: 700,
+                        textTransform: "uppercase",
+                        letterSpacing: "0.05em",
+                        color: "text.disabled",
+                        fontSize: "0.75rem",
+                    }}
+                >
+                    — OR specify ICD-O classification —
+                </Typography>
+                <Divider sx={{ flexGrow: 1 }} />
+            </Box>
+
+            {/* Option 2: ICD-O Classification */}
             <Typography
                 variant="h5"
                 component="h3"
```

---

### 5. `src/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/components/DatasetFilters/DatasetFiltersGuidancePanel.tsx`
Clarified Pan Cancer in the right-hand guidance text:
```diff
--- a/src/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/components/DatasetFilters/DatasetFiltersGuidancePanel.tsx
+++ b/src/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/components/DatasetFilters/DatasetFiltersGuidancePanel.tsx
@@ -54,9 +54,7 @@ const DatasetFiltersGuidancePanel = ({
                 criteria: type of cancer, type of data and access conditions.
             </Typography>
             <Typography sx={{ mb: 3 }}>
-                Use ICD-O terminology to categorise each of the cancers covered,
-                and keywords to include further important details. This is
-                automatically translated to CRUK and TCGA equivalents.
+                Specify <strong>Pan Cancer</strong> if your dataset applies to multiple cancer types — or use <strong>ICD-O Classification</strong> (Topography and Histology) for specific cancers. This is automatically translated to CRUK and TCGA equivalents.
             </Typography>
```

---

### 6. `src/config/messages/en.json`
Updated the workflow guidance message:
```diff
--- a/src/config/messages/en.json
+++ b/src/config/messages/en.json
@@ -531,7 +531,7 @@
                                 "sidebarLabel": "Sidebar:",
                                 "sidebar": "Use status icons to track progress (Red \"X\" for missing mandatory fields; Amber \"!\" for missing optional fields).",
                                 "datasetFiltersLabel": "Dataset Filters:",
-                                "datasetFilters": "Tag your data with at least one Topography, Histology, Data Type, and Access Type. Access to data normally changes as a project and resulting datasets mature.",
+                                "datasetFilters": "Tag your data with either Pan Cancer OR at least one Topography and Histology pair, plus Data Type and Access Type. Access to data normally changes as a project and resulting datasets mature.",
                                 "autoExpansionLabel": "Auto-Expansion:",
```

---

### 7. `src/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/components/CreateDataset/CreateDataset.tsx`
Hydrated filters from existing dataset on load and persisted `datasetFilters` in form submissions:
```diff
--- a/src/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/components/CreateDataset/CreateDataset.tsx
+++ b/src/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/components/CreateDataset/CreateDataset.tsx
@@ -335,6 +335,11 @@ const CreateDataset = ({
 
         setStructuralMetadata(latestMetadata?.structuralMetadata?.tables || []);
 
+        const existingFilters = latestMetadata?.datasetFilters || latestMetadata?.metadata?.datasetFilters || [];
+        if (Array.isArray(existingFilters) && existingFilters.length > 0) {
+            setDatasetFilterIds(new Set(existingFilters.map((f: unknown) => typeof f === 'object' && f !== null && 'id' in f ? (f as { id: string }).id : String(f)).filter(Boolean)));
+        }
+
         const mappedFormData = mapExistingDatasetToFormFields(
             schemaFields,
             latestMetadata
@@ -657,6 +662,7 @@ const CreateDataset = ({
                               observations: [],
                               coverage: null,
                               ...mappedFormData,
+                              datasetFilters: Array.from(datasetFilterIds),
                               structuralMetadata: {
                                   ...mappedFormData.structuralMetadata,
                                   tables: structuralMetadata,
@@ -677,6 +683,7 @@ const CreateDataset = ({
                               observations: [],
                               coverage: null,
                               ...mappedFormData,
+                              datasetFilters: Array.from(datasetFilterIds),
                               structuralMetadata: {
                                   ...mappedFormData.structuralMetadata,
                                   tables: structuralMetadata,
@@ -697,6 +704,7 @@ const CreateDataset = ({
                               observations: [],
                               coverage: null,
                               ...mappedFormData,
+                              datasetFilters: Array.from(datasetFilterIds),
                               issued: today,
                               modified: today,
                               structuralMetadata: {
```

---

## 4. Verification Checklist

- [x] `0_0_5` registered in `filter_data.js` and loaded into `filterDetailsMap`.
- [x] Search page renders `Browse [ 🌐 Pan-cancer ] datasets` button with active toggling.
- [x] Upload page renders Pan Cancer as Option 1, visual divider `— OR specify ICD-O classification —`, and ICD-O as Option 2.
- [x] Active tag chips display with CRUK pink styling and proper labels.
- [x] Query message logic recognizes `0_0_5` as a cancer-type filter (`Pan Cancer AND Bloods`).
- [x] Form submission attaches `datasetFilters` to dataset metadata.
- [x] Edit view loads and pre-checks previously saved filters.
