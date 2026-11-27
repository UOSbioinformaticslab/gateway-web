import { Box, styled } from "@mui/material";
import Link from "@/components/Link";
import { colors } from "@/config/theme";

export const ToolCard = styled(Box)(({ theme }) => ({
    backgroundColor: colors.white,
    border: `1px solid ${colors.grey300}`,
    borderRadius: theme.spacing(1),
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
}));

export const ToolHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: colors.grey100,
    borderBottom: `1px solid ${colors.grey300}`,
}));

export const ToolName = styled(Link)(() => ({
    color: colors.purple500,
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.35,
    textDecoration: "none",
    "&:hover": {
        textDecoration: "underline",
    },
}));

export const ExternalLink = styled(Link)(({ theme }) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    borderRadius: 999,
    border: "1px solid #BFDBFE",
    backgroundColor: "#EFF6FF",
    color: colors.purple500,
    fontSize: 12,
    fontWeight: 600,
    padding: "2px 10px",
    textDecoration: "none",
    whiteSpace: "nowrap",
    "&:hover": {
        backgroundColor: "#DBEAFE",
        textDecoration: "underline",
    },
}));

export const LinkGroup = styled(Box)(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing(1.5),
}));

export const LinkLabel = styled("span")(() => ({
    color: colors.purple500,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
}));

export const NoneLinked = styled("span")(() => ({
    color: colors.grey500,
    fontSize: 12,
    fontStyle: "italic",
}));

export const ResourcePill = styled(Link)(() => ({
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 6,
    border: "1px solid #BFDBFE",
    backgroundColor: "#EFF6FF",
    color: colors.purple500,
    fontSize: 12,
    fontWeight: 600,
    padding: "2px 8px",
    textDecoration: "none",
    "&:hover": {
        backgroundColor: "#DBEAFE",
        textDecoration: "underline",
    },
}));

export const ResourcePillText = styled("span")(() => ({
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 6,
    border: "1px solid #BFDBFE",
    backgroundColor: "#EFF6FF",
    color: colors.purple500,
    fontSize: 12,
    fontWeight: 600,
    padding: "2px 8px",
}));

export const DescriptionRow = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
    color: colors.grey600,
    fontSize: 14,
    minWidth: 0,
}));

export const DescriptionLabel = styled("span")(() => ({
    flexShrink: 0,
    color: colors.purple500,
    fontWeight: 700,
}));

export const DescriptionText = styled("span")(() => ({
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
}));
