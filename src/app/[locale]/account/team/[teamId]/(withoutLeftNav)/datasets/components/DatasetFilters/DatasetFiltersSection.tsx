"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Checkbox,
    CircularProgress,
    Collapse,
    FormControlLabel,
    InputAdornment,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@/components/Paper";
import NestedFilterTree from "@/components/NestedFilterTree";
import { colors } from "@/config/theme";

type FilterData = typeof import("@/utils/filter-setup").filterData;
type FilterDetailsMap = typeof import("@/utils/filter-setup").filterDetailsMap;

const COLORS = {
    pink: "#D10A6F",
    border: "#AAB7C4",
    lightBg: "#F0F2F5",
};

type FilterTab = "cancer" | "data" | "access";

interface DatasetFiltersSectionProps {
    selectedFilters: Set<string>;
    onFilterChange: (id: string) => void;
}

const pruneHierarchy = (
    nodes: Record<string, unknown> | unknown[] | null | undefined,
    filteredIds: Set<string> | null
) => {
    if (!nodes) return null;
    if (!filteredIds) return nodes;

    const filtered: Record<string, unknown> = {};
    const arr = Array.isArray(nodes) ? nodes : Object.values(nodes);

    arr.forEach((item: { id: string; children?: unknown }) => {
        const kids = pruneHierarchy(
            item.children as Record<string, unknown> | unknown[] | null,
            filteredIds
        );
        if (
            filteredIds.has(item.id) ||
            (kids && Object.keys(kids).length > 0)
        ) {
            filtered[item.id] = { ...item, children: kids };
        }
    });

    return Object.keys(filtered).length > 0 ? filtered : null;
};

