# Configuração da API - LiftUp

## Problema Resolvido

O problema com o tunnel do Expo Go foi causado por:

1. **URL hardcoded no frontend**: O arquivo `api.ts` estava usando uma URL IP específica que não funcionava com tunnel
2. **CORS não configurado para URLs do tunnel**: O servidor não aceitava requisições das URLs geradas pelo tunnel do Expo
3. **Ad blocker bloqueando requisições**: O erro `ERR_BLOCKED_BY_CLIENT` indica que um ad blocker estava bloqueando as requisições
4. **Aplicativo móvel não consegue acessar localhost**: Quando não usa tunnel, o app móvel precisa do IP da rede local

## Soluções Implementadas

### 1. URL Dinâmica no Frontend
- O frontend agora usa `localhost:3001` em desenvolvimento, que funciona tanto localmente quanto com tunnel
- Adicionada suporte para variável de ambiente `EXPO_PUBLIC_API_URL`
- **NOVO**: Sistema de fallback que tenta múltiplas URLs automaticamente
- **NOVO**: Detecção automática de plataforma (web vs móvel)

### 2. CORS Flexível no Backend
- Configuração de CORS simplificada que aceita todas as origens em desenvolvimento
- Headers adicionais para evitar bloqueios
- **NOVO**: Servidor rodando em duas portas (3001 e 8080) para evitar bloqueios

### 3. Sistema de Fallback Inteligente
- **Web**: Tenta localhost primeiro
- **Móvel**: Tenta IP da rede local primeiro
- URLs tentadas automaticamente até encontrar uma que funcione

## Como Usar

### Desenvolvimento Local (sem tunnel)
```bash
# No frontend, a URL será automaticamente: http://localhost:3001/api
npx expo start
```

### Desenvolvimento com Tunnel
```bash
# O sistema tentará automaticamente múltiplas URLs até encontrar uma que funcione
npx expo start --tunnel
```

### Aplicativo Móvel (sem tunnel)
```bash
# O sistema detectará automaticamente que está no móvel e usará o IP da rede local
npx expo start
```

## Configuração para Aplicativo Móvel

### IP da Rede Local
O sistema agora detecta automaticamente se está rodando no aplicativo móvel e usa o IP correto da rede local:
- **Seu IP atual**: `192.168.1.2`
- **URLs tentadas**: 
  1. `http://192.168.1.2:8080/api`
  2. `http://192.168.1.2:3001/api`
  3. Outras URLs de fallback

### Verificar IP do Computador
Se o IP mudar, execute no terminal:
```bash
ipconfig
```
Procure por "Endereço IPv4" no adaptador Ethernet.

### Configuração Personalizada
Crie um arquivo `.env` no diretório `frontend/` com:
```
EXPO_PUBLIC_API_URL=http://192.168.1.2:8080/api
```

## Solução para Ad Blocker

Se você ainda estiver enfrentando o erro `ERR_BLOCKED_BY_CLIENT`:

1. **Desabilite temporariamente o ad blocker** para o domínio localhost
2. **Use a porta 8080**: O servidor agora roda em ambas as portas 3001 e 8080
3. **Configure o ad blocker**: Adicione `localhost:3001` e `localhost:8080` à lista de exceções

## URLs Suportadas pelo CORS

O servidor agora aceita:
- `localhost` (todas as portas)
- URLs do tunnel do Expo (`exp.direct`, `u.expo.dev`)
- IPs locais para emuladores
- **Todas as origens em modo desenvolvimento**

## Debug

Para verificar se está funcionando:
1. Verifique os logs do servidor backend - você verá logs de CORS
2. No frontend, a URL da API será logada no console
3. Execute o script de teste: `node backend/test-network.js`
4. Teste o login - deve funcionar tanto localmente quanto com tunnel

## Logs de Debug

O sistema agora mostra logs detalhados:
- 🌐 URL sendo tentada
- 📋 Headers da requisição
- 📡 Status da resposta
- ✅ Resposta recebida
- 🔄 Tentativas de fallback
- 📱 Plataforma detectada (web/móvel)

## Troubleshooting Aplicativo Móvel

### Problema: App não conecta sem tunnel
**Solução**: 
1. Verifique se o celular está na mesma rede WiFi
2. Confirme o IP do computador: `ipconfig`
3. Teste no navegador do celular: `http://192.168.1.2:8080/api/health`

### Problema: IP mudou
**Solução**:
1. Execute `ipconfig` para descobrir o novo IP
2. Atualize o arquivo `api.ts` com o novo IP
3. Ou use variável de ambiente: `EXPO_PUBLIC_API_URL=http://novo-ip:8080/api` 