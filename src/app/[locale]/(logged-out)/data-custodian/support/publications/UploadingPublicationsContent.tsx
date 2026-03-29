import { Box, Typography } from "@mui/material";

export default function UploadingPublicationsContent() {
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
                <strong>Overview:</strong> This page is designed for data custodians responsible for
                creating, reviewing, and maintaining dataset metadata within the CRUK Data Hub. It
                provides a structured workflow to ensure datasets are described consistently,
                accurately, and in line with CRUK data governance standards.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Manual Upload:</strong> When uploading manually, the system checks for
                duplicates by comparing DOI, title, and authors. You will be prompted to review
                potential duplicates before proceeding.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Managing Publications:</strong> Users can view, add, edit, or archive
                publications via their profile or Data Custodian Team Dashboard. Controlled
                vocabularies for publication type ensure consistent metadata.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Adding a New Publication:</strong> Use &quot;+ Add publication&quot;.
                Optionally, search by DOI for automatic metadata population. If DOI is missing,
                manually enter title, authors, type, publisher, year, abstract, and DOI/URL.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Dataset Relationship:</strong> Each publication must relate to at least one
                Dataset. Choose relationship type: &quot;About&quot; (describes dataset) or
                &quot;Using&quot; (uses dataset in analysis). This ensures correct visibility and
                search results.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Adding Related Resources:</strong> Link publications to existing resources
                (Data Uses / Research Projects, Analysis Scripts &amp; Software) to create connected
                metadata and improve discoverability.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Saving, Publishing, and Visibility:</strong> Save as draft (visible only to
                owner/team) or publish to make it public. Published items are discoverable via Hub
                search, filters, dataset pages, project pages, and profile pages.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Editing, Archiving, and Version Control:</strong> Edit using the pencil icon,
                archive with archive icon. Store updated versions as separate entries if
                substantially different. Use version-specific DOIs/URLs and clearly document major
                changes in the abstract.
            </Typography>
        </Box>
    );
}
