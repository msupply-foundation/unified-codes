import { addDecorator, addParameters, configure } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

const webContext = require.context('..', true, /.stories\.(j|t)sx?$/);
const libContext = require.context('../../../libs/ui/src/lib', true, /.stories\.(j|t)sx?$/);
const parameters = {
  options: {
    storySort: {
      method: 'alphabetical',
      order: [],
      locales: '',
    },
  },
};

configure([webContext, libContext], module);
addDecorator(withKnobs);
addParameters(parameters);
