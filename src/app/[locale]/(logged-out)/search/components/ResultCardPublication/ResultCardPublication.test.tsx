import { render, screen } from "@/utils/testUtils";
import ResultCardPublication from "./ResultCardPublication";

const MOCK_DATA = {
    abstract: "Abstract.",
    authors: "Authors",
    journal_name: "Journal name",
    paper_title: "Paper",
    year_of_publication: "Year",
    _id: "1",
};

describe("ResultCardPublication", () => {
    it("should render with all data", async () => {
        render(<ResultCardPublication result={MOCK_DATA} />);

        expect(screen.getByText(MOCK_DATA.abstract)).toBeInTheDocument();
        expect(screen.getByText(MOCK_DATA.authors)).toBeInTheDocument();
        expect(screen.getByText(MOCK_DATA.journal_name)).toBeInTheDocument();
        expect(screen.getByText(MOCK_DATA.paper_title)).toBeInTheDocument();
        expect(
            screen.getByText(`Published: ${MOCK_DATA.year_of_publication}`)
        ).toBeInTheDocument();
        expect(screen.getByText("Data dependencies")).toBeInTheDocument();
        expect(screen.getAllByText("None linked")).toHaveLength(2);
    });

    it("should render `Unknown Author` when no authors", async () => {
        render(
            <ResultCardPublication
                result={{ ...MOCK_DATA, authors: undefined }}
            />
        );
        expect(screen.getByText("Unknown Author")).toBeInTheDocument();
    });

    it("should shorten multiple authors", async () => {
        render(
            <ResultCardPublication
                result={{
                    ...MOCK_DATA,
                    authors: "Elangovan, Premkumar, Smith",
                }}
            />
        );
        expect(screen.getByText("Elangovan et al.")).toBeInTheDocument();
    });
});
