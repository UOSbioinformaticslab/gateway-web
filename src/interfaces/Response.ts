interface Cache {
    tags: string[];
    revalidate?: number;
}

interface GetOptions {
    suppressError?: boolean;
    cache?: Cache;
    withPagination?: boolean;
    serveRaw?: boolean;
    headers?: Record<string, string>;
}

export type { GetOptions, Cache };
