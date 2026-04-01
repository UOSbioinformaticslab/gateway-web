/** @jsxImportSource @emotion/react */
import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnDef,
    Column,
    Row,
} from "@tanstack/react-table";
import { colors } from "@/config/theme";
import * as styles from "./Table.styles";
import { Stack, Collapse, Box } from "@mui/material";

interface OnUpdateProps {
    rowIndex: number;
    columnId: string;
    value: unknown;
}

export type TableVariant = "default" | "searchResults";

interface TableProps<T> {
    defaultColumn?: {
        size?: number;
        minSize?: number;
        maxSize?: number;
    };
    columns: ColumnDef<T, unknown>[];
    rows: T[];
    onUpdate?: (
        rows: T[],
        { rowIndex, columnId, value }: OnUpdateProps
    ) => void;
    hideHeader?: boolean;
    pinHeader?: boolean;
    style?: CSSProperties;
    /** Dataset search table: extra header band, synopsis row, actions column. */
    variant?: TableVariant;
    /** When set, synopsis rows use this visibility (e.g. linked to search "Collapse Synopses"). */
    showSynopsis?: boolean;
    /** Renders synopsis body for each row; return null to omit the synopsis band. */
    renderSynopsis?: (row: T) => React.ReactNode;
    /** Renders the actions column (e.g. ActionDropdown). Required when variant is searchResults. */
    renderActionCell?: (row: T) => React.ReactNode;
    /** Icons or chips shown inline immediately after the title in the top band (search results). */
    renderTitleBandExtras?: (row: T) => React.ReactNode;
}

/** Top band background (icons + title + actions) per reference layout. */
const ROW_HEADER_BAND_BG = "#f0f4f8";
const SECTION_RULE = "#e8ecf0";
function useSkipper() {
    const [shouldSkip, setShouldSkip] = useState(true);

    const skip = useCallback(() => {
        setShouldSkip(false);
    }, []);

    useEffect(() => {
        if (!shouldSkip) {
            setShouldSkip(true);
        }
    }, [shouldSkip]);

    return [shouldSkip, skip] as const;
}

/** Body sticky cells must stay below thead so scrolled row content does not paint over headers. */
const Z_HEADER = 3;
const Z_HEADER_PINNED = 4;
const Z_PINNED_BODY = 1;
const Z_BODY = 0;

const isPinnedMetaColumn = (column: Column<unknown>) =>
    (column.columnDef.meta as { isPinned?: boolean } | undefined)?.isPinned ===
    true;

const isHeaderBandOnlyColumn = (column: Column<unknown>) =>
    (column.columnDef.meta as { headerBandOnly?: boolean } | undefined)
        ?.headerBandOnly === true;

type CellWidthOpts = { isSearchResults?: boolean; totalSize?: number };

const cellWidth = (
    column: Column<unknown>,
    opts?: CellWidthOpts
): number | string => {
    const raw = column.getSize();
    const total = opts?.totalSize ?? 0;
    if (opts?.isSearchResults && total > 0) {
        return `${(raw / total) * 100}%`;
    }
    return raw;
};

const getCommonCellStyles = <T,>(
    column: Column<T>,
    isHeaderPinned?: boolean,
    isHeader?: boolean,
    widthOpts?: CellWidthOpts
): CSSProperties => {
    const {
        columnDef: { meta = {} },
    } = column;

    const { isPinned, hasPinnedBorder } = meta as {
        isPinned?: boolean;
        hasPinnedBorder?: boolean;
    };

    const shouldPin = isPinned || isHeaderPinned;
    const w = cellWidth(column as Column<unknown>, widthOpts);

    if (isHeader && isHeaderPinned) {
        return {
            position: "sticky",
            top: 0,
            left: shouldPin ? `${column.getStart()}px` : undefined,
            width: w,
            zIndex: shouldPin ? Z_HEADER_PINNED : Z_HEADER,
        };
    }

    return {
        backgroundColor: "white",
        boxShadow: hasPinnedBorder ? `1px 0 ${colors.grey300}` : undefined,
        left: shouldPin ? `${column.getStart()}px` : undefined,
        top: shouldPin ? 0 : undefined,
        position: shouldPin ? "sticky" : "relative",
        width: w,
        zIndex: shouldPin ? Z_PINNED_BODY : Z_BODY,
    };
};

