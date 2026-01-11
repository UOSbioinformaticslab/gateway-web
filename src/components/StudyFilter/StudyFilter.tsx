"use client";

import React, { useState, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    Chip,
    Paper,
    Grid,
    Divider,
    Collapse,
} from '@mui/material';
import {
    ChevronRight,
    ExpandMore,
    Close as CloseIcon,
} from '@mui/icons-material';
import { filterData } from "@/utils/filter_data";
import exp from 'constants';

// --- DATA INITIALIZATION ---
const filterDetailsMap = new Map();
const populateMap = (nodes, primaryGroup) => {
    if (!nodes) return;
    const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);
    nodesArray.forEach(item => {
        const fullId = item.id;
        filterDetailsMap.set(fullId, { id: item.id, label: item.label, category: item.category, group: primaryGroup });
        if (item.children && Object.keys(item.children).length > 0) {
            populateMap(item.children, primaryGroup);
        }
    });
};
populateMap(filterData['0_0'].children, filterData['0_0'].primaryGroup);
populateMap(filterData['0_2'].children, filterData['0_2'].primaryGroup);
populateMap(filterData['0_1'].children, filterData['0_1'].primaryGroup);

// --- COMPONENTS ---

const NestedFilterItem = ({ item, handleFilterChange, selectedFilters, level }) => {
    const fullId = item.id;
    const childrenArray = item.children ? Object.values(item.children) : [];
    const hasChildren = childrenArray.length > 0;
    const isChecked = selectedFilters.has(fullId);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Box sx={{ ml: level * 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                {hasChildren ? (
                    <IconButton 
                        size="small" 
                        onClick={() => setIsExpanded(!isExpanded)}
                        sx={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: '0.2s' }}
                    >
                        <ChevronRight fontSize="small" />
                    </IconButton>
                ) : (
                    <Box sx={{ width: 34 }} />
                )}
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={isChecked}
                            onChange={() => handleFilterChange(fullId)}
                            sx={{ color: 'var(--cruk-pink)', '&.Mui-checked': { color: 'var(--cruk-pink)' } }}
                        />
                    }
                    label={
                        <Typography variant="body2">
                            {item.label} <Typography component="span" variant="caption" color="text.secondary">({item.count})</Typography>
                        </Typography>
                    }
                />
            </Box>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                {childrenArray.map(child => (
                    <NestedFilterItem
                        key={child.id}
                        item={child}
                        handleFilterChange={handleFilterChange}
                        selectedFilters={selectedFilters}
                        level={level + 1}
                    />
                ))}
            </Collapse>
        </Box>
    );
};

