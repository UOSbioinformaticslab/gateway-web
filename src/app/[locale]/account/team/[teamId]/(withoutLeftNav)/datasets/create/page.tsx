import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { Defs } from "@/interfaces/V4Schema";
import { getSchemaFromTraser, getTeam, getUser } from "@/utils/api";
import { getLocalFormHydration } from "@/utils/localFormHydration";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import CreateDataset from "../components/CreateDataset";

export const metadata = metaData(
    {
        title: "Dataset Create - My Account",
        description: "",
    },
    noFollowRobots
);

const SCHEMA_NAME = process.env.NEXT_PUBLIC_SCHEMA_NAME || "HDRUK";
const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION || "4.0.0";

export default async function CreateDatasetPage({
    params,
}: {
    params: Promise<{ teamId: string }>;
}) {
    const { teamId } = await params;
    const user = await getUser();
    const team = await getTeam(teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    let schemadefs: Defs = {} as Defs;
    try {
        const result = await getSchemaFromTraser(SCHEMA_NAME, SCHEMA_VERSION);
        if (result?.schema?.$defs) {
            schemadefs = result.schema.$defs;
        }
    } catch {
        // Schema service may be unavailable or return an error (e.g. unknown name/version)
    }

    const formJSON = getLocalFormHydration(teamId);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["datasets.create"]}>
            <BoxContainer sx={{ mt: "14px" }}>
                <CreateDataset
                    formJSON={formJSON}
                    teamId={Number(teamId)}
                    user={user}
                    defaultTeamId={Number(teamId)}
                    schemadefs={schemadefs}
                />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
