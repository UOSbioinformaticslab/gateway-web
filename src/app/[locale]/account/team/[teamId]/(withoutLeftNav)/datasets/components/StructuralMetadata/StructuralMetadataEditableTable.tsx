"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { StructuralMetadata } from "@/interfaces/Dataset";
import { colors } from "@/config/theme";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";

const TRANSLATION_PATH = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset.structuralMetadata`;

const TABLE_HEADER_BG = "rgba(0, 70, 140, 0.12)";
const COLUMN_HEADER_BG = colors.green50;

export type StructuralMetadataRow = {
    id: string;
    tableName: string;
    tableDescription: string;
    tableSize: string;
    columnName: string;
    dataType: string;
};

const createRowId = () => `row-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const createGhostRow = (): StructuralMetadataRow => ({
    id: createRowId(),
    tableName: "",
    tableDescription: "",
    tableSize: "",
    columnName: "",
    dataType: "",
});

export const tablesToRows = (
    tables: StructuralMetadata[]
): StructuralMetadataRow[] => {
    if (!tables.length) {
        return [createGhostRow()];
    }

    const rows: StructuralMetadataRow[] = [];

    tables.forEach(table => {
        const tableSize = table.size ?? "";

        if (!table.columns.length) {
            rows.push({
                id: createRowId(),
                tableName: table.name,
                tableDescription: table.description,
                tableSize,
                columnName: "",
                dataType: "",
            });
            return;
        }

        table.columns.forEach((column, index) => {
            rows.push({
                id: createRowId(),
                tableName: index === 0 ? table.name : "",
                tableDescription: index === 0 ? table.description : "",
                tableSize: index === 0 ? tableSize : "",
                columnName: column.name,
                dataType: column.dataType,
            });
        });
    });

    rows.push(createGhostRow());
    return rows;
};

export const rowsToTables = (
    rows: StructuralMetadataRow[]
): StructuralMetadata[] => {
    const tables: StructuralMetadata[] = [];
    let currentTable: StructuralMetadata | null = null;

    rows.forEach(row => {
        const hasTableInfo = row.tableName.trim().length > 0;
        const hasColumnInfo = row.columnName.trim().length > 0;

        if (!hasTableInfo && !hasColumnInfo) {
            return;
        }

        if (hasTableInfo) {
            if (currentTable) {
                tables.push(currentTable);
            }
            currentTable = {
                name: row.tableName.trim(),
                description: row.tableDescription.trim(),
                size: row.tableSize.trim() || undefined,
                columns: [],
            };
        }

        if (!currentTable) {
            return;
        }

        if (hasColumnInfo) {
            currentTable.columns.push({
                name: row.columnName.trim(),
                description: "",
                dataType: row.dataType.trim(),
                sensitive: false,
                values: [],
            });
        }
    });

    if (currentTable) {
        tables.push(currentTable);
    }

    return tables;
};

const isRowEmpty = (row: StructuralMetadataRow) =>
    !row.tableName.trim() &&
    !row.tableDescription.trim() &&
    !row.tableSize.trim() &&
    !row.columnName.trim() &&
    !row.dataType.trim();

interface StructuralMetadataEditableTableProps {
    metadata: StructuralMetadata[];
    onChange: (metadata: StructuralMetadata[]) => void;
}

