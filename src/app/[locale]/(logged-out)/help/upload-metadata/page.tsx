import UploadMetadataContent from "./UploadMetadataContent";
import metaData from "@/utils/metadata";

export const metadata = metaData({
    title: "Managing Dataset Metadata",
    description:
        "How to enter and upload cancer research metadata on the CRUK Data Hub.",
});

export default function UploadMetadataPage() {
    return <UploadMetadataContent />;
}
