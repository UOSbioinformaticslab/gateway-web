'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox,
    Chip,
    Paper,
    List,
    ListItem,
    Collapse,
    Tooltip,
    Stack,
    Grid,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { colors } from "@/config/theme";
// Preserved Logic Imports
import { filterDetailsMap, filterData } from '@/utils/filter-setup';
import { filterType, includeParents, plusParents, getMessage, calculateLogicMessage } from '@/utils/logic-utils';
import { executeFilterLogic } from '@/utils/filterLogic';

// --- Brand Colors ---
const COLORS = {
    blue: '#00468C',
    pink: '#D10A6F',
    white: '#FFFFFF',
    lightBg: '#F0F2F5',
    border: '#AAB7C4'
};

// --- Utility Components ---

const SearchInput = ({ searchTerm, setSearchTerm, isSearching, placeholder, sx = {}, textFieldSx = undefined }) => (
    <Box sx={{ mb: 3, ...sx }}>
        <TextField
            fullWidth
            placeholder={placeholder || "Search terms (min 4 characters)..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            variant="outlined"
            helperText={searchTerm && searchTerm.length < 4 ? "Please enter at least 4 characters to search." : ""}
            sx={[
                {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'white',
                    },
                },
                ...(textFieldSx ? [textFieldSx] : []),
            ]}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        {isSearching ? <CircularProgress size={20} sx={{ color: COLORS.pink }} /> : <SearchIcon color="disabled" />}
                    </InputAdornment>
                ),
            }}
        />
    </Box>
);

// --- Nested Filter List Components ---

const NestedFilterList = ({ items, handleFilterChange, selectedFilters, level = 0 }) => {
    if (!items || items.length === 0) return null;
    const itemsArray = Array.isArray(items) ? items : Object.values(items);

    return (
        <List component="div" disablePadding dense
  sx={{
    py: 0.20, // controls vertical gap between items
  }}>
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

const NestedFilterItem = ({ item, handleFilterChange, selectedFilters, level }) => {
    const fullId = item.id;
    const childrenArray = item.children ? Object.values(item.children) : [];
    const hasChildren = childrenArray.length > 0;
    const isChecked = selectedFilters.has(fullId);
    const hasDescription = item.description && item.description.trim().length > 0;

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = (e) => {
        e.stopPropagation();
        setIsExpanded(prev => !prev);
    };

    return (
        <>
            <ListItem
               disableGutters
  disablePadding
  sx={{
    pl: level * 2,
    py: 0, // tighter
    minHeight: 32, // 👈 controls row height
    '&:hover': { bgcolor: 'action.hover' },
  }}
            >
                <Box sx={{ width: 24, display: 'flex', justifyContent: 'center', mr: 0.5 }}>
                    {hasChildren && (
                        <IconButton onClick={toggleExpansion} size="small" sx={{ p: 0.5 }}>
                            {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                        </IconButton>
                    )}
                </Box>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isChecked}
  onChange={() => handleFilterChange(fullId)}
  size="small"
  disableRipple
  sx={{
    p: 0,
    color: COLORS.border,
    '&.Mui-checked': { color: COLORS.pink },
  }}
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ userSelect: 'none', color: 'text.primary' }}>
                                {item.label}
                                <Typography component="span" variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>
                                    ({item.count})
                                </Typography>
                            </Typography>
                            {hasDescription && (
                                <Tooltip title={item.description} arrow placement="top">
                                    <InfoOutlinedIcon
                                        fontSize="inherit"
                                        sx={{ ml: 1, color: 'text.disabled', fontSize: '1rem', cursor: 'help' }}
                                    />
                                </Tooltip>
                            )}
                        </Box>
                    }
                    sx={{
    flexGrow: 1,
    ml: 0,
    mr: 0,
    my: 0, // 👈 IMPORTANT
  }}
                />
            </ListItem>

            {hasChildren && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <NestedFilterList
                        items={childrenArray}
                        handleFilterChange={handleFilterChange}
                        selectedFilters={selectedFilters}
                        level={level + 1}
                    />
                </Collapse>
            )}
        </>
    );
};

