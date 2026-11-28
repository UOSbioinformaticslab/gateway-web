import { SearchResultDataset } from "@/interfaces/Search";
import { applyDatasetView } from "./datasetResults";

const dataset = (
    id: string,
    title: string,
    extras: Record<string, unknown> = {}
): SearchResultDataset =>
    ({
        _id: id,
        metadata: {
            summary: {
                title,
                abstract: extras.abstract,
                leadResearcher: extras.leadResearcher,
                populationSize: extras.populationSize,
            },
            datasetFilters: extras.datasetFilters ?? [],
            provenance: extras.provenance,
        },
    }) as SearchResultDataset;

describe("applyDatasetView", () => {
    const results = [
        dataset("2", "Renal Cohort", {
            leadResearcher: "Dr. Fischer",
            populationSize: 100,
            abstract: "Kidney immunotherapy registry",
            datasetFilters: [
                { id: "0_1_0", label: "no restriction", category: "accessType" },
            ],
        }),
        dataset("1", "Ovarian Cohort", {
            leadResearcher: "Dr. Patel",
            populationSize: 900,
            abstract: "Organoid chemoresistance",
            datasetFilters: [
                {
                    id: "0_1_5",
                    label: "non-commercial use only",
                    category: "accessType",
                },
            ],
        }),
    ];

    it("filters the table by the search text", () => {
        const viewed = applyDatasetView(results, {
            query: "ovarian",
            filterIds: [],
            sortColumn: "title",
            sortDirection: "asc",
        });

        expect(viewed.map(item => item._id)).toEqual(["1"]);
    });

    it("filters the table by a selected access filter", () => {
        const viewed = applyDatasetView(results, {
            query: "",
            filterIds: ["0_1_5"],
            sortColumn: "title",
            sortDirection: "asc",
        });

        expect(viewed.map(item => item._id)).toEqual(["1"]);
    });

    it("treats AND as narrower than OR", () => {
        const results = [
            dataset("a", "Not for profit", {
                datasetFilters: [
                    {
                        id: "0_1_4",
                        label: "not for profit organisation use only",
                    },
                ],
            }),
            dataset("b", "Non commercial", {
                datasetFilters: [
                    { id: "0_1_5", label: "non-commercial use only" },
                ],
            }),
        ];
        const orTokens = [
            { kind: "term" as const, id: "0_1_4", label: "not for profit" },
            { kind: "op" as const, value: "OR" as const },
            { kind: "term" as const, id: "0_1_5", label: "non-commercial" },
        ];
        const andTokens = orTokens.map(token =>
            token.kind === "op" ? { ...token, value: "AND" as const } : token
        );

        expect(
            applyDatasetView(results, {
                query: "",
                filterIds: ["0_1_4", "0_1_5"],
                logicTokens: orTokens,
                sortColumn: "title",
                sortDirection: "asc",
            }).map(item => item._id)
        ).toEqual(["b", "a"]);

        expect(
            applyDatasetView(results, {
                query: "",
                filterIds: ["0_1_4", "0_1_5"],
                logicTokens: andTokens,
                sortColumn: "title",
                sortDirection: "asc",
            }).map(item => item._id)
        ).toEqual([]);
    });

    it("sorts the table by population size", () => {
        const viewed = applyDatasetView(results, {
            query: "",
            filterIds: [],
            sortColumn: "popSize",
            sortDirection: "desc",
        });

        expect(viewed.map(item => item._id)).toEqual(["1", "2"]);
    });
});
