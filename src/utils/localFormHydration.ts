import { FormHydrationSchema } from "@/interfaces/FormHydration";
import { getDemographicFrequencyDefaultValues } from "./demographicFrequencyDefaults";
import { formHydrationData } from "./formData.js";
import { enrichFormHydration } from "./semanticFormEnricher";
import semanticSchema from "cruk-semantic-schema";

const encodeOrganisationLogo = (formJSON: FormHydrationSchema): FormHydrationSchema => {
    const orgImage = formJSON.defaultValues?.["Organisation Logo"];
    if (typeof orgImage === "string") {
        formJSON.defaultValues["Organisation Logo"] = encodeURI(orgImage);
    }
    return formJSON;
};

export const getLocalFormHydration = (
    teamId?: string | number
): FormHydrationSchema => {
    // 1. Dynamically enrich and filter baseline formHydrationData using semanticSchema
    const enrichedFormJSON = enrichFormHydration(
        formHydrationData as unknown as FormHydrationSchema,
        semanticSchema
    );

    // 2. Compute dynamic default values
    const defaultValues = {
        ...enrichedFormJSON.defaultValues,
        ...getDemographicFrequencyDefaultValues(),
        ...(teamId !== undefined ? { team_id: Number(teamId) } : {}),
    };

    return encodeOrganisationLogo({
        ...enrichedFormJSON,
        defaultValues: defaultValues as any,
    });
};
