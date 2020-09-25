import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { IEntity, Property } from '@unified-codes/data';
import { EntityDetails, IFormCategory, IExternalLink, Typography, Grid, CircularProgress, Backdrop } from '@unified-codes/ui';

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
  }
});

interface IDetailsParameters {
  code: string;
}

interface IDetailsParameters {
  code: string;
}

export type Details = React.FunctionComponent<DetailsProps>;

export const DetailsComponent: Details = ({ classes, entity, getEntity, isLoading }) => {
  const { code } = useParams<IDetailsParameters>();

  React.useEffect(() => {
    getEntity(code);
  }, []);

  let formCategories: IFormCategory[] = [];
  let externalLinks: IExternalLink[] = [];
  let properties: Property[] = [];

  entity?.has_child?.forEach((child) => {
    if (child.type == 'form_category') {
      formCategories.push({
        name: child.description,
        forms: child.has_child?.map((child) => child.description),
      });
    }
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
    <Grid container direction="column">
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="h4">{entity?.description}</Typography> 
      <EntityDetails formCategories={formCategories} externalLinks={externalLinks} entityProperties={properties} />
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
