export interface ProjectGrantVersion {
    id: number;
    project_grant_id: number;
    version: number;
    projectGrantName: string | null;
    leadResearcher: string | null;
    leadResearchInstitute: string | null;
    grantNumbers: string[] | string | null;
    projectGrantStartDate: string | null;
    projectGrantEndDate: string | null;
    projectGrantScope: string | null;
}

export interface ProjectGrantRecord {
    id: number;
    pid: string;
    latest_version: ProjectGrantVersion | null;
}

export interface ProjectGrantRow {
    id: number;
    title: string;
    leadResearcher: string;
    institute: string;
    startDate: string;
    endDate: string;
    grantNumber: string;
    scope: string;
}

const grant = (
    id: number,
    pid: string,
    projectGrantName: string,
    leadResearcher: string,
    leadResearchInstitute: string,
    projectGrantStartDate: string,
    projectGrantEndDate: string,
    grantNumber: string,
    projectGrantScope: string
): ProjectGrantRecord => ({
    id,
    pid,
    latest_version: {
        id,
        project_grant_id: id,
        version: 1,
        projectGrantName,
        leadResearcher,
        leadResearchInstitute,
        grantNumbers: [grantNumber],
        projectGrantStartDate,
        projectGrantEndDate,
        projectGrantScope,
    },
});

const TRAFIK_CAR_SCOPE =
    "Background: Hepatocellular Carcinoma(HCC) accounts for 2% of new cancer diagnoses in the UK/year. 70% of patients present with unresectable disease with a 5-year survival of 2-11%. Chimeric Antigen Receptor T-cell therapy(CAR-T) can cure some patients with blood cancers and could revolutionize treatment of solid tumours. 70% of HCC patients express the CAR-T target antigen Glypican-3(GPC3), but early clinical trial data suggests only partial/transient efficacy. One major problem is that GPC3 gets partially digested, so part of this protein falls away, becoming soluble in the blood/around the HCC tumour. Current CARs target this part of the GPC3 which means that CAR-T cells can be “blocked” by soluble fragments of GPC3. Further problems include the hostile HCC tumour microenvironment(TME), primed to 'switch off' CAR-T-cells, and the fibrotic HCC-TME which impedes CAR-T entry into the tumour. We have developed a three-pronged strategy to build better GPC3CAR-T-cells for HCC, addressing the limitations of previous CARs. Aims: In this Phase I study we will test CAR-T therapy(HR8CAR) for HCC incorporating the following features: (1) Improved GPC3 Targeting: HR8CAR targets the stable portion of GPC3 that remains on cancer cells post-shedding and unlike other GPC3CARs HR8CAR not inhibited by the shed GPC3 fragments (2) Overcoming the HCC-TME: HR8CAR is engineered to be resistant to immune-inhibitory TGFb (overexpressed++ in HCC) and to over-express IL15 to promote T-cell proliferation (3) Improved CAR-T trafficking: through low-dose 'immune-activating' radiotherapy Methods: 12 patients with advanced/unresectable/metastatic HCC failing ≥1 line of standard therapy will undergo leukapheresis, lymphodepletion (fludarabine/cyclophosphamide), and HR8CAR-T infusion, with select cohorts receiving low-dose radiotherapy (RT). · Cohort 1: 50×10^6 HR8CAR-T · Cohort 2: 50×10^6 HR8CAR-T+low-dose RT · Cohort 3: 100×10^6 HR8CAR-T+low-dose RT Primary endpoints include safety and feasibility of CAR-T manufacture/administration. Secondary endpoints include proportion of patients responding to trial treatment/HR8CAR kinetics/optimal dose determination/PFS/OS. This dose-finding study uses the Bayesian model-averaging continual-reassessment method (BMA-CRM) to identify the maximum tolerated dose of HR8CAR. Translational endpoints will help us better understand who responds to treatment. Results: If we demonstrate safety and see patient responses, we will extend the study to better understand treatment response. If the study is only partially successful, we will learn what the remaining barriers are and work to solve those barriers in follow-on preclinical and clinical studies. If a proportion of patients have complete and lasting remissions, we will work with pharmaceutical companies to bring this treatment to regular use for NHS patients.";

