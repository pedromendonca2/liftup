# 🏋️ LiftUp Frontend

Aplicativo mobile de treinos desenvolvido com React Native e Expo.

## 🚀 Como executar

### Desenvolvimento com Expo Go
```bash
npm install
npm start
```

### Build para produção
Consulte o [Guia de Build](../BUILD_GUIDE.md) para instruções completas.

```bash
# APK para testes
npm run build:android:preview

# AAB para Play Store
npm run build:android:production
```

## 📱 Funcionalidades

- ✅ Autenticação de usuários
- ✅ Criação e gerenciamento de treinos
- ✅ Interface adaptativa (light/dark theme)
- ✅ Armazenamento local com AsyncStorage
- ✅ Sincronização com API backend
- ✅ Navegação com Expo Router

## 🛠️ Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Expo Router** - Navegação baseada em arquivos
- **AsyncStorage** - Persistência local
- **React Hook Form** - Gerenciamento de formulários

## 📁 Estrutura do Projeto

```
frontend/
├── app/                    # Rotas da aplicação
│   ├── (tabs)/            # Abas principais
│   ├── login.tsx          # Tela de login
│   ├── register.tsx       # Tela de cadastro
│   └── newWorkout.tsx     # Criação de treinos
├── components/            # Componentes reutilizáveis
├── contexts/              # Contextos do React
├── services/              # Serviços de API
├── types/                 # Definições TypeScript
└── assets/               # Recursos estáticos
```

## 🔧 Configuração

### Variáveis de Ambiente
Copie `.env.example` para `.env` e configure:

```env
EXPO_PUBLIC_API_URL=http://seu-ip:3000
```

### Configuração do Backend
Certifique-se de que o backend esteja rodando na URL configurada.

## 📋 Scripts Disponíveis

```bash
npm start                    # Servidor de desenvolvimento
npm run android             # Abre no Android
npm run ios                 # Abre no iOS
npm run web                 # Abre no navegador
npm run lint                # Linting do código
npm run build:android:preview    # Build APK
npm run build:android:production # Build AAB
```

## 🏗️ Deploy

Para fazer deploy na Play Store, siga o [Guia de Build](../BUILD_GUIDE.md).

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request do projeto LiftUp

Este diretório contém a aplicação móvel (frontend) do projeto LiftUp. O projeto foi desenvolvido com [React Native](https://reactnative.dev/) e [Expo](https://expo.dev/), garantindo um fluxo de desenvolvimento rápido e multiplataforma.

## Pré-requisitos

Antes de iniciar, certifique-se de que possui o seguinte software instalado em sua máquina:

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (versão LTS recomendada) e npm
* [Expo Go](https://expo.dev/go) (aplicativo instalado no seu celular Android ou iOS)

# 1. Instale as dependências
Execute o comando abaixo para instalar todas as dependências do projeto listadas no package.json.
```bash
npm install
```

# 2. Configure a conexão com o backend (API)
O frontend precisa saber o endereço de rede do backend para se comunicar com ele. Esta configuração é feita através de um arquivo de variáveis de ambiente.

## Passo 1: Descubra o endereço IP do seu computador na rede Wi-Fi
No `Windowns` você pode encontrar o endereço IP do seu computador na rede Wi-Fi usando o seguinte comando no terminal:
```bash
ipconfig | findstr "IPv4"
```
> O formato do ip segue um padrão: `192.168.0.XXX`

## Passo 2: Crie um arquivo .env na raiz da pasta frontend.
Substitua 'SEU_IP_DE_REDE_AQUI' pelo endereço IP do seu computador na rede Wi-Fi encontrado no passo anterior. A porta deve ser a mesma que você configurou no firewall do windows e no backend. Por padrão, o backend do LiftUp usa a porta 3000.
Exemplo de comando para criar o arquivo:
```bash
cat EXPO_PUBLIC_API_URL=http://SEU_IP_DE_REDE_AQUI:3000 > .env
```

# 3. Execute a aplicação
Com as dependências instaladas e o ambiente configurado, inicie o servidor de desenvolvimento do Expo.

```bash
npx expo start
```
Se estiver utilizando WSL, use com tunelamento:
```bash
npx expo start --tunnel
```
Após executar o comando, um QR Code será exibido no seu terminal e em uma nova aba do navegador.

# 4. Abra o app no celular
- Garanta que seu celular esteja conectado na mesma rede Wi-Fi que o seu computador.
- Abra o aplicativo Expo Go no seu celular.
- Escaneie o QR Code exibido no terminal ou na página do navegador.