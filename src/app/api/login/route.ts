import { serialize } from "cookie";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import apis from "@/config/apis";
import config from "@/config/config";
import { sessionHeader, sessionPrefix } from "@/config/session";
import { extractSubdomain } from "@/utils/general";
import { getSessionCookie } from "@/utils/getSessionCookie";
import { logger } from "@/utils/logger";

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
        
        if (process.env.NODE_ENV === "development") {
            logger.info(
                { message: "Attempting login", url: loginUrl, email },
                session,
                `api/login`
            );
        }

        const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                [sessionHeader]: sessionPrefix + session,
            },
            body: JSON.stringify({ email, password }),
        });

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

        const cookie = serialize(config.JWT_COOKIE, token, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            ...(process.env.NODE_ENV !== "development" && {
                domain: extractSubdomain(apis.apiV1IPUrl as string) || "",
            }),
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