const CRISTAL_APC_SCOPE =
    "Background Median life expectancy for patients with metastatic pancreatic ductal adenocarcinoma (mPDAC) is under 1 year even with combination chemotherapy, so there is an unmet need to improve outcomes. High expression of C-C chemokine receptor 1 (CCR1) promotes tumour invasion and positively correlates with reduced progression-free survival. CCR1 is important for macrophage polarisation, and abrogation of CCR1 signalling can reprogram tumour associated macrophages towards a more immunogenic phenotype encouraging tumour elimination. There is an association between CCR1 expression and macrophage infiltration, and between CCR1 expression and progression free survival in PDAC, suggesting a potential therapeutic approach for CCR1 inhibition in PDAC. CRISTAL-APC is a Phase I/II clinical trial based on the hypothesis, supported by data showing synergy between CCR1 inhibitors and gemcitabine-based treatment in mouse models of PDAC, that CCR1 signalling between tumour cells, monocytes and the tumour microenvironment, will impact on anticancer activity in mPDAC. Aims The aim of the Phase I part of this study is to assess safety and tolerability of the CCR1 antagonist VP-002 with nab-paclitaxel+gemcitabine(nPG) in patients with PDAC to identify a recommended phase 2 dose (RP2D). The aim of the Phase II is to evaluate signals of clinically meaningful improvement in activity, including survival endpoints, response and quality of life when compared with the standard of care (SoC) nPG chemotherapy regimen for treatment of first line PDAC in patients with first line untreated mPDAC. Methods Phase I will assess safety and tolerability of VP-002 at escalating doses with nPG, to identify RP2D. This dose and schedule will be assessed in Phase II randomised controlled trial in participants with PDAC in the advanced setting, for superiority against SoC chemotherapy nPG. Patients with mPDAC in the first-line treatment setting will be randomised in 2: 1 ratio experimental and control arms. This will be the first UK national study in patients with mPDAC utilising a novel trial design where information from synthetic control data from trials with highly similar enrolment criteria will be borrowed for power-prior based method to increase the efficiency of the study. Multiple blood-based and tissue based biomarkers will be evaluated. How the results of this research will be used If the addition of VP-002 is tolerable and improves clinical outcomes such as survival, shrinkage and quality of life for patients with untreated advanced pancreatic cancer, it has the potential to become a new standard of care for patients with very few treatment options.";

const FUS_SCOPE =
    "Background There are over 400 cases of brain tumours in children each year. 40% of patients progress and eventually die from their disease. This, in part, due to the blood–brain barrier (BBB), which prevents therapeutic concentrations of drugs from penetrating the tumour. Focused ultrasound (FUS) in combination with microbubbles is the only technique that allows non-invasive and localized opening of the BBB. Our team has developed a portable non-invasive FUS system, suitable for paediatric patients, which allows openings of different sizes to be created. Aims To investigate if repeated application of this non-invasive FUS with intravenous administration of carboplatin is safe and feasible. Methods Primary end points: to determine the frequency and nature of adverse events related to carboplatin after FUS-induced BBB opening at varying volumes (size of BBB opening); successful opening and closure of the BBB confirmed with MRIs (Magnetic Resonance Imaging); the effect of FUS based BBB disruption on peri-tumoural brain and tumour tissue carboplatin concentrations. Secondary end points: median overall survival, median progression-free survival, radiological treatment response based on RANO criteria, associations between the size of BBB opening and adverse events. Up to a maximum of 20 patients will be recruited Patients will undergo repeated application of non-invasive FUS with a weekly administration of carboplatin for 4 weeks followed by a 2-week rest period (6 weekly cycles). If safe and tolerated well, patients will have this treatment repeated until disease progression. Patients will be divided into 3 cohorts: 6 patients with relapsed/progressive pontine diffuse midline glioma; 6 patients with relapsed/progressive supratentorial high-grade glioma (HGG) or other relapsed/progressive supratentorial tumours; and a surgical cohort: 6 patients with progressive/recurrent supratentorial HGG or other relapsed/progressive supratentorial tumours amenable to resection (complete or partial). The surgical cohort will enable us to investigate the effects of FUS in combination with microbubbles on the parenchymal drug concentrations. For this cohort we will administer chemotherapy in conjunction with sonication immediately prior to surgery. Surviving patients will be followed-up for a minimum of 12 months. The trial duration, from first patient in to completion of 12 months follow-up for the final patient is estimated to be 27 months, assuming a patient recruitment rate of 2 patients/month. We believe this proof-of-concept trial would support future trials not only in relapsed high-risk brain tumours but in other child and adult brain tumours, and potentially non-malignant brain disorders where penetration of the BBB is required.";

