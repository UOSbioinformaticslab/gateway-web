"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { colors } from "@/config/theme";

const TRANSLATION_PATH = "pages.search.projectHeader";

const ProjectHeader = () => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Box
            component="header"
            sx={{
                py: { mobile: 3, tablet: 4 },
                px: { mobile: 1, tablet: 2 },
                textAlign: "center",
            }}>
            <Typography
                component="h1"
                sx={{
                    m: 0,
                    mb: 1.5,
                    fontWeight: 800,
                    fontSize: { mobile: "2rem", tablet: "2.5rem" },
                    lineHeight: 1.15,
                    color: colors.blue400,
                }}>
                {t("title")}
            </Typography>
            <Typography
                component="h2"
                sx={{
                    m: 0,
                    mb: 2.5,
                    fontWeight: 700,
                    fontSize: { mobile: "1.05rem", tablet: "1.15rem" },
                    lineHeight: 1.4,
                    color: colors.blue400,
                }}>
                {t("browse")}
            </Typography>
            <Typography
                component="p"
                sx={{
                    m: "0 auto 16px",
                    maxWidth: 920,
                    fontSize: { mobile: "1rem", tablet: "1.05rem" },
                    lineHeight: 1.6,
                    color: colors.grey900,
                }}>
                {t("welcome")}
            </Typography>
            <Typography
                component="p"
                sx={{
                    m: "0 auto",
                    maxWidth: 920,
                    fontSize: { mobile: "1rem", tablet: "1.05rem" },
                    lineHeight: 1.6,
                    color: colors.grey900,
                }}>
                {t("search")}
            </Typography>
        </Box>
    );
};

export default ProjectHeader;
