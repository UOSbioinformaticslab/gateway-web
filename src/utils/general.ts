import { decode } from "he";

const capitalise = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const convertToCamelCase = (inputString: string) =>
    inputString.replace(/_([a-z])/g, (_match, group) => group.toUpperCase());

const splitCamelcase = (str: string) => {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const getTrimmedpathname = (locale: string, pathname: string) => {
    return pathname.replace(`/${locale}`, "");
};

function extractSubdomain(url: string) {
    try {
        const parsedUrl = new URL(url);
        const hostnameParts = parsedUrl.hostname.split(".");

        // Remove the first part (e.g., "api")
        hostnameParts.shift();

        // Join the remaining parts and prepend a dot
        const subdomain = `.${hostnameParts.join(".")}`;

        return subdomain;
    } catch (error) {
        console.error("Invalid URL:", url);
        return null;
    }
}

function getStaticAssetUrl(file: string) {
    return `${process.env.NEXT_PUBLIC_MEDIA_STATIC_URL}/${file}`;
}

function getTeamAssetPath(file: string) {
    return `/teams/${file}`;
}

function parseStaticImagePaths<T>(values: T, prefix?: string) {
    return Object.entries(values || {}).reduce(
        (accumulator, currentValue) => ({
            ...accumulator,
            [currentValue[0]]: getStaticAssetUrl(
                `${prefix ? `${prefix}/` : ""}${currentValue[1]}`
            ),
        }),
        {}
    ) as T;
}

function decodeHtmlEntity(input: string): string {
    return decode(input);
}

/**
 * Normalizes image URLs for use with Next.js Image component.
 * Ensures URLs are either absolute (http:// or https://) or relative starting with "/".
 * Handles malformed URLs that may contain literal strings like "media_base_url".
 */
function normalizeImageUrl(url: string | undefined | null): string {
    if (!url) {
        return "";
    }

    // If it's already an absolute URL, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_STATIC_URL || "";
    let normalizedUrl = url;

    // Handle malformed URLs that might contain literal "media_base_url" strings
    // This can happen if the backend returns a template string instead of the actual URL
    if (normalizedUrl.includes("media_base_url")) {
        // Replace all occurrences of "media_base_url" with the actual base URL
        normalizedUrl = normalizedUrl.replace(/media_base_url/g, mediaBaseUrl);
        
        // Handle case where "media_base_url" appears multiple times consecutively
        // e.g., "media_base_urlmedia_base_url/teams/..." -> "baseUrl/teams/..."
        if (mediaBaseUrl) {
            const escapedBaseUrl = mediaBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            // Remove consecutive duplicate base URLs
            normalizedUrl = normalizedUrl.replace(
                new RegExp(`(${escapedBaseUrl})+`, "g"),
                mediaBaseUrl
            );
        } else {
            // If base URL is not set, remove the literal "media_base_url" strings
            normalizedUrl = normalizedUrl.replace(/media_base_url/g, "");
        }
    }

    // Remove duplicate base URLs if they exist (e.g., "baseUrlbaseUrl/path" -> "baseUrl/path")
    if (mediaBaseUrl && normalizedUrl.includes(mediaBaseUrl)) {
        const escapedBaseUrl = mediaBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // Remove consecutive duplicate base URLs
        normalizedUrl = normalizedUrl.replace(
            new RegExp(`(${escapedBaseUrl})+`, "g"),
            mediaBaseUrl
        );
        
        // If the URL starts with the base URL, return it as absolute
        if (normalizedUrl.startsWith(mediaBaseUrl)) {
            return normalizedUrl;
        }
    }

    // Clean up any double slashes (except after http:// or https://)
    normalizedUrl = normalizedUrl.replace(/([^:]\/)\/+/g, "$1");

    // Ensure relative URLs start with "/"
    if (!normalizedUrl.startsWith("/") && !normalizedUrl.startsWith("http")) {
        normalizedUrl = `/${normalizedUrl}`;
    }

    return normalizedUrl;
}

export {
    capitalise,
    convertToCamelCase,
    splitCamelcase,
    extractSubdomain,
    getTrimmedpathname,
    parseStaticImagePaths,
    getTeamAssetPath,
    decodeHtmlEntity,
    normalizeImageUrl,
};
