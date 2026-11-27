import { SearchResultPublication } from "@/interfaces/Search";

export interface LinkedResource {
    id?: number;
    name: string;
}

export function publicationDatasets(
    result: SearchResultPublication
): LinkedResource[] {
    const linked = new Map<string, LinkedResource>();

    for (const version of result.datasetVersions ?? []) {
        const name = version?.name?.trim();
        if (!name || linked.has(name)) continue;
        linked.set(name, { id: version.dataset_id, name });
    }

    const titles = result.datasetTitles ?? result._source?.datasetTitles ?? [];
    for (const title of titles) {
        const name = title?.trim();
        if (!name || linked.has(name)) continue;
        linked.set(name, { name });
    }

    return [...linked.values()];
}

export function publicationProjects(
    result: SearchResultPublication
): LinkedResource[] {
    const linked = new Map<string, LinkedResource>();

    for (const project of result.durs ?? []) {
        const name = project.project_title?.trim();
        if (!name || linked.has(name)) continue;
        linked.set(name, { id: project.id, name });
    }

    return [...linked.values()];
}

export function publicationHref(result: SearchResultPublication): string {
    if (result.url) return result.url;

    const doi = result.paper_doi || result._source?.paper_doi;
    if (doi) {
        const clean = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
        return `https://doi.org/${clean}`;
    }

    return result.full_text_url || "";
}

export function plainText(value?: string): string {
    if (!value) return "";

    return value
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function formatAuthors(authors?: string): string {
    const names = (authors ?? "")
        .split(",")
        .map(name => name.trim())
        .filter(Boolean);

    if (names.length === 0) return "";
    if (names.length === 1) return names[0];

    return `${names[0]} et al.`;
}

export function firstAbstractLine(value?: string): string {
    const text = plainText(value);
    if (!text) return "";

    const sentence = text.match(/[^.!?]+[.!?]/);
    if (sentence) return sentence[0].trim();
    if (text.length <= 140) return text;

    return `${text.slice(0, 100).trim()}...`;
}
