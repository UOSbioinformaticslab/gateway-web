import { get, isEmpty, pick, some } from "lodash";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Dataset } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { DataStatus } from "@/consts/application";
import { getDataset } from "@/utils/api";
import { getCohortDiscovery } from "@/utils/cms";
import { getLatestVersion } from "@/utils/dataset";
import {
    formatTextDelimiter,
    parseLeadTime,
} from "@/utils/dataset";
import { extractNamesFromDataType } from "@/utils/extractNamesFromDataTypes";
import metaData from "@/utils/metadata";
import { colors } from "@/config/theme";
import ActionBar from "./components/ActionBar";
import DatasetContent from "./components/DatasetContent";
import GoogleRecommended from "./components/GoogleRecommended";
import { datasetFields } from "./config";
import DownloadJsonButton from "./components/DownloadJsonButton";
import FilterTags from "./components/FilterTags";
import DataAccessCard from "./components/DataAccessCard";

export const metadata = metaData({
    title: "Dataset",
    description: "",
});

const DATASET_STAT_PATHS = [
    "metadata.metadata.summary.populationSize",
    "metadata.metadata.provenance.temporal.startDate",
    "metadata.metadata.provenance.temporal.endDate",
    "metadata.metadata.coverage.materialType",
    "metadata.metadata.coverage.spatial",
    "metadata.metadata.accessibility.access.deliveryLeadTime",
];

const SCHEMA_NAME = process.env.NEXT_PUBLIC_SCHEMA_NAME || "HDRUK";
const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION || "4.0.0";

const FALLBACK_DETAILS = {
    title: "Cholangiocarcinoma Patient-Derived Xenograft and Organoid Cohort",
    publisher: "Biliary Tract Cancer Consortium",
    population: 520,
    ageRange: "35 - 85",
    access: "2-4 weeks",
    formats: "csv, pdf, dicom-rle",
} as const;

const getAgeRange = (age: unknown): string | null => {
    if (!Array.isArray(age) || age.length === 0) return null;

    const parsed = age
        .map(item => {
            const value = (item as { value?: string }).value;
            if (!value) return null;
            const match = String(value).match(/(\d+)/g);
            const nums = match?.map(n => Number.parseInt(n, 10)).filter(n => !Number.isNaN(n));
            if (!nums || nums.length === 0) return null;
            return { value: String(value), min: Math.min(...nums), max: Math.max(...nums) };
        })
        .filter(Boolean) as { value: string; min: number; max: number }[];

    if (parsed.length === 0) return null;

    const min = Math.min(...parsed.map(p => p.min));
    const max = Math.max(...parsed.map(p => p.max));

    return `${min} - ${max}`;
};

