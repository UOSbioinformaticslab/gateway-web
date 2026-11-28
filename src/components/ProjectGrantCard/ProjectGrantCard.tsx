import { useTranslations } from "next-intl";
import {
    ProjectGrant,
    formatGrantNumbers,
    getProjectGrantDetails,
} from "@/interfaces/ProjectGrant";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { formatDate } from "@/utils/date";
import CardActions from "../CardActions";
import KeyValueList from "../KeyValueList";

interface ProjectGrantCardProps {
    projectGrant: ProjectGrant;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
}

const TRANSLATION_PATH = "components.ProjectGrantCard";

const ProjectGrantCard = ({ projectGrant, actions }: ProjectGrantCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const details = getProjectGrantDetails(projectGrant);
    const start = details.projectGrantStartDate
        ? formatDate(details.projectGrantStartDate, "DD MMMM YYYY")
        : "";
    const end = details.projectGrantEndDate
        ? formatDate(details.projectGrantEndDate, "DD MMMM YYYY")
        : "";
    const dates = [start, end].filter(Boolean).join(" – ");

    return (
        <Paper sx={{ mb: 2 }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(1, 1fr 50px)",
                    p: 0,
                }}>
                <Box sx={{ p: 2 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            mb: 2,
                            fontSize: 16,
                            wordBreak: "break-word",
                        }}>
                        {details.projectGrantName}
                    </Typography>
                    <KeyValueList
                        rows={[
                            {
                                key: t("leadResearcher"),
                                value: details.leadResearcher || "-",
                            },
                            {
                                key: t("institute"),
                                value: details.leadResearchInstitute || "-",
                            },
                            {
                                key: t("grantNumber"),
                                value:
                                    formatGrantNumbers(details.grantNumbers) ||
                                    "-",
                            },
                            {
                                key: t("dates"),
                                value: dates || "-",
                            },
                            {
                                key: t("lastActivity"),
                                value: projectGrant.updated_at
                                    ? formatDate(
                                          projectGrant.updated_at,
                                          "DD MMMM YYYY HH:mm"
                                      )
                                    : "-",
                            },
                        ]}
                    />
                </Box>
                <Box sx={{ p: 0, borderLeft: `solid 1px ${colors.grey600}` }}>
                    <CardActions
                        actions={actions}
                        id={Number(projectGrant.id)}
                        status={projectGrant.status}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default ProjectGrantCard;
