import {
    formatFieldError,
    formatFieldErrorMessage,
    formatFieldErrors,
} from "./formatFieldErrorMessage";

describe("formatFieldErrorMessage", () => {
    it("replaces array field paths with the field label", () => {
        expect(
            formatFieldErrorMessage(
                "Non-tabular data types Array[0].Title is a required field",
                "Title"
            )
        ).toBe("Title is a required field");
    });

    it("replaces nested paths with the field label", () => {
        expect(
            formatFieldErrorMessage(
                "Observations Array[1].Measured value should be a number",
                "Measured value"
            )
        ).toBe("Measured value should be a number");
    });

    it("leaves messages unchanged when they do not match the pattern", () => {
        expect(
            formatFieldErrorMessage("Invalid value", "Title")
        ).toBe("Invalid value");
    });

    it("returns the original message when no label is provided", () => {
        expect(
            formatFieldErrorMessage(
                "Non-tabular data types Array[0].Title is a required field",
                ""
            )
        ).toBe("Non-tabular data types Array[0].Title is a required field");
    });
});

describe("formatFieldError", () => {
    it("formats a field error message using the label", () => {
        expect(
            formatFieldError(
                {
                    type: "required",
                    message:
                        "Non-tabular data types Array[0].Data description is a required field",
                },
                "Data description"
            )
        ).toEqual({
            type: "required",
            message: "Data description is a required field",
        });
    });
});

describe("formatFieldErrors", () => {
    it("formats each error in an array", () => {
        expect(
            formatFieldErrors(
                [
                    {
                        type: "required",
                        message:
                            "Non-tabular data types Array[0].Format is a required field",
                    },
                ],
                "Format"
            )
        ).toEqual([
            {
                type: "required",
                message: "Format is a required field",
            },
        ]);
    });
});
