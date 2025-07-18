const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de segurança
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requests por IP
});
app.use(limiter);

// CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:19006',
    'http://localhost:19000',
    'http://localhost:19001',
    'http://localhost:19002',
    'http://10.0.2.2:19006',
    'http://172.20.173.132:19006',
    'http://172.20.160.1:19006',
    'exp://localhost:19000',
    'exp://localhost:19001',
    'exp://localhost:19002',
    'exp://10.0.2.2:19000',
    'exp://10.0.2.2:19001',
    'exp://10.0.2.2:19002',
    'exp://172.20.173.132:19000',
    'exp://172.20.173.132:19001',
    'exp://172.20.173.132:19002',
    'exp://172.20.160.1:19000',
    'exp://172.20.160.1:19001',
    'exp://172.20.160.1:19002'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'LiftUp API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor LiftUp rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Acessível externamente: http://0.0.0.0:${PORT}/api/health`);
}); 