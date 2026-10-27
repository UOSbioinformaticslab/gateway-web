"use client";

import { Box, Divider, Paper, Typography } from "@mui/material";
import { Dataset } from "@/interfaces/Dataset";
import { useMemo } from "react";
import {
    PanelBody,
    PanelHeading,
    PanelWrapper,
    SectionHeading,
} from "./FilterTags.styles";
import { colors } from "@/config/theme";
import { splitStringList } from "@/utils/dataset";
import { filterDetailsMap } from "@/utils/filter-setup";

interface FilterItem {
    id: string;
    label: string;
    description?: string;
}

interface FilterCategoryGroup {
    title: string;
    hasPanCancer?: boolean;
    categories: Record<string, FilterItem[]>;
}

const FilterTags = ({ data }: { data: Dataset }) => {
    const datasetVersion = data?.versions?.[0];

    const resourceCreatorRaw =
        datasetVersion?.metadata?.metadata?.accessibility?.usage
            ?.resourceCreator ?? "";
    const controlledKeywordsRaw =
        datasetVersion?.metadata?.metadata?.summary?.controlledKeywords ?? "";

    const resourceCreator = useMemo(() => {
        if (resourceCreatorRaw == null) return "";
        if (typeof resourceCreatorRaw === "string") return resourceCreatorRaw;
        if (typeof resourceCreatorRaw === "object" && "name" in resourceCreatorRaw) {
            const name = (resourceCreatorRaw as { name?: unknown }).name;
            if (typeof name === "string") return name;
        }
        try {
            return JSON.stringify(resourceCreatorRaw);
        } catch {
            return String(resourceCreatorRaw);
        }
    }, [resourceCreatorRaw]);

    const keywords = useMemo((): string[] => {
        const raw = datasetVersion?.metadata?.metadata?.summary?.keywords;
        if (!raw) return [];
        if (Array.isArray(raw)) {
            return raw
                .map(k => String(k).trim())
                .filter(Boolean);
        }
        if (typeof raw === "string") {
            return Array.from(new Set(splitStringList(raw)))
                .map(s => s.trim())
                .filter(Boolean);
        }
        return [String(raw)].map(s => s.trim()).filter(Boolean);
    }, [datasetVersion]);

    const keywordFallback = useMemo(
        () => [
            "Cholangiocarcinoma",
            "Biliary",
            "Organoids",
            "PDX",
            "Drug Screening",
        ],
        []
    );

    const keywordItems = useMemo(
        () =>
            (keywords.length ? keywords : keywordFallback)
                .map(k => String(k).trim())
                .filter(Boolean)
                .slice(0, 50),
        [keywords, keywordFallback]
    );

    const datasetFiltersRaw = useMemo(() => {
        const raw =
            (datasetVersion?.metadata?.metadata as unknown as Record<string, unknown>)?.datasetFilters ||
            (data as unknown as Record<string, unknown>)?.metadata?.metadata?.datasetFilters ||
            (data as unknown as Record<string, unknown>)?.datasetFilters ||
            [];
        return Array.isArray(raw) ? raw : [];
    }, [data, datasetVersion]);

    const derivedDatasetFilters = useMemo(() => {
        if (!datasetFiltersRaw || datasetFiltersRaw.length === 0) return null;

        const groups: Record<string, FilterCategoryGroup> = {
            "cancer-type": { title: "Cancer Type", hasPanCancer: false, categories: {} },
            "data-type": { title: "Data Type", categories: {} },
            "access": { title: "Access Governance", categories: {} },
            "other": { title: "Other Filters", categories: {} },
        };

        datasetFiltersRaw.forEach(filter => {
            const id = String(typeof filter === "object" && filter !== null ? (filter as FilterItem).id : filter || "");
            const canonical = id && filterDetailsMap ? filterDetailsMap.get(id) : null;
            const label = (typeof filter === "object" && filter !== null && (filter as FilterItem).label)
                ? (filter as FilterItem).label
                : (canonical?.label || id);
            const description = (typeof filter === "object" && filter !== null ? (filter as FilterItem).description : undefined) || canonical?.description || "";

            if (id === "0_0_5") {
                groups["cancer-type"].hasPanCancer = true;
                return;
            }

            let groupKey = "other";
            let categoryName = "Miscellaneous";

            if (id.startsWith("0_0_0")) {
                groupKey = "cancer-type";
                categoryName = "ICD-O Topography (Primary Site)";
            } else if (id.startsWith("0_0_1")) {
                groupKey = "cancer-type";
                categoryName = "ICD-O Histology (Morphology)";
            } else if (id.startsWith("0_0_2")) {
                groupKey = "cancer-type";
                categoryName = "CRUK Cancer Terms";
            } else if (id.startsWith("0_0_3")) {
                groupKey = "cancer-type";
                categoryName = "SNOMED-CT";
            } else if (id.startsWith("0_0_4")) {
                groupKey = "cancer-type";
                categoryName = "TCGA Terms";
            } else if (id.startsWith("0_2_0")) {
                groupKey = "data-type";
                categoryName = "Biobank";
            } else if (id.startsWith("0_2_1")) {
                groupKey = "data-type";
                categoryName = "In Vitro";
            } else if (id.startsWith("0_2_2")) {
                groupKey = "data-type";
                categoryName = "Model Organisms";
            } else if (id.startsWith("0_2_3")) {
                groupKey = "data-type";
                categoryName = "Patient Studies";
            } else if (id.startsWith("0_2_4")) {
                groupKey = "data-type";
                categoryName = "Techniques";
            } else if (id.startsWith("0_2")) {
                groupKey = "data-type";
                categoryName = canonical?.category || "Data Modalities";
            } else if (id.startsWith("0_1")) {
                groupKey = "access";
                categoryName = "Access Rights";
            } else {
                groupKey = canonical?.group || "other";
                categoryName = canonical?.category || "Miscellaneous";
            }

            if (!groups[groupKey]) {
                groups[groupKey] = { title: groupKey, categories: {} };
            }
            if (!groups[groupKey].categories[categoryName]) {
                groups[groupKey].categories[categoryName] = [];
            }

            groups[groupKey].categories[categoryName].push({
                id,
                label,
                description,
            });
        });

        // Filter out empty groups
        const activeGroups: Record<string, FilterCategoryGroup> = {};
        Object.entries(groups).forEach(([key, group]) => {
            const hasCategories = Object.keys(group.categories).length > 0;
            const hasPan = Boolean(group.hasPanCancer);
            if (hasCategories || hasPan) {
                activeGroups[key] = group;
            }
        });

        return Object.keys(activeGroups).length > 0 ? activeGroups : null;
    }, [datasetFiltersRaw]);

    type ControlledSection = { title: string; lines: string[] };

    const controlledKeywordSections = useMemo((): ControlledSection[] => {
        if (!controlledKeywordsRaw) return [];

        const lines = (Array.isArray(controlledKeywordsRaw)
            ? controlledKeywordsRaw.map(v => String(v))
            : String(controlledKeywordsRaw)
        )
            .split(/\r?\n|\|/g)
            .map(s => s.trim())
            .filter(Boolean);

        if (lines.length === 0) return [];

        const isSectionHeader = (line: string) => {
            const l = line.trim();
            if (!l) return false;
            if (/^[A-Z]\d{2}-[A-Z]\d{2}\b/.test(l)) return false;
            if (/^\d{3}-\d{3}\b/.test(l)) return false;
            if (/^[A-Z]{2,}[_:]\w+/.test(l)) return false;
            return (
                /^[a-z]+(?:-[a-z]+)+$/.test(l) ||
                (/^[A-Z][A-Za-z\s-]+$/.test(l) && l.length <= 24)
            );
        };

        const sections: ControlledSection[] = [];
        let current: ControlledSection | null = null;

        for (const line of lines) {
            if (isSectionHeader(line)) {
                if (current) sections.push(current);
                current = { title: line, lines: [] };
                continue;
            }

            if (!current) {
                current = { title: "cancer-type", lines: [] };
            }

            current.lines.push(line);
        }

        if (current) sections.push(current);

        const seen = new Set<string>();
        return sections.filter(s => {
            const key = s.title.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [controlledKeywordsRaw]);

    const hardcodedControlledKeywordSections = useMemo((): ControlledSection[] => {
        return [
            {
                title: "cancer-type",
                lines: [
                    "C15-C26 DIGESTIVE ORGANS",
                    "C22 Liver and intrahepatic bile ducts",
                    "814-838 ADENOMAS AND ADENOCARCINOMAS",
                    "8160/3 Cholangiocarcinoma",
                ],
            },
            {
                title: "access-type",
                lines: ["ACCESSTYPE", "ethics approval required", "DUO_0000021"],
            },
            {
                title: "Techniques",
                lines: ["TECHNIQUES", "Imaging Data"],
            },
            {
                title: "data-type",
                lines: [
                    "DATATYPE",
                    "In Vitro Study",
                    "CLINICAL TRIAL",
                    "Clinical Trial",
                    "Phase 0",
                ],
            },
        ];
    }, []);

    const effectiveControlledSections =
        controlledKeywordSections.length > 0
            ? controlledKeywordSections
            : hardcodedControlledKeywordSections;

    const renderPanCancerBadge = () => (
        <Box
            sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "#FFF0F6",
                border: "1px solid #D10A6F",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span>🌐</span>
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#D10A6F" }}>
                    Pan Cancer
                </Typography>
                <Typography
                    sx={{
                        fontSize: 12,
                        color: colors.grey600,
                        display: { mobile: "none", sm: "inline" },
                    }}
                >
                    — applies to multiple cancer types
                </Typography>
            </Box>
            <Typography sx={{ color: "#D10A6F", fontWeight: 700, fontSize: 13 }}>
                ✓
            </Typography>
        </Box>
    );

    const renderDerivedGroup = (groupKey: string, groupData: FilterCategoryGroup) => {
        const categories = groupData.categories || {};
        const categoryEntries = Object.entries(categories).filter(([_, items]) => items && items.length > 0);

        const CANCER_CATEGORY_ORDER = [
            "CRUK Cancer Terms",
            "ICD-O Topography (Primary Site)",
            "ICD-O Histology (Morphology)",
            "TCGA Terms",
            "SNOMED-CT",
        ];

        if (groupKey === "cancer-type") {
            categoryEntries.sort(([catA], [catB]) => {
                const idxA = CANCER_CATEGORY_ORDER.indexOf(catA);
                const idxB = CANCER_CATEGORY_ORDER.indexOf(catB);
                const valA = idxA === -1 ? 99 : idxA;
                const valB = idxB === -1 ? 99 : idxB;
                return valA - valB || catA.localeCompare(catB);
            });
        } else {
            categoryEntries.sort(([catA], [catB]) => catA.localeCompare(catB));
        }

        return (
            <Paper key={groupKey} sx={{ borderRadius: 2, p: 2 }}>
                <SectionHeading variant="h4">{groupData.title || groupKey}</SectionHeading>
                <Divider sx={{ my: 1 }} />

                {/* Pan Cancer: Displayed as a single badge without repeated header */}
                {groupKey === "cancer-type" && groupData.hasPanCancer && renderPanCancerBadge()}

                {/* Categories: Only rendered if items exist (no empty headings) */}
                {categoryEntries.map(([categoryName, items]) => {
                    const sortedItems = [...items].sort((a, b) =>
                        (a.label || "").localeCompare(b.label || "")
                    );
                    return (
                        <Box key={categoryName} sx={{ mb: 2 }}>
                            <Typography
                                sx={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: colors.grey600,
                                    mb: 0.5,
                                }}
                            >
                                {categoryName}
                            </Typography>
                            <Box
                                sx={{
                                    pl: 1.5,
                                    ml: 0.5,
                                    borderLeft: `2px solid ${colors.grey200}`,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0.5,
                                }}
                            >
                                {sortedItems.map(item => (
                                    <Box key={item.id}>
                                        <Typography
                                            sx={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: colors.grey800,
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                        {!!item.description && (
                                            <Typography
                                                sx={{
                                                    fontSize: 12,
                                                    color: colors.grey600,
                                                }}
                                            >
                                                {item.description}
                                            </Typography>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    );
                })}
            </Paper>
        );
    };

    const renderControlledSection = (section: ControlledSection) => {
        const isCodeLine = (s: string) =>
            /^DUO_\d+$/i.test(s) || /^[A-Z]{2,}[_:]\d+$/i.test(s);

        let hasPanCancer = false;
        const items: Array<{
            raw: string;
            isGroup: boolean;
            text: string;
            code?: string;
        }> = [];

        for (const line of section.lines) {
            const trimmed = String(line).trim();
            const cleaned = trimmed.replace(/^[\u2022\-\u2013]\s*/, "");

            // Do not treat Pan Cancer as a repeated group or bullet
            if (cleaned.toLowerCase() === "pan cancer" || cleaned.toLowerCase() === "pan-cancer") {
                hasPanCancer = true;
                continue;
            }

            const isGroup =
                /^[A-Z]\d{2}-[A-Z]\d{2}\b/.test(trimmed) ||
                /^\d{3}-\d{3}\b/.test(trimmed) ||
                (/^[A-Z0-9][A-Z0-9\s-]{6,}$/.test(trimmed) &&
                    trimmed === trimmed.toUpperCase());

            if (!isGroup && isCodeLine(cleaned)) {
                const last = items[items.length - 1];
                if (last && !last.isGroup && !last.code) {
                    last.code = cleaned;
                    continue;
                }
            }

            items.push({ raw: trimmed, isGroup, text: cleaned });
        }

        // Do NOT include heading if there are no terms with that heading
        if (items.length === 0 && !hasPanCancer) {
            return null;
        }

        return (
            <Paper key={section.title} sx={{ borderRadius: 2, p: 2 }}>
                <SectionHeading variant="h4">{section.title}</SectionHeading>
                <Divider sx={{ my: 1 }} />
                {hasPanCancer && renderPanCancerBadge()}
                {items.length > 0 && (
                    <Box sx={{ p: 0, display: "flex", flexDirection: "column" }}>
                        {items.map((item, idx) => {
                            if (item.isGroup) {
                                return (
                                    <Typography
                                        key={`${item.raw}-${idx}`}
                                        sx={{
                                            mt: idx === 0 ? 0 : 1.25,
                                            fontSize: 12,
                                            fontWeight: 800,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            color: colors.grey600,
                                        }}
                                    >
                                        {item.text}
                                    </Typography>
                                );
                            }

                            return (
                                <Box
                                    key={`${item.raw}-${idx}`}
                                    sx={{
                                        p: 0,
                                        pl: 1.5,
                                        mt: 0.5,
                                        ml: 0.5,
                                        borderLeft: `2px solid ${colors.grey200}`,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: colors.grey800,
                                        }}
                                    >
                                        {item.text}
                                    </Typography>
                                    {!!item.code && (
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontStyle: "italic",
                                                color: colors.grey600,
                                                mt: 0.25,
                                            }}
                                        >
                                            {item.code}
                                        </Typography>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Paper>
        );
    };

    return (
        <PanelWrapper sx={{ gridColumn: { tablet: "span 1", laptop: "span 1" } }}>
            <PanelHeading variant="h3">FILTERS &amp; TAGS</PanelHeading>

            <PanelBody>
                {keywordItems.length > 0 && (
                    <Paper sx={{ borderRadius: 2, p: 2 }}>
                        <SectionHeading variant="h4">Keywords</SectionHeading>
                        <Divider sx={{ my: 1 }} />
                        <Box
                            sx={{
                                p: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.75,
                            }}
                        >
                            {keywordItems.map(kw => (
                                <Box
                                    key={kw}
                                    sx={{
                                        p: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: 99,
                                            bgcolor: colors.blue400,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{ color: colors.grey800 }}
                                    >
                                        {kw}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                )}

                {resourceCreator && (
                    <Paper sx={{ borderRadius: 2, p: 2 }}>
                        <SectionHeading variant="h4">Resource Creator</SectionHeading>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                            {resourceCreator}
                        </Typography>
                    </Paper>
                )}

                {derivedDatasetFilters ? (
                    Object.entries(derivedDatasetFilters).map(([groupKey, groupData]) =>
                        renderDerivedGroup(groupKey, groupData)
                    )
                ) : (
                    effectiveControlledSections.map(renderControlledSection)
                )}
            </PanelBody>
        </PanelWrapper>
    );
};

export default FilterTags;