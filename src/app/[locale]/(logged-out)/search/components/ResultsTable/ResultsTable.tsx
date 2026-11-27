import { Box, Stack, TableContainer, Tooltip, Typography } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { PageTemplatePromo } from "@/interfaces/Cms";
import { Library } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import Paper from "@/components/Paper";
import Table from "@/components/Table";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";
import {
    getAccessibility,
    getDatasetTableDataRange,
    getLeadResearcher,
    getNonCommercialUseOnly,
    getPopulationSize,
} from "@/utils/search";
import ActionDropdown from "../ActionDropdown";

const RESULTS_TABLE_TRANSLATION_PATH = "pages.search.components.ResultsTable";

const ICON_OPTS = [
    { url: "/images/icons/animal.webp", labelKey: "icons.modelOrganism" },
    { url: "/images/icons/background.webp", labelKey: "icons.background" },
    { url: "/images/icons/biobank.webp", labelKey: "icons.biobank" },
    { url: "/images/icons/invitro.webp", labelKey: "icons.inVitro" },
    { url: "/images/icons/lab_results.webp", labelKey: "icons.labResults" },
    { url: "/images/icons/longitudinal.webp", labelKey: "icons.longitudinal" },
    {
        url: "/images/icons/medical_imaging.webp",
        labelKey: "icons.medicalImaging",
    },
    { url: "/images/icons/omics.webp", labelKey: "icons.omics" },
    { url: "/images/icons/population.webp", labelKey: "icons.patientStudy" },
    { url: "/images/icons/treatments.webp", labelKey: "icons.treatments" },
];

function pickTitleBandIcons(
    row: SearchResultDataset,
    labelFor: (key: string) => string
) {
    const id = Number(row._id) || 0;
    const first = ICON_OPTS[id % ICON_OPTS.length];
    const second = ICON_OPTS[(id + 4) % ICON_OPTS.length];
    const withLabel = (option: (typeof ICON_OPTS)[number]) => ({
        url: option.url,
        label: labelFor(option.labelKey),
    });

    if (first.url === second.url) {
        return [withLabel(first)];
    }
    return [withLabel(first), withLabel(second)];
}

function TitleBandStudyIcons({ row }: { row: SearchResultDataset }) {
    const t = useTranslations(RESULTS_TABLE_TRANSLATION_PATH);
    const icons = pickTitleBandIcons(row, t);
    return (
        <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap>
            {icons.map(opt => (
                <Tooltip
                    key={`${row._id}-${opt.url}`}
                    title={opt.label}
                    arrow
                    placement="top"
                    enterDelay={200}>
                    <Box
                        component="span"
                        sx={{
                            display: "inline-flex",
                            lineHeight: 0,
                            cursor: "default",
                            verticalAlign: "middle",
                        }}>
                        <Box
                            component="img"
                            src={opt.url}
                            alt={opt.label}
                            sx={{
                                width: 28,
                                height: 28,
                                borderRadius: 0,
                                objectFit: "cover",
                                border: "2px solid rgba(209, 10, 111, 0.35)",
                                bgcolor: "#e8f4fc",
                                display: "block",
                            }}
                        />
                    </Box>
                </Tooltip>
            ))}
        </Stack>
    );
}

interface ResultTableProps {
    results: SearchResultDataset[];
    showLibraryModal: (props: { datasetId: number }) => void;
    cohortDiscovery: PageTemplatePromo;
    /** When false, synopsis rows under each result are hidden. */
    showSynopsis?: boolean;
}
const MissingValue = ({ label }: { label: string }) => (
    <span style={{ color: "grey" }}>{label}</span>
);

const columnHelper = createColumnHelper<SearchResultDataset>();

