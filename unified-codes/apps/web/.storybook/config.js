import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

const webContext = require.context('..', true, /.stories\.(j|t)sx?$/);
const libContext = require.context('../../../libs/ui/src/lib', true, /.stories\.(j|t)sx?$/);
configure([webContext, libContext], module);
addDecorator(withKnobs);
