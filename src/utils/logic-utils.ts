import { filterDetailsMap } from './filter-setup';

type FilterType = "hist" | "top" | "cruk" | "snomed" | "tcga" | "data" | "access" | "unknown";

const filterType = (id: string): FilterType => {
    const info = id.split("_");
    if (info.length < 3) return "unknown";

    const first = info[1];
    if (first === "2") {
        return "data"; // 0_2_...
    } else if (first === "1") {
        return "access"; // 0_1_...
    } else {
        // first === "0"
        const second = info[2];
        if (second === "1") {
            return "hist"; // 0_0_1_...
        }
        else if (second === "0") {
            return "top"; // 0_0_0_...
        }
        else if (second === "2") return "cruk";
        else if (second === "3") return "snomed";
        else if (second === "4") return "tcga";
        return "unknown";
    }
};

const includeParents = (f: string): string[] => {
    if (f) {
        const nms = f.split("_");
        if (nms[1] !== "1" && nms.length > 3) {
            const parents: string[] = [];
            for (let k = 4; k <= nms.length; k++) {
                parents.push(nms.slice(0, k).join("_"));
            }
            return parents;
        }
    }
    return [f];
};

const plusParents = (filters: string[]): string[] => {
    if (!filters || filters.length === 0) return [];

    const allFilters = new Set<string>();
    filters.forEach(f => {
        includeParents(f).forEach(parentOrSelf => {
            allFilters.add(parentOrSelf);
        });
    });

    return Array.from(allFilters).filter(id => filterDetailsMap && filterDetailsMap.has(id));
};

interface FilterDetails {
    label: string;
}

const getMessage = (thelist: string[], joiner: string): string => {
    if (!filterDetailsMap) return "";
    
    const length = thelist.length;
    if (length === 0) {
        return "";
    } else if (length === 1) {
        return filterDetailsMap.get(thelist[0])?.label || "";
    } else {
        const terms = thelist.map(id => filterDetailsMap.get(id)?.label).filter(Boolean);
        return `(${terms.join(` ${joiner} `)})`;
    }
};

interface Filter {
    id: string;
}

interface CalculateLogicMessage {
    filters: Filter[];
    filterType: (id: string) => FilterType;
    plusParents: (filters: string[]) => string[];
    includeParents: (f: string) => string[];
    getMessage: (thelist: string[], joiner: string) => string;
}

const calculateLogicMessage = ({
    filters,
    filterType,
    plusParents,
    includeParents,
    getMessage
}: CalculateLogicMessage): string => {
    if (!filters || filters.length === 0) return "";
    
    const hist = filters.filter(f => filterType(f.id) === "hist");
    const top = filters.filter(f => filterType(f.id) === "top"
        || filterType(f.id) === "cruk"
        || filterType(f.id) === "snomed"
        || filterType(f.id) === "tcga");
    const data = filters.filter(f => filterType(f.id) === "data");
    const access = filters.filter(f => filterType(f.id) === "access");

    const messages: string[] = [];

    // HIST message: plus_parents and OR
    const hist_plus = plusParents(hist.map(f => f.id));
    const hist_message = getMessage(hist_plus, "OR");
    if (hist_message) messages.push(hist_message);

    // TOP/CRUK message: plus_parents and OR
    const top_plus = plusParents(top.map(f => f.id));
    const top_message = getMessage(top_plus, "OR");
    if (top_message) messages.push(top_message);

    // DATA message: include_parents (individually) and OR, then join groups with AND
    const data_messages = data.map(d => {
        const listWithParents = includeParents(d.id).filter(id => filterDetailsMap && filterDetailsMap.has(id));
        return getMessage(listWithParents, "OR");
    }).filter(Boolean);

    const data_final_message = data_messages.join(" AND ");
    if (data_final_message) messages.push(data_final_message);

    // ACCESS message: simple list and OR
    const access_message = getMessage(access.map(f => f.id), "OR");
    if (access_message) messages.push(access_message);

    return messages.join(" AND ");
};

