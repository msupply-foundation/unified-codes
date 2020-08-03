import api from './api';

const start = async (): Promise<void> => {
  try {
    await api.listen(3000);
  } catch (err) {
    api.log.error(err);
    process.exit(1);
  }
};

start();
