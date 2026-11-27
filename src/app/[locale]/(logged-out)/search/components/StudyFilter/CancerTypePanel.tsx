"use client";

import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Divider,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { colors } from "@/config/theme";
import { filterData } from "@/utils/filter-setup";
import FilterLoading from "./FilterLoading";
import FilterSearchField from "./FilterSearchField";
import NestedFilterList from "./NestedFilterList";
import {
    CANCER_BRANCH_IDS,
    CANCER_CLASSIFICATIONS,
    CANCER_ROOT_ID,
    countSelectedInClassification,
    FILTER_COLORS,
    PAN_CANCER_FILTER_ID,
    TRANSLATION_PATH,
} from "./constants";
import { CancerClassification, FilterPanelProps, FilterTree } from "./types";

const tree = filterData as FilterTree;

const listScrollSx = {
    height: "250px",
    overflowY: "auto",
    fontSize: "0.875rem",
    pr: 2,
    pb: 28,
    "& > *:not(:last-child)": {
        mb: 0.25,
    },
};

const ClassificationCard = ({
    title,
    description,
    emoji,
    countLabel,
    selected,
    onSelect,
}: {
    title: string;
    description: string;
    emoji: string;
    countLabel: string | null;
    selected: boolean;
    onSelect: () => void;
}) => (
    <Card
        variant="outlined"
        sx={{
            height: "100%",
            borderRadius: 2,
            borderColor: selected ? FILTER_COLORS.pink : "divider",
            borderWidth: selected ? 2 : 1,
            transition: "all 0.2s ease",
            "&:hover": {
                borderColor: FILTER_COLORS.pink,
                boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
            },
        }}>
        <CardActionArea onClick={onSelect} sx={{ height: "100%" }}>
            <CardContent
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    px: 4,
                    py: 4,
                }}>
                <Typography
                    component="span"
                    sx={{ fontSize: "2.5rem", lineHeight: 1 }}>
                    {emoji}
                </Typography>
                <Box>
                    <Typography variant="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                    {countLabel && (
                        <Chip
                            label={countLabel}
                            size="small"
                            sx={{
                                mt: 1,
                                bgcolor: FILTER_COLORS.pink,
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

const TermList = ({
    heading,
    headingVariant = "h6",
    items,
    listProps,
    searchTerm,
    setSearchTerm,
    isSearching,
    placeholder,
    containerSx,
}: {
    heading: string;
    headingVariant?: "h2" | "h6";
    items: FilterTree | null;
    listProps: Pick<FilterPanelProps, "handleFilterChange" | "selectedFilters">;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    isSearching: boolean;
    placeholder: string;
    containerSx: object;
}) => (
    <Box>
        <Typography variant={headingVariant} fontWeight="bold" gutterBottom>
            {heading}
        </Typography>
        <FilterSearchField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isSearching={isSearching}
            placeholder={placeholder}
        />
        <Box sx={containerSx}>
            <NestedFilterList items={items} {...listProps} />
        </Box>
    </Box>
);

const CancerTypePanel = ({
    handleFilterChange,
    selectedFilters,
    searchTerm,
    setSearchTerm,
    filteredIds,
    isSearching,
    pruneHierarchy,
}: FilterPanelProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const [selectedClassification, setSelectedClassification] =
        useState<CancerClassification | null>(null);
    const cancerGroups = tree[CANCER_ROOT_ID]?.children;

    if (!cancerGroups) return <FilterLoading />;

    const listProps = { handleFilterChange, selectedFilters };
    const panCancerSelected = selectedFilters.has(PAN_CANCER_FILTER_ID);
    const searchPlaceholder = t("cancer.searchClassification", {
        classification: selectedClassification?.toUpperCase() ?? "",
    });

    const renderClassification = () => {
        switch (selectedClassification) {
            case "cruk":
                return (
                    <TermList
                        heading={t("cancer.crukHeading")}
                        headingVariant="h2"
                        items={pruneHierarchy(
                            cancerGroups[CANCER_BRANCH_IDS.cruk]?.children,
                            filteredIds
                        )}
                        listProps={listProps}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        isSearching={isSearching}
                        placeholder={searchPlaceholder}
                        containerSx={listScrollSx}
                    />
                );
            case "tcga":
                return (
                    <TermList
                        heading={t("cancer.tcgaHeading")}
                        items={pruneHierarchy(
                            cancerGroups[CANCER_BRANCH_IDS.tcga]?.children,
                            filteredIds
                        )}
                        listProps={listProps}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        isSearching={isSearching}
                        placeholder={searchPlaceholder}
                        containerSx={{
                            maxHeight: 400,
                            overflowY: "auto",
                            pr: 1,
                        }}
                    />
                );
            case "snomed":
                return (
                    <TermList
                        heading={t("cancer.snomedHeading")}
                        items={pruneHierarchy(
                            cancerGroups[CANCER_BRANCH_IDS.snomed]?.children,
                            filteredIds
                        )}
                        listProps={listProps}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        isSearching={isSearching}
                        placeholder={searchPlaceholder}
                        containerSx={{
                            maxHeight: 400,
                            overflowY: "auto",
                            pr: 1,
                        }}
                    />
                );
            case "icdo":
                return (
                    <IcdoClassification
                        {...listProps}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        isSearching={isSearching}
                        filteredIds={filteredIds}
                        pruneHierarchy={pruneHierarchy}
                        cancerGroups={cancerGroups}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3, bgcolor: "white" }}>
            {selectedClassification ? (
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => {
                            setSelectedClassification(null);
                            setSearchTerm("");
                        }}
                        sx={{ mb: 2, textTransform: "none" }}>
                        {t("cancer.back")}
                    </Button>
                    <Divider sx={{ mb: 3 }} />
                    {renderClassification()}
                </Box>
            ) : (
                <Box>
                    {selectedFilters.size === 0 && (
                        <Typography
                            sx={{
                                display: "block",
                                color: colors.grey600,
                                fontSize: {
                                    mobile: "1.125rem",
                                    tablet: "1.25rem",
                                },
                                fontWeight: 500,
                                lineHeight: 1.4,
                                textAlign: "center",
                                mb: 2,
                                mt: { mobile: -0.5, tablet: -1 },
                            }}>
                            {t("cancer.prompt")}
                        </Typography>
                    )}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            columnGap: 1.25,
                            rowGap: 1,
                            mb: 2.5,
                        }}>
                        <Typography
                            component="span"
                            sx={{
                                fontWeight: 700,
                                color: colors.black,
                                fontSize: "1rem",
                            }}>
                            {t("cancer.browse")}
                        </Typography>
                        <Box
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                            }}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={
                                    <PublicOutlinedIcon
                                        sx={{ fontSize: "1.05rem !important" }}
                                    />
                                }
                                onClick={() =>
                                    handleFilterChange(PAN_CANCER_FILTER_ID)
                                }
                                aria-pressed={panCancerSelected}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 999,
                                    borderColor: panCancerSelected
                                        ? FILTER_COLORS.blue
                                        : FILTER_COLORS.border,
                                    color: FILTER_COLORS.blue,
                                    fontWeight: 600,
                                    bgcolor: "white",
                                    px: 1.25,
                                    py: 0.25,
                                    minHeight: 32,
                                    "& .MuiButton-startIcon": {
                                        mr: 0.5,
                                        color: FILTER_COLORS.blue,
                                    },
                                }}>
                                {t("cancer.panCancer")}
                            </Button>
                            {panCancerSelected && (
                                <CheckCircleIcon
                                    sx={{
                                        color: FILTER_COLORS.pink,
                                        fontSize: 22,
                                    }}
                                />
                            )}
                        </Box>
                        <Typography
                            component="span"
                            sx={{
                                color: colors.grey700,
                                fontSize: "0.95rem",
                                lineHeight: 1.4,
                            }}>
                            {t("cancer.browseHint")}
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {CANCER_CLASSIFICATIONS.map(classification => {
                            const count = countSelectedInClassification(
                                classification.key,
                                selectedFilters
                            );

                            return (
                                <Grid size={3} key={classification.key}>
                                    <ClassificationCard
                                        title={t(classification.titleKey)}
                                        description={t(
                                            classification.descriptionKey
                                        )}
                                        emoji={classification.emoji}
                                        countLabel={
                                            count > 0
                                                ? t("cancer.selectedCount", {
                                                      count,
                                                  })
                                                : null
                                        }
                                        selected={
                                            selectedClassification ===
                                            classification.key
                                        }
                                        onSelect={() =>
                                            setSelectedClassification(
                                                classification.key
                                            )
                                        }
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            )}
        </Paper>
    );
};

