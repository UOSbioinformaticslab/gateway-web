import { get } from "lodash";
import { ReadonlyURLSearchParams } from "next/navigation";
import { Metadata } from "@/interfaces/Dataset";
import { SearchResultDataset } from "@/interfaces/Search";
import { Filter } from "@/interfaces/Filter";
import {
    SavedSearchFilterWithPivot,
    SearchQueryParams,
} from "@/interfaces/Search";
import { RouteName } from "@/consts/routeName";
import { FILTER_TYPE_MAPPING, SEARCH_CHAR_LIMIT } from "@/consts/search";
import { formatDate } from "./date";

const getDateRange = (metadata: Metadata) => {
    const endDate = get(metadata, "provenance.temporal.endDate");
    const startDate = get(metadata, "provenance.temporal.startDate");
    if (!endDate && !startDate) return "n/a";
    return `${startDate ? formatDate(startDate, "YYYY") : ""}-${
        endDate ? formatDate(endDate, "YYYY") : ""
    }`;
};

const getPopulationSize = (
    source: Metadata | SearchResultDataset | undefined,
    notReportedLabel: string
) => {
    if (!source) return notReportedLabel;

    const population =
        get(source, "metadata.summary.populationSize") ??
        get(source, "metadata.metadata.summary.populationSize") ??
        get(source, "summary.populationSize");

    const numericPopulation = Number(
        String(population ?? "").replace(/,/g, "")
    );

    return Number.isFinite(numericPopulation) && numericPopulation > 0
        ? numericPopulation.toLocaleString()
        : notReportedLabel;
};

const getLeadResearcher = (result: SearchResultDataset): string => {
    const fromSummary = get(result, "metadata.summary.leadResearcher");
    if (fromSummary) return String(fromSummary);

    const projectGrants = get(result, "metadata.projectGrants");
    if (Array.isArray(projectGrants) && projectGrants.length > 0) {
        const fromGrant = get(projectGrants[0], "leadResearcher");
        if (fromGrant) return String(fromGrant);
    }

    return "";
};

const getAccessibility = (result: SearchResultDataset): string => {
    const datasetFilters = get(result, "metadata.datasetFilters") as
        | { category?: string; label?: string }[]
        | undefined;
    if (!Array.isArray(datasetFilters)) return "";

    const accessibility = datasetFilters.find(
        filter => filter.category === "accessType"
    );
    const label = accessibility?.label?.trim();

    return label || "";
};

const getAllParams = (searchParams: ReadonlyURLSearchParams | null) => {
    const params: { [key: string]: string } = {};

    Array.from(searchParams?.entries() || []).forEach(([key, value]) => {
        params[key] = value;
    });

    return params;
};

const getFiltersFromSaveSearch = (filters: SavedSearchFilterWithPivot[]) => {
    return filters.reduce((accumulator, currentValue) => {
        const {
            keys,
            pivot: { terms },
        } = currentValue;

        return {
            ...accumulator,
            [keys]: JSON.parse(terms),
        };
    }, {});
};

const getSaveSearchFilters = (
    filters: Filter[],
    queryParams: SearchQueryParams
) => {
    const typeFilters = filters.filter(
        filter => FILTER_TYPE_MAPPING[queryParams.type] === filter.type
    );

    return typeFilters
        .map(({ id, keys }) => {
            const terms = queryParams[keys as keyof SearchQueryParams];

            return {
                id,
                terms: typeof terms === "string" ? [terms] : terms,
            };
        })
        .filter(({ terms }) => !!terms);
};

const getUrlFromSearchParams = (
    type: string,
    search_term: string,
    filters: { [key: string]: string[] },
    sort: string
) => {
    const params = new URLSearchParams();

    params.set("type", type);

    if (search_term) {
        params.set("query", search_term);
    }

    Object.keys(filters).forEach((key: string) => {
        params.set(key, filters[key].join("|"));
    });

    params.set("sort", sort);

    return `/${RouteName.SEARCH}?${params.toString()}`;
};

const hasMinimumSearchCharLength = (value: string | null | undefined) => {
    return (value?.length || 0) >= SEARCH_CHAR_LIMIT;
};

export {
    getAccessibility,
    getAllParams,
    getDateRange,
    getFiltersFromSaveSearch,
    getLeadResearcher,
    getPopulationSize,
    getSaveSearchFilters,
    getUrlFromSearchParams,
    hasMinimumSearchCharLength,
};
