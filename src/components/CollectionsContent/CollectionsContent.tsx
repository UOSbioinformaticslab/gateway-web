"use client";

import { useTranslations } from "next-intl";
import { Collection } from "@/interfaces/Collection";
import AccordionSection from "@/components/AccordionSection";
import { RouteName } from "@/consts/routeName";
import CardStacked from "../CardStacked";

export interface CollectionsContentProps {
    collections: Collection[];
    anchorIndex: number;
    translationPath: string;
}

const TRANSLATION_PATH = ".components.CollectionsContent";

export default function CollectionsContent({
    collections,
    anchorIndex,
    translationPath,
}: CollectionsContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));

    // Ensure collections is always an array
    const safeCollections = Array.isArray(collections) ? collections : [];
    const collectionsLength = safeCollections.length;

    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
            disabled={!collectionsLength}
            heading={t("heading", {
                length: collectionsLength,
            })}
            defaultExpanded={collectionsLength > 0}
            contents={safeCollections.map(({ name, id, image_link }) => (
                <CardStacked
                    href={`/${RouteName.COLLECTION_ITEM}/${id}`}
                    title={name}
                    imgUrl={image_link}
                    key={`collection_${id}`}
                />
            ))}
        />
    );
}
