const http = require('http');

// Testar conectividade na rede local
const testUrls = [
    'http://localhost:3001/api/health',
    'http://localhost:8080/api/health',
    'http://127.0.0.1:3001/api/health',
    'http://127.0.0.1:8080/api/health',
    'http://192.168.1.2:3001/api/health',  // IP do computador na rede local
    'http://192.168.1.2:8080/api/health',
    'http://0.0.0.0:3001/api/health',
    'http://0.0.0.0:8080/api/health'
];

console.log('🌐 Testando conectividade na rede local...\n');

testUrls.forEach(url => {
    const req = http.get(url, (res) => {
        console.log(`✅ ${url} - Status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.log(`❌ ${url} - Erro: ${err.message}`);
    });

    req.setTimeout(3000, () => {
        console.log(`⏰ ${url} - Timeout`);
        req.destroy();
    });
}); 