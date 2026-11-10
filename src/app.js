const express = require('express');
const path = require('node:path');
const learningRoutes = require('./routes/learning');
const app = express();

app.disable('x-powered-by');
app.use('/api', learningRoutes);

// Serve HTML, CSS, browser JavaScript, and editable learning files.
app.use(express.static(path.join(__dirname, '..', 'public'), {
  etag: false,
  maxAge: 0,
  setHeaders(response) {
    response.setHeader('Cache-Control', 'no-cache');
  },
}));

app.use((request, response) => {
  response.status(404).json({ error: 'Halaman tidak ditemukan.' });
});
module.exports = app;
