import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchResultTool } from "@/interfaces/Search";
import { OpenInNewIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    DescriptionLabel,
    DescriptionRow,
    DescriptionText,
    ExternalLink,
    LinkGroup,
    LinkLabel,
    NoneLinked,
    ResourcePill,
    ResourcePillText,
    ToolCard,
    ToolHeader,
    ToolName,
} from "./ResultCardTool.styles";
import {
    LinkedResource,
    plainText,
    toolDatasets,
    toolExternalUrl,
    toolProjects,
} from "./toolLinks";

interface ResultCardToolProps {
    result: SearchResultTool;
}

const TRANSLATION_PATH = "pages.search.components.ResultCardTool";

const ResourcePills = ({
    resources,
    hrefFor,
}: {
    resources: LinkedResource[];
    hrefFor: (resource: LinkedResource) => string | undefined;
}) => {
    return (
        <>
            {resources.map(resource => {
                const href = hrefFor(resource);
                if (!href) {
                    return (
                        <ResourcePillText key={resource.name}>
                            {resource.name}
                        </ResourcePillText>
                    );
                }

                return (
                    <ResourcePill
                        key={`${resource.id}-${resource.name}`}
                        href={href}>
                        {resource.name}
                    </ResourcePill>
                );
            })}
        </>
    );
};

const ResultCardTool = ({ result }: ResultCardToolProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const datasets = toolDatasets(result);
    const projects = toolProjects(result);
    const externalUrl = toolExternalUrl(result);
    const description = plainText(result.description);

    return (
        <ToolCard component="article">
            <ToolHeader>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0,
                    }}>
                    <ToolName href={`/${RouteName.TOOL_ITEM}/${result._id}`}>
                        {result.name}
                    </ToolName>
                    {externalUrl && (
                        <ExternalLink href={externalUrl}>
                            {t("externalLink")}
                            <OpenInNewIcon sx={{ fontSize: 12 }} />
                        </ExternalLink>
                    )}
                </Box>
                <LinkGroup>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <LinkLabel>{t("datasets")}:</LinkLabel>
                        {datasets.length ? (
                            <ResourcePills
                                resources={datasets}
                                hrefFor={resource =>
                                    resource.id
                                        ? `/${RouteName.DATASET_ITEM}/${resource.id}`
                                        : undefined
                                }
                            />
                        ) : (
                            <NoneLinked>{t("none")}</NoneLinked>
                        )}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <LinkLabel>{t("projects")}:</LinkLabel>
                        {projects.length ? (
                            <ResourcePills
                                resources={projects}
                                hrefFor={resource =>
                                    resource.id
                                        ? `/${RouteName.DATA_USE_ITEM}/${resource.id}`
                                        : undefined
                                }
                            />
                        ) : (
                            <NoneLinked>{t("none")}</NoneLinked>
                        )}
                    </Box>
                </LinkGroup>
            </ToolHeader>
            <DescriptionRow>
                <DescriptionLabel>{t("description")}:</DescriptionLabel>
                <DescriptionText title={description}>
                    {description || t("noDescription")}
                </DescriptionText>
            </DescriptionRow>
        </ToolCard>
    );
};

export default ResultCardTool;
