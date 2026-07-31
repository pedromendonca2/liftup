<p align="center">
  <img src="./frontend/assets/images/liftup-icon.png" alt="Símbolo do LiftUp" width="132" />
</p>

<h1 align="center">LiftUp</h1>

<p align="center">
  Um diário de treino mobile, offline-first, que transforma feedback de repetições em progressão de carga.
</p>

<p align="center">
  <a href="https://github.com/pedromendonca2/liftup/actions/workflows/frontend-ci.yml"><img src="https://github.com/pedromendonca2/liftup/actions/workflows/frontend-ci.yml/badge.svg" alt="Frontend CI" /></a>
  <a href="https://github.com/pedromendonca2/liftup/actions/workflows/backend-ci.yml"><img src="https://github.com/pedromendonca2/liftup/actions/workflows/backend-ci.yml/badge.svg" alt="Backend CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-1f3a7a.svg" alt="Licença MIT" /></a>
  <img src="https://img.shields.io/badge/Expo-53-000020?logo=expo&logoColor=white" alt="Expo 53" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript strict" />
</p>

O LiftUp concentra a rotina de musculação em um fluxo curto: monte divisões de treino, registre cargas, cronometre a sessão e informe quantas repetições conseguiu executar. Ao finalizar, o aplicativo aplica uma regra de progressão conservadora e prepara a carga da próxima sessão. Os dados ficam disponíveis no aparelho, sem cadastro e sem depender de conexão.

## O que o projeto entrega

- Até quatro divisões de treino (A–D), com catálogo de equipamentos e cargas personalizadas.
- Cronômetro por sessão e registro da última execução.
- Progressão automática de carga baseada na faixa de repetições informada.
- Persistência local com AsyncStorage e funcionamento offline.
- Tema claro/escuro, navegação tipada e interface para Android, iOS e Web.
- API complementar com autenticação JWT, CRUD de treinos, Prisma e PostgreSQL.
- Verificações automatizadas de lint, tipos e testes em cada pull request.

## Stack

| Camada | Tecnologias | Responsabilidade |
| --- | --- | --- |
| Aplicativo | React Native, Expo Router, TypeScript | Experiência mobile e regras da sessão |
| Persistência local | AsyncStorage | Uso imediato e offline-first |
| API | Node.js, Express, JWT | Autenticação e operações de treino |
| Dados da API | Prisma, PostgreSQL | Modelagem e persistência relacional |
| Qualidade | ESLint, TypeScript, Jest, GitHub Actions | Feedback rápido e integração contínua |

O aplicativo funciona de forma independente com armazenamento local. O backend fica disponível como serviço complementar para a evolução de sincronização entre dispositivos, sem aumentar o atrito do primeiro uso.

## Comece em poucos minutos

Pré-requisitos: Node.js 20 ou superior, npm e [Expo Go](https://expo.dev/go) no dispositivo móvel.

```bash
git clone https://github.com/pedromendonca2/liftup.git
cd liftup
npm run setup
npm run mobile
```

Escaneie o QR code com o Expo Go. Também é possível abrir um destino diretamente:

```bash
npm run mobile:android
npm run mobile:ios
npm run mobile:web
```

O app não exige `.env` nem backend para esse fluxo. Em redes nas quais o dispositivo não alcança o computador, use `npm --prefix frontend start -- --tunnel`.

## API opcional

Com Docker e Docker Compose instalados:

```bash
cp backend/.env.example backend/.env
cd backend
docker compose up --build -d
docker compose exec backend npx prisma db push
curl http://localhost:3000/health
```

A resposta esperada é `{"status":"ok","service":"liftup-api"}`. As rotas principais são:

| Método | Rota | Uso |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Criar usuário |
| `POST` | `/api/auth/login` | Obter token JWT |
| `GET` | `/api/workouts` | Listar treinos autenticados |
| `POST` | `/api/workouts` | Criar treino autenticado |
| `PUT` | `/api/workouts/:id` | Atualizar treino |
| `DELETE` | `/api/workouts/:id` | Excluir treino |

Exemplos de payload e detalhes do ambiente estão em [backend/README.md](./backend/README.md).

## Qualidade e desempenho

Execute toda a verificação local com um comando:

```bash
npm run check
```

O fluxo valida lint e TypeScript estrito no app, além dos testes do backend. No runtime, o projeto evita chamadas de rede no caminho principal, persiste somente dados compactos da rotina e mantém operações relacionais do backend dentro de transações.

## Estrutura

```text
liftup/
├── frontend/               # Aplicativo Expo/React Native
│   ├── app/                # Rotas e telas
│   ├── components/         # Componentes de interface
│   ├── contexts/           # Estado, tema e persistência
│   ├── services/           # Acesso ao armazenamento
│   └── types/              # Contratos TypeScript
├── backend/                # API Express e ambiente Docker
│   ├── prisma/             # Schema do banco
│   ├── src/                # Rotas, controllers e services
│   └── tests/              # Testes automatizados
├── docs/                   # Guias operacionais
└── .github/workflows/      # Integração contínua
```

## Build e contribuição

- Para gerar APK/AAB ou preparar uma publicação, consulte [docs/deployment.md](./docs/deployment.md).
- Para propor uma alteração e conhecer os padrões do projeto, consulte [CONTRIBUTING.md](./CONTRIBUTING.md).

Distribuído sob a [licença MIT](./LICENSE).
