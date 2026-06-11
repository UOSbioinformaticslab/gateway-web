"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Chip, Divider, Typography } from "@mui/material";
import Paper from "@/components/Paper";

type FilterDetailsMap = typeof import("@/utils/filter-setup").filterDetailsMap;

interface DatasetFiltersGuidancePanelProps {
    selectedFilters: Set<string>;
    onRemoveFilter: (id: string) => void;
}

const DatasetFiltersGuidancePanel = ({
    selectedFilters,
    onRemoveFilter,
}: DatasetFiltersGuidancePanelProps) => {
    const [filterDetailsMap, setFilterDetailsMap] =
        useState<FilterDetailsMap | null>(null);

    useEffect(() => {
        import("@/utils/filter-setup").then(module => {
            setFilterDetailsMap(module.filterDetailsMap);
        });
    }, []);

    const activeTags = useMemo(
        () =>
            filterDetailsMap
                ? Array.from(selectedFilters)
                      .map(id => filterDetailsMap.get(id))
                      .filter(
                          (details): details is NonNullable<typeof details> =>
                              !!details
                      )
                : [],
        [selectedFilters, filterDetailsMap]
    );

    return (
        <Box>
            <Typography
                variant="h2"
                sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    mb: 1.5,
                }}>
                Dataset Filters
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography sx={{ mb: 2 }}>
                Datasets in the CRUK datahub are filtered according to three
                criteria: type of cancer, type of data and access conditions.
            </Typography>
            <Typography sx={{ mb: 3 }}>
                Use ICD-O terminology to categorise each of the cancers covered,
                and keywords to include further important details. This is
                automatically translated to CRUK and TCGA equivalents.
            </Typography>

            <Typography
                variant="h3"
                sx={{
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    mb: 1,
                    color: "text.primary",
                }}>
                Active Tags
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    minHeight: 88,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.300",
                    bgcolor: "white",
                }}>
                {activeTags.length === 0 ? (
                    <Typography
                        sx={{
                            color: "text.disabled",
                            fontStyle: "italic",
                        }}>
                        No filters selected.
                    </Typography>
                ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {activeTags.map(tag => (
                            <Chip
                                key={tag.id}
                                label={tag.label}
                                size="small"
                                onDelete={() => onRemoveFilter(tag.id)}
                                sx={{ bgcolor: "white" }}
                            />
                        ))}
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default DatasetFiltersGuidancePanel;
