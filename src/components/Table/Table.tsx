/** @jsxImportSource @emotion/react */
import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnDef,
    Column,
} from "@tanstack/react-table";
import { colors } from "@/config/theme";
import ActionDropdown from "@/app/[locale]/(logged-out)/search/components/ActionDropdown";
import * as styles from "./Table.styles";
import { IconButton, Stack, Typography, Collapse, Box } from "@mui/material";
import { r } from "msw/lib/glossary-2792c6da";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface OnUpdateProps {
    rowIndex: number;
    columnId: string;
    value: unknown;
}

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
}

function useSkipper() {
    const [shouldSkip, setShouldSkip] = useState(true);

    // Wrap a function with this to skip a pagination reset temporarily
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

const getCommonCellStyles = <T,>(
    column: Column<T>,
    isHeaderPinned?: boolean
): CSSProperties => {
    const {
        columnDef: { meta = {} },
    } = column;

    const { isPinned, hasPinnedBorder } = meta as {
        isPinned?: boolean;
        hasPinnedBorder?: boolean;
    };

    const shouldPin = isPinned || isHeaderPinned;
    return {
        backgroundColor: "white",
        boxShadow: hasPinnedBorder ? `1px 0 ${colors.grey300}` : undefined,
        left: shouldPin ? `${column.getStart()}px` : undefined,
        top: shouldPin ? 0 : undefined,
        opacity: shouldPin ? 0.95 : 1,
        position: shouldPin ? "sticky" : "relative",
        width: column.getSize(),
        zIndex: shouldPin ? 1 : 0,
    };
};

function Table<T extends unknown>(props: TableProps<T>) {
    const {
        columns,
        rows,
        onUpdate,
        defaultColumn,
        hideHeader,
        pinHeader,
        style,
    } = props;
    const [showSynopsis, setShowSynopsis] = useState(true);
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

                    // Skip page index reset until after next rerender
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
            hooks.visibleColumns.push(columns => [
                {
                    id: "checkinout",
                    Header: "CheckIn/Out",
                    Cell: ({ row }) => <ActionDropdown {...row} />,
                },
                ...columns,
            ]);
        }
    );

    const hasFooterContent = !!table
        .getFooterGroups()
        .map(group =>
            group.headers.map(header => header.column.columnDef.footer)
        )
        .flat()
        .filter(Boolean).length;

    return (
        <table css={style ?? styles.table}>
            {!hideHeader && (
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    css={styles.th}
                                    key={header.id}
                                    style={{
                                        ...getCommonCellStyles(
                                            header.column,
                                            pinHeader
                                        ),
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                        backgroundColor: colors.blue400,
                                        borderRadius: 2,
                                        color: 'white',
                                        borderBottom: `1px solid ${colors.blue400}`,
                                        borderRight: `1px solid ${colors.blue400}`,
                                        fontSize: '18px',
                                        padding: 3,
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
                {table.getRowModel().rows.map(row => (
                    <React.Fragment key={row.id}>
                        <tr key={`${row.id}-spacer`}>
                            <td colSpan={columns.length + 1} style={{ height: '8px', backgroundColor: colors.grey100 }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    {/* Actions */}
                                    <Stack direction="row">
                                        <IconButton onClick={() => {}} >
                                            <FavoriteIcon /> 
                                        </IconButton>
                                        <IconButton onClick={() => {}}>
                                            <ShoppingCartIcon />
                                        </IconButton>
                                    </Stack>

                                    {/* Title Link */}
                                    {flexRender(
                                        row.getVisibleCells()[0].column.columnDef.cell,
                                        row.getVisibleCells()[0].getContext()
                                    )}
                                </Stack>
                            </td>
                        </tr>
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td
                                    css={styles.td}
                                    key={cell.id}
                                    style={{
                                        ...getCommonCellStyles(cell.column),
                                    }}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr key={`${row.id}-spacer-bottom`}>
                            <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                 <Collapse in={showSynopsis} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1, p: 2, fontStyle: 'italic', borderRadius: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Synopsis: </strong>{"This dataset explores Understanding Metastasis in Prostate Cancer with a cohort of 25494 subjects. The primary focus includes analyzing longitudinal markers and response variations to established protocols. Data collection began in 2024"}
                                                    </Typography>
                                                </Box>
                                            </Collapse>
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
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
    );
}

export default Table;
