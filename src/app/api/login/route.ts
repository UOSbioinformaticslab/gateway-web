import { serialize } from "cookie";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import apis from "@/config/apis";
import config from "@/config/config";
import { sessionHeader, sessionPrefix } from "@/config/session";
import { getJwtCookieDomain } from "@/utils/general";
import { getSessionCookie } from "@/utils/getSessionCookie";
import { logger } from "@/utils/logger";
import { getPartnerHeaders, withPartnerAuthBody } from "@/utils/partnerHeaders";

function getPartnerContextFromRequest(request: NextRequest): string | undefined {
    const raw = request.headers.get("x-partner-context")?.trim();
    return raw ? raw : undefined;
}

function getPartnerHeadersForRequest(request: NextRequest) {
    const partner = getPartnerContextFromRequest(request);
    if (partner) return { "x-partner-context": partner };
    return getPartnerHeaders();
}

function withPartnerProviderFromRequest<T extends Record<string, unknown>>(
    request: NextRequest,
    body: T
): T & { provider?: string } {
    const partner = getPartnerContextFromRequest(request)?.toLowerCase();
    if (partner === "cruk" && body.provider == null) {
        return { ...body, provider: "cruk" };
    }

    return withPartnerAuthBody(body);
}

function loginUpstream(
    loginUrl: string,
    session: string,
    request: NextRequest,
    payload: Record<string, unknown>
) {
    return fetch(loginUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            [sessionHeader]: sessionPrefix + session,
            ...getPartnerHeadersForRequest(request),
        },
        body: JSON.stringify(payload),
    });
}

export async function POST(request: NextRequest) {
    const session = await getSessionCookie();
    const cookieStore = await cookies();

    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const loginUrl = apis.loginV1UrlIP;
        const credentials = { email, password };
        const partnerPayload = withPartnerProviderFromRequest(
            request,
            credentials
        );

        if (process.env.NODE_ENV === "development") {
            logger.info(
                { message: "Attempting login", url: loginUrl, email },
                session,
                `api/login`
            );
        }

        let response = await loginUpstream(
            loginUrl,
            session,
            request,
            partnerPayload
        );

        // CRUK-scoped users are stored with provider=cruk. Existing Gateway
        // accounts use provider=service, so retry without provider on 401.
        if (
            response.status === 401 &&
            partnerPayload.provider &&
            body.provider == null
        ) {
            response = await loginUpstream(
                loginUrl,
                session,
                request,
                credentials
            );
        }

        if (!response.ok) {
            let errorData;
            try {
                const text = await response.text();
                errorData = text ? JSON.parse(text) : { message: "Login failed" };
            } catch {
                errorData = {
                    message: `Login failed: ${response.status} ${response.statusText}`,
                };
            }
            
            logger.error(
                {
                    message: "Login failed",
                    status: response.status,
                    error: errorData,
                    url: loginUrl,
                },
                session,
                `api/login`
            );
            
            return NextResponse.json(
                {
                    error:
                        errorData.message ||
                        errorData.error ||
                        `Login failed: ${response.status}`,
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        // Check for token in response body (multiple possible locations)
        let token =
            data.token ||
            data.data?.token ||
            data.access_token ||
            data.data?.access_token ||
            data.jwt ||
            data.data?.jwt;

        // If no token in body, check Authorization header
        if (!token) {
            const authHeader = response.headers.get("Authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        // If still no token, check Set-Cookie header
        if (!token) {
            const setCookieHeader = response.headers.get("Set-Cookie");
            if (setCookieHeader) {
                const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
                if (tokenMatch) {
                    token = tokenMatch[1];
                }
            }
        }

        if (!token) {
            // Log the actual response for debugging
            logger.error(
                {
                    message: "No token in response",
                    response: data,
                    headers: Object.fromEntries(response.headers.entries()),
                },
                session,
                `api/login`
            );
            return NextResponse.json(
                {
                    error: "No token received from server",
                    debug:
                        process.env.NODE_ENV === "development"
                            ? { response: data, headers: Object.fromEntries(response.headers.entries()) }
                            : undefined,
                },
                { status: 500 }
            );
        }

        const cookieDomain = getJwtCookieDomain(
            request.nextUrl.hostname,
            apis.apiV1IPUrl as string
        );

        const cookie = serialize(config.JWT_COOKIE, token, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            ...(cookieDomain && { domain: cookieDomain }),
        });

        const nextResponse = NextResponse.json(
            { message: "Login successful", data: data.data || data },
            { status: 200 }
        );

        nextResponse.headers.set("Set-Cookie", cookie);
        return nextResponse;
    } catch (error) {
        const err = error as {
            message: string;
            stack?: unknown;
        };
        logger.error(err, session, `api/login`);

        return NextResponse.json(
            {
                error: err.message || "An error occurred during login",
                stack: err.stack,
            },
            { status: 500 }
        );
    }
}

