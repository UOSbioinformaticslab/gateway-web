import dayjs from "dayjs";
import * as yup from "yup";
import { inputComponents } from ".";

const defaultValues = {
    projectGrantName: "",
    leadResearcher: "",
    leadResearchInstitute: "",
    grantNumbers: "",
    projectGrantStartDate: null,
    projectGrantEndDate: null,
    projectGrantScope: "",
};

const validationSchema = yup.object().shape({
    projectGrantName: yup
        .string()
        .required()
        .min(2)
        .label("Project Grant Title"),
    leadResearcher: yup.string().required().min(2).label("Lead researcher"),
    leadResearchInstitute: yup
        .string()
        .required()
        .min(2)
        .label("Lead research institute"),
    grantNumbers: yup.string().required().label("Grant number(s)"),
    projectGrantStartDate: yup.mixed().nullable().label("Project start date"),
    projectGrantEndDate: yup
        .mixed()
        .nullable()
        .label("Project end date")
        .test(
            "end-after-start",
            "Project end date must be on or after the start date",
            function validateEndDate(value) {
                const start = this.parent.projectGrantStartDate;
                if (!value || !start) return true;
                const endDate = dayjs(value as string);
                const startDate = dayjs(start as string);
                if (!endDate.isValid() || !startDate.isValid()) return true;
                return !endDate.isBefore(startDate, "day");
            }
        ),
    projectGrantScope: yup.string().required().min(2).label("Project scope"),
});

const formFields = [
    {
        label: "Project Grant Title",
        guidanceTitle: "Project Grant Title",
        name: "projectGrantName",
        info: "The Project Grant Title should be unique to the CRUK datahub. Add your institute or name if necessary to disambiguate",
        guidance:
            "The Project Grant Title should be unique to the CRUK datahub. Add your institute or name if necessary to disambiguate",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Lead researcher",
        guidanceTitle: "Lead Researcher",
        name: "leadResearcher",
        info: "The lead researcher named on the grant.",
        guidance: "No specific guidance provided.",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Lead research institute",
        guidanceTitle: "Lead Research Institute",
        name: "leadResearchInstitute",
        guidance: "No specific guidance provided.",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Grant number(s)",
        guidanceTitle: "Grant number(s)",
        name: "grantNumbers",
        info: "List of CRUK and any other grant numbers. Separate multiple numbers with a comma.",
        guidance: "Normally specified on the grant acceptance letter",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Project start date",
        guidanceTitle: "Project Start Date",
        name: "projectGrantStartDate",
        info: "Starting date of the project grant.",
        guidance:
            "Date on which the project grant starts. This is normally set out in the grant contract and will be different from the start of any data collection",
        component: inputComponents.DatePicker,
    },
    {
        label: "Project end date",
        guidanceTitle: "Project End Date",
        name: "projectGrantEndDate",
        info: "Current end date of the project grant.",
        guidance:
            "Date on which the project is currently projected to finish. This is normally set out in the grant contract and will be different from the end of any data collection",
        component: inputComponents.DatePicker,
    },
    {
        label: "Project scope",
        guidanceTitle: "Project Scope",
        name: "projectGrantScope",
        info: "Data and biospecimens expected to result from the grant.",
        guidance:
            "Short paragraph setting out the types of data / biospecimens likely to result from the grant and the cancers covered",
        component: inputComponents.TextArea,
        required: true,
    },
];

export {
    defaultValues as projectGrantDefaultValues,
    validationSchema as projectGrantValidationSchema,
    formFields as projectGrantFormFields,
};
