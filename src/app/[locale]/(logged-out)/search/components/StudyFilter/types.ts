export type FilterPanelId = "cancer" | "data" | "access";

export type CancerClassification = "cruk" | "tcga" | "snomed" | "icdo";

export type FilterNode = {
    id: string;
    label: string;
    description?: string;
    category?: string;
    children?: FilterTree;
    count?: number;
};

export type FilterTree = Record<string, FilterNode>;

export type FilterDetail = {
    id: string;
    label: string;
    category: string;
    group: string;
};

export type PruneHierarchy = (
    nodes: FilterTree | null | undefined,
    filteredIds: Set<string> | null
) => FilterTree | null;

export type FilterPanelProps = {
    handleFilterChange: (id: string) => void;
    selectedFilters: Set<string>;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filteredIds: Set<string> | null;
    isSearching: boolean;
    pruneHierarchy: PruneHierarchy;
};
