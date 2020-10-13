import * as React from 'react';
import { connect } from 'react-redux';

import { Grid, Typography } from '@unified-codes/ui/components';
import { makeStyles, createStyles } from '@unified-codes/ui/styles';

import { IState } from '../../../types';
import { DetailSelectors } from '../../../selectors';
import { ITheme } from '../../../styles';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: { backgroundColor: theme.palette.background.footer },
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
  code?: string;
  description?: string;
  type?: string;
}

export type DetailAttributeList = React.FunctionComponent<DetailAttributeListProps>;

const DetailAttributeListComponent: DetailAttributeList = ({ code, description, type }) => {
  const classes = useStyles();

  const nameField = `Name: ${description}`;
  const codeField = `Code: ${code}`;
  const typeField = `Type: ${type}`;

  return (
    <Grid container justify="center" className={classes?.root}>
      <Grid item>
        <Typography className={classes?.text}>{nameField}</Typography>
      </Grid>
      <Grid item>
        <Typography className={classes?.text}>{codeField}</Typography>
      </Grid>
      <Grid item>
        <Typography className={classes?.text}>{typeField}</Typography>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state: IState) => {
  const code = DetailSelectors.selectCode(state);
  const description = DetailSelectors.selectDescription(state);
  const type = DetailSelectors.selectType(state);
  return { code, description, type };
};

export const DetailAttributeList = connect(mapStateToProps)(DetailAttributeListComponent);

export default DetailAttributeList;
