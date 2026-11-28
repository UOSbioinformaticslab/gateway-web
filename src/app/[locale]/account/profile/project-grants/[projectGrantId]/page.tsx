import ProjectGrantForm from "@/components/ProjectGrantForm";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";

export const metadata = metaData(
    {
        title: "Edit Project - My Account",
        description: "Edit a project grant",
    },
    noFollowRobots
);

export default async function ProjectGrantEditPage({
    params,
}: {
    params: Promise<{ projectGrantId: string }>;
}) {
    const { projectGrantId } = await params;
    const user = await getUser();
    const userId = user?.id?.toString();

    return <ProjectGrantForm projectGrantId={projectGrantId} userId={userId} />;
}
