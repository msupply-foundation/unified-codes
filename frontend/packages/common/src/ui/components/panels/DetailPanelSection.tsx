import React, { PropsWithChildren } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { Divider } from '@common/components';
import { ChevronDownIcon } from '@common/icons';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.background.menu,
  boxShadow: 'none',
  '&.Mui-expanded': { margin: 0 },
  '&:before': { backgroundColor: 'transparent' },
  '& p.MuiTypography-root': { fontSize: 12 },
  '& .MuiAccordionSummary-root.Mui-expanded': {
    minHeight: 48,
  },
}));

export interface DetailPanelSectionProps {
  title: string;
  actionButtons?: React.ReactNode;
  defaultExpanded?: boolean;
}

export const DetailPanelSection: React.FC<
  PropsWithChildren<DetailPanelSectionProps>
> = ({ children, title, actionButtons, defaultExpanded = true }) => (
  <Box>
    <StyledAccordion defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ChevronDownIcon />}>
        <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
        <Stack
          sx={{
            ml: 'auto',
          }}
          direction={'row'}
        >
          {actionButtons}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </StyledAccordion>
    <Divider />
  </Box>
);
