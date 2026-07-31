FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN npm ci && npx prisma generate

FROM dependencies AS development

COPY --chown=node:node prisma ./prisma
COPY --chown=node:node src ./src
COPY --chown=node:node app.js server.js ./

USER node
EXPOSE 3000

CMD ["node", "server.js"]

FROM dependencies AS production-dependencies

RUN npm prune --omit=dev

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node src ./src
COPY --chown=node:node app.js server.js ./

USER node
EXPOSE 3000

CMD ["node", "server.js"]
