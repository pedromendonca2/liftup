# Forçar Uso do Tunnel - Solução Definitiva

## Problema
O aplicativo móvel não consegue se conectar ao servidor mesmo com tunnel.

## Solução Forçada

### 1. Criar Arquivo de Configuração
Crie um arquivo `.env` no diretório `frontend/` com o seguinte conteúdo:

```
EXPO_PUBLIC_USE_TUNNEL=true
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. Como Criar o Arquivo

#### No Windows (PowerShell):
```powershell
cd frontend
echo "EXPO_PUBLIC_USE_TUNNEL=true" > .env
echo "EXPO_PUBLIC_API_URL=http://localhost:8080/api" >> .env
```

#### No WSL (Linux):
```bash
cd frontend
cat > .env << EOF
EXPO_PUBLIC_USE_TUNNEL=true
EXPO_PUBLIC_API_URL=http://localhost:8080/api
EOF
```

### 3. Testar

#### Passo 1: Servidor
```bash
cd backend
node src/server.js
```

#### Passo 2: Frontend
```bash
cd frontend
npx expo start --tunnel
```

#### Passo 3: Aplicativo
1. Escaneie o QR code
2. Tente fazer login
3. Verifique os logs

### 4. Logs Esperados
Você deve ver:
- `🔧 Tunnel detectado via variável de ambiente`
- `🌐 Usando tunnel: true`
- `🌐 Usando URLs de tunnel`
- `🌐 Tentando requisição para: http://localhost:8080/api/auth/login`

### 5. Se Ainda Não Funcionar

#### Teste no Navegador do Celular
Abra no navegador do celular:
- `http://localhost:8080/api/health`

#### Verifique o QR Code
O QR code deve mostrar uma URL com `exp.direct` ou similar.

#### Teste Diferentes URLs
Se `localhost:8080` não funcionar, tente:
- `http://localhost:3001/api`
- `http://127.0.0.1:8080/api`
- `http://127.0.0.1:3001/api`

### 6. Configuração Alternativa
Se nada funcionar, modifique o arquivo `.env`:
```
EXPO_PUBLIC_USE_TUNNEL=true
EXPO_PUBLIC_API_URL=http://127.0.0.1:8080/api
```

### 7. Debug Avançado
No aplicativo, você verá logs detalhados:
- `💥 Tipo do erro: [tipo]`
- `💥 Mensagem do erro: [mensagem]`
- `🔄 Tentando múltiplas URLs como fallback...`

Isso ajudará a identificar exatamente qual é o problema. 