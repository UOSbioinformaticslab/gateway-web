"use client";

import Button from "@/components/Button";
import type { ButtonProps } from "@/components/Button/Button";
import { FileExport } from "@/interfaces/FileExport";
import { downloadFile } from "@/utils/download";

type DownloadJsonButtonProps = {
    filename: string;
    data: unknown;
    buttonProps?: Partial<ButtonProps>;
};

export default function DownloadJsonButton({
    filename,
    data,
    buttonProps,
}: DownloadJsonButtonProps) {
    return (
        <Button
            variant={buttonProps?.variant ?? "outlined"}
            sx={buttonProps?.sx}
            startIcon={buttonProps?.startIcon}
            endIcon={buttonProps?.endIcon}
            onClick={() => {
                const fileData: FileExport = {
                    filename,
                    type: "application/json; charset=UTF-8",
                    content: JSON.stringify(data ?? {}, null, 2),
                };
                downloadFile(fileData);
            }}
        >
            Download JSON
        </Button>
    );
}

