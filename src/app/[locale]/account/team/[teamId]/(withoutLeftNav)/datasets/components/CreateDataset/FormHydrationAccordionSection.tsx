import { ReactNode } from "react";
import Accordion from "@/components/Accordion";
import Typography from "@/components/Typography";

interface FormHydrationAccordionSectionProps {
    title: string;
    children: ReactNode;
}

const FormHydrationAccordionSection = ({
    title,
    children,
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
        }}
    />
);

export default FormHydrationAccordionSection;
