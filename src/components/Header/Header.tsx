"use client";

import * as React from "react";
import { hotjar } from "react-hotjar";
import { usePathname } from "next/navigation";
import { Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import Link from "@/components/Link";
import MenuDropdown from "@/components/MenuDropdown";
import AccountNav from "@/modules/AccountNav";
import useAccountMenu from "@/hooks/useAccountMenu";
import navItems from "@/config/nav";
import { colors } from "@/config/theme";
import { MenuIcon } from "@/consts/icons";

/** Strip locale prefix (e.g. /en) so paths match nav hrefs. */
function normalizePathname(pathname: string | null): string {
    if (!pathname) {
        return "";
    }
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "en") {
        return `/${segments.slice(1).join("/")}`;
    }
    return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

/**
 * Pick the nav item that best matches the current path. Uses longest href so
 * /about does not stay active on /about/how-we-protect-your-data.
 */
function getActiveNavHref(
    path: string,
    items: { href: string }[]
): string | null {
    const internal = items.filter(i => !i.href.startsWith("http"));
    const matches = internal.filter(
        item =>
            path === item.href || path.startsWith(`${item.href}/`)
    );
    if (matches.length === 0) {
        return null;
    }
    return matches.reduce((a, b) => (a.href.length >= b.href.length ? a : b))
        .href;
}

function Header() {
    const pathname = usePathname();
    const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;
    const HOTJAR_VERSION = 6;
    const isTablet = useMediaQuery("(min-width:640px)");

    React.useEffect(() => {
        if (!HOTJAR_ID || typeof window === "undefined" || hotjar.initialized()) {
            return;
        }

        const parsedId = Number.parseInt(HOTJAR_ID, 10);
        if (Number.isNaN(parsedId)) {
            return;
        }

        try {
            hotjar.initialize(parsedId, HOTJAR_VERSION);
        } catch (_error) {
            // Prevent third-party script loading failures from surfacing as app errors.
        }
    }, [HOTJAR_ID]);

    const [anchorElement, setAnchorElement] =
        React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(event.currentTarget);
    };

    const accountLinks = useAccountMenu();

    const focusOutline = `2px solid ${colors.purple500}`;

    const pathNormalized = normalizePathname(pathname);
    const activeNavHref = getActiveNavHref(pathNormalized, navItems);

    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: "white",
                color: colors.grey800,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}>
            <Container maxWidth="desktop">
                <Toolbar
                    disableGutters
                    sx={{
                        py: 1.5,
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                    }}>
                    {/* Logo + title (left) */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2.5,
                            flexShrink: 0,
                        }}>
                        <Link
                            href="/"
                            sx={{
                                display: "inline-flex",
                                lineHeight: 0,
                            }}>
                            <Image
                                src="/images/logos/logo.svg"
                                priority
                                width={110}
                                height={50}
                                alt="HDR UK Gateway"
                            />
                        </Link>
                        <Link
                            href="/"
                            sx={{
                                textDecoration: "none",
                                color: colors.grey800,
                                "&:hover": { textDecoration: "underline" },
                            }}>
                            <Typography
                                variant="h1"
                                sx={{
                                    color: "inherit",
                                    fontSize: { mobile: 18, tablet: 20 },
                                    fontWeight: 600,
                                }}>
                                CRUK Data Hub
                            </Typography>
                        </Link>
                    </Box>

                    {/* Nav links (center) - desktop: text links */}
                    <Box
                        component="nav"
                        aria-label="Main navigation"
                        sx={{
                            display: { mobile: "none", tablet: "flex" },
                            alignItems: "center",
                            gap: 0,
                            flex: 1,
                            justifyContent: "center",
                        }}>
                        {navItems.map((item) => {
                            const isExternal = item.href.startsWith("http");
                            const isActive =
                                !isExternal && activeNavHref === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    sx={{
                                        color: colors.black,
                                        textDecoration: "none",
                                        px: 2,
                                        py: 1,
                                        fontSize: { tablet: 18, laptop: 19 },
                                        fontWeight: 700,
                                        borderBottom: isActive
                                            ? `2px solid ${colors.red600}`
                                            : "2px solid transparent",
                                        "&:hover": {
                                            textDecoration: "underline",
                                        },
                                        "&:focus-visible": {
                                            outline: focusOutline,
                                            outlineOffset: 2,
                                        },
                                    }}>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </Box>

                    {/* Mobile: menu button + account nav */}
                    <Box
                        sx={{
                            display: { mobile: "flex", tablet: "none" },
                            alignItems: "center",
                            gap: 1,
                        }}>
                        <IconButton
                            size="large"
                            aria-label="navigation menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                            sx={{
                                color: colors.grey800,
                                "&:focus&.Mui-focusVisible": {
                                    borderRadius: 0,
                                    outline: focusOutline,
                                    outlineOffset: "3px",
                                },
                            }}>
                            <MenuIcon htmlColor={colors.grey800} />
                        </IconButton>
                        <MenuDropdown
                            handleClose={() => setAnchorElement(null)}
                            menuItems={[...navItems, ...accountLinks]}
                            anchorElement={anchorElement}
                        />
                        <AccountNav headerVariant="light" />
                    </Box>

                    {/* Right: Account nav (desktop) */}
                    <Box
                        sx={{
                            display: { mobile: "none", tablet: "flex" },
                            alignItems: "center",
                            flexShrink: 0,
                        }}>
                        <AccountNav headerVariant="light" />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Header;
