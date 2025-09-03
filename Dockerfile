FROM node:20-alpine

WORKDIR /app

# Copiar package.json y yarn.lock para instalar dependencias
COPY package.json yarn.lock ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar todo el código
COPY . .

# Exponer puerto
EXPOSE 3000

# Para desarrollo con hot-reload
CMD ["yarn", "start:dev"]

# Para producción (opcional)
# RUN yarn build
# CMD ["node", "dist/main.js"]