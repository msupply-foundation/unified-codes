import * as React from 'react';
import HomePage from '../src/pages/HomePage';

export default {
    title: 'Pages',
    parameters: {
        info: { inline: true }
    },
};

export const Home = () => <HomePage/>;