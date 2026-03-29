import ResearchersFaqContent from "./ResearchersFaqContent";
import metaData from "@/utils/metadata";

export const metadata = metaData({
    title: "Researchers' FAQs – CRUK Data Hub",
    description:
        "Frequently asked questions about search, filters, metadata, and the CRUK Data Hub.",
});

export default function ResearchersFaqPage() {
    return <ResearchersFaqContent />;
}
