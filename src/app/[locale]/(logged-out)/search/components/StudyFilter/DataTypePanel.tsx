"use client";

import { Box, Grid, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { filterData } from "@/utils/filter-setup";
import FilterLoading from "./FilterLoading";
import FilterSearchField from "./FilterSearchField";
import NestedFilterList from "./NestedFilterList";
import {
    DATA_TYPE_ROOT_ID,
    DATA_TYPE_SECTIONS,
    FILTER_COLORS,
    TRANSLATION_PATH,
} from "./constants";
import { FilterPanelProps, FilterTree } from "./types";

const tree = filterData as FilterTree;

const DataTypePanel = ({
    handleFilterChange,
    selectedFilters,
    searchTerm,
    setSearchTerm,
    filteredIds,
    isSearching,
    pruneHierarchy,
}: FilterPanelProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const dataTypeGroups = tree[DATA_TYPE_ROOT_ID]?.children;

    if (!dataTypeGroups) return <FilterLoading />;

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { sm: "center" },
                    gap: 2,
                    textAlign: { xs: "center", sm: "left" },
                }}>
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{ mb: 1, color: FILTER_COLORS.blue }}>
                    {t("dataTypes.title")}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}>
                    {t("dataTypes.subtitle")}
                </Typography>
            </Box>
            <FilterSearchField
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isSearching={isSearching}
                placeholder={t("dataTypes.search")}
            />
            <Grid container spacing={1.5}>
                {DATA_TYPE_SECTIONS.map(section => (
                    <Grid size={2.4} key={section.nodeId}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                bgcolor: FILTER_COLORS.lightBg,
                                height: "100%",
                            }}>
                            <Typography
                                variant="subtitle2"
                                fontWeight="bold"
                                gutterBottom
                                sx={{
                                    borderBottom: 1,
                                    borderColor: "divider",
                                    pb: 1,
                                }}>
                                {t(section.titleKey)}
                            </Typography>
                            <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                                <NestedFilterList
                                    items={pruneHierarchy(
                                        dataTypeGroups[section.nodeId]
                                            ?.children,
                                        filteredIds
                                    )}
                                    handleFilterChange={handleFilterChange}
                                    selectedFilters={selectedFilters}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default DataTypePanel;
