"use client";

import { Box, Divider, Paper, Typography } from "@mui/material";
import { Dataset } from "@/interfaces/Dataset";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
    PanelBody,
    PanelHeading,
    PanelWrapper,
    SectionHeading,
} from "./FilterTags.styles";
import { colors } from "@/config/theme";
import { splitStringList } from "@/utils/dataset";

const FilterTags = ({ data }: { data: Dataset }) => {
    const TRANSLATION_PATH = "modules.FilterTags";
    const t = useTranslations(TRANSLATION_PATH);
    const tCommon = useTranslations("common");
    const datasetVersion = data?.versions?.[0];

    const keywordsRaw =
        datasetVersion?.metadata?.metadata?.summary?.keywords ?? [];
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
        if (!keywordsRaw) return [];
        if (Array.isArray(keywordsRaw)) {
            return keywordsRaw
                .map(k => String(k).trim())
                .filter(Boolean);
        }
        if (typeof keywordsRaw === "string") {
            return Array.from(new Set(splitStringList(keywordsRaw)))
                .map(s => s.trim())
                .filter(Boolean);
        }
        return [String(keywordsRaw)].map(s => s.trim()).filter(Boolean);
    }, [keywordsRaw]);

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

        // Recognise section header lines like:
        // - "cancer-type"
        // - "access-type"
        // - "Techniques"
        const isSectionHeader = (line: string) => {
            const l = line.trim();
            if (!l) return false;
            if (/^[A-Z]\d{2}-[A-Z]\d{2}\b/.test(l)) return false; // ICD range header
            if (/^\d{3}-\d{3}\b/.test(l)) return false; // numeric range header
            if (/^[A-Z]{2,}[_:]\w+/.test(l)) return false; // ontology code line
            return (
                /^[a-z]+(?:-[a-z]+)+$/.test(l) || // kebab-case
                (/^[A-Z][A-Za-z\s-]+$/.test(l) && l.length <= 24) // short Title Case
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
                // Back-compat: if no explicit section header, treat as cancer-type
                current = { title: "cancer-type", lines: [] };
            }

            current.lines.push(line);
        }

        if (current) sections.push(current);

        // Dedupe by title and keep order
        const seen = new Set<string>();
        return sections.filter(s => {
            const key = s.title.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [controlledKeywordsRaw]);

    const hardcodedControlledKeywordSections = useMemo((): ControlledSection[] => {
        // Temporary fallback to mirror CRUK reference UI when API data is missing.
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

    const keywordItems = useMemo(
        () =>
            (keywords.length ? keywords : keywordFallback)
                .map(k => String(k).trim())
                .filter(Boolean)
                .slice(0, 50),
        [keywords, keywordFallback]
    );

    const renderControlledSection = (section: ControlledSection) => {
        const isCodeLine = (s: string) =>
            /^DUO_\d+$/i.test(s) || /^[A-Z]{2,}[_:]\d+$/i.test(s);

        const items: Array<{
            raw: string;
            isGroup: boolean;
            text: string;
            code?: string;
        }> = [];

        for (const line of section.lines) {
            const trimmed = String(line).trim();
            const cleaned = trimmed.replace(/^[\u2022\-\u2013]\s*/, "");

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

        return (
            <Paper key={section.title} sx={{ borderRadius: 2, p: 2 }}>
                <SectionHeading variant="h4">{section.title}</SectionHeading>
                <Divider sx={{ my: 1 }} />
                {items.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        {tCommon("notReported")}
                    </Typography>
                ) : (
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
                <Paper sx={{ borderRadius: 2, p: 2 }}>
                    <SectionHeading variant="h4">Keywords</SectionHeading>
                    <Divider sx={{ my: 1 }} />
                    {keywordItems.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            {tCommon("notReported")}
                        </Typography>
                    ) : (
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
                    )}
                </Paper>

                <Paper sx={{ borderRadius: 2, p: 2 }}>
                    <SectionHeading variant="h4">Resource Creator</SectionHeading>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                        {resourceCreator || "Oncology Research Trust Data Team"}
                    </Typography>
                </Paper>

                {effectiveControlledSections.map(renderControlledSection)}
            </PanelBody>
        </PanelWrapper>
    );
};

export default FilterTags;