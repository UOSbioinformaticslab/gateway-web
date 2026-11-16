"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
    cleanFilterTag,
    deduplicateFilters,
    fetchFilterRecommendations,
    SuggestedFilterItem
} from "@/utils/filterRecommenderUtils";
import { filterTelemetry } from "@/utils/filterModificationsTelemetry";

export interface SuggestionNotice {
    type: "success" | "info" | "warning" | "error";
    message: string;
}

export interface UseFilterRecommendationsProps {
    selectedFilterIds: Set<string>;
    onAddFilter: (id: string) => void;
    apiBaseUrl?: string;
}

export const useFilterRecommendations = ({
    selectedFilterIds,
    onAddFilter,
    apiBaseUrl
}: UseFilterRecommendationsProps) => {
    const [suggestedFilters, setSuggestedFilters] = useState<SuggestedFilterItem[]>([]);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
    const [suggestionNotice, setSuggestionNotice] = useState<SuggestionNotice | null>(null);

    // Registry of filters accepted during the editing session
    const acceptedFilterIdsRef = useRef<Set<string>>(new Set());

    // Auto-synchronize: whenever active tags change, filter out any already selected tags
    useEffect(() => {
        setSuggestedFilters(prev => {
            const clean = prev.filter(s => s && !selectedFilterIds.has(String(s.id)));
            return clean.length === prev.length ? prev : clean;
        });
    }, [selectedFilterIds]);

    // Clear strapline notice when all suggestions are handled
    useEffect(() => {
        if (suggestedFilters.length === 0 && suggestionNotice?.type === "success") {
            setSuggestionNotice(null);
        }
    }, [suggestedFilters.length, suggestionNotice?.type]);

    const handleAcceptSuggestion = useCallback(
        (idToAccept: string) => {
            const strId = String(idToAccept);
            acceptedFilterIdsRef.current.add(strId);

            setSuggestedFilters(prev => {
                const item = prev.find(s => String(s.id) === strId);
                if (item) {
                    onAddFilter(strId);
                }
                return prev.filter(s => String(s.id) !== strId);
            });
        },
        [onAddFilter]
    );

    const handleDismissSuggestion = useCallback((idToDismiss: string) => {
        const strId = String(idToDismiss);
        setSuggestedFilters(prev => {
            const item = prev.find(s => String(s.id) === strId);
            if (item) {
                filterTelemetry.recordRejection(item, "INDIVIDUAL_DISMISS");
            }
            return prev.filter(s => String(s.id) !== strId);
        });
    }, []);

    const handleAcceptAllSuggestions = useCallback(() => {
        filterTelemetry.recordAcceptAll();
        setSuggestedFilters(prev => {
            prev.forEach(item => {
                const strId = String(item.id);
                acceptedFilterIdsRef.current.add(strId);
                onAddFilter(strId);
            });

            return [];
        });
        setSuggestionNotice({
            type: "info",
            message: "All recommended filter tags have been added to this dataset."
        });
    }, [onAddFilter]);

    const handleDismissAllSuggestions = useCallback(() => {
        setSuggestedFilters(prev => {
            filterTelemetry.recordDismissAll(prev);
            return [];
        });
        setSuggestionNotice(null);
    }, []);

    const handleGenerateSuggestions = useCallback(
        async (formData: Record<string, unknown>, datasetId?: string | number | null) => {
            setIsGeneratingSuggestions(true);
            setSuggestionNotice(null);

            try {
                const result = await fetchFilterRecommendations({
                    metadata: formData,
                    datasetId,
                    apiBaseUrl
                });

                filterTelemetry.recordSuggestions(result.suggestions);

                const deduped = deduplicateFilters(
                    selectedFilterIds,
                    result.suggestions,
                    acceptedFilterIdsRef.current
                );

                setSuggestedFilters(deduped);

                if (deduped.length === 0) {
                    setSuggestionNotice({
                        type: "info",
                        message: "No new filter suggestions found for this dataset's metadata."
                    });
                } else {
                    setSuggestionNotice({
                        type: "success",
                        message: `Found ${deduped.length} automated filter suggestion${
                            deduped.length === 1 ? "" : "s"
                        }. Review each recommendation below.`
                    });
                }
            } catch (err: unknown) {
                const errorMsg =
                    err instanceof Error ? err.message : "Error generating filter recommendations.";
                setSuggestionNotice({
                    type: "error",
                    message: `Could not generate filter recommendations: ${errorMsg}`
                });
            } finally {
                setIsGeneratingSuggestions(false);
            }
        },
        [apiBaseUrl, selectedFilterIds]
    );

    const clearSuggestedFilters = useCallback(() => {
        setSuggestedFilters([]);
        setSuggestionNotice(null);
    }, []);

    return {
        suggestedFilters,
        isGeneratingSuggestions,
        suggestionNotice,
        handleGenerateSuggestions,
        handleAcceptSuggestion,
        handleDismissSuggestion,
        handleAcceptAllSuggestions,
        handleDismissAllSuggestions,
        clearSuggestedFilters
    };
};

export default useFilterRecommendations;
