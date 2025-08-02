# Guia de Solução de Problemas - ERR_BLOCKED_BY_CLIENT

## Problema
O erro `net::ERR_BLOCKED_BY_CLIENT` indica que uma requisição está sendo bloqueada, geralmente por:
- Ad blocker (uBlock Origin, AdBlock Plus, etc.)
- Extensões de navegador
- Firewall ou antivírus
- Configurações de rede corporativa

## Soluções

### 1. Desabilitar Ad Blocker Temporariamente
1. Clique no ícone do seu ad blocker
2. Desabilite para `localhost` ou `127.0.0.1`
3. Adicione às exceções:
   - `localhost:3001`
   - `localhost:8080`
   - `127.0.0.1:3001`
   - `127.0.0.1:8080`

### 2. Usar Modo Incógnito
- Abra o navegador em modo incógnito/privado
- Os ad blockers geralmente não funcionam neste modo

### 3. Configurar Exceções no Ad Blocker
Para **uBlock Origin**:
1. Clique no ícone do uBlock
2. Clique em "Dashboard"
3. Vá em "My filters"
4. Adicione estas linhas:
```
@@||localhost:3001^
@@||localhost:8080^
@@||127.0.0.1:3001^
@@||127.0.0.1:8080^
```

### 4. Usar Porta Diferente
O sistema agora tenta automaticamente a porta 8080 primeiro, que é menos bloqueada.

### 5. Verificar Firewall/Antivírus
- Verifique se o Windows Defender está bloqueando
- Configure exceções para o Node.js
- Desabilite temporariamente o antivírus para teste

### 6. Usar IP Local
Se `localhost` estiver bloqueado, tente:
- `http://127.0.0.1:8080/api`
- `http://127.0.0.1:3001/api`

### 7. Configuração de Rede
Para **rede corporativa**:
- Verifique se há proxy configurado
- Configure o proxy no Node.js se necessário
- Use VPN se disponível

## Teste de Conectividade

### 1. Testar no Navegador
Abra estas URLs no navegador:
- `http://localhost:3001/api/health`
- `http://localhost:8080/api/health`
- `http://127.0.0.1:3001/api/health`
- `http://127.0.0.1:8080/api/health`

### 2. Testar com curl
```bash
curl http://localhost:3001/api/health
curl http://localhost:8080/api/health
```

### 3. Verificar Logs
- No frontend: Abra o console do navegador
- No backend: Verifique os logs do servidor
- Procure por mensagens de CORS ou erro

## Configuração Avançada

### Variável de Ambiente
Crie um arquivo `.env` no diretório `frontend/`:
```
EXPO_PUBLIC_API_URL=http://127.0.0.1:8080/api
```

### Configuração Manual
Se nada funcionar, você pode modificar manualmente o arquivo `api.ts`:
```typescript
const API_URLS = [
  'http://127.0.0.1:8080/api',  // Forçar IP local
  'http://localhost:8080/api',
  // ... outras URLs
];
```

## Logs de Debug

O sistema agora mostra logs detalhados. Procure por:
- 🌐 URL sendo tentada
- ❌ Falha na requisição
- 🔄 Tentativas de fallback
- ✅ Resposta recebida

## Contato

Se o problema persistir:
1. Verifique se o servidor está rodando
2. Teste as URLs no navegador
3. Verifique os logs de debug
4. Tente desabilitar temporariamente todas as extensões 