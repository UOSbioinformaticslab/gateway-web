import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import apis from "@/config/apis";
import config from "@/config/config";
import { sessionHeader, sessionPrefix } from "@/config/session";
import { getSessionCookie } from "@/utils/getSessionCookie";
import { logger } from "@/utils/logger";
import { getPartnerHeaders } from "@/utils/partnerHeaders";

const PUBLIC_V2_PATHS = [["search", "aggregation"]];

function isPublicV2Path(path: string[]) {
    return PUBLIC_V2_PATHS.some(
        publicPath =>
            publicPath.length === path.length &&
            publicPath.every((segment, i) => segment === path[i])
    );
}

async function getForwardHeaders(path: string[]) {
    const session = await getSessionCookie();
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get(config.JWT_COOKIE)?.value;

    if (!jwtToken && !isPublicV2Path(path)) {
        return null;
    }

    return {
        ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        [sessionHeader]: sessionPrefix + session,
        ...getPartnerHeaders(),
    };
}

async function proxy(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const session = await getSessionCookie();
    const { path } = await context.params;
    const headers = await getForwardHeaders(path);

    if (!headers) {
        return NextResponse.json(
            { code: 401, message: "Unauthorized" },
            { status: 401 }
        );
    }

    if (!apis.apiV2IPUrl) {
        logger.error(
            {
                message: "Missing apiV2IPUrl env config",
                hint: "Ensure NEXT_PUBLIC_API_V2_URL (and optionally NEXT_PUBLIC_API_V2_IP_URL) are set",
            },
            session,
            "api/v2"
        );
        return NextResponse.json(
            { message: "Server misconfigured: missing API V2 URL" },
            { status: 500 }
        );
    }

    try {
        const query = request.nextUrl.search;
        const url = `${apis.apiV2IPUrl}/${path.join("/")}${query}`;

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
                message: "Failed to proxy v2 request",
                error: error instanceof Error ? error.message : String(error),
                path: request.nextUrl.pathname,
                search: request.nextUrl.search,
                method: request.method,
                upstreamBase: apis.apiV2IPUrl,
            },
            session,
            "api/v2"
        );
        return NextResponse.json(
            {
                message: "Failed to proxy v2 request",
                ...(process.env.NODE_ENV === "development"
                    ? { debug: { upstreamBase: apis.apiV2IPUrl } }
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

