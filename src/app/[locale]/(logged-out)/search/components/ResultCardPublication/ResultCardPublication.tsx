import { useState } from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchResultPublication } from "@/interfaces/Search";
import HTMLContent from "@/components/HTMLContent";
import { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import {
    AbstractPreview,
    AbstractToggle,
    DatasetPill,
    DatasetPillText,
    DependencyBox,
    DependencyName,
    DependencyRow,
    JournalName,
    MetaRow,
    NoneLinked,
    ProjectPill,
    ProjectPillText,
    PublicationCard,
    PublicationTitle,
    ReadMore,
    SectionLabel,
} from "./ResultCardPublication.styles";
import {
    LinkedResource,
    firstAbstractLine,
    formatAuthors,
    publicationDatasets,
    publicationHref,
    publicationProjects,
} from "./publicationLinks";

interface ResultCardPublicationProps {
    result: SearchResultPublication;
}

const TRANSLATION_PATH = "pages.search.components.ResultCardPublication";

const ResourcePills = ({
    resources,
    hrefFor,
    Pill,
    PillText,
}: {
    resources: LinkedResource[];
    hrefFor: (resource: LinkedResource) => string | undefined;
    Pill: typeof DatasetPill;
    PillText: typeof DatasetPillText;
}) => {
    return (
        <>
            {resources.map(resource => {
                const href = hrefFor(resource);
                if (!href) {
                    return (
                        <PillText key={resource.name}>{resource.name}</PillText>
                    );
                }

                return (
                    <Pill key={`${resource.id}-${resource.name}`} href={href}>
                        {resource.name}
                    </Pill>
                );
            })}
        </>
    );
};

const ResultCardPublication = ({ result }: ResultCardPublicationProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const [abstractOpen, setAbstractOpen] = useState(false);

    const datasets = publicationDatasets(result);
    const projects = publicationProjects(result);
    const href = publicationHref(result);
    const authors = formatAuthors(result.authors);
    const preview = firstAbstractLine(result.abstract);

    return (
        <PublicationCard component="article">
            <Box sx={{ mb: 0.5 }}>
                {href ? (
                    <PublicationTitle href={href}>
                        {result.paper_title}
                    </PublicationTitle>
                ) : (
                    <Box
                        component="h3"
                        sx={{
                            m: 0,
                            color: colors.grey900,
                            fontSize: 20,
                            fontWeight: 700,
                            lineHeight: 1.35,
                        }}>
                        {result.paper_title}
                    </Box>
                )}
            </Box>

            <MetaRow>
                <span>{authors || t("unknownAuthor")}</span>
                <Box component="span" sx={{ color: colors.grey300 }}>
                    |
                </Box>
                <JournalName>
                    {result.journal_name?.trim() || t("journalUnknown")}
                </JournalName>
                <Box component="span" sx={{ color: colors.grey300 }}>
                    |
                </Box>
                <span>
                    {t("published")}:{" "}
                    {result.year_of_publication || t("notAvailable")}
                </span>
            </MetaRow>

            <DependencyBox>
                <SectionLabel>{t("dataDependencies")}</SectionLabel>
                <DependencyRow>
                    <DependencyName>{t("datasets")}:</DependencyName>
                    {datasets.length ? (
                        <ResourcePills
                            resources={datasets}
                            Pill={DatasetPill}
                            PillText={DatasetPillText}
                            hrefFor={resource =>
                                resource.id
                                    ? `/${RouteName.DATASET_ITEM}/${resource.id}`
                                    : undefined
                            }
                        />
                    ) : (
                        <NoneLinked>{t("noneLinked")}</NoneLinked>
                    )}
                </DependencyRow>
                <DependencyRow>
                    <DependencyName>{t("projects")}:</DependencyName>
                    {projects.length ? (
                        <ResourcePills
                            resources={projects}
                            Pill={ProjectPill}
                            PillText={ProjectPillText}
                            hrefFor={resource =>
                                resource.id
                                    ? `/${RouteName.DATA_USE_ITEM}/${resource.id}`
                                    : undefined
                            }
                        />
                    ) : (
                        <NoneLinked>{t("noneLinked")}</NoneLinked>
                    )}
                </DependencyRow>
            </DependencyBox>

            <Box sx={{ borderTop: `1px solid ${colors.grey200}`, pt: 1.5 }}>
                <AbstractToggle
                    type="button"
                    aria-expanded={abstractOpen}
                    onClick={() => setAbstractOpen(open => !open)}>
                    <span aria-hidden="true">{abstractOpen ? "▼" : "►"}</span>
                    {t("abstract")}
                </AbstractToggle>
                {abstractOpen ? (
                    <Box sx={{ pl: 2, color: colors.grey600, fontSize: 14 }}>
                        {result.abstract ? (
                            <HTMLContent content={result.abstract} />
                        ) : (
                            t("noAbstract")
                        )}
                    </Box>
                ) : (
                    <AbstractPreview>
                        {preview || t("noAbstract")}
                        {result.abstract && (
                            <ReadMore
                                type="button"
                                onClick={() => setAbstractOpen(true)}>
                                {t("readMore")}
                            </ReadMore>
                        )}
                    </AbstractPreview>
                )}
            </Box>
        </PublicationCard>
    );
};

export default ResultCardPublication;
