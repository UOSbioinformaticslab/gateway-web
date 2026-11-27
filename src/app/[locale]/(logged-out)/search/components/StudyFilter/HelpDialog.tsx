"use client";

import { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslations } from "next-intl";
import {
    FILTER_COLORS,
    MIN_SEARCH_LENGTH,
    TRANSLATION_PATH,
} from "./constants";

const strong = (chunks: ReactNode) => <strong>{chunks}</strong>;

const HelpDialog = ({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const theme = useTheme();
    const isNarrow = useMediaQuery(theme.breakpoints.down("tablet"));
    const dialogWidth = isNarrow ? "min(92vw, calc(100vw - 32px))" : "42vw";

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            scroll="paper"
            aria-labelledby="study-filter-help-title"
            PaperProps={{
                style: {
                    width: dialogWidth,
                    maxWidth: dialogWidth,
                },
                sx: {
                    borderRadius: "10px",
                    boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.14)",
                    m: 2,
                    height: "85vh",
                    maxHeight: "85vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    boxSizing: "border-box",
                },
            }}>
            <DialogTitle
                id="study-filter-help-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexShrink: 0,
                    py: 2.5,
                    px: 3,
                    pr: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    lineHeight: 1.3,
                    color: FILTER_COLORS.blue,
                }}>
                {t("helpDialog.title")}
                <IconButton
                    type="button"
                    aria-label={t("helpDialog.close")}
                    onClick={onClose}
                    edge="end"
                    size="medium"
                    sx={{ color: "text.secondary" }}>
                    <CloseIcon fontSize="medium" />
                </IconButton>
            </DialogTitle>
            <DialogContent
                sx={{
                    flex: 1,
                    minHeight: 0,
                    px: { xs: 2.5, sm: 3 },
                    py: 3,
                    overflowY: "auto",
                    "& .MuiTypography-body1": {
                        fontSize: "1.125rem",
                        lineHeight: 1.75,
                    },
                    "& .MuiTypography-subtitle1": {
                        fontSize: "1.25rem",
                        lineHeight: 1.35,
                    },
                }}>
                <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.75, color: "text.primary", mb: 0 }}>
                    {t("helpDialog.intro")}
                </Typography>
                <Typography
                    component="h3"
                    variant="subtitle1"
                    sx={{
                        fontWeight: 700,
                        color: FILTER_COLORS.pink,
                        mt: 3,
                        mb: 1,
                    }}>
                    {t("helpDialog.selectingTitle")}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.75, color: "text.primary" }}>
                    {t.rich("helpDialog.selectingBody", {
                        strong,
                        cancer: t("categories.cancer"),
                        data: t("categories.data"),
                        access: t("categories.access"),
                    })}
                </Typography>
                <Typography
                    component="h3"
                    variant="subtitle1"
                    sx={{
                        fontWeight: 700,
                        color: FILTER_COLORS.pink,
                        mt: 3,
                        mb: 1,
                    }}>
                    {t("helpDialog.searchingTitle")}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.75, color: "text.primary" }}>
                    {t.rich("helpDialog.searchingBody", {
                        strong,
                        min: MIN_SEARCH_LENGTH,
                    })}
                </Typography>
                <Typography
                    component="h3"
                    variant="subtitle1"
                    sx={{
                        fontWeight: 700,
                        color: FILTER_COLORS.pink,
                        mt: 3,
                        mb: 1,
                    }}>
                    {t("helpDialog.expandingTitle")}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.75, color: "text.primary" }}>
                    {t.rich("helpDialog.expandingBody", {
                        strong,
                        symbol: ">",
                    })}
                </Typography>
                <Typography
                    component="h3"
                    variant="subtitle1"
                    sx={{
                        fontWeight: 700,
                        color: FILTER_COLORS.pink,
                        mt: 3,
                        mb: 1,
                    }}>
                    {t("helpDialog.logicTitle")}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.75, color: "text.primary" }}>
                    {t.rich("helpDialog.logicBody", { strong })}
                </Typography>
            </DialogContent>
            <DialogActions
                sx={{
                    flexShrink: 0,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    px: 3,
                    py: 2,
                    justifyContent: "flex-end",
                    bgcolor: "background.paper",
                }}>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        bgcolor: FILTER_COLORS.blue,
                        color: FILTER_COLORS.white,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "1.0625rem",
                        px: 2.75,
                        py: 1.125,
                        borderRadius: 1.5,
                        boxShadow: "none",
                        "&:hover": {
                            bgcolor: FILTER_COLORS.blueHover,
                            boxShadow: "none",
                        },
                    }}>
                    {t("helpDialog.confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default HelpDialog;
