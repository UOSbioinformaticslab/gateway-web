"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
    AccessTimeIcon,
    BookmarkIcon,
    GroupsOutlinedIcon,
    LockIcon,
    PersonOutlineOutlinedIcon,
    SortByAlphaIcon,
} from "@/consts/icons";
import { DatasetSortColumn } from "@/utils/datasetResults";
import Sort from "../Sort";

const TRANSLATION_PATH = "pages.search.components.DatasetSort";

const DatasetSort = ({
    column,
    onChange,
}: {
    column: DatasetSortColumn;
    onChange: (column: DatasetSortColumn) => void;
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const sortOptions = useMemo(
        () => [
            {
                value: "favourite",
                label: t("favourite"),
                icon: BookmarkIcon,
            },
            { value: "title", label: t("title"), icon: SortByAlphaIcon },
            {
                value: "leadResearcher",
                label: t("leadResearcher"),
                icon: PersonOutlineOutlinedIcon,
            },
            {
                value: "popSize",
                label: t("populationSize"),
                icon: GroupsOutlinedIcon,
            },
            {
                value: "accessibility",
                label: t("accessibility"),
                icon: LockIcon,
            },
            {
                value: "dataRange",
                label: t("dataRange"),
                icon: AccessTimeIcon,
            },
        ],
        [t]
    );

    return (
        <Sort
            defaultValue={column}
            sortName="sort"
            submitAction={value => onChange(value as DatasetSortColumn)}
            sortOptions={sortOptions}
            iconised={false}
        />
    );
};

export default DatasetSort;
