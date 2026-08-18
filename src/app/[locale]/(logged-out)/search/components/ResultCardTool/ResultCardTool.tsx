import { Collapse, ListItem, ListItemText } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchResultTool } from "@/interfaces/Search";
import Box from "@/components/Box";
import Button from "@/components/Button";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import ToolDetailsDialog from "@/modules/ToolDetailsDialog";
import useDialog from "@/hooks/useDialog";
import { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import { ToolDescription } from "./ResultCardTool.styles";

interface ResultCardToolProps {
    result: SearchResultTool;
    /** When false, the description synopsis is hidden. */
    showSynopsis?: boolean;
}

const TRANSLATION_PATH = "pages.search.components.ResultCardTool";

const ResultCardTool = ({
    result,
    showSynopsis = true,
}: ResultCardToolProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { _id: toolId } = result;

    const { showDialog } = useDialog();

    const handleShowAll = () => {
        showDialog(ToolDetailsDialog, { result });
    };

    const { name, description } = result;

    return (
        <ListItem
            alignItems="flex-start"
            sx={{
                borderBottom: `1px solid ${colors.grey300}`,
                "&:last-of-type": {
                    borderBottom: "none",
                    pb: 0,
                },
            }}>
            <ListItemText
                disableTypography
                primary={
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            p: 0,
                            mb: 1.5,
                        }}>
                        <Link
                            href={`/${RouteName.TOOL_ITEM}/${toolId}`}
                            fontSize={16}
                            fontWeight={600}>
                            <EllipsisLineLimit text={name} component="span" />
                        </Link>
                        {description && (
                            <Button
                                onClick={handleShowAll}
                                size="small"
                                variant="outlined"
                                color="secondary"
                                sx={{
                                    flexShrink: 0,
                                    alignItems: "flex-start",
                                    ml: 2,
                                }}
                                aria-label={`Quick view: ${name}`}>
                                {t("showAll")}
                            </Button>
                        )}
                    </Box>
                }
                secondary={
                    <Collapse in={showSynopsis} timeout="auto" unmountOnExit>
                        <ToolDescription
                            maxLine={2}
                            component="div"
                            text={
                                description ? (
                                    <MarkDownSanitizedWithHtml
                                        content={description}
                                    />
                                ) : (
                                    t("notAvailable")
                                )
                            }
                        />
                    </Collapse>
                }
            />
        </ListItem>
    );
};

export default ResultCardTool;