// --- Logic Summary Component ---

const FilterLogicSummary = ({
    selectedFilters,
    logicMessage,
    setLogicMessage,
    isMessageManuallyEdited,
    setIsMessageManuallyEdited,
}: {
    selectedFilters: Set<string>;
    logicMessage: string;
    setLogicMessage: (message: string) => void;
    isMessageManuallyEdited: boolean;
    setIsMessageManuallyEdited: (edited: boolean) => void;
}) => {
    // Utility references passed down conceptually or imported
    const handleReset = useCallback(() => {
        const filters = Array.from(selectedFilters);
        const autoMessage = calculateLogicMessage(filters);
        setLogicMessage(autoMessage);
        setIsMessageManuallyEdited(false);
    }, [selectedFilters, setLogicMessage, setIsMessageManuallyEdited]);

    if (!selectedFilters || selectedFilters.size === 0) return null;

    return (
        <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: COLORS.lightBg, borderColor: isMessageManuallyEdited ? 'warning.main' : 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">Filter Logic</Typography>
                {isMessageManuallyEdited && (
                    <Button size="small" onClick={handleReset} variant="outlined" color="primary">
                        Reset to Auto Logic
                    </Button>
                )}
            </Box>

            <TextField
                fullWidth
                multiline
                minRows={2}
                maxRows={6}
                value={logicMessage || "No filters selected"}
                onChange={(e) => {
                    setLogicMessage(e.target.value);
                    setIsMessageManuallyEdited(true);
                }}
                variant="outlined"
                size="small"
                sx={{ bgcolor: 'white' }}
                inputProps={{ style: { fontFamily: 'monospace', fontSize: '0.85rem' } }}
            />

            {isMessageManuallyEdited && (
                <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                    Note: Filter logic has been manually edited. Reset logic to resume auto-updates.
                </Typography>
            )}
        </Paper>
    );
};

// --- Filter Chip Area ---

const FilterChipArea = ({
    selectedFilters,
    handleFilterChange,
    logicMessage,
    setLogicMessage,
    isMessageManuallyEdited,
    setIsMessageManuallyEdited,
}) => {
    const chips = useMemo(() => {
        return Array.from(selectedFilters).map(fullId => {
            const details = filterDetailsMap.get(fullId);
            if (!details) return null;
            return {
                fullId,
                label: details.label,
                category: details.category,
                isCancer: details.group === 'cancer-type'
            };
        }).filter(Boolean);
    }, [selectedFilters]);

    if (chips.length === 0) return null;

    return (
        <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {chips.map(chip => (
                    <Chip
                        key={chip.fullId}
                        label={
                            <span>
                                <span style={{ opacity: 0.7 }}>{chip.category}: </span>
                                <strong>{chip.label}</strong>
                            </span>
                        }
                        onDelete={() => handleFilterChange(chip.fullId)}
                        deleteIcon={<CloseIcon />}
                        variant="outlined"
                        size="small"
                        sx={{
                            color: chip.isCancer ? COLORS.pink : COLORS.blue,
                            borderColor: chip.isCancer ? COLORS.pink : COLORS.blue,
                            bgcolor: 'white',
                            fontWeight: 500
                        }}
                    />
                ))}
            </Box>
            <FilterLogicSummary
                selectedFilters={selectedFilters}
                logicMessage={logicMessage}
                setLogicMessage={setLogicMessage}
                isMessageManuallyEdited={isMessageManuallyEdited}
                setIsMessageManuallyEdited={setIsMessageManuallyEdited}
            />
        </Paper>
    );
};

// --- Panels ---

