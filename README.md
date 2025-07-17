# Documentação do LiftUp

      [ ] Diagrama de classes do domínio do problema;
      [x] Ferramentas escolhidas (Git, build, testes, issue tracking, CI/CD, container);
      [?] Frameworks reutilizados;
      [x] Como gerar a documentação do código (ex.: JavaDoc);
      [x] Como executar o sistema.

# LiftUp [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/main/LICENSE)

## Diagrama de classes do domínio
> ![Diagrama de classes](./docs/diagrama-classes.png)

## Ferramentas escolhidas
- **Git & GitHub** – Controle de versão e hospedagem do código. Ideal para colaboração e CI/CD.
- **TypeScript** – Tipagem estática para JavaScript, melhorando manutenção e evitando bugs.
- **ESLint + eslint-config-expo** – Ferramentas de linting para manter a qualidade e padrão do código.
- **Expo CLI** – Utilitário para build, preview e gerenciamento de pacotes.
- **TypeDoc** – Gera documentação automática a partir de comentários no código TypeScript.

## Frameworks reutilizados
- **React Native** – Base do app mobile. Permite desenvolver para Android, iOS e Web com o mesmo código.
- **Expo** – Framework que abstrai a complexidade do React Native puro. Facilita o build, preview e uso de APIs nativas.
- **Expo Router** – Framework de roteamento baseado em arquivos, facilitando a navegação e organização de telas.
- **React Navigation** – Biblioteca de navegação usada por trás do Expo Router. Permite uso de abas (`bottom-tabs`) e navegação declarativa.
- **React** – Biblioteca principal para construção de interfaces com componentes.
- **React Native Gesture Handler** e **Reanimated** – Usadas por baixo para interações fluidas e animações.
- **Expo Modules** – Bibliotecas da família Expo adicionadas por necessidade ou por padrão:
  - `expo-font`, `expo-status-bar`, `expo-haptics`, `expo-image`, `expo-splash-screen`, `expo-web-browser`, etc.
  - A maioria dessas lida com funcionalidades nativas de forma simples (ex: haptics, splash, web browser).

## Como gerar a documentação do código
O projeto utiliza [TypeDoc](https://typedoc.org/) para gerar documentação automática a partir do código TypeScript.

1. Instale a dependência

   ```bash
      npm install --save-dev typedoc
   ```

2. Gere a documentação do código
   ```bash
      npm run docs
   ```

A documentação será gerada na pasta `docs/`, podendo ser visualizada ao abrir o arquivo `docs/index.html`.

## Como executar
1. Clone o repositório

   ```bash
   git clone https://github.com/pedromendonca2/liftup.git
   cd liftup/
   ```

2. Instale as dependências do projeto

   ```bash
   npm install
   ```

3. Rode o servidor do app
Após rodar o comando npx expo start, uma aba será aberta no navegador mostrando o QR Code, e também no terminal.

   ```bash
   npx expo start
   ```

Se estiver utilizando WSL (Windows Subsystem for Linux), é recomendável iniciar com tunelamento:
   ```bash
   npx expo start --tunnel
   ```

4. Abra o app no celular
   - Instale o app Expo Go no seu celular
   - Escaneie o QR Code

## Licença

LiftUp é licenciado por [MIT LICENSE](./LICENSE).
