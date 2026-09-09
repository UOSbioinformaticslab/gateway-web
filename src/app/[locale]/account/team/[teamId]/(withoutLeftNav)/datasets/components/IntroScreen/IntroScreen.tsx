"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import Box from "@/components/Box";
import Button from "@/components/Button";
import FormLegend from "@/components/FormLegend";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { inputComponents } from "@/config/forms";
import { DownloadIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";

interface OptionType {
    label: string;
    value: string;
}

const FORM_LEGEND_EXAMPLE = [
    {
        name: "All fields complete",
        status: 0,
    },
    {
        name: "All required fields complete, some optional fields remain",
        status: 1,
    },
    {
        name: "Not all required fields complete, optional fields may remain",
        status: 2,
    },
    {
        name: "Current form section being viewed",
        status: 3,
    },
    {
        name: "No completed fields",
        status: 4,
    },
];

interface IntroScreenProps {
    teamId: number;
    defaultTeamId?: number;
    teamOptions?: OptionsType[];
    isLoadingTeams: boolean;
    setDataCustodian: (value: number) => void;
    handleOnUserInputChange: (e: React.ChangeEvent, value: string) => void;
}

const IntroScreen = ({
    teamId,
    defaultTeamId,
    teamOptions,
    isLoadingTeams,
    setDataCustodian,
    handleOnUserInputChange,
}: IntroScreenProps) => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );
    const router = useRouter();
    const params = useParams<{ locale?: string }>();
    const locale = params?.locale || RouteName.EN;

    const { control, watch } = useForm({
        defaultValues: { custodianId: defaultTeamId },
    });
    const watchSort = watch("custodianId");

    useEffect(() => {
        if (!watchSort) return;
        setDataCustodian(watchSort);
    }, [watchSort]);

    const handleUploadJson = () => {
        router.push(
            `/${locale}/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}/${RouteName.UPLOAD}`
        );
    };

    return (
        <Paper
            sx={{
                mt: 1.25,
                mb: 1.25,
                p: 2,
                flex: 2,
                backgroundColor: "white",
            }}>
            <Box sx={{ p: 0 }}>
                <Typography variant="h1">{t("welcomeMessage")}</Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                    }}>
                    <Typography sx={{ fontSize: "1.25rem" }}>
                        {t("introText1")}
                    </Typography>
                    <Button
                        onClick={handleUploadJson}
                        startIcon={<DownloadIcon />}>
                        {t("uploadJson")}
                    </Button>
                </Box>
                <Typography sx={{ fontSize: "1.25rem", mt: 1 }}>
                    {t("introText2")}
                </Typography>
            </Box>
            <Box>
                <Typography
                    sx={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        mb: 1,
                    }}>
                    {t("progressLegend")}
                </Typography>
                <FormLegend items={FORM_LEGEND_EXAMPLE} />
            </Box>
            <Box>
                <Typography
                    sx={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        mb: 1,
                    }}>
                    {t("dataCustodian")}
                </Typography>

                <InputWrapper
                    control={control}
                    name="custodianId"
                    options={teamOptions}
                    selectOnFocus
                    onInputChange={handleOnUserInputChange}
                    extraInfo={t("toolTipText")}
                    isLoadingOptions={isLoadingTeams}
                    component={inputComponents.Autocomplete}
                    disableClearable
                    filterOptions={(x: OptionType) => x}
                />
            </Box>
        </Paper>
    );
};

export default IntroScreen;
