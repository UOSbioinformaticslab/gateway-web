import { FieldError } from "react-hook-form";

const FIELD_ERROR_LABEL_PATTERN = /^.*?(?=\s(?:is|should))/;

export const formatFieldErrorMessage = (
    message: string | undefined,
    fieldLabel: string
): string | undefined => {
    if (!message || !fieldLabel) {
        return message;
    }

    return message.replace(FIELD_ERROR_LABEL_PATTERN, fieldLabel);
};

export const formatFieldError = (
    error: FieldError | undefined,
    fieldLabel: string
): FieldError | undefined => {
    if (!error) {
        return error;
    }

    const message = formatFieldErrorMessage(error.message, fieldLabel);

    if (message === error.message) {
        return error;
    }

    return {
        ...error,
        message,
    };
};

export const formatFieldErrors = (
    error: FieldError | FieldError[] | undefined,
    fieldLabel: string
): FieldError | FieldError[] | undefined => {
    if (!error) {
        return error;
    }

    if (Array.isArray(error)) {
        return error.map(item => formatFieldError(item, fieldLabel) ?? item);
    }

    return formatFieldError(error, fieldLabel);
};