const getColumns = ({
    translations,
}: {
    translations: { [id: string]: string };
}) => [
    columnHelper.display({
        id: "title",
        cell: ({ row: { original } }) => {
            const leadResearcher = getLeadResearcher(original);

            return leadResearcher ? (
                <EllipsisLineLimit text={leadResearcher} />
            ) : (
                <MissingValue label={translations.notGiven} />
            );
        },
        meta: { isPinned: true, hasPinnedBorder: true },
        header: () => <span>{translations.leadResearcherLabel}</span>,
        minSize: 300,
        size: 400,
    }),
    columnHelper.display({
        id: "populationSize",
        cell: ({ row: { original } }) => {
            const populationSize = getPopulationSize(
                original,
                translations.notGiven
            );

            return (
                <div style={{ textAlign: "center" }}>
                    {populationSize === translations.notGiven ? (
                        <MissingValue label={translations.notGiven} />
                    ) : (
                        populationSize
                    )}
                </div>
            );
        },
        header: () => (
            <Tooltip
                describeChild
                title={translations.populationSizeTooltip}
                tabIndex={0}>
                <span>{translations.populationSizeLabel}</span>
            </Tooltip>
        ),
        size: 120,
    }),
    columnHelper.display({
        id: "dataProvider",
        cell: ({ row: { original } }) => {
            const accessibility = getAccessibility(original);

            return (
                <div style={{ textAlign: "center" }}>
                    {accessibility ? (
                        <EllipsisLineLimit text={accessibility} />
                    ) : (
                        <MissingValue label={translations.notGiven} />
                    )}
                </div>
            );
        },
        header: () => <span>{translations.accessibilityLabel}</span>,
        size: 220,
    }),
    columnHelper.display({
        id: "nonCommercialUseOnly",
        cell: ({ row: { original } }) => (
            <div style={{ textAlign: "center" }}>
                {getNonCommercialUseOnly(original)}
            </div>
        ),
        header: () => <span>{translations.nonCommercialUseOnlyLabel}</span>,
        size: 220,
    }),
    columnHelper.display({
        id: "dataRange",
        cell: ({ row: { original } }) => {
            const dataRange = getDatasetTableDataRange(original);

            return (
                <div style={{ textAlign: "center" }}>
                    {dataRange ?? (
                        <MissingValue label={translations.notGiven} />
                    )}
                </div>
            );
        },
        header: () => <span>{translations.dataRangeLabel}</span>,
        size: 140,
    }),
];

const ResultTable = ({
    results,
    showLibraryModal,
    cohortDiscovery,
    showSynopsis = true,
}: ResultTableProps) => {
    const t = useTranslations(RESULTS_TABLE_TRANSLATION_PATH);
    const { isLoggedIn, user } = useAuth();

    const { requestStatus } = useCohortStatus(user?.id);

    const { data: libraryData, mutate: mutateLibraries } = useGet<Library[]>(
        `${apis.librariesV1Url}?per_page=-1`,
        { shouldFetch: isLoggedIn }
    );

    const isCohortDiscoveryDisabled =
        isLoggedIn && requestStatus
            ? !["APPROVED", "REJECTED", "EXPIRED"].includes(requestStatus)
            : false;

    const translations = {
        notGiven: t("notGiven"),
        synopsis: t("synopsis"),
        leadResearcherLabel: t("leadResearcher.label"),
        populationSizeLabel: t("populationSize.shortLabel"),
        populationSizeTooltip: t("populationSize.tooltip"),
        accessibilityLabel: t("accessibility.label"),
        nonCommercialUseOnlyLabel: t("nonCommercialUseOnly.label"),
        dataRangeLabel: t("dataRange.label"),
        actionLabel: t("action.label"),
    };

    return (
        <Paper
            sx={{
                p: 0,
                width: "100%",
                bgcolor: "background.paper",
                border: "1px solid #AAB7C4",
                borderRadius: 2,
                mb: 4,
            }}>
            <TableContainer sx={{ width: "100%" }}>
                <Table<SearchResultDataset>
                    variant="searchResults"
                    pinHeader={true}
                    style={{ background: "background.paper", borderRadius: 2 }}
                    showSynopsis={showSynopsis}
                    renderSynopsis={row => {
                        const abstract = get(row, "metadata.summary.abstract");
                        const text =
                            typeof abstract === "string" ? abstract.trim() : "";

                        return (
                            <Typography
                                variant="body1"
                                component="div"
                                sx={{
                                    fontSize: "1.0625rem",
                                    color: "text.secondary",
                                    fontStyle: "italic",
                                    lineHeight: 1.5,
                                    "& strong": {
                                        fontWeight: 700,
                                        fontStyle: "italic",
                                    },
                                }}>
                                <strong>{translations.synopsis} </strong>
                                {text || (
                                    <MissingValue
                                        label={translations.notGiven}
                                    />
                                )}
                            </Typography>
                        );
                    }}
                    renderActionCell={row => (
                        <ActionDropdown
                            result={row}
                            libraryData={libraryData ?? []}
                            showLibraryModal={showLibraryModal}
                            mutateLibraries={mutateLibraries}
                            isCohortDiscoveryDisabled={
                                isCohortDiscoveryDisabled
                            }
                            cohortDiscovery={cohortDiscovery}
                        />
                    )}
                    renderTitleBandCell={row => {
                        const linkHref = `/${RouteName.DATASET_ITEM}/${row._id}`;
                        return (
                            <Link href={linkHref}>
                                <EllipsisLineLimit
                                    text={get(row, "metadata.summary.title")}
                                />
                            </Link>
                        );
                    }}
                    renderTitleBandExtras={row => (
                        <TitleBandStudyIcons row={row} />
                    )}
                    columns={getColumns({ translations })}
                    rows={results}
                />
            </TableContainer>
        </Paper>
    );
};

export default ResultTable;
