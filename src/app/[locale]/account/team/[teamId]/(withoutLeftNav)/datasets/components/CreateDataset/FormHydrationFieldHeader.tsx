import { Divider } from "@mui/material";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

interface FormHydrationFieldHeaderProps {
    title: string;
    description?: string | null;
}

const FormHydrationFieldHeader = ({
    title,
    description,
}: FormHydrationFieldHeaderProps) => {
    const subtitle = description?.trim();

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h2">{title}</Typography>
            {subtitle ? (
                <Typography sx={{ color: colors.grey600, mt: 0.5, mb: 2 }}>
                    {subtitle}
                </Typography>
            ) : (
                <Box sx={{ mb: 2 }} />
            )}
            <Divider sx={{ borderColor: colors.grey300 }} />
        </Box>
    );
};

export default FormHydrationFieldHeader;
