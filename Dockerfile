FROM node:22-slim

# O Prisma precisa do OpenSSL no Linux
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dependências primeiro, para o Docker reaproveitar o cache quando só o código muda
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 3000

# npm start: cria as tabelas (prisma db push), cadastra os produtos (seed) e sobe o servidor
CMD ["npm", "start"]
