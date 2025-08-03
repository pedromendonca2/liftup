# Backend do Projeto LiftUp
Este diretório contém o serviço de backend para a aplicação LiftUp. A arquitetura utiliza Node.js com Express.js, o ORM Prisma para comunicação com o banco de dados PostgreSQL, e está totalmente containerizada com Docker para garantir um ambiente de desenvolvimento consistente e isolado.

# Pre-requisitos
- Docker e Docker Compose instalados
- Node.js e npm instalados (opcional, para desenvolvimento local)
```bash
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

# 1. Configuração para Desenvolvimento Mobile com WSL2
Para conectar o aplicativo móvel (rodando no Expo Go em um dispositivo Android) ao backend que está rodando dentro do WSL2, é necessária uma configuração de rede adicional. Isso ocorre porque o WSL2 opera em sua própria rede virtual, com um endereço de IP que não é diretamente acessível a partir de outros dispositivos na sua rede Wi-Fi.

Os comandos a seguir criam uma "ponte" para encaminhar o tráfego de rede do seu computador Windows para o WSL.

Execute estes passos uma única vez na sua máquina Windows:

## Passo 1: Encontre o Endereço IP do seu WSL
Dentro do seu terminal WSL, execute o seguinte comando para descobrir o endereço IP da sua distribuição Linux:
```powershell
wsl hostname -I
```
## Passo 2: Configure o Encaminhamento de Porta e o Firewall
Abra o Prompt de Comando (cmd.exe) ou o Windows PowerShell como Administrador e execute os dois comandos abaixo.

**Crie a regra de encaminhamento de porta:**
`Substitua 172.23.186.132` pelo endereço `IP do seu WSL` que você encontrou no passo anterior.
```powershell
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=172.23.186.132
```

**Crie a regra de Firewall:**
Este comando abre a porta 3000 no Firewall do Windows para permitir conexões de entrada.
```powershell
netsh advfirewall firewall add rule name="WSL Port Forwarding" dir=in action=allow protocol=TCP localport=3000
```

Após executar estes comandos, o seu celular na mesma rede Wi-Fi poderá se conectar ao backend usando o endereço IP do seu computador Windows (não o do WSL).

# 2. Inicie o Ambiente Docker
Estamos rodando o backend e o banco de dados PostgreSQL em conteineres Docker e usando o Prisma como ORM.
Na primeira vez que você executar o ambiente, o Docker irá baixar as imagens necessárias e criar os contêineres.
```bash
docker compose up --build
```
Isso irá iniciar o backend na porta 3000 e o banco de dados PostgreSQL na porta 5432.
Depois pode usar o comando abaixo para iniciar os contêineres sem reconstruir as imagens:
```bash
docker compose up
```

## Para acessar o Prisma Studio
Visualizar o Banco de Dados (Prisma Studio): Para abrir uma interface gráfica no navegador que permite ver e editar os dados diretamente, execute este comando em um novo terminal, e o Prisma Studio estará acessível em http://localhost:5555.

```bash
docker compose exec backend npx prisma studio
```

# 3. Sincronize o Banco de Dados (Na primeira vez que você executar o ambiente)
O banco de dados é criado vazio. Para criar as tabelas definidas no seu schema.prisma, execute o seguinte comando em um novo terminal:
```bash
docker compose exec backend npx prisma db push
```

# 4. Populando o Banco de Dados
Como o banco de dados é criado vazio tem que ser populado com os dados iniciais. Para isso, você pode usar os seguintes comandos para registrar um usuário e fazer login:
1. Registrar um novo usuário:

```bash
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"email": "teste@teste.com", "password": "123456"}'
```

2. Fazer login:
```bash

curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"email": "teste@teste.com", "password": "123456"}'
```

# 5. Parar os Contêineres
Para parar e remover os contêineres (sem apagar os dados do banco):
```bash
docker compose down
```

## Comandos Úteis
Listar todos os contêineres (em execução e parados):
```bash
docker ps -a
```

Verificar qual processo está usando uma porta específica (ex: 5432):
Pode ser útil para depurar conflitos de porta.
```bash
sudo lsof -i :5432
```
