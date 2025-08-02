# Solução para Tunnel no Aplicativo Móvel

## Problema
- Servidor funciona no web com tunnel
- Aplicativo móvel não funciona com tunnel
- Erro: "Network request failed"

## Solução Implementada

### 1. Configuração Simplificada
- O sistema agora sempre tenta `localhost` primeiro
- Funciona tanto para web quanto para aplicativo móvel
- URLs tentadas automaticamente:
  1. `http://localhost:8080/api`
  2. `http://localhost:3001/api`
  3. `http://127.0.0.1:8080/api`
  4. `http://127.0.0.1:3001/api`

### 2. Como Testar

#### Passo 1: Servidor
```bash
cd backend
node src/server.js
```

#### Passo 2: Frontend com Tunnel
```bash
cd frontend
npx expo start --tunnel
```

#### Passo 3: Testar
1. Escaneie o QR code com o Expo Go
2. Tente fazer login
3. Verifique os logs no console do Expo Go

### 3. Logs Esperados
No aplicativo, você deve ver:
- `🌐 Usando tunnel: true`
- `🌐 Usando URLs de tunnel`
- `🌐 Tentando requisição para: http://localhost:8080/api/auth/login`
- `✅ Resposta recebida de http://localhost:8080/api/auth/login`

### 4. Se Ainda Não Funcionar

#### Opção A: Forçar Configuração
Crie um arquivo `.env` no diretório `frontend/`:
```
EXPO_PUBLIC_USE_TUNNEL=true
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

#### Opção B: Testar no Navegador do Celular
Abra no navegador do celular:
- `http://localhost:8080/api/health`

#### Opção C: Usar Rede Local
Se o tunnel não funcionar, use rede local:
```bash
npx expo start  # sem --tunnel
```

### 5. Troubleshooting

**Problema**: App não conecta
**Solução**: 
1. Verifique se o servidor está rodando
2. Teste no navegador: `http://localhost:8080/api/health`
3. Reinicie o aplicativo

**Problema**: Tunnel lento
**Solução**: Use rede local em vez de tunnel

**Problema**: Erro persistente
**Solução**: Verifique os logs do aplicativo para ver qual URL está sendo tentada 