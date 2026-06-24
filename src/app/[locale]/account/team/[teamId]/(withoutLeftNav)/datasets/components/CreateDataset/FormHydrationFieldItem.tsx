import { Fragment } from "react";
import { Control } from "react-hook-form";
import { FormHydration } from "@/interfaces/FormHydration";
import { Defs } from "@/interfaces/V4Schema";
import {
    getFormHydrationFieldHeaderProps,
    isDemographicBreakdownArray,
    isPanelOnlyFormField,
    renderFormHydrationField,
    withFormHydrationFieldPanelContent,
    withFormHydrationPanelOnlyFieldContent,
} from "@/utils/formHydration";
import FormFieldArray from "./FormFieldArray";
import DemographicBreakdownFieldArray from "./DemographicBreakdownFieldArray";
import FormHydrationFieldHeader from "./FormHydrationFieldHeader";
import FormHydrationFieldPanel from "./FormHydrationFieldPanel";

type FormValues = Record<string, unknown>;

interface FormHydrationFieldItemProps {
    fieldParent: FormHydration;
    selectedFormSection: string;
    index: number;
    control: Control<FormValues>;
    schemadefs: Defs;
    getValues: (name?: string) => unknown;
    updateGuidanceText: (fieldName: string, fieldArrayName?: string) => void;
    hideGroupTitle?: boolean;
    hideArrayMutators?: boolean;
    useFieldPanels?: boolean;
    useBreakdownLayout?: boolean;
    breakdownFootnote?: string;
}

const FormHydrationFieldItem = ({
    fieldParent,
    selectedFormSection,
    index,
    control,
    schemadefs,
    getValues,
    updateGuidanceText,
    hideGroupTitle = false,
    hideArrayMutators = false,
    useFieldPanels = false,
    useBreakdownLayout = false,
    breakdownFootnote,
}: FormHydrationFieldItemProps) => {
    const { field, fields } = fieldParent;
    const listKey = `${selectedFormSection}-${fieldParent.location ?? ""}-${fieldParent.title ?? field?.name ?? ""}-${index}`;
    const panelOnly = isPanelOnlyFormField(fieldParent.location);
    const fieldHeader = getFormHydrationFieldHeaderProps(fieldParent);
    const showFieldHeader = fieldHeader.show && !panelOnly;
    const showFieldPanel = panelOnly || fieldHeader.show;

    return (
        <Fragment key={listKey}>
            {showFieldHeader && (
                <FormHydrationFieldHeader
                    title={fieldHeader.title}
                    description={fieldHeader.description}
                />
            )}
            {fields?.length ? (
                useBreakdownLayout && isDemographicBreakdownArray(fieldParent.location) ? (
                    <DemographicBreakdownFieldArray
                        control={control}
                        fieldParent={fieldParent}
                        setSelectedField={updateGuidanceText}
                        footnote={breakdownFootnote}
                    />
                ) : (
                    <FormFieldArray
                    schemadefs={schemadefs}
                    control={control}
                    formArrayValues={
                        getValues(fieldParent.title) as unknown as FormValues[]
                    }
                    fieldParent={fieldParent}
                    setSelectedField={updateGuidanceText}
                    hideGroupTitle={hideGroupTitle}
                    hideArrayMutators={hideArrayMutators}
                    useFieldPanels={useFieldPanels}
                />
                )
            ) : (
                field &&
                (showFieldPanel ? (
                    <FormHydrationFieldPanel>
                        {renderFormHydrationField(
                            panelOnly
                                ? withFormHydrationPanelOnlyFieldContent(
                                      field,
                                      fieldParent
                                  )
                                : withFormHydrationFieldPanelContent(
                                      field,
                                      fieldParent
                                  ),
                            control,
                            undefined,
                            updateGuidanceText
                        )}
                    </FormHydrationFieldPanel>
                ) : (
                    renderFormHydrationField(
                        field,
                        control,
                        undefined,
                        updateGuidanceText
                    )
                ))
            )}
        </Fragment>
    );
};

export default FormHydrationFieldItem;
