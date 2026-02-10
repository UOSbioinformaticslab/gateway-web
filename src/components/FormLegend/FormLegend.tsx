"use client";

import { Fragment } from "react";
import { ListItemButton } from "@mui/material";
import { LegendItem, LegendStatus } from "@/interfaces/FormLegend";
import { colors } from "@/config/theme";
import { CloseIcon, CheckIcon, PriorityHighIcon } from "@/consts/icons";
import { capitalise, splitCamelcase } from "@/utils/general";
import Box from "../Box";
import Typography from "../Typography";
import { Wrapper, LegendIcon } from "./FormLegend.styles";

interface FormLegendProps {
    items: LegendItem[];
    offsetTop?: string;
    level?: number;
    removeMarginLeft?: boolean;
    handleClickItem?: (itemIndex: number) => void;
}

const getIcon = (status: LegendStatus) => {
    switch (status) {
        case LegendStatus.VALID:
            return <CheckIcon />;
        case LegendStatus.OPTIONAL_REMAIN:
            return <PriorityHighIcon />;
        case LegendStatus.INVALID:
            return <CloseIcon />;
        default:
            return null;
    }
};

const getBackgroundColour = (status: LegendStatus) => {
    switch (status) {
        case LegendStatus.VALID:
            return colors.green400;
        case LegendStatus.ACTIVE:
            return colors.purple500;
        case LegendStatus.OPTIONAL_REMAIN:
            return "#F0BB24";
        case LegendStatus.INVALID:
            return colors.red700;
        default:
            return colors.purple100;
    }
};

const FormLegend = ({
    items,
    offsetTop,
    level = 1,
    removeMarginLeft,
    handleClickItem,
}: FormLegendProps) => {
    return (
        <Wrapper
            offsetTop={offsetTop || "initial"}
            sx={{ justifyContent: "center" }}>
            {items.map((item, index) => {
                const Icon = item.icon;

                return (
                    <Fragment key={item.name}>
                     
                        {item.subItems && (
                            <FormLegend
                                items={item.subItems}
                                level={level + 1}
                                handleClickItem={handleClickItem}
                            />
                        )}
                    </Fragment>
                );
            })}
        </Wrapper>
    );
};

export default FormLegend;
