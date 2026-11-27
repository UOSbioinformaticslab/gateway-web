"use client";

import { Paper } from "@mui/material";
import { useTranslations } from "next-intl";
import { TRANSLATION_PATH } from "./constants";

const FilterLoading = () => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            {t("loading")}
        </Paper>
    );
};

export default FilterLoading;
