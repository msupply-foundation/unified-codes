import * as React from 'react';
import { connect } from 'react-redux';

import { IEntity } from '@unified-codes/data';
import { List, ListItem, ListItemText } from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import DetailEntityListItem from './DetailEntityListItem';

import { IState } from '../../../types';
import { DetailSelectors } from '../../../selectors';
import { ITheme } from '../../../styles';

const useStyles = makeStyles((_: ITheme) =>
  createStyles({
    root: {
      width: '100%',
    },
  })
);

export interface DetailEntityListProps {
  entity?: IEntity;
}

export type DetailEntityList = React.FunctionComponent<DetailEntityListProps>;

export const DetailEntityListComponent: DetailEntityList = ({ entity }) => {
  const classes = useStyles();

  // TODO: handle non-drug root entities.
  const description = 'Forms';

  const { children: childEntities } = entity ?? {};
  const { length: entityCount } = childEntities ?? [];

  if (!entityCount) return null;

  return (
    <List className={classes.root}>
      <DetailEntityListItem description={description} childEntities={childEntities} />
    </List>
  );
};

const mapStateToProps = (state: IState) => {
  const entity = DetailSelectors.selectEntity(state);
  return { entity };
};

export const DetailEntityList = connect(mapStateToProps)(DetailEntityListComponent);

export default DetailEntityList;