export default async function DatasetItemPage({
    params,
}: {
    params: Promise<{ datasetId: string }>;
}) {
    const { datasetId } = await params;

    const data = await getDataset(datasetId, SCHEMA_NAME, SCHEMA_VERSION, {
        suppressError: true,
    });

    // Note that the status check is only required under v1 - under v2, we can use
    // an endpoint that will not show the data if not active
    if (!data || data?.status !== DataStatus.ACTIVE) notFound();

    let googleRecommendedDataset: Dataset | undefined;

    try {
        googleRecommendedDataset = await getDataset(
            datasetId,
            "SchemaOrg",
            "GoogleRecommended",
            { suppressError: true }
        );
    } catch (_e) {
        // Intentionally left empty
    }

    const cohortDiscovery = data?.is_cohort_discovery
        ? await getCohortDiscovery()
        : null;

    const datasetVersion = data?.versions?.[0];

    const datasetStats = pick(datasetVersion, DATASET_STAT_PATHS);

    // The left navigation should be a fixed list (as per CRUK reference UI),
    // so we render all sections and show fallbacks for missing data.
    const populatedSections = datasetFields;

    const linkageCounts = {
        tools: data?.tools_count,
        publications: data?.publications_count,
        publications_about: data?.publications.filter(pub =>
            pub.dataset_versions.filter(
                version => version.link_type === "ABOUT"
            )
        ).length,
        publications_using: data?.publications.filter(pub =>
            pub.dataset_versions.filter(
                version => version.link_type === "USING"
            )
        ).length,
        durs: data?.durs_count,
        collections: data?.collections_count,
    };

    const activeLinkList = populatedSections.map(section => ({
        label: section.sectionName,
    }));

    const datasetWithName = {
        ...data,
        name: datasetVersion.metadata?.metadata?.summary?.title,
    };

    const metadata = datasetVersion?.metadata?.metadata;
    const publisherName = (() => {
        const publisher = metadata?.summary?.publisher as unknown;
        if (!publisher) return "";
        if (typeof publisher === "string") return publisher;
        if (typeof publisher === "object" && publisher !== null) {
            const publisherName = (publisher as { publisherName?: unknown })
                .publisherName;
            if (typeof publisherName === "string" && publisherName.trim()) {
                return publisherName;
            }
            const name = (publisher as { name?: unknown }).name;
            if (typeof name === "string" && name.trim()) return name;
        }
        return "";
    })();
    const formats = formatTextDelimiter(
        metadata?.accessibility?.formatAndStandards?.formats || ""
    );
    const population = metadata?.summary?.populationSize;
    const leadTime = parseLeadTime(
        metadata?.accessibility?.access?.deliveryLeadTime || ""
    )?.[0];
    const leadTimeUnit = parseLeadTime(
        metadata?.accessibility?.access?.deliveryLeadTime || ""
    )?.[1];
    const ageRange = getAgeRange(metadata?.demographicFrequency?.age);

    const titleText =
        datasetVersion.metadata?.metadata?.summary?.title ||
        FALLBACK_DETAILS.title;

    const publisherText = publisherName || FALLBACK_DETAILS.publisher;

    const populationText =
        typeof population === "number" ? population : FALLBACK_DETAILS.population;

    const accessText =
        leadTime
            ? `${leadTime}${leadTimeUnit ? ` ${leadTimeUnit}` : ""}`
            : FALLBACK_DETAILS.access;

    const formatsText = formats || FALLBACK_DETAILS.formats;

    return (
        <LayoutDataItemPage
            navigation={
                <ActiveListSidebar
                    items={activeLinkList}
                    footer={<DataAccessCard data={datasetVersion} />}
                />
            }
            body={
                <>
                    <ActionBar dataset={datasetWithName} />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                        {datasetStats && (
                            <Box sx={{ p: 0, gap: 2 }}>
                                <Box
                                    sx={{
                                        p: 0,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h1"
                                        sx={{
                                            pt: 0.5,
                                            pb: 0.5,
                                            maxWidth: 760,
                                            fontWeight: 900,
                                            lineHeight: 1.05,
                                        }}
                                    >
                                        {titleText}
                                    </Typography>

                                    <DownloadJsonButton
                                        filename={`dataset_${datasetId}.json`}
                                        data={metadata}
                                        buttonProps={{
                                            variant: "contained",
                                            sx: {
                                                bgcolor: colors.blue400,
                                                color: colors.white,
                                                borderRadius: 2,
                                                px: 2,
                                                py: 1,
                                                "&:hover": {
                                                    bgcolor: colors.blue500,
                                                },
                                            },
                                        }}
                                    />
                                </Box>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        color: colors.grey700,
                                        fontSize: 16,
                                    }}
                                >
                                    <span style={{ fontWeight: 800 }}>
                                        Publisher:
                                    </span>{" "}
                                    {publisherText}
                                </Typography>

                                <Box sx={{ p: 0, mt: 2 }}>
                                    <Box
                                        sx={{
                                            width: 76,
                                            height: 76,
                                            borderRadius: 2,
                                            border: `1px solid ${colors.grey200}`,
                                            backgroundColor: colors.white,
                                            boxShadow:
                                                "0 6px 16px rgba(0,0,0,0.08)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <a
                                            href="/images/dataset/medical_imaging.webp"
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        >
                                            <Image
                                                src="/images/dataset/medical_imaging.webp"
                                                alt="Imaging data"
                                                width={76}
                                                height={76}
                                                priority
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </a>
                                    </Box>
                                </Box>

                                <BoxContainer
                                    sx={{
                                        mt: 3,
                                        p: 0,
                                        gridTemplateColumns: {
                                            mobile: "repeat(2, 1fr)",
                                            tablet: "repeat(4, 1fr)",
                                        },
                                        gap: 2,
                                    }}>
                                    <Box
                                        sx={{
                                            p: 2.25,
                                            borderRadius: 2,
                                            bgcolor:
                                                "rgba(0, 70, 140, 0.06)",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontWeight: 800,
                                                letterSpacing: "0.12em",
                                                color: colors.grey600,
                                                textTransform: "uppercase",
                                                mb: 0.5,
                                            }}
                                        >
                                            Population
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: 22,
                                                fontWeight: 900,
                                                color: colors.grey900,
                                            }}
                                        >
                                            {typeof population === "number"
                                                ? populationText
                                                : populationText}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            p: 2.25,
                                            borderRadius: 2,
                                            bgcolor:
                                                "rgba(48, 164, 108, 0.08)",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontWeight: 800,
                                                letterSpacing: "0.12em",
                                                color: colors.grey600,
                                                textTransform: "uppercase",
                                                mb: 0.5,
                                            }}
                                        >
                                            Age Range
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: 22,
                                                fontWeight: 900,
                                                color: colors.grey900,
                                            }}
                                        >
                                            {ageRange ?? "-"}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            p: 2.25,
                                            borderRadius: 2,
                                            bgcolor:
                                                "rgba(147, 79, 199, 0.08)",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontWeight: 800,
                                                letterSpacing: "0.12em",
                                                color: colors.grey600,
                                                textTransform: "uppercase",
                                                mb: 0.5,
                                            }}
                                        >
                                            Access
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: 22,
                                                fontWeight: 900,
                                                color: colors.grey900,
                                            }}
                                        >
                                            {accessText}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            p: 2.25,
                                            borderRadius: 2,
                                            bgcolor:
                                                "rgba(226, 130, 57, 0.10)",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontWeight: 800,
                                                letterSpacing: "0.12em",
                                                color: colors.grey600,
                                                textTransform: "uppercase",
                                                mb: 0.5,
                                            }}
                                        >
                                            Formats
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: 18,
                                                fontWeight: 800,
                                                color: colors.grey900,
                                            }}
                                        >
                                            {formatsText || "-"}
                                        </Typography>
                                    </Box>
                                </BoxContainer>
                            </Box>
                        )}
                        <BoxContainer
                            sx={{
                                gridTemplateColumns: {
                                    tablet: "1fr",
                                },
                                gap: {
                                    mobile: 1,
                                    tablet: 1,
                                },
                                p: 0,
                            }}>
                            <Box
                                sx={{
                                    p: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    overflow: "hidden",
                                }}>
                                <DatasetContent
                                    data={datasetVersion}
                                    populatedSections={populatedSections}
                                />
                             </Box>
                            
                            <Box />
                        </BoxContainer>

                        {googleRecommendedDataset && (
                            <GoogleRecommended
                                metadata={getLatestVersion(
                                    googleRecommendedDataset
                                )}
                            />
                        )}
                    </Box>
                </>
            }
            panel={<FilterTags data={data} />}
        />
    );
}
