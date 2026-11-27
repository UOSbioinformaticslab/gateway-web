import { colors } from "@/config/theme";
import { filterDetailsMap } from "@/utils/filter-setup";
import { CancerClassification, FilterPanelId } from "./types";

export const TRANSLATION_PATH = "pages.search.components.StudyFilter";

export const PAN_CANCER_FILTER_ID = "pan-cancer";

export const MIN_SEARCH_LENGTH = 4;

export const SEARCH_DEBOUNCE_MS = 300;

export const FILTER_COLORS = {
    blue: colors.blue400,
    pink: colors.pink400,
    white: colors.white,
    lightBg: "#F0F2F5",
    border: "#AAB7C4",
    pinkHover: "#b0085d",
    blueHover: "#003d7a",
};

export const PANEL_GROUP: Record<FilterPanelId, string> = {
    cancer: "cancer-type",
    data: "data-type",
    access: "access",
};

export const CANCER_ROOT_ID = "0_0";
export const DATA_TYPE_ROOT_ID = "0_2";
export const ACCESS_ROOT_ID = "0_1";

export const CANCER_BRANCH_IDS = {
    topography: "0_0_0",
    histology: "0_0_1",
    cruk: "0_0_2",
    snomed: "0_0_3",
    tcga: "0_0_4",
} as const;

export const DATA_TYPE_SECTIONS = [
    { titleKey: "dataTypes.biobank", nodeId: "0_2_0" },
    { titleKey: "dataTypes.inVitro", nodeId: "0_2_1" },
    { titleKey: "dataTypes.modelOrganisms", nodeId: "0_2_2" },
    { titleKey: "dataTypes.patientStudies", nodeId: "0_2_3" },
    { titleKey: "dataTypes.nonBio", nodeId: "0_2_4" },
] as const;

export const CANCER_CLASSIFICATIONS: {
    key: CancerClassification;
    titleKey: string;
    descriptionKey: string;
    emoji: string;
}[] = [
    {
        key: "cruk",
        titleKey: "cancer.cards.crukTitle",
        descriptionKey: "cancer.cards.crukDescription",
        emoji: "🏥",
    },
    {
        key: "tcga",
        titleKey: "cancer.cards.tcgaTitle",
        descriptionKey: "cancer.cards.tcgaDescription",
        emoji: "🧬",
    },
    {
        key: "snomed",
        titleKey: "cancer.cards.snomedTitle",
        descriptionKey: "cancer.cards.snomedDescription",
        emoji: "🏷️",
    },
    {
        key: "icdo",
        titleKey: "cancer.cards.icdoTitle",
        descriptionKey: "cancer.cards.icdoDescription",
        emoji: "🔬",
    },
];

const CLASSIFICATION_PREFIXES: Record<CancerClassification, string[]> = {
    icdo: [CANCER_BRANCH_IDS.topography, CANCER_BRANCH_IDS.histology],
    cruk: [CANCER_BRANCH_IDS.cruk],
    snomed: [CANCER_BRANCH_IDS.snomed],
    tcga: [CANCER_BRANCH_IDS.tcga],
};

export const countSelectedInClassification = (
    classification: CancerClassification,
    selectedFilters: Set<string>
) => {
    const prefixes = CLASSIFICATION_PREFIXES[classification];
    let count = 0;

    selectedFilters.forEach(id => {
        if (prefixes.some(prefix => id.startsWith(prefix))) {
            count += 1;
        }
    });

    return count;
};

filterDetailsMap.set(PAN_CANCER_FILTER_ID, {
    id: PAN_CANCER_FILTER_ID,
    label: "Pan Cancer",
    category: "cancerTypes",
    group: "cancer-type",
});
