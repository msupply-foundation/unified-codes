import React, { FC } from 'react';
import {
  useDrawer,
  styled,
  useMatches,
  alpha,
  useTranslation,
  KBarAnimator,
  KBarResults,
  KBarSearch,
  KBarProvider,
  KBarPositioner,
  KBarPortal,
  PropsWithChildrenOnly,
} from '@uc-frontend/common';
import { Action } from 'kbar/lib/types';

const CustomKBarSearch = styled(KBarSearch)(({ theme }) => ({
  width: 500,
  height: 50,
  fontSize: 20,
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  borderColor: theme.palette.primary.main,
  borderRadius: 5,
  ':focus-visible': {
    outline: 'none',
  },
}));

const StyledKBarAnimator = styled(KBarAnimator)(({ theme }) => ({
  boxShadow: '0px 6px 20px rgb(0 0 0 / 20%)',
  backgroundColor: alpha(theme.palette.background.toolbar, 0.9),
  borderRadius: 7,
  '& #kbar-listbox>div': {
    padding: '0 8px',
  },
}));

const StyledKBarResults = styled(KBarResults)({
  width: 500,
  fontSize: 16,
  borderRadius: '5px',
  boxShadow: '0px 6px 20px rgb(0 0 0 / 20%)',
  ':focus-visible': {
    outline: 'none',
  },
});

const CustomKBarResults = () => {
  const { results } = useMatches();
  return (
    <StyledKBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div>{item}</div>
        ) : (
          <div
            style={{
              background: active ? '#eee' : 'transparent',
            }}
          >
            {item.name}
          </div>
        )
      }
    />
  );
};

const actionSorter = (a: Action, b: Action) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

export const CommandK: FC<PropsWithChildrenOnly> = ({ children }) => {
  const drawer = useDrawer();
  const t = useTranslation(['host']);
  const actions = [
    {
      id: 'navigation-drawer:toggle',
      name: `${t('cmdk.drawer-toggle')} (m)`,
      shortcut: ['m'],
      keywords: 'drawer, close',
      perform: () => drawer.toggle(),
    },
  ];

  const sortedActions = actions.sort(actionSorter);
  return (
    <KBarProvider actions={sortedActions}>
      <KBarPortal>
        <KBarPositioner style={{ zIndex: 1001 }}>
          <StyledKBarAnimator>
            <CustomKBarSearch placeholder={t('cmdk.placeholder')} />
            <CustomKBarResults />
          </StyledKBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
};
