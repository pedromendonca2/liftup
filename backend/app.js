const cors = require('cors');
const express = require('express');

const authRoutes = require('./src/api/routes/authRoutes');
const userRoutes = require('./src/api/routes/userRoutes');
const workoutRoutes = require('./src/api/routes/workoutRoutes');

const app = express();

const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(cors({ origin: configuredOrigins.length > 0 ? configuredOrigins : true }));
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'liftup-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ message: 'JSON inválido.' });
  }

  console.error('Erro não tratado:', error);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
});

module.exports = app;
