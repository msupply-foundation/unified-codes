import * as React from 'react';
import { connect } from 'react-redux';

import { IEntity, IProperty } from '@unified-codes/data';
import { List } from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import DetailPropertyListItem from './DetailPropertyListItem';

import { IState } from '../../../types';
import { DetailSelectors } from '../../../selectors';
import { ITheme } from '../../../styles';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      margin: '0 auto 0 auto',
      maxWidth: 900,
      width: '100%',
      borderRadius: 5,
    },
  })
);

export interface DetailPropertyListProps {
  classes: Record<string, string>;
  entity: IEntity;
}

export type DetailPropertyList = React.FunctionComponent<DetailPropertyListProps>;

export const DetailPropertyListComponent: DetailPropertyList = ({ entity }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <DetailPropertyListItem description="Properties" properties={entity?.properties} />
    </List>
  );
};

const mapStateToProps = (state: IState) => {
  const entity = DetailSelectors.selectEntity(state);
  return { entity };
};

export const DetailPropertyList = connect(mapStateToProps)(DetailPropertyListComponent);

export default DetailPropertyList;
