# 📱 Guia de Deploy - LiftUp App

Este guia explica como fazer o build e deploy do aplicativo LiftUp para a Google Play Store.

## 📋 Pré-requisitos

### 1. Instalar EAS CLI
```bash
npm install -g @expo/eas-cli
```

### 2. Criar conta no Expo
- Acesse [expo.dev](https://expo.dev) e crie uma conta
- Faça login via CLI: `eas login`

### 3. Configurar projeto EAS
```bash
cd frontend
eas build:configure
```

## 🔧 Configuração do Projeto

### 1. Configuração do app.json
O arquivo `app.json` já está configurado com:
- ✅ Bundle identifier: `com.liftup.app`
- ✅ Ícones e splash screen configurados
- ✅ Permissões do Android
- ✅ Configurações de build

### 2. Configuração do eas.json
O arquivo `eas.json` define três perfis de build:
- **development**: Para desenvolvimento com Expo Dev Client
- **preview**: Gera APK para testes internos
- **production**: Gera AAB para publicação na Play Store

### 3. Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e configure:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```
EXPO_PUBLIC_API_URL=https://sua-api.com
EXPO_PUBLIC_APP_NAME=LiftUp
EXPO_PUBLIC_APP_VERSION=1.0.0
```

## 🏗️ Processo de Build

### 1. Build para Testes (APK)
```bash
npm run build:android:preview
```
Este comando:
- Gera um APK que pode ser instalado em qualquer dispositivo Android
- Útil para testes internos antes da publicação
- Não requer assinatura da Play Store

### 2. Build para Produção (AAB)
```bash
npm run build:android:production
```
Este comando:
- Gera um Android App Bundle (AAB)
- Formato requerido pela Google Play Store
- Otimizado para distribuição

### 3. Monitorar o Build
- O build será executado nos servidores do Expo
- Acompanhe o progresso em [expo.dev](https://expo.dev)
- Você receberá uma notificação quando o build estiver pronto

## 📦 Preparação para Play Store

### 1. Criar Conta de Desenvolvedor
- Acesse [Google Play Console](https://play.google.com/console)
- Pague a taxa única de $25
- Complete o cadastro

### 2. Configurar App na Play Store
1. **Criar novo app** no Play Console
2. **Configurar store listing**:
   - Nome do app: "LiftUp"
   - Descrição detalhada
   - Screenshots (capture do app funcionando)
   - Ícone da Play Store (512x512px)

3. **Upload do AAB**:
   - Vá para "Release" > "Production"
   - Faça upload do arquivo .aab gerado
   - Preencha as notas da versão

### 3. Configurar Assinatura
O EAS Build gerencia automaticamente a assinatura do app. Para produção:
- O Expo gerará e gerenciará as chaves de assinatura
- As chaves ficam seguras nos servidores do Expo
- Você pode baixar as chaves se precisar gerenciá-las manualmente

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm start                    # Inicia o servidor de desenvolvimento
npm run android             # Abre no emulador Android

# Builds
npm run build:android:preview    # Build APK para testes
npm run build:android:production # Build AAB para produção
npm run build:ios:preview       # Build iOS para testes
npm run build:ios:production    # Build iOS para produção

# Submissão (após configurar credenciais)
npm run submit:android      # Submete para Google Play Store
npm run submit:ios         # Submete para App Store
```

## 🔄 Atualizações Futuras

### 1. Incrementar Versão
No `app.json`, atualize:
```json
{
  "expo": {
    "version": "1.0.1",  // Versão visível para usuários
    "android": {
      "versionCode": 2   // Número interno (sempre crescente)
    }
  }
}
```

### 2. Build da Nova Versão
```bash
npm run build:android:production
```

### 3. Upload na Play Store
- Acesse o Play Console
- Vá para "Release" > "Production"
- Faça upload do novo AAB
- Publique a atualização

## 🐛 Troubleshooting

### Erro de Assinatura
Se houver problemas com assinatura:
```bash
eas credentials:configure
```

### Erro de Build
- Verifique o log completo em expo.dev
- Confirme se todas as dependências estão corretas
- Teste localmente antes do build

### App Não Instala
- Verifique se o APK é compatível com a versão do Android
- Confirme se as permissões estão corretas
- Teste em diferentes dispositivos

## 📱 URLs Importantes

- **Expo Dashboard**: https://expo.dev
- **Google Play Console**: https://play.google.com/console
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/

## 📝 Notas Importantes

1. **Primeira publicação**: Pode levar até 7 dias para análise do Google
2. **Atualizações**: Geralmente aprovadas em poucas horas
3. **Backup das chaves**: Sempre faça backup das chaves de assinatura
4. **Testes**: Sempre teste o APK antes de fazer o build de produção
5. **Versioning**: Nunca publique a mesma versão duas vezes

## 🎯 Próximos Passos

Após seguir este guia, seu app estará:
- ✅ Configurado para builds standalone
- ✅ Pronto para ser testado via APK
- ✅ Preparado para submissão na Play Store
- ✅ Configurado para futuras atualizações

Para dúvidas específicas, consulte a [documentação oficial do Expo](https://docs.expo.dev/).