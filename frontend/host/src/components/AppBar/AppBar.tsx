import React from 'react';
import {
  styled,
  AppBarContent,
  Toolbar,
  Box,
  Breadcrumbs,
  useAppBarRect,
  AppBarButtons,
  AppBarTabs,
  IconButton,
  useNavigate,
  useTranslation,
  useAuthContext,
  UCLogo,
} from '@uc-frontend/common';
import { SectionIcon } from './SectionIcon';
import { AppRoute } from 'frontend/config/src';

const StyledContainer = styled(Box)(({ theme }) => ({
  marginRight: 0,
  minHeight: 90,
  paddingLeft: 16,
  paddingRight: 16,

  ...theme.mixins.header,
}));

export const AppBar: React.FC = () => {
  const { ref } = useAppBarRect();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const t = useTranslation('system');

  return (
    <StyledContainer
      ref={ref}
      sx={{ boxShadow: theme => theme.shadows[2], display: 'flex' }}
    >
      {!user && (
        <IconButton
          label={t('button.return-to-home')}
          onClick={() => navigate(AppRoute.Browse)}
          icon={<UCLogo showName size={'large'} />}
          sx={{
            '&:hover': { backgroundColor: 'inherit' },
            margin: '0 40px 0 20px',
          }}
        />
      )}
      <Box flex={1}>
        <Toolbar disableGutters>
          <Box style={{ marginInlineEnd: 5 }}>
            <SectionIcon />
          </Box>

          <Breadcrumbs />
          <AppBarButtons />
        </Toolbar>
        <AppBarContent />
        <AppBarTabs />
      </Box>
    </StyledContainer>
  );
};

export default AppBar;
