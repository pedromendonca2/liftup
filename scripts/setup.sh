#!/bin/bash

echo "🚀 Configurando LiftUp com PostgreSQL e Docker..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados"

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Iniciar PostgreSQL
echo "🐘 Iniciando PostgreSQL..."
docker-compose up -d postgres

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
sleep 10

# Verificar se PostgreSQL está rodando
until docker-compose exec -T postgres pg_isready -U liftup_user -d liftup; do
    echo "⏳ Aguardando PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL está pronto!"

# Configurar backend
echo "🔧 Configurando backend..."
cd backend

# Copiar arquivo de exemplo para .env
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Arquivo .env criado"
else
    echo "✅ Arquivo .env já existe"
fi

# Instalar dependências
echo "📦 Instalando dependências do backend..."
npm install

# Gerar cliente Prisma
echo "🔨 Gerando cliente Prisma..."
npx prisma generate

# Executar migrações
echo "🗄️ Executando migrações do banco..."
npx prisma db push

# Executar seed
echo "🌱 Populando banco com dados iniciais..."
npm run db:seed

cd ..

echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Iniciar o backend: cd backend && npm run dev"
echo "2. Instalar dependências do frontend: npm install"
echo "3. Iniciar o frontend: npx expo start"
echo ""
echo "🔗 URLs importantes:"
echo "- Backend API: http://localhost:3001"
echo "- PgAdmin: http://localhost:8080 (admin@liftup.com / admin123)"
echo "- PostgreSQL: localhost:5432"
echo ""
echo "👤 Credenciais de teste:"
echo "- Email: admin@liftup.com"
echo "- Senha: admin123" 