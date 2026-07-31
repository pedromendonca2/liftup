# Aplicativo LiftUp

Cliente offline-first do LiftUp, construído com React Native, Expo Router e TypeScript estrito.

## Desenvolvimento

```bash
npm ci
npm start
```

Use `npm run android`, `npm run ios` ou `npm run web` para abrir uma plataforma específica. O aplicativo persiste treinos no AsyncStorage e não exige variáveis de ambiente.

## Verificação

```bash
npm run check
```

Esse comando executa ESLint, verificação de tipos e testes da regra de progressão de carga.

## Organização

```text
app/          rotas e telas
components/   componentes reutilizáveis
contexts/     estado de treinos e tema
services/     persistência local
types/        contratos de domínio
utils/        regras puras e testáveis
```

Os builds de distribuição usam os perfis de `eas.json`. Consulte [o guia de publicação](../docs/deployment.md) antes de gerar um release.
