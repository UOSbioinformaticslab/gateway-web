import { DataStatus } from "@/consts/application";

interface ProjectGrantVersionFields {
    projectGrantName?: string | null;
    leadResearcher?: string | null;
    leadResearchInstitute?: string | null;
    grantNumbers?: string[] | string | null;
    projectGrantStartDate?: string | null;
    projectGrantEndDate?: string | null;
    projectGrantScope?: string | null;
}

interface ProjectGrant extends ProjectGrantVersionFields {
    id: number | string;
    pid?: string;
    status?: DataStatus;
    created_at?: string;
    updated_at?: string;
    team_id?: number;
    user_id?: string;
    latest_version?: ProjectGrantVersionFields | null;
}

interface ProjectGrantSubmission {
    id?: number | string;
    projectGrantName: string;
    leadResearcher: string;
    leadResearchInstitute: string;
    grantNumbers: string[];
    projectGrantStartDate: string | null;
    projectGrantEndDate: string | null;
    projectGrantScope: string;
    status?: DataStatus;
    team_id?: number;
    user_id?: string;
}

const formatGrantNumbers = (
    value: ProjectGrantVersionFields["grantNumbers"]
) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean).join(", ");
    }
    if (typeof value !== "string" || !value.trim()) return "";
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            return parsed.filter(Boolean).join(", ");
        }
    } catch {
        return value;
    }
    return value;
};

const getProjectGrantDetails = (
    grant?: ProjectGrant | null
): ProjectGrantVersionFields => {
    const version = grant?.latest_version;
    return {
        projectGrantName:
            version?.projectGrantName ?? grant?.projectGrantName ?? "",
        leadResearcher: version?.leadResearcher ?? grant?.leadResearcher ?? "",
        leadResearchInstitute:
            version?.leadResearchInstitute ??
            grant?.leadResearchInstitute ??
            "",
        grantNumbers: version?.grantNumbers ?? grant?.grantNumbers ?? "",
        projectGrantStartDate:
            version?.projectGrantStartDate ??
            grant?.projectGrantStartDate ??
            "",
        projectGrantEndDate:
            version?.projectGrantEndDate ?? grant?.projectGrantEndDate ?? "",
        projectGrantScope:
            version?.projectGrantScope ?? grant?.projectGrantScope ?? "",
    };
};

export type { ProjectGrant, ProjectGrantSubmission, ProjectGrantVersionFields };
export { formatGrantNumbers, getProjectGrantDetails };
