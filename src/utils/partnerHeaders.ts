export function getPartnerHeaders(): Record<string, string> {
    const partner =
        process.env.NEXT_PUBLIC_PARTNER_CONTEXT ??
        process.env.NEXT_PUBLIC_PARTNER ??
        "";

    if (!partner) return {};

    return {
        "x-partner": partner,
        "x-partner-context": partner,
    };
}

