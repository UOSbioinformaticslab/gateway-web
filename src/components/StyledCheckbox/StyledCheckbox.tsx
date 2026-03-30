import { MouseEvent } from "react";
import { SxProps } from "@mui/material";
import MuiCheckbox, {
    CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import {
    CheckboxCheckedIcon,
    CheckboxIcon,
    CheckboxIndeterminateIcon,
} from "@/consts/icons";

export interface StyledCheckboxProps extends MuiCheckboxProps {
    size?: "small" | "medium" | "large";
    iconSx?: SxProps;
    stopPropagation?: boolean;
    /** Consumed by form field wrappers; must not reach the DOM. */
    formControlSx?: SxProps;
}

const StyledCheckbox = ({
    size = "small",
    iconSx,
    stopPropagation,
    formControlSx: _formControlSx,
    ...rest
}: StyledCheckboxProps) => {
    return (
        <MuiCheckbox
            icon={<CheckboxIcon sx={{ ...iconSx }} size={size} />}
            checkedIcon={<CheckboxCheckedIcon sx={{ ...iconSx }} size={size} />}
            indeterminateIcon={
                <CheckboxIndeterminateIcon sx={{ ...iconSx }} size={size} />
            }
            onClick={(event: MouseEvent<HTMLElement>) => {
                if (stopPropagation) {
                    event.stopPropagation();
                }
            }}
            {...rest}
        />
    );
};

export default StyledCheckbox;
