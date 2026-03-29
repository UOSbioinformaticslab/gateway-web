import metaData from "@/utils/metadata";
import SupportPage from "../components/SupportPage";
import UploadingPublicationsContent from "./UploadingPublicationsContent";

export const metadata = metaData({
    title: "Uploading Publications - Data Custodians",
    description:
        "Guidance for data custodians on uploading and managing publications in the CRUK Data Hub.",
});

export default function PublicationsPage() {
    return (
        <SupportPage title="Uploading Publications">
            <UploadingPublicationsContent />
        </SupportPage>
    );
}
