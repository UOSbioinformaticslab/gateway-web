export enum FieldType {
    TEXT = "text",
    LIST = "list",
    DATE = "date",
    TAG_LIST = "tag-list",
    LINK_LIST = "link-list",
    DATASETTYPE_LIST = "dataset-type-list",
}

export interface DatasetType {
    name: string;
    subTypes: string[];
}
interface DatasetField {
    path: string;
    type: FieldType;
    label?: string;
    tooltip?: string;
}

export interface DatasetSection {
    sectionName: string;
    fields: DatasetField[];
}

const datasetFields: DatasetSection[] = [
    {
        sectionName: "Project",
        fields: [],
    },
    {
        sectionName: "Summary",
        fields: [
            {
                path: "metadata.metadata.summary.abstract",
                type: FieldType.TEXT,
            },
            {
                path: "metadata.metadata.summary.doiName",
                type: FieldType.TEXT,
                label: "DOI for dataset",
                tooltip:
                    "DOI for the specific dataset or dataset version. NOTE: This is not the DOI of the row level data within a dataset or the publication(s) associated with the dataset, but rather the DOI of the metadata describing the dataset as captured in the Gateway.",
            },
        ],
    },
    {
        sectionName: "Documentation",
        fields: [
            {
                path: "metadata.metadata.documentation.description",
                type: FieldType.TEXT,
            },
            {
                path: "metadata.metadata.provenance.origin.datasetType",
                type: FieldType.DATASETTYPE_LIST,
                label: "Dataset type",
                tooltip:
                    "The topic areas to which the dataset content relates.",
            },
            {
                path: "metadata.metadata.provenance.origin.datasetSubType",
                type: FieldType.LIST,
                label: "Dataset sub-type",
                tooltip:
                    "The sub-types of topic areas to which the dataset content relates.",
            },
            {
                path: "metadata.metadata.summary.populationSize",
                type: FieldType.TEXT,
                label: "Dataset population size",
                tooltip:
                    "The number of unique people in the dataset. NOTE: See the Observations section for further measures of the dataset size.",
            },
            {
                path: "metadata.metadata.documentation.associatedMedia",
                type: FieldType.LINK_LIST,
                label: "Associated media",
                tooltip:
                    "Media that might provide additional context for researchers wanting to understand more about the dataset and its relevance to their research question.",
            },
            {
                path: "metadata.metadata.structuralMetadata.syntheticDataWebLink",
                type: FieldType.LINK_LIST,
                label: "Synthetic data web link",
                tooltip:
                    "Website with information on your synthetic dataset creation, or the location where a synthetic version of the dataset can be accessed.",
            },
        ],
    },
    {
        sectionName: "Structural Metadata",
        fields: [
            {
                path: "metadata.metadata.structuralMetadata.tables",
                type: FieldType.TAG_LIST,
            },
        ],
    },
    {
        sectionName: "Other Data Types",
        fields: [],
    },
    {
        sectionName: "Entity Relationship Diagrams",
        fields: [
            {
                label: "Investigations",
                path: "metadata.metadata.enrichmentAndLinkage.investigations",
                type: FieldType.LIST,
                tooltip:
                    "Website address(es) which document information related to active projects utilising the Dataset and or BioSample(s).",
            },
            {
                label: "Tools",
                path: "metadata.metadata.enrichmentAndLinkage.tools",
                type: FieldType.LIST,
                tooltip:
                    "URL(s) of any analysis tool(s) or models that have been created for this Dataset & BioSample and are available for further use.",
            },
        ],
    },
    {
        sectionName: "Observations",
        fields: [
            {
                path: "metadata.metadata.observations",
                type: FieldType.TEXT,
            },
        ],
    },
    {
        sectionName: "Demographics",
        fields: [
            {
                path: "metadata.metadata.demographicFrequency",
                // Not rendered via standard field rendering; handled specially in UI.
                type: FieldType.TEXT,
            },
        ],
    },
    {
        sectionName: "Omics",
        fields: [],
    },
    {
        sectionName: "Provenance",
        fields: [
            {
                path: "metadata.metadata.provenance.origin.purpose",
                type: FieldType.LIST,
                label: "Purpose of dataset collection",
                tooltip: "The purpose for which the dataset was collected.",
            },
            {
                path: "metadata.metadata.provenance.origin.source",
                type: FieldType.LIST,
                label: "Source of data extraction",
                tooltip: "The source from which the data was extracted.",
            },
            {
                path: "metadata.metadata.provenance.origin.collectionSource",
                type: FieldType.LIST,
                label: "Collection source setting",
                tooltip:
                    "The setting(s) where data was collected. Multiple settings may be provided.",
            },
            {
                path: "metadata.metadata.coverage.pathway",
                type: FieldType.LIST,
                label: "Patient pathway description",
                tooltip:
                    "Description of the patient pathway and any limitations the dataset may have with respect to pathway coverage. This could include if the dataset is from a single speciality or area, a single tier of care, linked across two tiers (e.g. primary and secondary care), or an integrated care record covering the whole patient pathway.",
            },
            {
                path: "metadata.metadata.provenance.origin.imageContrast",
                type: FieldType.TEXT,
                label: "Image contrast",
                tooltip:
                    "Indication of whether usage of imaging contrast is captured within the dataset.",
            },
            {
                path: "metadata.metadata.coverage.materialType",
                type: FieldType.TEXT,
                label: "Biological sample availability",
                tooltip:
                    "Type of specimen saved from a biological entity, and indication of the specimen availability.",
            },
        ],
    },
    {
        sectionName: "Enrichment & Linkage",
        fields: [
            {
                path: "metadata.metadata.enrichmentAndLinkage.datasetLinkage.isDerivedFrom",
                type: FieldType.LIST,
                label: "Derived From",
            },
            {
                path: "metadata.metadata.enrichmentAndLinkage.tools",
                type: FieldType.LIST,
                label: "Tools",
            },
            {
                path: "metadata.metadata.enrichmentAndLinkage.investigations",
                type: FieldType.LIST,
                label: "Investigations",
            },
            {
                path: "metadata.metadata.enrichmentAndLinkage.datasetLinkage.linkedDatasets",
                type: FieldType.LIST,
                label: "Similar To Datasets",
            },
        ],
    },
];

export interface Observation {
    disambiguatingDescription: number;
    measuredProperty: string;
    measuredValue: number;
    observationDate: string;
    observedNode: string;
}

interface ObservationTableColumn {
    header: string;
    path: string;
    tooltip: string;
}

const observationTableColumns: ObservationTableColumn[] = [
    {
        header: "Observed Node",
        path: "observedNode",
        tooltip: "Measure by which dataset volume can be expressed.",
    },
    {
        header: "Disambiguating Description",
        path: "disambiguatingDescription",
        tooltip:
            "Description of the dataset measure and volume. This provides additional context to understand the dataset size.",
    },
    {
        header: "Measured Value",
        path: "measuredValue",
        tooltip: "Volume of dataset measure, indicating size of dataset.",
    },
    {
        header: "Measured Property",
        path: "measuredProperty",
        tooltip: "Measure by which dataset volume can be expressed.",
    },
    {
        header: "Observation Date",
        path: "observationDate",
        tooltip: "Date the measure of dataset volume was made.",
    },
];

export { datasetFields, observationTableColumns };
