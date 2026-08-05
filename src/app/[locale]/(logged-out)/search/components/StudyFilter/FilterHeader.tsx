'use client';

import { Box, Typography } from '@mui/material';
import { colors } from '@/config/theme';

export const FilterHeader = () => (
    <Box
        sx={{
            py: { mobile: 3, tablet: 4 },
            px: { mobile: 2, tablet: 3, laptop: 4 },
            textAlign: 'center',
        }}
    >
        <Typography
            component="h2"
            variant="h1"
            sx={{
                fontWeight: 800,
                fontSize: { mobile: '2.25rem', tablet: '2.75rem' },
                lineHeight: 1.2,
                color: colors.blue400,
                mb: 2.5,
                m: 0,
                maxWidth: 900,
                mx: 'auto',
            }}
        >
            Unleashing the power of big data
        </Typography>

        <Typography
        variant="h2"
            sx={{
                fontWeight: 700,
                fontSize: { mobile: '1.25rem', tablet: '1.375rem' },
                lineHeight: 1.5,
                color: colors.grey900,
                mb: 2,
                maxWidth: 900,
                mx: 'auto',
            }}
        >
            Welcome to the CRUK Data Hub, your gateway to data produced by research funded through Cancer Research UK.
        </Typography>

        <Typography
        variant="h3"
            sx={{
                fontWeight: 400,
                fontSize: { mobile: '1.125rem', tablet: '1.1875rem' },
                lineHeight: 1.65,
                color: colors.black,
                mb: 2,
                maxWidth: 900,
                mx: 'auto',
            }}
        >
            The CRUK datahub is a catalogue of the datasets we fund. In this pilot stage the hub will be populated first
            with highly curated datasets from our Cancer Research Horizons and from the Data 4 Childhood and Young
            Persons Cancers and then broadening out to include both historical datasets and those that will result from
            CRUK projects just starting.
        </Typography>

        <Typography
        variant="h3"
            sx={{
                fontWeight: 400,
                fontSize: { mobile: '1.125rem', tablet: '1.1875rem' },
                lineHeight: 1.65,
                color: colors.black,
                maxWidth: 900,
                mx: 'auto',
            }}
        >
            Where there are no access limitations to the data, the hub will include direct links. However, in many cases
            access is via a data access committee. Clicking on any of the links below will take you to a details page
            where you can find metadata about the study, including details of how to access the datasets.
        </Typography>
    </Box>
);
