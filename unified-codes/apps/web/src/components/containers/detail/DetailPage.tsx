import * as React from 'react';
import { connect } from 'react-redux';

import DetailAttributeList from './DetailAttributeList';
import DetailChildList from './DetailChildList';
import DetailPropertyList from './DetailPropertyList';
import DetailLayout from '../../layout/DetailLayout';

import { IDetailAction } from '../../../actions';
import { IState } from '../../../types';

export interface DetailPageProps {
    onMount: () => void;
    onUnmount: () => void;
}

export type DetailPage = React.FunctionComponent<DetailPageProps>;

export const DetailPageComponent: DetailPage = ({ onMount, onUnmount }) => {
    React.useEffect(() => {
        onMount();
        return onUnmount;
    }, []);

    return <DetailLayout attributeList={<DetailAttributeList/>} childList={<DetailChildList/>} propertyList={<DetailPropertyList/>} />;
};

const mapDispatchToProps = (_: React.Dispatch<IDetailAction>) => {
    const onMount = () => null;
    const onUnmount = () => null;
    return { onMount, onUnmount };
};

const mapStateToProps = (_: IState) => ({});

export const DetailPage = connect(mapStateToProps, mapDispatchToProps)(DetailPageComponent);

export default DetailPage;