const RAINBO_SCOPE =
    "Background Endometrial cancer is the most common gynaecological cancer in the UK, with 10,000 cases and 2,400 deaths/year. The cornerstone of treatment is surgery with adjuvant therapy for high-risk disease based on clinico-pathological features. This is imprecise and clinicians and patients must balance the risks of poor survival outcomes with treatment-related toxicity. Molecular classification identifies p53-abnormal (p53abn), POLE-mutant (POLEmut), mismatch repair-deficient (MMRd) and no specific molecular profile (NSMP) tumours with distinct prognostic profiles. The PORTEC-3 trial showed that adjuvant chemoradiotherapy (CRT) is beneficial for high-risk endometrial cancer patients overall but when stratified by molecular group, only p53abn tumours showed a clear benefit, POLEmut and MMRd tumours showed no benefit, and the benefit for NSMP tumours was uncertain. Aim Refining Adjuvant treatment IN endometrial cancer Based On molecular profile (RAINBO) is a collaborative international platform of four adjuvant treatment trials in high-risk endometrial cancer. It aims to determine whether personalised treatment based on molecular group reduces cancer recurrence whilst minimising harms from unnecessary chemotherapy. Methods Women with high-risk endometrial cancer undergo molecular profiling (p53, MMR immunohistochemistry and POLE next generation sequencing) and are offered recruitment to RAINBO according to molecular group: - p53abn-RED (Institute Gustave Roussy, France), randomised phase III trial of adjuvant CRT followed by olaparib for 2 years or adjuvant CRT alone for stage I–III p53abn disease (25/554 participants recruited to date); - MMRd-GREEN (Leiden University Medical Center, Netherlands), randomised phase III trial of adjuvant RT plus PD-L1 inhibition for 1 year (durvalumab) or RT alone for stage II-III MMRd disease (85/316 recruited); - POLEmut-BLUE (Canadian Cancer Trials Group), non-randomised phase II trial investigating the safety of no adjuvant therapy for stage I–II, and no adjuvant therapy or RT alone for stage III POLEmut disease (53/213 recruited); - NSMP-ORANGE (NIHR-funded; University College London, UK), randomised phase III trial of adjuvant RT followed by progestin for 2 years or adjuvant CRT for oestrogen receptor positive stage II-III NSMP disease (not yet open, ethics application submitted, 0/600 recruited). The primary endpoint is recurrence-free survival (p53abn-RED, MMRd-GREEN, NSMP-ORANGE) or pelvic recurrence (POLEmut-BLUE) at 3 years. Clinically-annotated tumour blocks are prospectively collected and biobanked for trial-specific and overarching translational research programmes. Here we seek support for UK recruitment to p53abn-RED, MMRd-GREEN and POLEmut-BLUE trials (n=200) and associated tumour biobanking. How the results will be used The RAINBO programme will redefine clinical practice by personalising treatment for women with high-risk endometrial cancer.";

const B5_SCOPE =
    "Background: Myelodysplastic syndromes (MDS) are one of the commonest blood cancers in older people, typically incurable, resulting in cytopenias with a transformation to leukaemia rate of 30%. For the majority of patients with MDS, the only available standard of care treatments are erythropoiesis stimulating agents or blood transfusions. MDS is markedly heterogeneous disease with distinct DNA mutation patterns driving patient phenotypes and prognosis. The commonest recurrent mutation detected in MDS is in the gene SF3B1 which induces abnormalities in the enzyme COASY, essential for haemoglobin production and red blood cell maturation. Pioneering laboratory research has demonstrated that Vitamin B5, as a substrate for COASY, can rescue this erythroid differentiation defect. Vitamin B5 is an oral agent with an established safety profile and thus represents an extremely attractive precision therapeutic to treat SF3B1-MDS. Aims: The aim of the trial is to create a step change in management of patients with MDS, comprised of an improvement in haemoglobin, improvement in quality of life, and reduction in red cell transfusion burden. Methods: This single arm phase II, multi-centre, Bayesian, intra-patient dose de-escalation trial will aim to assess the activity of vitamin B5 in patients with SF3B1 mutated MDS. The primary outcome of the trial will be haemoglobin response at 24 weeks with additional secondary outcomes and a suite of translational research. The intra-patient dose de-escalation enables the trial to maximise each patient's time on treatment and in turn ensuring the maximum potential treatment benefit for each patient. Additionally, the Bayesian design ensures the most efficient use of the patient numbers available. How the results of this research will be used: This study will provide compelling evidence that targeting metabolic vulnerabilities in SF3B1-mutant MDS can enhance erythropoiesis and alter clonal dynamics. Our study has the potential to open new avenues for therapeutic development, positioning metabolic interventions as a promising strategy in the precision treatment of MDS and beyond. Future research will focus on a rapid progression to a phase three study, also exploring combinatorial therapeutic approaches to optimize patient outcomes.";

