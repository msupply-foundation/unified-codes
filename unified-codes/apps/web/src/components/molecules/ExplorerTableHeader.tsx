import * as React from 'react';

import { connect } from 'react-redux';

import { EntityTableHeader } from '@unified-codes/ui';
import { EEntityField } from '@unified-codes/data';

import { ExplorerActions, IExplorerAction } from '../../actions';
import { ExplorerSelectors } from '../../selectors';
import { IState } from '../../types';

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
    const onSort = (column: string) => {
        dispatch(ExplorerActions.updateOrderBy(column as EEntityField));
        dispatch(ExplorerActions.updateOrderDesc(false));
    }

    return { onSort };
};

const mapStateToProps = (state: IState) => {
    const columns = [ EEntityField.CODE, EEntityField.DESCRIPTION, EEntityField.TYPE ];

    const orderBy = ExplorerSelectors.selectOrderBy(state);
    const orderDesc = ExplorerSelectors.selectOrderDesc(state);

    return { columns, orderBy, orderDesc };
};

export const ExplorerTableHeader = connect(mapStateToProps, mapDispatchToProps)(EntityTableHeader);

export default ExplorerTableHeader;