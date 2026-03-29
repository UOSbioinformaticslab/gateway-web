import { Box, Typography } from "@mui/material";

export default function DataUsesResearchProjectsContent() {
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
                The Cancer Data Hub Data Use Register improves transparency around how health data is
                used for research. It provides a best-practice model for openly sharing information
                about approved Data Uses—ensuring that the public, researchers and funders can
                clearly understand how health datasets are being accessed and for what purpose. This
                work is part of an ongoing project led by the UK Health Data Research Alliance to
                develop core standards for data-use registries, including consistent metadata, clear
                documentation and visible updates throughout the lifecycle of a research project.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Building trust in the use of health data for research:</strong> Transparency
                is achieved by showing which Datasets are being used, who is using them, the purpose
                of the research, and the expected benefits. The Register enables Data Custodians to
                openly display this information for each dataset listed on the Cancer Data Hub.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Structured Data Use summaries:</strong> Each Data Use entry contains a
                structured summary of the Research Project, including project aims, the datasets
                used, a high-level methodology description, public or scientific benefit,
                collaborators and funders. The Cancer Data Hub uses the term Data Use / Research
                Project to ensure the information is clear for both technical and non-technical
                audiences.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Searching the Data Use Register:</strong> Anyone can search the Cancer Data
                Hub Data Use Register to view all approved Data Uses. Users can filter and search
                using project title, summary, public benefit statement, technical summary, or
                keywords.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Filters:</strong> Filters appear on the left-hand side of the search results
                page. Multiple options may be selected, using AND logic across categories and OR
                logic within categories. Some filters use structured medical coding systems such as
                ICD-10, ICD-O, or SNOMED for hierarchical filtering.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Exploring Data Uses on Dataset pages:</strong> Within each Dataset&apos;s
                metadata page, users can view all Data Uses associated with that Dataset, helping
                researchers understand dataset usage, research gaps, and potential collaborators.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>Who uses the Data Use Register:</strong> Researchers, public audiences, and
                funders can explore data usage, avoid duplication, identify collaborators, see
                responsible use, and track research activity and impact.
            </Typography>
        </Box>
    );
}
