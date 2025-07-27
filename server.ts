import app from './app.js';
import config from './src/config/environment.js';

(async () => {
  const port = process.env.PORT ? Number(process.env.PORT) : config.port;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
})();
