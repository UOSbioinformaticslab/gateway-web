"use client";

import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import Sources from "../Sources";
import Linkages from "../Linkages";
import Publications from "../Publications";
import { Dataset } from "@/interfaces/Dataset";
import { useTranslations } from "next-intl";
import { KeywordWrapper, OverviewText, Wrapper } from "./FilterTags.styles";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";

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
                                                             <Paper sx={{ borderRadius: 2, p: 2 }}>
                        <Typography variant="h3"  fontWeight="bold" >
                            Keywords
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                            {datasetVersion.metadata.metadata.summary.keywords.map((kw, i) => (
                                <EllipsisCharacterLimit key={i} text={kw}  />
                            ))}
                        </Stack>
                    </Paper>
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