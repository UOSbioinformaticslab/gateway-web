import { Box, Typography } from "@mui/material";

export default function CohortDiscoverySupportContent() {
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
            <Typography component="p" sx={{ mb: 2, fontWeight: 400, color: "grey.900" }}>
                Find suitable cohorts for your research using advanced search tools.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>P1:</strong> P1
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>P2:</strong> P2
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
                <strong>P3:</strong> P3
            </Typography>
        </Box>
    );
}
