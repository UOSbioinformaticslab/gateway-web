import Cookies from "js-cookie";
import { sessionCookie } from "@/config/session";
import { createSessionId, isValidSessionId } from "@/utils/sessionId";

/** Ensures a session id exists for API requests (mirrors middleware cookie behaviour). */
function getClientSessionId(): string {
    const existing = Cookies.get(sessionCookie);
    if (isValidSessionId(existing)) {
        return existing;
    }

    const id = createSessionId();
    Cookies.set(sessionCookie, id, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return id;
}

export default getClientSessionId;
