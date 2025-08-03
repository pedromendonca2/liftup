# Frontend do projeto LiftUp

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