const CancerTypePanel = ({ handleFilterChange, selectedFilters, searchTerm, setSearchTerm, filteredIds, isSearching, pruneHierarchy }) => {
    const [selectedClassification, setSelectedClassification] = useState(null);
    
    if (!filterData || !filterData['0_0'] || !filterData['0_0'].children) {
        return <Paper elevation={0} sx={{ p: 3 }}>Loading filter data...</Paper>;
    }
    
    const cancerGroups = filterData['0_0'].children;

    // Pruning Data
    const filteredTopography = pruneHierarchy(cancerGroups['0_0_0']?.children, filteredIds);
    const filteredHistology = pruneHierarchy(cancerGroups['0_0_1']?.children, filteredIds);
    const filteredCruk = pruneHierarchy(cancerGroups['0_0_2']?.children, filteredIds);


    // SNOMED-CT (0_0_3)
    const snomedData = cancerGroups['0_0_3'] || { children: {} };
    const filteredSnomedItems = pruneHierarchy(snomedData.children, filteredIds);
        // TCGA (0_0_4)
    const tcgaData = cancerGroups['0_0_4'] || { children: {} };
    const filteredTcgaItems = pruneHierarchy(tcgaData.children, filteredIds);

    const listProps = { handleFilterChange, selectedFilters };
    const scrollContainerStyle = { maxHeight: 400, overflowY: 'auto', pr: 1 };

    // Card Component
    const ClassificationCard = ({ title, description, classificationKey, emoji }) => {
        // Calculate count
        let count = 0;
        const prefixMap = { 'icdo': '0_0_0', 'icdo_hist': '0_0_1', 'cruk': '0_0_2', 'snomed': '0_0_3', 'tcga': '0_0_4' };

        selectedFilters.forEach(id => {
            if (classificationKey === 'icdo') {
                if (id.startsWith('0_0_0') || id.startsWith('0_0_1')) count++;
            } else if (id.startsWith(prefixMap[classificationKey])) {
                count++;
            }
        });

        const isSelected = selectedClassification === classificationKey;

        return (
          <Card
  variant="outlined"
  sx={{
    height: "100%",
    borderRadius: 2,
    borderColor: isSelected ? COLORS.pink : "divider",
    borderWidth: isSelected ? 2 : 1,
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: COLORS.pink,
      boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
      transform: "translateY(-2px)",
    },
  }}
>
  <CardActionArea
    onClick={() => setSelectedClassification(classificationKey)}
    sx={{ height: "100%" }}
  >
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        px: 4,
        py: 4,
      }}
    >
      {/* Icon */}
      <Typography
        component="span"
        sx={{ fontSize: "2.5rem", lineHeight: 1 }}
      >
        {emoji}
      </Typography>

      {/* Text */}
      <Box>
        <Typography
          variant="h2"
          sx={{ fontWeight: 700, mb: 0.5 }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {description}
        </Typography>

        {count > 0 && (
          <Chip
            label={`${count} Selected`}
            size="small"
            sx={{
              mt: 1,
              bgcolor: COLORS.pink,
              color: "white",
              fontWeight: 600,
            }}
          />
        )}
      </Box>
    </CardContent>
  </CardActionArea>
</Card>

        );
    };

    const renderContent = () => {
        const searchBox = (
            <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isSearching={isSearching}
                placeholder={`Search ${selectedClassification?.toUpperCase() || ''} terms`}
            />
        );

        switch (selectedClassification) {
            case 'cruk':
                return (
                    <Box>
                        <Typography variant="h2" fontWeight="bold" gutterBottom>CRUK Cancer Terms</Typography>
                        {searchBox}
                        <Box sx={{
    height: "250px",
    overflowY: "auto",
    fontSize: "0.875rem", // text-sm
    pr: 2,                // padding-right
    pb: 28,               // padding-bottom
    "& > *:not(:last-child)": {
      mb: 0.25,           // space-y-1 (4px)
    },
  }}>
                            <NestedFilterList items={filteredCruk} {...listProps} />
                        </Box>
                    </Box>
                );
            case 'tcga':
                return (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>TCGA Terms</Typography>
                        {searchBox}
                        <Box sx={scrollContainerStyle}>
                            <NestedFilterList items={filteredTcgaItems} {...listProps} />
                        </Box>
                    </Box>
                );
            case 'snomed':
                return (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>SNOMED-CT Terms</Typography>
                        {searchBox}
                        <Box sx={scrollContainerStyle}>
                            <NestedFilterList items={filteredSnomedItems} {...listProps} />
                        </Box>
                    </Box>
                );
            case 'icdo': {
                const icdoPanelSx = {
                    flex: 1,
                    minWidth: 0,
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: COLORS.border,
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 480,
                    overflow: 'hidden',
                };
                const icdoListScrollSx = {
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    pr: 1,
                };
                return (
                    <Box
                        sx={{
                            bgcolor: COLORS.lightBg,
                            borderRadius: 2,
                            p: { mobile: 2, tablet: 2.5 },
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{
                                color: colors.black,
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { mobile: '1.25rem', tablet: '1.375rem' },
                            }}
                        >
                            ICD-O Classification
                        </Typography>
                        <SearchInput
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            isSearching={isSearching}
                            placeholder="Search ICDO terms"
                            sx={{ mb: 2.5 }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { mobile: 'column', tablet: 'row' },
                                gap: 2,
                                alignItems: 'stretch',
                            }}
                        >
                            <Paper elevation={0} sx={icdoPanelSx}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ color: colors.black, fontWeight: 700, mb: 1.5 }}
                                >
                                    Topography
                                </Typography>
                                <Box sx={icdoListScrollSx}>
                                    <NestedFilterList items={filteredTopography} {...listProps} />
                                </Box>
                            </Paper>
                            <Paper elevation={0} sx={icdoPanelSx}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ color: colors.black, fontWeight: 700, mb: 1.5 }}
                                >
                                    Histology
                                </Typography>
                                <Box sx={icdoListScrollSx}>
                                    <NestedFilterList items={filteredHistology} {...listProps} />
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                );
            }
            default:
                return null;
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3, bgcolor: 'white'}}>
            {selectedClassification ? (
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => { setSelectedClassification(null); setSearchTerm(''); }}
                        sx={{ mb: 2, textTransform: 'none' }}
                    >
                        Back to Selection
                    </Button>
                    <Divider sx={{ mb: 3 }} />
                    {renderContent()}
                </Box>
            ) : (
                <Box>
                    <Typography
                        sx={{
                            display: 'block',
                            color: colors.black,
                            fontSize: { mobile: '1.125rem', tablet: '1.25rem' },
                            fontWeight: 600,
                            lineHeight: 1.4,
                            textAlign: { mobile: 'center', tablet: 'left' },
                            mb: 2,
                            mt: { mobile: -0.5, tablet: -1 },
                        }}
                    >
                        Click on your choice of classification to begin
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={3}>
                            <ClassificationCard title="CRUK  Cancer Terms" description="Patient-friendly, simplified cancer terms." classificationKey="cruk" emoji="🏥" />
                        </Grid>
                        <Grid size={3}>
                            <ClassificationCard title="TCGA Terms" description="The Cancer Genome Atlas terminology." classificationKey="tcga" emoji="🧬" />
                        </Grid>
                        <Grid size={3}>
                            <ClassificationCard title="SNOMED-CT" description="Systematized Nomenclature of Medicine." classificationKey="snomed" emoji="🏷️" />
                        </Grid>
                        <Grid size={3}>
                            <ClassificationCard title="ICD-O Classification" description="Official pathology terms (Topography & Histology)." classificationKey="icdo" emoji="🔬" />
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Paper>
    );
};

