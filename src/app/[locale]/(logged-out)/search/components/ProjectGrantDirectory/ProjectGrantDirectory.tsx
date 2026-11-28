"use client";

import { useMemo, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import useGet from "@/hooks/useGet";
import {
    FALLBACK_PROJECT_GRANTS,
    ProjectGrantRecord,
    ProjectGrantRow,
    toProjectGrantRows,
} from "./projectGrants";

const TRANSLATION_PATH = "pages.search.projectGrants";

type SortColumn = keyof Pick<
    ProjectGrantRow,
    "leadResearcher" | "institute" | "startDate" | "endDate" | "grantNumber"
>;

const COLUMNS: { key: SortColumn; label: string }[] = [
    { key: "leadResearcher", label: "leadResearcher" },
    { key: "institute", label: "institute" },
    { key: "startDate", label: "startDate" },
    { key: "endDate", label: "endDate" },
    { key: "grantNumber", label: "grantNumber" },
];

interface ProjectGrantListResponse {
    list?: ProjectGrantRecord[];
}

const ProjectGrantDirectory = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const [query, setQuery] = useState("");
    const [sortColumn, setSortColumn] = useState<SortColumn>("startDate");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [openIds, setOpenIds] = useState<Set<number> | null>(null);

    const { data, isLoading } = useGet<ProjectGrantListResponse>(
        `${apis.projectGrantsV1Url}?per_page=100&sort=created_at:desc`,
        {
            withPagination: true,
            errorNotificationsOn: false,
        }
    );

    const rows = useMemo(() => {
        const fromApi = data?.list ?? [];
        return toProjectGrantRows(
            !isLoading && fromApi.length > 0
                ? fromApi
                : FALLBACK_PROJECT_GRANTS
        );
    }, [data?.list, isLoading]);

    const visibleRows = useMemo(() => {
        const needle = query.trim().toLowerCase();
        const filtered = needle
            ? rows.filter(row =>
                  [
                      row.title,
                      row.leadResearcher,
                      row.institute,
                      row.grantNumber,
                      row.scope,
                  ]
                      .join(" ")
                      .toLowerCase()
                      .includes(needle)
              )
            : rows;

        return [...filtered].sort((a, b) => {
            const left = a[sortColumn] || "";
            const right = b[sortColumn] || "";
            const compared = left.localeCompare(right, undefined, {
                numeric: true,
                sensitivity: "base",
            });
            return sortDirection === "asc" ? compared : -compared;
        });
    }, [query, rows, sortColumn, sortDirection]);

    const allOpen =
        openIds === null ||
        (visibleRows.length > 0 &&
            visibleRows.every(row => openIds.has(row.id)));

    const isOpen = (id: number) => openIds === null || openIds.has(id);

    const toggleSort = (column: SortColumn) => {
        if (column === sortColumn) {
            setSortDirection(current => (current === "asc" ? "desc" : "asc"));
            return;
        }
        setSortColumn(column);
        setSortDirection(column === "startDate" || column === "endDate" ? "desc" : "asc");
    };

    const toggleScope = (id: number) => {
        setOpenIds(current => {
            const next = new Set(
                current ?? visibleRows.map(row => row.id)
            );
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { mobile: "column", tablet: "row" },
                    justifyContent: "space-between",
                    alignItems: { mobile: "stretch", tablet: "center" },
                    gap: 2,
                    mb: 2.5,
                }}>
                <TextField
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder={t("searchPlaceholder")}
                    size="small"
                    sx={{
                        width: { mobile: "100%", tablet: 360 },
                        backgroundColor: colors.white,
                        "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                    slotProps={{
                        htmlInput: { "aria-label": t("searchPlaceholder") },
                    }}
                />
                <Button
                    variant="outlined"
                    onClick={() =>
                        setOpenIds(
                            allOpen
                                ? new Set()
                                : null
                        )
                    }
                    sx={{
                        alignSelf: { mobile: "flex-end", tablet: "auto" },
                        borderRadius: 2,
                        textTransform: "none",
                        color: colors.grey900,
                        borderColor: colors.grey300,
                        backgroundColor: colors.white,
                        px: 2,
                    }}>
                    {allOpen ? t("collapseAll") : t("expandAll")}
                </Button>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        mobile: "1fr",
                        tablet: "1.3fr 1.5fr 1fr 1fr 1.3fr",
                    },
                    backgroundColor: colors.blue400,
                    color: colors.white,
                }}>
                {COLUMNS.map(column => {
                    const active = sortColumn === column.key;
                    return (
                        <Box
                            key={column.key}
                            component="button"
                            type="button"
                            onClick={() => toggleSort(column.key)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 0.5,
                                m: 0,
                                px: 1.5,
                                py: 1.25,
                                border: 0,
                                background: "transparent",
                                color: "inherit",
                                font: "inherit",
                                fontWeight: 700,
                                cursor: "pointer",
                            }}>
                            {t(column.label)}
                            {active &&
                                (sortDirection === "desc" ? (
                                    <KeyboardArrowDownIcon fontSize="small" />
                                ) : (
                                    <KeyboardArrowUpIcon fontSize="small" />
                                ))}
                        </Box>
                    );
                })}
            </Box>

            {visibleRows.length === 0 && (
                <Typography sx={{ mt: 2 }}>{t("noResults")}</Typography>
            )}

            {visibleRows.map(row => (
                <Box key={row.id} sx={{ mt: 1.5 }}>
                    <Typography
                        component="h3"
                        sx={{
                            m: 0,
                            mb: 1,
                            fontWeight: 800,
                            fontSize: "1.05rem",
                            lineHeight: 1.35,
                            color: colors.blue400,
                        }}>
                        {row.title}
                    </Typography>
                    <Box
                        component="button"
                        type="button"
                        onClick={() => toggleScope(row.id)}
                        aria-expanded={isOpen(row.id)}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                mobile: "1fr",
                                tablet: "1.3fr 1.5fr 1fr 1fr 1.3fr",
                            },
                            width: "100%",
                            m: 0,
                            p: 0,
                            border: 0,
                            backgroundColor: "#E6E8EC",
                            color: colors.grey900,
                            font: "inherit",
                            textAlign: "center",
                            cursor: "pointer",
                        }}>
                        {[
                            row.leadResearcher,
                            row.institute,
                            row.startDate,
                            row.endDate,
                            row.grantNumber,
                        ].map((value, index) => (
                            <Box key={COLUMNS[index].key} sx={{ px: 1.5, py: 1.25 }}>
                                {value}
                            </Box>
                        ))}
                    </Box>
                    {isOpen(row.id) && row.scope && (
                        <Typography
                            component="p"
                            sx={{
                                m: 0,
                                mt: 1.5,
                                fontSize: "0.95rem",
                                lineHeight: 1.55,
                                color: colors.grey900,
                            }}>
                            {row.scope}
                        </Typography>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default ProjectGrantDirectory;
