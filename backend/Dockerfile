# -----------------------------------------------------------------------------
# Dockerfile para a aplicação Backend LiftUp
# -----------------------------------------------------------------------------

# Etapa 1: Use uma imagem base leve e segura do Node.js
FROM node:18-alpine

# Etapa 2: Defina o diretório de trabalho dentro do contêiner
# Todos os comandos a seguir serão executados a partir deste diretório
WORKDIR /app

# Etapa 3: Copie os arquivos de dependência e instale-as
# Copiar 'package.json' e 'package-lock.json' primeiro aproveita o cache do Docker
COPY package*.json ./
RUN npm install

# Etapa 4: Copie o restante do código da sua aplicação para o contêiner
# Isso inclui seu index.js, a pasta /prisma, etc.
COPY . .

# Etapa 5: Execute o Prisma Generate para criar o cliente do banco de dados
# Este comando é essencial para que o Prisma funcione corretamente
RUN npx prisma generate

# Etapa 6: Exponha a porta que sua API usa (definida no seu index.js)
EXPOSE 3000

# Etapa 7: Defina o comando padrão para iniciar a aplicação quando o contêiner rodar
CMD ["node", "server.js"]