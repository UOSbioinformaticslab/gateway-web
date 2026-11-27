import { SearchResultTool } from "@/interfaces/Search";

export interface LinkedResource {
    id?: number;
    name: string;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
    if (!value || typeof value !== "object") return undefined;
    return value as Record<string, unknown>;
}

function resourceName(value: unknown): LinkedResource | undefined {
    if (typeof value === "string") {
        const name = value.trim();
        return name ? { name } : undefined;
    }

    const record = asRecord(value);
    if (!record) return undefined;

    const name = [
        record.computed_title,
        record.project_grant_name,
        record.projectGrantName,
        record.project_title,
        record.title,
        record.name,
    ].find(item => typeof item === "string" && item.trim());

    if (typeof name !== "string") return undefined;

    const id = [record.dataset_id, record.id].find(
        item => typeof item === "number"
    );

    return {
        id: typeof id === "number" ? id : undefined,
        name: name.trim(),
    };
}

function resourceList(value: unknown): LinkedResource[] {
    if (!Array.isArray(value)) return [];

    const linked = new Map<string, LinkedResource>();
    for (const item of value) {
        const resource = resourceName(item);
        if (!resource || linked.has(resource.name)) continue;
        linked.set(resource.name, resource);
    }

    return [...linked.values()];
}

export function toolDatasets(result: SearchResultTool): LinkedResource[] {
    return resourceList(result.datasets);
}

export function toolProjects(result: SearchResultTool): LinkedResource[] {
    return resourceList(result.durTitles);
}

export function toolExternalUrl(result: SearchResultTool): string {
    const url = result.url || result._source?.url || "";
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
}

export function plainText(value?: string): string {
    if (!value) return "";

    return value
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
