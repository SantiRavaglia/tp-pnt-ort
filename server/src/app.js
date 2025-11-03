const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ ok: true, msg: 'Spotify mock API' }));
app.use('/api', routes);

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Middleware para registrar la hora de la solicitud
app.use((req, res, next) => {
    console.log(`Solicitud recibida a las: ${new Date().toISOString()}`);
    next();
});


module.exports = app;
