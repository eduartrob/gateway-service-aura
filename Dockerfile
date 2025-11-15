# Etapa 1: Construcción (Builder)
# Usamos una imagen de Node.js para instalar dependencias y compilar el código TypeScript
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de definición de paquetes e instalamos las dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código fuente de la aplicación
COPY . .

# Compilamos el código TypeScript a JavaScript (asumiendo que tienes un script 'build' en tu package.json)
RUN npm run build

# Etapa 2: Producción (Production)
# Usamos una imagen más ligera para ejecutar la aplicación ya compilada
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Exponemos el puerto en el que correrá el gateway
EXPOSE 5000

# Comando para iniciar el servidor
CMD [ "node", "dist/index.js" ]