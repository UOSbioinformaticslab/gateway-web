import { Box, Stack, TableContainer, Tooltip, Typography } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { KeyedMutator } from "swr";
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
import ActionDropdown from "../ActionDropdown";
import { getDateRange, getPopulationSize } from "@/utils/search";
import { formatTextDelimiter } from "@/utils/dataset";

const ICON_OPTS = [
    { url: "/images/icons/animal.webp", label: "Model Organism Study" },
    { url: "/images/icons/background.webp", label: "Background Information" },
    { url: "/images/icons/biobank.webp", label: "Samples Available" },
    { url: "/images/icons/invitro.webp", label: "In Vitro Study" },
    { url: "/images/icons/lab_results.webp", label: "Lab Results" },
    { url: "/images/icons/longitudinal.webp", label: "Longitudinal Study" },
    { url: "/images/icons/medical_imaging.webp", label: "Medical Imaging" },
    { url: "/images/icons/omics.webp", label: "Omics" },
    { url: "/images/icons/population.webp", label: "Patient Study" },
    { url: "/images/icons/treatments.webp", label: "Treatments" },
];

function pickTitleBandIcons(row: SearchResultDataset) {
    const id = Number(row._id) || 0;
    const first = ICON_OPTS[id % ICON_OPTS.length];
    const second = ICON_OPTS[(id + 4) % ICON_OPTS.length];
    if (first.url === second.url) {
        return [first];
    }
    return [first, second];
}

function TitleBandStudyIcons({ row }: { row: SearchResultDataset }) {
    const icons = pickTitleBandIcons(row);
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
const CONFORMS_TO_PATH = "metadata.accessibility.formatAndStandards.conformsTo";
const PUBLISHER_NAME_PATH = "metadata.summary.publisher.name";
const PUBLISHERS_ID = "metadata.summary.publisher.gatewayId";
const ACCESS_SERVICE_PATH =
    "metadata.accessibility.access.accessServiceCategory";
const columnHelper = createColumnHelper<SearchResultDataset>();

const getColumns = ({
    translations,
    showLibraryModal,
    mutateLibraries,
    isCohortDiscoveryDisabled,
    cohortDiscovery,
}: {
    translations: { [id: string]: string };
    libraryData?: Library[];
    showLibraryModal: (props: { datasetId: number }) => void;
    mutateLibraries: KeyedMutator<Library[] | undefined>;
    isCohortDiscoveryDisabled: boolean;
    cohortDiscovery: PageTemplatePromo;
}) => [
    columnHelper.display({
        id: "title",
        cell: ({ row: { original } }) => {
            const { _id: datasetId } = original;
            const linkHref = `/${RouteName.DATASET_ITEM}/${datasetId}`;

            return (
                <Link href={linkHref}>
                    <EllipsisLineLimit
                        text={get(original, "metadata.summary.title")}
                    />
                </Link>
            );
        },
        meta: { isPinned: true, hasPinnedBorder: true },
        header: () => <span>Lead Researcher</span>,
        minSize: 300,
        size: 400,
    }),
     columnHelper.display({
        id: "populationSize",
        cell: ({ row: { original } }) => (
            <div style={{ textAlign: "center" }}>
                {getPopulationSize(
                    original?.metadata,
                    translations.populationSizeNotReported
                )}
            </div>
        ),
        header: () => (
            <Tooltip
                describeChild
                title={translations.populationSizeTooltip}
                tabIndex={0}>
                <span>Pop. Size</span>
            </Tooltip>
        ),
        size: 120,
    }),

    columnHelper.display({
        id: "dataProvider",
        cell: ({ row: { original } }) => {
            const dataCustodianId = get(original, PUBLISHERS_ID);
            // if the below is false, its because the api has failed to find the team id based off the original uid for gatewayId
            const isNumber = !Number.isNaN(Number(dataCustodianId));
            const linkHref = `/${RouteName.DATA_CUSTODIANS_ITEM}/${dataCustodianId}`;

            return (
                <div style={{ textAlign: "center" }}>
                    {isNumber && (
                        <Link
                            href={linkHref}
                            onFocus={e => {
                                e.currentTarget.scrollIntoView({
                                    behavior: "smooth",
                                    inline: "center",
                                    block: "nearest",
                                });
                            }}>
                            <EllipsisLineLimit
                                text={String(get(original, PUBLISHER_NAME_PATH) ?? "")}
                            />
                        </Link>
                    )}
                    {!isNumber && (
                        <EllipsisLineLimit
                            text={String(get(original, PUBLISHER_NAME_PATH) ?? "")}
                        />
                    )}
                </div>
            );
        },
        header: () => <span>Accessibility</span>,
        size: 400,
    }),
    columnHelper.display({
        id: "dateRange",
        cell: info => (
            <div style={{ textAlign: "center" }}>
                {getDateRange(info.row.original?.metadata)}
            </div>
        ),
        header: () => <span>Earliest Data</span>,
        size: 120,
    }),
       columnHelper.display({
        id: "accessService",
        cell: ({ row: { original } }) => (
            <div style={{ textAlign: "center" }}>
                {get(original, ACCESS_SERVICE_PATH)}
            </div>
        ),
        header: () => <span>Start Date</span>,
        minSize: 100,
        size: 120,
    }),
      columnHelper.display({
        id: "conformsTo",
        cell: ({ row: { original } }) => (
            <div style={{ textAlign: "center" }}>
                {formatTextDelimiter(get(original, CONFORMS_TO_PATH))}
            </div>
        ),
        header: () => <span>Updated</span>,
        size: 180,
    }),

];

const RESULTS_TABLE_TRANSLATION_PATH = "pages.search.components.ResultsTable";
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
        metaDataLabel: t("title.label"),
        populationSizeLabel: t("populationSize.label"),
        populationSizeTooltip: t("populationSize.tooltip"),
        populationSizeNotReported: t("populationSize.notReported"),
        dateRangePublisherLabel: t("dateRangePublisher.label"),
        dateRangePublisherTooltip: t("dateRangePublisher.tooltip"),
        dataStandardLabel: t("dataStandard.label"),
        dataStandardTooltip: t("dataStandard.tooltip"),
        dataProviderLabel: t("dataProvider.label"),
        dataProviderTooltip: t("dataProvider.tooltip"),
        accessServiceLabel: t("accessService.label"),

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
                        const highlight = row.highlight;
                        const raw =
                            highlight?.abstract?.[0] ??
                            highlight?.description?.[0] ??
                            get(row, "metadata.summary.abstract");
                        if (
                            raw == null ||
                            String(raw).replace(/<[^>]*>/g, "").trim() === ""
                        ) {
                            return null;
                        }
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
                                <strong>Synopsis: </strong>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: String(raw),
                                    }}
                                />
                            </Typography>
                        );
                    }}
                    renderActionCell={row => (
                        <ActionDropdown
                            result={row}
                            libraryData={libraryData ?? []}
                            showLibraryModal={showLibraryModal}
                            mutateLibraries={mutateLibraries}
                            isCohortDiscoveryDisabled={isCohortDiscoveryDisabled}
                            cohortDiscovery={cohortDiscovery}
                        />
                    )}
                    renderTitleBandExtras={row => (
                        <TitleBandStudyIcons row={row} />
                    )}
                    columns={getColumns({
                        translations,
                        libraryData,
                        showLibraryModal,
                        mutateLibraries,
                        isCohortDiscoveryDisabled,
                        cohortDiscovery,
                    })}
                    rows={results}
                />
            </TableContainer>
        </Paper>
    );
};

export default ResultTable;
