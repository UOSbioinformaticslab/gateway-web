"use client";

import { useState } from "react";
import {
    Box,
    Checkbox,
    Collapse,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { colors } from "@/config/theme";

export interface FilterTreeNode {
    id: string;
    label: string;
    description?: string;
    children?: Record<string, FilterTreeNode> | FilterTreeNode[];
}

interface NestedFilterTreeProps {
    items: Record<string, FilterTreeNode> | FilterTreeNode[] | null | undefined;
    selectedFilters: Set<string>;
    onFilterChange: (id: string) => void;
    level?: number;
}

const NestedFilterTree = ({
    items,
    selectedFilters,
    onFilterChange,
    level = 0,
}: NestedFilterTreeProps) => {
    if (!items) return null;

    const itemsArray = Array.isArray(items) ? items : Object.values(items);

    return (
        <List component="div" disablePadding dense sx={{ py: 0.2 }}>
            {itemsArray.map(item => (
                <NestedFilterTreeItem
                    key={item.id}
                    item={item}
                    selectedFilters={selectedFilters}
                    onFilterChange={onFilterChange}
                    level={level}
                />
            ))}
        </List>
    );
};

interface NestedFilterTreeItemProps {
    item: FilterTreeNode;
    selectedFilters: Set<string>;
    onFilterChange: (id: string) => void;
    level: number;
}

const NestedFilterTreeItem = ({
    item,
    selectedFilters,
    onFilterChange,
    level,
}: NestedFilterTreeItemProps) => {
    const childrenArray = item.children
        ? Array.isArray(item.children)
            ? item.children
            : Object.values(item.children)
        : [];
    const hasChildren = childrenArray.length > 0;
    const isChecked = selectedFilters.has(item.id);
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
                                setIsExpanded(prev => !prev);
                            }}
                            size="small"
                            sx={{ p: 0.5 }}>
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
                            checked={isChecked}
                            onChange={() => onFilterChange(item.id)}
                            size="small"
                            disableRipple
                            sx={{
                                p: 0,
                                color: colors.grey400,
                                "&.Mui-checked": { color: colors.purple500 },
                            }}
                        />
                    }
                    label={
                        <Typography
                            variant="body2"
                            sx={{ userSelect: "none", color: "text.primary" }}>
                            {item.label}
                        </Typography>
                    }
                    sx={{ flexGrow: 1, ml: 0, mr: 0, my: 0 }}
                />
            </ListItem>

            {hasChildren && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <NestedFilterTree
                        items={childrenArray}
                        selectedFilters={selectedFilters}
                        onFilterChange={onFilterChange}
                        level={level + 1}
                    />
                </Collapse>
            )}
        </>
    );
};

export default NestedFilterTree;
