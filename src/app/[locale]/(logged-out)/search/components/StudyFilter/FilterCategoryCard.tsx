"use client";

import { Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { FILTER_COLORS, TRANSLATION_PATH } from "./constants";

type FilterCategoryCardProps = {
    title: string;
    count: number;
    selected: boolean;
    onClick: () => void;
};

const FilterCategoryCard = ({
    title,
    count,
    selected,
    onClick,
}: FilterCategoryCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Paper
            elevation={0}
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(event: React.KeyboardEvent) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onClick();
                }
            }}
            sx={{
                minWidth: 0,
                width: "100%",
                minHeight: { mobile: 100, tablet: 108 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: { mobile: 1.125, tablet: 1.5 },
                cursor: "pointer",
                textAlign: "center",
                bgcolor: selected
                    ? "rgba(209, 10, 111, 0.04)"
                    : FILTER_COLORS.white,
                borderRadius: 2,
                border: "2px solid",
                borderColor: FILTER_COLORS.pink,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.06)",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    borderColor: selected
                        ? FILTER_COLORS.pink
                        : FILTER_COLORS.blue,
                    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.08)",
                },
                "&:focus-visible": {
                    outline: `2px solid ${FILTER_COLORS.blue}`,
                    outlineOffset: 2,
                },
            }}>
            <Typography
                sx={{
                    fontWeight: 800,
                    fontSize: { mobile: "1.025rem", tablet: "1.125rem" },
                    lineHeight: 1.35,
                    color: FILTER_COLORS.blue,
                    px: 0.5,
                }}>
                {title}
            </Typography>
            <Typography
                component="span"
                sx={{
                    display: "block",
                    mt: 0.5,
                    fontWeight: 600,
                    fontSize: { mobile: "1.0625rem", tablet: "1.125rem" },
                    color: "text.secondary",
                }}>
                {t("count", { count })}
            </Typography>
        </Paper>
    );
};

export default FilterCategoryCard;
