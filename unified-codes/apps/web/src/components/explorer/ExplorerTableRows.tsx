import * as React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { EntityTableRows, IEntityTableRowsProps } from '@unified-codes/ui';
import { EEntityField, IEntity } from '@unified-codes/data';

import { DetailActions, IExplorerAction } from '../../actions';
import { ExplorerSelectors } from '../../selectors';
import { IState } from '../../types';

export type ExplorerTableRowsProps = IEntityTableRowsProps;

const ExplorerTableRowsComponent = (props: ExplorerTableRowsProps ) => {
    const history = useHistory();

    const onSelect = (entity: IEntity) => { 
        history.push(`/detail/${entity.code}`);
        props.onSelect(entity);
    }

    return <EntityTableRows {...props} onSelect={onSelect}/>
}

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
    const onSelect = (entity: IEntity) => dispatch(DetailActions.updateEntity(entity));
    return { onSelect };
};

const mapStateToProps = (state: IState) => {
    const columns = [ EEntityField.CODE, EEntityField.DESCRIPTION, EEntityField.TYPE ];
    const entities = ExplorerSelectors.selectEntities(state);

    return { columns, entities };
};

export const ExplorerTableRows = connect(mapStateToProps, mapDispatchToProps)(ExplorerTableRowsComponent);

export default ExplorerTableRows;
