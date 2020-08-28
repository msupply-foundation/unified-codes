import { addParameters, addDecorator, configure } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

const parameters = {
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['withNoProps'],
      locales: '',
    },
  },
};

addDecorator(withKnobs);
addParameters(parameters);
configure(require.context('../src/lib', true, /\.stories\.(j|t)sx?$/), module);