type LogicToken =
    | { kind: "term"; id: string; label: string }
    | { kind: "op"; value: "AND" | "OR" }
    | { kind: "paren"; value: "(" | ")" };

const resolveFilterType = (id: string): FilterType =>
    id === "pan-cancer" ? "cruk" : filterType(id);

const tokensForIds = (ids: string[], joiner: "AND" | "OR"): LogicToken[] => {
    const terms = ids.flatMap(id => {
        const label = filterDetailsMap.get(id)?.label;
        if (!label) return [];
        return [{ kind: "term" as const, id, label }];
    });

    if (terms.length === 0) return [];
    if (terms.length === 1) return terms;

    const tokens: LogicToken[] = [{ kind: "paren", value: "(" }];
    terms.forEach((term, index) => {
        if (index > 0) tokens.push({ kind: "op", value: joiner });
        tokens.push(term);
    });
    tokens.push({ kind: "paren", value: ")" });
    return tokens;
};

const joinWithAnd = (groups: LogicToken[][]): LogicToken[] =>
    groups
        .filter(group => group.length > 0)
        .flatMap((group, index) =>
            index === 0
                ? group
                : [{ kind: "op" as const, value: "AND" as const }, ...group]
        );

const buildLogicTokens = (filters: Filter[]): LogicToken[] => {
    if (!filters || filters.length === 0) return [];

    const hist = filters.filter(item => resolveFilterType(item.id) === "hist");
    const top = filters.filter(item => {
        const kind = resolveFilterType(item.id);
        return (
            kind === "top" ||
            kind === "cruk" ||
            kind === "snomed" ||
            kind === "tcga"
        );
    });
    const data = filters.filter(item => resolveFilterType(item.id) === "data");
    const access = filters.filter(
        item => resolveFilterType(item.id) === "access"
    );

    const histTokens = tokensForIds(
        plusParents(hist.map(item => item.id)),
        "OR"
    );
    const topTokens = tokensForIds(plusParents(top.map(item => item.id)), "OR");
    const dataTokens = joinWithAnd(
        data.map(item =>
            tokensForIds(
                includeParents(item.id).filter(
                    id => filterDetailsMap && filterDetailsMap.has(id)
                ),
                "OR"
            )
        )
    );
    const accessTokens = tokensForIds(
        access.map(item => item.id),
        "OR"
    );

    return joinWithAnd([histTokens, topTokens, dataTokens, accessTokens]);
};

const evaluateLogicTokens = (
    tokens: LogicToken[],
    matches: (id: string) => boolean
): boolean | null => {
    if (tokens.length === 0) return true;

    let pos = 0;

    const parsePrimary = (): boolean => {
        const token = tokens[pos];
        if (!token) throw new Error("Unexpected end of expression");

        if (token.kind === "term") {
            pos += 1;
            return matches(token.id);
        }

        if (token.kind === "paren" && token.value === "(") {
            pos += 1;
            const inner = parseOr();
            const close = tokens[pos];
            if (!close || close.kind !== "paren" || close.value !== ")") {
                throw new Error("Missing closing parenthesis");
            }
            pos += 1;
            return inner;
        }

        throw new Error("Unexpected token");
    };

    const parseAnd = (): boolean => {
        let left = parsePrimary();
        while (tokens[pos]?.kind === "op" && tokens[pos].value === "AND") {
            pos += 1;
            const right = parsePrimary();
            left = left && right;
        }
        return left;
    };

    const parseOr = (): boolean => {
        let left = parseAnd();
        while (tokens[pos]?.kind === "op" && tokens[pos].value === "OR") {
            pos += 1;
            const right = parseAnd();
            left = left || right;
        }
        return left;
    };

    try {
        const value = parseOr();
        return pos === tokens.length ? value : null;
    } catch {
        return null;
    }
};

export {
    filterType,
    includeParents,
    plusParents,
    getMessage,
    calculateLogicMessage,
    buildLogicTokens,
    evaluateLogicTokens,
};
export type { LogicToken };