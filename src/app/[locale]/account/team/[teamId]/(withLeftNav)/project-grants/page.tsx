import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import TeamProjectGrants from "./components/TeamProjectGrants";

export const metadata = metaData(
    {
        title: "Projects - My Account",
        description: "",
    },
    noFollowRobots
);

export default async function TeamProjectGrantsPage({
    params,
}: {
    params: Promise<{ teamId: string }>;
}) {
    const { teamId } = await params;
    const user = await getUser();
    const team = await getTeam(teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);
    const userId = user?.id?.toString();

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["project-grants.read", "collections.read"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <TeamProjectGrants
                    permissions={permissions}
                    teamId={teamId}
                    userId={userId}
                />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
