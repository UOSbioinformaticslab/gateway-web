import { FormHydrationSchema } from "@/interfaces/FormHydration";
import { formHydrationData } from "./formData.js";

const encodeOrganisationLogo = (formJSON: FormHydrationSchema): FormHydrationSchema => {
    const orgImage = formJSON.defaultValues["Organisation Logo"];
    if (typeof orgImage === "string") {
        formJSON.defaultValues["Organisation Logo"] = encodeURI(orgImage);
    }
    return formJSON;
};

export const getLocalFormHydration = (
    teamId?: string | number
): FormHydrationSchema => {
    const defaultValues = {
        ...formHydrationData.defaultValues,
        ...(teamId !== undefined ? { team_id: Number(teamId) } : {}),
    };

    return encodeOrganisationLogo({
        ...formHydrationData,
        defaultValues,
    } as FormHydrationSchema);
};
