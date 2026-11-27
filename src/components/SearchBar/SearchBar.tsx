import { ReactNode, useEffect, useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useTranslations } from "next-intl";
import theme from "@/config/theme";
import { SearchIcon } from "@/consts/icons";
import Button from "../Button";
import Paper from "../Paper";
import {
    ExplainerText,
    FormWrapper,
    InputWrapper,
    SearchForm,
    SearchInput,
} from "./SearchBar.styles";

const TRANSLATION_PATH = "pages.search.components.SearchBar";

interface SearchBarProps {
    resetAction: () => void;
    submitAction: (fieldValues: FieldValues) => void;
    inputOverrideAction?: () => void;
    valueOverride?: string;
    defaultValue?: string;
    queryName: string;
    queryPlaceholder: string;
    fullWidth?: boolean;
    /** Explainer shown below the search field (e.g. search scope hint). */
    explainerText?: string;
    /** Disables the search input when true. */
    isDisabled?: boolean;
    /** When set with `onSynopsesToggle`, synopses visibility is controlled by the parent (e.g. search results). */
    synopsesExpanded?: boolean;
    onSynopsesToggle?: () => void;
    /** Replaces the default sort select, for example the dataset sort. */
    sortSlot?: ReactNode;
}
export const TEST_ID_WRAPPER = "search-bar";
export const TEST_ID_RESET_BUTTON = "reset-btn";

const SEARCH_ICON_SIZE = "32px";
const CROSS_ICON_SIZE = "32px";
const SearchBar = ({
    resetAction,
    submitAction,
    inputOverrideAction,
    valueOverride,
    defaultValue,
    queryName,
    queryPlaceholder,
    fullWidth = false,
    explainerText,
    isDisabled = false,
    synopsesExpanded: synopsesExpandedProp,
    onSynopsesToggle,
    sortSlot,
}: SearchBarProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const sortOptions = useMemo(
        () => [
            { value: "favourite", label: t("favourite") },
            { value: "dateAdded", label: t("updatedDate") },
            { value: "studyTitle", label: t("studyTitle") },
            { value: "leadResearcherInstitute", label: t("leadResearcher") },
            { value: "populationSize", label: t("populationSize") },
            { value: "position", label: t("accessibility") },
            { value: "earliestData", label: t("earliestData") },
            { value: "dateStarted", label: t("startDate") },
        ],
        [t]
    );
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: { [queryName]: defaultValue },
    });
    const [synopsesExpandedInternal, setSynopsesExpandedInternal] =
        useState(true);
    const isSynopsesControlled =
        synopsesExpandedProp !== undefined && onSynopsesToggle !== undefined;
    const synopsesExpanded = isSynopsesControlled
        ? synopsesExpandedProp!
        : synopsesExpandedInternal;
    const [sortColumn, setSortColumn] = useState("dateAdded");
    useEffect(() => {
        setValue(queryName, valueOverride);
    }, [queryName, setValue, valueOverride]);

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                p: 1,
                mb: 0,
                bgcolor: "#f1f1f1",
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
                flexWrap: "nowrap",
            }}>
            <FormWrapper
                data-testid={TEST_ID_WRAPPER}
                sx={{ flex: "0 0 50%", minWidth: 0, marginTop: 1 }}>
                <SearchForm onSubmit={handleSubmit(submitAction)} role="search">
                    <InputWrapper
                        onClick={() =>
                            inputOverrideAction && inputOverrideAction()
                        }>
                        <SearchInput
                            control={control}
                            name={queryName}
                            label=""
                            placeholder={queryPlaceholder}
                            disabled={isDisabled}
                            sx={{
                                border: `2px solid ${theme.palette.greyCustom.main}`,
                            }}
                            inputProps={{
                                "aria-label": "Search",
                            }}
                            icon={SearchIcon}
                            startAdornmentSize={SEARCH_ICON_SIZE}
                            showClearButton
                            clearButtonSize={CROSS_ICON_SIZE}
                            resetAction={resetAction}
                            setValue={setValue}
                        />
                    </InputWrapper>
                </SearchForm>
                {explainerText ? (
                    <ExplainerText sx={{ mt: 0.5 }}>
                        {explainerText}
                    </ExplainerText>
                ) : null}
            </FormWrapper>

            {sortSlot ?? (
                <TextField
                    select
                    label={t("sortBy")}
                    size="small"
                    value={sortColumn}
                    onChange={event => setSortColumn(event.target.value)}
                    sx={{ width: 180, bgcolor: "white", flexShrink: 0 }}>
                    {sortOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            )}

            {/* Collapse/Expand Toggle */}
            <Button
                type="button"
                aria-expanded={synopsesExpanded}
                aria-controls="search-results-synopses"
                onClick={() =>
                    isSynopsesControlled
                        ? onSynopsesToggle!()
                        : setSynopsesExpandedInternal(v => !v)
                }
                sx={{
                    ml: "auto",
                    textTransform: "none",
                    fontWeight: "bold",
                    flexShrink: 0,
                }}>
                {synopsesExpanded ? t("collapseSynopses") : t("expandSynopses")}
            </Button>
        </Paper>
    );
};

export default SearchBar;
