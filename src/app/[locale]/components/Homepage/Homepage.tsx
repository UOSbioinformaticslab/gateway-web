"use client";

import { useMemo, useState } from "react";
import { Close } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PageTemplateHome } from "@/interfaces/Cms";
import { SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import Container from "@/components/Container";
import Link from "@/components/Link";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";

const PANEL_ITEMS: {
    labelKey: string;
    href: string;
    loggedInOnly?: boolean;
    span2?: boolean;
}[] = [
    {
        labelKey: "finderPanel.browseSearchDatasets",
        href: `/search?type=${SearchCategory.DATASETS}`,
    },
    {
        labelKey: "finderPanel.browseSearchProjects",
        href: `/search?type=${SearchCategory.DATA_USE}`,
    },
    {
        labelKey: "finderPanel.browseSearchAssociatedPublications",
        href: `/search?type=${SearchCategory.PUBLICATIONS}`,
    },
    {
        labelKey: "finderPanel.browseSearchAssociatedTools",
        href: `/search?type=${SearchCategory.TOOLS}`,
    },
];

const RESEARCH_PARTNERS: {
    name: string;
    href: string;
    logoSrc: string;
    logoWidth: number;
    logoHeight: number;
}[] = [
    {
        name: "Cancer Research UK",
        href: "https://www.cancerresearchuk.org/",
        logoSrc: "/images/icons/cruk-logo.svg",
        logoWidth: 200,
        logoHeight: 46,
    },
    {
        name: "Cancer Research Horizons",
        href: "https://www.cancerresearchhorizons.com/",
        logoSrc: "/images/partners/crh.png",
        logoWidth: 200,
        logoHeight: 44,
    },
    {
        name: "University of Sussex",
        href: "https://bioinformaticslab.sussex.ac.uk/",
        logoSrc: "/images/partners/sussex.svg",
        logoWidth: 200,
        logoHeight: 46,
    },
    {
        name: "University of Oxford",
        href: "https://www.oncology.ox.ac.uk/",
        logoSrc: "/images/partners/oxford.svg",
        logoWidth: 200,
        logoHeight: 46,
    },
    {
        name: "HDR UK",
        href: "https://healthdatagateway.org/en",
        logoSrc: "/images/partners/hdruk.svg",
        logoWidth: 200,
        logoHeight: 46,
    },
    {
        name: "Biobanking UK",
        href: "https://www.biobankinguk.org/",
        logoSrc: "/images/partners/biobank.png",
        logoWidth: 200,
        logoHeight: 46,
    },
];

interface HomePageProps {
    cmsContent: PageTemplateHome;
}

const HomePage = ({ cmsContent: { page } }: HomePageProps) => {
    const t = useTranslations("pages.home");
    const { isLoggedIn } = useAuth();
    const { showDialog } = useDialog();
    const [isCrukBannerVisible, setIsCrukBannerVisible] = useState(true);

    const {
        homeFields: { logos },
    } = page.template;

    const logosFormatted = useMemo(
        () =>
            logos.map(logo => ({
                websiteUrl: logo.websiteAddress,
                imageSrc: logo.imageLocation.node.mediaItemUrl,
                alt: logo.organisationCharity,
            })),
        [logos]
    );

    return (
        <>
            {isCrukBannerVisible && (
                <Box
                    sx={{
                        bgcolor: colors.purple500,
                        color: colors.white,
                        py: 1.5,
                        px: { mobile: 2, tablet: 3 },
                    }}>
                    <Container
                        sx={{
                            position: "relative",
                            pr: { mobile: 5, tablet: 6 },
                        }}>
                        <Typography
                            sx={{
                                color: colors.pink400,
                                fontWeight: 600,
                                fontSize: { mobile: 15, tablet: 16 },
                                lineHeight: 1.4,
                            }}>
                            {t("crukBanner.title")}
                        </Typography>
                        <Typography
                            sx={{
                                color: colors.white,
                                fontSize: { mobile: 14, tablet: 15 },
                                lineHeight: 1.45,
                            }}>
                            {t("crukBanner.intro")}
                        </Typography>
                        <Typography
                            sx={{
                                color: colors.white,
                                fontSize: { mobile: 14, tablet: 15 },
                                lineHeight: 1.45,
                            }}>
                            {t("crukBanner.step1Prefix")}
                            <Typography
                                component="button"
                                type="button"
                                onClick={() =>
                                    showDialog(ProvidersDialog, {
                                        isProvidersDialog: true,
                                    })
                                }
                                sx={{
                                    display: "inline",
                                    p: 0,
                                    m: 0,
                                    border: 0,
                                    background: "none",
                                    color: `${colors.yellow400} !important`,
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    font: "inherit",
                                    "&:hover": {
                                        opacity: 0.9,
                                    },
                                }}>
                                {t("crukBanner.registerEmail")}
                            </Typography>
                            {t("crukBanner.step1Suffix")}{" "}
                            {t("crukBanner.step2")} {t("crukBanner.step3")}
                        </Typography>
                        <IconButton
                            onClick={() => setIsCrukBannerVisible(false)}
                            aria-label={t("crukBanner.ariaCloseButtonLabel")}
                            size="small"
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                color: colors.white,
                            }}>
                            <Close fontSize="small" />
                        </IconButton>
                    </Container>
                </Box>
            )}

            {/* Hero section */}
            <Box
                sx={{
                    position: "relative",
                    minHeight: { mobile: 380, tablet: 420, desktop: 480 },
                    display: "flex",
                    alignItems: "center",
                    backgroundImage: "url(/images/home-scientist.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}>
                <Container
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        py: 4,
                    }}>
                    <Box
                        sx={{
                            maxWidth: 720,
                            backgroundColor: "rgba(255,255,255,0.93)",
                            borderRadius: 1,
                            borderLeft: `5px solid ${colors.pink400}`,
                            px: { mobile: 3, tablet: 5 },
                            py: { mobile: 3, tablet: 4 },
                            boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
                        }}>
                        <Typography
                            component="h1"
                            variant="h2"
                            sx={{
                                color: colors.purple500,
                                fontWeight: 700,
                                fontSize: {
                                    mobile: 24,
                                    tablet: 34,
                                    desktop: 40,
                                },
                                lineHeight: 1.05,
                                mb: 2,
                            }}>
                            {t("finderPanel.title")}
                        </Typography>
                        <Typography
                            sx={{
                                color: colors.purple500,
                                fontSize: { mobile: 20, tablet: 24 },
                                lineHeight: 1.35,
                                maxWidth: 620,
                            }}>
                            {t("finderPanel.intro")}
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Services panel - gradient background, 9 white cards */}
            <Box
                sx={{
                    background: `linear-gradient(90deg, #f0f7ff 0%, #f0f7ff 40%, ${colors.purple100} 100%)`,
                    py: { mobile: 4, tablet: 5 },
                    position: "relative",
                    overflow: "hidden",
                }}>
                <Box
                    sx={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        width: "40%",
                        height: "80%",
                        background: `linear-gradient(135deg, transparent 30%, ${colors.green50} 70%, rgba(255,255,255,0.3) 100%)`,
                        pointerEvents: "none",
                    }}
                />
                <Container sx={{ position: "relative", zIndex: 1 }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                mobile: "1fr",
                                tablet: "repeat(2, 1fr)",
                            },
                            gap: 2,
                        }}>
                        {PANEL_ITEMS.map((item, index) => {
                            const label = t(item.labelKey);
                            const isDar = item.loggedInOnly === true;
                            const needsSignIn = isDar && !isLoggedIn;
                            const handleClick = (e: React.MouseEvent) => {
                                if (needsSignIn) {
                                    e.preventDefault();
                                    showDialog(ProvidersDialog, {
                                        isProvidersDialog: true,
                                    });
                                }
                            };
                            const cardSx = {
                                bgcolor: "#fff",
                                color: colors.purple500,
                                borderRadius: 2,
                                py: 2,
                                px: 2,
                                textAlign: "center" as const,
                                fontWeight: 700,
                                fontSize: { mobile: 16, tablet: 18 },
                                lineHeight: 1.2,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                transition: "box-shadow 0.2s",
                                "&:hover": {
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                },
                                ...(item.span2 && {
                                    gridColumn: { tablet: "span 2" },
                                }),
                            };
                            return (
                                <Link
                                    key={index}
                                    href={needsSignIn ? "#" : item.href}
                                    onClick={handleClick}
                                    sx={{
                                        textDecoration: "none",
                                        display: "block",
                                        ...cardSx,
                                    }}>
                                    {label}
                                </Link>
                            );
                        })}
                    </Box>
                </Container>
            </Box>

            {/* Feature research panel */}
            <Box sx={{ bgcolor: "#fff", py: { mobile: 3, tablet: 4 } }}>
                <Container>
                    <Link
                        href={`/search?type=${SearchCategory.DATASETS}`}
                        sx={{
                            textDecoration: "none",
                            display: "block",
                            color: "inherit",
                        }}>
                        <Box
                            sx={{
                                p: 0,
                                border: `1px solid ${colors.grey300}`,
                                borderRadius: 1,
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "stretch",
                                backgroundColor: "#fff",
                                minHeight: { mobile: 120, tablet: 140 },
                                boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
                                "&:hover": {
                                    boxShadow: "0 3px 14px rgba(0,0,0,0.10)",
                                },
                            }}>
                            <Box
                                sx={{
                                    p: 0,
                                    position: "relative",
                                    width: {
                                        mobile: 170,
                                        tablet: 280,
                                        desktop: 340,
                                    },
                                    flexShrink: 0,
                                    backgroundColor: colors.grey100,
                                }}>
                                <Image
                                    src="/images/crh.png"
                                    alt=""
                                    fill
                                    sizes="150px"
                                    style={{
                                        objectFit: "cover",
                                        objectPosition: "left center",
                                        display: "block",
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    px: { mobile: 2, tablet: 6 },
                                    py: 0,
                                    textAlign: "center",
                                }}>
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color: colors.blue400,
                                        fontSize: {
                                            mobile: 16,
                                            tablet: 18,
                                            desktop: 20,
                                        },
                                        lineHeight: 1.2,
                                    }}>
                                    {t("finderPanel.horizonsLink")}
                                </Typography>
                            </Box>
                        </Box>
                    </Link>
                </Container>
            </Box>

            {/* Our Research Partners */}
            <Box
                sx={{
                    bgcolor: "#fff",
                    py: { mobile: 4, tablet: 5 },
                    borderTop: `1px solid ${colors.grey300}`,
                }}>
                <Container>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 700,
                            color: colors.grey800,
                            fontSize: { mobile: 24, tablet: 28 },
                            mb: 3,
                        }}>
                        {t("researchPartners.title")}
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                mobile: "1fr",
                                tablet: "repeat(2, 1fr)",
                                desktop: "repeat(3, 1fr)",
                            },
                            gap: 2,
                        }}>
                        {RESEARCH_PARTNERS.map(partner => (
                            <Link
                                key={`${partner.href}-${partner.name}`}
                                href={partner.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    minHeight: 68,
                                    px: 2,
                                    py: 1,
                                    border: `1px solid ${colors.grey300}`,
                                    backgroundColor: colors.white,
                                    borderRadius: 1,
                                    "&:hover": {
                                        boxShadow:
                                            "0 2px 10px rgba(0,0,0,0.08)",
                                    },
                                }}>
                                <Image
                                    src={partner.logoSrc}
                                    alt={partner.name}
                                    width={partner.logoWidth}
                                    height={partner.logoHeight}
                                    style={{
                                        objectFit: "contain",
                                        maxWidth: "100%",
                                        maxHeight: 46,
                                        height: "auto",
                                    }}
                                />
                            </Link>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* CTA strip */}
            <Box
                sx={{
                    bgcolor: colors.grey100,
                    py: 3,
                    borderTop: `1px solid ${colors.grey300}`,
                }}>
                <Container>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2,
                        }}>
                        <Link
                            href="/search"
                            sx={{
                                color: colors.pink400,
                                fontWeight: 600,
                                px: 2,
                                "&:hover": { textDecoration: "underline" },
                            }}>
                            {t("cta.discoverData")}
                        </Link>
                        <Box
                            component="span"
                            sx={{
                                width: "2px",
                                height: 24,
                                bgcolor: colors.grey400,
                                display: { mobile: "none", tablet: "block" },
                            }}
                        />
                        <Link
                            href="/search"
                            sx={{
                                color: colors.pink400,
                                fontWeight: 600,
                                px: 2,
                                "&:hover": { textDecoration: "underline" },
                            }}>
                            {t("cta.findStudies")}
                        </Link>
                        <Box
                            component="span"
                            sx={{
                                width: "2px",
                                height: 24,
                                bgcolor: colors.grey400,
                                display: { mobile: "none", tablet: "block" },
                            }}
                        />
                        <Link
                            href={RouteName.SUPPORT}
                            sx={{
                                color: colors.pink400,
                                fontWeight: 600,
                                px: 2,
                                "&:hover": { textDecoration: "underline" },
                            }}>
                            {t("cta.collaborate")}
                        </Link>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default HomePage;
