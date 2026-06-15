"use client";

import { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { StructuralMetadata } from "@/interfaces/Dataset";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import UploadFile from "@/components/UploadFile";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import StructuralMetadataEditableTable from "./StructuralMetadataEditableTable";

const TRANSLATION_PATH = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset.structuralMetadata`;

const SECTION_BG = "#F0F2F5";

interface StructuralMetadataProps {
    structuralMetadata: StructuralMetadata[];
    uploadTitle?: string;
    uploadIntro?: string;
    reviewTitle?: string;
    reviewIntro?: string;
    fileProcessedAction: (metadata: StructuralMetadata[]) => void;
    onMetadataChange: (metadata: StructuralMetadata[]) => void;
    handleToggleUploading: (isUploading: boolean) => void;
}

const StructuralMetadataSection = ({
    structuralMetadata,
    uploadTitle,
    uploadIntro,
    reviewTitle,
    reviewIntro,
    fileProcessedAction,
    onMetadataChange,
    handleToggleUploading,
}: StructuralMetadataProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [triggerUpload, setTriggerUpload] = useState(false);

    useEffect(() => {
        handleToggleUploading(isUploading);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUploading]);

    useEffect(() => {
        if (!triggerUpload) {
            return;
        }

        const timer = window.setTimeout(() => setTriggerUpload(false), 0);
        return () => window.clearTimeout(timer);
    }, [triggerUpload]);

    return (
        <>
            <Paper
                sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: SECTION_BG,
                    boxShadow: "none",
                    border: `1px solid ${colors.grey300}`,
                }}>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
                    {uploadTitle}
                </Typography>
                <Typography sx={{ mb: 2, color: colors.grey700 }}>
                    {uploadIntro}
                </Typography>
                <UploadFile
                    apiPath={`${apis.fileUploadV1Url}?entity_flag=structural-metadata-upload`}
                    onFileUploaded={file =>
                        file.structural_metadata &&
                        fileProcessedAction(file.structural_metadata)
                    }
                    onFileChange={() => setTriggerUpload(true)}
                    triggerFileUpload={triggerUpload}
                    isUploading={setIsUploading}
                    allowReuploading
                    acceptedFileTypes=".csv,.xls,.xlsx"
                    showUploadButton={false}
                />
                {isUploading && (
                    <Typography sx={{ mt: 2, color: colors.grey700 }}>
                        {t("uploadMessage")}
                    </Typography>
                )}
            </Paper>

            <Paper
                sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: SECTION_BG,
                    boxShadow: "none",
                    border: `1px solid ${colors.grey300}`,
                }}>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
                    {reviewTitle}
                </Typography>
                <Typography sx={{ mb: 2, color: colors.grey700 }}>
                    {reviewIntro}
                </Typography>
                {!isUploading && (
                    <StructuralMetadataEditableTable
                        metadata={structuralMetadata}
                        onChange={onMetadataChange}
                    />
                )}
            </Paper>

            <Divider sx={{ mb: 3 }} />
        </>
    );
};

export default StructuralMetadataSection;
