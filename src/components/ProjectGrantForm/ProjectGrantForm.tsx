"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationType } from "@/interfaces/Pagination";
import {
    ProjectGrant,
    ProjectGrantSubmission,
    ProjectGrantVersionFields,
    formatGrantNumbers,
    getProjectGrantDetails,
} from "@/interfaces/ProjectGrant";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Chip from "@/components/Chip";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import Select from "@/components/Select";
import Typography from "@/components/Typography";
import useActionBar from "@/hooks/useActionBar";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import {
    projectGrantDefaultValues,
    projectGrantFormFields,
    projectGrantValidationSchema,
} from "@/config/forms/projectGrant";
import { DataStatus } from "@/consts/application";
import { RouteName } from "@/consts/routeName";
import { FALLBACK_PROJECT_GRANTS } from "@/app/[locale]/(logged-out)/search/components/ProjectGrantDirectory/projectGrants";

interface ProjectGrantFormProps {
    teamId?: string;
    userId?: string;
    projectGrantId?: string;
}

interface ProjectGrantFormValues {
    projectGrantName: string;
    leadResearcher: string;
    leadResearchInstitute: string;
    grantNumbers: string;
    projectGrantStartDate: string | Dayjs | null;
    projectGrantEndDate: string | Dayjs | null;
    projectGrantScope: string;
}

const TRANSLATION_PATH = "pages.account.team.projectGrants.create";

const toApiDate = (value: string | Dayjs | null | undefined) => {
    if (!value) return null;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("YYYY-MM-DD") : null;
};

const toGrantNumberList = (value: string) =>
    value
        .split(/[,;\n]/)
        .map(item => item.trim())
        .filter(Boolean);

const toFormValues = (
    details: ProjectGrantVersionFields
): ProjectGrantFormValues => ({
    projectGrantName: details.projectGrantName || "",
    leadResearcher: details.leadResearcher || "",
    leadResearchInstitute: details.leadResearchInstitute || "",
    grantNumbers: formatGrantNumbers(details.grantNumbers),
    projectGrantStartDate: details.projectGrantStartDate
        ? dayjs(details.projectGrantStartDate)
        : null,
    projectGrantEndDate: details.projectGrantEndDate
        ? dayjs(details.projectGrantEndDate)
        : null,
    projectGrantScope: details.projectGrantScope || "",
});

