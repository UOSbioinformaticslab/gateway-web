"use client";

import { Fragment } from "react";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { Publication, ReducedPublication } from "@/interfaces/Publication";
import AccordionSection from "@/components/AccordionSection";

export interface PublicationsContentProps {
    publications: Publication[] | ReducedPublication[];
    anchorIndex: number;
    translationPath: string;
}

const TRANSLATION_PATH = ".components.PublicationsContent";

export default function PublicationContent({
    publications,
    anchorIndex,
    translationPath,
}: PublicationsContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));

    // Ensure publications is always an array
    const safePublications = Array.isArray(publications) ? publications : [];
    const publicationsLength = safePublications.length;

    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
            disabled={!publicationsLength}
            heading={t("heading", {
                length: publicationsLength,
            })}
            defaultExpanded={publicationsLength > 0}
            contents={safePublications.map(
                ({ id, paper_title, authors, url, year_of_publication }) => (
                    <Fragment key={`publication_${id}`}>
                        <Link component="a" href={url} target="_blank">
                            {paper_title}
                        </Link>
                        {authors && <div>{authors}</div>}
                        {year_of_publication && (
                            <div>{year_of_publication}</div>
                        )}
                    </Fragment>
                )
            )}
        />
    );
}
