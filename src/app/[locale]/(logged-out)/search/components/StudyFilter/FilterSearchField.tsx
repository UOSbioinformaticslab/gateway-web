"use client";

import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    CircularProgress,
    InputAdornment,
    TextField,
} from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import {
    FILTER_COLORS,
    MIN_SEARCH_LENGTH,
    TRANSLATION_PATH,
} from "./constants";

type FilterSearchFieldProps = {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    isSearching: boolean;
    placeholder?: string;
    sx?: SxProps<Theme>;
    textFieldSx?: SxProps<Theme>;
};

const FilterSearchField = ({
    searchTerm,
    setSearchTerm,
    isSearching,
    placeholder,
    sx,
    textFieldSx,
}: FilterSearchFieldProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const showHelper =
        searchTerm.length > 0 && searchTerm.length < MIN_SEARCH_LENGTH;

    return (
        <Box sx={[{ mb: 3 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
            <TextField
                fullWidth
                placeholder={
                    placeholder ??
                    t("searchPlaceholder", { min: MIN_SEARCH_LENGTH })
                }
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                size="small"
                variant="outlined"
                helperText={
                    showHelper
                        ? t("searchMinLength", { min: MIN_SEARCH_LENGTH })
                        : ""
                }
                sx={[
                    {
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "white",
                        },
                    },
                    ...(Array.isArray(textFieldSx)
                        ? textFieldSx
                        : textFieldSx
                        ? [textFieldSx]
                        : []),
                ]}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            {isSearching ? (
                                <CircularProgress
                                    size={20}
                                    sx={{ color: FILTER_COLORS.pink }}
                                />
                            ) : (
                                <SearchIcon color="disabled" />
                            )}
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default FilterSearchField;
