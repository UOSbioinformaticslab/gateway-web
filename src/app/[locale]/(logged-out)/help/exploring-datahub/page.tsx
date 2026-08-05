import ExploringDatahubContent from "./ExploringDatahubContent";
import metaData from "@/utils/metadata";

export const metadata = metaData({
    title: "Help – Study Search and Filters",
    description:
        "How to use study search, filters, sorting, and filter logic in the CRUK Data Hub.",
});

export default function ExploringDatahubPage() {
    return <ExploringDatahubContent />;
}
