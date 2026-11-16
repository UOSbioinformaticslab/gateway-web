"use client";

import React, { useState } from "react";
import {
    Box,
    Button,
    Chip,
    Collapse,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SuggestedFilterItem } from "@/utils/filterRecommenderUtils";
import { colors } from "@/config/theme";

export interface ProposedFilterAreaProps {
    suggestions: SuggestedFilterItem[];
    title?: string;
    onAccept: (id: string) => void;
    onDismiss: (id: string) => void;
    onAcceptAll?: () => void;
    onDismissAll?: () => void;
}

export const ProposedFilterArea: React.FC<ProposedFilterAreaProps> = ({
    suggestions = [],
    title = "Recommended Filters",
    onAccept,
    onDismiss,
    onAcceptAll,
    onDismissAll,
}) => {
    const [expandedSnippetIds, setExpandedSnippetIds] = useState<Set<string>>(new Set());

    if (!suggestions || suggestions.length === 0) return null;

    const toggleSnippetExpand = (id: string) => {
        setExpandedSnippetIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const renderSnippetWithHighlight = (snippetText?: string, highlightWord?: string) => {
        if (!snippetText) return null;
        if (!highlightWord) return snippetText;
        try {
            const escaped = highlightWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const parts = snippetText.split(new RegExp(`(${escaped})`, "gi"));
            return parts.map((part, i) =>
                part.toLowerCase() === highlightWord.toLowerCase() ? (
                    <Box
                        component="mark"
                        key={i}
                        sx={{
                            backgroundColor: "#FEF3C7",
                            color: "#78350F",
                            fontWeight: 700,
                            px: 0.5,
                            py: 0.2,
                            borderRadius: "4px",
                            border: "1px solid #FCD34D",
                        }}
                    >
                        {part}
                    </Box>
                ) : (
                    <span key={i}>{part}</span>
                )
            );
        } catch {
            return snippetText;
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                p: 2.5,
                borderRadius: "12px",
                border: "1px solid #BFDBFE",
                backgroundColor: "#F8FAFC",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 2,
                    pb: 1.5,
                    borderBottom: "1px solid #E2E8F0",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AutoAwesomeIcon sx={{ color: "#2563EB", fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E3A8A", m: 0 }}>
                        {title}
                    </Typography>
                    <Chip
                        size="small"
                        label={`${suggestions.length} candidate${suggestions.length === 1 ? "" : "s"}`}
                        sx={{
                            backgroundColor: "#DBEAFE",
                            color: "#1D4ED8",
                            fontWeight: 600,
                            fontSize: "11px",
                            height: 22,
                        }}
                    />
                </Box>

                <Stack direction="row" spacing={1}>
                    {onAcceptAll && (
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={onAcceptAll}
                            startIcon={<CheckIcon fontSize="small" />}
                            sx={{
                                textTransform: "none",
                                fontSize: "12px",
                                fontWeight: 600,
                                borderColor: "#10B981",
                                color: "#065F46",
                                backgroundColor: "#ECFDF5",
                                "&:hover": {
                                    backgroundColor: "#D1FAE5",
                                    borderColor: "#059669",
                                },
                            }}
                        >
                            Accept All ({suggestions.length})
                        </Button>
                    )}
                    {onDismissAll && (
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={onDismissAll}
                            startIcon={<CloseIcon fontSize="small" />}
                            sx={{
                                textTransform: "none",
                                fontSize: "12px",
                                fontWeight: 600,
                                borderColor: "#E2E8F0",
                                color: "#64748B",
                                backgroundColor: "#FFFFFF",
                                "&:hover": {
                                    backgroundColor: "#F1F5F9",
                                    borderColor: "#CBD5E1",
                                },
                            }}
                        >
                            Dismiss All
                        </Button>
                    )}
                </Stack>
            </Box>

            {/* Suggestions Cards Grid */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(auto-fill, minmax(320px, 1fr))" },
                    gap: 1.5,
                }}
            >
                {suggestions.map(item => {
                    const isExpanded = expandedSnippetIds.has(item.id);
                    const ev = item.evidence;
                    const matchedWord = ev?.matchedTerm || "";
                    const snippet = ev?.snippet || "";

                    let categoryBg = "#F1F5F9";
                    let categoryColor = "#334155";
                    if (item.id.startsWith("0_0")) {
                        categoryBg = "#FFE4E6";
                        categoryColor = "#9F1239";
                    } else if (item.id.startsWith("0_1")) {
                        categoryBg = "#D1FAE5";
                        categoryColor = "#065F46";
                    } else if (item.id.startsWith("0_2")) {
                        categoryBg = "#E0E7FF";
                        categoryColor = "#3730A3";
                    }

                    return (
                        <Paper
                            key={item.id}
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: "8px",
                                border: "1px solid #E2E8F0",
                                backgroundColor: "#FFFFFF",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                transition: "all 0.15s ease-in-out",
                                "&:hover": {
                                    borderColor: "#CBD5E1",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                                },
                            }}
                        >
                            {/* Card Top: Filter details & action buttons */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", mb: 0.5 }}>
                                        <Chip
                                            size="small"
                                            label={item.id}
                                            sx={{
                                                fontSize: "10px",
                                                fontFamily: "monospace",
                                                height: 20,
                                                fontWeight: 700,
                                                backgroundColor: "#F1F5F9",
                                                color: "#475569",
                                            }}
                                        />
                                        {item.category && (
                                            <Chip
                                                size="small"
                                                label={item.category}
                                                sx={{
                                                    fontSize: "10px",
                                                    height: 20,
                                                    fontWeight: 600,
                                                    backgroundColor: categoryBg,
                                                    color: categoryColor,
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 700,
                                            color: "#0F172A",
                                            lineHeight: 1.3,
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </Box>

                                {/* Action Buttons */}
                                <Stack direction="row" spacing={0.5} sx={{ shrink: 0 }}>
                                    <Tooltip title="Accept filter suggestion">
                                        <IconButton
                                            size="small"
                                            onClick={() => onAccept(item.id)}
                                            sx={{
                                                backgroundColor: "#ECFDF5",
                                                color: "#059669",
                                                border: "1px solid #A7F3D0",
                                                "&:hover": { backgroundColor: "#D1FAE5" },
                                            }}
                                        >
                                            <CheckIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Dismiss filter suggestion">
                                        <IconButton
                                            size="small"
                                            onClick={() => onDismiss(item.id)}
                                            sx={{
                                                backgroundColor: "#FEF2F2",
                                                color: "#DC2626",
                                                border: "1px solid #FECACA",
                                                "&:hover": { backgroundColor: "#FEE2E2" },
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Box>

                            {/* Evidence & Snippet */}
                            {ev && (
                                <Box
                                    sx={{
                                        mt: 1.5,
                                        p: 1.25,
                                        borderRadius: "6px",
                                        backgroundColor: "#F8FAFC",
                                        border: "1px solid #E2E8F0",
                                        fontSize: "11px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            mb: 0.5,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 600 }}>
                                            Trigger in <code>{ev.sourceField || "metadata"}</code>
                                        </Typography>
                                        {ev.instancesInMetadata && ev.instancesInMetadata > 1 && (
                                            <Typography sx={{ fontSize: "10px", color: "#2563EB", fontWeight: 700 }}>
                                                {ev.instancesInMetadata} matches
                                            </Typography>
                                        )}
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontSize: "11px",
                                            fontFamily: "monospace",
                                            color: "#334155",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {renderSnippetWithHighlight(snippet, matchedWord)}
                                    </Typography>

                                    {ev.ruleRationale && (
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.75 }}>
                                            <InfoOutlinedIcon sx={{ fontSize: 13, color: "#64748B" }} />
                                            <Typography sx={{ fontSize: "10px", color: "#64748B", fontStyle: "italic" }}>
                                                {ev.ruleRationale}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Paper>
                    );
                })}
            </Box>
        </Paper>
    );
};

export default ProposedFilterArea;
