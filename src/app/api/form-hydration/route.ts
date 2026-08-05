import { NextRequest, NextResponse } from "next/server";
import { getLocalFormHydration } from "@/utils/localFormHydration";

export async function GET(request: NextRequest) {
    const teamId = request.nextUrl.searchParams.get("teamId");

    const formJSON = getLocalFormHydration(teamId ?? undefined);

    return NextResponse.json(formJSON, {
        headers: {
            "Cache-Control": "private, max-age=3600",
        },
    });
}
