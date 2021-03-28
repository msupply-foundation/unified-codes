import * as React from 'react';
import { connect } from 'react-redux';

import { IEntity } from '@unified-codes/data/v1';

import { Grid, Typography } from '@unified-codes/ui/components';
import { makeStyles, createStyles } from '@unified-codes/ui/styles';

import { IState } from '../../../types';
import { DetailSelectors } from '../../../selectors';
import { ITheme } from '../../../styles';

const useStyles = makeStyles((_: ITheme) =>
  createStyles({
    text: {
      paddingRight: 44,
      alignText: 'center',
      color: 'rgba(255,255,255,0.83)',
      fontSize: 14,
      textTransform: 'uppercase',
    },
  })
);

interface DetailAttributeListProps {
  classes?: {
    root?: string;
    text?: string;
  };
  entity?: IEntity;
}

export type DetailAttributeList = React.FunctionComponent<DetailAttributeListProps>;

const DetailAttributeListComponent: DetailAttributeList = ({ entity }) => {
  const classes = useStyles();

  if (!entity) return null;

  const { description, code, type } = entity;

  return (
    <Grid container justify="center">
      <Grid item>
        <Typography className={classes?.text}>{`Name: ${description}`}</Typography>
      </Grid>
      <Grid item>
        <Typography className={classes?.text}>{`Code: ${code}`}</Typography>
      </Grid>
      <Grid item>
        <Typography className={classes?.text}>{`Type: ${type}`}</Typography>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state: IState) => {
  const entity = DetailSelectors.selectEntity(state);
  return { entity };
};

export const DetailAttributeList = connect(mapStateToProps)(DetailAttributeListComponent);

export default DetailAttributeList;
