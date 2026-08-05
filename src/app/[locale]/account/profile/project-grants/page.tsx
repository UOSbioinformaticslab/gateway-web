import BoxContainer from "@/components/BoxContainer";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import TeamCollections from "../../team/[teamId]/(withLeftNav)/collections/components/TeamCollections";

export const metadata = metaData(
    {
        title: "Project Grants - My Account",
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
            <TeamCollections permissions={permissions} userId={userId} />
        </BoxContainer>
    );
}
