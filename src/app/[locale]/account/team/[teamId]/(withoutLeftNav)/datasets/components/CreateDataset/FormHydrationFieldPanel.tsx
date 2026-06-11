import { ReactNode } from "react";
import Box from "@/components/Box";
import { colors } from "@/config/theme";

interface FormHydrationFieldPanelProps {
    children: ReactNode;
}

const FormHydrationFieldPanel = ({ children }: FormHydrationFieldPanelProps) => (
    <Box
        sx={{
            border: `1px solid ${colors.grey300}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            p: 2,
            mb: 2,
            "&:last-child": { mb: 0 },
        }}>
        {children}
    </Box>
);

export default FormHydrationFieldPanel;
