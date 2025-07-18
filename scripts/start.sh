#!/bin/bash

echo "🚀 Iniciando ambiente de desenvolvimento LiftUp..."

# Verificar se os containers estão rodando
if ! docker-compose ps | grep -q "postgres.*Up"; then
    echo "🐘 Iniciando PostgreSQL..."
    docker-compose up -d postgres
    sleep 5
fi

# Verificar se PgAdmin está rodando
if ! docker-compose ps | grep -q "pgadmin.*Up"; then
    echo "📊 Iniciando PgAdmin..."
    docker-compose up -d pgadmin
fi

echo "✅ Containers iniciados!"

# Iniciar backend em background
echo "🔧 Iniciando backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Aguardar backend estar pronto
echo "⏳ Aguardando backend estar pronto..."
sleep 5

# Verificar se backend está rodando
until curl -s http://localhost:3001/api/health > /dev/null; do
    echo "⏳ Aguardando backend..."
    sleep 2
done

echo "✅ Backend está pronto!"

# Instalar dependências do frontend se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
fi

echo "📱 Iniciando frontend..."
echo "🔗 URLs disponíveis:"
echo "- Backend API: http://localhost:3001"
echo "- PgAdmin: http://localhost:8080"
echo "- Frontend: Será aberto automaticamente"

# Iniciar frontend
npx expo start

# Limpeza ao sair
trap "echo '🛑 Parando backend...'; kill $BACKEND_PID; echo '✅ Ambiente parado'; exit" INT 