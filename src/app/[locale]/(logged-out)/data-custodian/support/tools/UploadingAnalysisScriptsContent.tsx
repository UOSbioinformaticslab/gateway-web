import { Box, Typography } from "@mui/material";

export default function UploadingAnalysisScriptsContent() {
    return (
        <Box
            sx={{
                maxWidth: 800,
                mx: "auto",
                textAlign: "left",
                color: "grey.900",
                lineHeight: 1.8,
                fontSize: 16,
            }}>
            <Typography component="p" sx={{ mb: 2 }}>
                Data Custodians and individual users can upload analysis scripts, software,
                pipelines, and other tools to support reproducible research.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Overview:</strong> Contributors are encouraged to use widely supported file
                formats (.py, .R, .ipynb, .sql), host code on version-controlled platforms (GitHub,
                GitLab, Bitbucket), provide documentation, use controlled vocabularies, and include
                clear comments and examples. These standards improve discoverability, reproducibility,
                and consistency.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Where to Manage:</strong> Individual users can access the Analysis Scripts
                &amp; Software section via their personal profile, whereas organisations and Data
                Custodian teams use the Team Management Dashboard. This ensures proper ownership and
                governance of resources.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Adding a New Entry:</strong> Select &quot;+ Add new&quot; and fill in metadata
                fields including Name, Category, Description, Results / Insights, Authors, and
                Programming Language / Framework. Controlled vocabularies standardize descriptions
                across the Hub.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Relating to Datasets:</strong> Link scripts or tools to Datasets using
                relationship types such as &quot;Supports analysis of&quot;, &quot;Generates derived
                data for&quot;, or &quot;Utility script for&quot;. Team-wide applicability can also
                be indicated.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Adding Related Resources:</strong> Link Publications or Data Uses / Research
                Projects using &quot;+ Add resource&quot; to show contributions across research
                outputs. Resources can be removed if needed.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Saving, Publishing, and Visibility:</strong> Resources can be saved as draft
                (visible only to owner/team) or published (discoverable via search, filters, dataset
                pages, and profile pages).
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Editing, Archiving, and Version Control:</strong> Use the edit icon to update
                entries and archive icon to retire them. For transparency, host code on
                version-controlled platforms, tag releases, and describe revisions in Description or
                Results / Insights fields.
            </Typography>
        </Box>
    );
}