const DataTypePanel = ({ handleFilterChange, selectedFilters, searchTerm, setSearchTerm, filteredIds, isSearching, pruneHierarchy }) => {
    if (!filterData || !filterData['0_2'] || !filterData['0_2'].children) {
        return <Paper elevation={0} sx={{ p: 3 }}>Loading filter data...</Paper>;
    }

    const dataTypeGroups = filterData['0_2'].children;
    const sections = [
        { title: "Biobank", items: dataTypeGroups['0_2_0']?.children },
        { title: "In Vitro", items: dataTypeGroups['0_2_1']?.children },
        { title: "Model Organisms", items: dataTypeGroups['0_2_2']?.children },
        { title: "Patient Studies", items: dataTypeGroups['0_2_3']?.children },
        { title: "Non-Bio", items: dataTypeGroups['0_2_4']?.children }
    ];

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
                                <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { sm: "center" },
    gap: 2,
    textAlign: { xs: "center", sm: "left" },
  }}
>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, color: COLORS.blue }}>Data Type Selection</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Select one or more modalities to include.</Typography>
</Box>            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearching={isSearching} placeholder="Search data types" />

            <Grid container spacing={1.5}>
                {sections.map((sec, idx) => (
                    <Grid size={2.4} key={idx}>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: COLORS.lightBg, height: '100%' }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                                {sec.title}
                            </Typography>
                            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                <NestedFilterList
                                    items={pruneHierarchy(sec.items, filteredIds)}
                                    handleFilterChange={handleFilterChange}
                                    selectedFilters={selectedFilters}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

const AccessibilityPanel = ({ handleFilterChange, selectedFilters, searchTerm, setSearchTerm, filteredIds, isSearching }) => {
    if (!filterData || !filterData['0_1'] || !filterData['0_1'].children) {
        return <Paper elevation={0} sx={{ p: 3 }}>Loading filter data...</Paper>;
    }
    
    const items = Object.values(filterData['0_1'].children);

    const visibleItems = useMemo(() => {
        if (!filteredIds) return items;
        return items.filter(item => filteredIds.has(item.id));
    }, [items, filteredIds]);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, color: COLORS.blue }}>Accessibility and Source</Typography>
            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearching={isSearching} placeholder="Search access terms" />

            <Paper variant="outlined" sx={{ p: 2, maxHeight: 400, overflowY: 'auto' }}>
                {visibleItems.map(item => (
                    <FormControlLabel
                        key={item.id}
                        control={
                            <Checkbox
                                checked={selectedFilters.has(item.id)}
                                onChange={() => handleFilterChange(item.id)}
                                sx={{ color: COLORS.border, '&.Mui-checked': { color: COLORS.pink } }}
                            />
                        }
                        label={
                            <Typography variant="body2">
                                {item.label} <Typography component="span" variant="caption" color="text.secondary">({item.count})</Typography>
                            </Typography>
                        }
                        sx={{ display: 'flex', width: '100%', mb: 1 }}
                    />
                ))}
            </Paper>
        </Paper>
    );
};

