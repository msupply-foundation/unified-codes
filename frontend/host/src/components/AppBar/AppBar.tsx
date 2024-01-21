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
  RouteBuilder,
  Link,
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
          {/* if not logged in, there is no app drawer, so show links */}
          {!user && <NavLinks />}
        </Toolbar>
        <AppBarContent />
        <AppBarTabs />
      </Box>
    </StyledContainer>
  );
};

export default AppBar;

const NavLinks = () => {
  const t = useTranslation('system');

  return (
    <Box marginRight="30px" display="flex" gap="10px">
      <Link
        to={RouteBuilder.create(AppRoute.Browse).build()}
        style={{ color: 'black' }}
      >
        {t('label.browse')}
      </Link>
      |
      <Link
        to={RouteBuilder.create(AppRoute.About).build()}
        style={{ color: 'black' }}
      >
        {t('label.about')}
      </Link>
    </Box>
  );
};
