import {
    createGatewayFlagAdapter,
    resetGatewayFlagCache,
} from "./gatewayFlagAdapter";

jest.mock("@/config/apis", () => ({
    __esModule: true,
    default: {
        enabledFeatureFlags: "http://localhost/mock-api/feature-flags/enabled",
        enabledFeatures: "http://localhost/mock-api/features",
    },
}));

describe("createGatewayFlagAdapter", () => {
    const mockResponse = {
        SDEConciergeServiceEnquiry: { enabled: true },
        Aliases: { enabled: false },
    };

    let adapter: ReturnType<ReturnType<typeof createGatewayFlagAdapter>>;

    beforeEach(() => {
        resetGatewayFlagCache();
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        }) as jest.Mock;

        jest.useFakeTimers();
        adapter = createGatewayFlagAdapter()();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it("refetches after TTL expiry", async () => {
        await adapter.decide({ key: "SDEConciergeServiceEnquiry" });

        jest.advanceTimersByTime(5 * 60 * 1000 + 1);

        await adapter.decide({ key: "Aliases" });

        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("fetches and caches feature flags", async () => {
        const result = await adapter.decide({
            key: "SDEConciergeServiceEnquiry",
        });
        expect(result).toBe(true);

        const result2 = await adapter.decide({ key: "Aliases" });
        expect(result2).toBe(false);

        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("handles API failure gracefully", async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: false,
                statusText: "Service Unavailable",
            })
            .mockResolvedValueOnce({
                ok: false,
                statusText: "Service Unavailable",
            });

        const result = await adapter.decide({ key: "NonExistent" });
        expect(result).toBe(false);
    });

    it("parses legacy boolean feature flags", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: {
                    SDEConciergeServiceEnquiry: true,
                    Aliases: false,
                },
            }),
        });

        const adapterWithLegacy = createGatewayFlagAdapter()();
        const result = await adapterWithLegacy.decide({
            key: "SDEConciergeServiceEnquiry",
        });

        expect(result).toBe(true);
    });

    it("falls back to legacy endpoint when feature flags endpoint fails", async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: false,
                statusText: "Not Found",
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: {
                        SDEConciergeServiceEnquiry: true,
                    },
                }),
            });

        const fallbackAdapter = createGatewayFlagAdapter()();
        const result = await fallbackAdapter.decide({
            key: "SDEConciergeServiceEnquiry",
        });

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(result).toBe(true);
    });

    it("handles network error gracefully", async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

        const result = await adapter.decide({ key: "NonExistent" });
        expect(result).toBe(false);
    });
});
