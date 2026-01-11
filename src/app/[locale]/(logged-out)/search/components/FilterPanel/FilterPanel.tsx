"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bucket, BucketCheckbox, Filter } from "@/interfaces/Filter";
import { Aggregations, SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import useGTMEvent from "@/hooks/useGTMEvent";
import {
    FILTER_DATA_TYPE,
    FILTER_DATA_SUBTYPE,
    FILTER_DATA_USE_TITLES,
    FILTER_DATE_RANGE,
    FILTER_GEOGRAPHIC_LOCATION,
    FILTER_PUBLICATION_DATE,
    FILTER_PUBLICATION_TYPE,
    FILTER_PUBLISHER_NAME,
    FILTER_SECTOR,
    FILTER_ACCESS_SERVICE,
    FILTER_PROGRAMMING_LANGUAGE,
    FILTER_TYPE_CATEGORY,
    filtersList,
    FILTER_POPULATION_SIZE,
    FILTER_CONTAINS_BIOSAMPLES,
    FILTER_LICENSE,
    FILTER_MATERIAL_TYPE,
    FILTER_ORGANISATION_NAME,
    FILTER_DATA_SET_TITLES,
    FILTER_COLLECTION_NAME,
    FILTER_COLLECTION_NAMES,
    FILTER_DATA_CUSTODIAN_NETWORK,
    FILTER_FORMAT_STANDARDS,
    FILTER_COHORT_DISCOVERY,
    FILTER_DATA_PROVIDER,
    FILTER_STUDY,
} from "@/config/forms/filters";
import { SOURCE_GAT } from "@/config/forms/search";
import { colors } from "@/config/theme";
import {
    groupByType,
    isQueryEmpty,
    transformQueryFiltersToForm,
} from "@/utils/filters";
import { ClearButton } from "../ClearFilterButton/ClearFilterButton.styles";
import FilterSectionInlineSwitch from "../FilterSectionInlineSwitch";
import FilterSection from "@/components/FilterSection";

const TRANSLATION_PATH = "pages.search.components.FilterPanel.filters";
const FILTER_CATEGORY_PUBLICATIONS = "paper";
const FILTER_CATEGORY_DURS = "dataUseRegister";
const FILTER_CATEGORY_TOOLS = "tool";
const FILTER_CATEGORY_COLLECTIONS = "collection";
const STATIC_FILTER_SOURCE = "source";
const STATIC_FILTER_SOURCE_OBJECT = {
    buckets: [
        {
            value: "FED",
            label: "Search Online Publications",
        },
        {
            value: "GAT",
            label: "Search Gateway Curated Publications",
        },
    ],
    label: STATIC_FILTER_SOURCE,
    value: "",
};
const FILTER_ORDERING: { [key: string]: Array<string> } = {
    dataset: [
        FILTER_CONTAINS_BIOSAMPLES,
        FILTER_COHORT_DISCOVERY,
        FILTER_DATA_TYPE,
        FILTER_DATA_SUBTYPE,
        FILTER_FORMAT_STANDARDS,
        FILTER_STUDY,
        FILTER_PUBLISHER_NAME,
        FILTER_DATA_CUSTODIAN_NETWORK,
        FILTER_COLLECTION_NAME,
        FILTER_DATA_USE_TITLES,
        FILTER_MATERIAL_TYPE,
        FILTER_ACCESS_SERVICE,
        FILTER_DATE_RANGE,
        FILTER_POPULATION_SIZE,
        FILTER_GEOGRAPHIC_LOCATION,
        FILTER_COHORT_DISCOVERY,
    ],
    dataUseRegister: [
        FILTER_DATA_SET_TITLES,
        FILTER_PUBLISHER_NAME,
        FILTER_SECTOR,
        FILTER_ORGANISATION_NAME,
        FILTER_COLLECTION_NAMES,
    ],
    collection: [FILTER_PUBLISHER_NAME, FILTER_DATA_SET_TITLES],
    paper: [
        STATIC_FILTER_SOURCE,
        FILTER_DATA_SET_TITLES,
        FILTER_PUBLICATION_DATE,
        FILTER_PUBLICATION_TYPE,
    ],
    tool: [
        FILTER_TYPE_CATEGORY,
        FILTER_DATA_PROVIDER,
        FILTER_DATA_SET_TITLES,
        FILTER_PROGRAMMING_LANGUAGE,
        FILTER_LICENSE,
    ],
    dataProvider: [
        FILTER_DATA_SET_TITLES,
        FILTER_DATA_TYPE,
        FILTER_GEOGRAPHIC_LOCATION,
    ],
};

type DefaultValues = {
    [key: string]: { [key: string]: boolean };
};

const EMPTY_FILTERS = {
    [FILTER_PUBLISHER_NAME]: {},
    [FILTER_DATA_CUSTODIAN_NETWORK]: {},
    [FILTER_COLLECTION_NAME]: {},
    [FILTER_COLLECTION_NAMES]: {},
    [FILTER_DATA_USE_TITLES]: {},
    [FILTER_GEOGRAPHIC_LOCATION]: {},
    [FILTER_DATE_RANGE]: {},
    [FILTER_PUBLICATION_DATE]: {},
    [FILTER_PUBLICATION_TYPE]: {},
    [FILTER_ACCESS_SERVICE]: {},
    [FILTER_PROGRAMMING_LANGUAGE]: {},
    [FILTER_TYPE_CATEGORY]: {},
    [FILTER_SECTOR]: {},
    [FILTER_MATERIAL_TYPE]: {},
    [FILTER_DATA_TYPE]: {},
    [FILTER_DATA_SUBTYPE]: {},
    [FILTER_FORMAT_STANDARDS]: {},
    [FILTER_STUDY]: {},
};

const FilterPanel = ({
    filterCategory,
    filterSourceData,
    selectedFilters,
    setFilterQueryParams,
    aggregations,
    cancerTypeFilters,
    getParamString,
    resetQueryParamState,
}: {
    filterCategory: string;
    selectedFilters: { [filter: string]: string[] | undefined };
    filterSourceData: Filter[];
    setFilterQueryParams: (
        filterValues: string[],
        filterSection: string,
        secondFilterValues?: string[],
        secondFilterSections?: string
    ) => void;
    aggregations?: Aggregations;
    cancerTypeFilters?: { key: string; doc_count?: number }[];
    // eslint-disable-next-line react/no-unused-prop-types
    updateStaticFilter: (filterSection: string, value: string) => void;
    getParamString: (paramName: string) => string | null;
    // eslint-disable-next-line react/no-unused-prop-types
    showEuropePmcModal: () => void;
    resetQueryParamState: (selectedType: SearchCategory) => void;
}) => {
    const tRoot = useTranslations(TRANSLATION_PATH);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const fireGTMEvent = useGTMEvent();

    // filterValues controls the selected values of each filter
    const [filterValues, setFilterValues] =
        useState<DefaultValues>(EMPTY_FILTERS);

    const [staticFilterValues, setStaticFilterValues] = useState<DefaultValues>(
        {
            [STATIC_FILTER_SOURCE]: {
                [getParamString(STATIC_FILTER_SOURCE) || SOURCE_GAT]: true,
            },
        }
    );

    useEffect(() => {
        const defaultValues: DefaultValues = {};
        filtersList.forEach(filterName => {
            defaultValues[filterName] = transformQueryFiltersToForm(
                selectedFilters[filterName]
            );
        });
        setFilterValues(defaultValues);
    }, [selectedFilters]);

    useEffect(() => {
        if (filterCategory === FILTER_CATEGORY_PUBLICATIONS) {
            setStaticFilterValues({
                [STATIC_FILTER_SOURCE]: {
                    [getParamString(STATIC_FILTER_SOURCE) || SOURCE_GAT]: true,
                },
            });
        }
    }, [filterCategory]);

    // useForm applys to the search fields above each filter (other components, such as checkboxes/map are controlled)
    const { control, setValue } = useForm<{
        [FILTER_DATA_TYPE]: string;
        [FILTER_DATA_SUBTYPE]: string;
        [FILTER_DATA_CUSTODIAN_NETWORK]: string;
        [FILTER_FORMAT_STANDARDS]: string;
        [FILTER_STUDY]: string;
    }>({
        defaultValues: {
            [FILTER_DATA_TYPE]: "",
            [FILTER_DATA_SUBTYPE]: "",
            [FILTER_DATA_CUSTODIAN_NETWORK]: "",
            [FILTER_FORMAT_STANDARDS]: "",
            [FILTER_STUDY]: "",
        },
    });
    const filterItems = useMemo(() => {
        let formattedFilters = groupByType(
            filterSourceData,
            filterCategory
        ).filter(filterItem => filtersList.includes(filterItem.label));
        
        // Manually add any static filters not returned from the filters api
        if (filterCategory === FILTER_CATEGORY_PUBLICATIONS) {
            formattedFilters.unshift(STATIC_FILTER_SOURCE_OBJECT);
        }
        
        // Ensure study filter appears by default for datasets
        if (filterCategory === "dataset") {
            const hasStudyFilter = formattedFilters.some(
                filter => filter.label === FILTER_STUDY
            );
            if (!hasStudyFilter) {
                // Add study filter that will be populated from cancerTypeFilters, filterSourceData, or aggregations
                const studyBuckets: BucketCheckbox[] = [];
                
                // First, try to get buckets from cancerTypeFilters API
                if (cancerTypeFilters && cancerTypeFilters.length > 0) {
                    cancerTypeFilters.forEach(item => {
                        studyBuckets.push({
                            value: item.key,
                            label: item.key,
                            count: item.doc_count,
                        });
                    });
                }
                
                // Then, try to get buckets from filterSourceData (filters API)
                const studyFilterFromSource = filterSourceData.find(
                    filter => filter.keys === FILTER_STUDY && filter.type === filterCategory
                );
                if (studyFilterFromSource?.buckets) {
                    studyFilterFromSource.buckets.forEach(bucket => {
                        const existingBucket = studyBuckets.find(
                            b => b.value === bucket.key
                        );
                        if (existingBucket) {
                            // Update count from filterSourceData if not already set
                            if (!existingBucket.count) {
                                existingBucket.count = bucket.doc_count;
                            }
                        } else {
                            studyBuckets.push({
                                value: bucket.key,
                                label: bucket.key,
                                count: bucket.doc_count,
                            });
                        }
                    });
                }
                
                // Finally, merge/update with aggregations from search API
                const studyAggregations = aggregations?.[FILTER_STUDY];
                if (studyAggregations?.buckets) {
                    studyAggregations.buckets.forEach(aggBucket => {
                        const existingBucket = studyBuckets.find(
                            b => b.value === aggBucket.key
                        );
                        if (existingBucket) {
                            // Update count from aggregations (most up-to-date)
                            existingBucket.count = aggBucket.doc_count;
                        } else {
                            // Add new bucket from aggregations
                            studyBuckets.push({
                                value: aggBucket.key,
                                label: aggBucket.key,
                                count: aggBucket.doc_count,
                            });
                        }
                    });
                }
                
                formattedFilters.push({
                    label: FILTER_STUDY,
                    value: "",
                    buckets: studyBuckets,
                });
            } else {
                // Update existing study filter with aggregation counts
                const studyFilterIndex = formattedFilters.findIndex(
                    filter => filter.label === FILTER_STUDY
                );
                if (studyFilterIndex !== -1) {
                    const studyAggregations = aggregations?.[FILTER_STUDY];
                    
                    if (studyAggregations?.buckets) {
                        const updatedBuckets = formattedFilters[
                            studyFilterIndex
                        ].buckets.map(bucket => {
                            const aggregationBucket = studyAggregations.buckets?.find(
                                b => b.key === bucket.value
                            );
                            return {
                                ...bucket,
                                count:
                                    aggregationBucket?.doc_count ?? bucket.count,
                            };
                        });
                        formattedFilters[studyFilterIndex].buckets =
                            updatedBuckets;
                    }
                }
            }
        }

        // If the selected source is 'Search Online Publications' then remove the 'Dataset' filter
        if (staticFilterValues.source.FED) {
            formattedFilters = formattedFilters.filter(
                filterItem => filterItem.label !== FILTER_DATA_SET_TITLES
            );
        }

        // If on the 'Data Uses', 'Tools' or 'Collections' tabs then remove the 'Data Custodian Network' filter
        if (
            [
                FILTER_CATEGORY_DURS,
                FILTER_CATEGORY_TOOLS,
                FILTER_CATEGORY_COLLECTIONS,
            ].includes(filterCategory)
        ) {
            formattedFilters = formattedFilters.filter(
                filterItem => filterItem.label !== FILTER_DATA_CUSTODIAN_NETWORK
            );
        }
        return formattedFilters;
    }, [filterCategory, filterSourceData, staticFilterValues, aggregations, cancerTypeFilters]);

    const resetFilterSection = (filterSection: string) => {
        setFilterValues({
            ...filterValues,
            [filterSection]: {},
        });

        setFilterQueryParams([], filterSection);
    };

    const resetAllFilters = () => {
        setFilterValues(EMPTY_FILTERS);

        const type = searchParams.get("type");
        const sort = searchParams.get("sort");
        const newParams = new URLSearchParams();
        if (type) {
            newParams.set("type", type);
        }
        if (sort) {
            newParams.set("sort", sort);
        }

        const newPath = `${pathname}?${newParams.toString()}`;
        router.push(newPath, { scroll: false });

        resetQueryParamState(
            type ? (type as SearchCategory) : SearchCategory.DATASETS
        );
    };

    const updateCheckboxes = (
        updatedCheckbox: { [key: string]: boolean },
        filterSection: string
    ) => {
        // Complete set of all filter values (those that have ever been touched)
        const updates = {
            ...(filterValues[filterSection] || {}),
            ...updatedCheckbox,
        };

        // Keys of all 'true' values
        const selectedKeys = Object.keys(updates).filter(key => updates[key]);

        // key and value of updated entry
        const [key, value] = Object.entries(updatedCheckbox)[0];

        if (key) {
            const status = value ? "filter_applied" : "filter_removed";
            const searchTerm = searchParams?.get("query") || "";

            fireGTMEvent({
                event: status,
                filter_name: filterSection,
                filter_value: key,
                search_term: searchTerm,
            });
        }

        if (selectedKeys.length) {
            setFilterValues(prevValues => ({
                ...prevValues,
                [filterSection]: updates,
            }));

            setFilterQueryParams(selectedKeys, filterSection);
        } else {
            resetFilterSection(filterSection);
        }
    };

    const getFilterSortOrder = (
        itemA: {
            label: string;
            value: string;
            buckets: BucketCheckbox[];
        },
        itemB: {
            label: string;
            value: string;
            buckets: BucketCheckbox[];
        }
    ): number => {
        const ordering = FILTER_ORDERING[filterCategory];
        if (!ordering) {
            return 0;
        }

        const item1 = ordering.indexOf(itemA.label);
        const item2 = ordering.indexOf(itemB.label);

        if (item1 !== -1 && item2 !== -1) {
            return item1 - item2;
        }
        if (item1 !== -1 && item2 === -1) {
            return -1;
        }
        if (item1 === -1 && item2 !== -1) {
            return 1;
        }

        return 0;
    };

    return (
        <aside aria-label="filters">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mt: 1,
                    backgroundColor: colors.white,
                    border: `1px solid ${colors.grey300}`,
                    borderRadius: 2,
                    p: 3,
                    pb: 10,
                }}>
                <Typography variant="h2">{tRoot("filterResults")}</Typography>

                {!isQueryEmpty(selectedFilters) && (
                    <ClearButton
                        variant="link"
                        onClick={resetAllFilters}
                        sx={{ m: 0 }}>
                        {tRoot("clearAll")}
                    </ClearButton>
                )}

                <h3>Home</h3>
                <Box
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${colors.grey300}`,
                        backgroundColor: colors.white,
                    }}>
                    {filterItems.sort(getFilterSortOrder).map(filterItem => {
                        const { label } = filterItem;
                        if (
                            filterItem.label === FILTER_CONTAINS_BIOSAMPLES ||
                            filterItem.label === FILTER_COHORT_DISCOVERY
                        ) {
                            return (
                                <FilterSectionInlineSwitch
                                    key={filterItem.label}
                                    filterCategory={filterCategory}
                                    filterItem={filterItem}
                                    selectedFilters={selectedFilters}
                                    handleRadioChange={(
                                        event: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        updateCheckboxes(
                                            {
                                                [filterItem.label]:
                                                    event.target.checked,
                                            },
                                            label
                                        )
                                    }
                                    containerSx={
                                        label === FILTER_CONTAINS_BIOSAMPLES
                                            ? { pt: 1 }
                                            : { pb: 1 }
                                    }
                                />
                            );
                        }

                        if (
                            filterItem.label === FILTER_MATERIAL_TYPE &&
                            !get(selectedFilters, FILTER_CONTAINS_BIOSAMPLES)
                                ?.length
                        ) {
                            return null;
                        }

                        // Render study filter using FilterSection
                        if (filterItem.label === FILTER_STUDY) {
                            const studyAggregations = aggregations?.[FILTER_STUDY];
                            const studyCounts: { [key: string]: number } = {};
                            studyAggregations?.buckets?.forEach(bucket => {
                                studyCounts[bucket.key] = bucket.doc_count;
                            });

                            return (
                                <FilterSection
                                    key={filterItem.label}
                                    filterItem={filterItem}
                                    filterSection={FILTER_STUDY}
                                    control={control}
                                    checkboxValues={
                                        filterValues[FILTER_STUDY] || {}
                                    }
                                    counts={studyCounts}
                                    countsDisabled={false}
                                    handleCheckboxChange={updatedCheckbox =>
                                        updateCheckboxes(
                                            updatedCheckbox,
                                            FILTER_STUDY
                                        )
                                    }
                                    setValue={(name, value) => {
                                        if (typeof value === "string") {
                                            setValue(name, value);
                                        }
                                    }}
                                    resetFilterSection={() =>
                                        resetFilterSection(FILTER_STUDY)
                                    }
                                />
                            );
                        }
                        // const isPublicationSource = label === STATIC_FILTER_SOURCE;

                        return null;
                    })}
                </Box>
            </Box>
        </aside>
    );
};

export default FilterPanel;
