"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { colors } from "@/config/theme";
import { filterDetailsMap } from "@/utils/filter-setup";
import { executeFilterLogic } from "@/utils/filterLogic";
import {
    calculateLogicMessage,
    filterType,
    getMessage,
    includeParents,
    plusParents,
} from "@/utils/logic-utils";
import AccessibilityPanel from "./AccessibilityPanel";
import CancerTypePanel from "./CancerTypePanel";
import DataTypePanel from "./DataTypePanel";
import FilterCategoryCard from "./FilterCategoryCard";
import FilterChipArea from "./FilterChipArea";
import HelpDialog from "./HelpDialog";
import {
    FILTER_COLORS,
    MIN_SEARCH_LENGTH,
    PAN_CANCER_FILTER_ID,
    PANEL_GROUP,
    SEARCH_DEBOUNCE_MS,
    TRANSLATION_PATH,
} from "./constants";
import {
    FilterDetail,
    FilterPanelId,
    FilterTree,
    PruneHierarchy,
} from "./types";

const pruneHierarchy: PruneHierarchy = (nodes, currentFilteredIds) => {
    if (!nodes) return null;
    if (!currentFilteredIds) return nodes;

    const filtered: FilterTree = {};
    Object.values(nodes).forEach(item => {
        const children = pruneHierarchy(item.children, currentFilteredIds);
        if (currentFilteredIds.has(item.id) || children) {
            filtered[item.id] = {
                ...item,
                children: children ?? undefined,
            };
        }
    });

    return Object.keys(filtered).length > 0 ? filtered : null;
};

const CATEGORIES: {
    id: FilterPanelId;
    titleKey: string;
    countKey: "cancer" | "data" | "access";
}[] = [
    { id: "cancer", titleKey: "categories.cancer", countKey: "cancer" },
    { id: "data", titleKey: "categories.data", countKey: "data" },
    { id: "access", titleKey: "categories.access", countKey: "access" },
];

