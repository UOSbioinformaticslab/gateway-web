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

    it("keeps all hits when the API returns a sparse object", () => {
        const mapped = mapSearchAggregation(
            {
                type: "datasets",
                results: {
                    HDRUK: {
                        hits: {
                            0: { _id: "1" },
                            2: { _id: "3" },
                        } as never,
                        total: 2,
                    },
                },
            },
            "HDRUK",
            1,
            25
        );

        expect(mapped?.list.map(hit => hit._id)).toEqual(["1", "3"]);
    });

    it("adds placeholder rows for indexed ids dropped during hydration", () => {
        const mapped = mapSearchAggregation(
            {
                type: "datasets",
                results: {
                    HDRUK: {
                        hits: [{ _id: "1" } as never, { _id: "2" } as never],
                        ids: [1, 2, 3, 4],
                        total: 4,
                    },
                },
            },
            "HDRUK",
            1,
            25
        );

        expect(mapped?.list).toHaveLength(4);
        expect(mapped?.list.map(hit => hit._id)).toEqual(["1", "2", "3", "4"]);
    });
});
