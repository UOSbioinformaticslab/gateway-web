# Optional Histology Frontend Implementation & Mirroring Guide

**Target Repository**: `ayo/gateway-web` (Branch: `optional-histology`)  
**Reference Implementation**: `CRUK_datahub_landing_page`  
**Prepared for**: Ayo (Ayoola Olojede)  
**Date**: October 2026  

---

## 1. Executive Summary & Rationale

### The Problem
Previously, both `CRUK_datahub_landing_page` and `ayo/gateway-web` treated **ICD-O Topography** (primary anatomical site) and **ICD-O Histology** (cellular morphology) as jointly mandatory whenever the dataset did not use the Pan-Cancer flag:
```javascript
// Previous validation logic:
if ((hasPanCancer || (hasTopo && hasHisto)) && hasData && hasAccess) return 'complete';
```
In real-world oncology datasets, however, **histology is often not relevant or available**:
1. **Radiology & Medical Imaging**: CT, MRI, and ultrasound cohorts often index by organ site (e.g. Brain, Liver, Lung) before or without histological biopsy.
2. **Epidemiological & Lifestyle Studies**: Cohorts tracking cancer incidence, dietary risk factors, or patient-reported outcomes frequently record the organ site without granular histological morphology.
3. **Organ-Level Preclinical Models**: Ultrasound or organ perfusion models that focus on primary organ physiology.
4. **Surgical & Staging Datasets**: Studies focused on resection techniques or anatomical margins where sub-typing wasn't performed.

Forcing uploaders to specify a histology forced custodians to select inaccurate dummy codes or prevented their upload sections from ever being marked complete.

### The Solution
1. **Topography Alone is Sufficient**: An uploader can provide Topography (e.g. *C50 Breast*) without any Histology, and the dataset is considered fully valid and complete.
2. **Automated TCGA & CRUK Term Resolution (`800 Neoplasms, NOS`)**:
   - For mapping into high-level TCGA and CRUK terms (e.g., C50 &rarr; *Breast cancer*, *BRCA*), the backend mapping table `cancer_term_id_mappings` indexes topographies paired with `0_0_1_0` (`800 Neoplasms, NOS`).
   - When no histology is selected, the frontend supplies `800 Neoplasms, NOS` (`0_0_1_0`) **solely as the background lookup parameter** to the `/datasets/extra-terms` endpoint and client-side `getExtra()` engine.
   - **Crucially: `800 Neoplasms, NOS` is NEVER added or injected into the dataset's `datasetFilters` array or database record.** The dataset simply receives the resolved TCGA and CRUK terms.
3. **Updated UI Copy**: Clear copy indicating that Histology is optional and only to be provided where relevant.

---

## 2. Reference Changes in `CRUK_datahub_landing_page`

The following changes were applied and verified in `CRUK_datahub_landing_page`:

### A. Validation Logic ([SchemaPage.jsx](file:///Users/skw24/CRUK/website/CRUK_datahub_landing_page/src/components/SchemaPage.jsx#L192))
```javascript
// BEFORE:
if ((hasPanCancer || (hasTopo && hasHisto)) && hasData && hasAccess) return 'complete';

// AFTER:
if ((hasPanCancer || hasTopo) && hasData && hasAccess) return 'complete';
```

### B. Mapping Lookup Fallback in JSON Download ([SchemaPage.jsx](file:///Users/skw24/CRUK/website/CRUK_datahub_landing_page/src/components/SchemaPage.jsx#L1924))
```javascript
// BEFORE:
if ((tops.length > 0 || topIds.length > 0) && (hist.length > 0 || histIds.length > 0)) {
    ...
    body: JSON.stringify({ topographies: tops, histologies: hist, ... })
}

// AFTER:
if (tops.length > 0 || topIds.length > 0) {
    const lookupHist = (hist.length > 0 || histIds.length > 0) ? hist : ["800 Neoplasms, NOS"];
    const lookupHistIds = histIds.length > 0 ? histIds : (hist.length > 0 ? [] : ["0_0_1_0"]);
    ...
    body: JSON.stringify({
        topographies: tops,
        histologies: lookupHist,
        topography_ids: topIds,
        histology_ids: lookupHistIds
    })
}
```

