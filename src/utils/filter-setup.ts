import { filterData } from './filter_data.js';
const filterDetailsMap = new Map();

interface FilterNode {
    id: string;
    label: string;
    category: string;
    children?: Record<string, FilterNode> | FilterNode[];
}

interface FilterDetail {
    id: string;
    label: string;
    category: string;
    group: string;
}

const populateMap = (nodes: Record<string, FilterNode> | FilterNode[] | null | undefined, primaryGroup: string): void => {
    if (!nodes) return;
    const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);
    nodesArray.forEach((item: FilterNode) => {
        const fullId = item.id;
        filterDetailsMap.set(fullId, { id: item.id, label: item.label, category: item.category, group: primaryGroup, });

        if (item.children && Object.keys(item.children).length > 0) {
            populateMap(item.children, primaryGroup);
        }
    });
};
populateMap(filterData['0_0'].children, filterData['0_0'].primaryGroup);
populateMap(filterData['0_2'].children, filterData['0_2'].primaryGroup);
populateMap(filterData['0_1'].children, filterData['0_1'].primaryGroup);

export {filterDetailsMap, filterData}