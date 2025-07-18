@echo off
echo 🚀 Iniciando ambiente de desenvolvimento LiftUp...

REM Verificar se os containers estão rodando
docker-compose ps | findstr "postgres.*Up" >nul
if errorlevel 1 (
    echo 🐘 Iniciando PostgreSQL...
    docker-compose up -d postgres
    timeout /t 5 /nobreak >nul
)

REM Verificar se PgAdmin está rodando
docker-compose ps | findstr "pgadmin.*Up" >nul
if errorlevel 1 (
    echo 📊 Iniciando PgAdmin...
    docker-compose up -d pgadmin
)

echo ✅ Containers iniciados!

REM Iniciar backend em background
echo 🔧 Iniciando backend...
cd backend
start "LiftUp Backend" cmd /k "npm run dev"
cd ..

REM Aguardar backend estar pronto
echo ⏳ Aguardando backend estar pronto...
timeout /t 5 /nobreak >nul

REM Verificar se backend está rodando
:wait_backend
curl -s http://localhost:3001/api/health >nul 2>&1
if errorlevel 1 (
    echo ⏳ Aguardando backend...
    timeout /t 2 /nobreak >nul
    goto wait_backend
)

echo ✅ Backend está pronto!

REM Instalar dependências do frontend se necessário
if not exist "node_modules" (
    echo 📦 Instalando dependências do frontend...
    call npm install
)

echo 📱 Iniciando frontend...
echo 🔗 URLs disponíveis:
echo - Backend API: http://localhost:3001
echo - PgAdmin: http://localhost:8080
echo - Frontend: Será aberto automaticamente

REM Iniciar frontend
call npx expo start

echo 🛑 Ambiente parado
pause 