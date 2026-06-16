export function getPartnerHeaders(): Record<string, string> {
    // Partner headers are only sent from the server. Browser requests to the
    // external API are cross-origin and the gateway API CORS policy does not
    // allow x-partner-context on preflight from localhost.
    if (typeof window !== "undefined") {
        return {};
    }

    const partner =
        process.env.NEXT_PUBLIC_PARTNER_CONTEXT ??
        process.env.NEXT_PUBLIC_PARTNER ??
        "";

    if (!partner) return {};

    return {
        "x-partner-context": partner,
    };
}

