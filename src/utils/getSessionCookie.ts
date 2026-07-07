"use server";

import { cookies } from "next/headers";
import { sessionCookie } from "@/config/session";
import { createSessionId, isValidSessionId } from "@/utils/sessionId";

export const getSessionCookie = async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get(sessionCookie)?.value;

    if (isValidSessionId(session)) {
        return session;
    }

    return createSessionId();
};
