/**
 * filterModificationsTelemetry.ts
 *
 * Tracks filter recommendations, user rejections, manual additions, and upload session telemetry.
 * Communicates with the middlelayer microservice at /filter-modifications/session.
 */

import { SuggestedFilterItem } from "./filterRecommenderUtils";

const MIDDLELAYER_URL = (
    process.env.NEXT_PUBLIC_MIDDLELAYER_URL || "http://localhost:8002"
).replace(/\/+$/, "");

export interface RejectedFilterRecord {
    filter_id: string;
    filter_label: string;
    triggering_phrase: string;
    metadata_field: string;
    snippet_context: string;
    rejection_type: string;
}

export interface ManualFilterItem {
    id: string;
    label: string;
    category?: string;
}

export interface UploadSessionPayload {
    session_id: string;
    dataset_id: string | null;
    dataset_name: string;
    recommender_used: boolean;
    recommender_action: "SKIPPED" | "INDIVIDUAL_REVIEW" | "ACCEPT_ALL" | "DISMISS_ALL";
    total_recommended: number;
    total_accepted: number;
    total_rejected: number;
    sections_visited: string[];
    manual_filters_added: ManualFilterItem[];
    rejected_filters: RejectedFilterRecord[];
}

export class FilterTelemetryTracker {
    private sessionId: string;
    private initialSuggestions: Map<string, SuggestedFilterItem>;
    private rejectedFilters: Map<string, RejectedFilterRecord>;
    private visitedSections: Set<string>;
    private recommenderAction: "SKIPPED" | "INDIVIDUAL_REVIEW" | "ACCEPT_ALL" | "DISMISS_ALL";

    constructor() {
        this.sessionId = this.generateUUID();
        this.initialSuggestions = new Map();
        this.rejectedFilters = new Map();
        this.visitedSections = new Set();
        this.recommenderAction = "SKIPPED";
    }

    private generateUUID(): string {
        if (typeof crypto !== "undefined" && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    public reset(): void {
        this.sessionId = this.generateUUID();
        this.initialSuggestions.clear();
        this.rejectedFilters.clear();
        this.visitedSections.clear();
        this.recommenderAction = "SKIPPED";
    }

    public recordVisitedSection(sectionKey?: string): void {
        if (sectionKey) {
            this.visitedSections.add(String(sectionKey));
        }
    }

    public recordSuggestions(suggestions: SuggestedFilterItem[] = []): void {
        if (!Array.isArray(suggestions)) return;
        suggestions.forEach(item => {
            if (item && item.id) {
                const sId = String(item.id);
                if (!this.initialSuggestions.has(sId)) {
                    this.initialSuggestions.set(sId, item);
                }
            }
        });
        if (this.initialSuggestions.size > 0 && this.recommenderAction === "SKIPPED") {
            this.recommenderAction = "INDIVIDUAL_REVIEW";
        }
    }

    public recordRejection(
        item?: SuggestedFilterItem | null,
        rejectionType = "INDIVIDUAL_DISMISS"
    ): void {
        if (!item || !item.id) return;
        const ev = item.evidence || {};

        // Exclude filter rejections that were suggested as a result of child filters
        if (
            item.is_derived ||
            ev.sourceField === "hierarchical_parent" ||
            (ev.snippet && String(ev.snippet).includes("Triggered automatically by child filter"))
        ) {
            return;
        }

        const sId = String(item.id);
        const fullSnippet = ev.snippet || item.description || "";
        const keyword = ev.matchedTerm || ev.matchedWord || item.label || "";
        const boundedSnippet = this.boundSnippet(fullSnippet, keyword, 100);

        this.rejectedFilters.set(sId, {
            filter_id: sId,
            filter_label: item.label || sId,
            triggering_phrase: ev.matchedTerm || ev.matchedWord || item.label || "",
            metadata_field: ev.sourceField || "summary.abstract",
            snippet_context: boundedSnippet,
            rejection_type: rejectionType,
        });
    }

    public recordDismissAll(items: SuggestedFilterItem[] = []): void {
        this.recommenderAction = "DISMISS_ALL";
        items.forEach(item => {
            this.recordRejection(item, "DISMISS_ALL");
        });
    }

    public recordAcceptAll(): void {
        this.recommenderAction = "ACCEPT_ALL";
    }

    private boundSnippet(snippet?: string, keyword?: string, windowSize = 100): string {
        if (!snippet) return "";
        const str = String(snippet).trim();
        if (!keyword || !str.toLowerCase().includes(keyword.toLowerCase())) {
            return str.length > windowSize * 2 ? str.slice(0, windowSize * 2) + "..." : str;
        }

        const idx = str.toLowerCase().indexOf(keyword.toLowerCase());
        const start = Math.max(0, idx - windowSize);
        const end = Math.min(str.length, idx + keyword.length + windowSize);

        const prefix = start > 0 ? "..." : "";
        const suffix = end < str.length ? "..." : "";
        return `${prefix}${str.slice(start, end).trim()}${suffix}`;
    }

    public sendSessionTelemetry({
        datasetId = null,
        datasetName = "",
        currentFilters = [],
    }: {
        datasetId?: string | number | null;
        datasetName?: string;
        currentFilters?: (string | { id: string; label?: string; category?: string })[];
    }): void {
        const middleUrl = MIDDLELAYER_URL;
        const activeIds = new Set(
            (currentFilters || []).map(t => String(typeof t === "object" ? t.id : t))
        );

        // Calculate manual filters added: in active filters, but never recommended
        const seenManual = new Set<string>();
        const manualFilters: ManualFilterItem[] = [];
        (currentFilters || []).forEach(f => {
            const fid = String(typeof f === "object" ? f.id : f);
            if (fid && !this.initialSuggestions.has(fid) && !seenManual.has(fid)) {
                seenManual.add(fid);
                manualFilters.push({
                    id: fid,
                    label: typeof f === "object" && f.label ? f.label : fid,
                    category: typeof f === "object" && f.category ? f.category : "",
                });
            }
        });

        // Calculate accepted count
        let acceptedCount = 0;
        this.initialSuggestions.forEach((_, id) => {
            if (activeIds.has(id)) {
                acceptedCount++;
            }
        });

        const payload: UploadSessionPayload = {
            session_id: this.sessionId,
            dataset_id: datasetId ? String(datasetId) : null,
            dataset_name: datasetName,
            recommender_used: this.initialSuggestions.size > 0,
            recommender_action: this.recommenderAction,
            total_recommended: this.initialSuggestions.size,
            total_accepted: acceptedCount,
            total_rejected: this.rejectedFilters.size,
            sections_visited: Array.from(this.visitedSections),
            manual_filters_added: manualFilters,
            rejected_filters: Array.from(this.rejectedFilters.values()),
        };

        const jsonBody = JSON.stringify(payload);
        const endpoint = `${middleUrl}/filter-modifications/session`;

        try {
            if (typeof navigator !== "undefined" && navigator.sendBeacon) {
                const blob = new Blob([jsonBody], { type: "application/json" });
                const success = navigator.sendBeacon(endpoint, blob);
                if (!success) {
                    fetch(endpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: jsonBody,
                        keepalive: true,
                    }).catch(() => {});
                }
            } else {
                fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: jsonBody,
                    keepalive: true,
                }).catch(() => {});
            }
        } catch (e) {
            console.warn("Telemetry beacon failed silently:", e);
        }

        // Reset tracker for the next editing lifecycle
        this.reset();
    }
}

export const filterTelemetry = new FilterTelemetryTracker();
export default filterTelemetry;
