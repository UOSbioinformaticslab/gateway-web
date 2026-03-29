import metaData from "@/utils/metadata";
import SupportPage from "../components/SupportPage";
import UploadingAnalysisScriptsContent from "./UploadingAnalysisScriptsContent";

export const metadata = metaData({
    title: "Uploading Analysis Scripts and Software - Data Custodians",
    description:
        "Guidance for uploading analysis scripts, software, and tools in the CRUK Data Hub.",
});

export default function ToolsPage() {
    return (
        <SupportPage title="Uploading Analysis Scripts and Software">
            <UploadingAnalysisScriptsContent />
        </SupportPage>
    );
}
