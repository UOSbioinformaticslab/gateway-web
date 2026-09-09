"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
    useForm,
    FormProvider,
    useFieldArray,
    FieldValues,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { get, omit } from "lodash";
import { useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Divider } from "@mui/material";
import { buildYup } from "schema-to-yup";
import { AuthUser } from "@/interfaces/AuthUser";
import {
    CreateOrigin,
    Dataset,
    DatasetStatus,
    Metadata,
    NewDataset,
    StructuralMetadata,
} from "@/interfaces/Dataset";
import {
    FormHydrationSchema,
    FormHydrationValidation,
} from "@/interfaces/FormHydration";
import { LegendItem } from "@/interfaces/FormLegend";
import { Team } from "@/interfaces/Team";
import { Defs } from "@/interfaces/V4Schema";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import FormBanner, { NAVBAR_ID } from "@/components/FormBanner/FormBanner";
import FormLegend from "@/components/FormLegend";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import theme, { colors } from "@/config/theme";
import { DataStatus } from "@/consts/application";
import {
    TEAM_ID_FIELD,
    DATA_CUSTODIAN_NAME,
    DATASET_TYPE,
    INITIAL_FORM_SECTION,
    STRUCTURAL_METADATA_FORM_SECTION,
    DATASET_FILTERS_FORM_SECTION,
    OTHER_DATA_TYPES_FORM_SECTION,
    ENTITY_RELATIONSHIP_DIAGRAM_FORM_SECTION,
    COVERAGE_FORM_SECTION,
    DATASET_TIMELINES_FORM_SECTION,
    ACCESSIBILITY_FORM_SECTION,
    TOOLS_AND_PUBLICATIONS_FORM_SECTION,
    OBSERVATIONS_FORM_SECTION,
    DEMOGRAPHIC_FREQUENCY_FORM_SECTION,
    OMICS_FORM_SECTION,
    FORM_SECTION_ORDER,
    SUBMISSON_FORM_SECTION,
} from "@/consts/createDataset";
import { ArrowBackIosNewIcon, ArrowForwardIosIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import { getToday } from "@/utils/date";
import {
    mapExistingDatasetToFormFields,
    formGenerateLegendItems,
    formGetFieldsCompletedCount,
    getFirstLocationValues,
    hasVisibleFieldsForLocation,
    isFirstSection,
    isLastSection,
    mapFormFieldsForSubmission,
    getAssociatedProjectGrantsGuidance,
    getFormHydrationFieldHeaderProps,
    getSummarySectionHeaderProps,
    getSummarySectionGuidance,
    getDocumentationSectionHeaderProps,
    getDocumentationSectionGuidance,
    getEntityRelationshipDiagramSectionHeaderProps,
    getCoverageSectionHeaderProps,
    getCoverageSectionGuidance,
    getDatasetTimelinesSectionGuidance,
    getAccessibilitySectionHeaderProps,
    getAccessibilitySectionGuidance,
    getToolsAndPublicationsSectionHeaderProps,
    getToolsAndPublicationsSectionGuidance,
    getObservationsSectionHeaderProps,
    getObservationsSectionGuidance,
    getDemographicFrequencySectionHeaderProps,
    getDemographicFrequencySectionGuidance,
    getOmicsSectionHeaderProps,
    getOmicsSectionGuidance,
    isDemographicBreakdownArray,
    getWelcomeSectionGuidance,
    isSummaryDataCustodianAccordionField,
    isSummaryStandaloneAccordionField,
    isDocumentationStandaloneAccordionField,
    formatValidationItems,
} from "@/utils/formHydration";
import FormHydrationAccordionSection from "./FormHydrationAccordionSection";
import FormHydrationStaticSection from "./FormHydrationStaticSection";
import FormHydrationFieldHeader from "./FormHydrationFieldHeader";
import FormHydrationFieldItem from "./FormHydrationFieldItem";
import { capitalise, decodeHtmlEntity, splitCamelcase } from "@/utils/general";
import IntroScreen from "../IntroScreen";
import GuidanceDownloads from "../GuidanceDownloads";
import WelcomeGuidanceNavigation from "../WelcomeGuidanceNavigation";
import StructuralMetadataSection from "../StructuralMetadata";
import SubmissionScreen from "../SubmissionScreen";
import { FormFooter, FormFooterItem } from "./CreateDataset.styles";

const DatasetFiltersSection = dynamic(
    () => import("../DatasetFilters"),
    { loading: () => <Loading /> }
);

const DatasetFiltersGuidancePanel = dynamic(
    () => import("../DatasetFilters/DatasetFiltersGuidancePanel"),
    { loading: () => <Loading /> }
);

interface CreateDatasetProps {
    formJSON?: FormHydrationSchema;
    teamId: number;
    user: AuthUser;
    defaultTeamId: number;
    schemadefs: Defs;
}

interface CreateDatasetFormProps extends Omit<CreateDatasetProps, "formJSON"> {
    formJSON: FormHydrationSchema;
}

type FormValues = Record<string, unknown>;

const SCHEMA_NAME = "CRUK";
const SCHEMA_VERSION = "1.0.0";

const getMetadata = (isDraft: boolean) =>
    isDraft
        ? "versions[0].metadata.original_metadata"
        : "versions[0].metadata.metadata";

const today = getToday();

const CreateDatasetForm = ({
    formJSON,
    teamId,
    user,
    defaultTeamId,
    schemadefs,
}: CreateDatasetFormProps) => {
    const [currentTeamId, setCurrentTeamId] = useState<number>(defaultTeamId);

    const [searchName, setSearchName] = useState("");
    const searchNameDebounced = useDebounce(searchName, 500);

    const { data: teamData, isLoading: isLoadingTeams } = useGet<Team[]>(
        `${apis.teamsSearchV1Url}?name=${searchNameDebounced}`,
        {
            shouldFetch: !!searchNameDebounced,
        }
    );

    const currentFormJSON = useMemo(() => {
        // here be dragons
        // the validation rule around urls is strict.
        // as it should be, the below question is not a user visible question, one the api populates behind the scenes..
        // localhost:3000 is not a valid url so we fail validation silently locally so we can't create datasets..
        // also if some past data contains a // like produrl//datasets/ it fails validation and the user can do nothing..
        // as this value is defaulted behind the scenes and the user has no control over it, remove the validation from the frontend.

        return {
            ...formJSON,
            schema_fields: formJSON.schema_fields ?? [],
            validation:
                formJSON.validation?.filter(
                    obj => obj != null && obj.title !== "revision url"
                ) || [],
            defaultValues: formJSON.defaultValues ?? {},
        };
    }, [formJSON]);

    const teamOptions = useMemo(() => {
        const defaultOption =
            !!currentFormJSON.defaultValues[TEAM_ID_FIELD] &&
            !!currentFormJSON.defaultValues[DATA_CUSTODIAN_NAME]
                ? {
                      value: currentFormJSON.defaultValues[TEAM_ID_FIELD],
                      label: currentFormJSON.defaultValues[DATA_CUSTODIAN_NAME],
                  }
                : {};

        if (!teamData) return defaultOption.label ? [defaultOption] : [];

        const hasOption = teamData?.some(
            data => data.id.toString() === defaultOption.value?.toString()
        );

        return [
            ...(!hasOption && defaultOption.label ? [defaultOption] : []),
            ...(teamData?.map(data => ({
                label: data.name,
                value: data.id,
            })) || []),
        ] as OptionsType[];
    }, [teamData]);

    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const params = useParams<{
        locale: string;
        teamId: string;
        datasetId: string;
    }>();
    const locale = params?.locale || RouteName.EN;

    const searchParams = useSearchParams();

    const [isDraft, setIsDraft] = useState<boolean>(
        searchParams?.get("status") === DataStatus.DRAFT
    );

    const isDuplicate = searchParams?.get("duplicate");

    const [draftToggled, setDraftToggled] = useState<boolean>();

    const isEditing = params?.datasetId;

    const [datasetId, setDatasetId] = useState<string | undefined>(
        params?.datasetId
    );

    const [finishedLoadingExisting, setFinishedLoadingExisting] =
        useState<boolean>(() => !params?.datasetId);

    const { push } = useRouter();

    const baseDatasetsUrl = `${apis.teamsV2Url}/${params?.teamId}/datasets`;

    const { data: dataset, isLoading } = useGet<Dataset>(
        searchParams?.get("status") === DataStatus.DRAFT
            ? `${baseDatasetsUrl}/${datasetId}`
            : `${baseDatasetsUrl}/${datasetId}?schema_model=${SCHEMA_NAME}&schema_version=${SCHEMA_VERSION}`,
        { shouldFetch: !!params?.teamId && !!datasetId }
    );

    const [hasError, setHasError] = useState<boolean>();
    const [existingFormData, setExistingFormData] = useState<Metadata>();
    const [structuralMetadata, setStructuralMetadata] = useState<
        StructuralMetadata[]
    >([]);
    const [datasetFilterIds, setDatasetFilterIds] = useState<Set<string>>(
        () => new Set()
    );

    const handleDatasetFilterChange = useCallback((id: string) => {
        setDatasetFilterIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const schemaFields = currentFormJSON.schema_fields ?? [];

    const defaultFormValues = {
        ...currentFormJSON.defaultValues,
        "Dataset identifier": "226fb3f1-4471-400a-8c39-2b66d46a39b6",
        "Dataset Version": "1.0.0",
        "revision version": "1.0.0",
        "revision url": "http://www.example.com/",
        team_id: defaultTeamId,
        identifier: "",
        "Metadata Issued Datetime": today,
        "Last Modified Datetime": today,
        "Name of Data Custodian": "",
        "Dataset population size": "",
        "contact point": "",
        "Contact point": "",
        "Dataset & BioSample alias": "",
        "Lead Researcher": "",
        "Lead Research Institute": "",
    };

    useEffect(() => {
        if (isLoading || !isEditing) {
            return;
        }

        if (!dataset) {
            setHasError(true);
            return;
        }

        const metadataLocation = getMetadata(isDraft);

        let latestMetadata = get(dataset, metadataLocation);

        if (isDuplicate) {
            latestMetadata = omit(latestMetadata, "summary.title");
        }

        const keywords = latestMetadata?.summary?.keywords;

        if (keywords && latestMetadata) {
            latestMetadata.summary.keywords = keywords.map(keyword =>
                decodeHtmlEntity(keyword)
            );
        }

        setStructuralMetadata(latestMetadata?.structuralMetadata?.tables || []);

        const mappedFormData = mapExistingDatasetToFormFields(
            schemaFields,
            latestMetadata
        );

        setExistingFormData(mappedFormData);
    }, [dataset, isLoading]);

    const generateValidationRules = useMemo(
        () => (validationFields: FormHydrationValidation[]) => {
            const transformedObject: Record<
                string,
                Omit<FormHydrationValidation, "title">
            > = {};

            validationFields.forEach(field => {
                const { title, items, required, of, ...rest } = field;

                if (items && Array.isArray(items)) {
                    // When field has an items array, convert to formatted object (used for field arrays)
                    transformedObject[title] = {
                        ...rest,
                        required,
                        items: formatValidationItems(items),
                    };
                } else if (of && required) {
                    // Ensure required array of enums requires at least 1 value
                    transformedObject[title] = {
                        ...rest,
                        required,
                        min: 1,
                    };
                } else {
                    transformedObject[title] = { ...rest, required };
                }
            });

            return transformedObject;
        },
        []
    );

    const [selectedFormSection, setSelectedFormSection] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [guidanceText, setGuidanceText] = useState<string>();

    const datasetVersionQuery = `input_schema=${SCHEMA_NAME}&input_version=${SCHEMA_VERSION}`;
    const postDatasetUrl = `${baseDatasetsUrl}?${datasetVersionQuery}`;

    const createDataset = usePost<NewDataset>(
        `${postDatasetUrl}?${datasetVersionQuery}`,
        {
            itemName: "Dataset",
        }
    );

    const updateDataset = usePut<NewDataset>(baseDatasetsUrl, {
        itemName: "Dataset",
    });

    const generatedYupValidation = useMemo(
        () =>
            currentFormJSON?.validation && {
                title: "Metadata form",
                type: "object",
                properties: !isDraft
                    ? generateValidationRules(currentFormJSON.validation)
                    : {},
            },
        [currentFormJSON.validation, generateValidationRules, isDraft]
    );

    const yupSchema = buildYup(generatedYupValidation);

    const methods = useForm<FormValues>({
        mode: "onTouched",
        resolver: yupResolver(yupSchema),
        defaultValues: defaultFormValues,
    });

    const {
        control,
        handleSubmit,
        watch,
        clearErrors,
        trigger,
        getValues,
        setValue,
        reset,
        formState,
    } = methods;

    const watchId = watch(TEAM_ID_FIELD);
    const watchType = watch(DATASET_TYPE);

    const {
        fields: watchDataTypeArray,
        append: datasetAppend,
        remove: datasetRemove,
    } = useFieldArray({
        control,
        name: "Dataset Type Array",
    });
    useEffect(() => {
        if (!watchType || !Array.isArray(watchType) || watchType?.length <= 0)
            return;

        const parentField = schemaFields.find(
            field => field.title === "Dataset Type Array"
        );

        const existingTypes = watchDataTypeArray.map(
            item => item["Dataset type"]
        );

        watchType.forEach(type => {
            if (!existingTypes.includes(type)) {
                const defaultValues = parentField?.fields?.reduce(acc => {
                    acc["Dataset type"] = type;
                    acc["Dataset subtypes"] = undefined;
                    return acc;
                }, {} as FieldValues);

                datasetAppend(defaultValues);
            }
        });

        watchDataTypeArray.forEach((item, index) => {
            if (!watchType.includes(item["Dataset type"])) {
                datasetRemove(index);
            }
        });
    }, [watchType, watchDataTypeArray]);

    // This is a bit of a hack
    // - the data_custodian_id is coming back as a persistent ID due to a confusing in naming/bug
    // - we need to make sure therefore that the watchId, from the form, for data custodian identifier
    //    if an identifier, and not a persistent identifier
    const watchIdIsNumber = !Number.isNaN(Number(watchId));

    useEffect(() => {
        if (!watchId || !watchIdIsNumber) return;
        setCurrentTeamId(watchId);
        setValue(TEAM_ID_FIELD, watchId);
    }, [watchId, watchIdIsNumber, setValue]);

    useEffect(() => {
        if (!isEditing) {
            setFinishedLoadingExisting(true);
            return;
        }

        if (existingFormData) {
            const dataSetTypes = defaultFormValues["Dataset type"] ?? [];
            const dataSetTypeArray =
                defaultFormValues["Dataset Type Array"] ?? [];
            // if you ask me about this i will run away from you.
            reset({
                ...defaultFormValues,
                ...existingFormData,
                "Dataset type": dataSetTypes,
                "Dataset Type Array": dataSetTypeArray,
            });
            setFinishedLoadingExisting(true);
        }
    }, [existingFormData, isEditing]);

    const formSections = useMemo(() => {
        const availableLocations = getFirstLocationValues(schemaFields).filter(
            location => {
                if (location === INITIAL_FORM_SECTION) {
                    return false;
                }
                if (location === DATASET_FILTERS_FORM_SECTION) {
                    return schemaFields.some(
                        field => field.location === location
                    );
                }
                return hasVisibleFieldsForLocation(schemaFields, location);
            }
        );

        const orderedLocations = FORM_SECTION_ORDER.filter(location =>
            availableLocations.includes(location)
        );
        const orderedSet = new Set<string>(FORM_SECTION_ORDER);
        const remainingLocations = availableLocations.filter(
            location => !orderedSet.has(location)
        );

        return [INITIAL_FORM_SECTION].concat(
            orderedLocations,
            remainingLocations
        );
    }, [schemaFields]);
    const currentSectionIndex = selectedFormSection
        ? formSections.indexOf(selectedFormSection)
        : 0;

    const visibleFieldsInSelectedSection = useMemo(() => {
        if (!selectedFormSection || currentSectionIndex <= 0) {
            return [];
        }

        return schemaFields.filter(
            schemaField =>
                !schemaField.field?.hidden &&
                schemaField.location?.startsWith(selectedFormSection)
        );
    }, [schemaFields, selectedFormSection, currentSectionIndex]);

    const hideSectionTitle = useMemo(() => {
        if (
            selectedFormSection === STRUCTURAL_METADATA_FORM_SECTION ||
            selectedFormSection === OTHER_DATA_TYPES_FORM_SECTION
        ) {
            return false;
        }

        if (visibleFieldsInSelectedSection.length !== 1) {
            return false;
        }

        const [fieldParent] = visibleFieldsInSelectedSection;

        if (fieldParent.fields?.length) {
            return false;
        }

        return getFormHydrationFieldHeaderProps(fieldParent).show;
    }, [visibleFieldsInSelectedSection, selectedFormSection]);

    const [legendItems, setLegendItems] = useState<LegendItem[]>([]);
    const [submissionRequested, setSubmissionRequested] = useState<boolean>(
        !!isEditing
    );
   

    // When form loaded - select first form section with displayed fields
    useEffect(() => {
        if (selectedFormSection) {
            return;
        }

        setSelectedFormSection(INITIAL_FORM_SECTION);
    }, [schemaFields, selectedFormSection]);

    useEffect(() => {
        const createLegendItems = async () => {
            const items = await formGenerateLegendItems(
                formSections,
                selectedFormSection,
                true,
                schemaFields,
                clearErrors,
                getValues,
                trigger,
                submissionRequested,
                formState.dirtyFields
            );
            setLegendItems(items);
        };

        createLegendItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFormSection, isDraft, existingFormData]);

    const handleLegendClick = (clickedIndex: number) => {
        setSelectedFormSection(formSections[clickedIndex]);
    };

    const [navbarHeight, setNavbarHeight] = useState<string>("0");

    // Handle form legend top offset
    useEffect(() => {
        const handleResize = () => {
            const navbar = document.getElementById(NAVBAR_ID);
            if (navbar) {
                setNavbarHeight(`${navbar?.offsetHeight}px`);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isLoading]);

    const postForm = async (formData: Metadata, saveAsDraft: boolean) => {
        setIsSaving(true);

        const mappedFormData: Partial<Metadata> = mapFormFieldsForSubmission(
            formData,
            schemaFields
        );

        const formPayload =
            isEditing && !isDuplicate
                ? {
                      ...omit(dataset, ["versions"]),
                      team_id: teamId,
                      user_id: user.id,
                      status: saveAsDraft
                          ? ("DRAFT" as DatasetStatus)
                          : ("ACTIVE" as DatasetStatus),
                      create_origin: "MANUAL" as CreateOrigin,
                      metadata: {
                          schemaModel: SCHEMA_NAME,
                          schemaVersion: SCHEMA_VERSION,
                          ...dataset?.versions[0].metadata,
                          metadata: {
                              observations: [],
                              coverage: null,
                              ...mappedFormData,
                              structuralMetadata: {
                                  ...mappedFormData.structuralMetadata,
                                  tables: structuralMetadata,
                              },
                          },
                      },
                  }
                : isDuplicate
                ? {
                      ...omit(dataset, ["id", "versions"]),
                      status: saveAsDraft
                          ? ("DRAFT" as DatasetStatus)
                          : ("ACTIVE" as DatasetStatus),
                      metadata: {
                          schemaModel: SCHEMA_NAME,
                          schemaVersion: SCHEMA_VERSION,
                          ...dataset?.versions[0].metadata,
                          metadata: {
                              observations: [],
                              coverage: null,
                              ...mappedFormData,
                              structuralMetadata: {
                                  ...mappedFormData.structuralMetadata,
                                  tables: structuralMetadata,
                              },
                          },
                      },
                  }
                : {
                      team_id: teamId,
                      user_id: user.id,
                      status: saveAsDraft
                          ? ("DRAFT" as DatasetStatus)
                          : ("ACTIVE" as DatasetStatus),
                      create_origin: "MANUAL" as CreateOrigin,
                      metadata: {
                          schemaModel: SCHEMA_NAME,
                          schemaVersion: SCHEMA_VERSION,
                          metadata: {
                              observations: [],
                              coverage: null,
                              ...mappedFormData,
                              issued: today,
                              modified: today,
                              structuralMetadata: {
                                  ...mappedFormData.structuralMetadata,
                                  tables: structuralMetadata,
                              },
                          },
                      },
                  };
        try {
            const observations = formPayload?.metadata?.metadata?.observations;
            if (Array.isArray(observations)) {
                const personObservations = observations
                    .filter(obj => obj.observedNode === "Persons")
                    .sort(
                        (a, b) =>
                            new Date(b.observationDate) -
                            new Date(a.observationDate)
                    )
                    .at(0);

                if (
                    personObservations &&
                    formPayload.metadata.metadata.summary
                ) {
                    formPayload.metadata.metadata.summary.populationSize =
                        Number(personObservations.measuredValue);
                }
            }

            // BES 11/24 Put in as a quick fix for teams with identifier < 2 characters long
            // This is very schema specific and should be removed once a schema update is made
            // to allow shorter identifiers.
            if (
                formPayload?.metadata?.metadata?.summary?.dataCustodian
                    ?.identifier.length === 1
            ) {
                formPayload.metadata.metadata.summary.dataCustodian.identifier =
                    formPayload.metadata.metadata.summary.dataCustodian.identifier.padStart(
                        2,
                        "0"
                    );
            }
            delete formPayload.metadata.metadata.datasetType;
            delete formPayload.metadata.metadata.datasetSubType;

            const formPostRequest =
                isEditing && !isDuplicate
                    ? await updateDataset(
                          params.datasetId,
                          formPayload as NewDataset
                      )
                    : await createDataset(formPayload as NewDataset);

            if (formPostRequest !== null) {
                push(
                    `/${locale}/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${
                        RouteName.DATASETS
                    }?tab=${saveAsDraft ? "DRAFT " : "ACTIVE"}`
                );
            } else {
                setIsSaving(false);

                if (formPostRequest) {
                    setDatasetId(formPostRequest as string);
                }
            }
        } catch (err) {
            setIsSaving(false);
        }
    };

    const formSubmit = (formData: Metadata, saveAsDraft: boolean) => {
        postForm(formData, saveAsDraft);
    };

    const handleFormSubmission = async (saveAsDraft: boolean) => {
        if (!saveAsDraft) {
            const formIsValid = await trigger();
            if (formIsValid) {
                handleSubmit(data => formSubmit(data, saveAsDraft))();
            } else {
                setSelectedFormSection(formSections[formSections.length - 1]);
            }
        } else {
            handleSubmit(data => formSubmit(data, saveAsDraft))();
        }
    };

    const handleMakeActive = async () => {
        setSubmissionRequested(true);
        setIsDraft(false);
        handleFormSubmission(false);
    };

    const handleSaveDraft = async () => {
        if (!isDraft) {
            setIsDraft(true);
        }

        if (!draftToggled) {
            setDraftToggled(true);
        } else {
            handleFormSubmission(true);
        }
    };

    // Handle submission after draft toggle
    useEffect(() => {
        if (isDraft === undefined) {
            setIsDraft(false);
            return;
        }

        if (!isDraft) {
            clearErrors();
        }

        if (isDraft && draftToggled) {
            handleFormSubmission(isDraft);
        }
    }, [isDraft, clearErrors, draftToggled]);

    const [optionalPercentage, setOptionalPercentage] = useState(0);
    const [requiredPercentage, setRequiredPercentage] = useState(0);

    const watchAll = watch();

    useEffect(() => {
        setOptionalPercentage(
            formGetFieldsCompletedCount(schemaFields, getValues, true)
        );
        setRequiredPercentage(
            formGetFieldsCompletedCount(schemaFields, getValues, false)
        );
    }, [getValues, schemaFields, watchAll]);

    const formatGuidance = (guidance?: string) =>
        guidance?.replaceAll("\\n", "\n");

    const getWelcomeGuidanceContent = (guidance?: string) =>
        formatGuidance(guidance)?.split("**Navigation & Workflow**")[0]?.trim();

    const updateGuidanceText = (fieldName: string, fieldArrayName?: string) => {
        const grantsGuidance = formatGuidance(
            getAssociatedProjectGrantsGuidance(schemaFields)
        );
        const summaryGuidance = formatGuidance(
            getSummarySectionGuidance(schemaFields)
        );

        if (fieldArrayName) {
            const fieldSchema = currentFormJSON.schema_fields
                .find(field => field.title === fieldArrayName)
                ?.fields?.find(field => field.title === fieldName);

            if (fieldSchema?.location?.startsWith("Associated Project Grants.")) {
                const fieldGuidance = formatGuidance(fieldSchema?.guidance);
                setGuidanceText(
                    fieldGuidance?.trim() ? fieldGuidance : grantsGuidance
                );
                return;
            }

            if (fieldArrayName === "Observations Array") {
                const sectionGuidance = formatGuidance(
                    getObservationsSectionGuidance(schemaFields)
                );
                const fieldGuidance = formatGuidance(fieldSchema?.guidance);
                setGuidanceText(
                    fieldGuidance?.trim() ? fieldGuidance : sectionGuidance
                );
                return;
            }

            setGuidanceText(formatGuidance(fieldSchema?.guidance));
            return;
        }

        const fieldSchema = currentFormJSON.schema_fields.find(
            field => field.title === fieldName
        );

        if (fieldSchema?.location?.startsWith("Associated Project Grants.")) {
            const fieldGuidance = formatGuidance(fieldSchema.guidance);
            setGuidanceText(
                fieldGuidance?.trim() ? fieldGuidance : grantsGuidance
            );
            return;
        }

        if (fieldSchema?.location?.startsWith("summary.")) {
            const fieldGuidance = formatGuidance(fieldSchema.guidance);
            setGuidanceText(
                fieldGuidance?.trim() ? fieldGuidance : summaryGuidance
            );
            return;
        }

        const documentationGuidance = formatGuidance(
            getDocumentationSectionGuidance(schemaFields)
        );

        if (fieldSchema?.location?.startsWith("documentation.")) {
            const fieldGuidance = formatGuidance(fieldSchema.guidance);
            setGuidanceText(
                fieldGuidance?.trim() ? fieldGuidance : documentationGuidance
            );
            return;
        }

        if (
            fieldSchema?.location?.startsWith(
                `${ENTITY_RELATIONSHIP_DIAGRAM_FORM_SECTION}.`
            )
        ) {
            const sectionGuidance = formatGuidance(
                schemaFields.find(
                    field =>
                        field.location ===
                        ENTITY_RELATIONSHIP_DIAGRAM_FORM_SECTION
                )?.guidance
            );
            const fieldGuidance = formatGuidance(fieldSchema.guidance);
            setGuidanceText(
                fieldGuidance?.trim() ? fieldGuidance : sectionGuidance
            );
            return;
        }

        if (fieldSchema?.location?.startsWith(`${COVERAGE_FORM_SECTION}.`)) {
            const sectionGuidance = formatGuidance(
                getCoverageSectionGuidance(schemaFields)
            );
            const fieldGuidance = formatGuidance(fieldSchema.guidance);
            setGuidanceText(
                fieldGuidance?.trim() ? fieldGuidance : sectionGuidance
            );
            return;
        }

        if (
            fieldSchema?.location?.startsWith(
                `${DATASET_TIMELINES_FORM_SECTION}.`
            )
        ) {
            const sectionGuidance = formatGuidance(
                getDatasetTimelinesSectionGuidance(schemaFields)
            );
            const fieldGuidance = formatGuidance(fieldSchema.guidance);
            setGuidanceText(
                fieldGuidance?.trim() ? fieldGuidance : sectionGuidance
            );
            return;
        }

        if (
            fieldSchema?.location?.startsWith(
                `${ACCESSIBILITY_FORM_SECTION}.`
            )
        ) {
            const sectionGuidance = formatGuidance(
                getAccessibilitySectionGuidance(schemaFields)
            );
            const fieldGuidance = formatGuidance(fieldSchema.guidance);
            setGuidanceText(
                fieldGuidance?.trim() ? fieldGuidance : sectionGuidance
            );
            return;
        }

        setGuidanceText(formatGuidance(fieldSchema?.guidance));
    };

    useEffect(() => {
        if (selectedFormSection === INITIAL_FORM_SECTION) {
            setGuidanceText(
                getWelcomeGuidanceContent(getWelcomeSectionGuidance(schemaFields))
            );
            return;
        }

        if (selectedFormSection === "Dataset Version") {
            const datasetVersionGuidance = schemaFields.find(
                field => field.title === "Dataset Version"
            )?.guidance;
            setGuidanceText(formatGuidance(datasetVersionGuidance));
            return;
        }

        if (selectedFormSection === DATASET_FILTERS_FORM_SECTION) {
            const datasetFiltersGuidance = schemaFields.find(
                field => field.title === "Dataset Filters"
            )?.guidance;
            setGuidanceText(formatGuidance(datasetFiltersGuidance));
            return;
        }

        if (selectedFormSection === STRUCTURAL_METADATA_FORM_SECTION) {
            const structuralMetadataGuidance = schemaFields.find(
                field => field.location === STRUCTURAL_METADATA_FORM_SECTION
            )?.guidance;
            setGuidanceText(formatGuidance(structuralMetadataGuidance));
            return;
        }

        if (selectedFormSection === OTHER_DATA_TYPES_FORM_SECTION) {
            const otherDataTypesGuidance = schemaFields.find(
                field => field.location === "Other.data.types"
            )?.guidance;
            setGuidanceText(formatGuidance(otherDataTypesGuidance));
            return;
        }

        if (selectedFormSection === ENTITY_RELATIONSHIP_DIAGRAM_FORM_SECTION) {
            const entityRelationshipDiagramGuidance = schemaFields.find(
                field => field.location === ENTITY_RELATIONSHIP_DIAGRAM_FORM_SECTION
            )?.guidance;
            setGuidanceText(formatGuidance(entityRelationshipDiagramGuidance));
            return;
        }

        if (selectedFormSection === COVERAGE_FORM_SECTION) {
            setGuidanceText(
                formatGuidance(getCoverageSectionGuidance(schemaFields))
            );
            return;
        }

        if (selectedFormSection === DATASET_TIMELINES_FORM_SECTION) {
            setGuidanceText(
                formatGuidance(getDatasetTimelinesSectionGuidance(schemaFields))
            );
            return;
        }

        if (selectedFormSection === ACCESSIBILITY_FORM_SECTION) {
            setGuidanceText(
                formatGuidance(getAccessibilitySectionGuidance(schemaFields))
            );
            return;
        }

        if (selectedFormSection === TOOLS_AND_PUBLICATIONS_FORM_SECTION) {
            setGuidanceText(
                formatGuidance(
                    getToolsAndPublicationsSectionGuidance(schemaFields)
                )
            );
            return;
        }

        if (selectedFormSection === OBSERVATIONS_FORM_SECTION) {
            setGuidanceText(
                formatGuidance(getObservationsSectionGuidance(schemaFields))
            );
            return;
        }

        if (selectedFormSection === DEMOGRAPHIC_FREQUENCY_FORM_SECTION) {
            setGuidanceText(
                formatGuidance(
                    getDemographicFrequencySectionGuidance(schemaFields)
                )
            );
            return;
        }

        if (selectedFormSection === OMICS_FORM_SECTION) {
            setGuidanceText(
                formatGuidance(getOmicsSectionGuidance(schemaFields))
            );
            return;
        }

        if (selectedFormSection === "Associated Project Grants") {
            setGuidanceText(
                formatGuidance(getAssociatedProjectGrantsGuidance(schemaFields))
            );
            return;
        }

        if (selectedFormSection === "summary") {
            setGuidanceText(
                formatGuidance(getSummarySectionGuidance(schemaFields))
            );
            return;
        }

        if (selectedFormSection === "documentation") {
            setGuidanceText(
                formatGuidance(getDocumentationSectionGuidance(schemaFields))
            );
        }
    }, [selectedFormSection, schemaFields]);

    const isStructuralMetadataSection =
        selectedFormSection === STRUCTURAL_METADATA_FORM_SECTION;

    const isOtherDataTypesSection =
        selectedFormSection === OTHER_DATA_TYPES_FORM_SECTION;

    const isToolsAndPublicationsSection =
        selectedFormSection === TOOLS_AND_PUBLICATIONS_FORM_SECTION;

    const isObservationsSection =
        selectedFormSection === OBSERVATIONS_FORM_SECTION;

    const isDemographicFrequencySection =
        selectedFormSection === DEMOGRAPHIC_FREQUENCY_FORM_SECTION;

    const isOmicsSection = selectedFormSection === OMICS_FORM_SECTION;

    const structuralMetadataSection = useMemo(
        () =>
            schemaFields.find(
                field => field.location === STRUCTURAL_METADATA_FORM_SECTION
            ),
        [schemaFields]
    );

    const otherDataTypesSection = useMemo(
        () =>
            schemaFields.find(field => field.location === "Other.data.types"),
        [schemaFields]
    );

    const datasetTimelinesSection = useMemo(
        () =>
            schemaFields.find(
                field => field.location === DATASET_TIMELINES_FORM_SECTION
            ),
        [schemaFields]
    );

    const structuralMetadataUploadSection = useMemo(
        () =>
            schemaFields.find(
                field => field.location === "structuralMetadata.upload"
            ),
        [schemaFields]
    );

    const structuralMetadataReviewSection = useMemo(
        () =>
            schemaFields.find(
                field => field.location === "structuralMetadata.review"
            ),
        [schemaFields]
    );

    const isDatasetFiltersSection =
        selectedFormSection === DATASET_FILTERS_FORM_SECTION;

    const summarySectionHeader = useMemo(
        () => getSummarySectionHeaderProps(schemaFields),
        [schemaFields]
    );

    const documentationSectionHeader = useMemo(
        () => getDocumentationSectionHeaderProps(schemaFields),
        [schemaFields]
    );

    const entityRelationshipDiagramSectionHeader = useMemo(
        () => getEntityRelationshipDiagramSectionHeaderProps(schemaFields),
        [schemaFields]
    );

    const coverageSectionHeader = useMemo(
        () => getCoverageSectionHeaderProps(schemaFields),
        [schemaFields]
    );

    const accessibilitySectionHeader = useMemo(
        () => getAccessibilitySectionHeaderProps(schemaFields),
        [schemaFields]
    );

    const toolsAndPublicationsSectionHeader = useMemo(
        () => getToolsAndPublicationsSectionHeaderProps(schemaFields),
        [schemaFields]
    );

    const observationsSectionHeader = useMemo(
        () => getObservationsSectionHeaderProps(schemaFields),
        [schemaFields]
    );

    const demographicFrequencySectionHeader = useMemo(
        () => getDemographicFrequencySectionHeaderProps(schemaFields),
        [schemaFields]
    );

    const omicsSectionHeader = useMemo(
        () => getOmicsSectionHeaderProps(schemaFields),
        [schemaFields]
    );

    const visibleAccessibilitySectionFields = useMemo(() => {
        if (selectedFormSection !== ACCESSIBILITY_FORM_SECTION) {
            return null;
        }

        const visible = schemaFields.filter(
            schemaField =>
                !schemaField.field?.hidden &&
                schemaField.location?.startsWith(
                    `${ACCESSIBILITY_FORM_SECTION}.`
                )
        );

        return {
            usage: visible.filter(field =>
                field.location?.startsWith("accessibility.usage.")
            ),
            access: visible.filter(field =>
                field.location?.startsWith("accessibility.access.")
            ),
            formatAndStandards: visible.filter(field =>
                field.location?.startsWith(
                    "accessibility.formatAndStandards."
                )
            ),
        };
    }, [schemaFields, selectedFormSection]);

    const visibleSummarySectionFields = useMemo(() => {
        if (selectedFormSection !== "summary") {
            return null;
        }

        const visible = schemaFields.filter(
            schemaField =>
                !schemaField.field?.hidden &&
                schemaField.location?.startsWith("summary") &&
                schemaField.location !== "summary"
        );

        const beforeCustodian: typeof visible = [];
        const dataCustodian: typeof visible = [];
        const afterCustodian: typeof visible = [];
        let seenCustodianAccordion = false;

        visible.forEach(field => {
            if (isSummaryDataCustodianAccordionField(field.location)) {
                dataCustodian.push(field);
                seenCustodianAccordion = true;
                return;
            }

            if (!seenCustodianAccordion) {
                beforeCustodian.push(field);
            } else {
                afterCustodian.push(field);
            }
        });

        return {
            beforeCustodian,
            dataCustodian,
            afterCustodian,
        };
    }, [schemaFields, selectedFormSection]);

    const visibleDocumentationSectionFields = useMemo(() => {
        if (selectedFormSection !== "documentation") {
            return null;
        }

        const visible = schemaFields.filter(
            schemaField =>
                !schemaField.field?.hidden &&
                schemaField.location?.startsWith("documentation.") &&
                schemaField.location !== "documentation"
        );

        const beforeAccordion: typeof visible = [];
        const accordion: typeof visible = [];
        const afterAccordion: typeof visible = [];

        visible.forEach(field => {
            if (isDocumentationStandaloneAccordionField(field.location)) {
                accordion.push(field);
                return;
            }

            if (accordion.length === 0) {
                beforeAccordion.push(field);
            } else {
                afterAccordion.push(field);
            }
        });

        return {
            beforeAccordion,
            accordion,
            afterAccordion,
        };
    }, [schemaFields, selectedFormSection]);

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty,
        onSuccess: handleSaveDraft,
        modalProps: {
            cancelText: t("discardChanges"),
            confirmText: t("saveAsDraft"),
            title: t("confirmSave"),
            content: "",
        },
    });

    if ((isEditing && isLoading) || !finishedLoadingExisting) {
        return <Loading />;
    }

    if (hasError) {
        return (
            <Box>
                <Typography variant="h2">{t("errorLoading")}</Typography>
            </Box>
        );
    }

    const handleOnUserInputChange = (e: React.ChangeEvent, value: string) => {
        if (value === "") {
            setSearchName(value);
            return;
        }
        if (e?.type !== "change") {
            return;
        }
        setSearchName(value);
    };

    return (
        <>
            <Link
                href={`/${locale}/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${
                    RouteName.DATASETS
                }?tab=${isDraft ? "DRAFT " : "ACTIVE"}`}
                underline="hover"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pb: 0.5,
                    pl: 2,
                }}>
                <ArrowBackIosNewIcon fontSize="small" />
                {t("backToManagementPage")}
            </Link>

            <FormBanner
                makeActiveAction={handleMakeActive}
                saveAsDraftAction={handleSaveDraft}
                completionPercentage={requiredPercentage}
                optionalPercentage={optionalPercentage}
                actionButtonsEnabled={!isSaving}
            />

            <Box sx={{ display: "flex", flexDirection: "row", p: 0 }}>
                <Box sx={{ flex: 1, p: 0 }}>
                    <Paper
                        sx={{
                            mt: 1.25,
                            mb: 1.25,
                            p: 2,
                            backgroundColor: "white",
                        }}>
                        <FormLegend
                            title={t("metadataSections")}
                            items={legendItems}
                            handleClickItem={handleLegendClick}
                            offsetTop={navbarHeight}
                        />
                    </Paper>
                </Box>

                {currentSectionIndex === 0 && (
                    <>
                        <IntroScreen
                            teamId={teamId}
                            teamOptions={teamOptions}
                            handleOnUserInputChange={handleOnUserInputChange}
                            setDataCustodian={(value: number) =>
                                setValue(TEAM_ID_FIELD, value)
                            }
                            defaultTeamId={currentTeamId}
                            isLoadingTeams={isLoadingTeams}
                        />
                        <Paper
                            sx={{
                                flex: 1,
                                mt: 1.25,
                                mb: 1.25,
                                p: 2,
                                backgroundColor: "white",
                                wordBreak: "break-word",
                            }}>
                            <Typography variant="h2">
                                {t("guidance")}
                            </Typography>

                            {guidanceText && (
                                <MarkDownSanitizedWithHtml
                                    content={guidanceText}
                                />
                            )}
                            <WelcomeGuidanceNavigation />
                        </Paper>
                    </>
                )}

                {currentSectionIndex < formSections.length - 1 &&
                currentSectionIndex > 0 ? (
                    <>
                        <Box sx={{ flex: 2, p: 0 }}>
                            <FormProvider {...methods}>
                                <Form>
                                    <Paper
                                        sx={{
                                            mt: 1.25,
                                            mb: 1.25,
                                            p: 2,
                                            backgroundColor: "white",
                                        }}>
                                        {!hideSectionTitle &&
                                            !isDatasetFiltersSection &&
                                            (summarySectionHeader?.show &&
                                            selectedFormSection === "summary" ? (
                                                <FormHydrationFieldHeader
                                                    title={
                                                        summarySectionHeader.title
                                                    }
                                                    description={
                                                        summarySectionHeader.description
                                                    }
                                                />
                                            ) : documentationSectionHeader?.show &&
                                              selectedFormSection ===
                                                  "documentation" ? (
                                                <FormHydrationFieldHeader
                                                    title={
                                                        documentationSectionHeader.title
                                                    }
                                                    description={
                                                        documentationSectionHeader.description
                                                    }
                                                />
                                            ) : entityRelationshipDiagramSectionHeader?.show &&
                                              selectedFormSection ===
                                                  ENTITY_RELATIONSHIP_DIAGRAM_FORM_SECTION ? (
                                                <FormHydrationFieldHeader
                                                    title={
                                                        entityRelationshipDiagramSectionHeader.title
                                                    }
                                                    description={
                                                        entityRelationshipDiagramSectionHeader.description
                                                    }
                                                />
                                            ) : coverageSectionHeader?.show &&
                                              selectedFormSection ===
                                                  COVERAGE_FORM_SECTION ? (
                                                <FormHydrationFieldHeader
                                                    title={
                                                        coverageSectionHeader.title
                                                    }
                                                    description={
                                                        coverageSectionHeader.description
                                                    }
                                                />
                                            ) : accessibilitySectionHeader?.show &&
                                              selectedFormSection ===
                                                  ACCESSIBILITY_FORM_SECTION ? (
                                                <FormHydrationFieldHeader
                                                    title={
                                                        accessibilitySectionHeader.title
                                                    }
                                                    description={
                                                        accessibilitySectionHeader.description
                                                    }
                                                />
                                            ) : toolsAndPublicationsSectionHeader?.show &&
                                              selectedFormSection ===
                                                  TOOLS_AND_PUBLICATIONS_FORM_SECTION ? (
                                                <FormHydrationFieldHeader
                                                    title={
                                                        toolsAndPublicationsSectionHeader.title
                                                    }
                                                    description={
                                                        toolsAndPublicationsSectionHeader.description
                                                    }
                                                />
                                            ) : observationsSectionHeader?.show &&
                                              selectedFormSection ===
                                                  OBSERVATIONS_FORM_SECTION ? (
                                                <FormHydrationFieldHeader
                                                    title={
                                                        observationsSectionHeader.title
                                                    }
                                                    description={
                                                        observationsSectionHeader.description
                                                    }
                                                />
                                            ) : demographicFrequencySectionHeader?.show &&
                                              selectedFormSection ===
                                                  DEMOGRAPHIC_FREQUENCY_FORM_SECTION ? (
                                                <FormHydrationFieldHeader
                                                    title={
                                                        demographicFrequencySectionHeader.title
                                                    }
                                                    description={
                                                        demographicFrequencySectionHeader.description
                                                    }
                                                />
                                            ) : omicsSectionHeader?.show &&
                                              selectedFormSection ===
                                                  OMICS_FORM_SECTION ? (
                                                <FormHydrationFieldHeader
                                                    title={
                                                        omicsSectionHeader.title
                                                    }
                                                    description={
                                                        omicsSectionHeader.description
                                                    }
                                                />
                                            ) : (
                                                <Typography
                                                    variant="h2"
                                                    sx={
                                                        isStructuralMetadataSection ||
                                                        isOtherDataTypesSection
                                                            ? { mb: 2 }
                                                            : undefined
                                                    }>
                                                    {isStructuralMetadataSection &&
                                                    structuralMetadataSection?.title
                                                        ? structuralMetadataSection.title
                                                        : isOtherDataTypesSection &&
                                                            otherDataTypesSection?.title
                                                          ? otherDataTypesSection.title
                                                          : selectedFormSection ===
                                                              DATASET_TIMELINES_FORM_SECTION &&
                                                              datasetTimelinesSection?.title
                                                            ? datasetTimelinesSection.title
                                                            : selectedFormSection ===
                                                                "Associated Project Grants"
                                                              ? schemaFields.find(
                                                                    field =>
                                                                        field.location ===
                                                                        "Associated Project Grants"
                                                                )?.title ||
                                                                "Project"
                                                              : capitalise(
                                                                    splitCamelcase(
                                                                        selectedFormSection
                                                                    )
                                                                )}
                                                </Typography>
                                            ))}

                                        {isOtherDataTypesSection && (
                                            <Divider
                                                sx={{
                                                    mb: 2,
                                                    borderColor: colors.grey300,
                                                }}
                                            />
                                        )}

                                        {isDatasetFiltersSection && (
                                            <DatasetFiltersSection
                                                selectedFilters={
                                                    datasetFilterIds
                                                }
                                                onFilterChange={
                                                    handleDatasetFilterChange
                                                }
                                            />
                                        )}

                                        {isStructuralMetadataSection && (
                                            <StructuralMetadataSection
                                                structuralMetadata={
                                                    structuralMetadata
                                                }
                                                uploadTitle={
                                                    structuralMetadataUploadSection?.title
                                                }
                                                uploadIntro={
                                                    structuralMetadataUploadSection?.description?.replaceAll(
                                                        "\\n",
                                                        "\n"
                                                    ) ?? undefined
                                                }
                                                reviewTitle={
                                                    structuralMetadataReviewSection?.title
                                                }
                                                reviewIntro={
                                                    structuralMetadataReviewSection?.description?.replaceAll(
                                                        "\\n",
                                                        "\n"
                                                    ) ?? undefined
                                                }
                                                fileProcessedAction={(
                                                    metadata: StructuralMetadata[]
                                                ) => {
                                                    notificationService.apiSuccess(
                                                        t("uploadSuccess")
                                                    );
                                                    setStructuralMetadata(
                                                        metadata
                                                    );
                                                }}
                                                onMetadataChange={
                                                    setStructuralMetadata
                                                }
                                                handleToggleUploading={
                                                    setIsSaving
                                                }
                                            />
                                        )}

                                        {currentSectionIndex > 0 &&
                                            !isDatasetFiltersSection &&
                                            !isStructuralMetadataSection && (
                                            <Box sx={{ p: 0 }}>
                                                {selectedFormSection ===
                                                    "summary" &&
                                                visibleSummarySectionFields ? (
                                                    <>
                                                        {visibleSummarySectionFields.beforeCustodian.map(
                                                            (fieldParent, index) => (
                                                                <FormHydrationFieldItem
                                                                    key={`${fieldParent.location}-${index}`}
                                                                    fieldParent={
                                                                        fieldParent
                                                                    }
                                                                    selectedFormSection={
                                                                        selectedFormSection
                                                                    }
                                                                    index={index}
                                                                    control={control}
                                                                    schemadefs={
                                                                        schemadefs
                                                                    }
                                                                    getValues={getValues}
                                                                    updateGuidanceText={
                                                                        updateGuidanceText
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                        {visibleSummarySectionFields
                                                            .dataCustodian.length >
                                                            0 && (
                                                            <FormHydrationAccordionSection title="Dataset Custodian">
                                                                {visibleSummarySectionFields.dataCustodian.map(
                                                                    (
                                                                        fieldParent,
                                                                        index
                                                                    ) => (
                                                                        <FormHydrationFieldItem
                                                                            key={`${fieldParent.location}-${index}`}
                                                                            fieldParent={
                                                                                fieldParent
                                                                            }
                                                                            selectedFormSection={
                                                                                selectedFormSection
                                                                            }
                                                                            index={
                                                                                index
                                                                            }
                                                                            control={
                                                                                control
                                                                            }
                                                                            schemadefs={
                                                                                schemadefs
                                                                            }
                                                                            getValues={
                                                                                getValues
                                                                            }
                                                                            updateGuidanceText={
                                                                                updateGuidanceText
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </FormHydrationAccordionSection>
                                                        )}
                                                        {visibleSummarySectionFields.afterCustodian.map(
                                                            (fieldParent, index) =>
                                                                isSummaryStandaloneAccordionField(
                                                                    fieldParent.location
                                                                ) ? (
                                                                    <FormHydrationAccordionSection
                                                                        key={`${fieldParent.location}-${index}`}
                                                                        title={
                                                                            fieldParent.title
                                                                        }>
                                                                        <FormHydrationFieldItem
                                                                            fieldParent={
                                                                                fieldParent
                                                                            }
                                                                            selectedFormSection={
                                                                                selectedFormSection
                                                                            }
                                                                            index={index}
                                                                            control={control}
                                                                            schemadefs={
                                                                                schemadefs
                                                                            }
                                                                            getValues={
                                                                                getValues
                                                                            }
                                                                            updateGuidanceText={
                                                                                updateGuidanceText
                                                                            }
                                                                        />
                                                                    </FormHydrationAccordionSection>
                                                                ) : (
                                                                    <FormHydrationFieldItem
                                                                        key={`${fieldParent.location}-${index}`}
                                                                        fieldParent={
                                                                            fieldParent
                                                                        }
                                                                        selectedFormSection={
                                                                            selectedFormSection
                                                                        }
                                                                        index={index}
                                                                        control={control}
                                                                        schemadefs={
                                                                            schemadefs
                                                                        }
                                                                        getValues={getValues}
                                                                        updateGuidanceText={
                                                                            updateGuidanceText
                                                                        }
                                                                    />
                                                                )
                                                        )}
                                                    </>
                                                ) : selectedFormSection ===
                                                      "documentation" &&
                                                  visibleDocumentationSectionFields ? (
                                                    <>
                                                        {visibleDocumentationSectionFields.beforeAccordion.map(
                                                            (
                                                                fieldParent,
                                                                index
                                                            ) => (
                                                                <FormHydrationFieldItem
                                                                    key={`${fieldParent.location}-${index}`}
                                                                    fieldParent={
                                                                        fieldParent
                                                                    }
                                                                    selectedFormSection={
                                                                        selectedFormSection
                                                                    }
                                                                    index={index}
                                                                    control={
                                                                        control
                                                                    }
                                                                    schemadefs={
                                                                        schemadefs
                                                                    }
                                                                    getValues={
                                                                        getValues
                                                                    }
                                                                    updateGuidanceText={
                                                                        updateGuidanceText
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                        {visibleDocumentationSectionFields.accordion.map(
                                                            (
                                                                fieldParent,
                                                                index
                                                            ) => (
                                                                <FormHydrationAccordionSection
                                                                    key={`${fieldParent.location}-${index}`}
                                                                    title={
                                                                        fieldParent.title
                                                                    }>
                                                                    <FormHydrationFieldItem
                                                                        fieldParent={
                                                                            fieldParent
                                                                        }
                                                                        selectedFormSection={
                                                                            selectedFormSection
                                                                        }
                                                                        index={
                                                                            index
                                                                        }
                                                                        control={
                                                                            control
                                                                        }
                                                                        schemadefs={
                                                                            schemadefs
                                                                        }
                                                                        getValues={
                                                                            getValues
                                                                        }
                                                                        updateGuidanceText={
                                                                            updateGuidanceText
                                                                        }
                                                                    />
                                                                </FormHydrationAccordionSection>
                                                            )
                                                        )}
                                                        {visibleDocumentationSectionFields.afterAccordion.map(
                                                            (
                                                                fieldParent,
                                                                index
                                                            ) => (
                                                                <FormHydrationFieldItem
                                                                    key={`${fieldParent.location}-${index}`}
                                                                    fieldParent={
                                                                        fieldParent
                                                                    }
                                                                    selectedFormSection={
                                                                        selectedFormSection
                                                                    }
                                                                    index={index}
                                                                    control={
                                                                        control
                                                                    }
                                                                    schemadefs={
                                                                        schemadefs
                                                                    }
                                                                    getValues={
                                                                        getValues
                                                                    }
                                                                    updateGuidanceText={
                                                                        updateGuidanceText
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </>
                                                ) : isToolsAndPublicationsSection ? (
                                                    schemaFields
                                                        .filter(
                                                            schemaField =>
                                                                !schemaField
                                                                    .field
                                                                    ?.hidden
                                                        )
                                                        .filter(
                                                            ({ location }) =>
                                                                location?.startsWith(
                                                                    selectedFormSection
                                                                )
                                                        )
                                                        .map(
                                                            (
                                                                fieldParent,
                                                                index
                                                            ) => (
                                                                <Paper
                                                                    key={`${fieldParent.location}-${index}`}
                                                                    sx={{
                                                                        p: 2,
                                                                        mb: 2,
                                                                        border: `1px solid ${colors.grey300}`,
                                                                        borderRadius: 1,
                                                                        boxShadow:
                                                                            "none",
                                                                        backgroundColor:
                                                                            "#F0F2F5",
                                                                    }}>
                                                                    <FormHydrationAccordionSection
                                                                        title={
                                                                            fieldParent.is_array_form
                                                                                ? fieldParent.title.replace(
                                                                                      " Array",
                                                                                      ""
                                                                                  )
                                                                                : fieldParent.title
                                                                        }
                                                                        description={
                                                                            fieldParent.description
                                                                        }
                                                                        sx={{
                                                                            mb: 0,
                                                                        }}>
                                                                        <FormHydrationFieldItem
                                                                            fieldParent={
                                                                                fieldParent
                                                                            }
                                                                            selectedFormSection={
                                                                                selectedFormSection
                                                                            }
                                                                            index={
                                                                                index
                                                                            }
                                                                            control={
                                                                                control
                                                                            }
                                                                            schemadefs={
                                                                                schemadefs
                                                                            }
                                                                            getValues={
                                                                                getValues
                                                                            }
                                                                            updateGuidanceText={
                                                                                updateGuidanceText
                                                                            }
                                                                            hideGroupTitle
                                                                            hideArrayMutators={
                                                                                fieldParent.is_array_form
                                                                            }
                                                                            useFieldPanels={
                                                                                fieldParent.is_array_form
                                                                            }
                                                                        />
                                                                    </FormHydrationAccordionSection>
                                                                </Paper>
                                                            )
                                                        )
                                                ) : isObservationsSection ? (
                                                    schemaFields
                                                        .filter(
                                                            schemaField =>
                                                                !schemaField
                                                                    .field
                                                                    ?.hidden
                                                        )
                                                        .filter(
                                                            ({ location }) =>
                                                                location?.startsWith(
                                                                    selectedFormSection
                                                                )
                                                        )
                                                        .map(
                                                            (
                                                                fieldParent,
                                                                index
                                                            ) => (
                                                                <Paper
                                                                    key={`${fieldParent.location}-${index}`}
                                                                    sx={{
                                                                        p: 2,
                                                                        mb: 2,
                                                                        border: `1px solid ${colors.grey300}`,
                                                                        borderRadius: 1,
                                                                        boxShadow:
                                                                            "none",
                                                                        backgroundColor:
                                                                            "#F0F2F5",
                                                                    }}>
                                                                    <FormHydrationAccordionSection
                                                                        title={fieldParent.title.replace(
                                                                            " Array",
                                                                            ""
                                                                        )}
                                                                        description={
                                                                            fieldParent.description
                                                                        }
                                                                        sx={{
                                                                            mb: 0,
                                                                        }}>
                                                                        <FormHydrationFieldItem
                                                                            fieldParent={
                                                                                fieldParent
                                                                            }
                                                                            selectedFormSection={
                                                                                selectedFormSection
                                                                            }
                                                                            index={
                                                                                index
                                                                            }
                                                                            control={
                                                                                control
                                                                            }
                                                                            schemadefs={
                                                                                schemadefs
                                                                            }
                                                                            getValues={
                                                                                getValues
                                                                            }
                                                                            updateGuidanceText={
                                                                                updateGuidanceText
                                                                            }
                                                                            hideGroupTitle
                                                                            hideArrayMutators
                                                                            useFieldPanels
                                                                        />
                                                                    </FormHydrationAccordionSection>
                                                                </Paper>
                                                            )
                                                        )
                                                ) : isDemographicFrequencySection ? (
                                                    schemaFields
                                                        .filter(
                                                            schemaField =>
                                                                !schemaField
                                                                    .field
                                                                    ?.hidden
                                                        )
                                                        .filter(
                                                            ({ location }) =>
                                                                location?.startsWith(
                                                                    selectedFormSection
                                                                ) &&
                                                                location !==
                                                                    DEMOGRAPHIC_FREQUENCY_FORM_SECTION &&
                                                                location !==
                                                                    "demographicFrequency.age" &&
                                                                location !==
                                                                    "demographicFrequency.disease"
                                                        )
                                                        .map(
                                                            (
                                                                fieldParent,
                                                                index
                                                            ) => {
                                                                const isBreakdown =
                                                                    isDemographicBreakdownArray(
                                                                        fieldParent.location
                                                                    );

                                                                return (
                                                                    <Paper
                                                                        key={`${fieldParent.location}-${index}`}
                                                                        sx={{
                                                                            p: 2,
                                                                            mb: 2,
                                                                            border: `1px solid ${colors.grey300}`,
                                                                            borderRadius: 1,
                                                                            boxShadow:
                                                                                "none",
                                                                            backgroundColor:
                                                                                isBreakdown
                                                                                    ? "#F0F2F5"
                                                                                    : "background.paper",
                                                                        }}>
                                                                        {isBreakdown ? (
                                                                            <FormHydrationStaticSection
                                                                                title={fieldParent.title.replace(
                                                                                    " Array",
                                                                                    ""
                                                                                )}
                                                                                sx={{
                                                                                    mb: 0,
                                                                                }}>
                                                                                <FormHydrationFieldItem
                                                                                    fieldParent={
                                                                                        fieldParent
                                                                                    }
                                                                                    selectedFormSection={
                                                                                        selectedFormSection
                                                                                    }
                                                                                    index={
                                                                                        index
                                                                                    }
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    schemadefs={
                                                                                        schemadefs
                                                                                    }
                                                                                    getValues={
                                                                                        getValues
                                                                                    }
                                                                                    updateGuidanceText={
                                                                                        updateGuidanceText
                                                                                    }
                                                                                    hideGroupTitle
                                                                                    hideArrayMutators
                                                                                    useBreakdownLayout
                                                                                    breakdownFootnote={
                                                                                        fieldParent.location ===
                                                                                        "demographicFrequency.ethnicity"
                                                                                            ? "* Leave blank if the count is zero or unknown."
                                                                                            : undefined
                                                                                    }
                                                                                />
                                                                            </FormHydrationStaticSection>
                                                                        ) : (
                                                                            <FormHydrationAccordionSection
                                                                                title={fieldParent.title.replace(
                                                                                    " Array",
                                                                                    ""
                                                                                )}
                                                                                sx={{
                                                                                    mb: 0,
                                                                                }}>
                                                                                <FormHydrationFieldItem
                                                                                    fieldParent={
                                                                                        fieldParent
                                                                                    }
                                                                                    selectedFormSection={
                                                                                        selectedFormSection
                                                                                    }
                                                                                    index={
                                                                                        index
                                                                                    }
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    schemadefs={
                                                                                        schemadefs
                                                                                    }
                                                                                    getValues={
                                                                                        getValues
                                                                                    }
                                                                                    updateGuidanceText={
                                                                                        updateGuidanceText
                                                                                    }
                                                                                    hideGroupTitle
                                                                                    useFieldPanels
                                                                                />
                                                                            </FormHydrationAccordionSection>
                                                                        )}
                                                                    </Paper>
                                                                );
                                                            }
                                                        )
                                                ) : isOmicsSection ? (
                                                    schemaFields
                                                        .filter(
                                                            schemaField =>
                                                                !schemaField
                                                                    .field
                                                                    ?.hidden
                                                        )
                                                        .filter(
                                                            ({ location }) =>
                                                                location?.startsWith(
                                                                    selectedFormSection
                                                                ) &&
                                                                location !==
                                                                    OMICS_FORM_SECTION
                                                        )
                                                        .map(
                                                            (
                                                                fieldParent,
                                                                index
                                                            ) => (
                                                                <FormHydrationFieldItem
                                                                    key={`${fieldParent.location}-${index}`}
                                                                    fieldParent={
                                                                        fieldParent
                                                                    }
                                                                    selectedFormSection={
                                                                        selectedFormSection
                                                                    }
                                                                    index={
                                                                        index
                                                                    }
                                                                    control={
                                                                        control
                                                                    }
                                                                    schemadefs={
                                                                        schemadefs
                                                                    }
                                                                    getValues={
                                                                        getValues
                                                                    }
                                                                    updateGuidanceText={
                                                                        updateGuidanceText
                                                                    }
                                                                />
                                                            )
                                                        )
                                                ) : isOtherDataTypesSection ? (
                                                    schemaFields
                                                        .filter(
                                                            schemaField =>
                                                                !schemaField
                                                                    .field
                                                                    ?.hidden
                                                        )
                                                        .filter(
                                                            ({ location }) =>
                                                                location?.startsWith(
                                                                    selectedFormSection
                                                                )
                                                        )
                                                        .map(
                                                            (
                                                                fieldParent,
                                                                index
                                                            ) =>
                                                                fieldParent.is_array_form ? (
                                                                    <Paper
                                                                        key={`${fieldParent.location}-${index}`}
                                                                        sx={{
                                                                            p: 2,
                                                                            mb: 0,
                                                                            border: `1px solid ${colors.grey300}`,
                                                                            borderRadius: 1,
                                                                            boxShadow:
                                                                                "none",
                                                                            backgroundColor:
                                                                                "#F0F2F5",
                                                                        }}>
                                                                        <FormHydrationAccordionSection
                                                                            title={fieldParent.title.replace(
                                                                                " Array",
                                                                                ""
                                                                            )}
                                                                            sx={{ mb: 0 }}>
                                                                            <FormHydrationFieldItem
                                                                                fieldParent={
                                                                                    fieldParent
                                                                                }
                                                                                selectedFormSection={
                                                                                    selectedFormSection
                                                                                }
                                                                                index={
                                                                                    index
                                                                                }
                                                                                control={
                                                                                    control
                                                                                }
                                                                                schemadefs={
                                                                                    schemadefs
                                                                                }
                                                                                getValues={
                                                                                    getValues
                                                                                }
                                                                                updateGuidanceText={
                                                                                    updateGuidanceText
                                                                                }
                                                                                hideGroupTitle
                                                                                hideArrayMutators
                                                                                useFieldPanels
                                                                            />
                                                                        </FormHydrationAccordionSection>
                                                                    </Paper>
                                                                ) : (
                                                                    <FormHydrationFieldItem
                                                                        key={`${fieldParent.location}-${index}`}
                                                                        fieldParent={
                                                                            fieldParent
                                                                        }
                                                                        selectedFormSection={
                                                                            selectedFormSection
                                                                        }
                                                                        index={
                                                                            index
                                                                        }
                                                                        control={
                                                                            control
                                                                        }
                                                                        schemadefs={
                                                                            schemadefs
                                                                        }
                                                                        getValues={
                                                                            getValues
                                                                        }
                                                                        updateGuidanceText={
                                                                            updateGuidanceText
                                                                        }
                                                                    />
                                                                )
                                                        )
                                                ) : visibleAccessibilitySectionFields ? (
                                                    <>
                                                        {visibleAccessibilitySectionFields
                                                            .usage.length > 0 && (
                                                            <FormHydrationAccordionSection title="Usage">
                                                                {visibleAccessibilitySectionFields.usage.map(
                                                                    (
                                                                        fieldParent,
                                                                        index
                                                                    ) => (
                                                                        <FormHydrationFieldItem
                                                                            key={`${fieldParent.location}-${index}`}
                                                                            fieldParent={
                                                                                fieldParent
                                                                            }
                                                                            selectedFormSection={
                                                                                selectedFormSection
                                                                            }
                                                                            index={
                                                                                index
                                                                            }
                                                                            control={
                                                                                control
                                                                            }
                                                                            schemadefs={
                                                                                schemadefs
                                                                            }
                                                                            getValues={
                                                                                getValues
                                                                            }
                                                                            updateGuidanceText={
                                                                                updateGuidanceText
                                                                            }
                                                                            useFieldPanels
                                                                        />
                                                                    )
                                                                )}
                                                            </FormHydrationAccordionSection>
                                                        )}
                                                        {visibleAccessibilitySectionFields
                                                            .access.length > 0 && (
                                                            <FormHydrationAccordionSection title="Access">
                                                                {visibleAccessibilitySectionFields.access.map(
                                                                    (
                                                                        fieldParent,
                                                                        index
                                                                    ) => (
                                                                        <FormHydrationFieldItem
                                                                            key={`${fieldParent.location}-${index}`}
                                                                            fieldParent={
                                                                                fieldParent
                                                                            }
                                                                            selectedFormSection={
                                                                                selectedFormSection
                                                                            }
                                                                            index={
                                                                                index
                                                                            }
                                                                            control={
                                                                                control
                                                                            }
                                                                            schemadefs={
                                                                                schemadefs
                                                                            }
                                                                            getValues={
                                                                                getValues
                                                                            }
                                                                            updateGuidanceText={
                                                                                updateGuidanceText
                                                                            }
                                                                            useFieldPanels
                                                                        />
                                                                    )
                                                                )}
                                                            </FormHydrationAccordionSection>
                                                        )}
                                                        {visibleAccessibilitySectionFields
                                                            .formatAndStandards
                                                            .length > 0 && (
                                                            <FormHydrationAccordionSection title="Format and Standards">
                                                                {visibleAccessibilitySectionFields.formatAndStandards.map(
                                                                    (
                                                                        fieldParent,
                                                                        index
                                                                    ) => (
                                                                        <FormHydrationFieldItem
                                                                            key={`${fieldParent.location}-${index}`}
                                                                            fieldParent={
                                                                                fieldParent
                                                                            }
                                                                            selectedFormSection={
                                                                                selectedFormSection
                                                                            }
                                                                            index={
                                                                                index
                                                                            }
                                                                            control={
                                                                                control
                                                                            }
                                                                            schemadefs={
                                                                                schemadefs
                                                                            }
                                                                            getValues={
                                                                                getValues
                                                                            }
                                                                            updateGuidanceText={
                                                                                updateGuidanceText
                                                                            }
                                                                            useFieldPanels
                                                                        />
                                                                    )
                                                                )}
                                                            </FormHydrationAccordionSection>
                                                        )}
                                                    </>
                                                ) : (
                                                    selectedFormSection &&
                                                    schemaFields
                                                        .filter(
                                                            schemaField =>
                                                                !schemaField
                                                                    .field
                                                                    ?.hidden
                                                        )
                                                        .filter(
                                                            ({ location }) =>
                                                                location?.startsWith(
                                                                    selectedFormSection
                                                                )
                                                        )
                                                        .map(
                                                            (
                                                                fieldParent,
                                                                index
                                                            ) => (
                                                                <FormHydrationFieldItem
                                                                    key={`${fieldParent.location}-${index}`}
                                                                    fieldParent={
                                                                        fieldParent
                                                                    }
                                                                    selectedFormSection={
                                                                        selectedFormSection
                                                                    }
                                                                    index={index}
                                                                    control={
                                                                        control
                                                                    }
                                                                    schemadefs={
                                                                        schemadefs
                                                                    }
                                                                    getValues={
                                                                        getValues
                                                                    }
                                                                    updateGuidanceText={
                                                                        updateGuidanceText
                                                                    }
                                                                />
                                                            )
                                                        )
                                                )}
                                            </Box>
                                        )}
                                    </Paper>
                                </Form>
                            </FormProvider>
                        </Box>
                        {currentSectionIndex > 0 && (
                            <Paper
                                sx={{
                                    flex: 1,
                                    mt: 1.25,
                                    mb: 1.25,
                                    p: 2,
                                    backgroundColor: "white",
                                    wordBreak: "break-word",
                                }}>
                                {isDatasetFiltersSection ? (
                                    <DatasetFiltersGuidancePanel
                                        selectedFilters={datasetFilterIds}
                                        onRemoveFilter={
                                            handleDatasetFilterChange
                                        }
                                    />
                                ) : (
                                    <>
                                        <Typography
                                            variant="h2"
                                            sx={
                                                isOtherDataTypesSection ||
                                                isDemographicFrequencySection ||
                                                isOmicsSection
                                                    ? {
                                                          color: "primary.main",
                                                          fontWeight: 700,
                                                          mb: 1.5,
                                                      }
                                                    : undefined
                                            }>
                                            {isOtherDataTypesSection &&
                                            otherDataTypesSection?.title
                                                ? otherDataTypesSection.title
                                                : isDemographicFrequencySection &&
                                                    demographicFrequencySectionHeader?.title
                                                  ? demographicFrequencySectionHeader.title
                                                  : isOmicsSection &&
                                                      omicsSectionHeader?.title
                                                    ? omicsSectionHeader.title
                                                    : t("guidance")}
                                        </Typography>

                                        {(isOtherDataTypesSection ||
                                            isDemographicFrequencySection ||
                                            isOmicsSection) && (
                                            <Divider
                                                sx={{
                                                    mb: 2,
                                                    borderColor: colors.grey300,
                                                }}
                                            />
                                        )}

                                        {guidanceText && (
                                            <MarkDownSanitizedWithHtml
                                                content={guidanceText}
                                            />
                                        )}
                                        <GuidanceDownloads />
                                    </>
                                )}
                            </Paper>
                        )}
                    </>
                ) : (
                    currentSectionIndex > 0 && (
                        <Box sx={{ flex: 3, p: 0 }}>
                            <SubmissionScreen
                                trigger={trigger}
                                errors={formState.errors}
                                makeActiveAction={handleMakeActive}
                                makeActiveDisabled={isSaving}
                            />
                        </Box>
                    )
                )}
            </Box>

            <Box sx={{ padding: theme.spacing(1), margin: theme.spacing(2) }}>
                <FormFooter>
                    <FormFooterItem>
                        <Button
                            onClick={() =>
                                setSelectedFormSection(
                                    formSections[currentSectionIndex - 1]
                                )
                            }
                            disabled={isFirstSection(currentSectionIndex)}
                            variant="text"
                            startIcon={<ArrowBackIosNewIcon />}>
                            {t("previous")}
                        </Button>
                    </FormFooterItem>

                    <FormFooterItem>
                        <Button
                            onClick={() =>
                                setSelectedFormSection(
                                    formSections[currentSectionIndex + 1]
                                )
                            }
                            disabled={isLastSection(
                                formSections,
                                currentSectionIndex
                            )}
                            endIcon={<ArrowForwardIosIcon />}>
                            {t("next")}
                        </Button>
                    </FormFooterItem>
                </FormFooter>
            </Box>
        </>
    );
};

const CreateDataset = ({
    formJSON: formJSONProp,
    teamId,
    user,
    defaultTeamId,
    schemadefs,
}: CreateDatasetProps) => {
    const [formJSON, setFormJSON] = useState<FormHydrationSchema | undefined>(
        formJSONProp
    );
    const [formLoadError, setFormLoadError] = useState(false);

    useEffect(() => {
        if (formJSONProp) {
            setFormJSON(formJSONProp);
            return;
        }

        let cancelled = false;

        fetch(`/api/form-hydration?teamId=${teamId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to load form schema");
                }
                return response.json() as Promise<FormHydrationSchema>;
            })
            .then(data => {
                if (!cancelled) {
                    setFormJSON(data);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setFormLoadError(true);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [formJSONProp, teamId]);

    if (formLoadError) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="h2">
                    Unable to load the dataset form. Please refresh the page.
                </Typography>
            </Box>
        );
    }

    const resolvedFormJSON = formJSONProp ?? formJSON;

    if (!resolvedFormJSON) {
        return <Loading />;
    }

    return (
        <CreateDatasetForm
            formJSON={resolvedFormJSON}
            teamId={teamId}
            user={user}
            defaultTeamId={defaultTeamId}
            schemadefs={schemadefs}
        />
    );
};

export default CreateDataset;
