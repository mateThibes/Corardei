# Usar una imagen oficial de Node.js ligera como base
FROM node:20-alpine

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias para producción
RUN npm install --omit=dev

# Copiar el resto del código del proyecto
COPY . .

# Exponer el puerto (Fly.io suele usar el puerto que le indicamos)
EXPOSE 3000

# Comando para arrancar la aplicación
CMD ["npm", "start"]
