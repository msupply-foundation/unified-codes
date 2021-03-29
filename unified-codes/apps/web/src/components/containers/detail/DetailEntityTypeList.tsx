import * as React from 'react';

import { IEntity } from '@unified-codes/data/v1';

import { List } from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import DetailEntityTypeListItem from './DetailEntityTypeListItem';

import { ITheme } from '../../../styles';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    item: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 0px',
      width: '100%',
      '& p': { color: theme.palette.action.active },
    },
    list: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 0px',
      width: '100%',
      '&:hover': { backgroundColor: theme.palette.background.default },
    },
  })
);

interface DetailEntityTypeListProps {
  parent: IEntity;
  entities: IEntity[];
}

export type DetailEntityTypeList = React.FunctionComponent<DetailEntityTypeListProps>;

export const DetailEntityTypeList: DetailEntityTypeList = ({ parent, entities }) => {
  const classes = useStyles();

  const entityTypeGroups = React.useMemo(
    () =>
      entities.reduce((acc, child) => {
        const { type } = child;
        if (!acc[type]) acc[type] = [];
        acc[type] = [...acc[type], child];
        return acc;
      }, {}),
    [entities]
  );

  const entityTypeListItems = React.useMemo(
    () =>
      Object.keys(entityTypeGroups).map((type) => {
        const entities = entityTypeGroups[type];
        return (
          <DetailEntityTypeListItem key={type} type={type} parent={parent} entities={entities} />
        );
      }),
    [entityTypeGroups]
  );

  return <List className={classes.list}>{entityTypeListItems}</List>;
};

export default DetailEntityTypeList;