const StructuralMetadataEditableTable = ({
    metadata,
    onChange,
}: StructuralMetadataEditableTableProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const [rows, setRows] = useState<StructuralMetadataRow[]>(() =>
        tablesToRows(metadata)
    );
    const isInternalChange = useRef(false);

    useEffect(() => {
        if (isInternalChange.current) {
            isInternalChange.current = false;
            return;
        }
        setRows(tablesToRows(metadata));
    }, [metadata]);

    const emitChange = useCallback(
        (nextRows: StructuralMetadataRow[]) => {
            isInternalChange.current = true;
            const dataRows = nextRows.filter(row => !isRowEmpty(row));
            onChange(rowsToTables(dataRows));
        },
        [onChange]
    );

    const updateRow = (rowId: string, field: keyof StructuralMetadataRow, value: string) => {
        setRows(prev => {
            const rowIndex = prev.findIndex(row => row.id === rowId);
            if (rowIndex === -1) {
                return prev;
            }

            const nextRows = prev.map(row =>
                row.id === rowId ? { ...row, [field]: value } : row
            );

            const isLastRow = rowIndex === nextRows.length - 1;
            const updatedRow = nextRows[rowIndex];

            if (isLastRow && !isRowEmpty(updatedRow)) {
                nextRows.push(createGhostRow());
            }

            emitChange(nextRows);
            return nextRows;
        });
    };

    const getPlaceholder = (
        field: keyof StructuralMetadataRow,
        rowIndex: number,
        isLastRow: boolean
    ) => {
        if (!isLastRow) {
            return "";
        }

        const placeholders: Partial<Record<keyof StructuralMetadataRow, string>> = {
            tableName: t("placeholderTableName"),
            tableDescription: t("placeholderTableDescription"),
            tableSize: t("placeholderTableSize"),
            columnName: t("placeholderColumnName"),
            dataType: t("placeholderDataType"),
        };

        return placeholders[field] ?? "";
    };

    const renderCell = (
        row: StructuralMetadataRow,
        field: keyof StructuralMetadataRow,
        rowIndex: number
    ) => {
        const isLastRow = rowIndex === rows.length - 1;
        const placeholder = getPlaceholder(field, rowIndex, isLastRow);

        return (
            <TextField
                value={row[field]}
                onChange={event => updateRow(row.id, field, event.target.value)}
                placeholder={placeholder}
                variant="standard"
                fullWidth
                multiline={field === "tableDescription"}
                InputProps={{
                    disableUnderline: true,
                    sx: {
                        fontSize: 14,
                        "& input::placeholder, & textarea::placeholder": {
                            fontStyle: "italic",
                            color: colors.grey500,
                            opacity: 1,
                        },
                    },
                }}
            />
        );
    };

    const headerCellSx = {
        fontWeight: 700,
        fontSize: 14,
        color: colors.grey700,
        borderBottom: `1px solid ${colors.grey300}`,
        py: 1.25,
        px: 1.5,
    };

    return (
        <TableContainer
            sx={{
                border: `1px solid ${colors.grey300}`,
                borderRadius: 1,
                overflow: "hidden",
                backgroundColor: colors.white,
            }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ ...headerCellSx, backgroundColor: TABLE_HEADER_BG }}>
                            {t("tableNameHeader")}
                        </TableCell>
                        <TableCell sx={{ ...headerCellSx, backgroundColor: TABLE_HEADER_BG }}>
                            {t("tableDescriptionHeader")}
                        </TableCell>
                        <TableCell sx={{ ...headerCellSx, backgroundColor: TABLE_HEADER_BG }}>
                            {t("tableSizeHeader")}
                        </TableCell>
                        <TableCell sx={{ ...headerCellSx, backgroundColor: COLUMN_HEADER_BG }}>
                            {t("columnNameHeader")}
                        </TableCell>
                        <TableCell sx={{ ...headerCellSx, backgroundColor: COLUMN_HEADER_BG }}>
                            {t("dataTypeHeader")}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIndex) => (
                        <TableRow
                            key={row.id}
                            sx={{
                                "& td": {
                                    borderBottom: `1px solid ${colors.grey300}`,
                                    verticalAlign: "top",
                                    py: 0.75,
                                    px: 1.5,
                                },
                            }}>
                            <TableCell>{renderCell(row, "tableName", rowIndex)}</TableCell>
                            <TableCell>{renderCell(row, "tableDescription", rowIndex)}</TableCell>
                            <TableCell>{renderCell(row, "tableSize", rowIndex)}</TableCell>
                            <TableCell>{renderCell(row, "columnName", rowIndex)}</TableCell>
                            <TableCell>{renderCell(row, "dataType", rowIndex)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default StructuralMetadataEditableTable;
