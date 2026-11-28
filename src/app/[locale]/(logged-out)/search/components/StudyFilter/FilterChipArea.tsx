"use client";

import { useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Button, Chip, Collapse, IconButton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { colors } from "@/config/theme";
import { filterDetailsMap } from "@/utils/filter-setup";
import { buildLogicTokens, LogicToken } from "@/utils/logic-utils";
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

type KeyedToken = LogicToken & { key: string };

const tokenStyle = (token: KeyedToken, selected: boolean) => {
    const selectedRing = selected
        ? { outline: "2px solid #10b981", outlineOffset: 1 }
        : {};

    if (token.kind === "op" && token.value === "AND") {
        return {
            bgcolor: "#ffedd5",
            color: "#9a3412",
            borderColor: "#fed7aa",
            ...selectedRing,
        };
    }
    if (token.kind === "op" && token.value === "OR") {
        return {
            bgcolor: "#fee2e2",
            color: "#991b1b",
            borderColor: "#fecaca",
            ...selectedRing,
        };
    }
    if (token.kind === "paren") {
        return {
            bgcolor: selected ? "#d1fae5" : "#fff",
            color: selected ? "#064e3b" : "#374151",
            borderColor: selected ? "#6ee7b7" : "#d1d5db",
            ...selectedRing,
        };
    }
    return {
        bgcolor: selected ? "#d1fae5" : "#dbeafe",
        color: selected ? "#064e3b" : "#1e40af",
        borderColor: selected ? "#6ee7b7" : "#bfdbfe",
        ...selectedRing,
    };
};

const publishedTokens = (tokens: KeyedToken[]): LogicToken[] =>
    tokens.map(token => {
        if (token.kind === "term") {
            return { kind: "term", id: token.id, label: token.label };
        }
        if (token.kind === "op") {
            return { kind: "op", value: token.value };
        }
        return { kind: "paren", value: token.value };
    });

const FilterLogicSummary = ({
    selectedFilters,
    onTokensChange,
}: {
    selectedFilters: Set<string>;
    onTokensChange?: (tokens: LogicToken[]) => void;
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const filterKey = useMemo(
        () => Array.from(selectedFilters).sort().join("|"),
        [selectedFilters]
    );
    const defaultTokens = useMemo<KeyedToken[]>(
        () =>
            buildLogicTokens(
                Array.from(selectedFilters).map(id => ({ id }))
            ).map((token, index) => ({
                ...token,
                key: `${filterKey}-${index}`,
            })),
        [filterKey, selectedFilters]
    );
    const [editedTokens, setEditedTokens] = useState<KeyedToken[] | null>(
        null
    );
    const [bracketSelection, setBracketSelection] = useState<string[]>([]);
    const tokens = editedTokens ?? defaultTokens;

    useEffect(() => {
        setEditedTokens(null);
        setBracketSelection([]);
    }, [filterKey]);

    useEffect(() => {
        onTokensChange?.(publishedTokens(tokens));
    }, [onTokensChange, tokens]);

    if (tokens.length === 0) return null;

    const updateTokens = (next: KeyedToken[]) => setEditedTokens(next);

    const toggleOperator = (key: string) => {
        updateTokens(
            tokens.map(token =>
                token.key === key && token.kind === "op"
                    ? {
                          ...token,
                          value: token.value === "AND" ? "OR" : "AND",
                      }
                    : token
            )
        );
    };

    const removeToken = (key: string) => {
        updateTokens(tokens.filter(token => token.key !== key));
        setBracketSelection(current => current.filter(item => item !== key));
    };

    const toggleBracketSelection = (key: string) => {
        setBracketSelection(current =>
            current.includes(key)
                ? current.filter(item => item !== key)
                : [...current, key]
        );
    };

    const applyBracket = () => {
        const indexes = tokens.flatMap((token, index) =>
            bracketSelection.includes(token.key) ? [index] : []
        );
        if (indexes.length === 0) return;

        const start = Math.min(...indexes);
        const end = Math.max(...indexes);
        const stamp = Date.now();
        updateTokens([
            ...tokens.slice(0, start),
            { kind: "paren", value: "(", key: `${filterKey}-open-${stamp}` },
            ...tokens.slice(start, end + 1),
            { kind: "paren", value: ")", key: `${filterKey}-close-${stamp}` },
            ...tokens.slice(end + 1),
        ]);
        setBracketSelection([]);
    };

    return (
        <Box
            sx={{
                mt: 1.5,
                px: 2,
                py: 1.5,
                border: "1px solid",
                borderColor: "#d5dbe3",
                borderRadius: 1.5,
                bgcolor: "#fff",
            }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 1.5,
                }}>
                <Typography
                    sx={{
                        color: colors.grey700,
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                    }}>
                    {t("chips.logicDescription")}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                    {editedTokens && (
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                                setEditedTokens(null);
                                setBracketSelection([]);
                            }}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                bgcolor: FILTER_COLORS.blue,
                            }}>
                            {t("chips.resetLogic")}
                        </Button>
                    )}
                    {bracketSelection.length > 0 && (
                        <>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={applyBracket}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 700,
                                    bgcolor: "#059669",
                                    "&:hover": { bgcolor: "#047857" },
                                }}>
                                {t("chips.bracket")}
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setBracketSelection([])}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                    color: "text.secondary",
                                }}>
                                {t("chips.clearSelection")}
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.75,
                    alignItems: "center",
                }}>
                {tokens.map(token => {
                    const selected = bracketSelection.includes(token.key);
                    const palette = tokenStyle(token, selected);
                    const label =
                        token.kind === "term" ? token.label : token.value;

                    if (token.kind === "op") {
                        return (
                            <Box
                                key={token.key}
                                onClick={() => toggleBracketSelection(token.key)}
                                sx={{
                                    ...palette,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    border: "1px solid",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    pl: 0.25,
                                }}>
                                <Box
                                    component="button"
                                    type="button"
                                    title={t("chips.toggleOperator")}
                                    aria-label={`${t("chips.toggleOperator")}: ${token.value}`}
                                    onClick={event => {
                                        event.stopPropagation();
                                        toggleOperator(token.key);
                                    }}
                                    sx={{
                                        border: 0,
                                        bgcolor: "rgba(255,255,255,0.4)",
                                        color: "inherit",
                                        font: "inherit",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        px: 0.75,
                                        py: 0.25,
                                        borderRadius: "4px",
                                        "&:hover": {
                                            bgcolor: "rgba(255,255,255,0.8)",
                                            textDecoration: "underline",
                                        },
                                    }}>
                                    {token.value}
                                </Box>
                                <IconButton
                                    size="small"
                                    aria-label={`${token.value}`}
                                    onClick={event => {
                                        event.stopPropagation();
                                        removeToken(token.key);
                                    }}
                                    sx={{ color: "inherit", p: 0.25 }}>
                                    <CloseIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Box>
                        );
                    }

                    return (
                        <Chip
                            key={token.key}
                            label={label}
                            size="small"
                            onClick={() => toggleBracketSelection(token.key)}
                            onDelete={() => removeToken(token.key)}
                            deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                ...palette,
                                border: "1px solid",
                                fontWeight: 700,
                                height: 30,
                                borderRadius: "4px",
                                cursor: "pointer",
                                "& .MuiChip-label": { px: 1 },
                                "& .MuiChip-deleteIcon": {
                                    color: "inherit",
                                    opacity: 0.75,
                                },
                            }}
                        />
                    );
                })}
            </Box>
        </Box>
    );
};

const FilterChipArea = ({
    selectedFilters,
    handleFilterChange,
    onLogicTokensChange,
}: {
    selectedFilters: Set<string>;
    handleFilterChange: (id: string) => void;
    onLogicTokensChange?: (tokens: LogicToken[]) => void;
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const [logicOpen, setLogicOpen] = useState(false);
    const chips = useMemo(
        () => selectedChips(selectedFilters),
        [selectedFilters]
    );

    useEffect(() => {
        if (chips.length === 0) onLogicTokensChange?.([]);
    }, [chips.length, onLogicTokensChange]);

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
                    onTokensChange={onLogicTokensChange}
                />
            </Collapse>
        </Box>
    );
};

export default FilterChipArea;