// --- Filter category cards (replaces Cancer / Data / Access tabs) ---

const FilterCategoryCard = ({
    title,
    count,
    selected,
    onClick,
}: {
    title: string;
    count: number;
    selected: boolean;
    onClick: () => void;
}) => (
    <Paper
        elevation={0}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
            }
        }}
        sx={{
            minWidth: 0,
            width: '100%',
            minHeight: { mobile: 100, tablet: 108 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { mobile: 1.125, tablet: 1.5 },
            cursor: 'pointer',
            textAlign: 'center',
            bgcolor: COLORS.white,
            borderRadius: 2,
            border: '2px solid',
            borderColor: selected ? COLORS.pink : COLORS.border,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
                borderColor: selected ? COLORS.pink : COLORS.blue,
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
            },
            '&:focus-visible': {
                outline: `2px solid ${COLORS.blue}`,
                outlineOffset: 2,
            },
        }}
    >
        <Typography
            sx={{
                fontWeight: 800,
                fontSize: { mobile: '1.025rem', tablet: '1.125rem' },
                lineHeight: 1.35,
                color: COLORS.blue,
                px: 0.5,
            }}
        >
            {title}
        </Typography>
        <Typography
            component="span"
            sx={{
                display: 'block',
                mt: 0.5,
                fontWeight: 600,
                fontSize: { mobile: '1.0625rem', tablet: '1.125rem' },
                color: 'text.secondary',
            }}
        >
            ({count})
        </Typography>
    </Paper>
);

