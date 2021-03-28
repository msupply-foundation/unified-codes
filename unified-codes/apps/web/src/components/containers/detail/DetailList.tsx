import * as React from 'react';
import { connect } from 'react-redux';

import { IEntity } from '@unified-codes/data/v1';

import { List } from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import DetailEntityListItem from './DetailEntityListItem';

import { IState } from '../../../types';
import { DetailSelectors } from '../../../selectors';
import { ITheme } from '../../../styles';

const useStyles = makeStyles((_: ITheme) =>
  createStyles({
    list: {
      padding: '8px 8px 0px 0px',
      width: '100%',
    },
  })
);

export interface DetailListProps {
  entity: IEntity;
}

export type DetailList = React.FunctionComponent<DetailListProps>;

export const DetailListComponent: DetailList = ({ entity }) => {
  const classes = useStyles();

  if (!entity) return null;

  return <List className={classes.list}>
    <DetailEntityListItem parent={entity} entity={entity}/>
  </List>
};

const mapStateToProps = (state: IState) => {
  const entity = DetailSelectors.selectEntity(state);
  return { entity };
};

export const DetailList = connect(mapStateToProps)(DetailListComponent);

export default DetailList;
