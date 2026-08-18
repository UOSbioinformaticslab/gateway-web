import {
    Aggregations,
    SearchAggregationData,
    SearchPaginationType,
    SearchResult,
} from "@/interfaces/Search";

export function mapSearchAggregation(
    payload: SearchAggregationData | null | undefined,
    provider: string,
    page: number,
    perPage: number
): SearchPaginationType<SearchResult> | null | undefined {
    if (payload === undefined) return undefined;
    if (payload === null) return null;

    const result = payload.results?.[provider];
    const total = result?.total ?? 0;
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safePerPage =
        Number.isFinite(perPage) && perPage > 0 ? perPage : 25;
    const lastPage = Math.max(1, Math.ceil(total / safePerPage) || 1);

    return {
        list: result?.hits ?? [],
        aggregations: result?.aggregations ?? ({} as Aggregations),
        total,
        lastPage,
        currentPage: safePage,
        from: total === 0 ? 0 : (safePage - 1) * safePerPage + 1,
        to: Math.min(safePage * safePerPage, total),
        path: payload.type ?? "",
        elastic_total: total,
    };
}