const IcdoClassification = ({
    handleFilterChange,
    selectedFilters,
    searchTerm,
    setSearchTerm,
    isSearching,
    filteredIds,
    pruneHierarchy,
    cancerGroups,
}: FilterPanelProps & { cancerGroups: FilterTree }) => {
    const t = useTranslations(TRANSLATION_PATH);
    const listProps = { handleFilterChange, selectedFilters };
    const panelSx = {
        flex: 1,
        minWidth: 0,
        p: 2,
        bgcolor: "white",
        borderRadius: 2,
        border: "1px solid",
        borderColor: FILTER_COLORS.border,
        display: "flex",
        flexDirection: "column",
        maxHeight: 480,
        overflow: "hidden",
    };
    const listSx = { flex: 1, minHeight: 0, overflowY: "auto", pr: 1 };

    return (
        <Box
            sx={{
                bgcolor: FILTER_COLORS.lightBg,
                borderRadius: 2,
                p: { mobile: 2, tablet: 2.5 },
            }}>
            <Typography
                variant="h5"
                component="h2"
                sx={{
                    color: colors.black,
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { mobile: "1.25rem", tablet: "1.375rem" },
                }}>
                {t("cancer.icdoHeading")}
            </Typography>
            <FilterSearchField
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isSearching={isSearching}
                placeholder={t("cancer.searchIcdo")}
                sx={{ mb: 2.5 }}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { mobile: "column", tablet: "row" },
                    gap: 2,
                    alignItems: "stretch",
                }}>
                <Paper elevation={0} sx={panelSx}>
                    <Typography
                        variant="subtitle1"
                        sx={{ color: colors.black, fontWeight: 700, mb: 1.5 }}>
                        {t("cancer.topography")}
                    </Typography>
                    <Box sx={listSx}>
                        <NestedFilterList
                            items={pruneHierarchy(
                                cancerGroups[CANCER_BRANCH_IDS.topography]
                                    ?.children,
                                filteredIds
                            )}
                            {...listProps}
                        />
                    </Box>
                </Paper>
                <Paper elevation={0} sx={panelSx}>
                    <Typography
                        variant="subtitle1"
                        sx={{ color: colors.black, fontWeight: 700, mb: 1.5 }}>
                        {t("cancer.histology")}
                    </Typography>
                    <Box sx={listSx}>
                        <NestedFilterList
                            items={pruneHierarchy(
                                cancerGroups[CANCER_BRANCH_IDS.histology]
                                    ?.children,
                                filteredIds
                            )}
                            {...listProps}
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default CancerTypePanel;
