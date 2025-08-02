# Solução Final - Tunnel no Aplicativo Móvel

## Problema
- Servidor funciona no web com tunnel
- Aplicativo móvel não funciona com tunnel
- Erro: "Network request failed"

## Solução Definitiva

### 1. Configuração Atual
O arquivo `.env` foi configurado com:
```
EXPO_PUBLIC_USE_TUNNEL=true
EXPO_PUBLIC_API_URL=http://127.0.0.1:8080/api
```

### 2. Como Testar

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

### 3. Logs Esperados
Você deve ver:
- `🔧 Tunnel detectado via variável de ambiente`
- `🌐 Usando tunnel: true`
- `🌐 Usando URLs de tunnel + fallback local`
- `🌐 Tentando requisição para: http://127.0.0.1:8080/api/auth/login`

### 4. URLs Testadas Automaticamente

#### Com Tunnel (Primeiro):
1. `http://localhost:8080/api`
2. `http://localhost:3001/api`
3. `http://127.0.0.1:8080/api`
4. `http://127.0.0.1:3001/api`

#### Fallback Local (Se tunnel falhar):
5. `http://172.20.173.132:8080/api`
6. `http://172.20.173.132:3001/api`
7. `http://192.168.1.2:8080/api`
8. `http://192.168.1.2:3001/api`
9. `http://10.0.2.2:8080/api`
10. `http://10.0.2.2:3001/api`

### 5. Se Ainda Não Funcionar

#### Opção A: Testar no Navegador do Celular
Abra no navegador do celular:
- `http://127.0.0.1:8080/api/health`
- `http://localhost:8080/api/health`

#### Opção B: Usar Rede Local
Se o tunnel não funcionar, use rede local:
```bash
npx expo start  # sem --tunnel
```

#### Opção C: Configuração Manual
Modifique o arquivo `.env`:
```
EXPO_PUBLIC_USE_TUNNEL=false
EXPO_PUBLIC_API_URL=http://172.20.173.132:8080/api
```

### 6. Debug Avançado

#### No Aplicativo:
- Verifique os logs no console do Expo Go
- Procure por mensagens de erro específicas
- Veja qual URL está sendo tentada

#### No Servidor:
- Verifique os logs do servidor
- Procure por requisições recebidas
- Veja se há erros de CORS

### 7. Possíveis Causas

1. **Firewall**: Windows Defender pode estar bloqueando
2. **Antivírus**: Pode estar interferindo
3. **Rede**: Configuração de rede corporativa
4. **Expo Go**: Versão desatualizada
5. **Tunnel**: Problemas com o serviço de tunnel

### 8. Soluções Alternativas

#### Desabilitar Firewall Temporariamente
1. Abra Windows Defender
2. Desabilite temporariamente
3. Teste o aplicativo
4. Reabilite após o teste

#### Usar VPN
Se estiver em rede corporativa, tente usar VPN.

#### Atualizar Expo Go
Certifique-se de que está usando a versão mais recente.

### 9. Configuração de Último Recurso

Se nada funcionar, use esta configuração no `.env`:
```
EXPO_PUBLIC_USE_TUNNEL=false
EXPO_PUBLIC_API_URL=http://172.20.173.132:8080/api
```

E inicie sem tunnel:
```bash
npx expo start
```

Isso deve funcionar garantidamente se o celular estiver na mesma rede WiFi. 