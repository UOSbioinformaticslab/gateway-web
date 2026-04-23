"use client";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Divider } from "@mui/material";
import { get } from "lodash";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import Link from "@/components/Link";
import { colors } from "@/config/theme";
import { VersionItem } from "@/interfaces/Dataset";
import { formatTextDelimiter, splitStringList, parseLeadTime } from "@/utils/dataset";
import { formatTextWithLinks } from "@/utils/dataset";

type DataAccessCardProps = {
    data: VersionItem;
};

const FALLBACK_ACCESS = {
    controller: "Oncology Research Trust",
    processor: "Oncology Research Trust",
    accessRights: [
        "Access is granted upon approval by the Oncology Data Access Committee.",
        "Please visit https://www.oncologytrust.org/access for the application portal.",
    ],
    leadTime: "2-4 weeks",
    requirement: "Ethics approval required, Publication required",
    limitation: "Research use only, No linkage",
    requestCost:
        "Academic requests are free. Commercial requests are subject to a £2000 administrative fee.",
} as const;

function Label({ children }: { children: string }) {
    return (
        <Typography
            sx={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: colors.grey600,
                textTransform: "uppercase",
                mt: 1.25,
                mb: 0.25,
            }}
        >
            {children}
        </Typography>
    );
}

function Value({ children }: { children: React.ReactNode }) {
    return (
        <Typography
            component="div"
            sx={{
                fontSize: 14,
                color: colors.grey800,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
            }}
        >
            {children}
        </Typography>
    );
}

export default function DataAccessCard({ data }: DataAccessCardProps) {
    const controller = get(
        data,
        "metadata.metadata.accessibility.access.dataController"
    ) as unknown;
    const processor = get(
        data,
        "metadata.metadata.accessibility.access.dataProcessor"
    ) as unknown;
    const accessRights = get(
        data,
        "metadata.metadata.accessibility.access.accessRights"
    ) as unknown;
    const leadTime = get(
        data,
        "metadata.metadata.accessibility.access.deliveryLeadTime"
    ) as string | undefined;
    const requestCost = get(
        data,
        "metadata.metadata.accessibility.access.accessRequestCost"
    ) as unknown;
    const limitation = get(
        data,
        "metadata.metadata.accessibility.usage.dataUseLimitation"
    ) as string | undefined;
    const requirement = get(
        data,
        "metadata.metadata.accessibility.usage.dataUseRequirements"
    ) as string | undefined;

    const normaliseItem = (item: unknown): string | null => {
        if (item == null) return null;
        if (typeof item === "string") return item;
        if (typeof item === "number" || typeof item === "boolean")
            return String(item);
        if (typeof item === "object" && "name" in item) {
            const name = (item as { name?: unknown }).name;
            if (typeof name === "string" && name.trim()) return name;
        }
        try {
            return JSON.stringify(item);
        } catch {
            return String(item);
        }
    };

    const normaliseList = (v: unknown): string[] => {
        if (!v) return [];
        if (Array.isArray(v)) {
            return v
                .map(normaliseItem)
                .filter((x): x is string => !!x && x.trim().length > 0);
        }
        if (typeof v === "string") {
            return Array.from(new Set(splitStringList(v)))
                .map(s => s.trim())
                .filter(Boolean);
        }
        const one = normaliseItem(v);
        return one ? [one] : [];
    };

    const formatList = (v: unknown) => {
        const list = normaliseList(v);
        return list.length ? formatTextDelimiter(list) : "-";
    };

    const listOrFallback = (v: unknown, fallback: string | string[]) => {
        const list = normaliseList(v);
        if (list.length) return list;
        return Array.isArray(fallback) ? [...fallback] : [fallback];
    };

    const accessRightsNode = (() => {
        const list = listOrFallback(accessRights, FALLBACK_ACCESS.accessRights);

        // If any items look like URLs, render as links. Otherwise render as text.
        const urls = list.filter(item => /^https?:\/\//i.test(item));
        const nonUrls = list.filter(item => !/^https?:\/\//i.test(item));

        return (
            <Box sx={{ p: 0, display: "flex", flexDirection: "column", gap: 0.5 }}>
                {nonUrls.length > 0 && <span>{formatTextDelimiter(nonUrls)}</span>}
                {urls.map(url => (
                    <Link key={url} href={url} target="_blank" rel="noreferrer">
                        <span
                            style={{
                                overflowWrap: "anywhere",
                                wordBreak: "break-word",
                            }}
                        >
                            {url}
                        </span>
                    </Link>
                ))}
            </Box>
        );
    })();

    const leadTimePretty = (() => {
        if (!leadTime) return FALLBACK_ACCESS.leadTime;
        const parsed = parseLeadTime(leadTime);
        if (!parsed?.[0]) return leadTime;
        return `${parsed[0]}${parsed[1] ? ` ${parsed[1]}` : ""}`;
    })();

    return (
        <Paper
            sx={{
                borderRadius: 2,
                p: 1.5,
                bgcolor: "rgba(0, 70, 140, 0.06)",
                border: `1px solid rgba(0, 70, 140, 0.14)`,
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
            }}
        >
            <Box
                sx={{
                    p: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, color: colors.blue400 }}
                >
                    Data Access
                </Typography>
                <MailOutlineIcon sx={{ color: colors.blue400 }} />
            </Box>

            <Divider sx={{ my: 1.25, borderColor: "rgba(0, 70, 140, 0.25)" }} />

            <Label>Data Controller</Label>
            <Value>{formatTextDelimiter(listOrFallback(controller, FALLBACK_ACCESS.controller))}</Value>

            <Label>Data Processor</Label>
            <Value>{formatTextDelimiter(listOrFallback(processor, FALLBACK_ACCESS.processor))}</Value>

            <Label>Access Rights</Label>
            <Value>{accessRightsNode}</Value>

            <Label>Delivery lead time</Label>
            <Value>{leadTimePretty}</Value>

            <Label>Data use requirement</Label>
            <Value>
                {formatTextWithLinks(requirement || FALLBACK_ACCESS.requirement)}
            </Value>

            <Label>Data use limitation</Label>
            <Value>
                {formatTextWithLinks(limitation || FALLBACK_ACCESS.limitation)}
            </Value>

            <Label>Request cost</Label>
            <Value>
                {formatTextDelimiter(
                    listOrFallback(requestCost, FALLBACK_ACCESS.requestCost)
                )}
            </Value>
        </Paper>
    );
}

