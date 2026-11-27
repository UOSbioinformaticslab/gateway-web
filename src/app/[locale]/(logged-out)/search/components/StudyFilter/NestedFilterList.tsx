"use client";

import { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
    Box,
    Checkbox,
    Collapse,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    Tooltip,
    Typography,
} from "@mui/material";
import { FILTER_COLORS } from "./constants";
import { FilterNode, FilterTree } from "./types";

type NestedFilterListProps = {
    items: FilterTree | FilterNode[] | null | undefined;
    handleFilterChange: (id: string) => void;
    selectedFilters: Set<string>;
    level?: number;
};

const toItems = (items: FilterTree | FilterNode[] | null | undefined) => {
    if (!items) return [];
    return Array.isArray(items) ? items : Object.values(items);
};

const NestedFilterItem = ({
    item,
    handleFilterChange,
    selectedFilters,
    level,
}: {
    item: FilterNode;
    handleFilterChange: (id: string) => void;
    selectedFilters: Set<string>;
    level: number;
}) => {
    const children = toItems(item.children);
    const hasChildren = children.length > 0;
    const hasDescription = Boolean(item.description?.trim());
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <ListItem
                disableGutters
                disablePadding
                sx={{
                    pl: level * 2,
                    py: 0,
                    minHeight: 32,
                    "&:hover": { bgcolor: "action.hover" },
                }}>
                <Box
                    sx={{
                        width: 24,
                        display: "flex",
                        justifyContent: "center",
                        mr: 0.5,
                    }}>
                    {hasChildren && (
                        <IconButton
                            onClick={event => {
                                event.stopPropagation();
                                setIsExpanded(expanded => !expanded);
                            }}
                            size="small"
                            sx={{ p: 0.5 }}
                            aria-expanded={isExpanded}
                            aria-label={item.label}>
                            {isExpanded ? (
                                <ExpandLess fontSize="small" />
                            ) : (
                                <ExpandMore fontSize="small" />
                            )}
                        </IconButton>
                    )}
                </Box>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={selectedFilters.has(item.id)}
                            onChange={() => handleFilterChange(item.id)}
                            size="small"
                            disableRipple
                            sx={{
                                p: 0,
                                color: FILTER_COLORS.border,
                                "&.Mui-checked": { color: FILTER_COLORS.pink },
                            }}
                        />
                    }
                    label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    userSelect: "none",
                                    color: "text.primary",
                                }}>
                                {item.label}
                            </Typography>
                            {hasDescription && (
                                <Tooltip
                                    title={item.description}
                                    arrow
                                    placement="top">
                                    <InfoOutlinedIcon
                                        fontSize="inherit"
                                        sx={{
                                            ml: 1,
                                            color: "text.disabled",
                                            fontSize: "1rem",
                                            cursor: "help",
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Box>
                    }
                    sx={{ flexGrow: 1, ml: 0, mr: 0, my: 0 }}
                />
            </ListItem>
            {hasChildren && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <NestedFilterList
                        items={children}
                        handleFilterChange={handleFilterChange}
                        selectedFilters={selectedFilters}
                        level={level + 1}
                    />
                </Collapse>
            )}
        </>
    );
};

const NestedFilterList = ({
    items,
    handleFilterChange,
    selectedFilters,
    level = 0,
}: NestedFilterListProps) => {
    const itemsArray = toItems(items);
    if (itemsArray.length === 0) return null;

    return (
        <List component="div" disablePadding dense sx={{ py: 0.2 }}>
            {itemsArray.map(item => (
                <NestedFilterItem
                    key={item.id}
                    item={item}
                    handleFilterChange={handleFilterChange}
                    selectedFilters={selectedFilters}
                    level={level}
                />
            ))}
        </List>
    );
};

export default NestedFilterList;
