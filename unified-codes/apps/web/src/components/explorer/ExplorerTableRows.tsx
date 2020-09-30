import * as React from 'react';
import { connect } from 'react-redux';

import { EntityTableRows } from '@unified-codes/ui';
import { EEntityField } from '@unified-codes/data';

import { IExplorerAction } from '../../actions';
import { ExplorerSelectors } from '../../selectors';
import { IState } from '../../types';

const mapDispatchToProps = (_: React.Dispatch<IExplorerAction>) => ({});

const mapStateToProps = (state: IState) => {
    const columns = [ EEntityField.CODE, EEntityField.DESCRIPTION, EEntityField.TYPE ];
    const entities = ExplorerSelectors.selectEntities(state);

    return { columns, entities };
};

export const ExplorerTableRows = connect(mapStateToProps, mapDispatchToProps)(EntityTableRows);

export default ExplorerTableRows;