const StudyFilter = ({
    onSelectedFiltersChange,
}: {
    onSelectedFiltersChange?: (ids: string[]) => void;
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const [activePanel, setActivePanel] = useState<FilterPanelId | null>(null);
    const [helpOpen, setHelpOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
        () => new Set()
    );
    const [logicMessage, setLogicMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredIds, setFilteredIds] = useState<Set<string> | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const allFilters = useMemo(
        () => Array.from(filterDetailsMap.values()) as FilterDetail[],
        []
    );

    useEffect(() => {
        const filters = Array.from(selectedFilters).map(id => ({ id }));
        setLogicMessage(
            calculateLogicMessage({
                filters,
                filterType: (id: string) =>
                    id === PAN_CANCER_FILTER_ID ? "cruk" : filterType(id),
                plusParents,
                includeParents,
                getMessage,
            })
        );
    }, [selectedFilters]);

    useEffect(() => {
        onSelectedFiltersChange?.(Array.from(selectedFilters));
    }, [onSelectedFiltersChange, selectedFilters]);

    useEffect(() => {
        if (
            !searchTerm ||
            searchTerm.length < MIN_SEARCH_LENGTH ||
            !activePanel
        ) {
            setFilteredIds(null);
            setIsSearching(false);
            return undefined;
        }

        const timer = setTimeout(() => {
            setIsSearching(true);
            const activeGroup = PANEL_GROUP[activePanel];
            const query = searchTerm.toLowerCase();
            const matches = allFilters.filter(
                item =>
                    item.group === activeGroup &&
                    item.label.toLowerCase().includes(query)
            );
            setFilteredIds(new Set(matches.map(item => item.id)));
            setIsSearching(false);
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [activePanel, allFilters, searchTerm]);

    const counts = useMemo(() => {
        const next = {
            total: selectedFilters.size,
            cancer: 0,
            data: 0,
            access: 0,
        };

        selectedFilters.forEach(id => {
            if (id === PAN_CANCER_FILTER_ID) return;
            const group = (filterDetailsMap.get(id) as FilterDetail | undefined)
                ?.group;
            if (group === PANEL_GROUP.cancer) next.cancer += 1;
            else if (group === PANEL_GROUP.data) next.data += 1;
            else if (group === PANEL_GROUP.access) next.access += 1;
        });

        return next;
    }, [selectedFilters]);

    const handleFilterChange = useCallback((id: string) => {
        setSelectedFilters(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const clearAllFilters = useCallback(() => {
        setSelectedFilters(new Set());
        setSearchTerm("");
        setLogicMessage("");
    }, []);

    const handleFindStudies = useCallback(() => {
        if (counts.total > 0 && logicMessage) {
            executeFilterLogic(logicMessage);
        }
    }, [counts.total, logicMessage]);

    const openPanel = (panel: FilterPanelId) => {
        setActivePanel(panel);
        setSearchTerm("");
    };

    const panelProps = {
        handleFilterChange,
        selectedFilters,
        searchTerm,
        setSearchTerm,
        filteredIds,
        isSearching,
        pruneHierarchy,
    };

    return (
        <Box
            sx={{
                bgcolor: "#fff",
                borderTopLeftRadius: "0.75rem",
                borderTopRightRadius: "0.75rem",
                boxShadow: "0px 1px 0px 1px #e5e7eb",
                borderTop: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
            }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { mobile: "column", tablet: "row" },
                    alignItems: { tablet: "stretch" },
                    width: "100%",
                    borderBottom: "1px solid",
                    borderColor: "grey.200",
                    columnGap: { mobile: 0, tablet: 2, laptop: 3 },
                    rowGap: { mobile: 2, tablet: 0 },
                }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1.5,
                        flexWrap: "wrap",
                        px: { mobile: 2, tablet: 2.5 },
                        py: 2,
                        borderRight: { tablet: `1px solid ${colors.grey300}` },
                        flexShrink: 0,
                        minWidth: { tablet: 200, laptop: 220 },
                    }}>
                    <Typography
                        component="h2"
                        variant="h2"
                        sx={{
                            fontWeight: 700,
                            color: colors.blue400,
                            lineHeight: 1.2,
                            m: 0,
                        }}>
                        {t("heading")}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setHelpOpen(true)}
                        sx={{
                            flexShrink: 0,
                            alignSelf: "center",
                            textTransform: "none",
                            fontWeight: 600,
                            minWidth: 0,
                            py: 0.375,
                            px: 1.25,
                            lineHeight: 1.25,
                        }}>
                        {t("help")}
                    </Button>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        display: "grid",
                        gridTemplateColumns: {
                            mobile: "1fr",
                            tablet: "repeat(3, minmax(0, 1fr))",
                        },
                        alignItems: "stretch",
                        columnGap: { mobile: 0, tablet: 2, laptop: 3 },
                        rowGap: { mobile: 2, tablet: 0 },
                        px: { mobile: 2, tablet: 1.5 },
                        py: 2,
                        minWidth: 0,
                    }}>
                    {CATEGORIES.map(category => (
                        <FilterCategoryCard
                            key={category.id}
                            title={t(category.titleKey)}
                            count={counts[category.countKey]}
                            selected={activePanel === category.id}
                            onClick={() => openPanel(category.id)}
                        />
                    ))}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 1.25,
                        px: { mobile: 2, tablet: 2.5 },
                        py: 2,
                        borderLeft: { tablet: `1px solid ${colors.grey300}` },
                        flexShrink: 0,
                    }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={clearAllFilters}
                        disabled={counts.total === 0}
                        sx={{
                            textTransform: "none",
                            bgcolor: FILTER_COLORS.white,
                            borderColor: FILTER_COLORS.border,
                            fontWeight: 600,
                        }}>
                        {t("clear")}
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleFindStudies}
                        disabled={counts.total === 0}
                        sx={{
                            bgcolor: FILTER_COLORS.pink,
                            "&:hover": { bgcolor: FILTER_COLORS.pinkHover },
                            fontWeight: 700,
                            px: 3,
                            textTransform: "none",
                        }}>
                        {t("find", { count: counts.total })}
                    </Button>
                </Box>
            </Box>
            <FilterChipArea
                selectedFilters={selectedFilters}
                handleFilterChange={handleFilterChange}
            />
            <Box sx={{ p: 0 }}>
                {activePanel === "cancer" && (
                    <CancerTypePanel {...panelProps} />
                )}
                {activePanel === "data" && <DataTypePanel {...panelProps} />}
                {activePanel === "access" && (
                    <AccessibilityPanel {...panelProps} />
                )}
            </Box>
            <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
        </Box>
    );
};

export default StudyFilter;
