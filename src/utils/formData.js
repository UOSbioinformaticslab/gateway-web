const formHydrationResponse = {
    "message": "success",
    "data": {
      "schema_fields": [
        {
          "title": "Welcome & Guide",
          "is_array_form": false,
          "description": "This page is to help you enter your cancer research metadata onto the CRUK datahub, in a way that helps others find and potentially access the data.",
          "location": "Welcome & Guide",
          "guidance": "**CRUK Datahub Upload Guide**\\n\\nThis page is to help you enter your cancer research metadata onto the CRUK datahub, in a way that helps others find and potentially access the data.\\n\\nYou can either enter the information manually or - if you have done this before - you can upload a modified json file, and use the page to check that all is as you want it.\\n\\nThe CRUK datahub is fully compatible with HDRUK's health data gateway portal. Once you've entered the information here you do not need to re-enter the information on their portal.\\n\\n**Before you start**\\n\\nYou will need the following information.\\n\\n- **Grant Documentation:** CRUK grant number (and optionally a list of any other funding bodies).\\n- **Dataset Basics:** Information describing your dataset, including a unique title, a concise abstract (up to 255 characters), and longer description of the dataset. This is an opportunity to include high quality information about the technical standards and methods used. If you have a website for your project or dataset you will able to link it.\\n- **Technical Specs:** ICD-O descriptors for the cancers covered by the dataset are required. There is a search bar to help you find the right terms. These will automatically be translated into TCGA and CRUK cancer terms. It is also helpful to have a list of the data formats (CSV, DICOM, etc.) and terminologies (ICD-10, SNOMED CT) used.\\n- **Structural Assets:** We ask for descriptions of the tables and the columns within, so that researchers can easily find out whether you have the information they need without needing to put in an enquiry. In order to give an idea of the completeness of the dataset we also ask you to include for each table how many complete rows there are. Please make descriptions understandable. And, if you have a complex relational database it is helpful to include an Entity Relationship Diagram image file (PNG/JPG/SVG < 5MB) to show how the different tables link together.\\n- **Demographics:** Summarized counts for Age and Ethnicity.\\n- **Observations:** If you have summary statistics about your dataset (like 5500 Matched tumour-normal samples) it is an excellent way to show your dataset to its best advantage.\\n- **Contacts:** You will need the name of your Data Custodian organisation and a functional email for data access requests.\\n\\n**Navigation & Workflow**\\n\\n**Sidebar:** Use status icons to track progress (Red \"X\" for missing mandatory fields; Amber \"!\" for missing optional fields).\\n\\n**Dataset Filters:** Tag your data with at least one Topography, Histology, Data Type, and Access Type. Access to data normally changes as a project and resulting datasets mature.\\n\\n**Auto-Expansion:** In those fields where you can add more than one entry typing in the last row automatically creates a new row.\\n\\n**Privacy:** Apply standard low-number suppression in Demographic and Observation sections.",
          "field": {
            "component": "TextField",
            "name": "Welcome & Guide",
            "placeholder": "",
            "label": "Welcome & Guide",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Dataset identifier",
          "is_array_form": false,
          "description": "System dataset identifier.",
          "location": "identifier",
          "guidance": "N/A",
          "field": {
            "component": "TextField",
            "name": "Dataset identifier",
            "placeholder": "226fb3f1-4471-400a-8c39-2b66d46a39b6",
            "label": "System dataset identifier.",
            "limit": 36,
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Dataset Version",
          "is_array_form": false,
          "description": "Three numbers - Major.Minor.Patch e.g. 1.1.0",
          "location": "Dataset Version",
          "guidance": "**Dataset Version**\\n\\nDataset metadata version should follow standard SEMVER naming conventions (https://semver.org). For example: 1.1.0 major.minor.patch.\\n\\n**Major:** Significant/breaking changes.\\n- eg The dataset has now been populated\\n- The access conditions have changed\\n- The purpose of the dataset has changed significantly\\n- There is a change to the type of datasets collected\\n\\n**Minor:** New features and bug fixes.\\n- eg More samples have been added.\\n\\n**Patch:** Minor fixes without new features.\\n- eg more information about the dataset has been added",
          "field": {
            "component": "TextField",
            "name": "Dataset Version",
            "placeholder": "1.1.0",
            "label": "Dataset Version",
            "info": "Three numbers - Major.Minor.Patch e.g. 1.1.0",
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "Associated Project Grants",
          "is_array_form": false,
          "description": null,
          "location": "Associated Project Grants",
          "guidance": "**Associated Project Grants**\\n\\nPlease upload information about any CRUK grants that are associated with the dataset here. This helps to publicise your work at an early stage before any of the datasets have been collected and may help you identify potential collaborators.\\n\\nSo that you can add information about more than one grant, when you start writing in any of the boxes another set of empty boxes will appear at the end.",
          "field": {
            "component": "TextField",
            "name": "Associated Project Grants",
            "placeholder": "",
            "label": "Associated Project Grants",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Persistent identifier of the study",
          "is_array_form": false,
          "description": null,
          "location": "Associated Project Grants.persistentIdentifier",
          "guidance": "**Persistent identifier of the study**\\n\\nNo specific guidance provided.",
          "field": {
            "component": "TextField",
            "name": "Persistent identifier of the study",
            "placeholder": "Enter value...",
            "label": "Persistent identifier of the study",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Project Grant Title",
          "is_array_form": false,
          "description": null,
          "location": "Associated Project Grants.projectGrantTitle",
          "guidance": "**Project Grant Title**\\n\\nThe Project Grant Title should be unique to the CRUK datahub. (Add your institute or name if necessary to disambiguate.",
          "field": {
            "component": "TextField",
            "name": "Project Grant Title",
            "placeholder": "Enter value...",
            "label": "Project Grant Title",
            "info": "The Project Grant Title should be unique to the CRUK datahub. (Add your institute or name if necessary to disambiguate.",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Lead Researcher",
          "is_array_form": false,
          "description": null,
          "location": "Associated Project Grants.leadResearcher",
          "guidance": "**Lead Researcher**\\n\\nNo specific guidance provided.",
          "field": {
            "component": "TextField",
            "name": "Lead Researcher",
            "placeholder": "Dr Smith",
            "label": "Lead Researcher",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Lead Research Institute",
          "is_array_form": false,
          "description": null,
          "location": "Associated Project Grants.leadResearchInstitute",
          "guidance": "**Lead Research Institute**\\n\\nNo specific guidance provided.",
          "field": {
            "component": "TextField",
            "name": "Lead Research Institute",
            "placeholder": "Sussex University",
            "label": "Lead Research Institute",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Grant number(s)",
          "is_array_form": false,
          "description": null,
          "location": "Associated Project Grants.grantNumbers",
          "guidance": "**Grant number(s)**\\n\\nNormally specified on the grant acceptance letter",

          "field": {
            "component": "TextField",
            "name": "Grant number(s)",
            "placeholder": "ABC123",
            "label": "Grant number(s)",
            "info": "List of CRUK and any other grant numbers.",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Project Start Date",
          "is_array_form": false,
          "description": null,
          "location": "Associated Project Grants.projectStartDate",
          "guidance": "**Project Start Date**\\n\\nDate on which the dataset projectGrant starts. This is normally set out in the grant contract and will be different from the start of any data collection",
          "field": {
            "component": "TextField",
            "name": "Project Start Date",
            "placeholder": "Enter value...",
            "label": "Project Start Date",
            "info": "Starting date of project grant.",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Project End Date",
          "is_array_form": false,
          "description": null,
          "location": "Associated Project Grants.projectEndDate",
          "guidance": "**Project End Date**\\n\\nDate on which the dataset project is currently projected to finish. This is normally set out in the grant contract and will be different from the end of any data collection",
          "field": {
            "component": "TextField",
            "name": "Project End Date",
            "placeholder": "Enter value...",
            "label": "Project End Date",
            "info": "Current end date of project grant.",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Project Scope",
          "is_array_form": false,
          "description": null,
          "location": "Associated Project Grants.projectScope",
          "guidance": "**Project Scope**\\n\\nShort paragraph setting out the types of data / biospecimens likely to result from the grant and the cancers covered",
          "field": {
            "component": "TextArea",
            "name": "Project Scope",
            "placeholder": "Longitudinal genomic data including somatic mutations",
            "label": "Project Scope",
            "info": "data and biospecimens expected to result from the grant.",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "revision url",
          "is_array_form": false,
          "description": "Some url with a reference to the record of a previous version of this dataset",
          "location": "revisions.url",
          "guidance": "",
          "field": {
            "component": "TextField",
            "name": "revision url",
            "placeholder": "https://api.service.nhs.uk/health-research-data-catalogue/datasetrevisions/841f7da2-b018-41f6-b4ae-2e0aadab6561",
            "label": "Some url with a reference to the record of a previous version of this dataset",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Metadata Issued Datetime",
          "is_array_form": false,
          "description": "Datetime stamp of when this metadata version was initially issued",
          "location": "issued",
          "guidance": "",
          "field": {
            "component": "TextField",
            "name": "Metadata Issued Datetime",
            "placeholder": "2024-10-24T00:00:00.000Z",
            "label": "Datetime stamp of when this metadata version was initially issued",
            "required": true,
            "hidden": true
          }
        },
        {
          "title": "Last Modified Datetime",
          "is_array_form": false,
          "description": "Datetime stamp of when this metadata was last modified",
          "location": "modified",
          "guidance": "",
          "field": {
            "component": "TextField",
            "name": "Last Modified Datetime",
            "placeholder": "2024-10-24T00:00:00.000Z",
            "label": "Datetime stamp of when this metadata was last modified",
            "required": true,
            "hidden": true
          }
        },
        {
          "title": "Summary",
          "is_array_form": false,
          "description": "Summary of metadata describing key pieces of information.",
          "location": "summary",
          "guidance": "**Summary**\\n\\nPlease include information on:\\n- **Title**\\n- **Short Abstract**\\n- **The Dataset Custodian**\\n- **Contact Points**\\n- **Dataset population size**\\n- **Keywords**\\n- **The Digital Object Identifier (DOI) for the dataset**\\n- **Aliases for the Dataset and/or BioSamples**",
          "field": {
            "component": "TextField",
            "name": "Summary",
            "placeholder": "",
            "label": "Summary",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Title",
          "is_array_form": false,
          "description": null,
          "location": "summary.title",
          "guidance": "- The **title** should provide a short description of the dataset and be **unique** across the gateway.\\n- If your title is not unique, please **add a prefix with your organisation name or identifier** to differentiate it from other datasets within the Gateway.\\n- If an accronym is widely used the dataset name, please add it in brackets () at the end of the title.\\n- Good titles should summarise the content of the dataset and if relevant, **the region the dataset covers**.\\n- **Example**: North West London COVID-19 Patient Level Situation Report",
          "field": {
            "component": "TextField",
            "name": "Title",
            "placeholder": "Linked multi-omic dataset in oesophageal cancer (OCCAMS), Non-small cell lung cancer (NSCLC) real-world dataset",
            "label": "Title",
            "info": "Up to 150 characters.",
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "Dataset abstract",
          "is_array_form": false,
          "description": null,
          "location": "summary.abstract",
          "guidance": "- The abstract should provide a **clear and brief descriptive** signpost for researchers who are searching for data that may be relevant to their research.\\n- The abstract should allow the reader to determine the **scope of the data collection and accurately summarise its content**.\\n- Effective abstracts should **avoid long sentences and abbreviations** where possible.\\n- **Note**: Researchers will view Titles and the first line of Abstracts (list view) when searching for datasets and choosing whether to explore their content further.\\n- **Abstracts should be different from the full description** for a dataset.\\n- **Example**: CPRD Aurum contains primary care data contributed by General Practitioner (GP) practices using EMIS Web® including patient registration information and all care events that GPs have chosen to record as part of their usual medical practice.",
          "field": {
            "component": "TextField",
            "name": "Dataset abstract",
            "placeholder": "Anonymised real-world clinical data from patients with advanced or metastatic non-small cell lung cancer.  Data includes treatments, imaging, long-term follow up and outcomes. Database size = 774 in 2025 + 150 patients/year.",
            "label": "Dataset abstract",
            "info": "Optimal length one paragraph. Limited to 255 characters. Avoid long sentences and abbreviations.",
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "Dataset Custodian",
          "is_array_form": false,
          "description": null,
          "location": "summary.dataCustodian",
          "guidance": "",
          "field": {
            "component": "TextField",
            "name": "Dataset Custodian",
            "placeholder": "",
            "label": "Dataset Custodian",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "identifier",
          "is_array_form": false,
          "description": "Please provide a Research Organization Registry (ROR) identifier (see https://ror.org/) for your organisation.",
          "location": "summary.dataCustodian.identifier",
          "guidance": "**Example**: https://ror.org/053fq8t95\\nIf your organisation does not have a ROR identifier please use the “suggest and institute” function here: https://docs.google.com/forms/d/e/1FAIpQLSdJYaMTCwS7muuTa-B_CnAtCSkKzt19lkirAKG4u7umH9Nosg/viewform",
          "field": {
            "component": "TextField",
            "name": "identifier",
            "placeholder": "https://ror.org/00ayhx656",
            "label": "identifier",
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "Name of Data Custodian",
          "is_array_form": false,
          "description": "The organisation responsible for running or supporting the data access request process, as well as publishing and maintaining the metadata.",
          "location": "summary.dataCustodian.name",
          "guidance": "In most this will be the same as the Team you have on the Gateway. However, in some cases this will be different. For example, Tissue Directory are a Team on the Gateway but coordinate activities across a number of Data Providers such as Cambridge Blood and Stem Cell Biobank.",
          "field": {
            "component": "TextField",
            "name": "Name of Data Custodian",
            "placeholder": "Cancer Research Horizons",
            "label": "Name of Data Custodian",
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "Organisation Logo",
          "is_array_form": false,
          "description": "Please provide a logo associated with the Gateway Organisation using a valid URL. The following formats will be accepted .jpg, .png or .svg.  If a logo is not submitted this will default to the logo for the team submitting the metadata.",
          "location": "summary.dataCustodian.logo",
          "guidance": "",
          "field": {
            "component": "TextField",
            "name": "Organisation Logo",
            "placeholder": null,
            "label": "Please provide a logo associated with the Gateway Organisation using a valid URL. The following formats will be accepted .jpg, .png or .svg.  If a logo is not submitted this will default to the logo for the team submitting the metadata.",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Organisation Description",
          "is_array_form": false,
          "description": "Please provide a URL that describes the organisation.  If a description is not provided this will default to the description of the team submitting the metadata.",
          "location": "summary.dataCustodian.description",
          "guidance": "",
          "field": {
            "component": "TextArea",
            "name": "Organisation Description",
            "placeholder": "Enter value...",
            "label": "Organisation Description",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "contact point",
          "is_array_form": false,
          "description": "Organisation contact point(s) which will be used for receiving queries from CRUK",
          "location": "summary.dataCustodian.contactPoint",
          "guidance": "",
          "field": {
            "component": "TextField",
            "name": "contact point",
            "placeholder": "test@test.co.uk",
            "label": "contact point",
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "Organisation Membership",
          "is_array_form": false,
          "description": "Please indicate if the organisation is an Alliance Member or a Hub.  If this field is not submitted this will default to the membership for the team submitting the metadata.",
          "location": "summary.dataCustodian.memberOf",
          "guidance": "",
          "field": {
            "component": "Select",
            "options": [
              {
                "label": "Hub",
                "value": "Hub"
              },
              {
                "label": "Alliance",
                "value": "Alliance"
              },
              {
                "label": "Other",
                "value": "Other"
              },
              {
                "label": "NCS",
                "value": "NCS"
              }
            ],
            "name": "Organisation Membership",
            "label": "Please indicate if the organisation is an Alliance Member or a Hub.  If this field is not submitted this will default to the membership for the team submitting the metadata.",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Dataset population size",
          "is_array_form": false,
          "description": null,
          "location": "summary.populationSize",
          "guidance": "This number informs a filter for Researchers to differentiate dataset search results based on the number of people in the dataset, and does not pull from the **Observations** fields. The filter also allows for Researchers to search datasets which have no population size reported, but will **not** pull any population size captured in the **Observations** section.",
          "field": {
            "component": "TextField",
            "name": "Dataset population size",
            "type": "number",
            "placeholder": "1000",
            "label": "Dataset population size",
            "info": "Input the number of people captured within the dataset. Defaults to 0.",
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "Keywords",
          "is_array_form": false,
          "description": "If not included in abstract, title or filters, please provide one or more keywords or short phrases to improve search engine optimisation.",
          "location": "summary.keywords",
          "guidance": "- Please provide **relevant** and **specific keywords** that can **improve the search engine optimization** of your dataset.\\n- Please **enter one keyword at a time** and click **Add New Field** to add further keywords.\\n- Text from the title is automatically included in the search, there is no need to include this in the keywords.\\n- Include words that researcher may include in their searches.",
          "field": {
            "component": "Autocomplete",
            "name": "Keywords",
            "label": "Keywords",
            "placeholder": "Hedgehog pathway, p53 hotspot mutation, Oxaliplatin, Accident and Emergency, NHS foundation trust",
            "required": false,
            "hidden": false,
            "freeSolo": true
          }
        },
        {
          "title": "Digital Object Identifier (DOI) for dataset",
          "is_array_form": false,
          "description": "DOI associated to this dataset. Find out more about DOIs here: [https://www.doi.org/the-identifier/what-is-a-doi/](https://www.doi.org/the-identifier/what-is-a-doi/)",
          "location": "summary.doiName",
          "guidance": "- Please note: This is **not** the DOI of the publication(s) associated with the dataset.\\n- All HDR UK registered **datasets** should either have a **(DOI)** or be working towards obtaining one.\\n- If a DOI is available, please provide the DOI.\\n- **What happens if I do not have a DOI?**: Contact your academic organisation to find out if there is an existing relationship with a DOI provider. If that is not available, sites such as figshare offer free services to mint a DOI for your dataset. Subsequent versions of the Metadata Exchange will provide a DOI minting service.",
          "field": {
            "component": "TextField",
            "name": "Digital Object Identifier (DOI) for dataset",
            "placeholder": "10.1093/ije/dyx196",
            "label": "DOI associated to this dataset. Find out more about DOIs here: [https://www.doi.org/the-identifier/what-is-a-doi/](https://www.doi.org/the-identifier/what-is-a-doi/)",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Contact point",
          "is_array_form": false,
          "description": "Email address for coordinating data access requests.",
          "location": "summary.contactPoint",
          "guidance": "Organisations are expected to provide a dedicated email address associated with the data access request process. If no contact point is provided in this field, this field will be defaulted to the teams support email provided in the teams setting.\\n**Note:** An employee's email address can only be provided on a temporary basis and if one is provided, **you must obtain explicit consent for this purpose**.",
          "field": {
            "component": "TextField",
            "name": "Contact point",
            "placeholder": "researcher@university.ac.uk",
            "label": "Contact point",
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "Dataset & BioSample alias",
          "is_array_form": false,
          "description": "Dataset & BioSample alias or alternate names.",
          "location": "summary.datasetAliases",
          "guidance": "Alternate name, acronym or other identifier for the Dataset and/or BioSamples.",
          "field": {
            "component": "TextField",
            "name": "Dataset & BioSample alias",
            "placeholder": "Enter value...",
            "label": "Dataset & BioSample alias",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Lead Researcher",
          "is_array_form": false,
          "description": "Lead for the dataset. This need not be the same as the lead for the underlying grant",
          "location": "summary.leadResearcher",
          "guidance": "**Lead Researcher**\\n\\nLead for the dataset. This need not be the same as the lead for the underlying grant.",
          "field": {
            "component": "TextField",
            "name": "Lead Researcher",
            "placeholder": "Professor Karen Blogs, Dr A Dataset",
            "label": "Lead Researcher",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Lead Research Institute",
          "is_array_form": false,
          "description": null,
          "location": "summary.leadResearchInstitute",
          "guidance": "**Lead Research Institute**\\n\\nNo specific guidance provided.",
          "field": {
            "component": "TextField",
            "name": "Lead Research Institute",
            "placeholder": "Sussex University",
            "label": "Lead Research Institute",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Documentation",
          "is_array_form": false,
          "description": "Documentation can include a rich text description of the dataset or links to media such as documents, images, presentations, videos or links to data dictionaries, profiles or dashboards. Organisations are required to confirm that they have permission to distribute any additional media.",
          "location": "documentation",
          "guidance": "**Documentation**\\n\\nDocumentation can include a rich text description of the dataset or links to media such as documents, images, presentations, videos or links to data dictionaries, profiles or dashboards. Organisations are required to confirm that they have permission to distribute any additional media.",
          "field": {
            "component": "TextField",
            "name": "Documentation",
            "placeholder": "",
            "label": "Documentation",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "description",
          "is_array_form": false,
          "description": "Free-text description of the dataset.",
          "location": "documentation.description",
          "guidance": "- An HTML account of the data that **provides context and scope** of the data, **limited to 10000 characters, and/or a resolvable URL** that describes the dataset.\\n- Additional information can be recorded and included using the Associated media field.",
          "field": {
            "component": "TextArea",
            "name": "description",
            "placeholder": "OPTIMAM is a database of mammogram images and associated clinical data from multiple NHS Breast Cancer screening programmes collected as part of routine care.",
            "label": "description",
            "limit": 10000,
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "Associated media",
          "is_array_form": false,
          "description": "Url linking to associated media. Note: media asset can be hosted by the organisation or uploaded using the onboarding portal.",
          "location": "documentation.associatedMedia",
          "guidance": "- Please provide any media associated with the Gateway Organisation **using a valid URL** for the content.\\n- This is an opportunity to **provide additional context** that could be useful for researchers wanting to understand more about the dataset and its relevance to their research question.\\n- Note: media assets should be hosted by the organisation or uploaded using the onboarding portal.\\n- **Example**: This could be a **link to a PDF Document** that describes methodology or further detail about the datasets, or a graph or chart that provides further context about the dataset.\\n- If you are providing multiple links for associated media, we recommend that you separate these with a comma.",
          "field": {
            "component": "TextField",
            "name": "Associated media",
            "placeholder": "PDF document that describes study protocol - https://link.to/document.pdf",
            "label": "Associated media",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Dataset pipeline status",
          "is_array_form": false,
          "description": "Indicate whether this dataset is currently available for Researchers to request access.",
          "location": "documentation.inPipeline",
          "guidance": "If a dataset is being prepared for sharing but not yet ready and available for researchers to apply for access, select 'Not available'. If Researchers can currently apply for access to the dataset, select 'Available'.",
          "field": {
            "component": "Select",
            "options": [
              {
                "label": "-- Select --",
                "value": ""
              },
              {
                "label": "Available",
                "value": "Available"
              },
              {
                "label": "Not available",
                "value": "Not available"
              }
            ],
            "name": "Dataset pipeline status",
            "label": "Dataset pipeline status",
            "required": false,
            "hidden": false
          }
        },
        {
            "title": "Dataset Filters",
            "is_array_form": false,
            "description": "Please tag your dataset with specific filters identifying the type of cancer covered, the type of data it contains and accessibility. This improves the searchability of your dataset.",
            "location": "Dataset Filters",
            "guidance": "**Dataset Filters**\\n\\nDatasets in the CRUK datahub are filtered according to three criteria: type of cancer, type of data and access conditions.\\n\\nUse ICD-O terminology to categorise each of the cancers covered, and keywords to include further important details. This is automatically translated to CRUK and TCGA equivalents.",
            "field": {
              "component": "TextField",
              "name": "Dataset Filters",
              "placeholder": "",
              "label": "Dataset Filters",
              "required": false,
              "hidden": true
            }
          },
          {
            "title": "Structural Metadata",
            "is_array_form": false,
            "description": "",
            "location": "structuralMetadata",
            "guidance": "**Table Guidelines**\\n\\nPlease identify each of the tables in the dataset. When you fill in information for the first table, a new box will automatically be added to the end.",
            "field": {
              "component": "TextField",
              "name": "Structural Metadata",
              "placeholder": "",
              "label": "Structural Metadata",
              "required": false,
              "hidden": true
            }
          },
          {
            "title": "Upload File of Structural Metadata.",
            "is_array_form": false,
            "description": "If you've done this before you can upload a .csv or single-sheeted .xls file here, and then edit it below. Alternatively manually create your table below.",
            "location": "structuralMetadata.upload",
            "guidance": "",
            "field": {
              "component": "TextField",
              "name": "Upload File of Structural Metadata.",
              "placeholder": "",
              "label": "Upload File of Structural Metadata.",
              "required": false,
              "hidden": true
            }
          },
          {
            "title": "Review Structural Metadata",
            "is_array_form": false,
            "description": "Edit cells directly. Type in the ghost rows to add new entries.",
            "location": "structuralMetadata.review",
            "guidance": "",
            "field": {
              "component": "TextField",
              "name": "Review Structural Metadata",
              "placeholder": "",
              "label": "Review Structural Metadata",
              "required": false,
              "hidden": true
            }
          },
          {
            "title": "Synthetic data web links",
            "is_array_form": false,
            "description": "Please provide the website address(es) with information on your synthetic dataset creation, or the location where a synthetic version of the dataset can be accessed.\\n- Please split your existing list of citations into separate fields.\\n- To add multiple entries, select from the drop-down list, or add to the drop-down. Click the 'x' symbol to remove any entries.\\n- **Example**: https://www.pioneerdatahub.co.uk/dataset/synthetic-dataset-patients-at-risk-of-sudden-death-hypertrophic-cardiomyopathy/",
            "location": "structuralMetadata.syntheticDataWebLink",
            "guidance": "",
            "field": {
              "component": "Autocomplete",
              "name": "Synthetic data web links",
              "label": "Please provide the website address(es) with information on your synthetic dataset creation, or the location where a synthetic version of the dataset can be accessed.\\n- Please split your existing list of citations into separate fields.\\n- To add multiple entries, select from the drop-down list, or add to the drop-down. Click the 'x' symbol to remove any entries.\\n- **Example**: https://www.pioneerdatahub.co.uk/dataset/synthetic-dataset-patients-at-risk-of-sudden-death-hypertrophic-cardiomyopathy/",
              "placeholder": null,
              "required": false,
              "hidden": false,
              "freeSolo": true
            }
          },
          {
            "title": "Other data types",
            "is_array_form": false,
            "description": "",
            "location": "Other.data.types",
            "guidance": "Datasets often now include audio-visual data such as recordings and images. Please list, describe and identify the format.",
            "field": {
              "component": "TextField",
              "name": "Other data types",
              "placeholder": "",
              "label": "Other data types",
              "required": false,
              "hidden": true
            }
          },
          {
            "title": "Non-tabular data types Array",
            "is_array_form": true,
            "required": false,
            "description": null,
            "location": "Other.data.types.nonTabularDataTypes",
            "guidance": "",
            "fields": [
              {
                "title": "Title",
                "is_array_form": false,
                "description": null,
                "location": "Other.data.types.nonTabularDataTypes.title",
                "guidance": "",
                "field": {
                  "component": "TextField",
                  "name": "Title",
                  "label": "Title",
                  "placeholder": "Mammograms, Patient recordings",
                  "required": true,
                  "hidden": false
                }
              },
              {
                "title": "Data description",
                "is_array_form": false,
                "description": null,
                "location": "Other.data.types.nonTabularDataTypes.description",
                "guidance": "",
                "field": {
                  "component": "TextField",
                  "name": "Data description",
                  "label": "Data description",
                  "placeholder": "2D images of both normal and malignant breasts, audio-tapes of oncology consultations",
                  "required": true,
                  "hidden": false
                }
              },
              {
                "title": "Format",
                "is_array_form": false,
                "description": "Format drawn from https://www.iana.org/assignments/media-types/media-types.xhtml.",
                "location": "Other.data.types.nonTabularDataTypes.format",
                "guidance": "",
                "field": {
                  "component": "TextField",
                  "name": "Format",
                  "label": "Format",
                  "placeholder": "Enter value...",
                  "required": true,
                  "hidden": false
                }
              }
            ]
          },
          {
            "title": "Entity Relationship Diagram",
            "is_array_form": false,
            "description": "Visual representation of data table relationships.",
            "location": "Entity Relationship Diagram",
            "guidance": "**Url**\\n\\nNo specific guidance provided.\\n\\n**Visual Schema Linkage**\\n\\n![Entity relationship diagram](https://crukdatahublandingpage-production.up.railway.app/assets/erd.png)",
            "field": {
              "component": "TextField",
              "name": "Entity Relationship Diagram",
              "placeholder": "",
              "label": "Entity Relationship Diagram",
              "required": false,
              "hidden": true
            }
          },
          {
            "title": "Url",
            "is_array_form": false,
            "description": null,
            "location": "Entity Relationship Diagram.url",
            "guidance": "**Url**\\n\\nNo specific guidance provided.\\n\\n**Visual Schema Linkage**\\n\\n![Entity relationship diagram](https://crukdatahublandingpage-production.up.railway.app/assets/erd.png)",
            "field": {
              "component": "TextField",
              "name": "Url",
              "placeholder": "Enter value...",
              "label": "Url",
              "required": false,
              "hidden": false
            }
          },
        {
          "title": "Coverage",
          "is_array_form": false,
          "description": null,
          "location": "coverage",
          "guidance": "Include the minimum and maximum age of participants, as well as a URL where a researcher can learn more about the completeness of the dataset.",
          "field": {
            "component": "TextField",
            "name": "Coverage",
            "placeholder": "",
            "label": "Coverage",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Minimum age range",
          "is_array_form": false,
          "description": "Please indicate the minimum age in years of participants in the dataset as a whole number (integer).",
          "location": "coverage.typicalAgeRangeMin",
          "guidance": "- Please indicate the minimum of the age range in whole years of participants in the dataset.\\n- **What if my dataset has participants of all “All Ages” or “Any Ages”?**: In that case, please enter 0.",
          "field": {
            "component": "TextField",
            "name": "Minimum age range",
            "type": "number",
            "placeholder": 18,
            "label": "Please indicate the minimum age in years of participants in the dataset as a whole number (integer).",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Maximum age range",
          "is_array_form": false,
          "description": "Please indicate the maximum age in years of participants in the dataset as a whole number (integer).",
          "location": "coverage.typicalAgeRangeMax",
          "guidance": "- Please indicate the maximum of the age range in whole years of participants in the dataset.\\n- **What if my dataset has participants of all “All Ages” or “Any Ages”?**: In that case, please enter 150.",
          "field": {
            "component": "TextField",
            "name": "Maximum age range",
            "type": "number",
            "placeholder": 90,
            "label": "Please indicate the maximum age in years of participants in the dataset as a whole number (integer).",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Dataset coverage/completeness/quality",
          "is_array_form": false,
          "description": "The URL where a Researcher can learn more about the completeness of the dataset.",
          "location": "coverage.datasetCompleteness",
          "guidance": "If your organisation has a publicly available site which contains information on the completeness of a dataset, add that URL here.\\n**Example**: https://bhfdatasciencecentre.org/dashboard/",
          "field": {
            "component": "TextField",
            "name": "Dataset coverage/completeness/quality",
            "placeholder": "https://bhfdatasciencecentre.org/dashboard/",
            "label": "The URL where a Researcher can learn more about the completeness of the dataset.",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Dataset Timelines",
          "is_array_form": false,
          "description": "Optional information setting out how often the information is updated and the time period covered.",
          "location": "provenance",
          "guidance": "Optional information setting out how often the information is updated and the time period covered.",
          "field": {
            "component": "TextField",
            "name": "Dataset Timelines",
            "placeholder": "",
            "label": "Dataset Timelines",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Source of data extraction",
          "is_array_form": false,
          "description": "Please indicate the source of the data extraction.",
          "location": "provenance.origin.source",
          "guidance": " - **EPR**: Data Extracted from Electronic Patient Record.\\n- **Electronic survey**: Data has been extracted from electronic surveys.\\n- **LIMS**: Data has been extracted from a laboratory information management system.\\n- **Paper-based**: Data has been extracted from paper forms.\\n- **Free text NLP**: Data has been extracted from unstructured freetext using natural language processing.\\n- **Machine generated**: Data has been machine generated i.e. imaging.\\n- **Other**: Data has been extracted by other means.",
          "field": {
            "component": "Autocomplete",
            "options": [
              {
                "label": "EPR",
                "value": "EPR"
              },
              {
                "label": "Electronic survey",
                "value": "Electronic survey"
              },
              {
                "label": "LIMS",
                "value": "LIMS"
              },
              {
                "label": "Paper-based",
                "value": "Paper-based"
              },
              {
                "label": "Free text NLP",
                "value": "Free text NLP"
              },
              {
                "label": "Machine generated",
                "value": "Machine generated"
              },
              {
                "label": "Other",
                "value": "Other"
              }
            ],
            "name": "Source of data extraction",
            "label": "Please indicate the source of the data extraction.",
            "placeholder": null,
            "required": false,
            "hidden": true,
            "freeSolo": false
          }
        },
        {
          "title": "Collection source setting",
          "is_array_form": false,
          "description": "Please indicate the setting(s) where data was collected. Multiple settings may be provided.",
          "location": "provenance.origin.collectionSource",
          "guidance": "- **Cohort, study, trial**: Cohort, study or trial data collection as part of protocol.\\n- **Clinic**: Specific clinic such as antenatal clinic.\\n- **Primary care - Referrals**: General medical practitioner referral to another service.\\n- **Primary care - Clinic**: General medical practitioner practice.\\n- **Primary care - Out of hours**: General medical practitioner care or advice outside of standard hours.\\n- **Secondary care - Accident and emergency**: Accident emergency department.\\n- **Secondary care - Outpatients**: Outpatient care.\\n- **Secondary care - In-patients**: In-patient care.\\n- **Secondary care - Ambulance**: Care provided in association with ambulance service.\\n- **Secondary care - ICU**: Intensive care units, also referred to as critical care units (CCUs) or intensive therapy units (ITUs).\\n- **Prescribing - Community pharmacy**: Pharmacy based in the community.\\n- **Prescribing - Community pharmacy**: Pharmacy based in a hospital setting.\\n- **Patient report outcome**: Reported by patient.\\n- **Wearables**: Data collection devices worn on the body.\\n- **Local authority**: Local authority or entity associated with a local authority.\\n- **National government**: National government or entity associated with the national government.\\n- **Community**: Community settings.\\n- **Services**: Services such as drug misuse or blood transfusion.\\n- **Home**: Home setting.\\n- **Private**: Private medical clinic.\\n- **Social care - Health care at home**: service provided in the home or residence of a person.\\n- **Social care - Other social data**: service provided in a setting outside of the person's home or residence.\\n- **Census**: collected as part of census.\\n- **Other**: Other setting.",
          "field": {
            "component": "Autocomplete",
            "options": [
              {
                "label": "Cohort, study, trial",
                "value": "Cohort, study, trial"
              },
              {
                "label": "Clinic",
                "value": "Clinic"
              },
              {
                "label": "Primary care - Referrals",
                "value": "Primary care - Referrals"
              },
              {
                "label": "Primary care - Clinic",
                "value": "Primary care - Clinic"
              },
              {
                "label": "Primary care - Out of hours",
                "value": "Primary care - Out of hours"
              },
              {
                "label": "Secondary care - Accident and Emergency",
                "value": "Secondary care - Accident and Emergency"
              },
              {
                "label": "Secondary care - Outpatients",
                "value": "Secondary care - Outpatients"
              },
              {
                "label": "Secondary care - In-patients",
                "value": "Secondary care - In-patients"
              },
              {
                "label": "Secondary care - Ambulance",
                "value": "Secondary care - Ambulance"
              },
              {
                "label": "Secondary care - ICU",
                "value": "Secondary care - ICU"
              },
              {
                "label": "Prescribing - Community pharmacy",
                "value": "Prescribing - Community pharmacy"
              },
              {
                "label": "Prescribing - Hospital",
                "value": "Prescribing - Hospital"
              },
              {
                "label": "Patient report outcome",
                "value": "Patient report outcome"
              },
              {
                "label": "Wearables",
                "value": "Wearables"
              },
              {
                "label": "Local authority",
                "value": "Local authority"
              },
              {
                "label": "National government",
                "value": "National government"
              },
              {
                "label": "Community",
                "value": "Community"
              },
              {
                "label": "Services",
                "value": "Services"
              },
              {
                "label": "Home",
                "value": "Home"
              },
              {
                "label": "Private",
                "value": "Private"
              },
              {
                "label": "Social care - Health care at home",
                "value": "Social care - Health care at home"
              },
              {
                "label": "Social care - Other social data",
                "value": "Social care - Other social data"
              },
              {
                "label": "Census",
                "value": "Census"
              },
              {
                "label": "Other",
                "value": "Other"
              },
              {
                "label": null,
                "value": null
              }
            ],
            "name": "Collection source setting",
            "label": "Please indicate the setting(s) where data was collected. Multiple settings may be provided.",
            "placeholder": null,
            "required": false,
            "hidden": true,
            "freeSolo": false
          }
        },
        {
          "title": "Image contrast",
          "is_array_form": false,
          "description": "Indicate whether usage of imaging contrast is captured within the dataset.",
          "location": "provenance.origin.imageContrast",
          "guidance": "If any contrast media or contrast agents were used in creating the images within the dataset and the contrast is known, mark 'Yes'. If this information is not known or not captured, indicate 'Not stated'. If there was no contrast used in the images, mark 'No'.",
          "field": {
            "component": "Select",
            "options": [
              {
                "label": "Yes",
                "value": "Yes"
              },
              {
                "label": "No",
                "value": "No"
              },
              {
                "label": "Not stated",
                "value": "Not stated"
              }
            ],
            "name": "Image contrast",
            "label": "Indicate whether usage of imaging contrast is captured within the dataset.",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Temporal Coverage",
          "is_array_form": false,
          "description": null,
          "location": "provenance.temporal",
          "guidance": "",
          "field": {
            "component": "TextField",
            "name": "Temporal Coverage",
            "placeholder": "",
            "label": "Temporal Coverage",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Publishing frequency",
          "is_array_form": false,
          "description": "Frequency of distribution release",
          "location": "provenance.temporal.publishingFrequency",
          "guidance": "**Publishing frequency**\\n\\nPlease indicate the frequency of publishing.\\n- If a dataset is published regularly please choose a publishing periodicity from the constrained list and indicate the next release date.\\n- When the release date becomes historical, a new release date will be calculated based on the publishing periodicity.\\n- If a dataset has been published and will remain static please indicate that it is static and indicate when it was released.\\n- If a dataset is released on an irregular basis or “on-demand” please indicate that it is Irregular and leave release date as null.\\n- If a dataset can be published in real-time or near-real-time please indicate that it is continuous and leave release date as null.\\n- Notes: see https://www.dublincore.org/specifications/dublin-core/collection-description/frequency/.\\n\\n**Options:**\\n- **Static**: Dataset published once.\\n- **Irregular**: Dataset published at uneven intervals.\\n- **Continuous**: Dataset published without interruption.\\n- **Biennial**: Dataset published every two years.\\n- **Annual**: Dataset published occurs once a year.\\n- **Biannual**: Dataset published twice a year.\\n- **Quarterly**: Dataset published every three months.\\n- **Bimonthly**: Dataset published every two months.\\n- **Monthly**: Dataset published once a month.\\n- **Biweekly**: Dataset published every two weeks.\\n- **Weekly**: Dataset published once a week.\\n- **Twice weekly**: Dataset published twice a week.\\n- **Daily**: Dataset published once a day.\\n- **Other**: Dataset published using other interval.",
          "field": {
            "component": "Select",
            "options": [
              {
                "label": "-- Select --",
                "value": ""
              },
              {
                "label": "Static",
                "value": "Static"
              },
              {
                "label": "Irregular",
                "value": "Irregular"
              },
              {
                "label": "Continuous",
                "value": "Continuous"
              },
              {
                "label": "Biennial",
                "value": "Biennial"
              },
              {
                "label": "Annual",
                "value": "Annual"
              },
              {
                "label": "Biannual",
                "value": "Biannual"
              },
              {
                "label": "Quarterly",
                "value": "Quarterly"
              },
              {
                "label": "Bimonthly",
                "value": "Bimonthly"
              },
              {
                "label": "Monthly",
                "value": "Monthly"
              },
              {
                "label": "Biweekly",
                "value": "Biweekly"
              },
              {
                "label": "Weekly",
                "value": "Weekly"
              },
              {
                "label": "Twice a week",
                "value": "Twice a week"
              },
              {
                "label": "Daily",
                "value": "Daily"
              },
              {
                "label": "Other",
                "value": "Other"
              }
            ],
            "name": "Publishing frequency",
            "label": "Publishing frequency",
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "Distribution release date",
          "is_array_form": false,
          "description": "Latest release date",
          "location": "provenance.temporal.distributionReleaseDate",
          "guidance": "**Distribution release date**\\n\\nDate of the latest release of the dataset. If this is a regular release i.e. quarterly, or this is a static dataset please complete this alongside Periodicity. If this is Irregular or Continuously released please leave this blank.\\n\\nPeriodicity and release date will be used to determine when the next release is expected. E.g. if the release date is documented as 01/01/2020 and it is now 20/04/2020 and there is a quarterly release schedule, the latest release will be calculated as 01/04/2020.",
          "field": {
            "component": "DatePicker",
            "name": "Distribution release date",
            "label": "Date of the latest release of the dataset. If this is a regular release i.e. quarterly, or this is a static dataset please complete this alongside Periodicity. If this is Irregular or Continuously released please leave this blank. Notes: Periodicity and release date will be used to determine when the next release is expected. E.g. if the release date is documented as 01/01/2020 and it is now 20/04/2020 and there is a quarterly release schedule, the latest release will be calculated as 01/04/2020.",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Start date",
          "is_array_form": false,
          "description": "The start of the time period that the dataset provides coverage for. If there are multiple cohorts in the dataset with varying start dates, please provide the earliest date and use the description or the media attribute to provide more information.",
          "location": "provenance.temporal.startDate",
          "guidance": "**Start date**\\n\\n- The start of the time period that the dataset provides coverage for.\\n- If there are multiple cohorts in the dataset with varying start dates, please provide the earliest date and use the description or the media attribute to provide more information.",
          "field": {
            "component": "DatePicker",
            "name": "Start date",
            "label": "The start of the time period that the dataset provides coverage for. If there are multiple cohorts in the dataset with varying start dates, please provide the earliest date and use the description or the media attribute to provide more information.",
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "End date",
          "is_array_form": false,
          "description": "The end of the time period that the dataset provides coverage for. If the dataset is “Continuous” and has no known end date, please state continuous. If there are multiple cohorts in the dataset with varying end dates, please provide the latest date and use the description or the media attribute to provide more information.",
          "location": "provenance.temporal.endDate",
          "guidance": "**End date**\\n\\n- The end of the time period that the dataset provides coverage for.\\n- If the dataset is **“Continuous”** and has no known end date, **please leave blank**.\\n- If there are **multiple cohorts** in the dataset with varying end dates, please provide the **latest date**.",
          "field": {
            "component": "DatePicker",
            "name": "End date",
            "label": "The end of the time period that the dataset provides coverage for. If the dataset is “Continuous” and has no known end date, please state continuous. If there are multiple cohorts in the dataset with varying end dates, please provide the latest date and use the description or the media attribute to provide more information.",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Time lag",
          "is_array_form": false,
          "description": "Typical time-lag between events and data appearing in the dataset.",
          "location": "provenance.temporal.timeLag",
          "guidance": "**Time lag**\\n\\nPlease indicate the typical time-lag between an event and the data for that event appearing in the dataset.\\n\\n**Options:**\\n- **Less than 1 week**: Typical time lag of less than a week.\\n- **1-2 weeks**: Typical time-lag of one to two weeks.\\n- **2-4 weeks**: Typical time-lag of two to four weeks.\\n- **1-2 months**: Typical time-lag of one to two months.\\n- **2-6 months**: Typical time-lag of two to six months.\\n- **More than 6 months**: Typical time-lag of more than six months.\\n- **Variable**: Variable time-lag.\\n- **Not applicable**: Not Applicable i.e. static dataset.\\n- **Other**: Other time-lag.",
          "field": {
            "component": "Select",
            "options": [
              {
                "label": "-- Select --",
                "value": ""
              },
              {
                "label": "Less than 1 week",
                "value": "Less than 1 week"
              },
              {
                "label": "1-2 weeks",
                "value": "1-2 weeks"
              },
              {
                "label": "2-4 weeks",
                "value": "2-4 weeks"
              },
              {
                "label": "1-2 months",
                "value": "1-2 months"
              },
              {
                "label": "2-6 months",
                "value": "2-6 months"
              },
              {
                "label": "More than 6 months",
                "value": "More than 6 months"
              },
              {
                "label": "Variable",
                "value": "Variable"
              },
              {
                "label": "Not applicable",
                "value": "Not applicable"
              },
              {
                "label": "Other",
                "value": "Other"
              }
            ],
            "name": "Time lag",
            "label": "Time lag",
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "Accessibility",
          "is_array_form": false,
          "description": "Upload information on how researchers can gain access to the data and access restrictions.",
          "location": "accessibility",
          "guidance": "Upload information on how researchers can gain access to the data and access restrictions.",
          "field": {
            "component": "TextField",
            "name": "Accessibility",
            "placeholder": "",
            "label": "Accessibility",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Usage",
          "is_array_form": false,
          "description": null,
          "location": "accessibility.usage",
          "guidance": "",
          "field": {
            "component": "TextField",
            "name": "Usage",
            "placeholder": "",
            "label": "Usage",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Access",
          "is_array_form": false,
          "description": null,
          "location": "accessibility.access",
          "guidance": "",
          "field": {
            "component": "TextField",
            "name": "Access",
            "placeholder": "",
            "label": "Access",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Data use limitation",
          "is_array_form": false,
          "description": "Please provide an indication of consent permissions for datasets and/or materials, and relates to the purposes for which datasets and/or material might be removed, stored or used. NOTE: we have extended the Data Use Ontology to include a value for NO LINKAGE.",
          "location": "accessibility.usage.dataUseLimitation",
          "guidance": "**Data use limitation**\\n\\nPlease provide an indication of consent permissions for datasets and/or materials, and relates to the purposes for which datasets and/or material might be removed, stored or used.\\n- **General research use**: This data use limitation indicates that use is allowed for general research use for any research purpose.\\n- **Genetic studies only**: This data use limitation indicates that use is limited to genetic studies only (i.e., no phenotype-only research).\\n- **No general methods research**: This data use limitation indicates that use includes methods development research(e.g., development of software or algorithms) only within the bounds of other use limitations.\\n- **No restriction**: This data use limitation indicates there is no restriction on use.\\n- **Research-specific restrictions**: This data use limitation indicates that use is limited to studies of a certain research type.\\n- **Research use only**: This data use limitation indicates that use is limited to research purposes (e.g., does not include its use in clinical care).\\n- **No linkage**: This data use limitation indicates there is a restriction on linking to any other datasets",
          "field": {
            "component": "Autocomplete",
            "options": [
              {
                "label": "General research use",
                "value": "General research use"
              },
              {
                "label": "Commercial research use",
                "value": "Commercial research use"
              },
              {
                "label": "Genetic studies only",
                "value": "Genetic studies only"
              },
              {
                "label": "No general methods research",
                "value": "No general methods research"
              },
              {
                "label": "No restriction",
                "value": "No restriction"
              },
              {
                "label": "Geographical restrictions",
                "value": "Geographical restrictions"
              },
              {
                "label": "Institution-specific restrictions",
                "value": "Institution-specific restrictions"
              },
              {
                "label": "Not for profit use",
                "value": "Not for profit use"
              },
              {
                "label": "Project-specific restrictions",
                "value": "Project-specific restrictions"
              },
              {
                "label": "Research-specific restrictions",
                "value": "Research-specific restrictions"
              },
              {
                "label": "User-specific restrictions",
                "value": "User-specific restrictions"
              },
              {
                "label": "Research use only",
                "value": "Research use only"
              },
              {
                "label": "No linkage",
                "value": "No linkage"
              }
            ],
            "name": "Data use limitation",
            "label": "Data use limitation",
            "placeholder": "Enter value...",
            "required": false,
            "hidden": false,
            "freeSolo": false
          }
        },
        {
          "title": "Data use requirements",
          "is_array_form": false,
          "description": "Please indicate if there are any additional conditions set for use if any, multiple requirements may be provided. Please ensure that these restrictions are documented in access rights information.",
          "location": "accessibility.usage.dataUseRequirements",
          "guidance": "**Data use requirements**\\n\\n- Please indicate if there are any additional conditions set for use if any, multiple requirements may be provided.\\n- Please ensure that these restrictions are documented in access rights information.\\n- **Collaboration required**: This requirement indicates that the requestor must either agree to join a research consortium or collaborate with the primary study investigator(s).\\n- **Ethics approval required**: This requirement indicates that the requestor must provide documentation of local institutional review board (IRB)/ ethics review board (ERB) approval.\\n- **Geographical restrictions**: This requirement indicates that use is limited to within a specific geographic region.\\n- **Institution-specific restrictions**: This requirement indicates that use is limited to use within an approved institution.\\n- **Not for profit use**: This requirement indicates that use of the data is limited to not-for-profit organizations and not-for-profit use, non-commercial use.\\n- **Project-specific restrictions**: This requirement indicates that use is limited to use within an approved project.\\n- **Publication moratorium**: This requirement indicates that requestor agrees not to publish results of studies until a specific date.\\n- **Publication required**: This requirement indicates that requestor agrees to make results of studies using the data available to the larger scientific community.\\n- **Return to database or resource**: This requirement indicates that the requestor must return derived/enriched data to the database/resource.\\n- **Time limit on use**: This requirement indicates that use is approved for a specific number of months.\\n- **User-specific restriction**: This requirement indicates that use is limited to use by approved users.",
          "field": {
            "component": "Autocomplete",
            "options": [
              {
                "label": "Collaboration required",
                "value": "Collaboration required"
              },
              {
                "label": "Project-specific restrictions",
                "value": "Project-specific restrictions"
              },
              {
                "label": "Ethics approval required",
                "value": "Ethics approval required"
              },
              {
                "label": "Institution-specific restrictions",
                "value": "Institution-specific restrictions"
              },
              {
                "label": "Geographical restrictions",
                "value": "Geographical restrictions"
              },
              {
                "label": "Publication moratorium",
                "value": "Publication moratorium"
              },
              {
                "label": "Publication required",
                "value": "Publication required"
              },
              {
                "label": "Return to database or resource",
                "value": "Return to database or resource"
              },
              {
                "label": "Time limit on use",
                "value": "Time limit on use"
              },
              {
                "label": "Disclosure control",
                "value": "Disclosure control"
              },
              {
                "label": "Not for profit use",
                "value": "Not for profit use"
              },
              {
                "label": "User-specific restriction",
                "value": "User-specific restriction"
              }
            ],
            "name": "Data use requirements",
            "label": "Data use requirements",
            "placeholder": "Enter value...",
            "required": false,
            "hidden": false,
            "freeSolo": false
          }
        },
        {
          "title": "Citation requirements",
          "is_array_form": false,
          "description": "Please provide the text that you would like included as part of any citation that credits this dataset. This is typically just the name of the publisher. No employee details should be provided.",
          "location": "accessibility.usage.resourceCreator",
          "guidance": "**Citation requirements**\\n\\n- Please provide the text that you would like included as part of any citation that credits this dataset.\\n- This is typically just the name of the publisher. No employee details should be provided.\\n- To add multiple entries, please click on **'+' symbol** to enter each separate website.\\n- **Example**: National Services Scotland",
          "field": {
            "component": "TextArea",
            "name": "Citation requirements",
            "placeholder": "National Services Scotland",
            "label": "Citation requirements",
            "limit": 1000,
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Access rights",
          "is_array_form": false,
          "description": "Please provide details for the data access rights.",
          "location": "accessibility.access.accessRights",
          "guidance": "**Access rights**\\n\\n- The URL of a webpage where the data access request process and/or guidance is provided. If there is more than one access process i.e. industry vs academic please provide both separated by a comma.\\n- If such a resource or the underlying process doesn’t exist, please provide “In Progress”, until both the process and the documentation are ready.",
          "field": {
            "component": "TextArea",
            "name": "Access rights",
            "placeholder": "In Progress",
            "label": "Access rights",
            "limit": 50000,
            "required": true,
            "hidden": false
          }
        },
        {
          "title": "Access method category",
          "is_array_form": false,
          "description": "The method a Researcher will use to access the dataset, if approved.",
          "location": "accessibility.access.accessServiceCategory",
          "guidance": "**Access method category**\\n\\nSelect the category which best matches how a Researcher will access the dataset, if approved for access. If the access method changes based on the data required for the project (e.g. the dataset can be shared via secure email if the extract is fully anonymised, but must be accessed via a TRE/SDE if the extract is only pseudonymised) then select 'varies based on project'.",
          "field": {
            "component": "Select",
            "options": [
              {
                "label": "-- Select --",
                "value": ""
              },
              {
                "label": "TRE/SDE",
                "value": "TRE/SDE"
              },
              {
                "label": "Direct access",
                "value": "Direct access"
              },
              {
                "label": "Open access",
                "value": "Open access"
              },
              {
                "label": "Varies based on project",
                "value": "Varies based on project"
              }
            ],
            "name": "Access method category",
            "label": "Access method category",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Access service description",
          "is_array_form": false,
          "description": "Please provide a brief description of the data access services that are available including: environment that is currently available to researchers; additional consultancy and services; any indication of costs associated. If no environment is currently available, please indicate the current plans and timelines when and how data will be made available to researchers Note: This value will be used as default access environment for all datasets submitted by the organisation. However, there will be the opportunity to overwrite this value for each dataset.",
          "location": "accessibility.access.accessService",
          "guidance": "**Access service description**\\n\\nPlease provide a brief description of the data access services that are available including:\\n- environment that is currently available to researchers\\n- additional consultancy and services\\n- any indication of costs associated\\n\\n  If no environment is currently available, please indicate the current plans and timelines when and how data will be made available to researchers.\\n  **Note**: This value will be used as default access environment for all datasets submitted by the organisation. However, there will be the opportunity to overwrite this value for each dataset.",
          "field": {
            "component": "TextArea",
            "name": "Access service description",
            "placeholder": "https://re-docs.genomicsengland.co.uk/tutorials/",
            "label": "Access service description",
            "limit": 50000,
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Access request cost",
          "is_array_form": false,
          "description": "Please provide link(s) to a webpage or description detailing the service or cost model for processing data access requests.",
          "location": "accessibility.access.accessRequestCost",
          "guidance": "**Access request cost**\\n\\nThis information should cover the costs and/or services available to different audiences (i.e. academic, commercial, non-UK, etc.). This can be in the form of text or a URL.",
          "field": {
            "component": "TextArea",
            "name": "Access request cost",
            "placeholder": "Enter value...",
            "label": "Access request cost",
            "limit": 50000,
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Time to dataset access",
          "is_array_form": false,
          "description": "Please provide an indication of the typical processing times based on the types of requests typically received.",
          "location": "accessibility.access.deliveryLeadTime",
          "guidance": "**Time to dataset access**\\n\\n- **Less than 1 week**: Access request process typically processed in less than a week.\\n- **1-2 weeks**: Access request process typically processed in one to two weeks.\\n- **2-4 weeks**: Access request process typically processed in two to four weeks.\\n- **1-2 months**: Access request process typically processed in one to two months.\\n- **2-6 months**: Access request process typically processed in two to six months.\\n- **More than 6 months**: Access request process typically processed in more than six months.\\n- **Variable**: Access request lead time is variable.\\n- **Not applicable**: Access request process duration is not applicable.\\n- **Other**: If the typical timeframe does not fit into the broad ranges i.e. lightweight application vs linked data application, please choose “Other” and indicate the typical timeframe within the description for the dataset.",
          "field": {
            "component": "Select",
            "options": [
              {
                "label": "-- Select --",
                "value": ""
              },
              {
                "label": "Less than 1 week",
                "value": "Less than 1 week"
              },
              {
                "label": "1-2 weeks",
                "value": "1-2 weeks"
              },
              {
                "label": "2-4 weeks",
                "value": "2-4 weeks"
              },
              {
                "label": "1-2 months",
                "value": "1-2 months"
              },
              {
                "label": "2-6 months",
                "value": "2-6 months"
              },
              {
                "label": "More than 6 months",
                "value": "More than 6 months"
              },
              {
                "label": "Variable",
                "value": "Variable"
              },
              {
                "label": "Not applicable",
                "value": "Not applicable"
              },
              {
                "label": "Other",
                "value": "Other"
              }
            ],
            "name": "Time to dataset access",
            "label": "Time to dataset access",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Jurisdiction",
          "is_array_form": false,
          "description": "Please use country code from ISO 3166-1 country codes and the associated ISO 3166-2 for regions, cities, states etc. for the country/state under whose laws the data subjects' data is collected, processed and stored.",
          "location": "accessibility.access.jurisdiction",
          "guidance": "**Jurisdiction**\\n\\nA full list of country codes can be found here (alpha-2 column): https://www.iso.org/obp/ui/#search/code/",
          "field": {
            "component": "Autocomplete",
            "name": "Jurisdiction",
            "label": "Jurisdiction",
            "placeholder": "Enter value...",
            "required": false,
            "hidden": false,
            "freeSolo": true
          }
        },
        {
          "title": "Data Controller",
          "is_array_form": false,
          "description": "Data Controller means a person/entity who (either alone or jointly or in common with other persons/entities) determines the purposes for which and the way any Data Subject data, specifically personal data or are to be processed.",
          "location": "accessibility.access.dataController",
          "guidance": "**Data Controller**\\n\\n- Data Controller means a person/entity who (either alone or jointly or in common with other persons/entities) determines the purposes for which and the way any Data Subject data, specifically personal data or are to be processed.\\n- Notes: For most organisations this will be the same as the Data Custodian of the dataset. If this is not the case, please indicate that there is a different controller.\\n- If there is a different controller please complete the Data Processor attribute to indicate if the Data Custodian is a Processor rather than the Data Controller.\\n- In some cases, there may be multiple Data Controllers i.e. GP data. If this is the case, please indicate the fact in a free-text field and describe the data sharing arrangement or a link to it, so that this can be understood by research users.\\n- Example: NHS England",
          "field": {
            "component": "TextArea",
            "name": "Data Controller",
            "placeholder": "NHS England",
            "label": "Data Controller",
            "limit": 50000,
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Data Processor",
          "is_array_form": false,
          "description": "A Data Processor, in relation to any Data Subject data, specifically personal data, means any person/entity (other than an employee of the data controller) who processes the data on behalf of the data controller.",
          "location": "accessibility.access.dataProcessor",
          "guidance": "**Data Processor**\\n\\nA Data Processor, in relation to any Data Subject data, specifically personal data, means any person/entity (other than an employee of the data controller) who processes the data on behalf of the data controller.\\n- Notes: Required to complete if the Data Custodian is the Data Processor rather than the Data Controller.\\n- If the Publisher is also the Data Controller please provide “Not Applicable”.\\n- Examples: Not Applicable, SAIL",
          "field": {
            "component": "TextArea",
            "name": "Data Processor",
            "placeholder": "Not Applicable, SAIL",
            "label": "Data Processor",
            "limit": 50000,
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Format and Standards",
          "is_array_form": false,
          "description": null,
          "location": "accessibility.formatAndStandards",
          "guidance": "",
          "field": {
            "component": "TextField",
            "name": "Format and Standards",
            "placeholder": "",
            "label": "Format and Standards",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Controlled vocabulary",
          "is_array_form": false,
          "description": "List any relevant terminologies / ontologies / controlled vocabularies, such as ICD 10 Codes, NHS Data Dictionary National Codes or SNOMED CT International, that are being used by the dataset. If the controlled vocabularies are local standards, please make that explicit. If you are using a standard that has not been included in the list, please use “other” and contact support desk to ask for an addition. Notes: More than one vocabulary may be provided.",
          "location": "accessibility.formatAndStandards.vocabularyEncodingScheme",
          "guidance": "**Controlled vocabulary**\\n\\n- List any relevant terminologies / ontologies / controlled vocabularies, such as ICD 10 Codes, NHS Data Dictionary National Codes or SNOMED CT International, that are being used by the dataset.\\n- If the controlled vocabularies are local standards, please make that explicit. If you are using a standard that has not been included in the list, please use “other” and contact support desk to ask for an addition.\\n- Notes: More than one vocabulary may be provided.\\n- **Local**: Local Coding Standard.\\n- [**OPCS4**](https://digital.nhs.uk/data-and-information/information-standards/governance/latest-activity/standards-and-collections/dapb0084-opcs-classification-of-interventions-and-procedures/)\\n- [**READ**](https://digital.nhs.uk/services/terminology-and-classifications/read-codes)\\n- [**SNOMED CT**](http://www.snomed.org/)\\n- [**SNOMED RT**](https://confluence.ihtsdotools.org/display/DOCGLOSS/SNOMED+RT)\\n- [**DM+D**](https://digital.nhs.uk/data-and-information/information-standards/information-standards-and-data-collections-including-extractions/publications-and-notifications/standards-and-collections/scci0052-dictionary-of-medicines-and-devices-dm-d)\\n- [**NHS National Codes**](https://www.datadictionary.nhs.uk/)\\n- [**ODS**](https://digital.nhs.uk/services/organisation-data-service)\\n- [**LOINC**](https://loinc.org/)\\n- [**ICD10**](https://www.who.int/classifications/icd/icdonlineversions/en/)\\n- [**ICD10CM**](https://www.cdc.gov/nchs/icd/icd10cm.htm)\\n- [**ICD10PCS**](https://ec.europa.eu/eip/ageing/standards/healthcare/e-health/icd-10-pcs_en)\\n- [**ICD9CM**](https://www.cdc.gov/nchs/icd/icd9cm.htm)\\n- [**ICD9**](https://www.cdc.gov/nchs/icd/icd9.htm)\\n- [**ICDO3**](https://www.who.int/standards/classifications/other-classifications/international-classification-of-diseases-for-oncology)\\n- [**AMT**](https://www.digitalhealth.gov.au/healthcare-providers/product-releases)\\n- [**APC**](https://www.acep.org/administration/reimbursement/reimbursement-faqs/apc-ambulatory-payment-classifications-faq/)\\n- [**ATC**](https://www.whocc.no/atc_ddd_index/)\\n- [**CIEL**](https://github.com/OpenConceptLab/ocl_web/wiki/CIEL)\\n- [**HPO**](https://hpo.jax.org/app/)\\n- [**CPT4**](https://www.ama-assn.org/practice-management/cpt)\\n- [**DPD**](https://health-products.canada.ca/dpd-bdpp/index-eng.jsp)\\n- [**DRG**](https://www.who.int/publications/i/item/WHO-UHC-HGF-Guidance-20.10)\\n- [**HEMONC**](https://hemonc.org/wiki/Main_Page)\\n- [**JMDC**](https://www.jmdc.co.jp/en/)\\n- [**KCD7**](https://forums.ohdsi.org/t/adding-kcd7-code-korean-icd-10-to-the-omop-vocabulary/7576)\\n- [**MULTUM**](https://www.cerner.com/solutions/drug-database)\\n- [**NAACCR**](https://www.naaccr.org/)\\n- [**NDC**](https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory)\\n- [**NDFRT**](https://bioportal.bioontology.org/ontologies/NDFRT)\\n- [**OXMIS**](https://oxrisk.com/oxmis/)\\n- [**RXNORM**](https://www.nlm.nih.gov/research/umls/rxnorm/index.html)\\n- [**RXNORM EXTENSION**](https://www.nlm.nih.gov/research/umls/rxnorm/index.html)\\n- [**SPL**](https://www.fda.gov/industry/fda-resources-data-standards/structured-product-labeling-resources)\\n- **Other**: Please indicate if there is another standard that you are using. This will trigger a support ticket where you can request the addition of the terminology to the HOP.\\n- [**NHS Scotland National Codes**](https://www.ndc.scot.nhs.uk/Data-Dictionary/)\\n- [**NHS Wales National Codes**](http://www.datadictionary.wales.nhs.uk/)",
          "field": {
            "component": "Autocomplete",
            "options": [
              {
                "label": "LOCAL",
                "value": "LOCAL"
              },
              {
                "label": "OPCS4",
                "value": "OPCS4"
              },
              {
                "label": "READ",
                "value": "READ"
              },
              {
                "label": "SNOMED CT",
                "value": "SNOMED CT"
              },
              {
                "label": "SNOMED RT",
                "value": "SNOMED RT"
              },
              {
                "label": "DM PLUS D",
                "value": "DM PLUS D"
              },
              {
                "label": "DM+D",
                "value": "DM+D"
              },
              {
                "label": "NHS NATIONAL CODES",
                "value": "NHS NATIONAL CODES"
              },
              {
                "label": "NHS SCOTLAND NATIONAL CODES",
                "value": "NHS SCOTLAND NATIONAL CODES"
              },
              {
                "label": "NHS WALES NATIONAL CODES",
                "value": "NHS WALES NATIONAL CODES"
              },
              {
                "label": "ODS",
                "value": "ODS"
              },
              {
                "label": "LOINC",
                "value": "LOINC"
              },
              {
                "label": "ICD10",
                "value": "ICD10"
              },
              {
                "label": "ICD10CM",
                "value": "ICD10CM"
              },
              {
                "label": "ICD10PCS",
                "value": "ICD10PCS"
              },
              {
                "label": "ICD9CM",
                "value": "ICD9CM"
              },
              {
                "label": "ICD9",
                "value": "ICD9"
              },
              {
                "label": "ICDO3",
                "value": "ICDO3"
              },
              {
                "label": "AMT",
                "value": "AMT"
              },
              {
                "label": "APC",
                "value": "APC"
              },
              {
                "label": "ATC",
                "value": "ATC"
              },
              {
                "label": "CIEL",
                "value": "CIEL"
              },
              {
                "label": "HPO",
                "value": "HPO"
              },
              {
                "label": "CPT4",
                "value": "CPT4"
              },
              {
                "label": "DPD",
                "value": "DPD"
              },
              {
                "label": "DRG",
                "value": "DRG"
              },
              {
                "label": "HEMONC",
                "value": "HEMONC"
              },
              {
                "label": "JMDC",
                "value": "JMDC"
              },
              {
                "label": "KCD7",
                "value": "KCD7"
              },
              {
                "label": "MULTUM",
                "value": "MULTUM"
              },
              {
                "label": "NAACCR",
                "value": "NAACCR"
              },
              {
                "label": "NDC",
                "value": "NDC"
              },
              {
                "label": "NDFRT",
                "value": "NDFRT"
              },
              {
                "label": "OXMIS",
                "value": "OXMIS"
              },
              {
                "label": "RXNORM",
                "value": "RXNORM"
              },
              {
                "label": "RXNORM EXTENSION",
                "value": "RXNORM EXTENSION"
              },
              {
                "label": "SPL",
                "value": "SPL"
              },
              {
                "label": "OTHER",
                "value": "OTHER"
              }
            ],
            "name": "Controlled vocabulary",
            "label": "Controlled vocabulary",
            "placeholder": "Enter value...",
            "required": true,
            "hidden": false,
            "freeSolo": false
          }
        },
        {
          "title": "Alignment with standardised data models",
          "is_array_form": false,
          "description": "List standardised data models that the dataset has been stored in or transformed to, such as OMOP or FHIR. If the data is only available in a local format, please make that explicit. If you are using a standard that has not been included in the list, please use “other” and contact support desk to ask for an addition.",
          "location": "accessibility.formatAndStandards.conformsTo",
          "guidance": "**Alignment with standardised data models**\\n\\n- List standardised data models that the dataset has been stored in or transformed to, such as OMOP or FHIR.\\n- If the data is only available in a local format, please make that explicit. If you are using a standard that has not been included in the list, please use “other” and contact support desk to ask for an addition.\\n- [**HL7 FHIR**](https://www.hl7.org/fhir/)\\n- [**HL7 V2**](https://www.hl7.org/implement/standards/product_section.cfm?section=13)\\n- [**HL7 CDA**](https://www.hl7.org/implement/standards/product_section.cfm?section=10)\\n- [**HL7 CCOW**](https://www.hl7.org/implement/standards/product_section.cfm?section=16)\\n- [**DICOM**](https://www.dicomstandard.org/)\\n- [**I2B2**](https://www.i2b2.org/)\\n- [**IHE**](https://www.ihe.net/resources/profiles/)\\n- [**OMOP**](https://www.ohdsi.org/data-standardization/the-common-data-model/)\\n- [**openEHR**](https://www.openehr.org/)\\n- [**Sentinel**](https://www.sentinelinitiative.org/sentinel/data/distributed-database-common-data-model)\\n- [**PCORnet**](https://pcornet.org/data-driven-common-model/)\\n- [**CDISC**](https://www.cdisc.org/standards/data-exchange/odm)\\n- **Local**: In-house developed data model.\\n- **Other**: Other standardised data model.\\n- [**NHS Data Dictionary**](https://www.datadictionary.nhs.uk/)\\n- [**NHS Scotland Data Dictionary**](https://www.ndc.scot.nhs.uk/Data-Dictionary/)\\n- [**NHS Wales Data Dictionary**](https://www.datadictionary.wales.nhs.uk/)",
          "field": {
            "component": "Autocomplete",
            "options": [
              {
                "label": "HL7 FHIR",
                "value": "HL7 FHIR"
              },
              {
                "label": "HL7 V2",
                "value": "HL7 V2"
              },
              {
                "label": "HL7 CDA",
                "value": "HL7 CDA"
              },
              {
                "label": "HL7 CCOW",
                "value": "HL7 CCOW"
              },
              {
                "label": "LOINC",
                "value": "LOINC"
              },
              {
                "label": "DICOM",
                "value": "DICOM"
              },
              {
                "label": "I2B2",
                "value": "I2B2"
              },
              {
                "label": "IHE",
                "value": "IHE"
              },
              {
                "label": "OMOP",
                "value": "OMOP"
              },
              {
                "label": "OPENEHR",
                "value": "OPENEHR"
              },
              {
                "label": "SENTINEL",
                "value": "SENTINEL"
              },
              {
                "label": "PCORNET",
                "value": "PCORNET"
              },
              {
                "label": "CDISC",
                "value": "CDISC"
              },
              {
                "label": "NHS DATA DICTIONARY",
                "value": "NHS DATA DICTIONARY"
              },
              {
                "label": "NHS SCOTLAND DATA DICTIONARY",
                "value": "NHS SCOTLAND DATA DICTIONARY"
              },
              {
                "label": "NHS WALES DATA DICTIONARY",
                "value": "NHS WALES DATA DICTIONARY"
              },
              {
                "label": "LOCAL",
                "value": "LOCAL"
              },
              {
                "label": "OTHER",
                "value": "OTHER"
              }
            ],
            "name": "Alignment with standardised data models",
            "label": "Alignment with standardised data models",
            "placeholder": "Enter value...",
            "required": true,
            "hidden": false,
            "freeSolo": false
          }
        },
        {
          "title": "Language",
          "is_array_form": false,
          "description": "This should list all the languages in which the dataset metadata and underlying data is made available complaint with ISO 639.",
          "location": "accessibility.formatAndStandards.language",
          "guidance": "**Language**\\n\\nhttps://www.iso.org/iso-639-language-code\\n- **aa**: Afar\\n- **ab**: Abkhazian\\n- **af**: Afrikaans\\n- **ak**: Akan\\n- **sq**: Albanian\\n- **am**: Amharic\\n- **ar**: Arabic\\n- **an**: Aragonese\\n- **hy**: Armenian\\n- **as**: Assamese\\n- **av**: Avaric\\n- **ae**: Avestan\\n- **ay**: Aymara\\n- **az**: Azerbaijani\\n- **ba**: Bashkir\\n- **bm**: Bambara\\n- **eu**: Basque\\n- **be**: Belarusian\\n- **bn**: Bengali\\n- **bh**: Bihari languages\\n- **bi**: Bislama\\n- **bo**: Tibetan\\n- **bs**: Bosnian\\n- **br**: Breton\\n- **bg**: Bulgarian\\n- **my**: Burmese\\n- **ca**: Catalan; Valencian\\n- **cs**: Czech\\n- **ch**: Chamorro\\n- **ce**: Chechen\\n- **zh**: Chinese\\n- **cu**: Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic\\n- **cv**: Chuvash\\n- **kw**: Cornish\\n- **co**: Corsican\\n- **cr**: Cree\\n- **cy**: Welsh\\n- **cs**: Czech\\n- **da**: Danish\\n- **de**: German\\n- **dv**: Divehi; Dhivehi; Maldivian\\n- **nl**: Dutch; Flemish\\n- **dz**: Dzongkha\\n- **el**: Greek, Modern (1453-)\\n- **en**: English\\n- **eo**: Esperanto\\n- **et**: Estonian\\n- **eu**: Basque\\n- **ee**: Ewe\\n- **fo**: Faroese\\n- **fa**: Persian\\n- **fj**: Fijian\\n- **fi**: Finnish\\n- **fr**: French\\n- **fy**: Western Frisian\\n- **ff**: Fulah\\n- **ka**: Georgian\\n- **de**: German\\n- **gd**: Gaelic; Scottish Gaelic\\n- **ga**: Irish\\n- **gl**: Galician\\n- **gv**: Manx\\n- **el**: Greek, Modern (1453-)\\n- **gn**: Guarani\\n- **gu**: Gujarati\\n- **ht**: Haitian; Haitian Creole\\n- **ha**: Hausa\\n- **ho**: Hiri Motu\\n- **hr**: Croatian\\n- **hu**: Hungarian\\n- **hy**: Armenian\\n- **ig**: Igbo\\n- **is**: Icelandic\\n- **io**: Ido\\n- **ii**: Sichuan Yi; Nuosu\\n- **iu**: Inuktitut\\n- **ie**: Interlingue; Occidental\\n- **ia**: Interlingua (International Auxiliary Language Association)\\n- **id**: Indonesian\\n- **ik**: Inupiaq\\n- **is**: Icelandic\\n- **it**: Italian\\n- **jv**: Javanese\\n- **ja**: Japanese\\n- **kl**: Kalaallisut; Greenlandic\\n- **kn**: Kannada\\n- **ks**: Kashmiri\\n- **ka**: Georgian\\n- **kr**: Kanuri\\n- **kk**: Kazakh\\n- **km**: Central Khmer\\n- **ki**: Kikuyu; Gikuyu\\n- **rw**: Kinyarwanda\\n- **ky**: Kirghiz; Kyrgyz\\n- **kv**: Komi\\n- **kg**: Kongo\\n- **ko**: Korean\\n- **kj**: Kuanyama; Kwanyama\\n- **ku**: Kurdish\\n- **lo**: Lao\\n- **la**: Latin\\n- **lv**: Latvian\\n- **li**: Limburgan; Limburger; limburgish\\n- **ln**: Lingala\\n- **lt**: Lithuanian\\n- **lb**: Luxembourgish; Letzeburgesch\\n- **lu**: Luba-Katanga\\n- **lg**: Ganda\\n- **mk**: Macedonian\\n- **mh**: Marshallese\\n- **ml**: Malayalam\\n- **mi**: Maori\\n- **mr**: Marathi\\n- **ms**: Malay\\n- **mk**: Macedonian\\n- **mg**: Malagasy\\n- **mt**: Maltese\\n- **mn**: Mongolian\\n- **mi**: Maori\\n- **ms**: Malay\\n- **my**: Burmese\\n- **na**: Nauru\\n- **nv**: Navajo; Navaho\\n- **nr**: Ndebele, South; South Ndebele\\n- **nd**: Ndebele, North; North Ndebele\\n- **ng**: Ndonga\\n- **ne**: Nepali\\n- **nl**: Dutch; Flemish\\n- **nn**: Norwegian Nynorsk; Nynorsk, Norwegian\\n- **nb**: Bokmål, Norwegian; Norwegian Bokmål\\n- **no**: Norwegian\\n- **ny**: Chichewa; Chewa; Nyanja\\n- **oc**: Occitan (post 1500)\\n- **oj**: Ojibwa\\n- **or**: Oriya\\n- **om**: Oromo\\n- **os**: Ossetian; Ossetic\\n- **pa**: Panjabi; Punjabi\\n- **fa**: Persian\\n- **pi**: Pali\\n- **pl**: Polish\\n- **pt**: Portuguese\\n- **ps**: Pushto; Pashto\\n- **qu**: Quechua\\n- **rm**: Romansh\\n- **ro**: Romanian; Moldavian; Moldovan\\n- **rn**: Rundi\\n- **ru**: Russian\\n- **sg**: Sango\\n- **sa**: Sanskrit\\n- **si**: Sinhala; Sinhalese\\n- **sk**: Slovak\\n- **sl**: Slovenian\\n- **se**: Northern Sami\\n- **sm**: Samoan\\n- **sn**: Shona\\n- **sd**: Sindhi\\n- **so**: Somali\\n- **st**: Sotho, Southern\\n- **es**: Spanish; Castilian\\n- **sq**: Albanian\\n- **sc**: Sardinian\\n- **sr**: Serbian\\n- **ss**: Swati\\n- **su**: Sundanese\\n- **sw**: Swahili\\n- **sv**: Swedish\\n- **ty**: Tahitian\\n- **ta**: Tamil\\n- **tt**: Tatar\\n- **te**: Telugu\\n- **tg**: Tajik\\n- **tl**: Tagalog\\n- **th**: Thai\\n- **bo**: Tibetan\\n- **ti**: Tigrinya\\n- **to**: Tonga (Tonga Islands)\\n- **tn**: Tswana\\n- **ts**: Tsonga\\n- **tk**: Turkmen\\n- **tr**: Turkish\\n- **tw**: Twi\\n- **ug**: Uighur; Uyghur\\n- **uk**: Ukrainian\\n- **ur**: Urdu\\n- **uz**: Uzbek\\n- **ve**: Venda\\n- **vi**: Vietnamese\\n- **vo**: Volapük\\n- **cy**: Welsh\\n- **wa**: Walloon\\n- **wo**: Wolof\\n- **xh**: Xhosa\\n- **yi**: Yiddish\\n- **yo**: Yoruba\\n- **za**: Zhuang; Chuang\\n- **zh**: Chinese\\n- **zu**: Zulu",
          "field": {
            "component": "Autocomplete",
            "options": [
              {
                "label": "aa",
                "value": "aa"
              },
              {
                "label": "ab",
                "value": "ab"
              },
              {
                "label": "ae",
                "value": "ae"
              },
              {
                "label": "af",
                "value": "af"
              },
              {
                "label": "ak",
                "value": "ak"
              },
              {
                "label": "am",
                "value": "am"
              },
              {
                "label": "an",
                "value": "an"
              },
              {
                "label": "ar",
                "value": "ar"
              },
              {
                "label": "as",
                "value": "as"
              },
              {
                "label": "av",
                "value": "av"
              },
              {
                "label": "ay",
                "value": "ay"
              },
              {
                "label": "az",
                "value": "az"
              },
              {
                "label": "ba",
                "value": "ba"
              },
              {
                "label": "be",
                "value": "be"
              },
              {
                "label": "bg",
                "value": "bg"
              },
              {
                "label": "bh",
                "value": "bh"
              },
              {
                "label": "bi",
                "value": "bi"
              },
              {
                "label": "bm",
                "value": "bm"
              },
              {
                "label": "bn",
                "value": "bn"
              },
              {
                "label": "bo",
                "value": "bo"
              },
              {
                "label": "br",
                "value": "br"
              },
              {
                "label": "bs",
                "value": "bs"
              },
              {
                "label": "ca",
                "value": "ca"
              },
              {
                "label": "ce",
                "value": "ce"
              },
              {
                "label": "ch",
                "value": "ch"
              },
              {
                "label": "co",
                "value": "co"
              },
              {
                "label": "cr",
                "value": "cr"
              },
              {
                "label": "cs",
                "value": "cs"
              },
              {
                "label": "cu",
                "value": "cu"
              },
              {
                "label": "cv",
                "value": "cv"
              },
              {
                "label": "cy",
                "value": "cy"
              },
              {
                "label": "da",
                "value": "da"
              },
              {
                "label": "de",
                "value": "de"
              },
              {
                "label": "dv",
                "value": "dv"
              },
              {
                "label": "dz",
                "value": "dz"
              },
              {
                "label": "ee",
                "value": "ee"
              },
              {
                "label": "el",
                "value": "el"
              },
              {
                "label": "en",
                "value": "en"
              },
              {
                "label": "eo",
                "value": "eo"
              },
              {
                "label": "es",
                "value": "es"
              },
              {
                "label": "et",
                "value": "et"
              },
              {
                "label": "eu",
                "value": "eu"
              },
              {
                "label": "fa",
                "value": "fa"
              },
              {
                "label": "ff",
                "value": "ff"
              },
              {
                "label": "fi",
                "value": "fi"
              },
              {
                "label": "fj",
                "value": "fj"
              },
              {
                "label": "fo",
                "value": "fo"
              },
              {
                "label": "fr",
                "value": "fr"
              },
              {
                "label": "fy",
                "value": "fy"
              },
              {
                "label": "ga",
                "value": "ga"
              },
              {
                "label": "gd",
                "value": "gd"
              },
              {
                "label": "gl",
                "value": "gl"
              },
              {
                "label": "gn",
                "value": "gn"
              },
              {
                "label": "gu",
                "value": "gu"
              },
              {
                "label": "gv",
                "value": "gv"
              },
              {
                "label": "ha",
                "value": "ha"
              },
              {
                "label": "he",
                "value": "he"
              },
              {
                "label": "hi",
                "value": "hi"
              },
              {
                "label": "ho",
                "value": "ho"
              },
              {
                "label": "hr",
                "value": "hr"
              },
              {
                "label": "ht",
                "value": "ht"
              },
              {
                "label": "hu",
                "value": "hu"
              },
              {
                "label": "hy",
                "value": "hy"
              },
              {
                "label": "hz",
                "value": "hz"
              },
              {
                "label": "ia",
                "value": "ia"
              },
              {
                "label": "id",
                "value": "id"
              },
              {
                "label": "ie",
                "value": "ie"
              },
              {
                "label": "ig",
                "value": "ig"
              },
              {
                "label": "ii",
                "value": "ii"
              },
              {
                "label": "ik",
                "value": "ik"
              },
              {
                "label": "io",
                "value": "io"
              },
              {
                "label": "is",
                "value": "is"
              },
              {
                "label": "it",
                "value": "it"
              },
              {
                "label": "iu",
                "value": "iu"
              },
              {
                "label": "ja",
                "value": "ja"
              },
              {
                "label": "jv",
                "value": "jv"
              },
              {
                "label": "ka",
                "value": "ka"
              },
              {
                "label": "kg",
                "value": "kg"
              },
              {
                "label": "ki",
                "value": "ki"
              },
              {
                "label": "kj",
                "value": "kj"
              },
              {
                "label": "kk",
                "value": "kk"
              },
              {
                "label": "kl",
                "value": "kl"
              },
              {
                "label": "km",
                "value": "km"
              },
              {
                "label": "kn",
                "value": "kn"
              },
              {
                "label": "ko",
                "value": "ko"
              },
              {
                "label": "kr",
                "value": "kr"
              },
              {
                "label": "ks",
                "value": "ks"
              },
              {
                "label": "ku",
                "value": "ku"
              },
              {
                "label": "kv",
                "value": "kv"
              },
              {
                "label": "kw",
                "value": "kw"
              },
              {
                "label": "ky",
                "value": "ky"
              },
              {
                "label": "la",
                "value": "la"
              },
              {
                "label": "lb",
                "value": "lb"
              },
              {
                "label": "lg",
                "value": "lg"
              },
              {
                "label": "li",
                "value": "li"
              },
              {
                "label": "ln",
                "value": "ln"
              },
              {
                "label": "lo",
                "value": "lo"
              },
              {
                "label": "lt",
                "value": "lt"
              },
              {
                "label": "lu",
                "value": "lu"
              },
              {
                "label": "lv",
                "value": "lv"
              },
              {
                "label": "mg",
                "value": "mg"
              },
              {
                "label": "mh",
                "value": "mh"
              },
              {
                "label": "mi",
                "value": "mi"
              },
              {
                "label": "mk",
                "value": "mk"
              },
              {
                "label": "ml",
                "value": "ml"
              },
              {
                "label": "mn",
                "value": "mn"
              },
              {
                "label": "mr",
                "value": "mr"
              },
              {
                "label": "ms",
                "value": "ms"
              },
              {
                "label": "mt",
                "value": "mt"
              },
              {
                "label": "my",
                "value": "my"
              },
              {
                "label": "na",
                "value": "na"
              },
              {
                "label": "nb",
                "value": "nb"
              },
              {
                "label": "nd",
                "value": "nd"
              },
              {
                "label": "ne",
                "value": "ne"
              },
              {
                "label": "ng",
                "value": "ng"
              },
              {
                "label": "nl",
                "value": "nl"
              },
              {
                "label": "nn",
                "value": "nn"
              },
              {
                "label": "no",
                "value": "no"
              },
              {
                "label": "nr",
                "value": "nr"
              },
              {
                "label": "nv",
                "value": "nv"
              },
              {
                "label": "ny",
                "value": "ny"
              },
              {
                "label": "oc",
                "value": "oc"
              },
              {
                "label": "oj",
                "value": "oj"
              },
              {
                "label": "om",
                "value": "om"
              },
              {
                "label": "or",
                "value": "or"
              },
              {
                "label": "os",
                "value": "os"
              },
              {
                "label": "pa",
                "value": "pa"
              },
              {
                "label": "pi",
                "value": "pi"
              },
              {
                "label": "pl",
                "value": "pl"
              },
              {
                "label": "ps",
                "value": "ps"
              },
              {
                "label": "pt",
                "value": "pt"
              },
              {
                "label": "qu",
                "value": "qu"
              },
              {
                "label": "rm",
                "value": "rm"
              },
              {
                "label": "rn",
                "value": "rn"
              },
              {
                "label": "ro",
                "value": "ro"
              },
              {
                "label": "ru",
                "value": "ru"
              },
              {
                "label": "rw",
                "value": "rw"
              },
              {
                "label": "sa",
                "value": "sa"
              },
              {
                "label": "sc",
                "value": "sc"
              },
              {
                "label": "sd",
                "value": "sd"
              },
              {
                "label": "se",
                "value": "se"
              },
              {
                "label": "sg",
                "value": "sg"
              },
              {
                "label": "si",
                "value": "si"
              },
              {
                "label": "sk",
                "value": "sk"
              },
              {
                "label": "sl",
                "value": "sl"
              },
              {
                "label": "sm",
                "value": "sm"
              },
              {
                "label": "sn",
                "value": "sn"
              },
              {
                "label": "so",
                "value": "so"
              },
              {
                "label": "sq",
                "value": "sq"
              },
              {
                "label": "sr",
                "value": "sr"
              },
              {
                "label": "ss",
                "value": "ss"
              },
              {
                "label": "st",
                "value": "st"
              },
              {
                "label": "su",
                "value": "su"
              },
              {
                "label": "sv",
                "value": "sv"
              },
              {
                "label": "sw",
                "value": "sw"
              },
              {
                "label": "ta",
                "value": "ta"
              },
              {
                "label": "te",
                "value": "te"
              },
              {
                "label": "tg",
                "value": "tg"
              },
              {
                "label": "th",
                "value": "th"
              },
              {
                "label": "ti",
                "value": "ti"
              },
              {
                "label": "tk",
                "value": "tk"
              },
              {
                "label": "tl",
                "value": "tl"
              },
              {
                "label": "tn",
                "value": "tn"
              },
              {
                "label": "to",
                "value": "to"
              },
              {
                "label": "tr",
                "value": "tr"
              },
              {
                "label": "ts",
                "value": "ts"
              },
              {
                "label": "tt",
                "value": "tt"
              },
              {
                "label": "tw",
                "value": "tw"
              },
              {
                "label": "ty",
                "value": "ty"
              },
              {
                "label": "ug",
                "value": "ug"
              },
              {
                "label": "uk",
                "value": "uk"
              },
              {
                "label": "ur",
                "value": "ur"
              },
              {
                "label": "uz",
                "value": "uz"
              },
              {
                "label": "ve",
                "value": "ve"
              },
              {
                "label": "vi",
                "value": "vi"
              },
              {
                "label": "vo",
                "value": "vo"
              },
              {
                "label": "wa",
                "value": "wa"
              },
              {
                "label": "wo",
                "value": "wo"
              },
              {
                "label": "xh",
                "value": "xh"
              },
              {
                "label": "yi",
                "value": "yi"
              },
              {
                "label": "yo",
                "value": "yo"
              },
              {
                "label": "za",
                "value": "za"
              },
              {
                "label": "zh",
                "value": "zh"
              },
              {
                "label": "zu",
                "value": "zu"
              }
            ],
            "name": "Language",
            "label": "Language",
            "placeholder": "en",
            "required": true,
            "hidden": false,
            "freeSolo": false
          }
        },
        {
          "title": "Format",
          "is_array_form": false,
          "description": "List the types of data available",
          "location": "accessibility.formatAndStandards.format",
          "guidance": "**Format**\\n\\n- If multiple formats are available, please specify. See application, audio, image, message, model, multipart, text, video, \u003Chttps://www.iana.org/assignments/media-types/media-types.xhtml\u003E.\\n- Please **enter one format type at a time** and click **Add New Field** to add further keywords.\\n- Note: If your file format is not included in the current list of formats, please indicate other.\\n- **Example**: text/tab-separated-values, application/sql, text/csv, image/diacom-rle",
          "field": {
            "component": "Autocomplete",
            "name": "Format",
            "label": "Format",
            "placeholder": "text/tab-separated-values",
            "required": true,
            "hidden": false,
            "freeSolo": true
          }
        },
        {
          "title": "Tools and Publications",
          "is_array_form": false,
          "description": "This section includes information about related datasets that may have previously been linked, as well as indicating if there is the opportunity to link to other datasets in the future. If a dataset has been enriched and/or derivations, scores and existing tools are available this section allows providers to indicate this to researchers.",
          "location": "enrichmentAndLinkage",
          "guidance": "Upload information on other projects, tools, publications and other datasets that are linked to this one.",
          "field": {
            "component": "TextField",
            "name": "Tools and Publications",
            "placeholder": "",
            "label": "Tools and Publications",
            "required": false,
            "hidden": true
          }
        },
        {
          "title": "Derived from Array",
          "description": "If applicable, please provide DOIs or links to datasets from which data in this dataset has been derived or calculated from.",
          "location": "enrichmentAndLinkage.derivedFrom",
          "is_array_form": true,
          "required": false,
          "fields": [
            {
              "title": "Persistent identifier of a dataset",
              "is_array_form": false,
              "description": null,
              "location": "enrichmentAndLinkage.derivedFrom.pid",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Persistent identifier of a dataset",
                "placeholder": "Enter value...",
                "label": "Persistent identifier of a dataset",
                "limit": 150,
                "required": false,
                "hidden": false
              }
            },
            {
              "title": "Title of a dataset",
              "is_array_form": false,
              "description": null,
              "location": "enrichmentAndLinkage.derivedFrom.title",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Title of a dataset",
                "placeholder": "Enter value...",
                "label": "Title of a dataset",
                "limit": 150,
                "required": false,
                "hidden": false
              }
            },
            {
              "title": "Url of a dataset",
              "is_array_form": false,
              "description": null,
              "location": "enrichmentAndLinkage.derivedFrom.url",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Url of a dataset",
                "placeholder": "Enter value...",
                "label": "Url of a dataset",
                "required": false,
                "hidden": false
              }
            }
          ]
        },
        {
          "title": "Is part of Array",
          "description": "This relationship indicates that the dataset is a component or subset of a broader collection of related datasets. For example, clinical trial data for a specific drug may be part of a larger database of pharmaceutical research data. Complete only if the dataset is part of a group or family of datasets i.e. Hospital Episode Statistics has several constituents. If your dataset is not part of a group, please enter 'NOT APPLICABLE' **Example**: Hospital Episodes Statistics datasets (A&E, APC, OP, AC MSDS).",
          "location": "enrichmentAndLinkage.isPartOf",
          "is_array_form": true,
          "required": false,
          "fields": [
            {
              "title": "Persistent identifier of a dataset",
              "is_array_form": false,
              "description": null,
              "location": "enrichmentAndLinkage.isPartOf.pid",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Persistent identifier of a dataset",
                "placeholder": "Enter value...",
                "label": "Persistent identifier of a dataset",
                "limit": 150,
                "required": false,
                "hidden": false
              }
            },
            {
              "title": "Title of a dataset",
              "is_array_form": false,
              "description": null,
              "location": "enrichmentAndLinkage.isPartOf.title",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Title of a dataset",
                "placeholder": "Enter value...",
                "label": "Title of a dataset",
                "limit": 150,
                "required": false,
                "hidden": false
              }
            },
            {
              "title": "Url of a dataset",
              "is_array_form": false,
              "description": null,
              "location": "enrichmentAndLinkage.isPartOf.url",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Url of a dataset",
                "placeholder": "Enter value...",
                "label": "Url of a dataset",
                "required": false,
                "hidden": false
              }
            }
          ]
        },
        {
          "title": "Linked datasets Array",
          "description": "If applicable, please provide the DOI of other datasets that have previously been linked to this dataset and their availability. If no DOI is available, please provide the title of the datasets that can be linked.",
          "location": "enrichmentAndLinkage.linkableDatasets",
          "is_array_form": true,
          "required": false,
          "fields": [
            {
              "title": "Persistent identifier of a dataset",
              "is_array_form": false,
              "description": null,
              "location": "enrichmentAndLinkage.linkableDatasets.pid",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Persistent identifier of a dataset",
                "placeholder": "Enter value...",
                "label": "Persistent identifier of a dataset",
                "limit": 150,
                "required": false,
                "hidden": false
              }
            },
            {
              "title": "Title of a dataset",
              "is_array_form": false,
              "description": null,
              "location": "enrichmentAndLinkage.linkableDatasets.title",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Title of a dataset",
                "placeholder": "Enter value...",
                "label": "Title of a dataset",
                "limit": 150,
                "required": false,
                "hidden": false
              }
            },
            {
              "title": "Url of a dataset",
              "is_array_form": false,
              "description": null,
              "location": "enrichmentAndLinkage.linkableDatasets.url",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Url of a dataset",
                "placeholder": "Enter value...",
                "label": "Url of a dataset",
                "required": false,
                "hidden": false
              }
            }
          ]
        },
        {
          "title": "Similar to datasets Array",
          "description": "Datasets that are similar to each other in some way, collect similar patients, regional equivalent etc.",
          "location": "enrichmentAndLinkage.similarToDatasets",
          "is_array_form": true,
          "required": false,
          "fields": [
            {
              "title": "Persistent identifier of a dataset",
              "is_array_form": false,
              "description": null,
              "location": "enrichmentAndLinkage.similarToDatasets.pid",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Persistent identifier of a dataset",
                "placeholder": "Enter value...",
                "label": "Persistent identifier of a dataset",
                "limit": 150,
                "required": false,
                "hidden": false
              }
            },
            {
              "title": "Title of a dataset",
              "is_array_form": false,
              "description": null,
              "location": "enrichmentAndLinkage.similarToDatasets.title",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Title of a dataset",
                "placeholder": "Enter value...",
                "label": "Title of a dataset",
                "limit": 150,
                "required": false,
                "hidden": false
              }
            },
            {
              "title": "Url of a dataset",
              "is_array_form": false,
              "description": null,
              "location": "enrichmentAndLinkage.similarToDatasets.url",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Url of a dataset",
                "placeholder": "Enter value...",
                "label": "Url of a dataset",
                "required": false,
                "hidden": false
              }
            }
          ]
        },
        {
          "title": "Investigations",
          "is_array_form": false,
          "description": "Please provide link to any active projects that are using the dataset.",
          "location": "enrichmentAndLinkage.investigations",
          "guidance": "- Please provide the website address(es) which document information related to active projects utilising the dataset.\\n- Please split your existing list of citations into separate fields.\\n- To add multiple entries, type in each website and press enter to add it to the list.\\n- **Example**: \u003Chttps://dataloch.org/insights/projects-delivered/data-driven-innovation-multi-morbidity-report-partner-gps\u003E",
          "field": {
            "component": "Autocomplete",
            "name": "Investigations",
            "label": "Please provide link to any active projects that are using the dataset.",
            "placeholder": "Enter value...",
            "required": false,
            "hidden": false,
            "freeSolo": true
          }
        },
        {
          "title": "Tools",
          "is_array_form": false,
          "description": "Please provide the URL of any analysis tools or models that have been created for this dataset and are available for further use. Multiple tools may be provided. Note: We encourage users to adopt a model along the lines of https://www.ga4gh.org/news/tool-registry-service-api-enabling-an-interoperable-library-of-genomics-analysis-tools/",
          "location": "enrichmentAndLinkage.tools",
          "guidance": "- Please provide the URL of any analysis tools or models that have been created for this dataset and are available for further use.\\n- Multiple tools may be provided.\\n- Note: We encourage users to adopt a model along the lines of https://www.ga4gh.org/news/tool-registry-service-api-enabling-an-interoperable-library-of-genomics-analysis-tools/",
          "field": {
            "component": "Autocomplete",
            "name": "Tools",
            "label": "Please provide the URL of any analysis tools or models that have been created for this dataset and are available for further use. Multiple tools may be provided. Note: We encourage users to adopt a model along the lines of https://www.ga4gh.org/news/tool-registry-service-api-enabling-an-interoperable-library-of-genomics-analysis-tools/",
            "placeholder": "Enter value...",
            "required": false,
            "hidden": false,
            "freeSolo": true
          }
        },
        {
          "title": "Publication about the dataset",
          "is_array_form": false,
          "description": "DOIs for publications which describe the dataset.",
          "location": "enrichmentAndLinkage.publicationAboutDataset",
          "guidance": "- Please provide the DOIs for publications which describe the dataset.\\n- Please split your existing list of citations into separate fields.\\n- To add multiple entries, type in each citation and press enter to add it to the list.\\n- **Example**: \u003C10.1093/ije/dyab028\u003E",
          "field": {
            "component": "Autocomplete",
            "name": "Publication about the dataset",
            "label": "DOIs for publications which describe the dataset.",
            "placeholder": "10.1093/ije/dyab028",
            "required": false,
            "hidden": false,
            "freeSolo": true
          }
        },
        {
          "title": "Publication using the dataset",
          "is_array_form": false,
          "description": "DOIs for publications which use the dataset for analysis.",
          "location": "enrichmentAndLinkage.publicationUsingDataset",
          "guidance": "- Please provide the DOIs for publications which have used the dataset in their analysis.\\n- Please split your existing list of citations into separate fields.\\n- To add multiple entries, type in each citation and press enter to add it to the list.\\n- **Example**: \u003C10.1001/jamapediatrics.2016.3633\u003E",
          "field": {
            "component": "Autocomplete",
            "name": "Publication using the dataset",
            "label": "DOIs for publications which use the dataset for analysis.",
            "placeholder": "10.1001/jamapediatrics.2016.3633",
            "required": false,
            "hidden": false,
            "freeSolo": true
          }
        },
       
        {
          "title": "Observations Array",
          "description": "This section provides an overview of observations of your dataset linked to specific points in time. Multiple observations about the dataset are encouraged to be provided, including multiple observations of the same property at different timepoints. At least one observation is required.",
          "location": "observations",
          "is_array_form": true,
          "required": false,
          "guidance": "Please provide interesting observations about your dataset. These might for example include the number of datapoints in a particular table of note.",
          "fields": [
            {
              "title": "Dataset volume measure",
              "is_array_form": false,
              "description": "Please select one of the following broad notes for your measured observation. Indicating whether the measured property is a recording of unique persons, events, findings or scans per modality.",
              "location": "observations.observedNode",
              "guidance": "- **Persons**: Unique persons recorded in the dataset\\n- **Events**: Unique events such as procedures and prescriptions within the dataset\\n-**Findings**: Unique findings included in the dataset such as diagnoses'\\n-**Number of scans per modality**: Unique scans for a specified imaging method modality (e.g. 12 x-rays)",
              "field": {
                "component": "Select",
                "options": [
                  {
                    "label": "Persons",
                    "value": "Persons"
                  },
                  {
                    "label": "Events",
                    "value": "Events"
                  },
                  {
                    "label": "Findings",
                    "value": "Findings"
                  },
                  {
                    "label": "Number of scans per modality",
                    "value": "Number of scans per modality"
                  }
                ],
                "name": "Dataset volume measure",
                "label": "Please select one of the following broad notes for your measured observation. Indicating whether the measured property is a recording of unique persons, events, findings or scans per modality.",
                "required": true,
                "hidden": false
              }
            },
            {
              "title": "Measured value",
              "is_array_form": false,
              "description": "An integer value size of the measured property, such as ‘1000’ for 1000 people in the study or ‘87’ for 87 MRI scans in the dataset.",
              "location": "observations.measuredValue",
              "guidance": "An integer value size of the measured property, such as ‘1000’ for 1000 people in the study or ‘87’ for 87 MRI scans in the dataset.",
              "field": {
                "component": "TextField",
                "name": "Measured value",
                "type": "number",
                "placeholder": 1000,
                "label": "An integer value size of the measured property, such as ‘1000’ for 1000 people in the study or ‘87’ for 87 MRI scans in the dataset.",
                "required": true,
                "hidden": false
              }
            },
            {
              "title": "Disambiguating description",
              "is_array_form": false,
              "description": "If required, please provide additional details that help distinguish between similar measured properties within your dataset, for example this is useful when SNOMED CT terms do not provide sufficient detail to distinguish between parts of the dataset population. Limited to 500 characters.",
              "location": "observations.disambiguatingDescription",
              "guidance": "If required please provide additional details that help distinguish between similar measured properties within your dataset, for example this is useful when SNOMED CT terms do not provide sufficient detail to distinguish between parts of the dataset population.",
              "field": {
                "component": "TextArea",
                "name": "Disambiguating description",
                "placeholder": null,
                "label": "If required, please provide additional details that help distinguish between similar measured properties within your dataset, for example this is useful when SNOMED CT terms do not provide sufficient detail to distinguish between parts of the dataset population. Limited to 500 characters.",
                "limit": 500,
                "required": false,
                "hidden": false
              }
            },
            {
              "title": "Observation date",
              "is_array_form": false,
              "description": "Provide the date, or datetime that the observation was made. Multiple observations of the same property can be provided, for example an observation of cumulative COVID positive cases by specimen on the 1/1/2021 with a measuredValue of 2000000, and a second observation entry on 8/2/2021 recording a measuredValue of as 3100000.",
              "location": "observations.observationDate",
              "guidance": "Provide the date, or datetime that the observation was made. Multiple observations of the same property can be provided, for example an observation of cumulative COVID positive cases by specimen on the 1/1/2021 with a measuredValue of 2000000, and a second observation entry on 8/2/2021 recording a measuredValue of as 3100000.",
              "field": {
                "component": "DatePicker",
                "name": "Observation date",
                "label": "Provide the date, or datetime that the observation was made. Multiple observations of the same property can be provided, for example an observation of cumulative COVID positive cases by specimen on the 1/1/2021 with a measuredValue of 2000000, and a second observation entry on 8/2/2021 recording a measuredValue of as 3100000.",
                "required": true,
                "hidden": false
              }
            },
            {
              "title": "Measured property",
              "is_array_form": false,
              "description": "Descriptive term for the observation property measured. For example, people, procedures, x-rays, or diagnosis of type 1 diabetes. This could also be a specific SNOMED CT term.",
              "location": "observations.measuredProperty",
              "guidance": "Descriptive term for the observation property measured.",
              "field": {
                "component": "TextField",
                "name": "Measured property",
                "placeholder": "Count",
                "label": "Descriptive term for the observation property measured. For example, people, procedures, x-rays, or diagnosis of type 1 diabetes. This could also be a specific SNOMED CT term.",
                "required": true,
                "hidden": false
              }
            }
          ]
        },
        {
          "title": "Demographic Frequency Age Array",
          "location": "demographicFrequency.age",
          "is_array_form": true,
          "required": false,
          "fields": [
            {
              "title": "Age grouping",
              "is_array_form": false,
              "description": null,
              "location": "demographicFrequency.age.bin",
              "guidance": "",
              "field": {
                "component": "Select",
                "options": [
                  {
                    "label": "0-6 days",
                    "value": "0-6 days"
                  },
                  {
                    "label": "7-27 days",
                    "value": "7-27 days"
                  },
                  {
                    "label": "1-11 months",
                    "value": "1-11 months"
                  },
                  {
                    "label": "1-4 years",
                    "value": "1-4 years"
                  },
                  {
                    "label": "5-9 years",
                    "value": "5-9 years"
                  },
                  {
                    "label": "10-14 years",
                    "value": "10-14 years"
                  },
                  {
                    "label": "15-19 years",
                    "value": "15-19 years"
                  },
                  {
                    "label": "20-24 years",
                    "value": "20-24 years"
                  },
                  {
                    "label": "25-29 years",
                    "value": "25-29 years"
                  },
                  {
                    "label": "30-34 years",
                    "value": "30-34 years"
                  },
                  {
                    "label": "35-39 years",
                    "value": "35-39 years"
                  },
                  {
                    "label": "40-44 years",
                    "value": "40-44 years"
                  },
                  {
                    "label": "45-49 years",
                    "value": "45-49 years"
                  },
                  {
                    "label": "50-54 years",
                    "value": "50-54 years"
                  },
                  {
                    "label": "55-59 years",
                    "value": "55-59 years"
                  },
                  {
                    "label": "60-64 years",
                    "value": "60-64 years"
                  },
                  {
                    "label": "65-69 years",
                    "value": "65-69 years"
                  },
                  {
                    "label": "70-74 years",
                    "value": "70-74 years"
                  },
                  {
                    "label": "75-79 years",
                    "value": "75-79 years"
                  },
                  {
                    "label": "80-84 years",
                    "value": "80-84 years"
                  },
                  {
                    "label": "85-89 years",
                    "value": "85-89 years"
                  },
                  {
                    "label": "90-94 years",
                    "value": "90-94 years"
                  },
                  {
                    "label": "95-99 years",
                    "value": "95-99 years"
                  },
                  {
                    "label": "100+ years",
                    "value": "100+ years"
                  }
                ],
                "name": "Age grouping",
                "label": null,
                "required": true,
                "hidden": false
              }
            },
            {
              "title": "Age count",
              "is_array_form": false,
              "description": null,
              "location": "demographicFrequency.age.count",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Age count",
                "type": "number",
                "placeholder": 1000,
                "label": null,
                "required": true,
                "hidden": false
              }
            }
          ]
        },
        {
          "title": "Demographic Frequency Ethnicity Array",
          "location": "demographicFrequency.ethnicity",
          "is_array_form": true,
          "required": false,
          "fields": [
            {
              "title": "Ethnicity grouping",
              "is_array_form": false,
              "description": null,
              "location": "demographicFrequency.ethnicity.bin",
              "guidance": "",
              "field": {
                "component": "Select",
                "options": [
                  {
                    "label": "White - British",
                    "value": "White - British"
                  },
                  {
                    "label": "White - Irish",
                    "value": "White - Irish"
                  },
                  {
                    "label": "White - Any other White background",
                    "value": "White - Any other White background"
                  },
                  {
                    "label": "Mixed - White and Black Caribbean",
                    "value": "Mixed - White and Black Caribbean"
                  },
                  {
                    "label": "Mixed - White and Black African",
                    "value": "Mixed - White and Black African"
                  },
                  {
                    "label": "Mixed - White and Asian",
                    "value": "Mixed - White and Asian"
                  },
                  {
                    "label": "Mixed - Any other mixed background",
                    "value": "Mixed - Any other mixed background"
                  },
                  {
                    "label": "Asian or Asian British - Indian",
                    "value": "Asian or Asian British - Indian"
                  },
                  {
                    "label": "Asian or Asian British - Pakistani",
                    "value": "Asian or Asian British - Pakistani"
                  },
                  {
                    "label": "Asian or Asian British - Bangladeshi",
                    "value": "Asian or Asian British - Bangladeshi"
                  },
                  {
                    "label": "Asian or Asian British - Any other Asian background",
                    "value": "Asian or Asian British - Any other Asian background"
                  },
                  {
                    "label": "Black or Black British - Caribbean",
                    "value": "Black or Black British - Caribbean"
                  },
                  {
                    "label": "Black or Black British - African",
                    "value": "Black or Black British - African"
                  },
                  {
                    "label": "Black or Black British - Any other Black background",
                    "value": "Black or Black British - Any other Black background"
                  },
                  {
                    "label": "Other Ethnic Groups - Chinese",
                    "value": "Other Ethnic Groups - Chinese"
                  },
                  {
                    "label": "Other Ethnic Groups - Any other ethnic group",
                    "value": "Other Ethnic Groups - Any other ethnic group"
                  },
                  {
                    "label": "Not stated",
                    "value": "Not stated"
                  },
                  {
                    "label": "Not known",
                    "value": "Not known"
                  }
                ],
                "name": "Ethnicity grouping",
                "label": null,
                "required": true,
                "hidden": false
              }
            },
            {
              "title": "Ethnicity count",
              "is_array_form": false,
              "description": null,
              "location": "demographicFrequency.ethnicity.count",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Ethnicity count",
                "type": "number",
                "placeholder": 1000,
                "label": null,
                "required": true,
                "hidden": false
              }
            }
          ]
        },
        {
          "title": "Demographic Frequency Disease Array",
          "location": "demographicFrequency.disease",
          "is_array_form": true,
          "required": false,
          "fields": [
            {
              "title": "Disease code",
              "is_array_form": false,
              "description": null,
              "location": "demographicFrequency.disease.diseaseCode",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Disease code",
                "placeholder": "J45",
                "label": null,
                "required": true,
                "hidden": false
              }
            },
            {
              "title": "Disease code vocabulary",
              "is_array_form": false,
              "description": null,
              "location": "demographicFrequency.disease.diseaseCodeVocabulary",
              "guidance": "",
              "field": {
                "component": "Select",
                "options": [
                  {
                    "label": "ICD10",
                    "value": "ICD10"
                  },
                  {
                    "label": "SNOMED CT",
                    "value": "SNOMED CT"
                  },
                  {
                    "label": "MeSH",
                    "value": "MeSH"
                  }
                ],
                "name": "Disease code vocabulary",
                "label": null,
                "required": true,
                "hidden": false
              }
            },
            {
              "title": "Disease count",
              "is_array_form": false,
              "description": null,
              "location": "demographicFrequency.disease.count",
              "guidance": "",
              "field": {
                "component": "TextField",
                "name": "Disease count",
                "type": "number",
                "placeholder": 1000,
                "label": null,
                "required": true,
                "hidden": false
              }
            }
          ]
        },
        {
          "title": "Omics assay",
          "is_array_form": false,
          "description": "The specific 'omics assay that generated the dataset.",
          "location": "omics.assay",
          "guidance": "The specific 'omics assay that generated the dataset. If the assay used to generate your dataset is not listed, please contract the gateway team by submitting an enquiry.",
          "field": {
            "component": "Select",
            "options": [
              {
                "label": "NMR spectroscopy",
                "value": "NMR spectroscopy"
              },
              {
                "label": "Mass-spectrometry",
                "value": "Mass-spectrometry"
              },
              {
                "label": "Whole genome sequencing",
                "value": "Whole genome sequencing"
              },
              {
                "label": "Exome sequencing",
                "value": "Exome sequencing"
              },
              {
                "label": "Genotyping by array",
                "value": "Genotyping by array"
              },
              {
                "label": "Transcriptome profiling by high-throughput sequencing",
                "value": "Transcriptome profiling by high-throughput sequencing"
              },
              {
                "label": "Transcriptome profiling by array",
                "value": "Transcriptome profiling by array"
              },
              {
                "label": "Amplicon sequencing",
                "value": "Amplicon sequencing"
              },
              {
                "label": "Methylation binding domain sequencing",
                "value": "Methylation binding domain sequencing"
              },
              {
                "label": "Methylation profiling by high-throughput sequencing",
                "value": "Methylation profiling by high-throughput sequencing"
              },
              {
                "label": "Genomic variant calling",
                "value": "Genomic variant calling"
              },
              {
                "label": "Chromatin accessibility profiling by high-throughput sequencing",
                "value": "Chromatin accessibility profiling by high-throughput sequencing"
              },
              {
                "label": "Histone modification profiling by high-throughput sequencing",
                "value": "Histone modification profiling by high-throughput sequencing"
              },
              {
                "label": "Chromatin immunoprecipitation sequencing",
                "value": "Chromatin immunoprecipitation sequencing"
              },
              {
                "label": "Whole genome shotgun sequencing",
                "value": "Whole genome shotgun sequencing"
              },
              {
                "label": "Whole transcriptome sequencing",
                "value": "Whole transcriptome sequencing"
              },
              {
                "label": "Targeted mutation analysis",
                "value": "Targeted mutation analysis"
              }
            ],
            "name": "Omics assay",
            "label": "The specific 'omics assay that generated the dataset.",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Omics Platform",
          "is_array_form": false,
          "description": "The specific technology or infrastructure used to perform the assay. If the omics platform used to create your dataset is not listed, please select other, a member of the gateway team will contact you to add an appropriate term(s) both to your record and to the metadata schema on your behalf.",
          "location": "omics.platform",
          "guidance": "The specific technology or infrastructure used to perform the assay. If the omics platform used to create your dataset is not listed, please select other, a member of the gateway team will contact you to add an appropriate term(s) both to your record and to the metadata schema on your behalf.",
          "field": {
            "component": "Select",
            "options": [
              {
                "label": "Other",
                "value": "Other"
              },
              {
                "label": "NMR Nightingale",
                "value": "NMR Nightingale"
              },
              {
                "label": "Metabolon",
                "value": "Metabolon"
              },
              {
                "label": "Biocrates",
                "value": "Biocrates"
              },
              {
                "label": "Illumina",
                "value": "Illumina"
              },
              {
                "label": "Oxford Nanopore",
                "value": "Oxford Nanopore"
              },
              {
                "label": "454",
                "value": "454"
              },
              {
                "label": "Hi-C",
                "value": "Hi-C"
              },
              {
                "label": "HiFi",
                "value": "HiFi"
              }
            ],
            "name": "Omics Platform",
            "label": "The specific technology or infrastructure used to perform the assay. If the omics platform used to create your dataset is not listed, please select other, a member of the gateway team will contact you to add an appropriate term(s) both to your record and to the metadata schema on your behalf.",
            "required": false,
            "hidden": false
          }
        },
        {
          "title": "Dataset Type Array",
          "location": "provenance.origin.datasetType",
          "is_array_form": true,
          "required": true,
          "fields": [
            {
              "title": "Dataset type",
              "is_array_form": false,
              "description": "The topic areas to which the dataset content relates.",
              "location": "provenance.origin.datasetType",
              "guidance": "Types include those listed below. Datasets can have more than one type associated.\\n- **Health and disease**: Includes any data related to mental health, cardiovascular, cancer, rare diseases, metabolic and endocrine, neurological, reproductive, maternity and neonatology, respiratory, immunity, musculoskeletal, vision, renal and urogenital, oral and gastrointestinal, cognitive function or hearing.\\n- **Treatments/Interventions**: Includes any data related to treatment or interventions related to vaccines or which are preventative or therapeutic in nature.\\n- **Measurements/Tests**: Includes any data related to laboratory or other diagnostics.\\n- **Imaging types**: Includes any data related to CT, MRI, PET, x-ray, ultrasound or pathology imaging.\\n- **Imaging area of the body**: Indicates whether the dataset relates to head, chest, arm abdomen or leg imaging.\\n- **Omics**: Includes any data related to proteomics, transcriptomics, epigenomics, metabolomics, multiomics, metagenomics or genomics.\\n- **Socioeconomic**: Includes any data related to education, crime and justice, ethnicity, housing, labour, ageing, economics, marital status, social support, deprivation, religion, occupation, finances or family circumstances.\\n- **Lifestyle**: Includes any data related to smoking, physical activity, dietary habits or alcohol.\\n- **Registry**: Includes any data related to disease registries for research, national disease registries, audits, or birth and deaths records.\\n- **Environment and energy**: Includes any data related to the monitoring or study of environmental or energy factors or events.\\n- **Information and communication**: Includes any data related to the study or application of information and communication.\\n- **Politics**: Includes any data related to political views, activities, voting, etc.",
              "field": {
                "component": "Select",
                "options": [
                  {
                    "label": "Health and disease",
                    "value": "Health and disease"
                  },
                  {
                    "label": "Treatments/Interventions",
                    "value": "Treatments/Interventions"
                  },
                  {
                    "label": "Measurements/Tests",
                    "value": "Measurements/Tests"
                  },
                  {
                    "label": "Imaging types",
                    "value": "Imaging types"
                  },
                  {
                    "label": "Imaging Area Of The Body",
                    "value": "Imaging Area Of The Body"
                  },
                  {
                    "label": "Omics",
                    "value": "Omics"
                  },
                  {
                    "label": "Socioeconomic",
                    "value": "Socioeconomic"
                  },
                  {
                    "label": "Lifestyle",
                    "value": "Lifestyle"
                  },
                  {
                    "label": "Registry",
                    "value": "Registry"
                  },
                  {
                    "label": "Environment and energy",
                    "value": "Environment and energy"
                  },
                  {
                    "label": "Information and communication",
                    "value": "Information and communication"
                  },
                  {
                    "label": "Politics",
                    "value": "Politics"
                  }
                ],
                "name": "Dataset type",
                "label": "The topic areas to which the dataset content relates.",
                "required": true,
                "hidden": false
              }
            },
            {
              "title": "Dataset subtypes",
              "is_array_form": false,
              "description": "Dataset subtype description",
              "location": "provenance.origin.datasetType.datasetSubType",
              "guidance": "Types include those listed below. Datasets can have more than one type associated.\\n- **Health and disease**: Includes any data related to mental health, cardiovascular, cancer, rare diseases, metabolic and endocrine, neurological, reproductive, maternity and neonatology, respiratory, immunity, musculoskeletal, vision, renal and urogenital, oral and gastrointestinal, cognitive function or hearing.\\n- **Treatments/Interventions**: Includes any data related to treatment or interventions related to vaccines or which are preventative or therapeutic in nature.\\n- **Measurements/Tests**: Includes any data related to laboratory or other diagnostics.\\n- **Imaging types**: Includes any data related to CT, MRI, PET, x-ray, ultrasound or pathology imaging.\\n- **Imaging area of the body**: Indicates whether the dataset relates to head, chest, arm abdomen or leg imaging.\\n- **Omics**: Includes any data related to proteomics, transcriptomics, epigenomics, metabolomics, multiomics, metagenomics or genomics.\\n- **Socioeconomic**: Includes any data related to education, crime and justice, ethnicity, housing, labour, ageing, economics, marital status, social support, deprivation, religion, occupation, finances or family circumstances.\\n- **Lifestyle**: Includes any data related to smoking, physical activity, dietary habits or alcohol.\\n- **Registry**: Includes any data related to disease registries for research, national disease registries, audits, or birth and deaths records.\\n- **Environment and energy**: Includes any data related to the monitoring or study of environmental or energy factors or events.\\n- **Information and communication**: Includes any data related to the study or application of information and communication.\\n- **Politics**: Includes any data related to political views, activities, voting, etc.",
              "field": {
                "component": "Autocomplete",
                "options": [
                  {
                    "label": "Mental health",
                    "value": "Mental health"
                  },
                  {
                    "label": "Cardiovascular",
                    "value": "Cardiovascular"
                  },
                  {
                    "label": "Cancer",
                    "value": "Cancer"
                  },
                  {
                    "label": "Rare diseases",
                    "value": "Rare diseases"
                  },
                  {
                    "label": "Metabolic and endocrine",
                    "value": "Metabolic and endocrine"
                  },
                  {
                    "label": "Neurological",
                    "value": "Neurological"
                  },
                  {
                    "label": "Reproductive",
                    "value": "Reproductive"
                  },
                  {
                    "label": "Maternity and neonatology",
                    "value": "Maternity and neonatology"
                  },
                  {
                    "label": "Respiratory",
                    "value": "Respiratory"
                  },
                  {
                    "label": "Immunity",
                    "value": "Immunity"
                  },
                  {
                    "label": "Musculoskeletal",
                    "value": "Musculoskeletal"
                  },
                  {
                    "label": "Vision",
                    "value": "Vision"
                  },
                  {
                    "label": "Renal and urogenital",
                    "value": "Renal and urogenital"
                  },
                  {
                    "label": "Oral and gastrointestinal",
                    "value": "Oral and gastrointestinal"
                  },
                  {
                    "label": "Cognitive function",
                    "value": "Cognitive function"
                  },
                  {
                    "label": "Hearing",
                    "value": "Hearing"
                  },
                  {
                    "label": "Others",
                    "value": "Others"
                  },
                  {
                    "label": "Vaccines",
                    "value": "Vaccines"
                  },
                  {
                    "label": "Preventive",
                    "value": "Preventive"
                  },
                  {
                    "label": "Therapeutic",
                    "value": "Therapeutic"
                  },
                  {
                    "label": "Laboratory",
                    "value": "Laboratory"
                  },
                  {
                    "label": "Other diagnostics",
                    "value": "Other diagnostics"
                  },
                  {
                    "label": "CT",
                    "value": "CT"
                  },
                  {
                    "label": "MRI",
                    "value": "MRI"
                  },
                  {
                    "label": "PET",
                    "value": "PET"
                  },
                  {
                    "label": "X-ray",
                    "value": "X-ray"
                  },
                  {
                    "label": "Ultrasound",
                    "value": "Ultrasound"
                  },
                  {
                    "label": "Pathology",
                    "value": "Pathology"
                  },
                  {
                    "label": "Head",
                    "value": "Head"
                  },
                  {
                    "label": "Chest",
                    "value": "Chest"
                  },
                  {
                    "label": "Arm",
                    "value": "Arm"
                  },
                  {
                    "label": "Abdomen",
                    "value": "Abdomen"
                  },
                  {
                    "label": "Leg",
                    "value": "Leg"
                  },
                  {
                    "label": "Proteomics",
                    "value": "Proteomics"
                  },
                  {
                    "label": "Transcriptomics",
                    "value": "Transcriptomics"
                  },
                  {
                    "label": "Epigenomics",
                    "value": "Epigenomics"
                  },
                  {
                    "label": "Metabolomics",
                    "value": "Metabolomics"
                  },
                  {
                    "label": "Metagenomics",
                    "value": "Metagenomics"
                  },
                  {
                    "label": "Genomics",
                    "value": "Genomics"
                  },
                  {
                    "label": "Lipidomics",
                    "value": "Lipidomics"
                  },
                  {
                    "label": "Education",
                    "value": "Education"
                  },
                  {
                    "label": "Crime and justice",
                    "value": "Crime and justice"
                  },
                  {
                    "label": "Ethnicity",
                    "value": "Ethnicity"
                  },
                  {
                    "label": "Housing",
                    "value": "Housing"
                  },
                  {
                    "label": "Labour",
                    "value": "Labour"
                  },
                  {
                    "label": "Ageing",
                    "value": "Ageing"
                  },
                  {
                    "label": "Economics",
                    "value": "Economics"
                  },
                  {
                    "label": "Marital status",
                    "value": "Marital status"
                  },
                  {
                    "label": "Social support",
                    "value": "Social support"
                  },
                  {
                    "label": "Deprivation",
                    "value": "Deprivation"
                  },
                  {
                    "label": "Religion",
                    "value": "Religion"
                  },
                  {
                    "label": "Occupation",
                    "value": "Occupation"
                  },
                  {
                    "label": "Finances",
                    "value": "Finances"
                  },
                  {
                    "label": "Family circumstance",
                    "value": "Family circumstance"
                  },
                  {
                    "label": "Smoking",
                    "value": "Smoking"
                  },
                  {
                    "label": "Physical activity",
                    "value": "Physical activity"
                  },
                  {
                    "label": "Dietary habits",
                    "value": "Dietary habits"
                  },
                  {
                    "label": "Alcohol",
                    "value": "Alcohol"
                  },
                  {
                    "label": "Disease registry (research)",
                    "value": "Disease registry (research)"
                  },
                  {
                    "label": "National disease registries and audits",
                    "value": "National disease registries and audits"
                  },
                  {
                    "label": "Births and deaths",
                    "value": "Births and deaths"
                  },
                  {
                    "label": "Not applicable",
                    "value": "Not applicable"
                  }
                ],
                "name": "Dataset subtypes",
                "label": "Dataset subtypes",
                "placeholder": null,
                "required": false,
                "hidden": false,
                "freeSolo": false
              }
            }
          ]
        }
      ],
      "validation": [
        {
          "title": "Dataset identifier",
          "required": false,
          "type": "string",
          "min": 36,
          "max": 36
        },
        {
          "title": "Dataset Version",
          "required": true,
          "type": "string",
          "pattern": "^([0-9]+)\\.([0-9]+)\\.([0-9]+)$"
        },
        {
          "title": "revision version",
          "required": true,
          "type": "string",
          "pattern": "^([0-9]+)\\.([0-9]+)\\.([0-9]+)$"
        },
        {
          "title": "Persistent identifier of the study",
          "required": false,
          "type": "string"
        },
        {
          "title": "Project Grant Title",
          "required": false,
          "type": "string"
        },
        {
          "title": "Lead Researcher",
          "required": false,
          "type": "string"
        },
        {
          "title": "Lead Research Institute",
          "required": false,
          "type": "string"
        },
        {
          "title": "Grant number(s)",
          "required": false,
          "type": "string"
        },
        {
          "title": "Project Start Date",
          "required": false,
          "type": "string"
        },
        {
          "title": "Project End Date",
          "required": false,
          "type": "string"
        },
        {
          "title": "Project Scope",
          "required": false,
          "type": "string"
        },
        {
          "title": "revision url",
          "required": false,
          "type": "string",
          "format": "url"
        },
        {
          "title": "Metadata Issued Datetime",
          "required": true,
          "type": "date"
        },
        {
          "title": "Last Modified Datetime",
          "required": true,
          "type": "date"
        },
        {
          "title": "Title",
          "required": true,
          "type": "string",
          "min": 2,
          "max": 150
        },
        {
          "title": "Dataset abstract",
          "required": true,
          "type": "string",
          "min": 5,
          "max": 255
        },
        {
          "title": "identifier",
          "required": true,
          "type": "string"
        },
        {
          "title": "Name of Data Custodian",
          "required": true,
          "type": "string",
          "min": 2,
          "max": 150
        },
        {
          "title": "Organisation Logo",
          "required": false,
          "type": "string",
          "format": "url"
        },
        {
          "title": "Organisation Description",
          "required": false,
          "type": "string",
          "min": 2,
          "max": 10000
        },
        {
          "title": "contact point",
          "required": true,
          "type": "string",
          "format": "email"
        },
        {
          "title": "Organisation Membership",
          "required": false,
          "type": "string",
          "enum": [
            "Hub",
            "Alliance",
            "Other",
            "NCS"
          ],
          "enum_titles": [
            "Hub",
            "Alliance",
            "Other",
            "NCS"
          ]
        },
        {
          "title": "Dataset population size",
          "required": true,
          "type": "integer",
          "min": -1
        },
        {
          "title": "Keywords",
          "required": false,
          "type": "array",
          "of": null
        },
        {
          "title": "Digital Object Identifier (DOI) for dataset",
          "required": false,
          "type": "string",
          "pattern": "^10.\\d{4,9}/[-._;()/:a-zA-Z0-9]+$",
          "excludeEmptyString": true
        },
        {
          "title": "Contact point",
          "required": true,
          "type": "string",
          "format": "email"
        },
        {
          "title": "Dataset & BioSample alias",
          "required": false,
          "type": "string",
          "pattern": "([^,]+)",
          "excludeEmptyString": true
        },
        {
          "title": "Lead Researcher",
          "required": false,
          "type": "string"
        },
        {
          "title": "Lead Research Institute",
          "required": false,
          "type": "string"
        },
        {
          "title": "description",
          "required": true,
          "type": "string",
          "min": 2,
          "max": 10000
        },
        {
          "title": "Associated media",
          "required": false,
          "type": "string",
          "pattern": "([^,]+)",
          "excludeEmptyString": true
        },
        {
          "title": "Dataset pipeline status",
          "required": false,
          "type": "string",
          "enum": [
            "",
            "Available",
            "Not available"
          ],
          "enum_titles": [
            "-- Select --",
            "Available",
            "Not available"
          ]
        },
        {
          "title": "Url",
          "required": false,
          "type": "string",
          "format": "url"
        },
        {
          "title": "Minimum age range",
          "required": false,
          "type": "integer",
          "min": -1
        },
        {
          "title": "Maximum age range",
          "required": false,
          "type": "integer",
          "min": -1
        },
        {
          "title": "Dataset coverage/completeness/quality",
          "required": false,
          "type": "string",
          "format": "url"
        },
        {
          "title": "Purpose of dataset collection",
          "required": false,
          "type": "array",
          "of": {
            "type": "string",
            "enum": [
              "Research cohort",
              "Study",
              "Disease registry",
              "Trial",
              "Care",
              "Audit",
              "Administrative",
              "Financial",
              "Statutory",
              "Other",
              null],
            "enum_titles": [
              "Research cohort",
              "Study",
              "Disease registry",
              "Trial",
              "Care",
              "Audit",
              "Administrative",
              "Financial",
              "Statutory",
              "Other",
              null]
          }
        },
        {
          "title": "Source of data extraction",
          "required": false,
          "type": "array",
          "of": {
            "type": "string",
            "enum": [
              "EPR",
              "Electronic survey",
              "LIMS",
              "Paper-based",
              "Free text NLP",
              "Machine generated",
              "Other"
            ],
            "enum_titles": [
              "EPR",
              "Electronic survey",
              "LIMS",
              "Paper-based",
              "Free text NLP",
              "Machine generated",
              "Other"
            ]
          }
        },
        {
          "title": "Collection source setting",
          "required": false,
          "type": "array",
          "of": {
            "type": "string",
            "enum": [
              "Cohort, study, trial",
              "Clinic",
              "Primary care - Referrals",
              "Primary care - Clinic",
              "Primary care - Out of hours",
              "Secondary care - Accident and Emergency",
              "Secondary care - Outpatients",
              "Secondary care - In-patients",
              "Secondary care - Ambulance",
              "Secondary care - ICU",
              "Prescribing - Community pharmacy",
              "Prescribing - Hospital",
              "Patient report outcome",
              "Wearables",
              "Local authority",
              "National government",
              "Community",
              "Services",
              "Home",
              "Private",
              "Social care - Health care at home",
              "Social care - Other social data",
              "Census",
              "Other",
              null],
            "enum_titles": [
              "Cohort, study, trial",
              "Clinic",
              "Primary care - Referrals",
              "Primary care - Clinic",
              "Primary care - Out of hours",
              "Secondary care - Accident and Emergency",
              "Secondary care - Outpatients",
              "Secondary care - In-patients",
              "Secondary care - Ambulance",
              "Secondary care - ICU",
              "Prescribing - Community pharmacy",
              "Prescribing - Hospital",
              "Patient report outcome",
              "Wearables",
              "Local authority",
              "National government",
              "Community",
              "Services",
              "Home",
              "Private",
              "Social care - Health care at home",
              "Social care - Other social data",
              "Census",
              "Other",
              null]
          }
        },
        {
          "title": "Image contrast",
          "required": false,
          "type": "string",
          "enum": [
            "Yes",
            "No",
            "Not stated"
          ],
          "enum_titles": [
            "Yes",
            "No",
            "Not stated"
          ]
        },
        {
          "title": "Publishing frequency",
          "required": true,
          "type": "string",
          "enum": [
            "Static",
            "Irregular",
            "Continuous",
            "Biennial",
            "Annual",
            "Biannual",
            "Quarterly",
            "Bimonthly",
            "Monthly",
            "Biweekly",
            "Weekly",
            "Twice a week",
            "Daily",
            "Other",
            null],
          "enum_titles": [
            "Static",
            "Irregular",
            "Continuous",
            "Biennial",
            "Annual",
            "Biannual",
            "Quarterly",
            "Bimonthly",
            "Monthly",
            "Biweekly",
            "Weekly",
            "Twice a week",
            "Daily",
            "Other",
            null]
        },
        {
          "title": "Distribution release date",
          "required": false,
          "type": "date"
        },
        {
          "title": "Start date",
          "required": true,
          "type": "date"
        },
        {
          "title": "End date",
          "required": false,
          "type": "date"
        },
        {
          "title": "Time lag",
          "required": true,
          "type": "string",
          "enum": [
            "",
            "Less than 1 week",
            "1-2 weeks",
            "2-4 weeks",
            "1-2 months",
            "2-6 months",
            "More than 6 months",
            "Variable",
            "Not applicable",
            "Other"
          ],
          "enum_titles": [
            "-- Select --",
            "Less than 1 week",
            "1-2 weeks",
            "2-4 weeks",
            "1-2 months",
            "2-6 months",
            "More than 6 months",
            "Variable",
            "Not applicable",
            "Other"
          ]
        },
        {
          "title": "Data use limitation",
          "required": false,
          "type": "array",
          "of": {
            "type": "string",
            "enum": [
              "General research use",
              "Commercial research use",
              "Genetic studies only",
              "No general methods research",
              "No restriction",
              "Geographical restrictions",
              "Institution-specific restrictions",
              "Not for profit use",
              "Project-specific restrictions",
              "Research-specific restrictions",
              "User-specific restrictions",
              "Research use only",
              "No linkage"
            ],
            "enum_titles": [
              "General research use",
              "Commercial research use",
              "Genetic studies only",
              "No general methods research",
              "No restriction",
              "Geographical restrictions",
              "Institution-specific restrictions",
              "Not for profit use",
              "Project-specific restrictions",
              "Research-specific restrictions",
              "User-specific restrictions",
              "Research use only",
              "No linkage"
            ]
          }
        },
        {
          "title": "Data use requirements",
          "required": false,
          "type": "array",
          "of": {
            "type": "string",
            "enum": [
              "Collaboration required",
              "Project-specific restrictions",
              "Ethics approval required",
              "Institution-specific restrictions",
              "Geographical restrictions",
              "Publication moratorium",
              "Publication required",
              "Return to database or resource",
              "Time limit on use",
              "Disclosure control",
              "Not for profit use",
              "User-specific restriction"
            ],
            "enum_titles": [
              "Collaboration required",
              "Project-specific restrictions",
              "Ethics approval required",
              "Institution-specific restrictions",
              "Geographical restrictions",
              "Publication moratorium",
              "Publication required",
              "Return to database or resource",
              "Time limit on use",
              "Disclosure control",
              "Not for profit use",
              "User-specific restriction"
            ]
          }
        },
        {
          "title": "Citation requirements",
          "required": false,
          "type": "string",
          "min": 2,
          "max": 1000
        },
        {
          "title": "Access rights",
          "required": true,
          "type": "string",
          "min": 2,
          "max": 50000
        },
        {
          "title": "Access method category",
          "required": false,
          "type": "string",
          "enum": [
            "TRE/SDE",
            "Direct access",
            "Open access",
            "Varies based on project"
          ],
          "enum_titles": [
            "TRE/SDE",
            "Direct access",
            "Open access",
            "Varies based on project"
          ]
        },
        {
          "title": "Access service description",
          "required": false,
          "type": "string",
          "min": 2,
          "max": 50000
        },
        {
          "title": "Access request cost",
          "required": false,
          "type": "string",
          "min": 2,
          "max": 50000
        },
        {
          "title": "Time to dataset access",
          "required": false,
          "type": "string",
          "enum": [
            "Less than 1 week",
            "1-2 weeks",
            "2-4 weeks",
            "1-2 months",
            "2-6 months",
            "More than 6 months",
            "Variable",
            "Not applicable",
            "Other"
          ],
          "enum_titles": [
            "Less than 1 week",
            "1-2 weeks",
            "2-4 weeks",
            "1-2 months",
            "2-6 months",
            "More than 6 months",
            "Variable",
            "Not applicable",
            "Other"
          ]
        },
        {
          "title": "Jurisdiction",
          "required": false,
          "type": "array",
          "of": {
            "type": "string",
            "pattern": "^[A-Z]{2}(-[A-Z]{2,3})?$"
          },
          "excludeEmptyString": true
        },
        {
          "title": "Data Controller",
          "required": false,
          "type": "string",
          "min": 2,
          "max": 50000
        },
        {
          "title": "Data Processor",
          "required": false,
          "type": "string",
          "min": 2,
          "max": 50000
        },
        {
          "title": "Controlled vocabulary",
          "required": true,
          "type": "array",
          "of": {
            "type": "string",
            "enum": [
              "LOCAL",
              "OPCS4",
              "READ",
              "SNOMED CT",
              "SNOMED RT",
              "DM PLUS D",
              "DM+D",
              "NHS NATIONAL CODES",
              "NHS SCOTLAND NATIONAL CODES",
              "NHS WALES NATIONAL CODES",
              "ODS",
              "LOINC",
              "ICD10",
              "ICD10CM",
              "ICD10PCS",
              "ICD9CM",
              "ICD9",
              "ICDO3",
              "AMT",
              "APC",
              "ATC",
              "CIEL",
              "HPO",
              "CPT4",
              "DPD",
              "DRG",
              "HEMONC",
              "JMDC",
              "KCD7",
              "MULTUM",
              "NAACCR",
              "NDC",
              "NDFRT",
              "OXMIS",
              "RXNORM",
              "RXNORM EXTENSION",
              "SPL",
              "OTHER"
            ],
            "enum_titles": [
              "LOCAL",
              "OPCS4",
              "READ",
              "SNOMED CT",
              "SNOMED RT",
              "DM PLUS D",
              "DM+D",
              "NHS NATIONAL CODES",
              "NHS SCOTLAND NATIONAL CODES",
              "NHS WALES NATIONAL CODES",
              "ODS",
              "LOINC",
              "ICD10",
              "ICD10CM",
              "ICD10PCS",
              "ICD9CM",
              "ICD9",
              "ICDO3",
              "AMT",
              "APC",
              "ATC",
              "CIEL",
              "HPO",
              "CPT4",
              "DPD",
              "DRG",
              "HEMONC",
              "JMDC",
              "KCD7",
              "MULTUM",
              "NAACCR",
              "NDC",
              "NDFRT",
              "OXMIS",
              "RXNORM",
              "RXNORM EXTENSION",
              "SPL",
              "OTHER"
            ]
          }
        },
        {
          "title": "Alignment with standardised data models",
          "required": true,
          "type": "array",
          "of": {
            "type": "string",
            "enum": [
              "HL7 FHIR",
              "HL7 V2",
              "HL7 CDA",
              "HL7 CCOW",
              "LOINC",
              "DICOM",
              "I2B2",
              "IHE",
              "OMOP",
              "OPENEHR",
              "SENTINEL",
              "PCORNET",
              "CDISC",
              "NHS DATA DICTIONARY",
              "NHS SCOTLAND DATA DICTIONARY",
              "NHS WALES DATA DICTIONARY",
              "LOCAL",
              "OTHER"
            ],
            "enum_titles": [
              "HL7 FHIR",
              "HL7 V2",
              "HL7 CDA",
              "HL7 CCOW",
              "LOINC",
              "DICOM",
              "I2B2",
              "IHE",
              "OMOP",
              "OPENEHR",
              "SENTINEL",
              "PCORNET",
              "CDISC",
              "NHS DATA DICTIONARY",
              "NHS SCOTLAND DATA DICTIONARY",
              "NHS WALES DATA DICTIONARY",
              "LOCAL",
              "OTHER"
            ]
          }
        },
        {
          "title": "Language",
          "required": true,
          "type": "array",
          "of": {
            "type": "string",
            "enum": [
              "aa",
              "ab",
              "ae",
              "af",
              "ak",
              "am",
              "an",
              "ar",
              "as",
              "av",
              "ay",
              "az",
              "ba",
              "be",
              "bg",
              "bh",
              "bi",
              "bm",
              "bn",
              "bo",
              "br",
              "bs",
              "ca",
              "ce",
              "ch",
              "co",
              "cr",
              "cs",
              "cu",
              "cv",
              "cy",
              "da",
              "de",
              "dv",
              "dz",
              "ee",
              "el",
              "en",
              "eo",
              "es",
              "et",
              "eu",
              "fa",
              "ff",
              "fi",
              "fj",
              "fo",
              "fr",
              "fy",
              "ga",
              "gd",
              "gl",
              "gn",
              "gu",
              "gv",
              "ha",
              "he",
              "hi",
              "ho",
              "hr",
              "ht",
              "hu",
              "hy",
              "hz",
              "ia",
              "id",
              "ie",
              "ig",
              "ii",
              "ik",
              "io",
              "is",
              "it",
              "iu",
              "ja",
              "jv",
              "ka",
              "kg",
              "ki",
              "kj",
              "kk",
              "kl",
              "km",
              "kn",
              "ko",
              "kr",
              "ks",
              "ku",
              "kv",
              "kw",
              "ky",
              "la",
              "lb",
              "lg",
              "li",
              "ln",
              "lo",
              "lt",
              "lu",
              "lv",
              "mg",
              "mh",
              "mi",
              "mk",
              "ml",
              "mn",
              "mr",
              "ms",
              "mt",
              "my",
              "na",
              "nb",
              "nd",
              "ne",
              "ng",
              "nl",
              "nn",
              "no",
              "nr",
              "nv",
              "ny",
              "oc",
              "oj",
              "om",
              "or",
              "os",
              "pa",
              "pi",
              "pl",
              "ps",
              "pt",
              "qu",
              "rm",
              "rn",
              "ro",
              "ru",
              "rw",
              "sa",
              "sc",
              "sd",
              "se",
              "sg",
              "si",
              "sk",
              "sl",
              "sm",
              "sn",
              "so",
              "sq",
              "sr",
              "ss",
              "st",
              "su",
              "sv",
              "sw",
              "ta",
              "te",
              "tg",
              "th",
              "ti",
              "tk",
              "tl",
              "tn",
              "to",
              "tr",
              "ts",
              "tt",
              "tw",
              "ty",
              "ug",
              "uk",
              "ur",
              "uz",
              "ve",
              "vi",
              "vo",
              "wa",
              "wo",
              "xh",
              "yi",
              "yo",
              "za",
              "zh",
              "zu"
            ],
            "enum_titles": [
              "aa",
              "ab",
              "ae",
              "af",
              "ak",
              "am",
              "an",
              "ar",
              "as",
              "av",
              "ay",
              "az",
              "ba",
              "be",
              "bg",
              "bh",
              "bi",
              "bm",
              "bn",
              "bo",
              "br",
              "bs",
              "ca",
              "ce",
              "ch",
              "co",
              "cr",
              "cs",
              "cu",
              "cv",
              "cy",
              "da",
              "de",
              "dv",
              "dz",
              "ee",
              "el",
              "en",
              "eo",
              "es",
              "et",
              "eu",
              "fa",
              "ff",
              "fi",
              "fj",
              "fo",
              "fr",
              "fy",
              "ga",
              "gd",
              "gl",
              "gn",
              "gu",
              "gv",
              "ha",
              "he",
              "hi",
              "ho",
              "hr",
              "ht",
              "hu",
              "hy",
              "hz",
              "ia",
              "id",
              "ie",
              "ig",
              "ii",
              "ik",
              "io",
              "is",
              "it",
              "iu",
              "ja",
              "jv",
              "ka",
              "kg",
              "ki",
              "kj",
              "kk",
              "kl",
              "km",
              "kn",
              "ko",
              "kr",
              "ks",
              "ku",
              "kv",
              "kw",
              "ky",
              "la",
              "lb",
              "lg",
              "li",
              "ln",
              "lo",
              "lt",
              "lu",
              "lv",
              "mg",
              "mh",
              "mi",
              "mk",
              "ml",
              "mn",
              "mr",
              "ms",
              "mt",
              "my",
              "na",
              "nb",
              "nd",
              "ne",
              "ng",
              "nl",
              "nn",
              "no",
              "nr",
              "nv",
              "ny",
              "oc",
              "oj",
              "om",
              "or",
              "os",
              "pa",
              "pi",
              "pl",
              "ps",
              "pt",
              "qu",
              "rm",
              "rn",
              "ro",
              "ru",
              "rw",
              "sa",
              "sc",
              "sd",
              "se",
              "sg",
              "si",
              "sk",
              "sl",
              "sm",
              "sn",
              "so",
              "sq",
              "sr",
              "ss",
              "st",
              "su",
              "sv",
              "sw",
              "ta",
              "te",
              "tg",
              "th",
              "ti",
              "tk",
              "tl",
              "tn",
              "to",
              "tr",
              "ts",
              "tt",
              "tw",
              "ty",
              "ug",
              "uk",
              "ur",
              "uz",
              "ve",
              "vi",
              "vo",
              "wa",
              "wo",
              "xh",
              "yi",
              "yo",
              "za",
              "zh",
              "zu"
            ]
          }
        },
        {
          "title": "Format",
          "required": true,
          "type": "array",
          "of": null
        },
        {
          "title": "Investigations",
          "required": false,
          "type": "array",
          "of": {
            "type": "string",
            "format": "uri"
          }
        },
        {
          "title": "Tools",
          "required": false,
          "type": "array",
          "of": {
            "type": "string",
            "format": "uri"
          }
        },
        {
          "title": "Publication about the dataset",
          "required": false,
          "type": "array",
          "of": {
            "type": "string",
            "pattern": "^10.\\d{4,9}/[-._;()/:a-zA-Z0-9]+$"
          },
          "excludeEmptyString": true
        },
        {
          "title": "Publication using the dataset",
          "required": false,
          "type": "array",
          "of": {
            "type": "string",
            "pattern": "^10.\\d{4,9}/[-._;()/:a-zA-Z0-9]+$"
          },
          "excludeEmptyString": true
        },
        {
          "title": "Synthetic data web links",
          "required": false,
          "type": "array",
          "of": {
            "type": "string",
            "format": "uri"
          }
        },
        {
          "title": "Omics assay",
          "required": false,
          "type": "string",
          "enum": [
            "NMR spectroscopy",
            "Mass-spectrometry",
            "Whole genome sequencing",
            "Exome sequencing",
            "Genotyping by array",
            "Transcriptome profiling by high-throughput sequencing",
            "Transcriptome profiling by array",
            "Amplicon sequencing",
            "Methylation binding domain sequencing",
            "Methylation profiling by high-throughput sequencing",
            "Genomic variant calling",
            "Chromatin accessibility profiling by high-throughput sequencing",
            "Histone modification profiling by high-throughput sequencing",
            "Chromatin immunoprecipitation sequencing",
            "Whole genome shotgun sequencing",
            "Whole transcriptome sequencing",
            "Targeted mutation analysis"
          ],
          "enum_titles": [
            "NMR spectroscopy",
            "Mass-spectrometry",
            "Whole genome sequencing",
            "Exome sequencing",
            "Genotyping by array",
            "Transcriptome profiling by high-throughput sequencing",
            "Transcriptome profiling by array",
            "Amplicon sequencing",
            "Methylation binding domain sequencing",
            "Methylation profiling by high-throughput sequencing",
            "Genomic variant calling",
            "Chromatin accessibility profiling by high-throughput sequencing",
            "Histone modification profiling by high-throughput sequencing",
            "Chromatin immunoprecipitation sequencing",
            "Whole genome shotgun sequencing",
            "Whole transcriptome sequencing",
            "Targeted mutation analysis"
          ]
        },
        {
          "title": "Omics Platform",
          "required": false,
          "type": "string",
          "enum": [
            "Other",
            "NMR Nightingale",
            "Metabolon",
            "Biocrates",
            "Illumina",
            "Oxford Nanopore",
            "454",
            "Hi-C",
            "HiFi"
          ],
          "enum_titles": [
            "Other",
            "NMR Nightingale",
            "Metabolon",
            "Biocrates",
            "Illumina",
            "Oxford Nanopore",
            "454",
            "Hi-C",
            "HiFi"
          ]
        },
        {
          "title": "Derived from Array",
          "required": false,
          "minItems": 0,
          "type": "array",
          "items": [
            {
              "title": "Persistent identifier of a dataset",
              "required": false,
              "type": "string",
              "min": 2,
              "max": 150
            },
            {
              "title": "Title of a dataset",
              "required": false,
              "type": "string",
              "min": 2,
              "max": 150
            },
            {
              "title": "Url of a dataset",
              "required": false,
              "type": "string",
              "format": "url"
            }
          ]
        },
        {
          "title": "Is part of Array",
          "required": false,
          "minItems": 0,
          "type": "array",
          "items": [
            {
              "title": "Persistent identifier of a dataset",
              "required": false,
              "type": "string",
              "min": 2,
              "max": 150
            },
            {
              "title": "Title of a dataset",
              "required": false,
              "type": "string",
              "min": 2,
              "max": 150
            },
            {
              "title": "Url of a dataset",
              "required": false,
              "type": "string",
              "format": "url"
            }
          ]
        },
        {
          "title": "Linked datasets Array",
          "required": false,
          "minItems": 0,
          "type": "array",
          "items": [
            {
              "title": "Persistent identifier of a dataset",
              "required": false,
              "type": "string",
              "min": 2,
              "max": 150
            },
            {
              "title": "Title of a dataset",
              "required": false,
              "type": "string",
              "min": 2,
              "max": 150
            },
            {
              "title": "Url of a dataset",
              "required": false,
              "type": "string",
              "format": "url"
            }
          ]
        },
        {
          "title": "Similar to datasets Array",
          "required": false,
          "minItems": 0,
          "type": "array",
          "items": [
            {
              "title": "Persistent identifier of a dataset",
              "required": false,
              "type": "string",
              "min": 2,
              "max": 150
            },
            {
              "title": "Title of a dataset",
              "required": false,
              "type": "string",
              "min": 2,
              "max": 150
            },
            {
              "title": "Url of a dataset",
              "required": false,
              "type": "string",
              "format": "url"
            }
          ]
        },
        {
          "title": "Non-tabular data types Array",
          "required": false,
          "minItems": 0,
          "type": "array",
          "items": [
            {
              "title": "Title",
              "required": true,
              "type": "string",
              "min": 1,
              "max": 255
            },
            {
              "title": "Data description",
              "required": true,
              "type": "string",
              "min": 1,
              "max": 1000
            },
            {
              "title": "Format",
              "required": true,
              "type": "string",
              "min": 1,
              "max": 255
            },
            null]
        },
        {
          "title": "Observations Array",
          "required": false,
          "minItems": 0,
          "type": "array",
          "items": [
            {
              "title": "Dataset volume measure",
              "required": true,
              "type": "string",
              "enum": [
                "Persons",
                "Events",
                "Findings",
                "Number of scans per modality"
              ],
              "enum_titles": [
                "Persons",
                "Events",
                "Findings",
                "Number of scans per modality"
              ]
            },
            {
              "title": "Measured value",
              "required": true,
              "type": "integer",
              "min": -1
            },
            {
              "title": "Disambiguating description",
              "required": false,
              "type": "string",
              "min": 5,
              "max": 500
            },
            {
              "title": "Observation date",
              "required": true,
              "type": "date"
            },
            null]
        },
        {
          "title": "Demographic Frequency Age Array",
          "required": false,
          "minItems": 0,
          "type": "array",
          "items": [
            {
              "title": "Age grouping",
              "required": true,
              "type": "string",
              "enum": [
                "0-6 days",
                "7-27 days",
                "1-11 months",
                "1-4 years",
                "5-9 years",
                "10-14 years",
                "15-19 years",
                "20-24 years",
                "25-29 years",
                "30-34 years",
                "35-39 years",
                "40-44 years",
                "45-49 years",
                "50-54 years",
                "55-59 years",
                "60-64 years",
                "65-69 years",
                "70-74 years",
                "75-79 years",
                "80-84 years",
                "85-89 years",
                "90-94 years",
                "95-99 years",
                "100+ years"
              ],
              "enum_titles": [
                "0-6 days",
                "7-27 days",
                "1-11 months",
                "1-4 years",
                "5-9 years",
                "10-14 years",
                "15-19 years",
                "20-24 years",
                "25-29 years",
                "30-34 years",
                "35-39 years",
                "40-44 years",
                "45-49 years",
                "50-54 years",
                "55-59 years",
                "60-64 years",
                "65-69 years",
                "70-74 years",
                "75-79 years",
                "80-84 years",
                "85-89 years",
                "90-94 years",
                "95-99 years",
                "100+ years"
              ]
            },
            {
              "title": "Age count",
              "required": true,
              "type": "integer",
              "min": -1
            }
          ]
        },
        {
          "title": "Demographic Frequency Ethnicity Array",
          "required": false,
          "minItems": 0,
          "type": "array",
          "items": [
            {
              "title": "Ethnicity grouping",
              "required": true,
              "type": "string",
              "enum": [
                "White - British",
                "White - Irish",
                "White - Any other White background",
                "Mixed - White and Black Caribbean",
                "Mixed - White and Black African",
                "Mixed - White and Asian",
                "Mixed - Any other mixed background",
                "Asian or Asian British - Indian",
                "Asian or Asian British - Pakistani",
                "Asian or Asian British - Bangladeshi",
                "Asian or Asian British - Any other Asian background",
                "Black or Black British - Caribbean",
                "Black or Black British - African",
                "Black or Black British - Any other Black background",
                "Other Ethnic Groups - Chinese",
                "Other Ethnic Groups - Any other ethnic group",
                "Not stated",
                "Not known"
              ],
              "enum_titles": [
                "White - British",
                "White - Irish",
                "White - Any other White background",
                "Mixed - White and Black Caribbean",
                "Mixed - White and Black African",
                "Mixed - White and Asian",
                "Mixed - Any other mixed background",
                "Asian or Asian British - Indian",
                "Asian or Asian British - Pakistani",
                "Asian or Asian British - Bangladeshi",
                "Asian or Asian British - Any other Asian background",
                "Black or Black British - Caribbean",
                "Black or Black British - African",
                "Black or Black British - Any other Black background",
                "Other Ethnic Groups - Chinese",
                "Other Ethnic Groups - Any other ethnic group",
                "Not stated",
                "Not known"
              ]
            },
            {
              "title": "Ethnicity count",
              "required": true,
              "type": "integer",
              "min": -1
            }
          ]
        },
        {
          "title": "Demographic Frequency Disease Array",
          "required": false,
          "minItems": 0,
          "type": "array",
          "items": [
            {
              "title": "Disease code",
              "required": true,
              "type": "string"
            },
            {
              "title": "Disease code vocabulary",
              "required": true,
              "type": "string",
              "enum": [
                "ICD10",
                "SNOMED CT",
                "MeSH"
              ],
              "enum_titles": [
                "ICD10",
                "SNOMED CT",
                "MeSH"
              ]
            },
            {
              "title": "Disease count",
              "required": true,
              "type": "integer",
              "min": -1
            }
          ]
        },
        {
          "title": "Dataset Type Array",
          "required": true,
          "minItems": 1,
          "type": "array",
          "items": {
            "title": "Dataset type",
            "required": true,
            "type": "array",
            "of": {
              "type": "nested",
              "enum": [
                {
                  "title": "Health and disease",
                  "options": [
                    "Mental health",
                    "Cardiovascular",
                    "Cancer",
                    "Rare diseases",
                    "Metabolic and endocrine",
                    "Neurological",
                    "Reproductive",
                    "Maternity and neonatology",
                    "Respiratory",
                    "Immunity",
                    "Musculoskeletal",
                    "Vision",
                    "Renal and urogenital",
                    "Oral and gastrointestinal",
                    "Cognitive function",
                    "Hearing",
                    "Others"
                  ]
                },
                {
                  "title": "Treatments/Interventions",
                  "options": [
                    "Vaccines",
                    "Preventive",
                    "Therapeutic",
                    "Others"
                  ]
                },
                {
                  "title": "Measurements/Tests",
                  "options": [
                    "Laboratory",
                    "Other diagnostics"
                  ]
                },
                {
                  "title": "Imaging types",
                  "options": [
                    "CT",
                    "MRI",
                    "PET",
                    "X-ray",
                    "Ultrasound",
                    "Pathology",
                    "Others"
                  ]
                },
                {
                  "title": "Imaging Area Of The Body",
                  "options": [
                    "Head",
                    "Chest",
                    "Arm",
                    "Abdomen",
                    "Leg",
                    "Others"
                  ]
                },
                {
                  "title": "Omics",
                  "options": [
                    "Proteomics",
                    "Transcriptomics",
                    "Epigenomics",
                    "Metabolomics",
                    "Metagenomics",
                    "Genomics",
                    "Lipidomics",
                    "Others"
                  ]
                },
                {
                  "title": "Socioeconomic",
                  "options": [
                    "Education",
                    "Crime and justice",
                    "Ethnicity",
                    "Housing",
                    "Labour",
                    "Ageing",
                    "Economics",
                    "Marital status",
                    "Social support",
                    "Deprivation",
                    "Religion",
                    "Occupation",
                    "Finances",
                    "Family circumstance",
                    "Others"
                  ]
                },
                {
                  "title": "Lifestyle",
                  "options": [
                    "Smoking",
                    "Physical activity",
                    "Dietary habits",
                    "Alcohol",
                    "Others"
                  ]
                },
                {
                  "title": "Registry",
                  "options": [
                    "Disease registry (research)",
                    "National disease registries and audits",
                    "Births and deaths",
                    "Others"
                  ]
                },
                {
                  "title": "Environment and energy",
                  "options": [
                    "Not applicable"
                  ]
                },
                {
                  "title": "Information and communication",
                  "options": [
                    "Not applicable"
                  ]
                },
                {
                  "title": "Politics",
                  "options": [
                    "Not applicable"
                  ]
                }
              ],
              "enum_titles": [
                {
                  "title": "Health and disease",
                  "options": [
                    "Mental health",
                    "Cardiovascular",
                    "Cancer",
                    "Rare diseases",
                    "Metabolic and endocrine",
                    "Neurological",
                    "Reproductive",
                    "Maternity and neonatology",
                    "Respiratory",
                    "Immunity",
                    "Musculoskeletal",
                    "Vision",
                    "Renal and urogenital",
                    "Oral and gastrointestinal",
                    "Cognitive function",
                    "Hearing",
                    "Others"
                  ]
                },
                {
                  "title": "Treatments/Interventions",
                  "options": [
                    "Vaccines",
                    "Preventive",
                    "Therapeutic",
                    "Others"
                  ]
                },
                {
                  "title": "Measurements/Tests",
                  "options": [
                    "Laboratory",
                    "Other diagnostics"
                  ]
                },
                {
                  "title": "Imaging types",
                  "options": [
                    "CT",
                    "MRI",
                    "PET",
                    "X-ray",
                    "Ultrasound",
                    "Pathology",
                    "Others"
                  ]
                },
                {
                  "title": "Imaging Area Of The Body",
                  "options": [
                    "Head",
                    "Chest",
                    "Arm",
                    "Abdomen",
                    "Leg",
                    "Others"
                  ]
                },
                {
                  "title": "Omics",
                  "options": [
                    "Proteomics",
                    "Transcriptomics",
                    "Epigenomics",
                    "Metabolomics",
                    "Metagenomics",
                    "Genomics",
                    "Lipidomics",
                    "Others"
                  ]
                },
                {
                  "title": "Socioeconomic",
                  "options": [
                    "Education",
                    "Crime and justice",
                    "Ethnicity",
                    "Housing",
                    "Labour",
                    "Ageing",
                    "Economics",
                    "Marital status",
                    "Social support",
                    "Deprivation",
                    "Religion",
                    "Occupation",
                    "Finances",
                    "Family circumstance",
                    "Others"
                  ]
                },
                {
                  "title": "Lifestyle",
                  "options": [
                    "Smoking",
                    "Physical activity",
                    "Dietary habits",
                    "Alcohol",
                    "Others"
                  ]
                },
                {
                  "title": "Registry",
                  "options": [
                    "Disease registry (research)",
                    "National disease registries and audits",
                    "Births and deaths",
                    "Others"
                  ]
                },
                {
                  "title": "Environment and energy",
                  "options": [
                    "Not applicable"
                  ]
                },
                {
                  "title": "Information and communication",
                  "options": [
                    "Not applicable"
                  ]
                },
                {
                  "title": "Politics",
                  "options": [
                    "Not applicable"
                  ]
                }
              ]
            }
          }
        }
      ],
      "defaultValues": {
        "team_id": 31,
        "Name of Data Custodian": "",
        "Organisation Logo": "media_base_urlmedia_base_url/teams/rnag_jmim_hhil.jpeg",
        "Organisation Description": "",
        "contact point": "",
        "Organisation Membership": null,
        "Data Controller": "Dare-Schulist",
        "Data Processor": "Dare-Schulist",
        "Jurisdiction": [
          "UK"
        ],
        "Language": [
          "en"
        ]
      }
    }
};

export const formHydrationData = formHydrationResponse.data;
export default formHydrationResponse;