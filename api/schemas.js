const S = require("fluent-schema");

const health = {
  response: {
    200: S.object().prop("mysql", S.string()).prop("api", S.string()),
  },
};

const items = {
  queryString: S.object().prop("code", S.string()),
  response: {
    200: S.object().prop("name", S.string()).prop("code", S.string()),
    404: S.object().prop("error", S.string()),
  },
};

const version = {
  response: {
    200: S.object()
      .prop("version", S.string())
      .prop("versionShort", S.string()),
  },
};

module.exports = { health, items, version };