### C. Save/Publish Payload Mapping ([UploadTopBar.jsx](file:///Users/skw24/CRUK/website/CRUK_datahub_landing_page/src/components/UploadTopBar.jsx#L380))
```javascript
// BEFORE:
if (tops.length > 0 && hist.length > 0) {
    body: JSON.stringify({ topographies: tops, histologies: hist })
}

// AFTER:
if (tops.length > 0) {
    const lookupHist = hist.length > 0 ? hist : ["800 Neoplasms, NOS"];
    body: JSON.stringify({ topographies: tops, histologies: lookupHist })
}
```

### D. Client-Side Cross-Walk Traversal ([getExtra.js](file:///Users/skw24/CRUK/website/CRUK_datahub_landing_page/src/utils/getExtra.js#L30-L40))
```javascript
// BEFORE:
for (const h of hist) {
    const termsList = histMap[h];
    ...
}

// AFTER:
const effectiveHist = hist.length > 0 ? hist : ["800 Neoplasms, NOS"];
for (const h of effectiveHist) {
    const termsList = histMap[h];
    ...
}
```

### E. UI Wording Updates
1. **[DataTagger.jsx](file:///Users/skw24/CRUK/website/CRUK_datahub_landing_page/src/components/DataTagger.jsx#L173)**:
   - Guidance banner:
     > *"Specify **Pan Cancer** if your dataset applies to multiple cancer types, **and/or** use the **ICD-O Classification** below to specify cancer topography (primary site) and, where relevant, histology."*
   - Section subtitle:
     > *"Please provide the ICD-O Topography code (primary site) and, if relevant, the Histology code. (If histology is not applicable, general neoplasms are assumed for automated TCGA and CRUK mappings)."*
   - Histology header:
     > `Histology (Optional / Where Relevant)`
2. **[FilterApp.jsx](file:///Users/skw24/CRUK/website/CRUK_datahub_landing_page/src/components/FilterApp.jsx#L1142)**:
   - Card description:
     > *"Official pathology terms: Topography (site) & optional Histology (morphology)."*
   - Histology column header:
     > `Histology (Optional)`

---

## 3. Step-by-Step Mirroring Guide for `ayo/gateway-web`

When working on the `optional-histology` branch in `ayo/gateway-web` (note: branch from or rebase on top of `pan-cancer` / `feature/cruk-gateway-web` so the CRUK components are present):

### Step 1: Update Dataset Form Copy in `DatasetFiltersSection.tsx`
**File**: `src/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/components/DatasetFilters/DatasetFiltersSection.tsx`

1. **Update Guidance Banner (around Line 261)**:
   ```tsx
   <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
       Specify <strong>Pan Cancer</strong> if your dataset applies to multiple cancer types, <strong>and/or</strong> use the <strong>ICD-O Classification</strong> below to specify cancer topography (primary site) and, where relevant, histology.
   </Typography>
   ```

2. **Update ICD-O Subtitle (around Line 339)**:
   ```tsx
   <Typography sx={{ mb: 2, color: "text.secondary" }}>
       Please provide the ICD-O Topography code (primary site) and, if relevant, the Histology code. (If histology is not applicable, general neoplasms are assumed for automated TCGA and CRUK mappings).
   </Typography>
   ```

3. **Update Histology Column Header (around Line 368)**:
   ```tsx
   <Paper elevation={0} sx={panelSx}>
       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
           <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
               Histology
           </Typography>
           <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 400 }}>
               (Optional / Where Relevant)
           </Typography>
       </Box>
       <Box sx={listScrollSx}>
           <NestedFilterTree
               items={histologyItems}
               selectedFilters={selectedFilters}
               onFilterChange={onFilterChange}
           />
       </Box>
   </Paper>
   ```

---

### Step 2: Update Search / Browse Copy in `StudyFilter.tsx`
**File**: `src/app/[locale]/(logged-out)/search/components/StudyFilter/StudyFilter.tsx`

1. **Update Histology Column Header (around Line 562)**:
   ```tsx
   <Paper elevation={0} sx={icdoPanelSx}>
       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
           <Typography
               variant="subtitle1"
               sx={{ color: colors.black, fontWeight: 700 }}
           >
               Histology
           </Typography>
           <Typography variant="caption" sx={{ color: colors.grey600, fontWeight: 400 }}>
               (Optional)
           </Typography>
       </Box>
       <Box sx={icdoListScrollSx}>
           <NestedFilterList items={filteredHistology} {...listProps} />
       </Box>
   </Paper>
   ```

2. **Update ICD-O Classification Card Description (around Line 750)**:
   ```tsx
   <ClassificationCard
       title="ICD-O Classification"
       description="Official pathology terms: Topography (site) & optional Histology (morphology)."
       classificationKey="icdo"
       emoji="🔬"
   />
   ```

---

### Step 3: Update Extra-Terms Resolution in Dataset Submission / Export Pipeline
Whenever datasets are submitted or queried for cross-walked terms (`/datasets/extra-terms`):

```typescript
// tops: string[] (e.g. ["C50 Breast"])
// hist: string[] (user-selected histologies)

if (tops.length > 0) {
    // If no histology is provided, pass "800 Neoplasms, NOS" solely as the lookup query:
    const lookupHist = hist.length > 0 ? hist : ["800 Neoplasms, NOS"];
    
    const response = await fetch(`${API_BASE_URL}/datasets/extra-terms`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            topographies: tops,
            histologies: lookupHist
        })
    });
    
    if (response.ok) {
        const lookupMap = await response.json();
        const convertedTerms = getExtra(datasetData, lookupMap);
        
        // Append converted terms (TCGA / CRUK) WITHOUT ever injecting 800 Neoplasms, NOS
        const existingIds = new Set(datasetData.datasetFilters.map(f => typeof f === 'object' ? f.id : f));
        const newTerms = convertedTerms.filter(t => !existingIds.has(t.id));
        
        datasetData.datasetFilters = [...datasetData.datasetFilters, ...newTerms];
    }
}
```

> **Important Frontend State Note**: Ensure the enriched `datasetData.datasetFilters` are synced back into the local React form state (`formData.datasetFilters`) upon save. If only sent to the database without updating the component's state, the upload page will continue displaying only the original pre-save tags until a full page reload occurs.

---

### Step 4: Clean Up Dataset Filters & Tags Live Preview
In the dataset creation live preview / sidebar tags component:

1. **Do not repeat Pan Cancer**:
   - Render Pan Cancer as a single clean badge/pill (e.g., `🌐 Pan Cancer — applies to multiple cancer types ✓`) at the top of the Cancer Type group.
   - Do NOT create a sub-heading called "Pan Cancer" with an identical bullet point "Pan Cancer" underneath it.
2. **Omit Empty Category Headings**:
   - Only render category headings (e.g. `ICD-O Histology (Morphology)`, `TCGA Terms`, etc.) if there are active items present in that category. If histology is omitted, the `ICD-O Histology` heading must not appear.
3. **Structured Classification Hierarchy**:
   Group cancer filters into clean, human-readable sections based on ID prefix rather than raw database `category` strings:
   - `0_0_5` &rarr; Pan Cancer (prominent badge at top)
   - `0_0_2_*` &rarr; `CRUK Cancer Terms`
   - `0_0_0_*` &rarr; `ICD-O Topography (Primary Site)` (unifies all organ branches)
   - `0_0_1_*` &rarr; `ICD-O Histology (Morphology)`
   - `0_0_4_*` &rarr; `TCGA Terms`
   - `0_0_3_*` &rarr; `SNOMED-CT`
4. **Alphabetical Sorting**:
   Sort items alphabetically within each category so the tag list is organized and predictable.

---

## 4. Verification Checklist

- [x] **Section Completion**: A dataset with `Pan Cancer` OR `Topography` (with NO Histology) is marked complete in `CRUK_datahub_landing_page`.
- [x] **Database / Payload Integrity**: `800 Neoplasms, NOS` (`0_0_1_0`) is **not** present in `datasetFilters` when only Topography is selected.
- [x] **Enrichment Check**: Datasets with Topography only successfully receive their mapped CRUK and TCGA terms upon save/download.
- [x] **Live Preview Tags Hierarchy**: Filters & Tags preview groups terms logically, avoids repeating "Pan Cancer", and omits any headings that have zero terms.
- [x] **Build Verification**: `npm run build` passes with zero errors in `CRUK_datahub_landing_page`.
