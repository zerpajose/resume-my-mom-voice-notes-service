import app from './app.js';

(async () => {
  const port = process.env.PORT ? Number(process.env.PORT) : 8080;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
})();
