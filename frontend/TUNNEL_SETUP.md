# Configuração do Tunnel - LiftUp

## Problema
Quando você usa `npx expo start --tunnel`, o aplicativo móvel não consegue se conectar ao servidor, mesmo funcionando no web.

## Solução

### 1. Configuração Automática
O sistema agora detecta automaticamente quando está usando tunnel e usa as URLs corretas.

### 2. Configuração Manual (se necessário)
Se o sistema não detectar automaticamente, crie um arquivo `.env` no diretório `frontend/`:

```
EXPO_PUBLIC_USE_TUNNEL=true
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Como Usar

#### Com Tunnel (Recomendado)
```bash
# 1. Inicie o servidor backend
cd backend
npm start

# 2. Em outro terminal, inicie o frontend com tunnel
cd frontend
npx expo start --tunnel
```

#### Sem Tunnel (Rede Local)
```bash
# 1. Inicie o servidor backend
cd backend
npm start

# 2. Em outro terminal, inicie o frontend sem tunnel
cd frontend
npx expo start
```

## Logs de Debug

No aplicativo, você verá logs como:
- `🌐 Usando tunnel: true` (quando detecta tunnel)
- `🌐 Usando URLs de tunnel` (quando usa URLs de tunnel)
- `🌐 Tentando requisição para: http://localhost:8080/api/auth/login`

## Troubleshooting

### Problema: App não conecta com tunnel
**Soluções**:
1. Verifique se o servidor está rodando: `http://localhost:8080/api/health`
2. Force o uso do tunnel criando o arquivo `.env` com `EXPO_PUBLIC_USE_TUNNEL=true`
3. Reinicie o aplicativo após criar o arquivo `.env`

### Problema: Tunnel lento
**Soluções**:
1. Use rede local em vez de tunnel: `npx expo start` (sem --tunnel)
2. Configure o IP da rede local no arquivo `api.ts`

### Problema: Erro "Network request failed"
**Soluções**:
1. Verifique se o servidor está rodando
2. Teste no navegador: `http://localhost:8080/api/health`
3. Verifique os logs do aplicativo para ver qual URL está sendo tentada

## URLs Testadas Automaticamente

### Com Tunnel
1. `http://localhost:8080/api`
2. `http://localhost:3001/api`
3. `http://127.0.0.1:8080/api`
4. `http://127.0.0.1:3001/api`

### Sem Tunnel (Móvel)
1. `http://172.20.173.132:8080/api`
2. `http://172.20.173.132:3001/api`
3. `http://192.168.1.2:8080/api`
4. `http://192.168.1.2:3001/api`

## Dicas

1. **Use a porta 8080**: Menos bloqueada por firewalls
2. **Verifique os logs**: O sistema mostra exatamente qual URL está sendo tentada
3. **Teste no navegador**: Sempre teste a URL no navegador antes de testar no app
4. **Reinicie o app**: Após mudanças na configuração, reinicie o aplicativo 