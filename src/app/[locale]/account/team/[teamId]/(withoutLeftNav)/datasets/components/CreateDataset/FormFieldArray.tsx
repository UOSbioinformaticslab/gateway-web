import React, { useEffect, useMemo, useRef } from "react";
import { Control, useFieldArray, useFormState } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
    FormHydration,
    FormHydrationField,
} from "@/interfaces/FormHydration";
import { Option } from "@/interfaces/Option";
import { Defs } from "@/interfaces/V4Schema";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import theme, { colors } from "@/config/theme";
import { AddIcon } from "@/consts/icons";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import {
    getFormHydrationFieldHeaderProps,
    renderFormHydrationField,
    withFormHydrationPanelOnlyFieldContent,
} from "@/utils/formHydration";
import DatasetTypeFormFieldRow from "./DatasetTypeFormFieldRow";
import FormHydrationFieldHeader from "./FormHydrationFieldHeader";
import FormHydrationFieldPanel from "./FormHydrationFieldPanel";

type FieldValues = {
    [key: string]: string | number | Option[] | boolean | null | undefined;
};

type FormValues = Record<string, unknown>;

interface CreateDatasetProps {
    control: Control<FormValues>;
    fieldParent: FormHydration;
    setSelectedField?: (fieldName: string, fieldArrayName: string) => void;
    formArrayValues: FormValues[] | null;
    schemadefs: Defs;
    /** Adjust leaf field defs before render (e.g. dataset version hints). */
    patchLeafField?: (
        leaf: FormHydrationField,
        ctx: { rowKey: string; index: number; fieldParent: FormHydration }
    ) => FormHydrationField;
    hideGroupTitle?: boolean;
    /** Hide per-row remove and the append “add” control (single-row groups). */
    hideArrayMutators?: boolean;
    /** Render each array field inside a bordered panel (label + description above input). */
    useFieldPanels?: boolean;
}

const FormFieldArray = ({
    control,
    fieldParent,
    setSelectedField,
    formArrayValues,
    schemadefs,
    patchLeafField,
    hideGroupTitle = false,
    hideArrayMutators = false,
    useFieldPanels = false,
}: CreateDatasetProps) => {
    const { errors } = useFormState({ control, name: fieldParent.title });

    const isDatasetType = fieldParent.title
        .toLowerCase()
        .includes("dataset type array");
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const { fields, append, remove } = useFieldArray({
        control,
        name: fieldParent.title,
    });

    const hasInitializedDefaultRow = useRef(false);

    const generateEmptyArrayFields = useMemo(() => {
        return fieldParent?.fields?.reduce<FieldValues>((acc, field) => {
            acc[field.title] = undefined;
            return acc;
        }, {});
    }, [fieldParent]);

    useEffect(() => {
        if (!hideArrayMutators || isDatasetType || hasInitializedDefaultRow.current) {
            return;
        }

        if (fields.length === 0 && generateEmptyArrayFields) {
            hasInitializedDefaultRow.current = true;
            append(generateEmptyArrayFields);
        }
    }, [
        hideArrayMutators,
        isDatasetType,
        fields.length,
        append,
        generateEmptyArrayFields,
    ]);

    const groupHeader = getFormHydrationFieldHeaderProps({
        title: fieldParent.title.replace(" Array", ""),
        description: fieldParent.description,
    });

    return (
        <div key={`${fieldParent.title}_fieldarray`}>
            {!hideGroupTitle && !isDatasetType && groupHeader.show && (
                <FormHydrationFieldHeader
                    title={groupHeader.title}
                    description={groupHeader.description}
                />
            )}
            {!hideGroupTitle && !isDatasetType && !groupHeader.show && (
                <Typography sx={{ mb: 1 }}>
                    {fieldParent.title.replace(" Array", "")}
                    {fieldParent.required && (
                        <Typography
                            component="span"
                            sx={{ color: colors.red700 }}>
                            *
                        </Typography>
                    )}
                </Typography>
            )}

            {errors?.[fieldParent.title]?.message && (
                <Typography sx={{ color: colors.red700 }}>
                    {errors[fieldParent.title].message as string}
                </Typography>
            )}
            {isDatasetType &&
                formArrayValues?.map((_, index) => (
                    <DatasetTypeFormFieldRow
                        schemadefs={schemadefs}
                        key={fieldParent.title}
                        index={index}
                        control={control}
                        fieldParent={fieldParent}
                        fieldData={formArrayValues[index]}
                        setSelectedField={setSelectedField}
                        remove={remove}
                        subtypeOptions={[]}
                    />
                ))}

            {!isDatasetType &&
                fields.map((field, index) => (
                    <Box
                        key={field.id}
                        sx={{ mb: theme.spacing(3) }}>
                        {Object.entries(field)
                            .filter(([key]) => key !== "id")
                            .map(([key]) => {
                                const arrayField = fieldParent?.fields?.find(
                                    schemaChild => schemaChild.title === key
                                );

                                const rawLeaf = arrayField?.field;
                                const leafField =
                                    rawLeaf && patchLeafField
                                        ? patchLeafField(rawLeaf, {
                                              rowKey: key,
                                              index,
                                              fieldParent,
                                          })
                                        : rawLeaf;
                                const pathSuffix =
                                    leafField?.name || key || "";

                                return (
                                    <React.Fragment key={key}>
                                        {leafField &&
                                            (useFieldPanels && arrayField ? (
                                                <FormHydrationFieldPanel>
                                                    {renderFormHydrationField(
                                                        withFormHydrationPanelOnlyFieldContent(
                                                            leafField,
                                                            arrayField
                                                        ),
                                                        control,
                                                        `${fieldParent.title}.${index}.${pathSuffix}`,
                                                        (fieldTest: string) =>
                                                            setSelectedField &&
                                                            setSelectedField(
                                                                fieldTest,
                                                                fieldParent.title
                                                            )
                                                    )}
                                                </FormHydrationFieldPanel>
                                            ) : (
                                                renderFormHydrationField(
                                                    leafField,
                                                    control,
                                                    `${fieldParent.title}.${index}.${pathSuffix}`,
                                                    (fieldTest: string) =>
                                                        setSelectedField &&
                                                        setSelectedField(
                                                            fieldTest,
                                                            fieldParent.title
                                                        )
                                                )
                                            ))}
                                    </React.Fragment>
                                );
                            })}
                        {!hideArrayMutators && (
                            <Button
                                onClick={() => remove(index)}
                                variant="outlined">
                                {t("remove")}
                            </Button>
                        )}
                    </Box>
                ))}

            {!isDatasetType && !hideArrayMutators && (
                <Button
                    onClick={() => append(generateEmptyArrayFields)}
                    startIcon={<AddIcon sx={{ height: 14, width: 14 }} />}
                    sx={{ mb: theme.spacing(3) }}>
                    {t("add")}
                </Button>
            )}
        </div>
    );
};

export default FormFieldArray;
