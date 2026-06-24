import { serialize } from "cookie";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import apis from "@/config/apis";
import config from "@/config/config";
import { sessionHeader, sessionPrefix } from "@/config/session";
import { getJwtCookieDomain } from "@/utils/general";
import { getSessionCookie } from "@/utils/getSessionCookie";
import { logger } from "@/utils/logger";
import { getPartnerHeaders } from "@/utils/partnerHeaders";

export async function GET() {
    const session = await getSessionCookie();

    const cookieStore = await cookies();
    const jwtToken = cookieStore.get(config.JWT_COOKIE)?.value;

    try {
        await fetch(apis.logoutV1UrlIP, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                [sessionHeader]: sessionPrefix + session,
                ...getPartnerHeaders(),
            },
        });

        const host = (await headers()).get("host")?.split(":")[0] ?? "";
        const cookieDomain = getJwtCookieDomain(
            host,
            apis.apiV1IPUrl as string
        );

        const cookie = serialize(config.JWT_COOKIE, "", {
            expires: new Date(0),
            path: "/",
            ...(cookieDomain && { domain: cookieDomain }),
        });

        const response = NextResponse.json(
            { message: "success" },
            { status: 200 }
        );

        response.headers.set("Set-Cookie", cookie);
        return response;
    } catch (error) {
        const err = error as {
            response?: {
                status: number;
                data?: { message: string };
            };
            stack?: unknown;
            message: string;
        };
        logger.error(err, session, `api/logout`);

        const status = err?.response?.status ?? 500;
        const message = err?.response?.data?.message ?? err.message;

        return NextResponse.json(
            {
                title: "We have not been able to log you out",
                message,
                stack: err.stack,
            },
            { status }
        );
    }
}
