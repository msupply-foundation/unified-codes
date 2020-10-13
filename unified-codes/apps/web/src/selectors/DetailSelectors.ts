import { IEntity } from '@unified-codes/data';
import { createSelector } from 'reselect';
import { IDetailState, IState } from '../types';

const selectDetail = (state: IState): IDetailState => state.detail;

const selectEntity = createSelector(selectDetail, (detail: IDetailState) => detail?.entity);

const selectCode = createSelector(selectEntity, (entity: IEntity) => entity?.code);

const selectDescription = createSelector(selectEntity, (entity: IEntity) => entity?.description);

const selectType = createSelector(selectEntity, (entity: IEntity) => entity?.type);

const selectChildren = createSelector(selectEntity, (entity: IEntity) => entity?.children);

const selectProperties = createSelector(selectEntity, (entity: IEntity) => entity?.properties);

export const DetailSelectors = {
  selectEntity,
  selectCode,
  selectDescription,
  selectType,
  selectChildren,
  selectProperties,
};

export default DetailSelectors;
