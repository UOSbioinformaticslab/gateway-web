import { rest } from "msw";
import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { PageTemplatePromo } from "@/interfaces/Cms";
import { SearchCategory } from "@/interfaces/Search";
import { V4Schema } from "@/interfaces/V4Schema";
import apis from "@/config/apis";
import messages from "@/config/messages/en.json";
import { fireEvent, render, screen, waitFor, within } from "@/utils/testUtils";
import { server } from "@/mocks/server";
import Search from "./Search";

const t = messages.pages.search;

interface SearchBody {
    type?: string;
    query?: string;
    sort?: string;
    page?: string;
    per_page?: string;
    dataSource?: string;
    view_type?: string;
    filters?: Record<string, Record<string, unknown>>;
}

let requests: SearchBody[];

const lastBody = () => requests[requests.length - 1];

const cohortDiscovery = {
    id: "1",
    title: "Cohort discovery",
    template: {
        promofields: {
            bannerTitle: "",
            topLeftPanel: "",
            middlePanel: "",
        },
    },
} as PageTemplatePromo;

const aggregationResponse = (
    type: SearchCategory,
    hits: object[] = [{ _id: "1", highlight: {} }],
    total = hits.length
) => ({
    data: {
        type,
        results: {
            HDRUK: {
                hits,
                total,
                aggregations: {},
            },
        },
    },
});

const renderSearch = (url: string) => {
    mockRouter.setCurrentUrl(url);

    return render(
        <MemoryRouterProvider>
            <Search
                filters={[]}
                cohortDiscovery={cohortDiscovery}
                schema={{ $defs: {} } as V4Schema}
            />
        </MemoryRouterProvider>
    );
};

describe("Search", () => {
    beforeEach(() => {
        process.env.NEXT_PUBLIC_PARTNER_CONTEXT = "CRUK";
        requests = [];
        server.use(
            rest.post(apis.searchAggregationV2Url, async (req, res, ctx) => {
                const body = (await req.json()) as SearchBody;
                requests.push(body);

                return res(
                    ctx.json(
                        aggregationResponse(
                            (body.type as SearchCategory) ||
                                SearchCategory.DATASETS,
                            [{ _id: "1", highlight: {} }],
                            100
                        )
                    )
                );
            })
        );
        window.scrollTo = jest.fn();
    });

    it("requests the search described by the url", async () => {
        renderSearch(
            "/search?query=asthma&sort=name:asc&page=3&publisherName=Publisher A|Publisher B"
        );

        await waitFor(() => expect(requests.length).toBeGreaterThan(0));
        expect(lastBody()).toMatchObject({
            type: "datasets",
            query: "asthma",
            sort: "name:asc",
            per_page: "25",
            page: "3",
            dataSource: "HDRUK",
            filters: {
                dataset: { publisherName: ["Publisher A", "Publisher B"] },
            },
        });
    });

    it("requests gateway publications and tools through v2", async () => {
        renderSearch("/search?type=publications");

        await waitFor(() =>
            expect(lastBody()).toMatchObject({
                type: "publications",
                dataSource: "HDRUK",
                page: "1",
            })
        );
        expect(lastBody()).not.toHaveProperty("view_type");

        requests = [];
        renderSearch("/search?type=tools&query=cancer");

        await waitFor(() =>
            expect(lastBody()).toMatchObject({
                type: "tools",
                query: "cancer",
                dataSource: "HDRUK",
            })
        );
        expect(lastBody()).not.toHaveProperty("filters");
    });

    it("does not search europe pmc without a query", async () => {
        const v1Requests: string[] = [];
        server.use(
            rest.post(`${apis.searchV1Url}/:type`, (req, res, ctx) => {
                v1Requests.push(req.url.href);
                return res(ctx.json({ data: [] }));
            })
        );

        renderSearch("/search?type=publications&source=FED");

        await new Promise(resolve => setTimeout(resolve, 50));
        expect(v1Requests).toHaveLength(0);
        expect(requests).toHaveLength(0);
    });

    it("searches europe pmc on v1 without view_type", async () => {
        const v1Requests: string[] = [];
        server.use(
            rest.post(`${apis.searchV1Url}/:type`, (req, res, ctx) => {
                v1Requests.push(req.url.href);
                return res(
                    ctx.json({
                        data: [],
                        current_page: 1,
                        last_page: 1,
                        path: "/api/search/publications",
                    })
                );
            })
        );

        renderSearch("/search?type=publications&source=FED&query=cancer");

        await waitFor(() => expect(v1Requests).toHaveLength(1));
        expect(v1Requests[0]).toContain("source=FED");
        expect(v1Requests[0]).not.toContain("view_type");
        expect(requests).toHaveLength(0);
    });

    it("submits a query and resets the page", async () => {
        renderSearch("/search?query=asthma&page=3");
        await waitFor(() => expect(requests.length).toBeGreaterThan(0));

        fireEvent.change(screen.getByRole("textbox", { name: "Search" }), {
            target: { value: "cancer" },
        });
        fireEvent.submit(screen.getByRole("search"));

        await waitFor(() =>
            expect(lastBody()).toMatchObject({ query: "cancer", page: "1" })
        );
    });

    it("removes a filter chip", async () => {
        renderSearch("/search?publisherName=Publisher A|Publisher B&page=2");
        await waitFor(() => expect(requests.length).toBeGreaterThan(0));

        const chip = screen
            .getAllByText("Publisher A")
            .map(element => element.closest(".MuiChip-root"))
            .find(Boolean) as HTMLElement;
        fireEvent.click(within(chip).getByTestId("CloseIcon"));

        await waitFor(() =>
            expect(lastBody().filters?.dataset.publisherName).toEqual([
                "Publisher B",
            ])
        );
    });

    it("moves to the next page keeping the other params", async () => {
        server.use(
            rest.post(apis.searchAggregationV2Url, async (req, res, ctx) => {
                const body = (await req.json()) as SearchBody;
                requests.push(body);

                return res(
                    ctx.json(
                        aggregationResponse(SearchCategory.DATASETS, [], 60)
                    )
                );
            })
        );
        renderSearch("/search?query=asthma");
        await waitFor(() => expect(requests.length).toBeGreaterThan(0));

        fireEvent.click(
            screen.getByRole("button", { name: "Go to next page" })
        );

        await waitFor(() => expect(lastBody().page).toBe("2"));
        expect(lastBody().query).toBe("asthma");
    });

    it("shows the no results message when nothing matches", async () => {
        server.use(
            rest.post(apis.searchAggregationV2Url, async (req, res, ctx) => {
                const body = (await req.json()) as SearchBody;
                requests.push(body);

                return res(
                    ctx.json(
                        aggregationResponse(
                            (body.type as SearchCategory) ||
                                SearchCategory.DATASETS,
                            []
                        )
                    )
                );
            })
        );

        renderSearch("/search?query=nothing");

        expect(await screen.findByText(t.noResults)).toBeInTheDocument();
    });
});
