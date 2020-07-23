import * as React from 'react';
import MainPage from '../src/pages/MainPage';

export default {
    title: 'Pages',
    parameters: {
        info: { inline: true }
    },
};

export const Main = () => <MainPage/>;