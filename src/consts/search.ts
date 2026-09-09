const SEARCH_AGGREGATION_PROVIDER = "HDRUK";
const SEARCH_AGGREGATION_PROVIDERS = [SEARCH_AGGREGATION_PROVIDER] as const;

const FILTER_TYPE_MAPPING: { [key: string]: string } = {
    datasets: "dataset",
    dur: "dataUseRegister",
    publications: "paper",
    collections: "collection",
    data_providers: "dataProvider",
    data_custodians: "dataProvider",
    tools: "tool",
};

const SEARCH_CHAR_LIMIT = 3;

export {
    FILTER_TYPE_MAPPING,
    SEARCH_AGGREGATION_PROVIDER,
    SEARCH_AGGREGATION_PROVIDERS,
    SEARCH_CHAR_LIMIT,
};
