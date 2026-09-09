"use client";

import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import GuidanceDownloads from "../GuidanceDownloads";

const TRANSLATION_PATH = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`;

const WelcomeGuidanceNavigation = () => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h2" sx={{ fontSize: "1.375rem", mb: 2 }}>
                {t("navigationWorkflow.title")}
            </Typography>
            <Typography sx={{ mb: 2 }}>
                <strong>{t("navigationWorkflow.sidebarLabel")}</strong>{" "}
                {t("navigationWorkflow.sidebar")}
            </Typography>
            <Typography sx={{ mb: 2 }}>
                <strong>{t("navigationWorkflow.datasetFiltersLabel")}</strong>{" "}
                {t("navigationWorkflow.datasetFilters")}
            </Typography>
            <Typography sx={{ mb: 2 }}>
                <strong>{t("navigationWorkflow.autoExpansionLabel")}</strong>{" "}
                {t("navigationWorkflow.autoExpansion")}
            </Typography>
            <Typography sx={{ mb: 2 }}>
                <strong>{t("navigationWorkflow.privacyLabel")}</strong>{" "}
                {t("navigationWorkflow.privacy")}
            </Typography>

            <GuidanceDownloads />
        </Box>
    );
};

export default WelcomeGuidanceNavigation;
