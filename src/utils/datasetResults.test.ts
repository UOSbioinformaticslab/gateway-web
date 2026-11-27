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
