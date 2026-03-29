import { Box, Divider, Link as MuiLink, Typography } from "@mui/material";
import Image from "next/image";
import Container from "@/components/Container";

const U =
    "https://uploads.codesandbox.io/uploads/user/user_MRFF7emEZNqyRP6JAfTik4";

/** Asset URLs from [ggznyl.csb.app](https://ggznyl.csb.app/) bundle. */
const IMG = {
    overview: `${U}/bReK-Snip1_Whole_Page.json.png`,
    gettingStarted: `${U}/nIuU-Snip+2+Whole+Page+-+Upload+Button+Highlighted.png`,
    existingDatasets: `${U}/hJlw-Snip+3+Whole+Page+-+Existing+Datasets+Highlighted.png`,
    dataVersion: `${U}/OfT6-Snip+4+Whole+Page+-+Data+Version+Highlighted.png`,
    projectInfo: `${U}/J_AR-Snip+5+Whole+Page+-+Project+Information+Highlighted.png`,
    summary: `${U}/I_sg-Snip+6+Whole+Page+-+Summary+Highlighted.png`,
    documentation: `${U}/HVJm-New_Doc.png`,
    datasetFilters: `${U}/k62C-Snip+8+Whole+Page+-+Data+Filters+Highlighted.png`,
    structuralMetadata: `${U}/uHBd-New_SM.png`,
    erd: `${U}/FBx_-New_ERD.png`,
    coverage: `${U}/-0SF-New_COV.png`,
    datasetTimelines: `${U}/PZu7-New_DT.png`,
    accessibility: `${U}/HNwa-New_Acc.png`,
    toolsPublications: `${U}/ljLH-New_Tools.png`,
    observations: `${U}/2TfY-New_Obs.png`,
    demographicFrequency: `${U}/KIWW-New_DFreq.png`,
    omics: `${U}/ROYX-New_Omics.png`,
} as const;

function DocImage({ src, alt }: { src: string; alt: string }) {
    return (
        <Box sx={{ my: 2.5, position: "relative", width: "100%", maxWidth: 800 }}>
            <Image
                src={src}
                alt={alt}
                width={800}
                height={480}
                sizes="(max-width: 900px) 100vw, 800px"
                style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 12,
                    display: "block",
                }}
            />
        </Box>
    );
}

function Rule({ thick }: { thick?: boolean }) {
    return (
        <Box
            sx={{
                height: thick ? 2 : 1,
                bgcolor: "#333",
                my: thick ? 2.5 : 0.75,
            }}
        />
    );
}

function MoreLink({ href }: { href: string }) {
    return (
        <Typography component="p" sx={{ mb: 2 }}>
            To know more about this step, please{" "}
            <MuiLink href={href} target="_blank" rel="noopener noreferrer" fontWeight={600}>
                click here
            </MuiLink>
            .
        </Typography>
    );
}

