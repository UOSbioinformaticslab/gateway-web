import {
    Aggregations,
    SearchAggregationData,
    SearchPaginationType,
    SearchResult,
    SearchResultDataset,
} from "@/interfaces/Search";

const EMPTY_TEAM: SearchResultDataset["team"] = {
    id: 0,
    member_of: "",
    name: "",
    is_question_bank: false,
    has_published_dar_template: false,
    is_dar: false,
    dar_modal_header: null,
    dar_modal_content: null,
    dar_modal_footer: null,
};

type LooseHit = SearchResult & {
    _source?: Record<string, unknown>;
    metadata?: SearchResultDataset["metadata"];
};

function asHitList(hits: unknown): LooseHit[] {
    const values = Array.isArray(hits)
        ? hits
        : hits && typeof hits === "object"
          ? Object.values(hits)
          : [];

    return values.filter(
        (hit): hit is LooseHit => hit != null && typeof hit === "object"
    );
}

function flattenHit(hit: LooseHit): SearchResult {
    const source = hit._source ?? {};
    const metadata =
        hit.metadata ??
        (source.metadata as SearchResultDataset["metadata"] | undefined);

    const sourceTitle =
        (typeof source.shortTitle === "string" && source.shortTitle) ||
        (typeof source.title === "string" && source.title) ||
        (typeof source.name === "string" && source.name) ||
        "";

    return {
        ...hit,
        _id: String(hit._id ?? source.dataset_id ?? source.id ?? ""),
        metadata:
            metadata ??
            (sourceTitle
                ? ({
                      summary: { title: sourceTitle, shortTitle: sourceTitle },
                  } as SearchResultDataset["metadata"])
                : hit.metadata),
        highlight: hit.highlight ?? {},
        team: hit.team ?? EMPTY_TEAM,
    } as SearchResult;
}

function placeholderHit(id: string): SearchResultDataset {
    return {
        _id: id,
        highlight: {},
        metadata: {
            summary: { title: `Dataset ${id}` },
        } as SearchResultDataset["metadata"],
        team: EMPTY_TEAM,
    };
}

export function mapSearchAggregation(
    payload: SearchAggregationData | null | undefined,
    provider: string,
    page: number,
    perPage: number
): SearchPaginationType<SearchResult> | null | undefined {
    if (payload === undefined) return undefined;
    if (payload === null) return null;

    const result = payload.results?.[provider];
    const hits = asHitList(result?.hits).map(flattenHit);
    const hitIds = new Set(hits.map(hit => String(hit._id)));
    const missing = (result?.ids ?? [])
        .map(id => String(id))
        .filter(id => id && !hitIds.has(id))
        .map(placeholderHit);

    const list = [...hits, ...missing];
    const total = result?.total ?? list.length;
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safePerPage =
        Number.isFinite(perPage) && perPage > 0 ? perPage : 25;
    const lastPage = Math.max(1, Math.ceil(total / safePerPage) || 1);

    return {
        list,
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
