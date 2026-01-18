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

export {
    filterType,
    includeParents,
    plusParents,
    getMessage,
    calculateLogicMessage
};