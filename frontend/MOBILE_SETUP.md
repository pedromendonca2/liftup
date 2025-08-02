# Configuração do Aplicativo Móvel - LiftUp

## Problema
Quando você usa o aplicativo móvel sem tunnel, ele não consegue acessar `localhost` porque `localhost` no celular se refere ao próprio dispositivo, não ao seu computador.

## Solução Implementada

O sistema agora detecta automaticamente se está rodando no aplicativo móvel e usa o IP correto da rede local.

### Seu IP Atual
- **IP do computador**: `192.168.1.2`
- **URLs que o app tentará**:
  1. `http://192.168.1.2:8080/api`
  2. `http://192.168.1.2:3001/api`

## Como Testar

### 1. Verificar se o Servidor está Rodando
Abra no navegador do seu computador:
- `http://localhost:3001/api/health`
- `http://localhost:8080/api/health`

### 2. Testar no Celular
Abra no navegador do seu celular (mesma rede WiFi):
- `http://192.168.1.2:3001/api/health`
- `http://192.168.1.2:8080/api/health`

### 3. Testar o Aplicativo
1. Inicie o servidor: `npm start` (no diretório backend)
2. Inicie o frontend: `npx expo start` (no diretório frontend)
3. Escaneie o QR code com o Expo Go
4. Tente fazer login no aplicativo

## Logs de Debug

No aplicativo, abra o console do Expo Go para ver os logs:
- 🌐 URL sendo tentada
- 📱 Plataforma detectada
- ✅ Resposta recebida
- ❌ Falha na requisição

## Se o IP Mudar

Se o IP do seu computador mudar:

1. **Descobrir o novo IP**:
   ```bash
   ipconfig
   ```
   Procure por "Endereço IPv4" no adaptador Ethernet.

2. **Atualizar a configuração**:
   - Edite o arquivo `frontend/services/api.ts`
   - Substitua `192.168.1.2` pelo novo IP
   - Ou use variável de ambiente: `EXPO_PUBLIC_API_URL=http://novo-ip:8080/api`

## Troubleshooting

### Problema: App não conecta
**Soluções**:
1. Verifique se o celular está na mesma rede WiFi
2. Teste no navegador do celular: `http://192.168.1.2:8080/api/health`
3. Verifique se o firewall não está bloqueando
4. Tente desabilitar temporariamente o antivírus

### Problema: IP mudou
**Solução**:
1. Execute `ipconfig` para descobrir o novo IP
2. Atualize o arquivo `api.ts` com o novo IP
3. Reinicie o aplicativo

### Problema: Porta bloqueada
**Solução**:
- O sistema tenta automaticamente as portas 8080 e 3001
- Se uma porta estiver bloqueada, ele tentará a outra

## Configuração Avançada

### Variável de Ambiente
Crie um arquivo `.env` no diretório `frontend/`:
```
EXPO_PUBLIC_API_URL=http://192.168.1.2:8080/api
```

### Configuração Manual
Se precisar configurar manualmente, edite `frontend/services/api.ts`:
```typescript
const MOBILE_API_URLS = [
  'http://SEU-IP-AQUI:8080/api',
  'http://SEU-IP-AQUI:3001/api',
  // ... outras URLs
];
```

## Dicas

1. **Mantenha o celular e computador na mesma rede WiFi**
2. **Use a porta 8080** (menos bloqueada por firewalls)
3. **Verifique os logs** para identificar problemas
4. **Teste no navegador do celular** antes de testar no app 