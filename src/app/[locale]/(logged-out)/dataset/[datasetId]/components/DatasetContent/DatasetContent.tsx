"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { get, isArray } from "lodash";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import { VersionItem } from "@/interfaces/Dataset";
import { SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Link from "@/components/Link";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import Table from "@/components/Table";
import TooltipText from "@/components/TooltipText";
import Typography from "@/components/Typography";
import useModal from "@/hooks/useModal";
import { RouteName } from "@/consts/routeName";
import { formatTextWithLinks, parseLeadTime, splitStringList } from "@/utils/dataset";
import { formatDate } from "@/utils/date";
import { decodeHtmlEntity } from "@/utils/general";
import { Collapse, IconButton } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { StructuralMetadataPublicSchema } from "@/interfaces/Dataset";
import StructuralMetadataInline from "../StructuralMetadataInline";
import {
    DatasetSection,
    DatasetType,
    FieldType,
    Observation,
    observationTableColumns,
} from "../../config";
import {
    DatasetButtonItem,
    DatasetFieldWrapper,
    ListContainer,
    ObservationTableWrapper,
} from "./DatasetContent.styles";

const DATE_FORMAT = "DD/MM/YYYY";
const OBSERVATION_DATE = "observationDate";
const TRANSLATION_PATH = "common";
const DOI_URL = "https://doi.org/";
const DOI_NAME_PATH = "metadata.metadata.summary.doiName";

const columnHelper = createColumnHelper<Observation>();

type CrukProject = {
    projectName: string;
    leadResearcher: string;
    timeline: string;
    grantNumbers: string;
    projectScope: string;
};

const getColumns = (notReportedText: string) =>
    observationTableColumns.map(column =>
        columnHelper.display({
            id: column.header,
            cell: ({ row: { original } }) =>
                column.path === OBSERVATION_DATE ? (
                    <p>{formatDate(get(original, column.path))}</p>
                ) : (
                    <p>
                        {get(original, column.path) !== -1
                            ? get(original, column.path)
                            : notReportedText}
                    </p>
                ),
            header: () => (
                <TooltipText
                    content={column.tooltip}
                    placement="bottom"
                    label={column.header}
                />
            ),
        })
    );

const renderObservationsTable = (
    notReportedText: string,
    rows?: Observation[]
) => (
    <ObservationTableWrapper>
        <Table<Observation>
            columns={getColumns(notReportedText)}
            rows={rows || []}
        />
    </ObservationTableWrapper>
);

type DistributionRow = { label: string; count: number };

const HARD_CODED_ETHNICITY_ROWS: DistributionRow[] = [
    { label: "White - British", count: 67 },
    { label: "White - Irish", count: 0 },
    { label: "White - Any other White background", count: 7 },
    { label: "Mixed - White and Black Caribbean", count: 0 },
    { label: "Mixed - White and Black African", count: 0 },
    { label: "Mixed - White and Asian", count: 0 },
    { label: "Mixed - Any other mixed background", count: 0 },
    { label: "Asian or Asian British - Indian", count: 0 },
    { label: "Asian or Asian British - Pakistani", count: 0 },
    { label: "Asian or Asian British - Bangladeshi", count: 0 },
    { label: "Asian or Asian British - Any other Asian background", count: 0 },
    { label: "Black or Black British - Caribbean", count: 0 },
    { label: "Black or Black British - African", count: 0 },
    { label: "Black or Black British - Any other Black background", count: 0 },
    { label: "Other Ethnic Groups - Chinese", count: 0 },
    { label: "Other Ethnic Groups - Any other ethnic group", count: 0 },
    { label: "Not stated", count: 0 },
    { label: "Not known", count: 0 },
];

const renderDistribution = ({
    title,
    rows,
}: {
    title: string;
    rows: DistributionRow[];
}) => {
    if (!rows || rows.length === 0) return null;
    const max = Math.max(...rows.map(r => r.count || 0), 0);
    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 2,
                p: 2.5,
                borderColor: "rgba(0,0,0,0.06)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
                bgcolor: "white",
            }}
        >
            <Typography sx={{ fontSize: 22, fontWeight: 900, mb: 2 }}>
                {title}
            </Typography>
            <Box sx={{ p: 0, display: "grid", gap: 1.25 }}>
                {rows.map(r => {
                    const pct = max > 0 ? (r.count / max) * 100 : 0;
                    return (
                        <Box
                            key={`${title}-${r.label}`}
                            sx={{
                                p: 0,
                                display: "grid",
                                gridTemplateColumns: {
                                    mobile: "1fr",
                                    tablet: "280px 1fr 48px",
                                },
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    color: "text.primary",
                                    textAlign: { mobile: "left", tablet: "right" },
                                }}
                            >
                                {r.label}
                            </Typography>
                            <Box
                                sx={{
                                    p: 0,
                                    height: 18,
                                    borderRadius: 1,
                                    bgcolor: "rgba(0,0,0,0.06)",
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 0,
                                        height: "100%",
                                        width: `${pct}%`,
                                        bgcolor: "primary.main",
                                    }}
                                />
                            </Box>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 800,
                                    color: "text.primary",
                                    textAlign: "right",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {r.count.toLocaleString()}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

const isUrlLike = (value: string) => /^https?:\/\//i.test(value);

const LINK_OVERRIDES: Record<string, string> = {
    "National Hepatobiliary Cancer Registry [NHCR-04]":
        "https://healthdatagateway.org/en/dataset/741",
    "Regional Hepatobiliary Cancer Registry [RHCR-14]":
        "https://healthdatagateway.org/en/dataset/741",
    "10.1016/j.jhep.2023.05.012": "https://doi.org/10.1016/j.jhep.2023.05.012",
    "10.1016/j.jhep.2023.05.011": "https://doi.org/10.1016/j.jhep.2023.05.011",
    "Advanced HCC Organoid Cohort [AHCC-ORG]":
        "https://doi.org/10.1016/j.jhep.2022.02.015",
};

const toStringList = (value: unknown) => {
    if (!value) return [];
    if (isArray(value)) return value.map(String).filter(Boolean);
    if (typeof value === "string") return splitStringList(value);
    return [String(value)].filter(Boolean);
};

const renderBullets = (items: string[]) => {
    if (!items || items.length === 0) return null;
    return (
        <Box component="ul" sx={{ p: 0, m: 0, pl: 2 }}>
            {items.map((item, idx) => (
                <Box
                    component="li"
                    key={`${item}-${idx}`}
                    sx={{ p: 0, mb: 0.75, color: "text.primary" }}
                >
                    {(() => {
                        const href = LINK_OVERRIDES[item];
                        if (href) return <Link href={href}>{item}</Link>;
                        if (isUrlLike(item)) return <Link href={item}>{item}</Link>;
                        return (
                            <Typography sx={{ display: "inline", fontSize: 14 }}>
                                {item}
                            </Typography>
                        );
                    })()}
                </Box>
            ))}
        </Box>
    );
};

const DatasetContent = ({
    data,
    populatedSections,
}: {
    data: VersionItem;
    populatedSections: DatasetSection[];
}) => {
    const router = useRouter();
    const t = useTranslations(TRANSLATION_PATH);
    const { showModal } = useModal();

    const crukProjects = useMemo<CrukProject[]>(
        () => [
            {
                projectName:
                    "Targeted Therapies in IDH1-Mutant Cholangiocarcinoma",
                leadResearcher:
                    "Dr. Sarah Jenkins — Institute of Liver Studies",
                timeline: "2020-01-01 to 2025-12-31",
                grantNumbers: "AMMF-202, MRC-441",
                projectScope:
                    "drug screening viability, whole exome sequencing, and patient survival logs",
            },
            {
                projectName:
                    "Functional Genomics of Cholangiocarcinoma Progression",
                leadResearcher:
                    "Dr. Sarah Jenkins — Institute of Liver Studies",
                timeline: "2019-01-01 to 2024-12-31",
                grantNumbers: "CRUK-105, BTA-019",
                projectScope:
                    "organoid derivation, longitudinal follow-up, and multi-omics profiling",
            },
        ],
        []
    );

    const [activeCrukProjectIdx, setActiveCrukProjectIdx] = useState(0);
    const activeCrukProject =
        crukProjects[Math.min(activeCrukProjectIdx, crukProjects.length - 1)];

    const [documentationExpanded, setDocumentationExpanded] = useState(false);
    const [structuralExpanded, setStructuralExpanded] = useState<Set<string>>(
        () => new Set<string>()
    );
    const [otherDataTypesExpanded, setOtherDataTypesExpanded] = useState<
        Set<number>
    >(() => new Set<number>());

    const structuralFallback: StructuralMetadataPublicSchema = useMemo(
        () => ({
            syntheticDataWebLink: [],
            tables: [
                {
                    name: "Drug_Response_Metrics",
                    description:
                        "In vitro drug sensitivity and resistance profiles",
                    columns: [
                        {
                            name: "fgfr_inhibitor_ic50",
                            description:
                                "list of IC50 values (nM) for FGFR inhibitors",
                            dataType: "list",
                            sensitive: false,
                            values: [],
                        },
                    ],
                },
            ],
        }),
        []
    );

    const getEffectiveStructuralNames = () => {
        const structural = get(
            data,
            "metadata.metadata.structuralMetadata"
        ) as StructuralMetadataPublicSchema | undefined;
        const tables = structural?.tables?.length ? structural.tables : structuralFallback.tables;
        return tables.map(t => t.name).filter(Boolean);
    };

    const renderDatasetField = (
        type: FieldType,
        value: string | DatasetType[]
    ) => {
        switch (type) {
            case FieldType.DATE: {
                return (
                    <Typography>{formatDate(value, DATE_FORMAT)}</Typography>
                );
            }
            case FieldType.TAG_LIST: {
                let tagList: string[] | string = value;

                if (typeof tagList === "string") {
                    tagList = tagList.split(",");
                }
                tagList = tagList.map(tag => decodeHtmlEntity(tag));

                return (
                    <DatasetFieldWrapper>
                        {tagList.map(tag => (
                            <DatasetButtonItem
                                key={tag}
                                color="success"
                                size="small"
                                onClick={() =>
                                    router.push(
                                        `/${RouteName.SEARCH}?type=${
                                            SearchCategory.DATASETS
                                        }&query=${encodeURIComponent(tag)}`
                                    )
                                }>
                                {tag}
                            </DatasetButtonItem>
                        ))}
                    </DatasetFieldWrapper>
                );
            }
            case FieldType.LIST: {
                const list = isArray(value)
                    ? value
                    : Array.from(new Set(splitStringList(value)));

                return list.map((item, i) => [
                    i > 0 && ", ",
                    formatTextWithLinks(item),
                ]);
            }
            case FieldType.LINK_LIST: {
                const list = isArray(value)
                    ? value
                    : Array.from(new Set(splitStringList(value)));

                return (
                    <ListContainer>
                        {list.map(item => (
                            <Link
                                key={item.toString()}
                                href={item}
                                target="_blank">
                                {item}
                            </Link>
                        ))}
                    </ListContainer>
                );
            }

            case FieldType.DATASETTYPE_LIST: {
                return value.map((item, i) => [i > 0 && ", ", item.name]);
            }

            default: {
                return (
                    <MarkDownSanitizedWithHtml content={value} wrapper="span" />
                );
            }
        }
    };

    return (
        <Paper sx={{ borderRadius: 2, p: 2 }}>
            {populatedSections.map((section, index) => {
                const id = `anchor-${section.sectionName.replaceAll(/\s/g, "")}`;

                let renderedCount = 0;
                return (
                    <div
                        key={`${section.sectionName}_section`}
                        id={`anchor${index + 1}`}>
                        <Box
                            key={`${section.sectionName}_wrap`}
                            id={id}
                            sx={{
                                "&:not(:last-of-type)": {
                                    borderBottom: 1,
                                    borderColor: "greyCustom.light",
                                },
                                pl: 0,
                                pr: 0,
                            }}>
                            {section.sectionName === "Structural Metadata" ? (
                                <Box
                                    sx={{
                                        p: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h2"
                                        aria-live="polite"
                                        tabIndex={-1}
                                    >
                                        {section.sectionName}
                                    </Typography>
                                    <Box
                                        sx={{
                                            p: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Button
                                            variant="link"
                                            onClick={() => {
                                                setStructuralExpanded(
                                                    new Set(
                                                        getEffectiveStructuralNames()
                                                    )
                                                );
                                            }}
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Expand All
                                        </Button>
                                        <Typography
                                            sx={{
                                                color: "text.secondary",
                                            }}
                                        >
                                            |
                                        </Typography>
                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                setStructuralExpanded(
                                                    new Set<string>()
                                                )
                                            }
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Collapse All
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Typography
                                    variant="h2"
                                    aria-live="polite"
                                    tabIndex={-1}
                                >
                                    {section.sectionName}
                                </Typography>
                            )}

                            {section.sectionName === "Observations" ? (
                                (() => {
                                    const rows = get(
                                        data,
                                        "metadata.metadata.observations"
                                    ) as Observation[] | undefined;
                                    renderedCount =
                                        rows && rows.length > 0 ? 1 : 0;
                                    if (!rows || rows.length === 0) {
                                        return (
                                            <Typography
                                                sx={{
                                                    mt: 1,
                                                    color: "text.secondary",
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                {t("notReported")}
                                            </Typography>
                                        );
                                    }

                                    const nf = new Intl.NumberFormat("en-GB");

                                    return (
                                        <Box sx={{ p: 0, mt: 1 }}>
                                            <BoxContainer
                                                sx={{
                                                    p: 0,
                                                    gridTemplateColumns: {
                                                        mobile: "1fr",
                                                        tablet: "repeat(2, 1fr)",
                                                        desktop:
                                                            "repeat(3, 1fr)",
                                                    },
                                                    gap: 2,
                                                }}
                                            >
                                                {rows.map((row, idx) => {
                                                    const key = `${row.observedNode}-${row.measuredProperty}-${row.observationDate}-${idx}`;
                                                    const value =
                                                        row.measuredValue !== -1
                                                            ? nf.format(
                                                                  row.measuredValue
                                                              )
                                                            : t("notReported");
                                                    return (
                                                        <Paper
                                                            key={key}
                                                            variant="outlined"
                                                            sx={{
                                                                borderRadius: 2,
                                                                p: 2.25,
                                                                borderColor:
                                                                    "rgba(0,0,0,0.06)",
                                                                boxShadow:
                                                                    "0 10px 24px rgba(0,0,0,0.05)",
                                                                bgcolor: "white",
                                                                borderLeft:
                                                                    "5px solid",
                                                                borderLeftColor:
                                                                    "primary.main",
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 28,
                                                                    fontWeight: 900,
                                                                    lineHeight: 1.1,
                                                                    mb: 0.5,
                                                                }}
                                                            >
                                                                {value}
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 14,
                                                                    fontWeight: 800,
                                                                    color: "text.primary",
                                                                    mb: 0.25,
                                                                }}
                                                            >
                                                                {row.observedNode}
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 12,
                                                                    color: "text.secondary",
                                                                }}
                                                            >
                                                                {row.measuredProperty}
                                                            </Typography>
                                                        </Paper>
                                                    );
                                                })}
                                            </BoxContainer>
                                        </Box>
                                    );
                                })()
                            ) : section.sectionName === "Project" ? (
                                (() => {
                                    renderedCount = 1;
                                    return (
                                        <Box sx={{ p: 0, mt: 1 }}>
                                            <Box
                                                sx={{
                                                    p: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 2,
                                                    borderBottom:
                                                        "1px solid rgba(0,0,0,0.08)",
                                                    pb: 1.25,
                                                    mb: 2,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 22,
                                                        fontWeight: 900,
                                                    }}
                                                >
                                                    CRUK Project
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() =>
                                                        setActiveCrukProjectIdx(
                                                            i =>
                                                                (i + 1) %
                                                                crukProjects.length
                                                        )
                                                    }
                                                    sx={{
                                                        borderRadius: 2,
                                                        px: 2,
                                                        py: 0.75,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {`Show Next Project (${
                                                        activeCrukProjectIdx + 1
                                                    } of ${crukProjects.length})`}
                                                </Button>
                                            </Box>

                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    p: 2.5,
                                                    boxShadow:
                                                        "0 10px 26px rgba(0,0,0,0.08)",
                                                    borderColor:
                                                        "rgba(0,0,0,0.06)",
                                                }}
                                            >
                                                <BoxContainer
                                                    sx={{
                                                        p: 0,
                                                        gridTemplateColumns: {
                                                            mobile: "1fr",
                                                            tablet:
                                                                "repeat(2, 1fr)",
                                                        },
                                                        gap: 3,
                                                    }}
                                                >
                                                    <Box sx={{ p: 0 }}>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                fontWeight: 800,
                                                                letterSpacing:
                                                                    "0.12em",
                                                                textTransform:
                                                                    "uppercase",
                                                                color: "text.secondary",
                                                                mb: 0.75,
                                                            }}
                                                        >
                                                            Project Name
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 20,
                                                                fontWeight: 900,
                                                                color: "primary.main",
                                                            }}
                                                        >
                                                            {
                                                                activeCrukProject.projectName
                                                            }
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ p: 0 }}>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                fontWeight: 800,
                                                                letterSpacing:
                                                                    "0.12em",
                                                                textTransform:
                                                                    "uppercase",
                                                                color: "text.secondary",
                                                                mb: 0.75,
                                                            }}
                                                        >
                                                            Lead Researcher
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 16,
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {
                                                                activeCrukProject.leadResearcher
                                                            }
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ p: 0 }}>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                fontWeight: 800,
                                                                letterSpacing:
                                                                    "0.12em",
                                                                textTransform:
                                                                    "uppercase",
                                                                color: "text.secondary",
                                                                mb: 0.75,
                                                            }}
                                                        >
                                                            Timeline
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 16,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {
                                                                activeCrukProject.timeline
                                                            }
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ p: 0 }}>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                fontWeight: 800,
                                                                letterSpacing:
                                                                    "0.12em",
                                                                textTransform:
                                                                    "uppercase",
                                                                color: "text.secondary",
                                                                mb: 0.75,
                                                            }}
                                                        >
                                                            Grant Number(s)
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 16,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {
                                                                activeCrukProject.grantNumbers
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </BoxContainer>

                                                <Box
                                                    sx={{
                                                        p: 0,
                                                        mt: 2.5,
                                                        pt: 2.25,
                                                        borderTop:
                                                            "1px solid rgba(0,0,0,0.06)",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: 12,
                                                            fontWeight: 800,
                                                            letterSpacing:
                                                                "0.12em",
                                                            textTransform:
                                                                "uppercase",
                                                            color: "text.secondary",
                                                            mb: 0.75,
                                                        }}
                                                    >
                                                        Project Scope
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontSize: 16,
                                                            fontWeight: 600,
                                                            color: "text.primary",
                                                        }}
                                                    >
                                                        {
                                                            activeCrukProject.projectScope
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    );
                                })()
                            ) : section.sectionName === "Summary" ? (
                                (() => {
                                    const abstract =
                                        (get(
                                            data,
                                            "metadata.metadata.summary.abstract"
                                        ) as string | undefined) ||
                                        "Registry data linking molecular profiling of advanced cholangiocarcinoma to drug screening results in patient-derived models.";

                                    renderedCount = 1;

                                    return (
                                        <Box sx={{ p: 0, mt: 1 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    p: 2.5,
                                                    bgcolor: "rgba(0,0,0,0.02)",
                                                    borderColor:
                                                        "rgba(0,0,0,0.06)",
                                                    boxShadow:
                                                        "0 10px 24px rgba(0,0,0,0.05)",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 16,
                                                        color: "text.primary",
                                                        lineHeight: 1.65,
                                                    }}
                                                >
                                                    {abstract}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    );
                                })()
                            ) : section.sectionName === "Documentation" ? (
                                (() => {
                                    renderedCount = 1;

                                    const description =
                                        (get(
                                            data,
                                            "metadata.metadata.documentation.description"
                                        ) as string | undefined) ||
                                        "Registry data linking molecular profiling of advanced cholangiocarcinoma to drug screening results in patient-derived models. This is a synthetic description generated for testing purposes.";

                                    return (
                                        <Box sx={{ p: 0, mt: 1 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    p: 2,
                                                    bgcolor:
                                                        "rgba(0, 70, 140, 0.06)",
                                                    borderColor:
                                                        "rgba(0, 70, 140, 0.55)",
                                                    boxShadow:
                                                        "0 10px 24px rgba(0,0,0,0.05)",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        p: 0,
                                                        display: "flex",
                                                        alignItems: "flex-start",
                                                        justifyContent:
                                                            "space-between",
                                                        gap: 2,
                                                        cursor: "pointer",
                                                    }}
                                                    role="button"
                                                    tabIndex={0}
                                                    aria-expanded={
                                                        documentationExpanded
                                                    }
                                                    onClick={() =>
                                                        setDocumentationExpanded(
                                                            v => !v
                                                        )
                                                    }
                                                    onKeyDown={e => {
                                                        if (
                                                            e.key === "Enter" ||
                                                            e.key === " "
                                                        ) {
                                                            e.preventDefault();
                                                            setDocumentationExpanded(
                                                                v => !v
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ p: 0, flex: 1 }}>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 20,
                                                                fontWeight: 900,
                                                                color: "primary.main",
                                                                mb: 1,
                                                            }}
                                                        >
                                                            Detailed Description
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize: 16,
                                                                fontStyle: "italic",
                                                                color: "text.primary",
                                                                lineHeight: 1.65,
                                                            }}
                                                        >
                                                            {description}{" "}
                                                            {!documentationExpanded && (
                                                                <span
                                                                    style={{
                                                                        fontStyle:
                                                                            "normal",
                                                                        fontWeight: 800,
                                                                        color:
                                                                            "rgba(0, 70, 140, 1)",
                                                                        textDecoration:
                                                                            "underline",
                                                                    }}
                                                                >
                                                                    (Click to expand)
                                                                </span>
                                                            )}
                                                        </Typography>
                                                    </Box>

                                                    <IconButton
                                                        aria-label={
                                                            documentationExpanded
                                                                ? "Collapse detailed description"
                                                                : "Expand detailed description"
                                                        }
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setDocumentationExpanded(
                                                                v => !v
                                                            );
                                                        }}
                                                        sx={{
                                                            mt: 0.5,
                                                            color: "primary.main",
                                                        }}
                                                    >
                                                        {documentationExpanded ? (
                                                            <ExpandLess />
                                                        ) : (
                                                            <ExpandMore />
                                                        )}
                                                    </IconButton>
                                                </Box>

                                                <Collapse
                                                    in={documentationExpanded}
                                                    timeout={200}
                                                >
                                                    <Box
                                                        sx={{
                                                            p: 0,
                                                            mt: 2,
                                                            bgcolor: "white",
                                                            borderRadius: 2,
                                                            p: 2,
                                                            border:
                                                                "1px solid rgba(0,0,0,0.06)",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 16,
                                                                color: "text.primary",
                                                                lineHeight: 1.65,
                                                            }}
                                                        >
                                                            {description}
                                                        </Typography>
                                                    </Box>
                                                </Collapse>
                                            </Paper>
                                        </Box>
                                    );
                                })()
                            ) : section.sectionName === "Other Data Types" ? (
                                (() => {
                                    renderedCount = 1;

                                    const rows = [
                                        {
                                            title: "H&E Stained Organoid Sections",
                                            format: "TIFF",
                                            description:
                                                "High-resolution microscopy of formalin-fixed organoids",
                                        },
                                        {
                                            title: "2-D microscopy slides of normal and diseased liver",
                                            format: "DICOM",
                                            description:
                                                "Complete set of slides showing extent of cancer",
                                        },
                                    ];

                                    const toggleRow = (idx: number) => {
                                        setOtherDataTypesExpanded(prev => {
                                            const next = new Set(prev);
                                            if (next.has(idx)) next.delete(idx);
                                            else next.add(idx);
                                            return next;
                                        });
                                    };

                                    return (
                                        <Box sx={{ p: 0, mt: 2 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    overflow: "hidden",
                                                    borderColor:
                                                        "rgba(0,0,0,0.08)",
                                                }}
                                            >
                                                {rows.map((r, idx) => {
                                                    const isOpen =
                                                        otherDataTypesExpanded.has(
                                                            idx
                                                        );
                                                    return (
                                                        <Box
                                                            key={r.title}
                                                            sx={{
                                                                p: 0,
                                                                borderBottom:
                                                                    idx ===
                                                                    rows.length -
                                                                        1
                                                                        ? "none"
                                                                        : "1px solid rgba(0,0,0,0.06)",
                                                            }}
                                                        >
                                                            <Box
                                                                onClick={() =>
                                                                    toggleRow(
                                                                        idx
                                                                    )
                                                                }
                                                                role="button"
                                                                tabIndex={0}
                                                                onKeyDown={e => {
                                                                    if (
                                                                        e.key ===
                                                                            "Enter" ||
                                                                        e.key ===
                                                                            " "
                                                                    ) {
                                                                        e.preventDefault();
                                                                        toggleRow(
                                                                            idx
                                                                        );
                                                                    }
                                                                }}
                                                                sx={{
                                                                    p: 0,
                                                                    display: "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    gap: 2,
                                                                    px: 2,
                                                                    py: 1.5,
                                                                    cursor: "pointer",
                                                                    bgcolor:
                                                                        "rgba(0,0,0,0.01)",
                                                                    "&:hover": {
                                                                        bgcolor:
                                                                            "rgba(0,0,0,0.03)",
                                                                    },
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        p: 0,
                                                                        display: "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: 1.25,
                                                                        minWidth: 0,
                                                                    }}
                                                                >
                                                                    <ExpandMoreIcon
                                                                        sx={{
                                                                            color: "primary.main",
                                                                            transform: isOpen
                                                                                ? "rotate(0deg)"
                                                                                : "rotate(-90deg)",
                                                                            transition:
                                                                                "transform 120ms ease",
                                                                        }}
                                                                    />
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: 16,
                                                                            fontWeight: 900,
                                                                            color: "primary.main",
                                                                            overflow:
                                                                                "hidden",
                                                                            textOverflow:
                                                                                "ellipsis",
                                                                            whiteSpace:
                                                                                "nowrap",
                                                                        }}
                                                                    >
                                                                        {r.title}
                                                                    </Typography>
                                                                </Box>

                                                                <Box
                                                                    sx={{
                                                                        p: 0,
                                                                        px: 1.25,
                                                                        py: 0.5,
                                                                        borderRadius: 1.5,
                                                                        bgcolor:
                                                                            "rgba(0, 70, 140, 0.08)",
                                                                        border:
                                                                            "1px solid rgba(0, 70, 140, 0.18)",
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: 12,
                                                                            fontWeight: 900,
                                                                            letterSpacing:
                                                                                "0.08em",
                                                                            color: "primary.main",
                                                                        }}
                                                                    >
                                                                        {r.format}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>

                                                            <Collapse
                                                                in={isOpen}
                                                                timeout={150}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        p: 0,
                                                                        px: 2,
                                                                        py: 1.25,
                                                                        bgcolor:
                                                                            "rgba(0,0,0,0.015)",
                                                                        borderTop:
                                                                            "1px solid rgba(0,0,0,0.06)",
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            p: 0,
                                                                            pl: 3.25,
                                                                            borderLeft:
                                                                                "2px solid rgba(0,0,0,0.06)",
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: 15,
                                                                                color: "text.secondary",
                                                                            }}
                                                                        >
                                                                            {r.description}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Collapse>
                                                        </Box>
                                                    );
                                                })}
                                            </Paper>
                                        </Box>
                                    );
                                })()
                            ) : section.sectionName ===
                              "Entity Relationship Diagrams" ? (
                                (() => {
                                    renderedCount = 1;
                                    return (
                                        <Box sx={{ p: 0, mt: 2 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    p: 2,
                                                    borderColor:
                                                        "rgba(0,0,0,0.08)",
                                                    boxShadow:
                                                        "0 10px 24px rgba(0,0,0,0.05)",
                                                    bgcolor: "white",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        p: 0,
                                                        position: "relative",
                                                        width: "100%",
                                                        borderRadius: 2,
                                                        overflow: "hidden",
                                                        border:
                                                            "1px solid rgba(0,0,0,0.06)",
                                                    }}
                                                >
                                                    <a
                                                        href="/images/dataset/erd.png"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{
                                                            display: "block",
                                                        }}
                                                    >
                                                        <Image
                                                            src="/images/dataset/erd.png"
                                                            alt="Entity relationship diagram"
                                                            width={1400}
                                                            height={900}
                                                            style={{
                                                                width: "100%",
                                                                height: "auto",
                                                                display: "block",
                                                            }}
                                                        />
                                                    </a>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    );
                                })()
                            ) : section.sectionName === "Demographics" ? (
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr",
                                        gap: 2,
                                        p: 0,
                                    }}>
                                    {(() => {
                                        const demo = get(
                                            data,
                                            "metadata.metadata.demographicFrequency"
                                        );
                                        if (demo) {
                                            const ethnicityRows =
                                                (demo.ethnicity ?? [])
                                                    .filter(
                                                        (x: any) =>
                                                            x &&
                                                            typeof x.bin ===
                                                                "string" &&
                                                            typeof x.count ===
                                                                "number"
                                                    )
                                                    .map((x: any) => ({
                                                        label: x.bin,
                                                        count: x.count,
                                                    }))
                                                    .sort(
                                                        (a: DistributionRow, b: DistributionRow) =>
                                                            b.count - a.count
                                                    );

                                            const ageRows =
                                                (demo.age ?? [])
                                                    .filter(
                                                        (x: any) =>
                                                            x &&
                                                            typeof x.bin ===
                                                                "string" &&
                                                            typeof x.count ===
                                                                "number"
                                                    )
                                                    .map((x: any) => ({
                                                        label: x.bin,
                                                        count: x.count,
                                                    }))
                                                    .sort(
                                                        (a: DistributionRow, b: DistributionRow) =>
                                                            b.count - a.count
                                                    );

                                            const hasRows =
                                                ethnicityRows.length > 0 ||
                                                ageRows.length > 0;
                                            renderedCount = 1;

                                            if (!hasRows) {
                                                return (
                                                    <>
                                                        {renderDistribution({
                                                            title: "Ethnicity Distribution",
                                                            rows: HARD_CODED_ETHNICITY_ROWS,
                                                        })}
                                                    </>
                                                );
                                            }

                                            return (
                                                <>
                                                    {renderDistribution({
                                                        title: "Ethnicity Distribution",
                                                        rows: ethnicityRows,
                                                    })}
                                                    {renderDistribution({
                                                        title: "Age Distribution",
                                                        rows: ageRows,
                                                    })}
                                                </>
                                            );
                                        }
                                        renderedCount = 1;
                                        return (
                                            <>
                                                {renderDistribution({
                                                    title: "Ethnicity Distribution",
                                                    rows: HARD_CODED_ETHNICITY_ROWS,
                                                })}
                                            </>
                                        );
                                    })()}
                                </Box>
                            ) : section.sectionName === "Omics" ? (
                                (() => {
                                    renderedCount = 1;
                                    const rows = [
                                        {
                                            assay: "Whole Exome Sequencing",
                                            platform: "Illumina NovaSeq 6000",
                                        },
                                    ];

                                    return (
                                        <Box sx={{ p: 0, mt: 2 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    p: 2.5,
                                                    borderColor:
                                                        "rgba(0,0,0,0.06)",
                                                    boxShadow:
                                                        "0 10px 24px rgba(0,0,0,0.05)",
                                                    bgcolor: "white",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 22,
                                                        fontWeight: 900,
                                                        mb: 2,
                                                    }}
                                                >
                                                    Omics Data
                                                </Typography>

                                                <BoxContainer
                                                    sx={{
                                                        p: 0,
                                                        gridTemplateColumns: {
                                                            mobile: "1fr",
                                                            tablet:
                                                                "repeat(2, 1fr)",
                                                        },
                                                        gap: 3,
                                                    }}
                                                >
                                                    <Box sx={{ p: 0 }}>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                fontWeight: 800,
                                                                letterSpacing:
                                                                    "0.12em",
                                                                textTransform:
                                                                    "uppercase",
                                                                color: "text.secondary",
                                                                mb: 0.75,
                                                            }}
                                                        >
                                                            Assay
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 16,
                                                                fontWeight: 800,
                                                                color: "text.primary",
                                                            }}
                                                        >
                                                            {rows[0].assay}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ p: 0 }}>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                fontWeight: 800,
                                                                letterSpacing:
                                                                    "0.12em",
                                                                textTransform:
                                                                    "uppercase",
                                                                color: "text.secondary",
                                                                mb: 0.75,
                                                            }}
                                                        >
                                                            Platform
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 16,
                                                                fontWeight: 800,
                                                                color: "text.primary",
                                                            }}
                                                        >
                                                            {rows[0].platform}
                                                        </Typography>
                                                    </Box>
                                                </BoxContainer>
                                            </Paper>
                                        </Box>
                                    );
                                })()
                            ) : section.sectionName ===
                              "Structural Metadata" ? (
                                (() => {
                                    renderedCount = 1;
                                    const metadataTables = get(
                                        data,
                                        "metadata.metadata.structuralMetadata"
                                    ) as StructuralMetadataPublicSchema | undefined;

                                    const effective = metadataTables?.tables?.length
                                        ? metadataTables
                                        : structuralFallback;

                                    return (
                                        <Box sx={{ p: 0, mt: 2 }}>
                                            <StructuralMetadataInline
                                                metadata={effective}
                                                expandedNames={structuralExpanded}
                                                onExpandedNamesChange={
                                                    setStructuralExpanded
                                                }
                                                entriesLabel="520 complete entries"
                                            />
                                        </Box>
                                    );
                                })()
                            ) : section.sectionName === "Provenance" ? (
                                (() => {
                                    renderedCount = 1;

                                    const startDate =
                                        (get(
                                            data,
                                            "metadata.metadata.provenance.temporal.startDate"
                                        ) as string | undefined) || "2019-05-01";
                                    const endDate =
                                        (get(
                                            data,
                                            "metadata.metadata.provenance.temporal.endDate"
                                        ) as string | undefined) || "2024-05-01";

                                    const leadTime =
                                        (get(
                                            data,
                                            "metadata.metadata.accessibility.access.deliveryLeadTime"
                                        ) as string | undefined) || "";
                                    const parsed = parseLeadTime(leadTime);
                                    const timeLag = parsed
                                        ? `${parsed[0]} ${parsed[1]}`
                                        : "6 months";

                                    const publishingFrequency =
                                        (get(
                                            data,
                                            "metadata.metadata.coverage.publishingFrequency"
                                        ) as string | undefined) || "Annual";

                                    return (
                                        <Box sx={{ p: 0, mt: 2 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    p: 2.5,
                                                    borderColor:
                                                        "rgba(0,0,0,0.06)",
                                                    boxShadow:
                                                        "0 10px 24px rgba(0,0,0,0.05)",
                                                    bgcolor: "white",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 22,
                                                        fontWeight: 900,
                                                        mb: 2,
                                                    }}
                                                >
                                                    Provenance & Timelines
                                                </Typography>

                                                <BoxContainer
                                                    sx={{
                                                        p: 0,
                                                        gridTemplateColumns: {
                                                            mobile: "1fr",
                                                            tablet:
                                                                "repeat(4, 1fr)",
                                                        },
                                                        gap: 3,
                                                    }}
                                                >
                                                    {[
                                                        {
                                                            label: "Publishing Frequency",
                                                            value: publishingFrequency,
                                                        },
                                                        {
                                                            label: "Start Date",
                                                            value: startDate,
                                                        },
                                                        {
                                                            label: "End Date",
                                                            value: endDate,
                                                        },
                                                        {
                                                            label: "Time Lag",
                                                            value: timeLag,
                                                        },
                                                    ].map(item => (
                                                        <Box
                                                            key={item.label}
                                                            sx={{ p: 0 }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 12,
                                                                    fontWeight: 800,
                                                                    letterSpacing:
                                                                        "0.12em",
                                                                    textTransform:
                                                                        "uppercase",
                                                                    color: "text.secondary",
                                                                    mb: 0.75,
                                                                }}
                                                            >
                                                                {item.label}
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 16,
                                                                    fontWeight: 800,
                                                                    color: "text.primary",
                                                                }}
                                                            >
                                                                {item.value}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </BoxContainer>
                                            </Paper>
                                        </Box>
                                    );
                                })()
                            ) : section.sectionName === "Enrichment & Linkage" ? (
                                (() => {
                                    renderedCount = 1;

                                    const derivedFrom = toStringList(
                                        get(
                                            data,
                                            "metadata.metadata.enrichmentAndLinkage.datasetLinkage.isDerivedFrom"
                                        )
                                    );

                                    const similarTo = toStringList(
                                        get(
                                            data,
                                            "metadata.metadata.enrichmentAndLinkage.datasetLinkage.linkedDatasets"
                                        )
                                    );

                                    const investigations = toStringList(
                                        get(
                                            data,
                                            "metadata.metadata.enrichmentAndLinkage.investigations"
                                        )
                                    );

                                    const tools = toStringList(
                                        get(
                                            data,
                                            "metadata.metadata.enrichmentAndLinkage.tools"
                                        )
                                    );

                                    const publicationUsingDataset = toStringList(
                                        get(
                                            data,
                                            "metadata.metadata.enrichmentAndLinkage.isReferenceIn"
                                        )
                                    );

                                    // Temporary hardcoded fallbacks (remove once API is ready)
                                    const hardDerivedFrom = [
                                        "National Hepatobiliary Cancer Registry [NHCR-04]",
                                        "Regional Hepatobiliary Cancer Registry [RHCR-14]",
                                    ];
                                    const hardPubUsing = [
                                        "10.1016/j.jhep.2023.05.011",
                                    ];
                                    const hardPubAbout = [
                                        "10.1016/j.jhep.2023.05.012",
                                    ];
                                    const hardTools = [
                                        "https://github.com/topics/cholangiocarcinoma-models",
                                    ];
                                    const hardInvestigations = ["BTCC-105-SubA"];
                                    const hardSimilar = [
                                        "Advanced HCC Organoid Cohort [AHCC-ORG]",
                                    ];

                                    const derivedFromItems =
                                        derivedFrom.length > 0
                                            ? derivedFrom
                                            : hardDerivedFrom;
                                    const pubUsingItems =
                                        publicationUsingDataset.length > 0
                                            ? publicationUsingDataset
                                            : hardPubUsing;

                                    // No reliable API path yet; keep hardcoded for now
                                    const pubAboutItems = hardPubAbout;

                                    const toolItems =
                                        tools.length > 0 ? tools : hardTools;
                                    const investigationItems =
                                        investigations.length > 0
                                            ? investigations
                                            : hardInvestigations;
                                    const similarItems =
                                        similarTo.length > 0
                                            ? similarTo
                                            : hardSimilar;

                                    return (
                                        <Box sx={{ p: 0, mt: 2 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    p: 2.5,
                                                    borderColor:
                                                        "rgba(0,0,0,0.06)",
                                                    boxShadow:
                                                        "0 10px 24px rgba(0,0,0,0.05)",
                                                    bgcolor: "white",
                                                }}
                                            >
                                                <BoxContainer
                                                    sx={{
                                                        p: 0,
                                                        gridTemplateColumns: {
                                                            mobile: "1fr",
                                                            tablet:
                                                                "repeat(2, 1fr)",
                                                        },
                                                        gap: 4,
                                                    }}
                                                >
                                                    {[
                                                        {
                                                            title: "Derived From",
                                                            items: derivedFromItems,
                                                        },
                                                        {
                                                            title: "Publication Using Dataset",
                                                            items: pubUsingItems,
                                                        },
                                                        {
                                                            title: "Publication About Dataset",
                                                            items: pubAboutItems,
                                                        },
                                                        {
                                                            title: "Tools",
                                                            items: toolItems,
                                                        },
                                                        {
                                                            title: "Investigations",
                                                            items: investigationItems,
                                                        },
                                                        {
                                                            title: "Similar To Datasets",
                                                            items: similarItems,
                                                        },
                                                    ].map(block => (
                                                        <Box
                                                            key={block.title}
                                                            sx={{ p: 0 }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 12,
                                                                    fontWeight: 800,
                                                                    letterSpacing:
                                                                        "0.12em",
                                                                    textTransform:
                                                                        "uppercase",
                                                                    color: "text.secondary",
                                                                    mb: 1,
                                                                }}
                                                            >
                                                                {block.title}
                                                            </Typography>
                                                            {renderBullets(
                                                                block.items
                                                            )}
                                                        </Box>
                                                    ))}
                                                </BoxContainer>
                                            </Paper>
                                        </Box>
                                    );
                                })()
                            ) : (
                                section.fields.map(field => {
                                    let value = get(data, field.path);

                                    if (
                                        !value ||
                                        value === -1 ||
                                        (Array.isArray(value) && !value.length)
                                    ) {
                                        return null;
                                    }

                                    if (field.path === DOI_NAME_PATH) {
                                        value = DOI_URL.concat(value);
                                    }

                                    if (!field.label) {
                                        renderedCount += 1;
                                        return (
                                            <Box
                                                sx={{
                                                    p: 0,
                                                    pb: 2,
                                                }}
                                                key={value}>
                                                {renderDatasetField(
                                                    field.type,
                                                    value
                                                )}
                                            </Box>
                                        );
                                    }

                                    renderedCount += 1;
                                    return (
                                        <BoxContainer
                                            sx={{
                                                gridTemplateColumns: {
                                                    desktop: "repeat(3, 1fr)",
                                                },
                                                gap: 1,
                                                "&:not(:last-of-type)": {
                                                    mb: 2,
                                                },
                                            }}
                                            key={field.label}>
                                            <Box
                                                sx={{
                                                    gridColumn: {
                                                        desktop: "span 1",
                                                    },
                                                    p: 0,
                                                }}>
                                                {field.tooltip ? (
                                                    <TooltipText
                                                        content={field.tooltip}
                                                        label={field.label}
                                                    />
                                                ) : (
                                                    field.label
                                                )}
                                            </Box>
                                            <Box
                                                sx={{
                                                    gridColumn: {
                                                        desktop: "span 2",
                                                    },
                                                    p: 0,
                                                    wordWrap: "break-word",
                                                }}>
                                                {renderDatasetField(
                                                    field.type,
                                                    value
                                                )}
                                            </Box>
                                        </BoxContainer>
                                    );
                                })
                            )}

                            {renderedCount === 0 && (
                                <Typography
                                    sx={{
                                        mt: 1,
                                        color: "text.secondary",
                                        fontStyle: "italic",
                                    }}>
                                    {t("notReported")}
                                </Typography>
                            )}
                        </Box>
                    </div>
                );
            })}
        </Paper>
    );
};

export default DatasetContent;