function getVisibleCellById<T>(row: Row<T>, id: string) {
    return row.getVisibleCells().find(c => c.column.id === id);
}

function Table<T extends unknown>(props: TableProps<T>) {
    const {
        columns,
        rows,
        onUpdate,
        defaultColumn,
        hideHeader,
        style,
        showSynopsis: showSynopsisProp,
        renderSynopsis,
        variant = "default",
        renderActionCell,
        renderTitleBandExtras,
    } = props;
    const isSearchResults = variant === "searchResults";
    const blockDivider = colors.grey300;

    const [showSynopsisFallback] = useState(true);
    const showSynopsis =
        showSynopsisProp !== undefined ? showSynopsisProp : showSynopsisFallback;
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
    const table = useReactTable(
        {
            data: rows,
            columns,
            defaultColumn,
            autoResetPageIndex,
            getCoreRowModel: getCoreRowModel(),
            meta: {
                updateData: (
                    rowIndex: number,
                    columnId: string,
                    value: unknown
                ) => {
                    if (typeof onUpdate !== "function") return;

                    skipAutoResetPageIndex();

                    const newData = rows.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...rows[rowIndex],
                                [columnId]: value,
                            };
                        }
                        return row;
                    });
                    onUpdate(newData, { rowIndex, columnId, value });
                },
            },
            hideHeader: false,
        },
        hooks => {
            if (!isSearchResults) {
                return;
            }
            hooks.visibleColumns.push(cols => [
                {
                    id: "checkinout",
                    Header: "CheckIn/Out",
                    Cell: ({ row }) =>
                        renderActionCell
                            ? renderActionCell(row.original)
                            : null,
                    meta: { headerBandOnly: true },
                },
                ...cols,
            ]);
        }
    );

    const headerGroup = table.getHeaderGroups()[0];
    const columnCount = headerGroup?.headers.length ?? 1;
    const totalColumnSize = Math.max(table.getTotalSize(), 1);
    const searchWidthOpts: CellWidthOpts | undefined = isSearchResults
        ? { isSearchResults: true, totalSize: totalColumnSize }
        : undefined;

    const hasFooterContent = !!table
        .getFooterGroups()
        .map(group =>
            group.headers.map(header => header.column.columnDef.footer)
        )
        .flat()
        .filter(Boolean).length;

    const renderBodyRow = (row: Row<T>) => {
        if (!isSearchResults) {
            return (
                <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                        <td
                            css={styles.td}
                            key={cell.id}
                            style={{
                                ...getCommonCellStyles(
                                    cell.column,
                                    undefined,
                                    undefined,
                                    searchWidthOpts
                                ),
                            }}>
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                        </td>
                    ))}
                </tr>
            );
        }

        const titleCell = getVisibleCellById(row, "title");
        const actionCell = getVisibleCellById(row, "checkinout");
        const synopsisNode = renderSynopsis?.(row.original);
        const hasSynopsis = synopsisNode != null;

        return (
            <React.Fragment key={row.id}>
                <tr>
                    <td
                        colSpan={columnCount}
                        style={{
                            padding: 0,
                            borderBottom: `1px solid ${SECTION_RULE}`,
                            backgroundColor: ROW_HEADER_BAND_BG,
                        }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                            sx={{
                                px: 2,
                                py: 1.5,
                                flexWrap: "nowrap",
                                minWidth: 0,
                                width: "100%",
                            }}>
                            {titleCell && (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1.5}
                                    sx={{
                                        flex: "1 1 auto",
                                        minWidth: 0,
                                        justifyContent: "flex-start",
                                    }}>
                                    <Box
                                        sx={{
                                            flex: "0 1 auto",
                                            minWidth: 0,
                                            maxWidth: "100%",
                                            fontWeight: 600,
                                            "& a": {
                                                fontWeight: 600,
                                                fontSize: "1.125rem",
                                                color: colors.purple500,
                                                textDecoration: "none",
                                            },
                                            "& a:hover": {
                                                textDecoration: "underline",
                                            },
                                        }}>
                                        {flexRender(
                                            titleCell.column.columnDef.cell,
                                            titleCell.getContext()
                                        )}
                                    </Box>
                                    {renderTitleBandExtras ? (
                                        <Box
                                            sx={{
                                                flexShrink: 0,
                                                display: "flex",
                                                alignItems: "center",
                                            }}>
                                            {renderTitleBandExtras(row.original)}
                                        </Box>
                                    ) : null}
                                </Stack>
                            )}
                            {actionCell && (
                                <Box flexShrink={0} sx={{ ml: "auto" }}>
                                    {flexRender(
                                        actionCell.column.columnDef.cell,
                                        actionCell.getContext()
                                    )}
                                </Box>
                            )}
                        </Stack>
                    </td>
                </tr>
                <tr
                    style={{
                        borderBottom: hasSynopsis
                            ? `1px solid ${SECTION_RULE}`
                            : `2px solid ${blockDivider}`,
                    }}>
                    {row.getVisibleCells().map(cell => {
                        if (isHeaderBandOnlyColumn(cell.column)) {
                            return (
                                <td
                                    css={styles.tdDataBand}
                                    key={cell.id}
                                    style={{
                                        ...getCommonCellStyles(
                                            cell.column,
                                            undefined,
                                            undefined,
                                            searchWidthOpts
                                        ),
                                    }}
                                />
                            );
                        }
                        return (
                            <td
                                css={styles.tdDataBand}
                                key={cell.id}
                                style={{
                                    ...getCommonCellStyles(
                                        cell.column,
                                        undefined,
                                        undefined,
                                        searchWidthOpts
                                    ),
                                }}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        );
                    })}
                </tr>
                {synopsisNode != null && (
                    <tr>
                        <td
                            colSpan={columnCount}
                            style={{
                                padding: 0,
                                borderTop: `1px solid ${SECTION_RULE}`,
                                borderBottom: `2px solid ${blockDivider}`,
                                backgroundColor: colors.white,
                            }}>
                            <Collapse in={showSynopsis} timeout="auto" unmountOnExit>
                                <Box
                                    sx={{
                                        px: 2.5,
                                        py: 2,
                                    }}>
                                    {synopsisNode}
                                </Box>
                            </Collapse>
                        </td>
                    </tr>
                )}
            </React.Fragment>
        );
    };

    return (
        <div
            style={{
                width: "100%",
                overflowX: "auto",
                overflowY: "auto",
                maxHeight: "600px",
            }}>
            <table
                css={style ?? styles.table}
                style={isSearchResults ? { width: "100%", minWidth: "100%" } : undefined}>
                {!hideHeader && (
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        css={styles.th}
                                        key={header.id}
                                        style={{
                                            position: "sticky",
                                            top: 0,
                                            left: isPinnedMetaColumn(header.column)
                                                ? `${header.column.getStart()}px`
                                                : undefined,
                                            cursor: "pointer",
                                            fontWeight: 700,
                                            backgroundColor: colors.blue400,
                                            borderRadius: 2,
                                            color: "white",
                                            borderBottom: `1px solid ${colors.blue400}`,
                                            borderRight: `1px solid ${colors.blue400}`,
                                            fontSize: "18px",
                                            padding: "6px 12px",
                                            lineHeight: 1.1,
                                            width: isSearchResults
                                                ? `${(header.column.getSize() / totalColumnSize) * 100}%`
                                                : header.getSize(),
                                            zIndex: isPinnedMetaColumn(header.column)
                                                ? Z_HEADER_PINNED
                                                : Z_HEADER,
                                        }}>
                                        <div className="whitespace-nowrap">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                )}
                <tbody>
                    {table.getRowModel().rows.map(row => renderBodyRow(row))}
                </tbody>
                {hasFooterContent && (
                    <tfoot>
                        {table.getFooterGroups().map(footerGroup => (
                            <tr key={footerGroup.id}>
                                {footerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.footer,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                )}
            </table>
        </div>
    );
}

export default Table;
