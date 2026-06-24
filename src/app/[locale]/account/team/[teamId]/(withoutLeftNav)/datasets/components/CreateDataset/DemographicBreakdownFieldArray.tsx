import React, { useEffect, useRef } from "react";
import { Control, Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FormHydration } from "@/interfaces/FormHydration";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import {
    buildDemographicBreakdownRows,
    getDemographicBreakdownFieldTitles,
    renderFormHydrationField,
} from "@/utils/formHydration";

type FormValues = Record<string, unknown>;

interface DemographicBreakdownFieldArrayProps {
    control: Control<FormValues>;
    fieldParent: FormHydration;
    setSelectedField?: (fieldName: string, fieldArrayName: string) => void;
    footnote?: string;
}

const DemographicBreakdownFieldArray = ({
    control,
    fieldParent,
    setSelectedField,
    footnote,
}: DemographicBreakdownFieldArrayProps) => {
    const { getValues } = useFormContext();
    const { fields, replace } = useFieldArray({
        control,
        name: fieldParent.title,
    });

    const hasInitializedRows = useRef(false);
    const { binTitle, countTitle, countField } =
        getDemographicBreakdownFieldTitles(fieldParent);

    useEffect(() => {
        if (hasInitializedRows.current || !binTitle || !countTitle) {
            return;
        }

        const existingRows =
            (getValues(fieldParent.title) as Record<string, unknown>[]) ?? [];
        const options = buildDemographicBreakdownRows(
            fieldParent,
            existingRows
        );
        if (options.length === 0) {
            return;
        }

        hasInitializedRows.current = true;
        replace(options);
    }, [fieldParent, binTitle, countTitle, replace, getValues]);

    if (!countField) {
        return null;
    }

    return (
        <div key={`${fieldParent.title}_breakdown`}>
            {fields.map((field, index) => {
                const label = String(field[binTitle] ?? "");

                return (
                    <Box
                        key={field.id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 3,
                            py: 1,
                        }}>
                        <Typography
                            sx={{
                                flex: 1,
                                fontSize: "1rem",
                                color: colors.grey800,
                                pr: 2,
                            }}>
                            {label}
                        </Typography>
                        <Box
                            sx={{
                                width: 108,
                                flexShrink: 0,
                                "& .MuiFormControl-root": { m: 0, width: "100%" },
                                "& .MuiInputBase-root": {
                                    bgcolor: "background.paper",
                                    borderRadius: 1,
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: colors.grey300,
                                },
                                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "primary.main",
                                },
                            }}>
                            {renderFormHydrationField(
                                {
                                    ...countField,
                                    label: "",
                                    required: false,
                                    placeholder: 0,
                                },
                                control,
                                `${fieldParent.title}.${index}.${countField.name}`,
                                (fieldName: string) =>
                                    setSelectedField?.(
                                        fieldName,
                                        fieldParent.title
                                    )
                            )}
                        </Box>
                        <Controller
                            control={control}
                            name={`${fieldParent.title}.${index}.${binTitle}`}
                            render={({ field: hiddenField }) => (
                                <input type="hidden" {...hiddenField} />
                            )}
                        />
                    </Box>
                );
            })}
            {footnote ? (
                <Typography
                    sx={{
                        color: colors.grey600,
                        fontSize: "0.875rem",
                        mt: 1.5,
                    }}>
                    {footnote}
                </Typography>
            ) : null}
        </div>
    );
};

export default DemographicBreakdownFieldArray;
