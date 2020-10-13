import * as React from 'react';
import { connect } from 'react-redux';

import { IEntity } from '@unified-codes/data';
import { List } from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import DetailEntityListItem from './DetailEntityListItem';

import { IState } from '../../../types';
import { DetailSelectors } from '../../../selectors';
import { ITheme } from '../../../styles';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      margin: '20px auto 0 auto',
      maxWidth: 900,
      width: '100%',
      borderRadius: 5,
    },
  })
);

export interface DetailEntityListProps {
  classes: Record<string, string>;
  entity: IEntity;
}

export type DetailEntityList = React.FunctionComponent<DetailEntityListProps>;

export const DetailEntityListComponent: DetailEntityList = ({ entity }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <DetailEntityListItem description="Forms" childEntities={entity?.children} />
    </List>
  );
};

const mapStateToProps = (state: IState) => {
  const entity = DetailSelectors.selectEntity(state);
  return { entity };
};

export const DetailEntityList = connect(mapStateToProps)(DetailEntityListComponent);

export default DetailEntityList;

// Scroll
// Handle non drug items
