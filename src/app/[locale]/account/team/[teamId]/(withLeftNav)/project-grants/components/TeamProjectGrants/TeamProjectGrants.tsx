"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationType } from "@/interfaces/Pagination";
import {
    ProjectGrant,
    formatGrantNumbers,
    getProjectGrantDetails,
} from "@/interfaces/ProjectGrant";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import useModal from "@/hooks/useModal";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";
import {
    searchDefaultValues,
    sortByOptions,
} from "@/config/forms/projectGrantAccountSearch";
import { colors } from "@/config/theme";
import { DataStatus } from "@/consts/application";
import { AddIcon, ArchiveIcon, EditIcon, UnarchiveIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { capitalise } from "@/utils/general";
import ProjectGrantsTab from "../ProjectGrantsTab";

interface TeamProjectGrantsProps {
    permissions: { [key: string]: boolean };
    teamId?: string;
    userId: string;
}

const TRANSLATION_PATH =
    "pages.account.team.projectGrants.components.TeamProjectGrants";

const PAGE_SIZE = 10;

const grantStatus = (grant: ProjectGrant) =>
    (grant.status || DataStatus.ACTIVE).toUpperCase();

const isGrantInScope = (
    grant: ProjectGrant,
    teamId?: string,
    userId?: string
) => {
    if (teamId && grant.team_id != null) {
        return String(grant.team_id) === String(teamId);
    }
    if (!teamId && userId && grant.user_id) {
        return String(grant.user_id) === String(userId);
    }
    return true;
};

const grantSortValue = (grant: ProjectGrant, field: string) => {
    const details = getProjectGrantDetails(grant);
    if (field === "projectGrantName") return details.projectGrantName || "";
    if (field === "created_at") {
        return grant.created_at || details.projectGrantStartDate || "";
    }
    return grant.updated_at || details.projectGrantStartDate || "";
};

const hasPermission = (
    permissions: { [key: string]: boolean },
    action: "create" | "update" | "delete",
    teamId?: string
) =>
    permissions[`project-grants.${action}`] ||
    permissions[`collections.${action}`] ||
    !teamId;

const TeamProjectGrants = ({
    permissions,
    teamId,
    userId,
}: TeamProjectGrantsProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();
    const { showModal } = useModal();
    const searchParams = useSearchParams();
    const tab = searchParams?.get("tab");

    const [initialSort] = sortByOptions.filter(
        option => option.value === searchDefaultValues.sortField
    );

    const [queryParams, setQueryParams] = useState({
        status: DataStatus.ACTIVE.toLowerCase(),
        page: "1",
        sort: `${searchDefaultValues.sortField}:${initialSort.initialDirection}`,
        title: "",
    });

    const { control, watch, setValue } = useForm({
        defaultValues: {
            ...searchDefaultValues,
            sortDirection: initialSort.initialDirection,
        },
    });
    const watchAll = watch();

    useEffect(() => {
        const [option] = sortByOptions.filter(
            item => item.value === watchAll.sortField
        );
        setQueryParams(previous => ({
            ...previous,
            sort: `${watchAll.sortField}:${option.initialDirection}`,
        }));
        setValue("sortDirection", option.initialDirection);
    }, [watchAll.sortField, setValue]);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            sort: `${previous.sort.split(":")[0]}:${watchAll.sortDirection}`,
        }));
    }, [watchAll.sortDirection]);

    const filterTitleDebounced = useDebounce(watchAll.searchTitle, 500);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            title: filterTitleDebounced,
            page: "1",
        }));
    }, [filterTitleDebounced]);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            status: (
                searchParams?.get("tab") || DataStatus.ACTIVE
            ).toLowerCase(),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams?.get("tab")]);

    const {
        data,
        isLoading,
        mutate: mutateProjectGrants,
    } = useGet<PaginationType<ProjectGrant>>(
        `${apis.projectGrantsV1Url}?per_page=100&sort=created_at:desc`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const grants = (data?.list ?? []).filter(grant =>
        isGrantInScope(grant, teamId, userId)
    );
    const statusCounts = {
        [DataStatus.ACTIVE]: grants.filter(
            grant => grantStatus(grant) === DataStatus.ACTIVE
        ).length,
        [DataStatus.DRAFT]: grants.filter(
            grant => grantStatus(grant) === DataStatus.DRAFT
        ).length,
        [DataStatus.ARCHIVED]: grants.filter(
            grant => grantStatus(grant) === DataStatus.ARCHIVED
        ).length,
    };

    const visibleGrants = useMemo(() => {
        const needle = queryParams.title.trim().toLowerCase();
        const [sortField, sortDirection] = queryParams.sort.split(":");

        return grants
            .filter(grant => {
                if (grantStatus(grant) !== queryParams.status.toUpperCase()) {
                    return false;
                }
                if (!needle) return true;
                const details = getProjectGrantDetails(grant);
                return [
                    details.projectGrantName,
                    details.leadResearcher,
                    details.leadResearchInstitute,
                    formatGrantNumbers(details.grantNumbers),
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(needle);
            })
            .sort((left, right) => {
                const comparison = grantSortValue(
                    left,
                    sortField
                ).localeCompare(grantSortValue(right, sortField));
                return sortDirection === "asc" ? comparison : -comparison;
            });
    }, [grants, queryParams.sort, queryParams.status, queryParams.title]);

    const currentPage = parseInt(queryParams.page, 10) || 1;
    const lastPage = Math.max(1, Math.ceil(visibleGrants.length / PAGE_SIZE));
    const pageStart = (currentPage - 1) * PAGE_SIZE;
    const pageGrants = visibleGrants.slice(pageStart, pageStart + PAGE_SIZE);

    const patchProjectGrant = usePatch<Partial<ProjectGrant>>(
        apis.projectGrantsV1Url,
        {
            localeKey: "archiveProject",
        }
    );

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [queryParams.page]);

    const showArchiveButton =
        tab !== DataStatus.ARCHIVED &&
        hasPermission(permissions, "delete", teamId);
    const showUnarchiveButton =
        tab === DataStatus.ARCHIVED &&
        hasPermission(permissions, "update", teamId);
    const showAddNewButton = useMemo(
        () => hasPermission(permissions, "create", teamId),
        [permissions, teamId]
    );
    const showEditButton = hasPermission(permissions, "update", teamId);

    const listHref = teamId
        ? `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.PROJECT_GRANTS}`
        : `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.PROJECT_GRANTS}`;

    const actions = [
        ...(showEditButton
            ? [
                  {
                      href: listHref,
                      icon: EditIcon,
                      label: t("actions.edit.label"),
                  },
              ]
            : []),
        ...(showUnarchiveButton
            ? [
                  {
                      action: (id: number) => {
                          showModal({
                              tertiaryButton: {
                                  onAction: async () => {
                                      await patchProjectGrant(id, {
                                          status: DataStatus.ACTIVE,
                                      });
                                      mutateProjectGrants();
                                  },
                                  buttonText: t("actions.unarchive.buttonText"),
                              },
                              onSuccess: async () => {
                                  await patchProjectGrant(id, {
                                      status: DataStatus.DRAFT,
                                  });
                                  mutateProjectGrants();
                              },
                              confirmText: t("actions.unarchive.confirmText"),
                              title: t("actions.unarchive.title"),
                              content: t("actions.unarchive.content"),
                          });
                      },
                      icon: UnarchiveIcon,
                      label: t("actions.unarchive.label"),
                  },
              ]
            : []),
        ...(showArchiveButton
            ? [
                  {
                      action: async (id: number) => {
                          await patchProjectGrant(id, {
                              status: DataStatus.ARCHIVED,
                          });
                          mutateProjectGrants();
                      },
                      icon: ArchiveIcon,
                      label: t("actions.archive.label"),
                  },
              ]
            : []),
    ];

    const tabsList = [
        {
            label: capitalise(DataStatus.ACTIVE),
            value: DataStatus.ACTIVE,
            dsCount: statusCounts[DataStatus.ACTIVE],
        },
        {
            label: capitalise(DataStatus.DRAFT),
            value: DataStatus.DRAFT,
            dsCount: statusCounts[DataStatus.DRAFT],
        },
        {
            label: capitalise(DataStatus.ARCHIVED),
            value: DataStatus.ARCHIVED,
            dsCount: statusCounts[DataStatus.ARCHIVED],
        },
    ].map(tabItem => ({
        label: `${tabItem.label} (${tabItem.dsCount})`,
        value: tabItem.value,
        content: (
            <ProjectGrantsTab
                control={control}
                setValue={setValue}
                key={tabItem.value}
                label={tabItem.label}
                list={isLoading ? undefined : pageGrants}
                from={pageGrants.length ? pageStart + 1 : 0}
                to={pageStart + pageGrants.length}
                total={visibleGrants.length}
                lastPage={lastPage}
                currentPage={currentPage}
                setCurrentPage={page =>
                    setQueryParams({
                        ...queryParams,
                        page: page.toString(),
                    })
                }
                isLoading={isLoading}
                actions={actions}
            />
        ),
    }));

    const handleAdd = () => {
        router.push(`${listHref}/${RouteName.CREATE}`);
    };

    return (
        <>
            <Paper>
                <Box
                    sx={{
                        bgcolor: "white",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <Box sx={{ flexGrow: 1, p: 0 }}>
                        <Typography variant="h2">{t("title")}</Typography>
                        <Typography>{t("text")}</Typography>
                    </Box>

                    {showAddNewButton && (
                        <Button onClick={handleAdd} startIcon={<AddIcon />}>
                            {t("create")}
                        </Button>
                    )}
                </Box>
            </Paper>

            <Tabs
                centered
                tabs={tabsList}
                tabBoxSx={{ padding: 0, background: colors.white }}
                rootBoxSx={{ padding: 0 }}
            />
        </>
    );
};

export default TeamProjectGrants;
