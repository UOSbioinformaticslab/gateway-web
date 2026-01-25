"use client";

import { Box, Typography } from "@mui/material";
import Sources from "../Sources";
import Linkages from "../Linkages";
import Publications from "../Publications";
import { Dataset } from "@/interfaces/Dataset";
import { useTranslations } from "next-intl";
import { OverviewText, Wrapper } from "./FilterTags.styles";

const FilterTags = ({ data }: { data: Dataset }) => {
    const TRANSLATION_PATH = "modules.FilterTags";
    const t = useTranslations(TRANSLATION_PATH);
    const datasetVersion = data?.versions?.[0];
    return <Box>
                    <Wrapper
                    sx={{ gridColumn: { tablet: "span 1", laptop: "span 1" } }}>
                    <OverviewText variant="h3">{t("filterTags")}</OverviewText>
                    </Wrapper>
                      <Box
                                sx={{
                                    p: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}>
                                <Sources
                                    data={datasetVersion.metadata.metadata}
                                />
                                {data?.linkages && (
                                    <Linkages linkages={data.linkages} />
                                )}

                                <Publications data={data} />
                              </Box>
        </Box>;
};

export default FilterTags;