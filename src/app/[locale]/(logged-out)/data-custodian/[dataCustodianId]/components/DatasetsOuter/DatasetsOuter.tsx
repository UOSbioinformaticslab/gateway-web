import { ReactElement } from "react";
import Box from "@/components/Box";
import DatasetsContent from "@/components/DatasetsContent";
import apis from "@/config/apis";

const TRANSLATION_PATH = "pages.dataCustodian";

export default async function DatasetsOuter({
    dataCustodianId,
    startIndex,
}: {
    dataCustodianId: number;
    startIndex: number;
}): Promise<ReactElement> {
    try {
        const resp = await fetch(
            `${apis.teamsV1UrlIP}/${dataCustodianId}/datasets_summary`,
            {
                next: {
                    revalidate: 180,
                    tags: ["all", `custodian_datasets_summary-${dataCustodianId}`],
                },
            }
        );
        if (!resp.ok) {
            // Return empty datasets array instead of throwing
            return (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        pb: 0,
                    }}>
                    <DatasetsContent
                        datasets={[]}
                        anchorIndex={startIndex + 1}
                        translationPath={TRANSLATION_PATH}
                    />
                </Box>
            );
        }
        const { data } = await resp.json();

        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    pb: 0,
                }}>
                <DatasetsContent
                    datasets={data?.datasets || []}
                    anchorIndex={startIndex + 1}
                    translationPath={TRANSLATION_PATH}
                />
            </Box>
        );
    } catch (error) {
        // Return empty datasets array on error
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    pb: 0,
                }}>
                <DatasetsContent
                    datasets={[]}
                    anchorIndex={startIndex + 1}
                    translationPath={TRANSLATION_PATH}
                />
            </Box>
        );
    }
}
