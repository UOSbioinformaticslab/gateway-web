import { ReactNode } from "react";
import { SxProps, Theme } from "@mui/material";
import Box from "@/components/Box";
import Typography from "@/components/Typography";

interface FormHydrationStaticSectionProps {
    title: string;
    children: ReactNode;
    sx?: SxProps<Theme>;
}

const FormHydrationStaticSection = ({
    title,
    children,
    sx,
}: FormHydrationStaticSectionProps) => (
    <Box sx={sx}>
        <Typography
            variant="h2"
            sx={{ fontSize: "1.25rem", fontWeight: 700, mb: 2 }}>
            {title}
        </Typography>
        {children}
    </Box>
);

export default FormHydrationStaticSection;
