import { addDecorator, addParameters, configure } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

const parameters = {
  options: {
    storySort: {
      method: 'alphabetical',
      order: [],
      locales: '',
    },
  },
};

addParameters(parameters);
configure(require.context('..', true, /.stories\.(j|t)sx?$/), module);
addDecorator(withKnobs);