const DatasetFiltersSection = ({
    selectedFilters,
    onFilterChange,
}: DatasetFiltersSectionProps) => {
    const [filterData, setFilterData] = useState<FilterData | null>(null);
    const [filterDetailsMap, setFilterDetailsMap] =
        useState<FilterDetailsMap | null>(null);

    useEffect(() => {
        import("@/utils/filter-setup").then(module => {
            setFilterData(module.filterData);
            setFilterDetailsMap(module.filterDetailsMap);
        });
    }, []);

    const [activeTab, setActiveTab] = useState<FilterTab>("cancer");
    const [activeDataSectionId, setActiveDataSectionId] = useState("0_2_0");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredIds, setFilteredIds] = useState<Set<string> | null>(null);

    const allFiltersArray = useMemo(
        () =>
            filterDetailsMap
                ? Array.from(filterDetailsMap.values())
                : [],
        [filterDetailsMap]
    );

    useEffect(() => {
        if (!searchTerm || searchTerm.length < 2) {
            setFilteredIds(null);
            return;
        }

        const activeGroupMap: Record<FilterTab, string> = {
            cancer: "cancer-type",
            data: "data-type",
            access: "access-type",
        };

        const lower = searchTerm.toLowerCase();
        const results = allFiltersArray.filter(
            item =>
                item.group === activeGroupMap[activeTab] &&
                item.label.toLowerCase().includes(lower)
        );
        setFilteredIds(new Set(results.map(item => item.id)));
    }, [searchTerm, activeTab, allFiltersArray]);

    const handleTabChange = (_: React.SyntheticEvent, value: FilterTab) => {
        setActiveTab(value);
        setSearchTerm("");
        setFilteredIds(null);
        if (value === "data") {
            setActiveDataSectionId("0_2_0");
        }
    };

    const cancerGroups = filterData?.["0_0"]?.children;
    const topographyItems = useMemo(
        () =>
            pruneHierarchy(
                cancerGroups?.["0_0_0"]?.children as Record<string, unknown>,
                filteredIds
            ),
        [cancerGroups, filteredIds]
    );
    const histologyItems = useMemo(
        () =>
            pruneHierarchy(
                cancerGroups?.["0_0_1"]?.children as Record<string, unknown>,
                filteredIds
            ),
        [cancerGroups, filteredIds]
    );

    const dataTypeGroups = filterData?.["0_2"]?.children;
    const dataSectionColumns = useMemo(() => {
        const section = (id: string, title: string) => ({
            id,
            title,
            items: dataTypeGroups?.[id]?.children,
        });

        return {
            left: [
                section("0_2_0", "Biobank"),
                section("0_2_2", "Model Organisms"),
                section("0_2_4", "Techniques"),
            ],
            right: [
                section("0_2_1", "In Vitro"),
                section("0_2_3", "Patient Studies"),
            ],
        };
    }, [dataTypeGroups]);

    const allDataSections = useMemo(
        () => [
            ...dataSectionColumns.left,
            ...dataSectionColumns.right,
        ],
        [dataSectionColumns]
    );

    useEffect(() => {
        if (!filteredIds || activeTab !== "data") return;

        const sectionWithMatches = allDataSections.find(section =>
            pruneHierarchy(
                section.items as Record<string, unknown>,
                filteredIds
            )
        );

        if (sectionWithMatches) {
            setActiveDataSectionId(sectionWithMatches.id);
        }
    }, [filteredIds, activeTab, allDataSections]);

    const accessItems = useMemo(
        () =>
            filteredIds
                ? Object.values(filterData?.["0_1"]?.children ?? {}).filter(
                      (item: { id: string }) => filteredIds.has(item.id)
                  )
                : Object.values(filterData?.["0_1"]?.children ?? {}),
        [filteredIds, filterData]
    );

    if (!filterData || !filterDetailsMap) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={32} sx={{ color: COLORS.pink }} />
            </Box>
        );
    }

    const panelSx = {
        flex: 1,
        minWidth: 0,
        p: 2,
        bgcolor: "white",
        borderRadius: 2,
        border: "1px solid",
        borderColor: COLORS.border,
        display: "flex",
        flexDirection: "column",
        maxHeight: 480,
        overflow: "hidden",
    } as const;

    const listScrollSx = {
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        pr: 1,
    } as const;

    const renderSearch = (placeholder: string) => (
        <TextField
            fullWidth
            placeholder={placeholder}
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            size="small"
            variant="outlined"
            sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "white",
                },
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon color="disabled" />
                    </InputAdornment>
                ),
            }}
        />
    );

    const renderCancerTab = () => (
        <Box
            sx={{
                bgcolor: COLORS.lightBg,
                borderRadius: 2,
                p: { mobile: 2, tablet: 2.5 },
            }}>
            <Typography
                variant="h5"
                component="h3"
                sx={{ fontWeight: 700, mb: 1 }}>
                ICD-O Classification
            </Typography>
            <Typography sx={{ mb: 2, color: "text.secondary" }}>
                Please provide the ICD-O Topography and Histology codes. You
                will be asked to provide translations later.
            </Typography>
            {renderSearch("Search ICD-O terms...")}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { mobile: "column", tablet: "row" },
                    gap: 2,
                    alignItems: "stretch",
                }}>
                <Paper elevation={0} sx={panelSx}>
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 1.5 }}>
                        Topography
                    </Typography>
                    <Box sx={listScrollSx}>
                        <NestedFilterTree
                            items={topographyItems}
                            selectedFilters={selectedFilters}
                            onFilterChange={onFilterChange}
                        />
                    </Box>
                </Paper>
                <Paper elevation={0} sx={panelSx}>
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 1.5 }}>
                        Histology
                    </Typography>
                    <Box sx={listScrollSx}>
                        <NestedFilterTree
                            items={histologyItems}
                            selectedFilters={selectedFilters}
                            onFilterChange={onFilterChange}
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );

    const renderDataSectionCard = (section: {
        id: string;
        title: string;
        items: unknown;
    }) => {
        const isActive = activeDataSectionId === section.id;
        const prunedItems = pruneHierarchy(
            section.items as Record<string, unknown>,
            filteredIds
        );

        if (filteredIds && !prunedItems) {
            return null;
        }

        return (
            <Paper
                key={section.id}
                elevation={0}
                sx={{
                    bgcolor: "white",
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: isActive ? colors.blue400 : COLORS.border,
                    boxShadow: isActive
                        ? `inset 0 0 0 1px ${colors.blue400}`
                        : "none",
                    overflow: "hidden",
                }}>
                <Box
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveDataSectionId(section.id)}
                    onKeyDown={event => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setActiveDataSectionId(section.id);
                        }
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        px: 2,
                        py: 1.25,
                        minHeight: 48,
                        cursor: "pointer",
                        bgcolor: isActive ? "white" : COLORS.lightBg,
                        "&:hover": {
                            bgcolor: isActive ? "white" : "grey.100",
                        },
                    }}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: "0.8125rem",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: colors.black,
                        }}>
                        {section.title}
                    </Typography>
                    {isActive ? (
                        <ExpandLess fontSize="small" sx={{ color: "text.secondary" }} />
                    ) : (
                        <ExpandMore fontSize="small" sx={{ color: "text.secondary" }} />
                    )}
                </Box>
                <Collapse in={isActive} timeout="auto">
                    <Box
                        sx={{
                            px: 1,
                            pb: 1.5,
                            pt: 0.5,
                            maxHeight: 320,
                            overflowY: "auto",
                            borderTop: "1px solid",
                            borderColor: "grey.200",
                        }}>
                        <NestedFilterTree
                            items={prunedItems}
                            selectedFilters={selectedFilters}
                            onFilterChange={onFilterChange}
                        />
                    </Box>
                </Collapse>
            </Paper>
        );
    };

    const renderDataTab = () => (
        <Box>
            {renderSearch("Search data types...")}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: COLORS.border,
                }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { mobile: "column", tablet: "row" },
                        gap: 2,
                        maxHeight: 520,
                        overflowY: "auto",
                        pr: 0.5,
                    }}>
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                            minWidth: 0,
                        }}>
                        {dataSectionColumns.left.map(renderDataSectionCard)}
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                            minWidth: 0,
                        }}>
                        {dataSectionColumns.right.map(renderDataSectionCard)}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );

    const renderAccessTab = () => (
        <Box>
            <Typography sx={{ mb: 2, color: "text.secondary" }}>
                Select the access restrictions that apply to your dataset.
            </Typography>
            {renderSearch("Search access terms...")}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    maxHeight: 400,
                    overflowY: "auto",
                    border: "1px solid",
                    borderColor: COLORS.border,
                    borderRadius: 2,
                }}>
                {accessItems.map((item: { id: string; label: string }) => (
                    <FormControlLabel
                        key={item.id}
                        control={
                            <Checkbox
                                checked={selectedFilters.has(item.id)}
                                onChange={() => onFilterChange(item.id)}
                                sx={{
                                    color: COLORS.border,
                                    "&.Mui-checked": { color: COLORS.pink },
                                }}
                            />
                        }
                        label={item.label}
                        sx={{ display: "flex", mb: 0.5 }}
                    />
                ))}
            </Paper>
        </Box>
    );

    return (
        <Box sx={{ p: 0 }}>
            <Typography variant="h2" sx={{ mb: 1 }}>
                Dataset Filters
            </Typography>
            <Typography sx={{ mb: 1 }}>
                Please tag your dataset with specific filters identifying the
                type of cancer covered, the type of data it contains and
                accessibility. This improves the searchability of your dataset.
            </Typography>
            <Typography sx={{ mb: 2, color: colors.red700, fontWeight: 700 }}>
                Required: At least one Topography, one Histology, one Data Type,
                and one Access Type.
            </Typography>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                    mb: 2.5,
                    borderBottom: 1,
                    borderColor: "divider",
                    "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "1rem",
                    },
                    "& .Mui-selected": {
                        color: `${COLORS.pink} !important`,
                    },
                    "& .MuiTabs-indicator": {
                        backgroundColor: COLORS.pink,
                    },
                }}>
                <Tab label="Cancer" value="cancer" />
                <Tab label="Data" value="data" />
                <Tab label="Access" value="access" />
            </Tabs>

            {activeTab === "cancer" && renderCancerTab()}
            {activeTab === "data" && renderDataTab()}
            {activeTab === "access" && renderAccessTab()}
        </Box>
    );
};

export default DatasetFiltersSection;
