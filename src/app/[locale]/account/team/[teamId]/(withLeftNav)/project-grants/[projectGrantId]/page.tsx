import ProjectGrantForm from "@/components/ProjectGrantForm";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";

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
    params: Promise<{ teamId: string; projectGrantId: string }>;
}) {
    const { teamId, projectGrantId } = await params;
    const user = await getUser();
    const team = await getTeam(teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["project-grants.update", "collections.update"]}>
            <ProjectGrantForm teamId={teamId} projectGrantId={projectGrantId} />
        </ProtectedAccountRoute>
    );
}
