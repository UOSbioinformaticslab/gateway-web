import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ProjectGrant } from "@/interfaces/ProjectGrant";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import InputWrapper from "@/components/InputWrapper";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import ProjectGrantCard from "@/components/ProjectGrantCard";
import ShowingXofX from "@/components/ShowingXofX";
import {
    searchFilter,
    sortField,
    toggleDirection,
} from "@/config/forms/projectGrantAccountSearch";

const TRANSLATION_PATH =
    "pages.account.team.projectGrants.components.ProjectGrantsTab";

interface ProjectGrantsTabProps {
    list?: ProjectGrant[];
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
    lastPage?: number;
    from?: number;
    to?: number;
    control: Control;
    total?: number;
    label: string;
    currentPage: number;
    setValue: (name: string, value: unknown) => void;
    setCurrentPage: (page: number) => void;
    isLoading: boolean;
}

const ProjectGrantsTab = ({
    actions,
    list,
    label,
    lastPage,
    from,
    to,
    total,
    currentPage,
    setCurrentPage,
    control,
    setValue,
    isLoading,
}: ProjectGrantsTabProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Box sx={{ p: 0 }}>
            <BoxContainer
                sx={{
                    my: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                <Box sx={{ p: 0, width: "50%" }}>
                    <InputWrapper
                        setValue={setValue}
                        control={control}
                        {...searchFilter}
                    />
                </Box>
                <BoxContainer
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <Box sx={{ p: 0 }}>
                        <InputWrapper control={control} {...sortField} />
                    </Box>
                    <Box sx={{ p: 0 }}>
                        <InputWrapper control={control} {...toggleDirection} />
                    </Box>
                </BoxContainer>
            </BoxContainer>

            <Box
                sx={{
                    p: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                <ShowingXofX from={from} to={to} total={total} />
            </Box>

            {(list || []).map(projectGrant => (
                <ProjectGrantCard
                    actions={actions}
                    key={projectGrant.id}
                    projectGrant={projectGrant}
                />
            ))}
            {list?.length === 0 && (
                <Paper sx={{ p: 2, mb: 2 }}>
                    {t("notFound", { label: label.toLowerCase() })}
                </Paper>
            )}
            <Pagination
                isLoading={isLoading}
                page={currentPage}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setCurrentPage(page)
                }
            />
        </Box>
    );
};

export default ProjectGrantsTab;
