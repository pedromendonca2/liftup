# Teste Específico para Expo Go

## Problema
- Servidor funciona no web
- Expo Go no celular não consegue se conectar
- Erro: "Network request failed"

## Solução Implementada

### 1. Configuração Atual
- URL forçada: `http://10.0.2.2:8080/api` (específica para Expo Go)
- Sistema de fallback que tenta múltiplas URLs
- Detecção automática de Expo Go

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
1. Escaneie o QR code com o Expo Go
2. Tente fazer login
3. Verifique os logs no console do Expo Go

### 3. Logs Esperados
Você deve ver:
- `🚀 API Base URL inicial: http://10.0.2.2:8080/api`
- `📱 É Expo Go: true`
- `🌐 Fazendo requisição para: http://10.0.2.2:8080/api/auth/login`
- `✅ Resposta recebida: [dados]`

### 4. Se Ainda Não Funcionar

#### Teste no Navegador do Celular
Abra no navegador do celular:
- `http://10.0.2.2:8080/api/health`
- `http://localhost:8080/api/health`

#### Verifique o QR Code
O QR code deve mostrar uma URL com `exp.direct` ou similar.

#### Teste Diferentes URLs
Se `10.0.2.2:8080` não funcionar, o sistema tentará:
1. `http://10.0.2.2:3001/api`
2. `http://localhost:8080/api`
3. `http://localhost:3001/api`

### 5. Configuração Alternativa
Se nada funcionar, modifique o arquivo `.env`:
```
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

### 6. Debug Avançado
No aplicativo, você verá logs detalhados:
- `🔄 Tentando URLs: [lista de URLs]`
- `🌐 Tentando requisição para: [URL]`
- `❌ Falha na requisição para [URL]: [erro]`

### 7. Possíveis Causas

1. **Firewall**: Windows Defender pode estar bloqueando
2. **Antivírus**: Pode estar interferindo
3. **Rede**: Configuração de rede corporativa
4. **Expo Go**: Versão desatualizada
5. **Tunnel**: Problemas com o serviço de tunnel

### 8. Soluções

#### Desabilitar Firewall Temporariamente
1. Abra Windows Defender
2. Desabilite temporariamente
3. Teste o aplicativo
4. Reabilite após o teste

#### Atualizar Expo Go
Certifique-se de que está usando a versão mais recente.

#### Usar Rede Local
Se o tunnel não funcionar:
```bash
npx expo start  # sem --tunnel
```

### 9. Configuração de Último Recurso
Se nada funcionar, use:
```
EXPO_PUBLIC_API_URL=http://172.20.173.132:8080/api
```

E inicie sem tunnel:
```bash
npx expo start
```

Isso deve funcionar garantidamente se o celular estiver na mesma rede WiFi.

### 10. Teste Específico
Para verificar se o problema é específico do login, teste primeiro:
- `http://10.0.2.2:8080/api/health`

Se isso funcionar, o problema está na rota de login.
Se não funcionar, o problema é de conectividade. 