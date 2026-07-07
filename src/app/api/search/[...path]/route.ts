import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import apis from "@/config/apis";
import { sessionCookie, sessionHeader, sessionPrefix } from "@/config/session";
import { logger } from "@/utils/logger";
import { getPartnerHeaders } from "@/utils/partnerHeaders";
import { createSessionId, isValidSessionId } from "@/utils/sessionId";

const isProd = process.env.NODE_ENV === "production";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 300;

async function resolveSession(
    request: NextRequest
): Promise<{ sessionId: string; setCookie: boolean }> {
    const fromRequest = request.cookies.get(sessionCookie)?.value;
    if (isValidSessionId(fromRequest)) {
        return { sessionId: fromRequest, setCookie: false };
    }

    const cookieStore = await cookies();
    const fromStore = cookieStore.get(sessionCookie)?.value;
    if (isValidSessionId(fromStore)) {
        return { sessionId: fromStore, setCookie: false };
    }

    return { sessionId: createSessionId(), setCookie: true };
}

function withSessionCookie(
    response: NextResponse,
    sessionId: string,
    setCookie: boolean
) {
    if (setCookie) {
        response.cookies.set(sessionCookie, sessionId, {
            secure: isProd,
            sameSite: "strict",
        });
    }

    return response;
}

async function postToSearchApi(
    url: string,
    sessionId: string,
    body: unknown
): Promise<Response> {
    const headers = {
        "Content-Type": "application/json",
        [sessionHeader]: sessionPrefix + sessionId,
        ...getPartnerHeaders(),
    };

    let response: Response | undefined;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        if (response.status !== 500 || attempt === MAX_RETRIES) {
            return response;
        }

        await new Promise(resolve =>
            setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1))
        );
    }

    return response!;
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { sessionId, setCookie } = await resolveSession(request);

    try {
        const { path } = await context.params;
        const query = request.nextUrl.search;
        const url = `${apis.searchV1UrlIP}/${path.join("/")}${query}`;
        const body = await request.json();

        const response = await postToSearchApi(url, sessionId, body);
        const json = await response.json();

        return withSessionCookie(
            NextResponse.json(json, { status: response.status }),
            sessionId,
            setCookie
        );
    } catch (error) {
        logger.error(
            error instanceof Error ? error.message : String(error),
            sessionId,
            "api/search"
        );

        return withSessionCookie(
            NextResponse.json(
                { message: "Search request failed" },
                { status: 500 }
            ),
            sessionId,
            setCookie
        );
    }
}