// --- Main App Component ---

 const StudyFilter = () => {
    const theme = useTheme();
    const helpDialogIsNarrow = useMediaQuery(theme.breakpoints.down('tablet'));

    const [activePanel, setActivePanel] = useState<string | null>('cancer');
    const [helpOpen, setHelpOpen] = useState(false);

    const [selectedFilters, setSelectedFilters] = useState(new Set());
    const [logicMessage, setLogicMessage] = useState("");
    const [isMessageManuallyEdited, setIsMessageManuallyEdited] = useState(false);

    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIds, setFilteredIds] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const allFiltersArray = useMemo(() => Array.from(filterDetailsMap.values()), []);

    // Effect: Update Logic Message
    useEffect(() => {
        if (!isMessageManuallyEdited) {
            const filters = Array.from(selectedFilters);
            const newMessage = calculateLogicMessage(filters);
            setLogicMessage(newMessage);
        }
    }, [selectedFilters, isMessageManuallyEdited]);

    // Effect: Search Debounce
    useEffect(() => {
        if (!searchTerm || searchTerm.length < 4) {
            setFilteredIds(null);
            setIsSearching(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsSearching(true);
            const activeGroupMap = { 'cancer': 'cancer-type', 'data': 'data-type', 'access': 'access' };

            // If search is used but no panel is open, default to 'cancer' to show results,
            // OR simply return if we strictly want them to click a tab first.
            // Here we only search if a panel is actually active.
            if (!activePanel || !activeGroupMap[activePanel]) {
                setFilteredIds(null);
                setIsSearching(false);
                return;
            }

            const activeGroup = activeGroupMap[activePanel];

            const lower = searchTerm.toLowerCase();
            const results = allFiltersArray.filter(item =>
                item.group === activeGroup && item.label.toLowerCase().includes(lower)
            );
            setFilteredIds(new Set(results.map(i => i.id)));
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, activePanel, allFiltersArray]);

    const pruneHierarchy = useCallback((nodes, currentFilteredIds) => {
        if (!nodes) return null;
        if (!currentFilteredIds) return nodes;
        const filtered = {};
        const arr = Array.isArray(nodes) ? nodes : Object.values(nodes);
        arr.forEach(item => {
            const kids = pruneHierarchy(item.children, currentFilteredIds);
            if (currentFilteredIds.has(item.id) || (kids && Object.keys(kids).length > 0)) {
                filtered[item.id] = { ...item, children: kids };
            }
        });
        return Object.keys(filtered).length > 0 ? filtered : null;
    }, []);

    const counts = useMemo(() => {
        let c=0, d=0, a=0;
        selectedFilters.forEach(id => {
            const grp = filterDetailsMap.get(id)?.group;
            if (grp === 'cancer-type') c++;
            else if (grp === 'data-type') d++;
            else if (grp === 'access') a++;
        });
        return { total: selectedFilters.size, cancer: c, data: d, access: a };
    }, [selectedFilters]);

    interface FilterChangeCallbackParams {
        id: string;
    }

    const handleFilterChange = useCallback((id: string): void => {
        setSelectedFilters((prev: Set<string>) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            if (isMessageManuallyEdited) setIsMessageManuallyEdited(false);
            return next;
        });
    }, [isMessageManuallyEdited]);

    const clearAllFilters = useCallback(() => {
        setSelectedFilters(new Set());
        setSearchTerm('');
        setLogicMessage('');
        setIsMessageManuallyEdited(false);
        // Optional: Reset active panel to false on clear?
        // setActivePanel(false);
    }, []);

    const handleFindStudies = useCallback(() => {
        if (counts.total > 0 && logicMessage) {
            const results = executeFilterLogic(logicMessage);
            console.log("Search Results:", results);
        }
    }, [counts.total, logicMessage]);

    const commonProps = {
        handleFilterChange, selectedFilters, searchTerm, setSearchTerm, filteredIds, isSearching, pruneHierarchy
    };

    return (
    <Box  sx={{
              bgcolor: "#fff",
                  borderTopLeftRadius: "0.75rem",
                   borderTopRightRadius: "0.75rem",
                   boxShadow: "0px 1px 0px 1px #e5e7eb",
                   borderTop: "1px solid",
                  borderColor: "grey.300",
                     borderRadius: 2,

                     }}>
          <Box
                sx={{
                    display: 'flex',
                    flexDirection: { mobile: 'column', tablet: 'row' },
                    alignItems: { tablet: 'stretch' },
                    width: '100%',
                    borderBottom: '1px solid',
                    borderColor: 'grey.200',
                    columnGap: { mobile: 0, tablet: 2, laptop: 3 },
                    rowGap: { mobile: 2, tablet: 0 },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1.5,
                        flexWrap: 'wrap',
                        px: { mobile: 2, tablet: 2.5 },
                        py: 2,
                        borderRight: { tablet: `1px solid ${colors.grey300}` },
                        flexShrink: 0,
                        minWidth: { tablet: 200, laptop: 220 },
                    }}
                >
                    <Typography
                        component="h2"
                        variant="h2"
                        sx={{
                            fontWeight: 700,
                            color: colors.blue400,
                            lineHeight: 1.2,
                            m: 0,
                        }}
                    >
                        First filter the studies
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setHelpOpen(true)}
                        sx={{
                            flexShrink: 0,
                            alignSelf: 'center',
                            textTransform: 'none',
                            fontWeight: 600,
                            minWidth: 0,
                            py: 0.375,
                            px: 1.25,
                            lineHeight: 1.25,
                        }}
                    >
                        Help
                    </Button>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        display: 'grid',
                        gridTemplateColumns: {
                            mobile: '1fr',
                            tablet: 'repeat(3, minmax(0, 1fr))',
                        },
                        alignItems: 'stretch',
                        columnGap: { mobile: 0, tablet: 2, laptop: 3 },
                        rowGap: { mobile: 2, tablet: 0 },
                        px: { mobile: 2, tablet: 1.5 },
                        py: 2,
                        minWidth: 0,
                    }}
                >
                    <FilterCategoryCard
                        title="Which Cancers are you interested in?"
                        count={counts.cancer}
                        selected={activePanel === 'cancer'}
                        onClick={() => {
                            setActivePanel('cancer');
                            setSearchTerm('');
                        }}
                    />
                    <FilterCategoryCard
                        title="What kind of data do you need?"
                        count={counts.data}
                        selected={activePanel === 'data'}
                        onClick={() => {
                            setActivePanel('data');
                            setSearchTerm('');
                        }}
                    />
                    <FilterCategoryCard
                        title="Which access restrictions apply?"
                        count={counts.access}
                        selected={activePanel === 'access'}
                        onClick={() => {
                            setActivePanel('access');
                            setSearchTerm('');
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 1.25,
                        px: { mobile: 2, tablet: 2.5 },
                        py: 2,
                        borderLeft: { tablet: `1px solid ${colors.grey300}` },
                        flexShrink: 0,
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={clearAllFilters}
                        disabled={counts.total === 0}
                        sx={{
                            textTransform: 'none',
                            bgcolor: COLORS.white,
                            borderColor: COLORS.border,
                            fontWeight: 600,
                        }}
                    >
                        Clear
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleFindStudies}
                        disabled={counts.total === 0}
                        sx={{
                            bgcolor: COLORS.pink,
                            '&:hover': { bgcolor: '#b0085d' },
                            fontWeight: 700,
                            px: 3,
                            textTransform: 'none',
                        }}
                    >
                        Find ({counts.total})
                    </Button>
                </Box>
            </Box>
                    {/* Chip Area / Logic Summary (Always visible if filters exist) */}
                        <FilterChipArea
                            selectedFilters={selectedFilters}
                            handleFilterChange={handleFilterChange}
                            logicMessage={logicMessage}
                            setLogicMessage={setLogicMessage}
                            isMessageManuallyEdited={isMessageManuallyEdited}
                            setIsMessageManuallyEdited={setIsMessageManuallyEdited}
                        />

                    {/* Panels */}
                    <Box sx={{ p: 0 }}>
                        {activePanel === 'cancer' && <CancerTypePanel {...commonProps} />}
                        {activePanel === 'data' && <DataTypePanel {...commonProps} />}
                        {activePanel === 'access' && <AccessibilityPanel {...commonProps} />}
                    </Box>

            <Dialog
                open={helpOpen}
                onClose={() => setHelpOpen(false)}
                maxWidth={false}
                scroll="paper"
                aria-labelledby="study-filter-help-title"
                PaperProps={{
                    /* Inline width/maxWidth so sizing wins over MUI Dialog’s default
                       maxWidth: calc(100% - 64px) when maxWidth={false}. */
                    style: {
                        width: helpDialogIsNarrow ? 'min(92vw, calc(100vw - 32px))' : '42vw',
                        maxWidth: helpDialogIsNarrow ? 'min(92vw, calc(100vw - 32px))' : '42vw',
                    },
                    sx: {
                        borderRadius: '10px',
                        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.14)',
                        m: 2,
                        height: '85vh',
                        maxHeight: '85vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                    },
                }}
            >
                <DialogTitle
                    id="study-filter-help-title"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        flexShrink: 0,
                        py: 2.5,
                        px: 3,
                        pr: 1,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        lineHeight: 1.3,
                        color: COLORS.blue,
                    }}
                >
                    How to use filters
                    <IconButton
                        type="button"
                        aria-label="Close help"
                        onClick={() => setHelpOpen(false)}
                        edge="end"
                        size="medium"
                        sx={{ color: 'text.secondary' }}
                    >
                        <CloseIcon fontSize="medium" />
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        px: { xs: 2.5, sm: 3 },
                        py: 3,
                        overflowY: 'auto',
                        '& .MuiTypography-body1': {
                            fontSize: '1.125rem',
                            lineHeight: 1.75,
                        },
                        '& .MuiTypography-subtitle1': {
                            fontSize: '1.25rem',
                            lineHeight: 1.35,
                        },
                    }}
                >
                    <Typography variant="body1" sx={{ lineHeight: 1.75, color: 'text.primary', mb: 0 }}>
                        The list of studies can be filtered to pick out those relating to specific cancers, including
                        particular data or matching your accessibility needs.
                    </Typography>

                    <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.pink, mt: 3, mb: 1 }}>
                        1. Selecting Categories
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.75, color: 'text.primary' }}>
                        Use the three cards above to move between{' '}
                        <strong>Which Cancers are you interested in?</strong>,{' '}
                        <strong>What kind of data do you need?</strong>, and{' '}
                        <strong>Which access restrictions apply?</strong> You can search for cancers using CRUK terms,
                        TCGA codes, or ICD-O classifications.
                    </Typography>

                    <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.pink, mt: 3, mb: 1 }}>
                        2. Searching for Terms
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.75, color: 'text.primary' }}>
                        In each category, use the search bar to find specific terms. You must enter at least{' '}
                        <strong>4 characters</strong> to start the search.
                    </Typography>

                    <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.pink, mt: 3, mb: 1 }}>
                        3. Expanding Options
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.75, color: 'text.primary' }}>
                        Wherever there is a <strong>chevron (&gt;)</strong> next to a filter name, you can click to see more
                        specific sub-categories.
                    </Typography>

                    <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.pink, mt: 3, mb: 1 }}>
                        4. Adjusting Logic
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.75, color: 'text.primary' }}>
                        Filters appear as chips. You can manually edit the <strong>Filter Logic</strong> text box if you need
                        to customise how your selections are combined.
                    </Typography>
                </DialogContent>
                <DialogActions
                    sx={{
                        flexShrink: 0,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        px: 3,
                        py: 2,
                        justifyContent: 'flex-end',
                        bgcolor: 'background.paper',
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => setHelpOpen(false)}
                        sx={{
                            bgcolor: COLORS.blue,
                            color: COLORS.white,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1.0625rem',
                            px: 2.75,
                            py: 1.125,
                            borderRadius: 1.5,
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#003d7a',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        Got it
                    </Button>
                </DialogActions>
            </Dialog>
      </Box>
    );
};



export default StudyFilter;