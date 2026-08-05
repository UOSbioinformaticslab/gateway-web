export function getPartnerContext(): string {
    return (
        process.env.NEXT_PUBLIC_PARTNER_CONTEXT ??
        process.env.NEXT_PUBLIC_PARTNER ??
        ""
    );
}

export function getPartnerHeaders(): Record<string, string> {
    const partner = getPartnerContext();

    if (!partner) return {};

    return {
        "x-partner-context": partner,
    };
}

/** Auth provider slug sent in login/register body (e.g. CRUK → "cruk"). */
export function getPartnerAuthProvider(): string | undefined {
    const partner = getPartnerContext().toLowerCase();

    if (partner === "cruk") {
        return "cruk";
    }

    return undefined;
}

export function withPartnerAuthBody<T extends Record<string, unknown>>(
    body: T
): T & { provider?: string } {
    const provider = getPartnerAuthProvider();

    if (!provider || body.provider) {
        return body;
    }

    return { ...body, provider };
}

