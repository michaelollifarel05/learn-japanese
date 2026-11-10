// Entry point: start Express using environment settings.
const app = require('./src/app');
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '127.0.0.1';

if (require.main === module) {
  app.listen(port, host, () => {
    console.log(`Kotoba Garden: http://localhost:${port}`);
  });
}
module.exports = app;
