import { Box, styled } from "@mui/material";
import Link from "@/components/Link";
import { colors } from "@/config/theme";

export const PublicationCard = styled(Box)(({ theme }) => ({
    backgroundColor: colors.white,
    border: `1px solid ${colors.grey300}`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
}));

export const PublicationTitle = styled(Link)(() => ({
    display: "inline",
    color: colors.grey900,
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.35,
    textDecoration: "none",
    "&:hover": {
        color: colors.purple500,
    },
}));

export const MetaRow = styled(Box)(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    color: colors.grey600,
    fontSize: 14,
    lineHeight: 1.4,
}));

export const JournalName = styled("span")(() => ({
    color: colors.purple500,
    fontWeight: 600,
}));

export const DependencyBox = styled(Box)(({ theme }) => ({
    backgroundColor: colors.grey100,
    border: `1px solid ${colors.grey200}`,
    borderRadius: theme.spacing(0.75),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

export const SectionLabel = styled("p")(({ theme }) => ({
    margin: 0,
    marginBottom: theme.spacing(1),
    color: colors.grey600,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
}));

export const DependencyRow = styled(Box)(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing(1),
    "& + &": {
        marginTop: theme.spacing(1),
    },
}));

export const DependencyName = styled("span")(() => ({
    width: 80,
    color: colors.grey700,
    fontSize: 14,
    fontWeight: 600,
}));

export const NoneLinked = styled("span")(() => ({
    color: colors.grey500,
    fontSize: 12,
    fontStyle: "italic",
}));

const pillLink = {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 6,
    padding: "4px 10px",
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
    lineHeight: 1.3,
};

export const DatasetPill = styled(Link)(() => ({
    ...pillLink,
    backgroundColor: "#EFF6FF",
    color: "#1D4ED8",
    border: "1px solid #BFDBFE",
    "&:hover": {
        backgroundColor: "#DBEAFE",
    },
}));

export const DatasetPillText = styled("span")(() => ({
    ...pillLink,
    backgroundColor: "#EFF6FF",
    color: "#1D4ED8",
    border: "1px solid #BFDBFE",
}));

export const ProjectPill = styled(Link)(() => ({
    ...pillLink,
    backgroundColor: "#FAF5FF",
    color: "#7E22CE",
    border: "1px solid #E9D5FF",
    "&:hover": {
        backgroundColor: "#F3E8FF",
    },
}));

export const ProjectPillText = styled("span")(() => ({
    ...pillLink,
    backgroundColor: "#FAF5FF",
    color: "#7E22CE",
    border: "1px solid #E9D5FF",
}));

export const AbstractToggle = styled("button")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.75),
    margin: 0,
    marginBottom: theme.spacing(0.5),
    padding: 0,
    border: 0,
    background: "transparent",
    color: colors.grey800,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: "pointer",
    "&:hover": {
        color: colors.purple500,
    },
}));

export const AbstractPreview = styled("p")(({ theme }) => ({
    margin: 0,
    paddingLeft: theme.spacing(2),
    color: colors.grey600,
    fontSize: 14,
    lineHeight: 1.6,
}));

export const ReadMore = styled("button")(({ theme }) => ({
    marginLeft: theme.spacing(0.5),
    padding: 0,
    border: 0,
    background: "transparent",
    color: colors.purple500,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    "&:hover": {
        textDecoration: "underline",
    },
}));
