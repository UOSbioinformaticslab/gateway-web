"use client";

import { useEffect, useState } from "react";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Script from "next/script";
import Box from "@/components/Box";
import BulletList from "@/components/BulletList";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import useFullPathname from "@/hooks/useFullPathname";
import { CUSTOMER_PORTAL_SUPPORT_URL } from "@/config/hrefs";
import ProviderLinks from "../ProviderLinks";
import SignInDialog from "../SignInDialog";
import RegisterDialog from "../RegisterDialog";

const TRANSLATIONS_PROVIDERS_DIALOG = "modules.dialogs.ProvidersDialog";
const oaId = process.env.NEXT_PUBLIC_OA_APP_ID;

const ProvidersDialog = () => {
    const t = useTranslations(TRANSLATIONS_PROVIDERS_DIALOG);
    const [institutionSelectVisible, setInstitutionSelectVisible] =
        useState<boolean>();

    const { hideDialog, store, showDialog } = useDialog();
    const pathname = useFullPathname();

    useEffect(() => {
        setInstitutionSelectVisible(false);
    }, [store?.dialogComponent]);

    const redirectPath = store.dialogProps?.redirectPath || pathname || "";

    const handleSignIn = () => {
        hideDialog();
        showDialog(SignInDialog, {
            isSignInDialog: true,
            redirectPath,
        });
    };

    const handleRegister = () => {
        hideDialog();
        showDialog(RegisterDialog, {
            isRegisterDialog: true,
            redirectPath,
        });
    };

    return (
        <Dialog
            titleSx={{ paddingLeft: 8 }}
            title={t("title")}
            keepMounted
            onClose={() => hideDialog()}
            open={!!store?.dialogProps?.isProvidersDialog}>
            <MuiDialogContent sx={{ paddingX: 8 }}>
                {!institutionSelectVisible && (
                    <>
                        <p>{t("intro1")}</p>

                        <BulletList
                            items={[
                                {
                                    label: "Submit data access enquiries and applications",
                                },
                                {
                                    label: "Add your collections and other resources",
                                },
                                {
                                    label: "Use the Cohort Discovery advanced search tool (requires institutional or Azure logins)",
                                },
                            ]}
                        />
                        <p>{t("intro2")}</p>
                        
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleSignIn}
                                sx={{ width: "100%" }}>
                                {t("signIn")}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleRegister}
                                sx={{ width: "100%" }}>
                                {t("createAccount") || "Create an account"}
                            </Button>
                        </Box>

                    </>
                )}

                <div
                    style={{
                        display: institutionSelectVisible ? "block" : "none",
                    }}>
                    <Button
                        variant="link"
                        onClick={() => setInstitutionSelectVisible(false)}>
                        {t("selectAnother")}
                    </Button>

                    <div id="wayfinder">
                        <Loading />
                    </div>

                    {oaId && (
                        <Script
                            id="open-athens-wayfinder"
                            strategy="lazyOnload"
                            dangerouslySetInnerHTML={{
                                __html: `(function(w,a,y,f){
           w._wayfinder=w._wayfinder||function(){(w._wayfinder.q=w._wayfinder.q||[]).push(arguments)};
           p={oaDomain:'hdruk.ac.uk',oaAppId: '${oaId}'};
           w._wayfinder.settings=p;h=a.getElementsByTagName('head')[0];
           s=a.createElement('script');s.async=1;s.referrerPolicy='origin';
           q=Object.keys(p).map(function(key){return key+'='+p[key]}).join('&');
           s.src=y+'v1'+f+"?"+q;h.appendChild(s);}
        )(window,document,'https://wayfinder.openathens.net/embed/','/loader.js');`,
                            }}
                        />
                    )}
                </div>
            </MuiDialogContent>
        </Dialog>
    );
};

export default ProvidersDialog;
