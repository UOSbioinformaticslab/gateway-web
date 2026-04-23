import { styled } from "@mui/material";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import theme from "@/config/theme";

export const PanelWrapper = styled(Box)(() => ({
    position: "sticky",
    top: 0,
    padding: 0,
    zIndex: theme.zIndex.appBar,
    backgroundColor: theme.palette.common.white,
}));

export const PanelHeading = styled(Typography)(({ theme }) => ({
    padding: `${theme.spacing(2.5)} ${theme.spacing(1.5)}`,
    borderBottom: `1px solid ${theme.palette.greyCustom.main}`,
    margin: `0 ${theme.spacing(1.5)}`,
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontSize: 14,
}));

export const PanelBody = styled(Box)(({ theme }) => ({
    padding: `${theme.spacing(2)} ${theme.spacing(1.5)}`,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
}));

export const SectionHeading = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    color: theme.palette.primary.main,
    fontSize: 16,
}));