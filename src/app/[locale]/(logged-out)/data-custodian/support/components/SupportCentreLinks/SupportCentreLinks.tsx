"use client";

import { Box, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import Container from "@/components/Container";
import { FeatureCard, FeatureCardHeading } from "@/components/FeatureCard";
import { DataUseIcon, PublicationIcon } from "@/consts/customIcons";
import { RouteName } from "@/consts/routeName";
import ContactSupport from "@/app/[locale]/(logged-out)/support/components/ContactSupport";

const TRANSLATIONS_NAMESPACE_SUPPORT = "pages.dataCustodianSupport";

export default function MeetTheTeam() {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_SUPPORT);

    const data = [
        {
            heading: t("uploadingDataUsesProjectsTitle"),
            link: RouteName.DATA_CUSTODIAN_UPLOADING_DATAUSES_PROJECTS,
            icon: <DataUseIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("uploadingPublicationsTitle"),
            link: RouteName.DATA_CUSTODIAN_PUBLICATIONS,
            icon: <PublicationIcon aria-hidden="true" focusable="false" />,
        },
    ];

    return (
        <>
            <Container sx={{ background: "white", p: 10 , mt: "20px"}}>
                <Grid
                    container
                    columnSpacing={6}
                    rowSpacing={6}
                    sx={{
                        svg: {
                            fontSize: "48px",
                        },
                    }}>
                    {data.map(({ heading, icon, link }) => (
                        <Grid
                            size={{ mobile: 6, tablet: 4, desktop: 3 }}
                            sx={{ p: 0 }}
                            key={link}>
                            <FeatureCard icon={icon} href={link}>
                                <FeatureCardHeading sx={{ overflow: "hidden" }}>
                                    {heading}
                                </FeatureCardHeading>
                            </FeatureCard>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 5 }}>
                    <ContactSupport />
                </Box>
            </Container>
        </>
    );
}
