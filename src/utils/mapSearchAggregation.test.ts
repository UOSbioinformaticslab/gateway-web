import { mapSearchAggregation } from "./mapSearchAggregation";

describe("mapSearchAggregation", () => {
    it("returns undefined while the request is loading", () => {
        expect(mapSearchAggregation(undefined, "HDRUK", 1, 25)).toBeUndefined();
    });

    it("returns null when the request failed", () => {
        expect(mapSearchAggregation(null, "HDRUK", 1, 25)).toBeNull();
    });

    it("maps HDRUK hits into the search results list", () => {
        const mapped = mapSearchAggregation(
            {
                query: "",
                type: "datasets",
                results: {
                    HDRUK: {
                        hits: [{ _id: "1" } as never],
                        total: 26,
                        aggregations: { sector: { buckets: [] } } as never,
                    },
                },
            },
            "HDRUK",
            2,
            25
        );

        expect(mapped?.list).toHaveLength(1);
        expect(mapped?.total).toBe(26);
        expect(mapped?.lastPage).toBe(2);
        expect(mapped?.currentPage).toBe(2);
        expect(mapped?.from).toBe(26);
        expect(mapped?.to).toBe(26);
        expect(mapped?.path).toBe("datasets");
        expect(mapped?.elastic_total).toBe(26);
    });
});
