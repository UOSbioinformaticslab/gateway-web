import {
    capitalise,
    splitCamelcase,
    getTrimmedpathname,
    extractSubdomain,
    getJwtCookieDomain,
    convertToCamelCase,
    parseStaticImagePaths,
} from "./general";

describe("General utils", () => {
    it("should return capitalised string", async () => {
        expect(capitalise("string")).toEqual("String");
    });

    it("should return string with spaces", async () => {
        expect(splitCamelcase("stringToBeSplit")).toEqual("string To Be Split");
    });

    it("should return string without locale", async () => {
        expect(getTrimmedpathname("en", "/en/the/route")).toEqual("/the/route");
    });

    it("should return url without subdomain", async () => {
        expect(extractSubdomain("https://api.foo.bar.baz.uk/api/v1")).toEqual(
            ".foo.bar.baz.uk"
        );
    });

    describe("getJwtCookieDomain", () => {
        const apiUrl = "https://api.hub.cancerresearchuk.org/api/v1";
        const originalNodeEnv = process.env.NODE_ENV;

        afterEach(() => {
            Object.defineProperty(process.env, "NODE_ENV", {
                value: originalNodeEnv,
                configurable: true,
            });
        });

        it("returns undefined in development", () => {
            Object.defineProperty(process.env, "NODE_ENV", {
                value: "development",
                configurable: true,
            });
            expect(
                getJwtCookieDomain("hub.cancerresearchuk.org", apiUrl)
            ).toBeUndefined();
        });

        it("returns shared parent domain for matching hosts", () => {
            Object.defineProperty(process.env, "NODE_ENV", {
                value: "production",
                configurable: true,
            });
            expect(getJwtCookieDomain("hub.cancerresearchuk.org", apiUrl)).toBe(
                ".hub.cancerresearchuk.org"
            );
            expect(
                getJwtCookieDomain("www.hub.cancerresearchuk.org", apiUrl)
            ).toBe(".hub.cancerresearchuk.org");
        });

        it("returns undefined for unrelated hosts such as Vercel previews", () => {
            Object.defineProperty(process.env, "NODE_ENV", {
                value: "production",
                configurable: true,
            });
            expect(
                getJwtCookieDomain("gateway-web-five.vercel.app", apiUrl)
            ).toBeUndefined();
        });
    });

    it("should convert path string to camelcase", async () => {
        expect(convertToCamelCase("text_string")).toBe("textString");
    });

    it("should return reformatted static image paths", async () => {
        const mockedData = {
            datasets: "welcome-image.png",
        };

        expect(parseStaticImagePaths(mockedData, "landing_page")).toEqual({
            datasets: "https://media.url/landing_page/welcome-image.png",
        });
    });
});
