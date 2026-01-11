import React, { useState, useEffect, useMemo } from 'react';
import { IntroText, SectionHeading } from './StudyFilter.styles';
import Typography from '../Typography';
import Box from '../Box';

export const FilterHeader = () => {

    return (<Box>
             <SectionHeading>
           Unleashing the power of big data
             </SectionHeading>
             <IntroText>
                Welcome to the CRUK Data Hub, your gateway to data produced by research funded through Cancer Research UK.
                Here, you can explore our groundbreaking work,
                and researchers can gain access to the data in a way which puts patient needs front and centre.
            </IntroText>
       </Box>
    );

};