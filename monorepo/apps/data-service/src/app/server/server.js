import graphApi from './api.js';

const start = async () => {
  try {
    await graphApi.listen(4000);
  } catch (err) {
    graphApi.log.error(err);
    process.exit(1);
  }
};

start();
