import { useEffect,useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import theme, { colors } from "@/config/theme";
import { SearchIcon } from "@/consts/icons";
import {
    FormWrapper,
    InputWrapper,
    SearchForm,
    SearchInput,
} from "./SearchBar.styles";
import Paper from "../Paper";
import Button from "../Button";

import MenuItem from "@mui/material/MenuItem";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Badge,TextField, Checkbox, FormControlLabel, IconButton } from "@mui/material";


interface SearchBarProps {
    resetAction: () => void;
    submitAction: (fieldValues: FieldValues) => void;
    inputOverrideAction?: () => void;
    valueOverride?: string;
    defaultValue?: string;
    queryName: string;
    queryPlaceholder: string;
    fullWidth?: boolean;
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
}: SearchBarProps) => {
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: { [queryName]: defaultValue },
    });
    const [cart, setCart] = useState([]);
    const [isDeepSearch, setIsDeepSearch] = useState(false);
    const [showSynopsis, setShowSynopsis] = useState(true);
    const [showCartModal, setShowCartModal] = useState(false);
    const [sortConfig, setSortConfig] = useState({ column: 'dateAdded', direction: 'desc' });
    const handleSort = (column) => {
        setSortConfig(prevConfig => ({
            column,
            direction: prevConfig.column === column && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    useEffect(() => {
        setValue(queryName, valueOverride);
    }, [queryName, setValue, valueOverride]);

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                p: 2,
                mb: 3,
                bgcolor: '#f1f1f1',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                width: '100%',
                flexWrap: 'nowrap',
            }}
        >
            <FormWrapper 
                data-testid={TEST_ID_WRAPPER}
                sx={{ flex: '0 0 50%', minWidth: 0 }}
            >
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
            </FormWrapper>

            {/* Cart Badge */}
            <IconButton onClick={() => setShowCartModal(true)} color="primary" sx={{ flexShrink: 0 }}>
                <Badge badgeContent={cart.length} color="error">
                    <ShoppingCartIcon sx={{ fontSize: 28 }} />
                </Badge>
            </IconButton>

            {/* Deep Search Checkbox */}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isDeepSearch}
                        onChange={(e) => setIsDeepSearch(e.target.checked)}
                        color="primary"
                    />
                }
                label="Deep Search"
                sx={{ flexShrink: 0 }}
            />

            {/* Sort Dropdown */}
            <TextField
                select
                label="Sort by"
                size="small"
                value={sortConfig.column}
                onChange={(e) => handleSort(e.target.value)}
                sx={{ width: 180, bgcolor: 'white', flexShrink: 0 }}
            >
                <MenuItem value="favourite">Favourites</MenuItem>
                <MenuItem value="dateAdded">Updated Date</MenuItem>
                <MenuItem value="studyTitle">Study Title</MenuItem>
                <MenuItem value="leadResearcherInstitute">Lead Researcher</MenuItem>
                <MenuItem value="populationSize">Population Size</MenuItem>
                <MenuItem value="position">Accessibility</MenuItem>
                <MenuItem value="earliestData">Earliest Data</MenuItem>
                <MenuItem value="dateStarted">Start Date</MenuItem>
            </TextField>

            {/* Collapse/Expand Toggle */}
            <Button
                onClick={() => setShowSynopsis(!showSynopsis)}
                sx={{ ml: 'auto', textTransform: 'none', fontWeight: 'bold', flexShrink: 0 }}
            >
                {showSynopsis ? "Collapse Synopses" : "Expand Synopses"}
            </Button>
        </Paper>
    );
};

export default SearchBar;

