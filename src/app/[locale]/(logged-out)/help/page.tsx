import HelpHub from "./HelpHub";
import metaData from "@/utils/metadata";

export const metadata = metaData({
    title: "Support Centre",
    description:
        "Support Centre for the CRUK Data Hub: explore data, metadata, FAQs, and more.",
});

export default function HelpPage() {
    return <HelpHub />;
}
