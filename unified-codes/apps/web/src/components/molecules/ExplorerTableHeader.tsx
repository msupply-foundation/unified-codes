import * as React from 'react';

import { connect } from 'react-redux';

import { EntityTableHeader } from '@unified-codes/ui';
import { EEntityField } from '@unified-codes/data';

import { TableActions, ITableAction } from '../../actions/explorer';
import { TableSelectors } from '../../selectors/explorer';
import { IState } from '../../types';

const mapDispatchToProps = (dispatch: React.Dispatch<ITableAction>) => {
    const onSort = (column: string) => {
        dispatch(TableActions.updateOrderBy(column as EEntityField));
        dispatch(TableActions.updateOrderDesc(false));
    }

    return { onSort };
};

const mapStateToProps = (state: IState) => {
    const columns = [ EEntityField.CODE, EEntityField.DESCRIPTION, EEntityField.TYPE ];

    const orderBy = TableSelectors.selectOrderBy(state);
    const orderDesc = TableSelectors.selectOrderDesc(state);

    return { columns, orderBy, orderDesc };
};

export const ExplorerTableHeader = connect(mapStateToProps, mapDispatchToProps)(EntityTableHeader);

export default ExplorerTableHeader;