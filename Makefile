.PHONY: help setup start stop clean test lint build deploy

help: ## Mostra esta ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Configura o ambiente inicial
	@echo "🚀 Configurando ambiente..."
	docker-compose down
	docker-compose up -d postgres
	@echo "⏳ Aguardando PostgreSQL..."
	@sleep 10
	cd backend && npm install
	cd backend && npx prisma generate
	cd backend && npx prisma db push
	cd backend && npm run db:seed
	cd frontend && npm install
	@echo "✅ Setup concluído!"

start: ## Inicia o ambiente de desenvolvimento
	@echo "🚀 Iniciando ambiente..."
	docker-compose up -d
	@echo "✅ Ambiente iniciado!"

stop: ## Para o ambiente
	@echo "🛑 Parando ambiente..."
	docker-compose down
	@echo "✅ Ambiente parado!"

clean: ## Limpa containers e volumes
	@echo "🧹 Limpando ambiente..."
	docker-compose down -v
	docker system prune -f
	@echo "✅ Limpeza concluída!"

test: ## Executa testes
	@echo "🧪 Executando testes..."
	cd backend && npm test

lint: ## Executa linting
	@echo "🔍 Executando linting..."
	cd backend && npm run lint
	cd frontend && npm run lint

build: ## Constrói imagens Docker
	@echo "🔨 Construindo imagens..."
	docker-compose build

deploy: ## Deploy em produção
	@echo "🚀 Deploy em produção..."
	docker-compose -f docker-compose.prod.yml up -d

logs: ## Mostra logs dos containers
	docker-compose logs -f

logs-backend: ## Mostra logs do backend
	docker-compose logs -f backend-dev

logs-postgres: ## Mostra logs do PostgreSQL
	docker-compose logs -f postgres

shell-backend: ## Acessa shell do backend
	docker-compose exec backend-dev sh

shell-postgres: ## Acessa shell do PostgreSQL
	docker-compose exec postgres psql -U liftup_user -d liftup

reset-db: ## Reseta o banco de dados
	@echo "🔄 Resetando banco..."
	cd backend && npx prisma db push --force-reset
	cd backend && npm run db:seed
	@echo "✅ Banco resetado!"

studio: ## Abre Prisma Studio
	@echo "📊 Abrindo Prisma Studio..."
	cd backend && npx prisma studio

install-deps: ## Instala dependências
	@echo "📦 Instalando dependências..."
	cd frontend && npm install
	cd backend && npm install
	@echo "✅ Dependências instaladas!" 