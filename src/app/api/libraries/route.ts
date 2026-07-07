import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
    const session = await getSessionCookie();
    const headers = await getAuthHeaders();

    if (!headers) {
        return NextResponse.json(
            { code: 401, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { searchParams } = request.nextUrl;
        const query = searchParams.toString();
        const url = `${apis.librariesV1UrlIP}${query ? `?${query}` : ""}`;

        const response = await fetch(url, { headers });
        const json = await response.json();

        return NextResponse.json(json, { status: response.status });
    } catch (error) {
        logger.error(error, session, "api/libraries");

        return NextResponse.json(
            { message: "Failed to fetch libraries" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const session = await getSessionCookie();
    const headers = await getAuthHeaders();

    if (!headers) {
        return NextResponse.json(
            { code: 401, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const response = await fetch(apis.librariesV1UrlIP, {
            method: "POST",
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const json = await response.json();

        return NextResponse.json(json, { status: response.status });
    } catch (error) {
        logger.error(error, session, "api/libraries");

        return NextResponse.json(
            { message: "Failed to create library item" },
            { status: 500 }
        );
    }
}
