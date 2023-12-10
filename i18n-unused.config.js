// Info: https://www.npmjs.com/package/i18n-unused

module.exports = {
  localesPath: 'frontend/common/src/intl/locales',
  srcPath: 'frontend',
  ignorePaths: [
    'frontend/common/node_modules',
    'frontend/config/node_modules',
    'frontend/dashboard/node_modules',
    'frontend/host/node_modules',
    'frontend/host/dist',
    'frontend/system/node_modules',
    'frontend/template/node_modules',
    '../node_modules',
  ],
  flatTranslations: true,
};
