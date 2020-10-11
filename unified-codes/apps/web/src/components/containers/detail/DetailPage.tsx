import * as React from 'react';
import { connect } from 'react-redux';

import { makeStyles, createStyles } from '@unified-codes/ui/styles';

import DetailAttributeList from './DetailAttributeList';
import DetailChildList from './DetailChildList';
import DetailPropertyList from './DetailPropertyList';
import DetailLayout from '../../layout/DetailLayout';

import { IDetailAction } from '../../../actions';
import { ITheme } from '../../../styles';
import { IState } from '../../../types';

const useStyles = makeStyles((theme: ITheme) => createStyles({
    root: {
        width: '100%',
    },
    attributeListContainer: { 
        backgroundColor: theme.palette.background.footer,
        paddingBottom: 44,
    },
    childListContainer: {
        backgroundColor: theme.palette.background.default,
        margin: '-20px auto 0 auto',
        maxWidth: 900,
        width: '60%',
        borderRadius: 5,
    },
    propertyListContainer: {
        backgroundColor: theme.palette.background.default,
        margin: '0 auto 0 auto',
        maxWidth: 900,
        width: '60%',
        borderRadius: 5,
    },
}));

export interface DetailPageProps {
    onMount: () => void;
    onUnmount: () => void;
}

export type DetailPage = React.FunctionComponent<DetailPageProps>;

export const DetailPageComponent: DetailPage = ({ onMount, onUnmount }) => {
    const classes = useStyles();

    React.useEffect(() => {
        onMount();
        return onUnmount;
    }, []);

    return <DetailLayout classes={classes} attributeList={<DetailAttributeList/>} childList={<DetailChildList/>} propertyList={<DetailPropertyList/>} />;
};

const mapDispatchToProps = (_: React.Dispatch<IDetailAction>) => {
    const onMount = () => null;
    const onUnmount = () => null;
    return { onMount, onUnmount };
};

const mapStateToProps = (_: IState) => ({});

export const DetailPage = connect(mapStateToProps, mapDispatchToProps)(DetailPageComponent);

export default DetailPage;