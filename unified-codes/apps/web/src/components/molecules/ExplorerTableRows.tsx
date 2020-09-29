import * as React from 'react';
import { connect } from 'react-redux';

import { EntityTableRows } from '@unified-codes/ui';
import { EEntityField } from '@unified-codes/data';

import { ExplorerSelectors } from '../../selectors';
import { IState } from '../../types';

const mapStateToProps = (state: IState) => {
    const columns = [ EEntityField.CODE, EEntityField.DESCRIPTION, EEntityField.TYPE ];
    const entities = ExplorerSelectors.selectEntities(state);

    return { columns, entities };
};

export const ExplorerTableRows = connect(mapStateToProps)(EntityTableRows);

export default ExplorerTableRows;