import { Filter } from "@/interfaces/Filter";
import { FILTER_DATA_SUBTYPE } from "@/config/forms/filters";
import { getFilters, getSchemaFromTraser, getCancerTypeFilters } from "@/utils/api";
import { getCohortDiscovery } from "@/utils/cms";
import metaData, { noFollowRobots } from "@/utils/metadata";
import Search from "./components/Search";

export const metadata = metaData(
    {
        title: "Search",
        description: "",
    },
    noFollowRobots
);

const SearchPage = async () => {
    const filters: Filter[] = await getFilters();
    const cohortDiscovery = await getCohortDiscovery();
    const cancerTypeFilters = await getCancerTypeFilters();

    const adjustedFilters = filters.map(filter => {
        if (filter.keys === FILTER_DATA_SUBTYPE) {
            return {
                ...filter,
                buckets: filter.buckets.filter(
                    bucket => bucket.key !== "Not applicable"
                ),
            };
        }
        return filter;
    });

    const SCHEMA_NAME = "CRUK";
    const SCHEMA_VERSION = "1.0.0";

    const traserResponse = process.env.TRASER_SERVICE_URL
        ? await getSchemaFromTraser(SCHEMA_NAME, SCHEMA_VERSION)
        : null;
    const schema = traserResponse?.schema ?? { $defs: {} };

    return (
        <Search
            filters={adjustedFilters}
            cohortDiscovery={cohortDiscovery}
            schema={schema}
            cancerTypeFilters={cancerTypeFilters}
        />
    );
};

export default SearchPage;
