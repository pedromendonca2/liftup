@echo off
echo 🚀 Configurando LiftUp com PostgreSQL e Docker...

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não está instalado. Por favor, instale o Docker primeiro.
    pause
    exit /b 1
)

REM Verificar se Docker Compose está instalado
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro.
    pause
    exit /b 1
)

echo ✅ Docker e Docker Compose encontrados

REM Parar containers existentes
echo 🛑 Parando containers existentes...
docker-compose down

REM Iniciar PostgreSQL
echo 🐘 Iniciando PostgreSQL...
docker-compose up -d postgres

REM Aguardar PostgreSQL estar pronto
echo ⏳ Aguardando PostgreSQL estar pronto...
timeout /t 10 /nobreak >nul

REM Verificar se PostgreSQL está rodando
:wait_loop
docker-compose exec -T postgres pg_isready -U liftup_user -d liftup >nul 2>&1
if errorlevel 1 (
    echo ⏳ Aguardando PostgreSQL...
    timeout /t 2 /nobreak >nul
    goto wait_loop
)

echo ✅ PostgreSQL está pronto!

REM Configurar backend
echo 🔧 Configurando backend...
cd backend

REM Copiar arquivo de exemplo para .env
if not exist .env (
    copy env.example .env
    echo ✅ Arquivo .env criado
) else (
    echo ✅ Arquivo .env já existe
)

REM Instalar dependências
echo 📦 Instalando dependências do backend...
call npm install

REM Gerar cliente Prisma
echo 🔨 Gerando cliente Prisma...
call npx prisma generate

REM Executar migrações
echo 🗄️ Executando migrações do banco...
call npx prisma db push

REM Executar seed
echo 🌱 Populando banco com dados iniciais...
call npm run db:seed

cd ..

echo.
echo 🎉 Setup concluído com sucesso!
echo.
echo 📋 Próximos passos:
echo 1. Iniciar o backend: cd backend ^&^& npm run dev
echo 2. Instalar dependências do frontend: npm install
echo 3. Iniciar o frontend: npx expo start
echo.
echo 🔗 URLs importantes:
echo - Backend API: http://localhost:3001
echo - PgAdmin: http://localhost:8080 (admin@liftup.com / admin123)
echo - PostgreSQL: localhost:5432
echo.
echo 👤 Credenciais de teste:
echo - Email: admin@liftup.com
echo - Senha: admin123
echo.
pause 