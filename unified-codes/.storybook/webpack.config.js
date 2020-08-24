const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  const tsPaths = new TsconfigPathsPlugin({
    configFile: path.resolve(__dirname, '../.storybook/tsconfig.json'),
  });

  config.resolve.plugins
    ? config.resolve.plugins.push(tsPaths)
    : (config.resolve.plugins = [tsPaths]);

  config.node = {
    global: true,
    console: true,
    fs: 'empty',
  };

  // Return the altered config
  return config;
};
