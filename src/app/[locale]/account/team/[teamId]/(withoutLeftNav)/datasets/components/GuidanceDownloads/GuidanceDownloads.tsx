"use client";

import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Box from "@/components/Box";
import Button from "@/components/Button";
import DownloadExternalFile from "@/components/DownloadExternalFile";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { DescriptionOutlinedIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";

const TRANSLATION_PATH = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`;
const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION || "4.0.0";
const SCHEMA_BRANCH = process.env.NEXT_PUBLIC_SCHEMA_BRANCH || "master";
const EXAMPLE_METADATA_FILE_NAME = `HDRUK_${SCHEMA_VERSION}.example.json`;
const EXAMPLE_METADATA_URL = `https://raw.githubusercontent.com/HDRUK/schemata-2/${SCHEMA_BRANCH}/docs/HDRUK/${SCHEMA_VERSION}.example.json`;

const downloadButtonSx = {
    justifyContent: "flex-start",
    width: "100%",
    mb: 1,
    px: 2,
    py: 1.5,
    border: `1px solid ${colors.grey300}`,
    borderRadius: 1,
    backgroundColor: colors.white,
    color: "text.primary",
    textTransform: "none",
    fontWeight: 400,
    "&:hover": {
        backgroundColor: colors.grey100,
        borderColor: colors.grey300,
    },
};

const GuidanceDownloads = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const params = useParams<{ locale?: string }>();
    const locale = params?.locale || RouteName.EN;
    const userGuideHref = `/${locale}/${RouteName.HELP_UPLOAD_METADATA}`;

    return (
        <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2, borderColor: colors.grey300 }} />
            <Typography
                sx={{
                    mb: 1.5,
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "text.secondary",
                    letterSpacing: "0.04em",
                }}>
                {t("navigationWorkflow.guidanceDownloads")}
            </Typography>

            <DownloadExternalFile
                apiPath={EXAMPLE_METADATA_URL}
                buttonText={t("navigationWorkflow.downloadExampleMetadata")}
                fileName={EXAMPLE_METADATA_FILE_NAME}
                buttonSx={downloadButtonSx}
            />
            <Button
                href={userGuideHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                startIcon={<DescriptionOutlinedIcon />}
                sx={downloadButtonSx}>
                {t("navigationWorkflow.downloadUserGuide")}
            </Button>
        </Box>
    );
};

export default GuidanceDownloads;
