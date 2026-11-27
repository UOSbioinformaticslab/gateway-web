import { useEffect, useMemo, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchResultPublication } from "@/interfaces/Search";
import Loading from "@/components/Loading";
import { colors } from "@/config/theme";
import ResultCardPublication from "../ResultCardPublication/ResultCardPublication";
import {
    publicationDatasets,
    publicationProjects,
} from "../ResultCardPublication/publicationLinks";

interface PublicationDirectoryProps {
    results: SearchResultPublication[];
    total: number;
    query: string;
    isLoading?: boolean;
    onQueryChange: (query: string) => void;
}

const TRANSLATION_PATH = "pages.search.components.ResultCardPublication";

const includesText = (value: string, query: string) =>
    value.toLowerCase().includes(query.trim().toLowerCase());

const fieldLabelSx = {
    display: "block",
    mb: 0.75,
    color: colors.grey700,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
};

const PublicationDirectory = ({
    results,
    total,
    query,
    isLoading = false,
    onQueryChange,
}: PublicationDirectoryProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const [publicationQuery, setPublicationQuery] = useState(query);
    const [datasetQuery, setDatasetQuery] = useState("");
    const [projectQuery, setProjectQuery] = useState("");
    const onQueryChangeRef = useRef(onQueryChange);
    onQueryChangeRef.current = onQueryChange;

    useEffect(() => {
        setPublicationQuery(query);
    }, [query]);

    useEffect(() => {
        if (publicationQuery === query) return undefined;

        const timer = window.setTimeout(() => {
            onQueryChangeRef.current(publicationQuery);
        }, 400);

        return () => window.clearTimeout(timer);
    }, [publicationQuery, query]);

    const filteredResults = useMemo(() => {
        const publicationNeedle = publicationQuery.trim();
        const datasetNeedle = datasetQuery.trim();
        const projectNeedle = projectQuery.trim();

        return results.filter(result => {
            const doi = result.paper_doi || result._source?.paper_doi || "";
            const matchesPublication =
                !publicationNeedle ||
                includesText(result.paper_title || "", publicationNeedle) ||
                includesText(doi, publicationNeedle) ||
                includesText(result.authors || "", publicationNeedle);

            if (!matchesPublication) return false;

            if (
                datasetNeedle &&
                !publicationDatasets(result).some(dataset =>
                    includesText(dataset.name, datasetNeedle)
                )
            ) {
                return false;
            }

            if (
                projectNeedle &&
                !publicationProjects(result).some(project =>
                    includesText(project.name, projectNeedle)
                )
            ) {
                return false;
            }

            return true;
        });
    }, [datasetQuery, projectQuery, publicationQuery, results]);

    const hasLocalFilter = Boolean(
        datasetQuery.trim() || projectQuery.trim()
    );
    const showingCount = hasLocalFilter ? filteredResults.length : total;

    const searchField = (
        id: string,
        label: string,
        value: string,
        placeholder: string,
        onChange: (value: string) => void
    ) => (
        <Box>
            <Typography component="label" htmlFor={id} sx={fieldLabelSx}>
                {label}
            </Typography>
            <TextField
                id={id}
                value={value}
                placeholder={placeholder}
                onChange={event => onChange(event.target.value)}
                fullWidth
                size="small"
                sx={{ backgroundColor: colors.white }}
                slotProps={{
                    input: {
                        endAdornment: value ? (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={t("clearSearch")}
                                    size="small"
                                    edge="end"
                                    onClick={() => onChange("")}>
                                    <CloseIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </InputAdornment>
                        ) : undefined,
                    },
                }}
            />
        </Box>
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { mobile: "column", tablet: "row" },
                alignItems: "stretch",
                backgroundColor: colors.grey100,
                border: `1px solid ${colors.grey300}`,
                borderRadius: 2,
                overflow: "hidden",
            }}>
            <Box
                component="aside"
                sx={{
                    width: { mobile: "100%", tablet: 280 },
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    p: 3,
                    borderRight: { tablet: `1px solid ${colors.grey300}` },
                    borderBottom: { mobile: `1px solid ${colors.grey300}`, tablet: 0 },
                    backgroundColor: colors.grey100,
                }}>
                {searchField(
                    "publication-search",
                    t("searchPublications"),
                    publicationQuery,
                    t("searchPublicationsPlaceholder"),
                    setPublicationQuery
                )}
                {searchField(
                    "linked-dataset-search",
                    t("searchDatasets"),
                    datasetQuery,
                    t("searchDatasetsPlaceholder"),
                    setDatasetQuery
                )}
                {searchField(
                    "linked-project-search",
                    t("searchProjects"),
                    projectQuery,
                    t("searchProjectsPlaceholder"),
                    setProjectQuery
                )}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, width: "100%", p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 2,
                        mb: 2,
                    }}>
                    <Typography
                        component="h1"
                        sx={{
                            m: 0,
                            color: colors.grey900,
                            fontSize: 22,
                            fontWeight: 700,
                        }}>
                        {t("directoryTitle")}
                    </Typography>
                    <Typography
                        sx={{
                            color: colors.grey600,
                            fontSize: 13,
                            flexShrink: 0,
                        }}>
                        {t("showingResults", { count: showingCount })}
                    </Typography>
                </Box>

                {isLoading ? (
                    <Loading ariaLabel={t("loading")} />
                ) : filteredResults.length ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {filteredResults.map(result => (
                            <ResultCardPublication
                                key={result._id}
                                result={result}
                            />
                        ))}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            py: 6,
                            px: 2,
                            textAlign: "center",
                            color: colors.grey600,
                            border: `1px dashed ${colors.grey300}`,
                            borderRadius: 2,
                        }}>
                        {t("noResults")}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default PublicationDirectory;
