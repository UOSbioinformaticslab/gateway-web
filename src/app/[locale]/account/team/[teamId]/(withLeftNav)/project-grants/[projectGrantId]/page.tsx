import { ValueType } from "@/components/Autocomplete/Autocomplete";
import CollectionForm from "@/components/CollectionForm";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getKeywords, getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";

export const metadata = metaData(
    {
        title: "Edit Project Grant - My Account",
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
    const keywords = await getKeywords();
    const keywordOptions = keywords.map(data => {
        return {
            value: data.id as ValueType,
            label: data.name,
        };
    });
    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["project-grants.update"]}>
            <ProjectGrantForm
                teamId={teamId}
                projectGrantId={projectGrantId}
            />
        </ProtectedAccountRoute>
    );
}
