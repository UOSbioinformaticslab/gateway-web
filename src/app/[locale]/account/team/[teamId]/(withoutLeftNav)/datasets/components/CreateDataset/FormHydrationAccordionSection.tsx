import { ReactNode } from "react";
import { SxProps, Theme } from "@mui/material";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

interface FormHydrationAccordionSectionProps {
    title: string;
    description?: string | null;
    children: ReactNode;
    sx?: SxProps<Theme>;
}

const FormHydrationAccordionSection = ({
    title,
    description,
    children,
    sx,
}: FormHydrationAccordionSectionProps) => {
    const subtitle = description?.trim();

    return (
        <Accordion
            variant="plain"
            defaultExpanded
            heading={
                <Box sx={{ pr: 1 }}>
                    <Typography variant="h2" sx={{ fontSize: "1.25rem" }}>
                        {title}
                    </Typography>
                    {subtitle ? (
                        <Typography
                            sx={{
                                color: colors.grey600,
                                fontWeight: 400,
                                fontSize: "1rem",
                                mt: 0.5,
                            }}>
                            {subtitle}
                        </Typography>
                    ) : null}
                </Box>
            }
            contents={children}
            sx={{
                mb: 4,
                ".MuiAccordionDetails-root": { pb: 1 },
                ...sx,
            }}
        />
    );
};

export default FormHydrationAccordionSection;