const MPN_SCOPE =
    "Background: Myeloproliferative neoplasms (MPNs) are progressive blood cancers affecting 8 per 100,000 individuals in the UK. They are characterised by overproduction of mature blood cells, driven by mutations in JAK-STAT pathway. Earlier subtypes such as polycythaemia vera (PV) and essential thrombocythaemia have long latency periods whereas myelofibrosis is more advanced, with a median survival of 5–7 years and < 2 years in high-risk patients. All subtypes carry a risk of progression to a treatment-resistant acute leukaemia, with myelofibrosis patients at highest risk (10–20%). In other blood cancers, such as acute and chronic myeloid leukaemia, molecular response (MR) has predicted improved survival transforming the treatment landscape. In contrast, most therapies in MPN show limited disease modifying activity. We are entering a pivotal era in MPN, where finally there are emerging treatments in early phase trials that have the potential to selective target the mutant cancer clone such as CALR-mutant immunotherapies and JAK2V617F-selective agents. To support their successful development, it is crucial to establish whether MR correlates with key clinical outcomes such as overall and event-free survival. MPN trials have been insufficiently powered and long-term follow-up to assess this, highlighting the need for large, longitudinal studies linking molecular and clinical data. Aims: This study aims to (1) correlate molecular responses with clinical outcomes in MPNs, (2) define clinically meaningful MR thresholds which translate to improved event-free survival (EFS), (3) assess the impact of different therapies on molecular responses and (4) identify genomic predictors of MR or progression. Methods: An ambispective study design, combining prospective and retrospective, is key in MPN due to the long disease course. We will enrol 1,275 patients receiving cytoreductive therapies, tracking molecular dynamics with clinical outcomes for 5 years per patient. The primary outcome measure will be event-free survival (EFS) stratified by MR. EFS will be defined as the time from date of the year 1 allele burden after enrolment until first major thrombosis, major haemorrhage, transformation to MF, myelodysplasia (MDS), accelerated phase (10-15% leukaemia cells), leukaemia (20% leukaemia cells) or death. Retrospective data will include archived DNA and paired clinical data to determine molecular dynamics over an extended time period. How the results of this research will be used: Results will support the use of molecular monitoring to guide treatment decisions, identify early disease progression, and importantly inform trial design by providing evidence to support use of molecular response as a surrogate marker for survival.";

const MYELOMA_SCOPE =
    "Background: The iFIT trial aims to identify the optimal use of immunotherapeutic agents for older/frailer myeloma patients with a suboptimal response to standard of care induction therapy, and address treatment duration and de-intensification questions for those with the deepest responses and the frailest patients. It is a biomarker-stratified platform design for patients with newly diagnosed myeloma who are transplant-noneligible. The allied translational research programme will investigate drivers of treatment resistance (tumour/microenvironment therapy resistance biology), treatment tolerance (host biology) and tumour response to enable further personalisation of the treatment approach and understanding of biological frailty. Aims: To collect patient samples with iFIT at key time points to enable the delivery of key translational endpoints. Methods: Samples of blood and bone marrow will be collected at baseline and several subsequent timepoints throughout the trail (pathway dependent) processed and stored for translational projects. Use of results: Samples will be used in the following planned projects and will be made available to other researchers once study specific translational endpoints have been delivered: Host Biology 1. Defining host response biology, the measurable pathophysiological processes resulting from the impact of disease and accelerated aging on biological function including immune profiling (immunosenescence and exhaustion, innate immunity), immune metabolic dysfunction and infection/vaccination efficiency to better define predisposition to frailty syndrome. 2. Exploring epigenetic-aging, an individual's degree of aging based on patterns of DNA methylation, and define its relationship to frailty, treatment tolerance, disease control and survivorship in older myeloma patients. 3. Understanding the role of T cell telomere shortening in the immune response in older myeloma patients treated with T cell engager therapies. 4. Analysing the role of clonal haematopoiesis (CHIP) in frailty and immunological senescence. Tumour Biology and response 1. Myeloma cell intrinsic and extrinsic driven resistance studies. 2. Optimising tumour response assessment using mass spectrometry.";

