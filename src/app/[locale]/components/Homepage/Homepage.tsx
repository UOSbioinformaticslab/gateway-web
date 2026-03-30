"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Typography } from "@mui/material";
import Link from "@/components/Link";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { StaticImages } from "@/config/images";
import { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import { PageTemplateHome } from "@/interfaces/Cms";
import { SearchCategory } from "@/interfaces/Search";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import ProvidersDialog from "@/modules/ProvidersDialog";

const PANEL_ITEMS: { labelKey: string; href: string; loggedInOnly?: boolean; span2?: boolean }[] = [
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

interface HomePageProps {
    cmsContent: PageTemplateHome;
}

const HomePage = ({ cmsContent: { page } }: HomePageProps) => {
    const t = useTranslations("pages.home");
    const { isLoggedIn } = useAuth();
    const { showDialog } = useDialog();

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
                                fontSize: { mobile: 24, tablet: 34, desktop: 40 },
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
                                color: colors.grey800,
                                borderRadius: 2,
                                py: 2,
                                px: 2,
                                textAlign: "center" as const,
                                fontWeight: 600,
                                fontSize: 15,
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
                                border: `1px solid ${colors.grey300}`,
                                borderRadius: 1,
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "stretch",
                                backgroundColor: "#fff",
                                minHeight: { mobile: 84, tablet: 96 },
                                "&:hover": {
                                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                                },
                            }}>
                            <Box
                                sx={{
                                    position: "relative",
                                    width: { mobile: 110, tablet: 150 },
                                    flexShrink: 0,
                                    backgroundColor: colors.grey100,
                                }}>
                                <Image
                                    src="/images/home-scientist.png"
                                    alt=""
                                    fill
                                    sizes="150px"
                                    style={{
                                        objectFit: "cover",
                                        objectPosition: "left center",
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    px: { mobile: 2, tablet: 4 },
                                    py: { mobile: 2, tablet: 2.5 },
                                    textAlign: "center",
                                }}>
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color: colors.purple500,
                                        fontSize: { mobile: 16, tablet: 18 },
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
            <Box sx={{ bgcolor: "#fff", py: { mobile: 4, tablet: 5 }, borderTop: `1px solid ${colors.grey300}` }}>
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
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 3,
                            alignItems: "center",
                            justifyContent: { mobile: "center", tablet: "flex-start" },
                        }}>
                        {logosFormatted.map(logo => (
                            <Link
                                key={logo.alt}
                                href={logo.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    minHeight: 50,
                                    maxWidth: 160,
                                    "&:hover": { opacity: 0.85 },
                                }}>
                                <Image
                                    src={logo.imageSrc}
                                    alt={logo.alt}
                                    width={140}
                                    height={50}
                                    style={{ objectFit: "contain" }}
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
