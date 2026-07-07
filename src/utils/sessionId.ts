import { v4 } from "uuid";

const UUID_V4_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const INVALID_SESSION_VALUES = new Set([
    "n/a",
    "na",
    "null",
    "undefined",
    "unknown",
]);

export function isValidSessionId(
    value: string | undefined | null
): value is string {
    if (!value || !UUID_V4_REGEX.test(value)) {
        return false;
    }

    return !INVALID_SESSION_VALUES.has(value.toLowerCase());
}

export function createSessionId(): string {
    return v4();
}
