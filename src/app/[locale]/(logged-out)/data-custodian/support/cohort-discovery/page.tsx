import metaData from "@/utils/metadata";
import SupportPage from "../components/SupportPage";
import CohortDiscoverySupportContent from "./CohortDiscoverySupportContent";

export const metadata = metaData({
    title: "Using Cohort Discovery - Data Custodians",
    description:
        "Find suitable cohorts for your research using advanced search tools.",
});

export default function CohortDiscoveryPage() {
    return (
        <SupportPage title="Using Cohort Discovery">
            <CohortDiscoverySupportContent />
        </SupportPage>
    );
}
