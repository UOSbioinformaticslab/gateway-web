const ETHNICITY_BINS = [
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
    "Not known",
] as const;

const getDemographicFrequencyDefaultValues = () => ({
    "Ethnicity Breakdown Array": ETHNICITY_BINS.map(bin => ({
        "Ethnicity grouping": bin,
        "Ethnicity count": "",
    })),
});

export { ETHNICITY_BINS, getDemographicFrequencyDefaultValues };