const ProjectGrantForm = ({
    teamId,
    userId,
    projectGrantId,
}: ProjectGrantFormProps) => {
    const t = useTranslations();
    const { showBar } = useActionBar();
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const originalStatus = searchParams?.get("status") ?? DataStatus.ACTIVE;

    const projectRoute = teamId
        ? `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.PROJECT_GRANTS}`
        : `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.PROJECT_GRANTS}`;

    const { handleSubmit, control, reset } = useForm<ProjectGrantFormValues>({
        mode: "onTouched",
        resolver: yupResolver(projectGrantValidationSchema),
        defaultValues: {
            ...projectGrantDefaultValues,
        },
    });
    const { control: existingProjectControl, watch: watchExistingProject } =
        useForm<{ existingProjectId: string }>({
            defaultValues: {
                existingProjectId: projectGrantId ?? "",
            },
        });
    const selectedProjectId = watchExistingProject("existingProjectId");

    const baseUrl = apis.projectGrantsV1Url;

    const { data: projectGrantList, isLoading: isLoadingProjects } = useGet<
        PaginationType<ProjectGrant>
    >(`${baseUrl}?per_page=100&sort=created_at:desc`, {
        withPagination: true,
        errorNotificationsOn: false,
    });

    const { data: existingProjectGrant } = useGet<ProjectGrant>(
        `${baseUrl}/${projectGrantId}`,
        { shouldFetch: !!projectGrantId }
    );

    const projects = useMemo(() => {
        const fromApi = projectGrantList?.list ?? [];
        const source =
            fromApi.length > 0
                ? fromApi
                : (FALLBACK_PROJECT_GRANTS as ProjectGrant[]);

        if (
            existingProjectGrant &&
            !source.some(
                project =>
                    String(project.id) === String(existingProjectGrant.id)
            )
        ) {
            return [existingProjectGrant, ...source];
        }

        return source;
    }, [existingProjectGrant, projectGrantList?.list]);

    const projectOptions = useMemo(
        () => [
            {
                value: "",
                label: t(`${TRANSLATION_PATH}.selectExistingPlaceholder`),
            },
            ...projects.map(project => ({
                value: String(project.id),
                label:
                    getProjectGrantDetails(project).projectGrantName ||
                    `Project ${project.id}`,
            })),
        ],
        [projects, t]
    );

    const createProjectGrant = usePost<ProjectGrantSubmission>(baseUrl, {
        itemName: "Project",
    });

    const editProjectGrant = usePatch<Partial<ProjectGrantSubmission>>(
        baseUrl,
        { itemName: "Project" }
    );

    const previousProjectId = useRef(selectedProjectId);

    useEffect(() => {
        if (!selectedProjectId) {
            if (previousProjectId.current) {
                reset({ ...projectGrantDefaultValues });
            }
            previousProjectId.current = "";
            return;
        }

        previousProjectId.current = selectedProjectId;
        const selectedProject = projects.find(
            project => String(project.id) === selectedProjectId
        );
        if (!selectedProject) return;

        reset(toFormValues(getProjectGrantDetails(selectedProject)));
    }, [projects, reset, selectedProjectId]);

    const [activeFieldName, setActiveFieldName] = useState(
        projectGrantFormFields[0].name
    );
    const activeField =
        projectGrantFormFields.find(field => field.name === activeFieldName) ??
        projectGrantFormFields[0];

    const hydratedFormFields = useMemo(
        () =>
            projectGrantFormFields.map(field => {
                const {
                    guidance: _guidance,
                    guidanceTitle: _guidanceTitle,
                    ...inputField
                } = field;

                return (
                    <Box
                        key={field.name}
                        onClick={() => setActiveFieldName(field.name)}
                        onFocusCapture={() => setActiveFieldName(field.name)}>
                        <InputWrapper
                            control={control}
                            sx={{ mt: 1 }}
                            onFocus={() => setActiveFieldName(field.name)}
                            {...inputField}
                        />
                    </Box>
                );
            }),
        [control]
    );

    const onSubmit = async (
        formData: ProjectGrantFormValues,
        status?: DataStatus
    ) => {
        const payload: ProjectGrantSubmission = {
            projectGrantName: formData.projectGrantName,
            leadResearcher: formData.leadResearcher,
            leadResearchInstitute: formData.leadResearchInstitute,
            grantNumbers: toGrantNumberList(formData.grantNumbers),
            projectGrantStartDate: toApiDate(formData.projectGrantStartDate),
            projectGrantEndDate: toApiDate(formData.projectGrantEndDate),
            projectGrantScope: formData.projectGrantScope,
            status,
            team_id: teamId ? +teamId : undefined,
            user_id: !teamId ? userId : undefined,
        };

        const projectIdToSave = selectedProjectId || projectGrantId;
        if (!projectIdToSave) {
            await createProjectGrant(payload);
        } else {
            await editProjectGrant(projectIdToSave, payload);
        }

        push(`${projectRoute}?tab=${status}`);
    };

    useEffect(() => {
        showBar("CreateProjectGrant", {
            cancelText: t(`${TRANSLATION_PATH}.cancel`),
            confirmText: t(`${TRANSLATION_PATH}.publish`),
            tertiaryButton: {
                onAction: async () => {
                    handleSubmit(formData =>
                        onSubmit(formData, DataStatus.DRAFT)
                    )();
                },
                buttonText: t(`${TRANSLATION_PATH}.saveDraft`),
                buttonProps: {
                    color: "secondary",
                    variant: "outlined",
                },
            },
            onSuccess: () => {
                handleSubmit(formData =>
                    onSubmit(formData, DataStatus.ACTIVE)
                )();
            },
            onCancel: () => {
                push(`${projectRoute}?tab=${originalStatus}`);
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <BoxContainer
                sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Typography variant="h2">
                        {t(`${TRANSLATION_PATH}.title`)}
                    </Typography>
                    <Typography>{t(`${TRANSLATION_PATH}.intro`)}</Typography>
                    <Typography sx={{ mt: 1 }}>
                        {t(`${TRANSLATION_PATH}.introExisting`)}
                    </Typography>
                    <Box
                        sx={{ mt: 2 }}
                        onFocusCapture={() =>
                            setActiveFieldName("existingProjectId")
                        }>
                        <Select
                            control={existingProjectControl}
                            name="existingProjectId"
                            label={t(`${TRANSLATION_PATH}.selectExisting`)}
                            options={projectOptions}
                            disabled={isLoadingProjects}
                        />
                    </Box>
                </Box>
                <Box>
                    <Chip label={t(`${TRANSLATION_PATH}.labelTag`)} />
                </Box>
            </BoxContainer>
            <BoxContainer>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { mobile: "column", tablet: "row" },
                        alignItems: "flex-start",
                        gap: 2,
                        p: 0,
                    }}>
                    <Box sx={{ flex: 2, p: 0, width: "100%" }}>
                        <Form>
                            <Paper>
                                <Box>{hydratedFormFields}</Box>
                            </Paper>
                        </Form>
                    </Box>
                    <Paper
                        sx={{
                            flex: 1,
                            p: 2,
                            width: { mobile: "100%", tablet: "auto" },
                            backgroundColor: "white",
                            position: { tablet: "sticky" },
                            top: { tablet: 16 },
                        }}>
                        <Typography
                            variant="h2"
                            sx={{
                                color: "primary.main",
                                fontWeight: 700,
                                mb: 1.5,
                            }}>
                            {activeFieldName === "existingProjectId"
                                ? t(`${TRANSLATION_PATH}.selectExisting`)
                                : activeField.guidanceTitle}
                        </Typography>
                        <Typography>
                            {activeFieldName === "existingProjectId"
                                ? t(`${TRANSLATION_PATH}.introExisting`)
                                : activeField.guidance}
                        </Typography>
                    </Paper>
                </Box>
            </BoxContainer>
        </>
    );
};

export default ProjectGrantForm;
