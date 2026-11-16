/**
 * filterRecommenderUtils.ts
 * Helper utilities for automated dataset filter recommendations and evidence curation in gateway-web.
 */

export interface FilterEvidence {
    sourceField?: string;
    snippet?: string;
    matchedTerm?: string;
    matchedWord?: string;
    instancesInMetadata?: number;
    ruleRationale?: string;
    derivedFrom?: string[];
    allInstances?: Array<{
        field: string;
        snippet: string;
        matchedWord: string;
    }>;
}

export interface SuggestedFilterItem {
    id: string;
    label: string;
    category?: string;
    primaryGroup?: string;
    description?: string;
    evidence?: FilterEvidence;
    is_derived?: boolean;
}

export interface CleanFilterTag {
    id: string;
    label: string;
    category: string;
    primaryGroup: string;
    description: string;
}

/**
 * Sanitizes a filter recommendation item, stripping any transient evidence
 * so that only standard schema attributes enter the datasetFilters array.
 */
export const cleanFilterTag = (item: SuggestedFilterItem): CleanFilterTag | null => {
    if (!item) return null;
    return {
        id: item.id,
        label: item.label,
        category: item.category || "",
        primaryGroup: item.primaryGroup || "data-type",
        description: item.description || ""
    };
};

/**
 * Deduplicates an incoming array of recommendations against currently active tags
 * and previously accepted tags.
 */
export const deduplicateFilters = (
    activeFilterIds: Set<string> | string[] = [],
    incomingSuggestions: SuggestedFilterItem[] = [],
    acceptedIds: Set<string> | string[] = []
): SuggestedFilterItem[] => {
    const activeSet = new Set<string>();
    if (activeFilterIds instanceof Set) {
        activeFilterIds.forEach(id => activeSet.add(String(id)));
    } else if (Array.isArray(activeFilterIds)) {
        activeFilterIds.forEach(item => {
            const id = typeof item === "object" && item !== null ? (item as { id: string }).id : item;
            if (id) activeSet.add(String(id));
        });
    }

    if (acceptedIds instanceof Set) {
        acceptedIds.forEach(id => activeSet.add(String(id)));
    } else if (Array.isArray(acceptedIds)) {
        acceptedIds.forEach(id => activeSet.add(String(id)));
    }

    return (incomingSuggestions || []).filter(
        item => item && item.id && !activeSet.has(String(item.id))
    );
};

/**
 * Executes the backend recommendation scan against /datasets/recommend-filters.
 */
export const fetchFilterRecommendations = async ({
    metadata = {},
    datasetId = null,
    apiBaseUrl = ""
}: {
    metadata: Record<string, unknown>;
    datasetId?: string | number | null;
    apiBaseUrl?: string;
}): Promise<{
    suggestions: SuggestedFilterItem[];
    silentDerived?: SuggestedFilterItem[];
}> => {
    const backendUrl =
        apiBaseUrl ||
        process.env.NEXT_PUBLIC_RECOMMENDER_URL ||
        process.env.NEXT_PUBLIC_API_V1_IP_URL ||
        "http://localhost:8000";

    const cleanBaseUrl = backendUrl.replace(/\/+$/, "");

    const response = await fetch(`${cleanBaseUrl}/datasets/recommend-filters`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            metadata,
            dataset_id: datasetId
        })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || err.detail || `Server returned ${response.status}`);
    }

    const data = await response.json();
    return {
        suggestions: data.suggestions || [],
        silentDerived: []
    };
};
