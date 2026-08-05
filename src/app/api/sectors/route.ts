import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import apis from "@/config/apis";
import config from "@/config/config";
import { sessionHeader, sessionPrefix } from "@/config/session";
import { getSessionCookie } from "@/utils/getSessionCookie";
import { logger } from "@/utils/logger";
import { getPartnerHeaders } from "@/utils/partnerHeaders";

async function getAuthHeaders() {
    const session = await getSessionCookie();
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get(config.JWT_COOKIE)?.value;

    if (!jwtToken) {
        return null;
    }

    return {
        Authorization: `Bearer ${jwtToken}`,
        [sessionHeader]: sessionPrefix + session,
        ...getPartnerHeaders(),
    };
}

export async function GET() {
    const session = await getSessionCookie();
    const headers = await getAuthHeaders();

    if (!headers) {
        return NextResponse.json(
            { code: 401, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const response = await fetch(apis.sectorsV1UrlIP, { headers });
        const json = await response.json();
        return NextResponse.json(json, { status: response.status });
    } catch (error) {
        logger.error(
            error instanceof Error ? error.message : String(error),
            session,
            "api/sectors"
        );

        return NextResponse.json(
            { message: "Failed to fetch sectors" },
            { status: 500 }
        );
    }
}

