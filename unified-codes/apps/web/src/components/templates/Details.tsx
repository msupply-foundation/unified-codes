import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { IEntity, Property } from '@unified-codes/data';
import {
  EntityDetailList,
  IExternalLink,
  Grid,
  Typography,
  CircularProgress,
  Backdrop,
} from '@unified-codes/ui';

import { DetailsActions } from '../../actions';
import { IState } from '../../types';
import { ITheme } from '../../muiTheme';

import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

export interface DetailsProps {
  getEntity: (code: string) => void;
  entity?: IEntity;
  classes: ClassNameMap<any>;
  isLoading: boolean;
}

const getStyles = (theme: ITheme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    paddingLeft: 20,
    paddingTop: 20
  }
});

interface IDetailsParameters {
  code: string;
}

export type Details = React.FunctionComponent<DetailsProps>;

export const DetailsComponent: Details = ({ classes, entity, isLoading, getEntity }) => {
  const { code } = useParams<IDetailsParameters>();

  React.useEffect(() => {
    getEntity(code);
  }, []);

  let productSubCategories: IEntity[] = [];
  let externalLinks: IExternalLink[] = [];
  let properties: Property[] = [];

  entity?.has_child?.forEach((child) => {
    productSubCategories.push(child);
  });

  entity?.has_property?.forEach((property) => {
    switch (property.type) {
      case 'code_nzulm':
        externalLinks.push({
          type: 'NZULM',
          url: `${process.env.NX_NZULM_URL}/${process.env.NX_NZULM_PRODUCT_SEARCH}&id=${property.value}`,
        });
        break;
      default:
        properties.push({
          type: property.type,
          value: property.value,
        });
        break;
    }
  });

  return (
    <Grid container className={classes.root} direction="column">
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="h4">Name: {entity?.description}</Typography>
      <Typography variant="h5">Code: {entity?.code}</Typography>
      <EntityDetailList
        productSubCategories={productSubCategories}
        externalLinks={externalLinks}
        entityProperties={properties}
      />
    </Grid>
  );
};

const mapStateToProps = (state: IState) => {
  const entity = state.details.entity;
  const isLoading = state.details.loading;
  return { entity, isLoading };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const getEntity = (code: string) => dispatch(DetailsActions.fetchEntity(code));
  return { getEntity };
};

export const StyledDetails = withStyles(getStyles)(DetailsComponent);
export const Details = connect(mapStateToProps, mapDispatchToProps)(StyledDetails);
export default Details;
