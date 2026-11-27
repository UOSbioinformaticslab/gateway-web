"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { colors } from "@/config/theme";
import { TRANSLATION_PATH } from "./constants";

const bodyTextSx = {
    fontWeight: 400,
    fontSize: { mobile: "1.125rem", tablet: "1.1875rem" },
    lineHeight: 1.65,
    color: colors.black,
    maxWidth: 900,
    mx: "auto",
};

export const FilterHeader = () => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Box
            sx={{
                py: { mobile: 3, tablet: 4 },
                px: { mobile: 2, tablet: 3, laptop: 4 },
                textAlign: "center",
            }}>
            <Typography
                component="h2"
                variant="h1"
                sx={{
                    fontWeight: 800,
                    fontSize: { mobile: "2.25rem", tablet: "2.75rem" },
                    lineHeight: 1.2,
                    color: colors.blue400,
                    mb: 2.5,
                    maxWidth: 900,
                    mx: "auto",
                }}>
                {t("intro.title")}
            </Typography>
            <Typography
                component="p"
                variant="h2"
                sx={{
                    fontWeight: 700,
                    fontSize: { mobile: "1.25rem", tablet: "1.375rem" },
                    lineHeight: 1.5,
                    color: colors.grey900,
                    mb: 2,
                    maxWidth: 900,
                    mx: "auto",
                }}>
                {t("intro.welcome")}
            </Typography>
            <Typography
                component="p"
                variant="h3"
                sx={{ ...bodyTextSx, mb: 2 }}>
                {t("intro.catalogue")}
            </Typography>
            <Typography component="p" variant="h3" sx={bodyTextSx}>
                {t("intro.access")}
            </Typography>
        </Box>
    );
};