export default function UploadMetadataContent() {
    return (
        <Container
            sx={{
                background: "white",
                mt: "20px",
                pt: { mobile: 6, tablet: 8, desktop: 10 },
                pb: { mobile: 5, tablet: 6, desktop: 8 },
                px: { mobile: 2, tablet: 4 },
                color: "#1E2A4A",
                fontSize: 18,
                lineHeight: 1.7,
            }}>
            <Typography
                component="h1"
                align="center"
                sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: { mobile: 26, tablet: 30 },
                    mb: 2,
                }}>
                Managing Dataset Metadata
            </Typography>
            <Divider
                sx={{
                    borderColor: "grey.900",
                    borderBottomWidth: 1,
                    maxWidth: 1000,
                    mx: "auto",
                    mb: 3,
                }}
            />

            <Box sx={{ maxWidth: 800, mx: "auto" }}>
                <Typography component="p" sx={{ fontWeight: 700, mb: 1 }}>
                    Overview
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    This page is to help you enter your cancer research metadata onto the CRUK
                    datahub, in a way that helps others find and potentially access the data. You
                    can either enter the information manually or – if you have done this before –
                    you can upload a modified json file, and use the page to check that all is as
                    you want it. The CRUK datahub is fully compatible with HDRUK&apos;s health data
                    gateway portal. Once you&apos;ve entered the information here you do not need to
                    re-enter the information on their portal.
                </Typography>

                <DocImage src={IMG.overview} alt="Dataset metadata overview and progress" />

                <Typography component="p" sx={{ mb: 2 }}>
                    Metadata completion progress is tracked throughout, helping you understand which
                    sections are required, which are optional, and where further action is needed
                    before a dataset can be made active.
                </Typography>

                <Rule thick />

                <Typography component="h2" variant="h2" sx={{ fontSize: 22, mb: 1, mt: 2 }}>
                    Before you start
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    You will need the following information.
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    <strong>Grant Documentation:</strong> CRUK grant number (and optionally a list
                    of any other funding bodies).
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    <strong>Dataset Basics:</strong> Information describing your dataset, including a
                    unique title, a concise abstract (up to 255 characters), and longer description of
                    the dataset. This is an opportunity to include high quality information about the
                    technical standards and methods used. If you have a website for your project or
                    dataset you will able to link it.
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    <strong>Technical Specs:</strong> ICD-O descriptors for the cancers covered by
                    the dataset are required. There is a search bar to help you find the right terms.
                    These will automatically be translated into TCGA and CRUK cancer terms. It is
                    also helpful to have a list of the data formats (CSV, DICOM, etc.) and
                    terminologies (ICD-10, SNOMED CT) used.
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    <strong>Structural Assets:</strong> We ask for descriptions of the tables and the
                    columns within, so that researchers can easily find out whether you have the
                    information they need without needing to put in an enquiry. In order to give an
                    idea of the completeness of the dataset we also ask you to include for each table
                    how many complete rows there are. Please make descriptions understandable. And, if
                    you have a complex relational database it is helpful to include an Entity
                    Relationship Diagram image file (PNG/JPG/SVG &lt; 5MB) to show how the different
                    tables link together.
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    <strong>Demographics:</strong> Summarized counts for Age and Ethnicity.
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    <strong>Observations:</strong> If you have summary statistics about your dataset
                    (like 5500 Matched tumour-normal samples) it is an excellent way to show your
                    dataset to its best advantage.
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    <strong>Contacts:</strong> You will need the name of your Data Custodian
                    organisation and a functional email for data access requests.
                </Typography>

                <Typography component="h2" variant="h2" sx={{ fontSize: 22, mb: 1, mt: 2 }}>
                    Navigation &amp; Workflow
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    <strong>Sidebar:</strong> Use status icons to track progress (Red &quot;X&quot;
                    for missing mandatory fields; Amber &quot;!&quot; for missing optional fields).
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    <strong>Dataset Filters:</strong> Tag your data with at least one Topography,
                    Histology, Data Type, and Access Type. Access to data normally changes as a project
                    and resulting datasets mature.
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    <strong>Auto-Expansion:</strong> In those fields where you can add more than one
                    entry typing in the last row automatically creates a new row.
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    <strong>Privacy:</strong> Apply standard low-number suppression in Demographic
                    and Observation sections.
                </Typography>

                <Rule thick />

                <Typography component="p" sx={{ fontWeight: 700, mb: 1 }}>
                    Getting Started
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    You may begin by completing metadata manually or by uploading an existing metadata
                    file in JSON format. Uploading a JSON file is recommended if you have previously
                    created metadata or are reusing information from an existing dataset, as it can
                    save time and improve consistency.
                </Typography>

                <DocImage src={IMG.gettingStarted} alt="Getting started with metadata upload" />

                <Typography component="p" sx={{ mb: 2 }}>
                    For existing datasets, you can select a dataset from the list provided to retrieve
                    current metadata. This allows you to review, update, download, or upload amendments
                    to the existing datasets.
                </Typography>

                <DocImage src={IMG.existingDatasets} alt="Selecting an existing dataset" />

                <Rule thick />

                <Typography component="p" sx={{ fontWeight: 700, mb: 1 }}>
                    Metadata Sections
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>Welcome and guidance information</li>
                    <li>Dataset version details</li>
                </Box>

                <DocImage src={IMG.dataVersion} alt="Dataset version details" />
                <MoreLink href="https://65nfmh.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>CRUK Project Information</li>
                </Box>
                <DocImage src={IMG.projectInfo} alt="CRUK project information" />
                <MoreLink href="https://ys6vjm.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>Summary</li>
                </Box>
                <DocImage src={IMG.summary} alt="Dataset summary section" />
                <MoreLink href="https://gmwdhp.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>Documentation</li>
                </Box>
                <DocImage src={IMG.documentation} alt="Documentation section" />
                <MoreLink href="https://rw78kx.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>Dataset Filters</li>
                </Box>
                <DocImage src={IMG.datasetFilters} alt="Dataset filters" />
                <MoreLink href="https://6js8w2.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>Structural Metadata</li>
                </Box>
                <DocImage src={IMG.structuralMetadata} alt="Structural metadata" />
                <MoreLink href="https://fn2hkj.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>Entity Relationship Diagram</li>
                </Box>
                <DocImage src={IMG.erd} alt="Entity relationship diagram" />
                <MoreLink href="https://8dclwd.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>Coverage</li>
                </Box>
                <DocImage src={IMG.coverage} alt="Coverage section" />
                <MoreLink href="https://3kkhvr.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>Dataset Timelines</li>
                </Box>
                <DocImage src={IMG.datasetTimelines} alt="Dataset timelines" />
                <MoreLink href="https://chs6lq.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>Accessibility</li>
                </Box>
                <DocImage src={IMG.accessibility} alt="Accessibility section" />
                <MoreLink href="https://9865c4.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>Tools and Publications</li>
                </Box>
                <DocImage src={IMG.toolsPublications} alt="Tools and publications" />
                <MoreLink href="https://lc4hvh.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>Observations</li>
                </Box>
                <DocImage src={IMG.observations} alt="Observations section" />
                <MoreLink href="https://yjzdhm.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>Demographic Frequency</li>
                </Box>
                <DocImage src={IMG.demographicFrequency} alt="Demographic frequency" />
                <MoreLink href="https://2jf8sv.csb.app/" />

                <Rule />

                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                    <li>Omics</li>
                </Box>
                <DocImage src={IMG.omics} alt="Omics section" />
                <MoreLink href="https://yjzdhm.csb.app/" />
            </Box>
        </Container>
    );
}