const ENHANCE_SCOPE =
    "Background Prostate cancer is the second most common cancer in the UK, with about 55,093 new cases and 12,039 deaths each year. The incidence of prostate cancer is projected to rise by 15% between 2023–2025 and 2038–2040 in the UK. Fortunately, survival of these men has increased substantially due to earlier detection and effective new treatments. Current standard treatment for metastatic hormone-sensitive prostate cancer (mHSPC) or castration/hormone-resistant prostate cancer (mCRPC) involves androgen deprivation therapy (ADT) using a luteinising hormone-releasing hormone agonist or antagonist in combination with a novel androgen receptor pathway inhibitor (ARPI) such as abiraterone, enzalutamide, or apalutamide. The risk of treatment-related toxicity from ARTI increases with dose, which may lead to treatment suspension or stopping early. Toxicities also impair health-related quality of life. Aims To assess the clinical effectiveness and cost-effectiveness of using lower doses of anti-androgens (enzalutamide, apalutamide, or abiraterone) for treating mHSPC or mCRPC. Methods Patients will be randomised in a non-inferiority trial (1:1) to receive either the recommended or reduced dose of ARPI. In the control arm, the total daily doses are 160mg enzalutamide, 240mg apalutamide, and 1000mg abiraterone. The experimental arm involves half of these doses. The primary efficacy endpoint is overall survival (with a non-inferiority margin of 4 percentage points). The primary toxicity endpoints are fatigue and the percentage of patients who discontinue ARPI due to adverse events (for which we expect superiority over the control arm). There is a health economic analysis. The study size is 1500 patients (with 3 years of recruitment then 2 years of follow up, and 80% power). The design, including endpoints, were developed closely with patient focus groups. Blood and urine samples would also be collected for translational work to see if there are subsets of men who do benefit more from the recommended doses. How the results of this research will be used. ENHANCE trial is the only one of its type in prostate cancer. If we can demonstrate similar efficacy using the lower dose, this would have a major impact on a large number of patients seen in the NHS; by reducing toxicities and drug costs. Our trial results would impact international clinical guidelines and have an impact worldwide. Change in practice will be possible as soon as results of the trial are available, expected to be around 2030.";

