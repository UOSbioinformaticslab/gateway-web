"use client";

import { ReactNode } from "react";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HelpIcon from "@mui/icons-material/Help";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { Box, Divider, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Container from "@/components/Container";
import { RouteName } from "@/consts/routeName";

const TRANSLATIONS_NAMESPACE = "pages.help";

type HelpCardConfig = {
    titleKey:
        | "exploringDatahubTitle"
        | "uploadingMetadataTitle"
        | "researcherFaqsTitle"
        | "dataUsesTitle"
        | "darTitle"
        | "publicationsTitle";
    descriptionKey:
        | "exploringDatahubDescription"
        | "uploadingMetadataDescription"
        | "researcherFaqsDescription"
        | "comingSoon";
    href?: string;
    icon: ReactNode;
};

function HelpGridCell({
    title,
    description,
    href,
    icon,
}: {
    title: string;
    description: string;
    href?: string;
    icon: ReactNode;
}) {
    const inner = (
        <Box
            sx={{
                textAlign: "center",
                px: { mobile: 1, tablet: 2 },
                py: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
            <Box
                sx={{
                    height: "4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "primary.main",
                    mb: 2,
                    "& svg": { fontSize: 52 },
                }}>
                {icon}
            </Box>
            <Typography
                variant="h3"
                component="h2"
                sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: { mobile: 17, tablet: 19 },
                    mb: 1.5,
                    lineHeight: 1.35,
                }}>
                {title}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: "grey.900",
                    lineHeight: 1.55,
                    maxWidth: "22rem",
                    mx: "auto",
                }}>
                {description}
            </Typography>
        </Box>
    );

    if (href) {
        return (
            <Box
                component={Link}
                href={href}
                sx={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    borderRadius: 1,
                    transition: "background-color 0.15s ease",
                    "&:hover": {
                        bgcolor: "action.hover",
                    },
                }}>
                {inner}
            </Box>
        );
    }

    return inner;
}

export default function HelpHub() {
    const t = useTranslations(TRANSLATIONS_NAMESPACE);

    const cards: HelpCardConfig[] = [
        {
            titleKey: "exploringDatahubTitle",
            descriptionKey: "exploringDatahubDescription",
            href: `/${RouteName.HELP_EXPLORING_DATAHUB}`,
            icon: <AccountTreeOutlinedIcon aria-hidden="true" focusable="false" />,
        },
        {
            titleKey: "uploadingMetadataTitle",
            descriptionKey: "uploadingMetadataDescription",
            href: `/${RouteName.HELP_UPLOAD_METADATA}`,
            icon: <CloudUploadOutlinedIcon aria-hidden="true" focusable="false" />,
        },
        {
            titleKey: "researcherFaqsTitle",
            descriptionKey: "researcherFaqsDescription",
            href: `/${RouteName.HELP_RESEARCHERS_FAQ}`,
            icon: <HelpIcon aria-hidden="true" focusable="false" />,
        },
        {
            titleKey: "dataUsesTitle",
            descriptionKey: "comingSoon",
            icon: <GroupsOutlinedIcon aria-hidden="true" focusable="false" />,
        },
        {
            titleKey: "darTitle",
            descriptionKey: "comingSoon",
            icon: <MailOutlineIcon aria-hidden="true" focusable="false" />,
        },
        {
            titleKey: "publicationsTitle",
            descriptionKey: "comingSoon",
            icon: <MenuBookOutlinedIcon aria-hidden="true" focusable="false" />,
        },
    ];

    return (
        <Container
            maxWidth="desktop"
            sx={{
                background: "white",
                mt: "20px",
                pt: { mobile: 6, tablet: 8, desktop: 10 },
                pb: { mobile: 5, tablet: 6, desktop: 8 },
                px: { mobile: 2, tablet: 4 },
            }}>
            <Typography
                component="h1"
                align="center"
                sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: { mobile: 28, tablet: 32 },
                    lineHeight: 1.2,
                    mb: 2,
                }}>
                {t("supportCentreHeading")}
            </Typography>
            <Divider
                sx={{
                    borderColor: "grey.900",
                    borderBottomWidth: 1,
                    mb: { mobile: 4, tablet: 5 },
                }}
            />
            <Grid
                container
                columnSpacing={{ mobile: 2, tablet: 4, desktop: 5 }}
                rowSpacing={{ mobile: 3, tablet: 4 }}
                justifyContent="center">
                {cards.map(item => (
                    <Grid
                        key={item.titleKey}
                        size={{
                            mobile: 12,
                            tablet: 6,
                            desktop: 4,
                        }}>
                        <HelpGridCell
                            title={t(item.titleKey)}
                            description={t(item.descriptionKey)}
                            href={item.href}
                            icon={item.icon}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
