import api from './api.js';
import graphApi from './graphql/api.js'

const start = async () => {
  try {
    await api.listen(3000);
    await graphApi.listen(4000);
  } catch (err) {
    api.log.error(err);
    process.exit(1);
  }
};

start();