export const FALLBACK_PROJECT_GRANTS: ProjectGrantRecord[] = [
    grant(
        1,
        "trafik-car",
        "TRAFIK-CAR: Next Generation autologous chimeric antigen receptor T cells for hepatocellular carcinoma (HCC)",
        "Dr Claire Roddie",
        "University College London",
        "2026-08-01",
        "2031-01-31",
        "CRCCTM-Nov25/100011",
        TRAFIK_CAR_SCOPE
    ),
    grant(
        2,
        "cristal-apc-ctm",
        "CRISTAL-APC A multi-centre, open label Phase I/randomised Phase II study of VP-002, a C-C motif chemokine receptor 1 (CCR1) inhibitor, given orally in combination with nab-paclitaxel and gemcitabine (nPG) to patients with advanced pancreatic ductal adenocarcinoma.",
        "Dr Bristi Basu",
        "Cambridge University Hospitals NHS Trust",
        "2026-06-01",
        "2032-05-31",
        "CRCCTM-Nov25/100008",
        CRISTAL_APC_SCOPE
    ),
    grant(
        3,
        "fus-carboplatin",
        "A safety and feasibility study investigating the use of Non-Invasive Focused Ultrasound (FUS) with intravenous administration of Carboplatin in children, teenagers and young adults diagnosed with progressive/recurrent high-risk brain tumours.",
        "Dr Elwira Szychot",
        "University College London",
        "2026-06-01",
        "2030-05-31",
        "CRCCTM-Nov25/100010",
        FUS_SCOPE
    ),
    grant(
        4,
        "cristal-apc-scm",
        "CRISTAL-APC. A multi-centre, open label Phase I/randomised Phase II study of VP-002, a C-C motif chemokine receptor 1 (CCR1) inhibitor, given orally in combination with nab-paclitaxel and gemcitabine (nPG) to patients with advanced pancreatic ductal adenocarcinoma (PDAC)",
        "Dr Bristi Basu",
        "Cambridge University Hospitals NHS Trust",
        "2026-06-01",
        "2032-05-31",
        "CRCSCM-Nov25/100006",
        CRISTAL_APC_SCOPE
    ),
    grant(
        5,
        "rainbo-trial",
        "Refining Adjuvant treatment IN endometrial cancer Based On molecular features: the RAINBO clinical trial programme",
        "Professor Emma Crosbie",
        "University College London",
        "2026-04-01",
        "2035-03-31",
        "CRCCTM-Nov25/100003",
        RAINBO_SCOPE
    ),
    grant(
        6,
        "rainbo-biobank",
        "RAINBO Translational Research Biobank",
        "Professor Emma Crosbie",
        "University College London",
        "2026-04-01",
        "2035-03-31",
        "CRCSCM-Nov25/100003",
        RAINBO_SCOPE
    ),
    grant(
        7,
        "b5formds",
        "B5ForMDS: A single arm, phase II, multi-centre, Bayesian, intra-patient dose de-escalation trial to assess the activity of VitB5 for the treatment of patients with SF3B1 mutant MDS",
        "Dr Onima Chowdhury",
        "University of Birmingham",
        "2026-03-01",
        "2031-02-28",
        "CRCCTM-Nov25/100007",
        B5_SCOPE
    ),
    grant(
        8,
        "mpn-outcomes",
        "Real-world ambispective observational study of molecular responses and clinical outcomes in patients with myeloproliferative neoplasms (MPNs)",
        "Dr Jennifer O Sullivan",
        "University of Birmingham",
        "2026-03-01",
        "2035-02-28",
        "CRCSCM-Nov25/100004",
        MPN_SCOPE
    ),
    grant(
        9,
        "myeloma-ifit",
        "Sample Collection for UK-MRA Myeloma XVIII iFIT: Immunotherapy approaches adapted for Fitness In newly diagnosed Transplant ineligible patients with Myeloma",
        "Dr Charlotte Pawlyn",
        "Institute of Cancer Research",
        "2025-11-01",
        "2032-10-31",
        "CRCSCM-May25/100005",
        MYELOMA_SCOPE
    ),
    grant(
        10,
        "enhance-ucl",
        "ENHANCE - Evaluating Hormone therapy to Achieve Optimal Doses in Metastatic prostate cancer",
        "Professor Ananya Choudhury",
        "University College London",
        "2025-10-01",
        "2031-09-30",
        "CRCCTM-May25/100007",
        ENHANCE_SCOPE
    ),
    grant(
        11,
        "enhance-manchester",
        "ENHANCE - Evaluating Hormone therapy to Achieve Optimal Doses in Metastatic prostate cancer",
        "Professor Ananya Choudhury",
        "University of Manchester",
        "2025-10-01",
        "2031-09-30",
        "CRCSCM-May25/100006",
        ENHANCE_SCOPE
    ),
];

const formatGrantNumbers = (value: ProjectGrantVersion["grantNumbers"]) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean).join(", ");
    }
    if (typeof value !== "string" || !value.trim()) return "";
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            return parsed.filter(Boolean).join(", ");
        }
    } catch {
        return value;
    }
    return value;
};

const formatDate = (value: string | null | undefined) => {
    if (!value) return "";
    const match = value.match(/^\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : value;
};

export const toProjectGrantRows = (
    grants: ProjectGrantRecord[]
): ProjectGrantRow[] =>
    grants.map(grantRecord => {
        const version = grantRecord.latest_version;
        return {
            id: grantRecord.id,
            title: version?.projectGrantName || "",
            leadResearcher: version?.leadResearcher || "",
            institute: version?.leadResearchInstitute || "",
            startDate: formatDate(version?.projectGrantStartDate),
            endDate: formatDate(version?.projectGrantEndDate),
            grantNumber: formatGrantNumbers(version?.grantNumbers ?? null),
            scope: version?.projectGrantScope || "",
        };
    });
