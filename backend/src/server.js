const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');

const app = express();
const PORT = process.env.PORT || 3001;
const ALTERNATIVE_PORT = 8080; // Porta alternativa para evitar bloqueio

// Middleware de segurança
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requests por IP
});
app.use(limiter);

// CORS - Configuração simplificada para resolver problemas de bloqueio
app.use(cors({
  origin: function (origin, callback) {
    // Log para debug
    console.log('🔍 CORS Origin:', origin);

    // Permitir todas as origens em desenvolvimento
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'User-Agent'],
  optionsSuccessStatus: 200
}));

// Adicionar headers de segurança adicionais
app.use((req, res, next) => {
  req.setTimeout(30000); // 30s timeout
  console.log(`📥 Incoming ${req.method} request to ${req.path}`);
  console.log(`🌐 From IP: ${req.ip}`);
  console.log(`📱 User-Agent: ${req.headers['user-agent'] || 'unknown'}`);
  console.log(`🔗 Origin: ${req.headers.origin || 'unknown'}`);
  console.log(`📋 Headers: ${JSON.stringify(req.headers)}`);
  if (req.body) console.log(`📦 Body: ${JSON.stringify(req.body)}`);
  next();
});

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

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
prisma.$connect().then(() => console.log('✅ Conectado ao banco de dados')).catch(err => console.error('❌ Erro ao conectar ao banco:', err));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor LiftUp rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Acessível externamente: http://0.0.0.0:${PORT}/api/health`);
});

// Iniciar servidor na porta alternativa também
app.listen(ALTERNATIVE_PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor LiftUp rodando na porta alternativa ${ALTERNATIVE_PORT}`);
  console.log(`📊 Health check: http://localhost:${ALTERNATIVE_PORT}/api/health`);
  console.log(`🌐 Acessível externamente: http://0.0.0.0:${ALTERNATIVE_PORT}/api/health`);
}); 