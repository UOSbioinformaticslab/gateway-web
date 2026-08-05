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

async function proxy(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const session = await getSessionCookie();
    const headers = await getAuthHeaders();

    if (!headers) {
        return NextResponse.json(
            { code: 401, message: "Unauthorized" },
            { status: 401 }
        );
    }

    if (!apis.apiV1IPUrl) {
        logger.error(
            {
                message: "Missing apiV1IPUrl env config",
                hint: "Ensure NEXT_PUBLIC_API_V1_URL (and optionally NEXT_PUBLIC_API_V1_IP_URL) are set",
            },
            session,
            "api/v1"
        );
        return NextResponse.json(
            { message: "Server misconfigured: missing API V1 URL" },
            { status: 500 }
        );
    }

    try {
        const { path } = await context.params;
        const query = request.nextUrl.search;
        const url = `${apis.apiV1IPUrl}/${path.join("/")}${query}`;

        const contentType = request.headers.get("content-type") || undefined;
        const bodyText =
            request.method === "GET" || request.method === "HEAD"
                ? undefined
                : await request.text();

        const response = await fetch(url, {
            method: request.method,
            headers: {
                ...headers,
                ...(contentType ? { "Content-Type": contentType } : {}),
            },
            body: bodyText,
        });

        const text = await response.text();
        return new NextResponse(text, {
            status: response.status,
            headers: {
                "Content-Type":
                    response.headers.get("content-type") || "application/json",
            },
        });
    } catch (error) {
        logger.error(
            {
                message: "Failed to proxy v1 request",
                error: error instanceof Error ? error.message : String(error),
                path: request.nextUrl.pathname,
                search: request.nextUrl.search,
                method: request.method,
                upstreamBase: apis.apiV1IPUrl,
            },
            session,
            "api/v1"
        );
        return NextResponse.json(
            {
                message: "Failed to proxy v1 request",
                ...(process.env.NODE_ENV === "development"
                    ? { debug: { upstreamBase: apis.apiV1IPUrl } }
                    : {}),
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest, context: any) {
    return proxy(request, context);
}
export async function POST(request: NextRequest, context: any) {
    return proxy(request, context);
}
export async function PUT(request: NextRequest, context: any) {
    return proxy(request, context);
}
export async function PATCH(request: NextRequest, context: any) {
    return proxy(request, context);
}
export async function DELETE(request: NextRequest, context: any) {
    return proxy(request, context);
}

