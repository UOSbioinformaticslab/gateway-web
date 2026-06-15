import { ReactNode } from "react";
import { SxProps, Theme } from "@mui/material";
import Accordion from "@/components/Accordion";
import Typography from "@/components/Typography";

interface FormHydrationAccordionSectionProps {
    title: string;
    children: ReactNode;
    sx?: SxProps<Theme>;
}

const FormHydrationAccordionSection = ({
    title,
    children,
    sx,
}: FormHydrationAccordionSectionProps) => (
    <Accordion
        variant="plain"
        defaultExpanded
        heading={
            <Typography variant="h2" sx={{ fontSize: "1.25rem" }}>
                {title}
            </Typography>
        }
        contents={children}
        sx={{
            mb: 4,
            ".MuiAccordionDetails-root": { pb: 1 },
            ...sx,
        }}
    />
);

export default FormHydrationAccordionSection;
