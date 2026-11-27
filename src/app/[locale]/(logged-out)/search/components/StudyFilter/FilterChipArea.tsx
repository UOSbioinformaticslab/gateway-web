"use client";

import { useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Button, Chip, Collapse, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { colors } from "@/config/theme";
import { filterDetailsMap } from "@/utils/filter-setup";
import { FILTER_COLORS, TRANSLATION_PATH } from "./constants";
import { FilterDetail } from "./types";

type FilterChip = {
    fullId: string;
    label: string;
    category: string;
};

const selectedChips = (selectedFilters: Set<string>): FilterChip[] =>
    Array.from(selectedFilters).flatMap(fullId => {
        const details = filterDetailsMap.get(fullId) as
            | FilterDetail
            | undefined;
        if (!details) return [];
        return [
            {
                fullId,
                label: details.label,
                category: details.category,
            },
        ];
    });

const FilterLogicSummary = ({
    selectedFilters,
    handleFilterChange,
}: {
    selectedFilters: Set<string>;
    handleFilterChange: (id: string) => void;
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const chips = useMemo(
        () => selectedChips(selectedFilters),
        [selectedFilters]
    );

    if (chips.length === 0) return null;

    return (
        <Box
            sx={{
                mt: 1.5,
                px: 2,
                py: 1.5,
                border: "1px solid",
                borderColor: "#d5dbe3",
                borderRadius: 1.5,
                bgcolor: "#fbfcfd",
            }}>
            <Typography
                sx={{
                    color: colors.grey700,
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    mb: 1.5,
                }}>
                {t("chips.logicDescription")}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    alignItems: "center",
                }}>
                {chips.map(chip => (
                    <Chip
                        key={chip.fullId}
                        label={chip.label}
                        onDelete={() => handleFilterChange(chip.fullId)}
                        deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                        size="small"
                        sx={{
                            bgcolor: "#e7f0f8",
                            color: FILTER_COLORS.blue,
                            fontWeight: 600,
                            height: 30,
                            borderRadius: 1,
                            "& .MuiChip-deleteIcon": {
                                color: FILTER_COLORS.blue,
                                "&:hover": { color: FILTER_COLORS.pink },
                            },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

const FilterChipArea = ({
    selectedFilters,
    handleFilterChange,
}: {
    selectedFilters: Set<string>;
    handleFilterChange: (id: string) => void;
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const [logicOpen, setLogicOpen] = useState(false);
    const chips = useMemo(
        () => selectedChips(selectedFilters),
        [selectedFilters]
    );

    if (chips.length === 0) return null;

    return (
        <Box sx={{ mx: { mobile: 2, tablet: 2.5 }, mt: 1.5, mb: 1 }}>
            <Box
                sx={{
                    px: 1.5,
                    py: 1.25,
                    border: "1px solid",
                    borderColor: "grey.300",
                    borderRadius: 2,
                    bgcolor: FILTER_COLORS.white,
                }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {chips.map(chip => (
                        <Chip
                            key={chip.fullId}
                            label={
                                <span>
                                    <span style={{ opacity: 0.7 }}>
                                        {chip.category}:{" "}
                                    </span>
                                    <strong>{chip.label}</strong>
                                </span>
                            }
                            onDelete={() => handleFilterChange(chip.fullId)}
                            deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                            variant="outlined"
                            size="small"
                            sx={{
                                color: "text.primary",
                                borderColor: FILTER_COLORS.border,
                                bgcolor: "white",
                                fontWeight: 500,
                                height: 30,
                            }}
                        />
                    ))}
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 0.75 }}>
                <Button
                    size="small"
                    onClick={() => setLogicOpen(open => !open)}
                    endIcon={logicOpen ? <ExpandLess /> : <ExpandMore />}
                    sx={{
                        textTransform: "none",
                        color: FILTER_COLORS.blue,
                        fontWeight: 600,
                        fontSize: "0.95rem",
                    }}>
                    {logicOpen ? t("chips.hideLogic") : t("chips.showLogic")}
                </Button>
            </Box>
            <Collapse in={logicOpen}>
                <FilterLogicSummary
                    selectedFilters={selectedFilters}
                    handleFilterChange={handleFilterChange}
                />
            </Collapse>
        </Box>
    );
};

export default FilterChipArea;
