import { Box, Divider, Typography } from "@mui/material";
import Image from "next/image";
import Container from "@/components/Container";

const IMG = {
    keySearch: "/images/help/exploring-datahub/key-search.png",
    panelSearch: "/images/help/exploring-datahub/panel-search.png",
    sort: "/images/help/exploring-datahub/sort.png",
    syn: "/images/help/exploring-datahub/synopsis.png",
    autoFilter: "/images/help/exploring-datahub/auto-filter.png",
    manualFilters: "/images/help/exploring-datahub/manual-filters.png",
    resetFilters: "/images/help/exploring-datahub/reset-filters.png",
} as const;

function DocImage({ src, alt }: { src: string; alt: string }) {
    return (
        <Box sx={{ my: 2.5, position: "relative", width: "100%", maxWidth: 850 }}>
            <Image
                src={src}
                alt={alt}
                width={850}
                height={480}
                sizes="(max-width: 900px) 100vw, 850px"
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

function Rule() {
    return (
        <Box
            sx={{
                height: "1px",
                bgcolor: "#333",
                my: 0.75,
            }}
        />
    );
}

export default function ExploringDatahubContent() {
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
                Help – Study Search and Filters
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
                <Typography component="h2" variant="h2" sx={{ fontSize: 22, mb: 1, mt: 2 }}>
                    Overview
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    The Study Search page within the CRUK Data Hub enables users to discover and
                    explore research datasets funded by Cancer Research UK.
                </Typography>
                <Typography component="p" sx={{ mb: 1 }}>
                    Users can:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>Search for studies using keywords</li>
                    <li>Apply structured filters</li>
                    <li>Sort and refine results</li>
                    <li>Adjust filter logic for advanced searches</li>
                    <li>Review study summaries and metadata</li>
                </Box>
                <Typography component="p" sx={{ mb: 2 }}>
                    This page is designed to support efficient and precise dataset discovery.
                </Typography>

                <Rule />

                <Typography component="h2" variant="h2" sx={{ fontSize: 22, mb: 1, mt: 2 }}>
                    Study Search
                </Typography>
                <Typography component="h3" variant="h3" sx={{ fontSize: 19, mb: 1, mt: 1 }}>
                    Searching for Studies
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    The search bar allows users to locate studies using keywords. Results update
                    based on matching study titles, metadata, or descriptive content.
                </Typography>
                <DocImage src={IMG.keySearch} alt="Keyword search in the study search bar" />
                <Typography component="p" sx={{ mb: 2 }}>
                    The total number of matching studies is displayed.
                </Typography>

                <Rule />

                <Typography component="h3" variant="h3" sx={{ fontSize: 19, mb: 1, mt: 1 }}>
                    Study Results Table
                </Typography>
                <Typography component="p" sx={{ mb: 1 }}>
                    Search results are presented in a structured table including key information
                    such as:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>Study title</li>
                    <li>Lead researcher</li>
                    <li>Population size</li>
                    <li>Accessibility status</li>
                    <li>Earliest data date</li>
                    <li>Study start date</li>
                    <li>Last updated date</li>
                </Box>
                <DocImage
                    src={IMG.panelSearch}
                    alt="Study results table with columns and summaries"
                />
                <Typography component="p" sx={{ mb: 2 }}>
                    Users can sort results using available column sorting options.
                </Typography>

                <Rule />

                <Typography component="h3" variant="h3" sx={{ fontSize: 19, mb: 1, mt: 1 }}>
                    Sorting Results
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    Results can be reordered by selecting a sorting option. This allows users to
                    prioritise recently updated studies or organise studies by other available
                    metadata fields.
                </Typography>
                <DocImage src={IMG.sort} alt="Sorting options for study search results" />

                <Rule />

                <Typography component="h3" variant="h3" sx={{ fontSize: 19, mb: 1, mt: 1 }}>
                    Study Synopses
                </Typography>
                <Typography component="p" sx={{ mb: 1 }}>
                    Each study includes a synopsis summarising:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>Research focus</li>
                    <li>Dataset scope</li>
                    <li>Cohort characteristics</li>
                    <li>Data collection timeline</li>
                </Box>
                <DocImage src={IMG.syn} alt="Expanded study synopsis" />
                <Typography component="p" sx={{ mb: 2 }}>
                    Users may expand or collapse synopses to manage screen space.
                </Typography>

                <Rule />

                <Typography component="h2" variant="h2" sx={{ fontSize: 22, mb: 1, mt: 2 }}>
                    Study Filters
                </Typography>
                <Typography component="h3" variant="h3" sx={{ fontSize: 19, mb: 1, mt: 1 }}>
                    Filter Categories
                </Typography>
                <Typography component="p" sx={{ mb: 1 }}>
                    The Study Filters panel enables users to refine results using structured
                    categories, including:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>Cancer Type</li>
                    <li>Data Type</li>
                    <li>Accessibility</li>
                </Box>
                <Typography component="p" sx={{ mb: 2 }}>
                    Selected filters immediately narrow the results displayed.
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    The number of active filters and matching studies is clearly indicated.
                </Typography>

                <Rule />

                <Typography component="h3" variant="h3" sx={{ fontSize: 19, mb: 1, mt: 1 }}>
                    Active Filters
                </Typography>
                <Typography component="p" sx={{ mb: 1 }}>
                    Applied filters are listed under their respective categories. Users can:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>Remove individual filters</li>
                    <li>Clear all filters</li>
                    <li>Review currently applied constraints</li>
                </Box>
                <Typography component="p" sx={{ mb: 2 }}>
                    Search results update automatically when filters are adjusted.
                </Typography>

                <Rule />

                <Typography component="h3" variant="h3" sx={{ fontSize: 19, mb: 1, mt: 1 }}>
                    Filter Logic
                </Typography>
                <Typography component="h4" variant="h4" sx={{ fontSize: 17, mb: 1, mt: 1 }}>
                    Automatic Logic
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    By default, the system applies automatic logical grouping to selected filters.
                    This determines how filters interact within and across categories.
                </Typography>
                <DocImage
                    src={IMG.autoFilter}
                    alt="Automatic filter logic in the study filters panel"
                />
                <Typography component="p" sx={{ mb: 2 }}>
                    Automatic logic is designed to provide predictable filtering behaviour without
                    requiring manual input.
                </Typography>

                <Typography component="h4" variant="h4" sx={{ fontSize: 17, mb: 1, mt: 1 }}>
                    Manual Filter Logic
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                    Users may manually edit filter logic to customise how selected filters are
                    combined.
                </Typography>
                <DocImage
                    src={IMG.manualFilters}
                    alt="Manual filter logic editing interface"
                />
                <Typography component="p" sx={{ mb: 1 }}>
                    When filter logic has been manually edited:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>A notification indicates the logic has been changed.</li>
                    <li>Additional filters cannot be added until the logic is reset.</li>
                </Box>
                <Typography component="p" sx={{ mb: 2 }}>
                    Manual logic editing is intended for advanced users who require more precise
                    control over filtering behaviour.
                </Typography>

                <Typography component="h4" variant="h4" sx={{ fontSize: 17, mb: 1, mt: 1 }}>
                    Reset to Auto Logic
                </Typography>
                <Typography component="p" sx={{ mb: 1 }}>
                    Selecting Reset to Auto Logic will:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>Restore default system filtering behaviour</li>
                    <li>Remove manual logic edits</li>
                    <li>Enable additional filters to be added</li>
                </Box>
                <DocImage
                    src={IMG.resetFilters}
                    alt="Reset to automatic filter logic control"
                />
                <Typography component="p" sx={{ mb: 2 }}>
                    This option should be used before modifying filter selections if manual edits
                    have been applied.
                </Typography>

                <Rule />

                <Typography component="h3" variant="h3" sx={{ fontSize: 19, mb: 1, mt: 1 }}>
                    Best Practice Guidance
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>Begin with keyword search to identify relevant studies.</li>
                    <li>
                        Use filters to narrow results by research area, dataset type, or
                        accessibility.
                    </li>
                    <li>Rely on automatic logic for standard searches.</li>
                    <li>Use manual logic only when advanced refinement is required.</li>
                    <li>
                        Reset logic before adding new filters if manual edits have been made.
                    </li>
                </Box>

                <Rule />

                <Typography component="h3" variant="h3" sx={{ fontSize: 19, mb: 1, mt: 1 }}>
                    Troubleshooting
                </Typography>
                <Typography component="p" sx={{ mb: 1 }}>
                    If:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>No studies are returned → Broaden search terms or adjust filters.</li>
                    <li>Results appear overly restricted → Review applied filters and logic.</li>
                    <li>Additional filters cannot be added → Reset filter logic.</li>
                </Box>
            </Box>
        </Container>
    );
}