const FilterChipArea = ({ selectedFilters, handleFilterChange }) => {
    const chips = useMemo(() => {
        return Array.from(selectedFilters).map(fullId => {
            const details = filterDetailsMap.get(fullId);
            return details ? { ...details, fullId } : null;
        }).filter(Boolean);
    }, [selectedFilters]);

    if (chips.length === 0) return null;

    return (
        <Paper elevation={2} sx={{ p: 2, borderRadius: '0 0 12px 12px', border: '1px solid #e0e0e0', borderTop: 0 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {chips.map(chip => (
                    <Chip
                        key={chip.fullId}
                        size="small"
                        variant="outlined"
                        label={
                            <span>
                                <Typography component="span" variant="caption" sx={{ opacity: 0.7 }}>{chip.category}: </Typography>
                                <strong>{chip.label}</strong>
                            </span>
                        }
                        onDelete={() => handleFilterChange(chip.fullId)}
                        deleteIcon={<CloseIcon style={{ fontSize: '14px' }} />}
                        sx={{
                            borderColor: chip.group === 'cancer-type' ? 'var(--cruk-pink)' : 'var(--cruk-blue)',
                            color: chip.group === 'cancer-type' ? 'var(--cruk-pink)' : 'var(--cruk-blue)',
                        }}
                    />
                ))}
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Logic: (Cancer Filters are OR-ed) AND (Data Type Filters are AND-ed) AND (Accessibility Filters are AND-ed)
            </Typography>
        </Paper>
    );
};

 const StudyFilter = () => {
     const [activePanel, setActivePanel] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState(new Set());

    const counts = useMemo(() => {
        const stats = { total: selectedFilters.size, cancer: 0, data: 0, access: 0 };
        selectedFilters.forEach(id => {
            const details = filterDetailsMap.get(id);
            if (details?.group === 'cancer-type') stats.cancer++;
            else if (details?.group === 'data-type') stats.data++;
            else if (details?.group === 'access') stats.access++;
        });
        return stats;
    }, [selectedFilters]);

    const handleFilterChange = useCallback((id) => {
        setSelectedFilters(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        bgcolor: "#fff",
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
        overflow: "hidden",
        width: "100%",
         height: { sm: 90 },   // desktop
  minHeight: { xs: 88 }, // mobile
      }}
    >
      {/* LEFT TITLE */}
      <Box
        sx={{
          px: 4,
          display: "flex",
          alignItems: "center",
          borderRight: "1px solid",
          borderColor: "grey.200",
          minWidth: 240,
          
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "var(--cruk-blue)" }}
        >
          Study Filters
        </Typography>
      </Box>

      {/* CENTER NAV */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
        }}
      >
        {[
          { label: "Cancer Type", active: false },
          { label: "Data Type", active: true },
          { label: "Accessibility", active: false },
        ].map(({ label, active }) => (
          <Button
            key={label}
            sx={{
              flexGrow: 1,
              borderRadius: 0,
              fontSize: "1rem",
              fontWeight: 600,
              color: active ? "var(--cruk-pink)" : "grey.700",
              borderBottom: active
                ? "4px solid var(--cruk-pink)"
                : "4px solid transparent",
              bgcolor: "#fff",
              "&:hover": {
                bgcolor: "grey.50",
              },
            }}
          >
            {label}
            <Box
              component="span"
              sx={{
                ml: 1,
                fontSize: "0.85rem",
                fontWeight: 400,
                opacity: 0.8,
              }}
            >
              (0 Selected)
            </Box>
          </Button>
        ))}
      </Box>

      {/* RIGHT ACTIONS */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          px: 3,
          py: 2,
          borderLeft: "1px solid",
          borderColor: "grey.200",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Clear Filters
        </Button>

        <Button
          disabled
          sx={{
            bgcolor: "var(--cruk-pink)",
            color: "#fff",
            fontWeight: 700,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            opacity: 0.6,
            "&.Mui-disabled": {
              color: "#fff",
            },
          }}
        >
          Find Studies (0)
        </Button>
      </Box>
    </Box>
    );
};

// --- SUB-PANELS ---

const CancerPanel = ({ handleFilterChange, selectedFilters }) => (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>Cancer Filters</Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }} color="text.secondary">
            Filter by official pathology classifications (ICD-O). (<span style={{ color: 'var(--cruk-pink)' }}>OR Logic</span>)
        </Typography>
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ borderBottom: '1px solid #eee', mb: 1 }}>Topography</Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {Object.values(filterData['0_0'].children['0_0_0'].children).map(item => (
                        <NestedFilterItem key={item.id} item={item} handleFilterChange={handleFilterChange} selectedFilters={selectedFilters} level={0} />
                    ))}
                </Box>
            </Grid>
            <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ borderBottom: '1px solid #eee', mb: 1 }}>Histology</Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {Object.values(filterData['0_0'].children['0_0_1'].children).map(item => (
                        <NestedFilterItem key={item.id} item={item} handleFilterChange={handleFilterChange} selectedFilters={selectedFilters} level={0} />
                    ))}
                </Box>
            </Grid>
            <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ borderBottom: '1px solid #eee', mb: 1 }}>CRUK Terms</Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {Object.values(filterData['0_0'].children['0_0_2'].children).map(item => (
                        <NestedFilterItem key={item.id} item={item} handleFilterChange={handleFilterChange} selectedFilters={selectedFilters} level={0} />
                    ))}
                </Box>
            </Grid>
        </Grid>
    </Paper>
);

const DataPanel = ({ handleFilterChange, selectedFilters }) => (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>Data Type Selection</Typography>
        <Grid container spacing={2}>
            {Object.values(filterData['0_2'].children).map(group => (
                <Grid item xs={12} sm={6} md={3} key={group.id}>
                    <Typography variant="subtitle2" sx={{ borderBottom: '1px solid #eee', mb: 1 }}>{group.label}</Typography>
                    <Box sx={{ maxHeight: 250, overflow: 'auto' }}>
                        {Object.values(group.children).map(item => (
                            <NestedFilterItem key={item.id} item={item} handleFilterChange={handleFilterChange} selectedFilters={selectedFilters} level={0} />
                        ))}
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Paper>
);

const AccessPanel = ({ handleFilterChange, selectedFilters }) => (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>Accessibility</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.values(filterData['0_1'].children).map(item => (
                <FormControlLabel
                    key={item.id}
                    control={<Checkbox checked={selectedFilters.has(item.id)} onChange={() => handleFilterChange(item.id)} sx={{ color: 'var(--cruk-pink)', '&.Mui-checked': { color: 'var(--cruk-pink)' } }} />}
                    label={`${item.label} (${item.count})`}
                />
            ))}
        </Box>
    </Paper>
);

export default StudyFilter;