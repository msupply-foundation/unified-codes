const nrwlConfig = require('@nrwl/react/plugins/webpack.js');

module.exports = (config, context) => {
  nrwlConfig(config);

  config.node = {
    global: true,
    console: true,
    fs: 'empty',
  };

  return config;
};
