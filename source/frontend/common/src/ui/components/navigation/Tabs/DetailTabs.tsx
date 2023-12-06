import React, { FC, ReactNode, useState, useEffect } from 'react';
import { TabContext } from '@mui/lab';
import { Box } from '@mui/material';
import { useDrawer } from '@common/hooks';
import { LocaleKey, useTranslation } from '@common/intl';
import { debounce } from 'lodash';
import { DetailTab } from './DetailTab';
import { ShortTabList, Tab } from './Tabs';
import { useUrlQuery } from '@common/hooks';
import { AppBarTabsPortal } from '../../portals';

export type TabDefinition = {
  Component: ReactNode;
  value: string;
};
interface DetailTabsProps {
  tabs: TabDefinition[];
}
export const DetailTabs: FC<DetailTabsProps> = ({ tabs }) => {
  const { urlQuery, updateQuery } = useUrlQuery();
  const [currentTab, setCurrentTab] = useState<string>(tabs[0]?.value ?? '');
  const t = useTranslation('common');

  // Inelegant hack to force the "Underline" indicator for the currently active
  // tab to re-render in the correct position when one of the side "drawers" is
  // expanded. See issue #777 from oMsupply for more detail.
  const { isOpen: drawerOpen } = useDrawer();
  const handleResize = debounce(
    () => window.dispatchEvent(new Event('resize')),
    100
  );
  useEffect(() => {
    handleResize();
  }, [drawerOpen]);

  const onChange = (_: React.SyntheticEvent, tab: string) => {
    updateQuery({ tab });
  };

  const isValidTab = (tab?: string) =>
    !!tab && tabs.some(({ value }) => value === tab);

  useEffect(() => {
    const tab = urlQuery['tab'];
    if (isValidTab(tab)) setCurrentTab(tab);
  }, [urlQuery]);

  return (
    <TabContext value={currentTab}>
      <AppBarTabsPortal
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Box flex={1}>
          <ShortTabList
            value={currentTab}
            onChange={onChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              marginLeft: 'auto',
              marginRight: 'auto',
              justifyContent: 'center',
              maxWidth: '70%',
            }}
          >
            {tabs.map(({ value }, index) => (
              <Tab
                key={value}
                value={value}
                label={t(`label.${value.toLowerCase()}` as LocaleKey, value)}
                tabIndex={index === 0 ? -1 : undefined}
              ></Tab>
            ))}
          </ShortTabList>
        </Box>
      </AppBarTabsPortal>
      {tabs.map(({ Component, value }) => (
        <DetailTab value={value} key={value}>
          {Component}
        </DetailTab>
      ))}
    </TabContext>
  );
};
