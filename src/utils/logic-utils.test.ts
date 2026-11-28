import { buildLogicTokens } from "./logic-utils";

const textOf = (
    tokens: ReturnType<typeof buildLogicTokens>
): string =>
    tokens
        .map(token => {
            if (token.kind === "term") return token.label;
            return token.value;
        })
        .join(" ");

describe("buildLogicTokens", () => {
    it("builds the default cancer, data, and access conditions", () => {
        const tokens = buildLogicTokens([
            { id: "0_0_0_9" },
            { id: "0_2_1_0_0" },
            { id: "0_1_4" },
            { id: "0_1_5" },
        ]);

        expect(textOf(tokens)).toBe(
            "C50 Breast AND ( Model OR Organ on a Chip ) AND ( not for profit organisation use only OR non-commercial use only )"
        );
    });

    it("leaves a single filter unbracketed", () => {
        expect(textOf(buildLogicTokens([{ id: "0_0_0_9" }]))).toBe(
            "C50 Breast"
        );
    });
});
