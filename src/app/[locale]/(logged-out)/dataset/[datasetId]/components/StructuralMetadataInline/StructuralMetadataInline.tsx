"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { Fragment, useMemo } from "react";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import type { StructuralMetadataPublicSchema } from "@/interfaces/Dataset";

type StructuralMetadataInlineProps = {
    metadata: StructuralMetadataPublicSchema;
    expandedNames: Set<string>;
    onExpandedNamesChange: (next: Set<string>) => void;
    entriesLabel?: string;
};

export default function StructuralMetadataInline({
    metadata,
    expandedNames,
    onExpandedNamesChange,
    entriesLabel = "520 complete entries",
}: StructuralMetadataInlineProps) {
    const tables = metadata?.tables ?? [];

    const toggle = (name: string) => {
        const next = new Set(expandedNames);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        onExpandedNamesChange(next);
    };

    const allExpanded = useMemo(
        () => tables.length > 0 && tables.every(t => expandedNames.has(t.name)),
        [expandedNames, tables]
    );

    return (
        <TableContainer
            sx={{
                borderRadius: 2,
                border: `1px solid rgba(0,0,0,0.06)`,
                overflow: "hidden",
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 800, color: colors.grey700 }}>
                            ENTITY / DESCRIPTION
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: colors.grey700 }}>
                            COLUMN NAME
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: colors.grey700 }}>
                            TYPE
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: colors.grey700 }}>
                            DESCRIPTION
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {tables.map(table => {
                        const isOpen = expandedNames.has(table.name);
                        return (
                            <Fragment key={table.name}>
                                <TableRow
                                    hover
                                    onClick={() => toggle(table.name)}
                                    sx={{
                                        cursor: "pointer",
                                        bgcolor: "rgba(0, 70, 140, 0.06)",
                                        "&:hover": {
                                            bgcolor: "rgba(0, 70, 140, 0.10)",
                                        },
                                    }}
                                >
                                    <TableCell colSpan={4}>
                                        <Box
                                            sx={{
                                                p: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.25,
                                                    minWidth: 0,
                                                }}
                                            >
                                                <ExpandMoreIcon
                                                    sx={{
                                                        color: colors.blue400,
                                                        transform: isOpen
                                                            ? "rotate(0deg)"
                                                            : "rotate(-90deg)",
                                                        transition:
                                                            "transform 120ms ease",
                                                    }}
                                                />
                                                <Typography
                                                    sx={{
                                                        fontSize: 18,
                                                        fontWeight: 900,
                                                        color: colors.blue400,
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {table.name}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: 14,
                                                        fontStyle: "italic",
                                                        color: colors.grey700,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {table.description}
                                                </Typography>
                                            </Box>

                                            <Typography
                                                sx={{
                                                    fontSize: 14,
                                                    fontWeight: 700,
                                                    color: colors.grey700,
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {entriesLabel}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>

                                {isOpen &&
                                    table.columns.map(col => (
                                        <TableRow key={`${table.name}-${col.name}`}>
                                            <TableCell />
                                            <TableCell
                                                sx={{
                                                    fontFamily:
                                                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {col.name}
                                            </TableCell>
                                            <TableCell>{col.dataType}</TableCell>
                                            <TableCell>{col.description}</TableCell>
                                        </TableRow>
                                    ))}
                            </Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

