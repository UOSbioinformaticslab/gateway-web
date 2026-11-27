"use client";

import { useMemo } from "react";
import { Checkbox, FormControlLabel, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { filterData } from "@/utils/filter-setup";
import FilterLoading from "./FilterLoading";
import FilterSearchField from "./FilterSearchField";
import { ACCESS_ROOT_ID, FILTER_COLORS, TRANSLATION_PATH } from "./constants";
import { FilterNode, FilterPanelProps, FilterTree } from "./types";

const tree = filterData as FilterTree;

const AccessibilityPanel = ({
    handleFilterChange,
    selectedFilters,
    searchTerm,
    setSearchTerm,
    filteredIds,
    isSearching,
}: FilterPanelProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const accessChildren = tree[ACCESS_ROOT_ID]?.children;
    const items = useMemo(
        () => (accessChildren ? Object.values(accessChildren) : []),
        [accessChildren]
    );
    const visibleItems = useMemo(() => {
        if (!filteredIds) return items;
        return items.filter(item => filteredIds.has(item.id));
    }, [filteredIds, items]);

    if (!accessChildren) return <FilterLoading />;

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ mb: 1, color: FILTER_COLORS.blue }}>
                {t("accessPanel.title")}
            </Typography>
            <FilterSearchField
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isSearching={isSearching}
                placeholder={t("accessPanel.search")}
            />
            <Paper
                variant="outlined"
                sx={{ p: 2, maxHeight: 400, overflowY: "auto" }}>
                {visibleItems.map((item: FilterNode) => (
                    <FormControlLabel
                        key={item.id}
                        control={
                            <Checkbox
                                checked={selectedFilters.has(item.id)}
                                onChange={() => handleFilterChange(item.id)}
                                sx={{
                                    color: FILTER_COLORS.border,
                                    "&.Mui-checked": {
                                        color: FILTER_COLORS.pink,
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography variant="body2">
                                {item.label}
                            </Typography>
                        }
                        sx={{ display: "flex", width: "100%", mb: 1 }}
                    />
                ))}
            </Paper>
        </Paper>
    );
};

export default AccessibilityPanel;
