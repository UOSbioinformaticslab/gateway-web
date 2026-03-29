import { ReactNode } from "react";
import { Box, Divider, Typography } from "@mui/material";
import Container from "@/components/Container";

const FAQ_ITEMS: { q: string; body: ReactNode }[] = [
    {
        q: "1. How do I search for datasets relevant to my research?",
        body: (
            <Typography component="p" sx={{ mb: 2 }}>
                Researchers can use the Search studies bar to enter keywords related to study
                titles, disease areas, lead researchers, or dataset characteristics. Results can be
                refined further using filters for Cancer Type, Data Type, and Accessibility.
            </Typography>
        ),
    },
    {
        q: "2. What are Study Filters, and how do I use them?",
        body: (
            <Typography component="p" sx={{ mb: 2 }}>
                Study Filters allow you to narrow search results based on specific criteria. Filters
                include Cancer Type, Data Type, and Accessibility. Multiple filters can be applied at
                the same time, and active filters are displayed under their respective categories.
                Filters can be cleared or adjusted at any time.
            </Typography>
        ),
    },
    {
        q: "3. What is Filter Logic, and when should I adjust it?",
        body: (
            <Typography component="p" sx={{ mb: 2 }}>
                Filter Logic determines how multiple filters are combined. By default, automatic
                logic applies AND/OR relationships between filters. Advanced users can manually edit
                logic to create more precise queries. Manual edits must be reset before adding new
                filters.
            </Typography>
        ),
    },
    {
        q: "4. How can I sort search results?",
        body: (
            <Typography component="p" sx={{ mb: 2 }}>
                Search results can be sorted by columns such as Updated Date, Population Size, or
                Start Date. A small triangle icon next to column headers allows sorting in ascending
                or descending order. Sorting affects only the display order, not the data itself.
            </Typography>
        ),
    },
    {
        q: "5. How do I know if a dataset is accessible?",
        body: (
            <Typography component="p" sx={{ mb: 2 }}>
                The Accessibility filter and results table indicate whether a dataset is Open to
                applicants, Restricted, or requires special access conditions. Detailed access
                information is available in each dataset&apos;s metadata page.
            </Typography>
        ),
    },
    {
        q: "6. How do I view detailed metadata for a dataset?",
        body: (
            <Typography component="p" sx={{ mb: 2 }}>
                Click on a study title in the search results to open the dataset&apos;s full metadata
                page. This includes sections on Project Information, Summary, Documentation, Filters,
                Observations, Demographic Frequency, Omics, Coverage, Timelines, Accessibility, and
                Tools &amp; Publications.
            </Typography>
        ),
    },
    {
        q: "7. Can I submit or modify dataset metadata?",
        body: (
            <Typography component="p" sx={{ mb: 2 }}>
                Yes, registered Data Custodians can upload new datasets or update existing metadata.
                Metadata can be entered manually or via JSON upload. All fields are guided, and
                progress indicators show required and optional sections.
            </Typography>
        ),
    },
    {
        q: "8. What are the required metadata fields for uploading a dataset?",
        body: (
            <>
                <Typography component="p" sx={{ mb: 1 }}>
                    At minimum, you need to provide:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>Project title and grant information</li>
                    <li>Dataset title and abstract</li>
                    <li>Data Custodian information</li>
                    <li>Dataset population size</li>
                    <li>Accessibility and usage conditions</li>
                    <li>Required dataset filters (Cancer Type, Data Type, Access)</li>
                </Box>
                <Typography component="p" sx={{ mb: 2 }}>
                    Other sections like Observations, Tools, Omics, and Entity Relationship Diagrams
                    are optional but recommended for completeness.
                </Typography>
            </>
        ),
    },
    {
        q: "9. How do I indicate updates or new versions of a dataset?",
        body: (
            <Typography component="p" sx={{ mb: 2 }}>
                The Dataset Version field follows a Major.Minor.Patch format. Updates to the dataset
                metadata should increment the version number accordingly. Existing datasets can be
                selected for updates, edited manually, or amended via JSON upload.
            </Typography>
        ),
    },
    {
        q: "10. Who should I contact for help?",
        body: (
            <Typography component="p" sx={{ mb: 2 }}>
                For technical support, questions about search, filter logic, metadata entry, or
                dataset upload, contact the CRUK Data Hub support team via the Help section. Guidance
                and documentation are available throughout the platform.
            </Typography>
        ),
    },
    {
        q: "11. How do I find related datasets, tools, or publications?",
        body: (
            <>
                <Typography component="p" sx={{ mb: 1 }}>
                    The Tools and Publications section in each dataset metadata page lists:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>Derived datasets</li>
                    <li>Linked datasets</li>
                    <li>Similar datasets</li>
                    <li>Publications describing or using the dataset</li>
                    <li>Tools or models associated with the dataset</li>
                </Box>
                <Typography component="p" sx={{ mb: 2 }}>
                    This helps researchers explore complementary data and resources efficiently.
                </Typography>
            </>
        ),
    },
    {
        q: "12. How can I understand dataset coverage and observations?",
        body: (
            <>
                <Typography component="p" sx={{ mb: 1 }}>
                    Metadata pages include:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>
                        Coverage: Age ranges, cohort details, and completeness information
                    </li>
                    <li>
                        Observations: Data points over time, including population or events measured
                    </li>
                    <li>
                        Demographic frequency: Population statistics such as ethnicity breakdown
                    </li>
                    <li>Timelines: Temporal coverage and publishing frequency</li>
                </Box>
                <Typography component="p" sx={{ mb: 2 }}>
                    This helps assess dataset relevance before requesting access.
                </Typography>
            </>
        ),
    },
];

export default function ResearchersFaqContent() {
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
                    fontSize: { mobile: 24, tablet: 28 },
                    mb: 2,
                }}>
                Researchers&apos; FAQs – CRUK Data Hub
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

            <Box sx={{ maxWidth: 900, mx: "auto" }}>
                {FAQ_ITEMS.map(({ q, body }) => (
                    <Box key={q} sx={{ mb: 3 }}>
                        <Typography
                            component="h2"
                            variant="h3"
                            sx={{
                                fontSize: { mobile: 17, tablet: 19 },
                                fontWeight: 700,
                                color: "primary.main",
                                mb: 1,
                            }}>
                            {q}
                        </Typography>
                        {body}
                    </Box>
                ))}
            </Box>
        </Container>
    );
}
