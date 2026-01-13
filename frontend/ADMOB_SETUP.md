# Configuração do Google AdMob para o LiftUp

## 1. Criar Conta no AdMob

1. Acesse https://admob.google.com/
2. Faça login com sua conta Google
3. Clique em "Começar" e siga as instruções

## 2. Registrar Aplicativo

1. No painel do AdMob, clique em "Apps" > "Adicionar app"
2. Escolha a plataforma: **Android**
3. Nome do app: **LiftUp**
4. O AdMob fornecerá um **App ID** no formato: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`

## 3. Criar Unidades de Anúncio

### Banner (anúncio na tela)
1. Vá em "Unidades de anúncio" > "Criar unidade de anúncio"
2. Escolha "Banner"
3. Nome: "LiftUp Home Banner"
4. Copie o **Ad Unit ID**: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`

### Intersticial (anúncio de tela cheia)
1. Crie outra unidade de anúncio
2. Escolha "Intersticial"
3. Nome: "LiftUp Workout Complete"
4. Copie o **Ad Unit ID**

## 4. Configurar no Projeto

### 4.1 Instalar Dependências

```bash
cd frontend
npm install react-native-google-mobile-ads
```

### 4.2 Atualizar app.json

Adicione o plugin do AdMob no `app.json`:

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
          "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
        }
      ]
    ]
  }
}
```

### 4.3 Atualizar IDs nos Componentes

#### Em `components/AdBanner.tsx`:
```typescript
const adUnitId = __DEV__ 
  ? TestIds.BANNER
  : Platform.select({
      android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Seu Banner ID
    });
```

#### Em `components/AdInterstitial.tsx`:
```typescript
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Seu Interstitial ID
    });
```

## 5. Usar Anúncios no App

### Banner na tela inicial:

```typescript
import { AdBanner } from '@/components/AdBanner';

// No seu componente:
<AdBanner />
```

### Intersticial após treino:

```typescript
import { useInterstitialAd } from '@/components/AdInterstitial';

function HomeScreen() {
  const { loaded, showAd } = useInterstitialAd();

  const handleFinishWorkout = () => {
    // Lógica do treino
    
    // Mostrar anúncio (ex: a cada 3 treinos)
    if (workoutCount % 3 === 0) {
      showAd();
    }
  };
}
```

## 6. Build para Produção

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configurar projeto
eas build:configure

# Fazer build APK
eas build --platform android --profile production
```

## 7. Testando

### Modo Desenvolvimento
- Os IDs de teste (`TestIds.BANNER`, `TestIds.INTERSTITIAL`) serão usados
- Anúncios aparecem com marcação "Test Ad"

### Modo Produção
- Use os IDs reais do AdMob
- Nunca clique nos seus próprios anúncios (pode banir sua conta!)
- Use dispositivos de teste: https://support.google.com/admob/answer/9691433

## 8. Estratégias de Monetização

### Posições recomendadas:
1. **Banner fixo** no topo ou rodapé da home
2. **Intersticial** após completar um treino (não toda vez, para não irritar)
3. **Intersticial** ao criar um novo treino
4. **Rewarded Ad** (futuro): ofereça benefícios em troca de assistir anúncio

### Frequência sugerida:
- Banner: sempre visível na home
- Intersticial: a cada 2-3 treinos completos
- Evite anúncios durante o treino (UX ruim)

## 9. Compliance

Adicione à política de privacidade:
- Uso de Google AdMob
- Coleta de dados para anúncios personalizados
- Link: https://policies.google.com/privacy

## 10. Publicar na Play Store

1. Build do APK: `eas build --platform android`
2. Teste o APK em dispositivos reais
3. Crie conta de desenvolvedor na Play Store ($25 one-time)
4. Faça upload do APK
5. Preencha os dados do app
6. Envie para revisão

## Recursos Úteis

- AdMob: https://admob.google.com/
- Documentação: https://docs.page/invertase/react-native-google-mobile-ads
- EAS Build: https://docs.expo.dev/build/introduction/
- Play Console: https://play.google.com/console/
