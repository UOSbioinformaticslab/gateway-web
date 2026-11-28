import BoxContainer from "@/components/BoxContainer";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import TeamProjectGrants from "../../team/[teamId]/(withLeftNav)/project-grants/components/TeamProjectGrants";

export const metadata = metaData(
    {
        title: "Projects - My Account",
        description: "",
    },
    noFollowRobots
);

export default async function ProjectGrantsPage() {
    const user = await getUser();
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    return (
        <BoxContainer sx={{ gap: 0 }}>
            <TeamProjectGrants permissions={permissions} userId={userId} />
        </BoxContainer>
    );
}
