import { ReactElement } from "react";
import Box from "@/components/Box";
import CollectionsContent from "@/components/CollectionsContent";
import DataUsesContent from "@/components/DataUsesContent";
import PublicationsContent from "@/components/PublicationsContent";
import ToolsContent from "@/components/ToolsContent";
import apis from "@/config/apis";

const TRANSLATION_PATH = "pages.dataCustodian";

export default async function EntitiesOuter({
    dataCustodianId,
    startIndex,
}: {
    dataCustodianId: number;
    startIndex: number;
}): Promise<ReactElement> {
    try {
        const resp = await fetch(
            `${apis.teamsV1UrlIP}/${dataCustodianId}/summary`,
            {
                next: {
                    revalidate: 180,
                    tags: ["all", `custodian_entities_summary-${dataCustodianId}`],
                },
            }
        );
        if (!resp.ok) {
            // Return empty arrays instead of throwing
            return (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        pt: 0,
                    }}>
                    <CollectionsContent
                        collections={[]}
                        anchorIndex={startIndex + 2}
                        translationPath={TRANSLATION_PATH}
                    />
                    <ToolsContent
                        tools={[]}
                        anchorIndex={startIndex + 3}
                        translationPath={TRANSLATION_PATH}
                    />
                    <DataUsesContent
                        datauses={[]}
                        anchorIndex={startIndex + 4}
                        translationPath={TRANSLATION_PATH}
                    />
                    <PublicationsContent
                        publications={[]}
                        anchorIndex={startIndex + 5}
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
                    pt: 0,
                }}>
                <CollectionsContent
                    collections={data?.collections || []}
                    anchorIndex={startIndex + 2}
                    translationPath={TRANSLATION_PATH}
                />
                <ToolsContent
                    tools={data?.tools || []}
                    anchorIndex={startIndex + 3}
                    translationPath={TRANSLATION_PATH}
                />
                <DataUsesContent
                    datauses={data?.durs || []}
                    anchorIndex={startIndex + 4}
                    translationPath={TRANSLATION_PATH}
                />
                <PublicationsContent
                    publications={data?.publications || []}
                    anchorIndex={startIndex + 5}
                    translationPath={TRANSLATION_PATH}
                />
            </Box>
        );
    } catch (error) {
        // Return empty arrays on error
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    pt: 0,
                }}>
                <CollectionsContent
                    collections={[]}
                    anchorIndex={startIndex + 2}
                    translationPath={TRANSLATION_PATH}
                />
                <ToolsContent
                    tools={[]}
                    anchorIndex={startIndex + 3}
                    translationPath={TRANSLATION_PATH}
                />
                <DataUsesContent
                    datauses={[]}
                    anchorIndex={startIndex + 4}
                    translationPath={TRANSLATION_PATH}
                />
                <PublicationsContent
                    publications={[]}
                    anchorIndex={startIndex + 5}
                    translationPath={TRANSLATION_PATH}
                />
            </Box>
        );
    }
}
