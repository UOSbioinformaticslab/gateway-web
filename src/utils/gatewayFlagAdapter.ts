import type { Adapter } from "@vercel/flags";
import apis from "@/config/apis";
import { getPartnerHeaders } from "@/utils/partnerHeaders";

let cache: Record<string, boolean> | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type FeatureFlagNode = {
    enabled: boolean;
    features?: Record<string, FeatureFlagNode>;
};

const parseFeatureFlagPayload = (
    json: unknown,
    prefix = ""
): Record<string, boolean> => {
    const unwrapped =
        json &&
        typeof json === "object" &&
        "data" in json &&
        (json as { data?: unknown }).data != null &&
        typeof (json as { data: unknown }).data === "object"
            ? (json as { data: Record<string, unknown> }).data
            : (json as Record<string, unknown>);

    if (!unwrapped || typeof unwrapped !== "object") {
        return {};
    }

    return Object.entries(unwrapped).reduce((acc, [key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === "boolean") {
            acc[fullKey] = value;
            return acc;
        }

        if (value && typeof value === "object" && "enabled" in value) {
            const node = value as FeatureFlagNode;
            acc[fullKey] = !!node.enabled;

            if (node.features) {
                Object.assign(
                    acc,
                    parseFeatureFlagPayload(node.features, fullKey)
                );
            }
        }

        return acc;
    }, {} as Record<string, boolean>);
};

const setCache = async (): Promise<Record<string, boolean>> => {
    const urls = [apis.enabledFeatureFlags, apis.enabledFeatures];
    const errors: string[] = [];

    try {
        for (const url of urls) {
            const res = await fetch(url, {
                headers: {
                    ...getPartnerHeaders(),
                },
            });

            if (!res.ok) {
                errors.push(`${url}: ${res.statusText}`);
                continue;
            }

            const json = await res.json();
            cacheTimestamp = Date.now();
            return parseFeatureFlagPayload(json);
        }

        if (errors.length > 0) {
            console.warn(`Failed to fetch feature flags: ${errors.join("; ")}`);
        }

        cacheTimestamp = Date.now();
        return {};
    } catch (err) {
        console.warn(
            "Error fetching feature flags, will retry after cache is stale",
            err
        );
        cacheTimestamp = Date.now();
        return {};
    }
};

const isCacheStale = () => {
    if (!cacheTimestamp) return true;
    return Date.now() - cacheTimestamp > CACHE_TTL_MS;
};

export function resetGatewayFlagCache() {
    cache = null;
    cacheTimestamp = null;
}

export function createGatewayFlagAdapter() {
    return function gatewayFlagAdapter<ValueType, EntitiesType>(): Adapter<
        ValueType,
        EntitiesType
    > {
        return {
            async decide({ key }): Promise<ValueType> {
                if (!cache || isCacheStale()) {
                    cache = await setCache();
                }
                return (cache[key] as ValueType) ?? (false as ValueType);
            },
        };
    };
}
