const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// CORS simples
app.use(cors({
    origin: true,
    credentials: true
}));

// Middleware para parsing JSON
app.use(express.json());

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Teste API está funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rota de teste de login
app.post('/api/auth/login', (req, res) => {
    console.log('📝 Login attempt:', req.body);
    res.json({
        success: true,
        message: 'Login testado com sucesso!',
        user: {
            id: 'test-user',
            email: req.body.email,
            name: 'Usuário Teste'
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor de teste rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 