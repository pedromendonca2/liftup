# Publicação do LiftUp

O aplicativo usa EAS Build para gerar artefatos Android e iOS. As credenciais e identificadores abaixo pertencem a cada conta de publicação e não devem ser versionados.

## Preparação inicial

1. Instale a CLI e autentique-se:

   ```bash
   npm install --global eas-cli
   eas login
   ```

2. Entre no módulo mobile e vincule o projeto à sua conta Expo:

   ```bash
   cd frontend
   eas init
   ```

3. Confirme em `app.json` os valores de `expo.version`, `ios.bundleIdentifier`, `android.package` e os números internos de versão.

## Builds

Use o perfil `preview` para distribuição interna e valide o artefato em um dispositivo real antes da produção.

```bash
npm run build:android:preview
npm run build:ios:preview
```

Depois da validação:

```bash
npm run build:android:production
npm run build:ios:production
```

O perfil Android de produção gera um AAB. A assinatura é gerenciada pelo EAS, mas a conta proprietária deve manter um backup das credenciais.

## Checklist de release

- `npm run check` passa na raiz do repositório.
- O app foi testado em tema claro e escuro, com e sem dados salvos.
- `expo.version`, `android.versionCode` e `ios.buildNumber` foram incrementados.
- Ícone, splash, descrição, política de privacidade e screenshots estão atualizados nas lojas.
- Nenhum segredo, arquivo `.env` ou credencial foi incluído no commit.

Após o build, a submissão pode ser feita com `npm run submit:android` ou `npm run submit:ios` dentro de `frontend/`.
