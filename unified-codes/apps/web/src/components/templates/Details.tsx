import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { IEntity, } from '@unified-codes/data';
import { DetailsActions } from '../../actions';
import { IState } from '../../types';

export interface DetailsProps {
 getEntity: (code: string) => void;
 entity?: IEntity
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

  // TODO: Create UI components and format this properly
  return <div>{JSON.stringify(entity)}</div>;
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
