import metaData from "@/utils/metadata";
import SupportPage from "../components/SupportPage";
import ManagingCollectionsContent from "./ManagingCollectionsContent";

export const metadata = metaData({
    title:
        "Exploring Collections, Data Custodians and Data Custodian Networks - Data Custodians",
    description:
        "Collections, Data Custodian pages, networks, data access requirements, and the access process on the Cancer Data Hub.",
});

export default function ManagingPage() {
    return (
        <SupportPage title="Exploring Collections, Data Custodians and Data Custodian Networks">
            <ManagingCollectionsContent />
        </SupportPage>
    );
}
