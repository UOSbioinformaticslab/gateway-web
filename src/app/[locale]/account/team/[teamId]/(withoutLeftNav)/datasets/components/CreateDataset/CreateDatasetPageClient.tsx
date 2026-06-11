"use client";

import dynamic from "next/dynamic";
import { AuthUser } from "@/interfaces/AuthUser";
import { Defs } from "@/interfaces/V4Schema";
import Loading from "@/components/Loading";

const CreateDataset = dynamic(() => import("./CreateDataset"), {
    ssr: false,
    loading: () => <Loading />,
});

interface CreateDatasetPageClientProps {
    teamId: number;
    user: AuthUser;
    defaultTeamId: string;
    schemadefs: Defs;
}

const CreateDatasetPageClient = ({
    teamId,
    user,
    defaultTeamId,
    schemadefs,
}: CreateDatasetPageClientProps) => (
    <CreateDataset
        teamId={teamId}
        user={user}
        defaultTeamId={Number(defaultTeamId)}
        schemadefs={schemadefs}
    />
);

export default CreateDatasetPageClient;
