import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import apis from "@/config/apis";
import config from "@/config/config";
import { sessionHeader, sessionPrefix } from "@/config/session";
import { getSessionCookie } from "@/utils/getSessionCookie";
import { logger } from "@/utils/logger";
import { getPartnerHeaders } from "@/utils/partnerHeaders";

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSessionCookie();
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get(config.JWT_COOKIE)?.value;

    if (!jwtToken) {
        return NextResponse.json(
            { code: 401, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { id } = await params;

    try {
        const response = await fetch(`${apis.librariesV1UrlIP}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                [sessionHeader]: sessionPrefix + session,
                ...getPartnerHeaders(),
            },
        });
        const json = await response.json();

        return NextResponse.json(json, { status: response.status });
    } catch (error) {
        logger.error(error, session, "api/libraries");

        return NextResponse.json(
            { message: "Failed to delete library item" },
            { status: 500 }
        );
    }
}
