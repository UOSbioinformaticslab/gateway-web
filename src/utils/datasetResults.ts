import { get } from "lodash";
import { SearchResultDataset } from "@/interfaces/Search";
import { evaluateLogicTokens, filterType, LogicToken } from "@/utils/logic-utils";
import {
    getAccessibility,
    getDatasetTableDataRange,
    getLeadResearcher,
} from "@/utils/search";

export type DatasetSortColumn =
    | "favourite"
    | "title"
    | "leadResearcher"
    | "popSize"
    | "accessibility"
    | "dataRange";

export type DatasetSortDirection = "asc" | "desc";

const PAN_CANCER_FILTER_ID = "pan-cancer";

type DatasetFilter = { id?: string; label?: string };

const ownedFilterIds = (result: SearchResultDataset): Set<string> => {
    const filters = get(result, "metadata.datasetFilters");
    const ids = new Set<string>();
    if (!Array.isArray(filters)) return ids;

    filters.forEach((filter: DatasetFilter) => {
        if (filter?.id) ids.add(String(filter.id));
        if (
            typeof filter?.label === "string" &&
            /pan[-\s]?cancer/i.test(filter.label)
        ) {
            ids.add(PAN_CANCER_FILTER_ID);
        }
    });

    return ids;
};

const hasSelectedFilter = (owned: Set<string>, id: string): boolean => {
    if (owned.has(id)) return true;

    for (const own of owned) {
        if (own.startsWith(`${id}_`) || id.startsWith(`${own}_`)) {
            return true;
        }
    }

    return false;
};

export const datasetMatchesFilters = (
    result: SearchResultDataset,
    selectedIds: string[],
    logicTokens?: LogicToken[]
): boolean => {
    if (selectedIds.length === 0 && (!logicTokens || logicTokens.length === 0)) {
        return true;
    }

    const owned = ownedFilterIds(result);

    if (logicTokens && logicTokens.length > 0) {
        const evaluated = evaluateLogicTokens(logicTokens, id =>
            hasSelectedFilter(owned, id)
        );
        if (evaluated !== null) return evaluated;
    }

    if (selectedIds.length === 0) return true;
    const histology: string[] = [];
    const topography: string[] = [];
    const data: string[] = [];
    const access: string[] = [];

    selectedIds.forEach(id => {
        if (id === PAN_CANCER_FILTER_ID) {
            topography.push(id);
            return;
        }

        const kind = filterType(id);
        if (kind === "hist") histology.push(id);
        else if (kind === "data") data.push(id);
        else if (kind === "access") access.push(id);
        else if (
            kind === "top" ||
            kind === "cruk" ||
            kind === "snomed" ||
            kind === "tcga"
        ) {
            topography.push(id);
        }
    });

    const anyOf = (ids: string[]) =>
        ids.length === 0 || ids.some(id => hasSelectedFilter(owned, id));
    const allOf = (ids: string[]) =>
        ids.every(id => hasSelectedFilter(owned, id));

    return (
        anyOf(histology) && anyOf(topography) && allOf(data) && anyOf(access)
    );
};

export const datasetMatchesQuery = (
    result: SearchResultDataset,
    query: string
): boolean => {
    const term = query.trim().toLowerCase();
    if (!term) return true;

    const haystack = [
        get(result, "metadata.summary.title"),
        get(result, "metadata.summary.abstract"),
        getLeadResearcher(result),
        getAccessibility(result),
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return haystack.includes(term);
};

const sortValue = (
    result: SearchResultDataset,
    column: DatasetSortColumn
): string | number => {
    switch (column) {
        case "title":
            return String(get(result, "metadata.summary.title") || "").toLowerCase();
        case "leadResearcher":
            return getLeadResearcher(result).toLowerCase();
        case "popSize": {
            const raw = get(result, "metadata.summary.populationSize");
            const numeric = Number(String(raw ?? "").replace(/,/g, ""));
            return Number.isFinite(numeric) && numeric > 0 ? numeric : -1;
        }
        case "accessibility":
            return getAccessibility(result).toLowerCase();
        case "dataRange":
            return getDatasetTableDataRange(result) || "";
        default:
            return "";
    }
};

const isEmptySortValue = (value: string | number) => value === "" || value === -1;

export const compareDatasets = (
    left: SearchResultDataset,
    right: SearchResultDataset,
    column: DatasetSortColumn,
    direction: DatasetSortDirection
): number => {
    if (column === "favourite") return 0;

    const leftValue = sortValue(left, column);
    const rightValue = sortValue(right, column);
    if (isEmptySortValue(leftValue) && isEmptySortValue(rightValue)) return 0;
    if (isEmptySortValue(leftValue)) return 1;
    if (isEmptySortValue(rightValue)) return -1;

    const compared =
        typeof leftValue === "number" && typeof rightValue === "number"
            ? leftValue - rightValue
            : String(leftValue).localeCompare(String(rightValue), undefined, {
                  numeric: true,
                  sensitivity: "base",
              });

    return direction === "asc" ? compared : -compared;
};

export const applyDatasetView = (
    results: SearchResultDataset[],
    options: {
        query: string;
        filterIds: string[];
        logicTokens?: LogicToken[];
        sortColumn: DatasetSortColumn;
        sortDirection: DatasetSortDirection;
    }
): SearchResultDataset[] => {
    return results
        .filter(
            result =>
                datasetMatchesQuery(result, options.query) &&
                datasetMatchesFilters(
                    result,
                    options.filterIds,
                    options.logicTokens
                )
        )
        .sort((left, right) =>
            compareDatasets(
                left,
                right,
                options.sortColumn,
                options.sortDirection
            )
        );
};
