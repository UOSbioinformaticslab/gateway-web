"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Skeleton } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import InitialsBadge from "@/components/InitialsBadge";
import MenuDropdown from "@/components/MenuDropdown";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAccountMenu from "@/hooks/useAccountMenu";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";

interface AccountNavProps {
    headerVariant?: "light" | "dark";
}

const AccountNav = ({ headerVariant = "dark" }: AccountNavProps) => {
    const { showDialog } = useDialog();
    const t = useTranslations("components");
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );
    const { isLoggedIn, user, isLoading } = useAuth();
    const accountLinks = useAccountMenu();
    const handleOpenNav = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(event.currentTarget);
    };
    const textColor = headerVariant === "light" ? colors.grey800 : colors.white;
    const focusOutline = headerVariant === "light" ? colors.purple500 : colors.white;

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Skeleton variant="circular" width={36} height={36} />
                <Skeleton variant="rectangular" width={80} height={20} />
            </Box>
        );
    }

    if (isLoggedIn) {
        return (
            <>
                <Box sx={{ display: "flex" }}>
                    <InitialsBadge fullName={user?.name} />
                    <Button
                        disableRipple
                        sx={{
                            marginLeft: "5px",
                            color: textColor,

                            "&:focus&.Mui-focusVisible": {
                                outlineColor: focusOutline,
                                borderRadius: 0,
                                textDecoration: "underline",
                            },
                        }}
                        variant="text"
                        onClick={handleOpenNav}>
                        {user?.firstname}
                    </Button>
                </Box>
                <MenuDropdown
                    anchorElement={anchorElement}
                    handleClose={() => {
                        setAnchorElement(null);
                    }}
                    menuItems={accountLinks}
                />
            </>
        );
    }

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
                size="medium"
                variant="contained"
                color="primary"
                sx={{
                    color: "white",
                }}
                onClick={() =>
                    showDialog(ProvidersDialog, { isProvidersDialog: true })
                }>
                {t("DesktopNav.labels.signIn")}
            </Button>
            <Button
                size="medium"
                variant="contained"
                color="secondary"
                component={Link}
                href={`/${RouteName.HELP}`}
                sx={{
                    color: "white",
                }}>
                {t("DesktopNav.labels.help")}
            </Button>
        </Box>
    );
};

export default AccountNav;
