import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { IEntity, Property } from '@unified-codes/data';
import { EntityDetails, IFormCategory, IExternalLink, Typography, Grid } from '@unified-codes/ui';
import { DetailsActions } from '../../actions';
import { IState } from '../../types';

export interface DetailsProps {
  getEntity: (code: string) => void;
  entity?: IEntity;
}

interface IDetailsParameters {
  code: string;
}

export type Details = React.FunctionComponent<DetailsProps>;

export const DetailsComponent: Details = ({ entity, getEntity }) => {
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
    <Grid direction="row">
      <Typography variant="h4">{entity?.description}</Typography> 
      <EntityDetails formCategories={formCategories} externalLinks={externalLinks} entityProperties={properties} />
    </Grid>
  );
};

const mapStateToProps = (state: IState) => {
  const entity = state.details.entity;
  return { entity };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const getEntity = (code: string) => dispatch(DetailsActions.fetchEntity(code));
  return { getEntity };
};

export const Details = connect(mapStateToProps, mapDispatchToProps)(DetailsComponent);
export default Details;
