import ProjectGrantForm from "@/components/ProjectGrantForm";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";

export const metadata = metaData(
    {
        title: "Create Project - My Account",
        description: "Create a project grant",
    },
    noFollowRobots
);

export default async function ProjectGrantCreatePage() {
    const user = await getUser();
    const userId = user?.id?.toString();

    return <ProjectGrantForm userId={userId} />;
}
