import metaData from "@/utils/metadata";
import SupportPage from "../components/SupportPage";
import DataUsesResearchProjectsContent from "./DataUsesResearchProjectsContent";

export const metadata = metaData({
    title: "Exploring Data Uses / Research Projects - Data Custodians",
    description:
        "The Data Use Register on the Cancer Data Hub: transparency, search, filters, and who uses it.",
});

export default function UploadingDataUsesProjectsPage() {
    return (
        <SupportPage title="Exploring Data Uses / Research Projects">
            <DataUsesResearchProjectsContent />
        </SupportPage>
    );
}
