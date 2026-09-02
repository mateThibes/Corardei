# Coradei - Tienda de Rosarios 📿

¡Bienvenido al repositorio de **Coradei**! 

Este proyecto es una plataforma web orientada a la exhibición y venta de rosarios. Nuestro objetivo es ofrecer a los clientes una experiencia rápida y sencilla para descubrir nuestros productos, conocer nuestra historia y buscar artículos de su interés.

## 🚀 Sobre el Proyecto (Negocio)
Coradei nace con el propósito de ofrecer rosarios únicos. A través de esta web, los usuarios pueden:
- **Explorar el catálogo**: Ver la variedad de productos disponibles.
- **Conocer a la marca**: Leer acerca de nosotros y nuestra misión.
- **Búsqueda integrada**: Utilizar herramientas para encontrar productos específicos.

## 💻 Desarrollo y Tecnologías
A nivel técnico, el proyecto es una aplicación web impulsada por un servidor backend ligero y veloz.

### Stack Tecnológico
- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express.js**: Framework minimalista para Node.js, utilizado para gestionar el servidor web, el enrutamiento y servir el frontend.
- **Frontend Estático**: HTML, CSS y JavaScript alojados en la carpeta `public`.

### Arquitectura y Características
El núcleo del servidor (`index.js`) se encarga de:
- **Servir archivos estáticos**: Entrega automáticamente los recursos visuales e interfaces gráficas al usuario.
- **Enrutamiento web**: Gestiona la navegación de la página hacia `/`, `/productos` y `/acerca-de`.
- **API REST**: Incluye un endpoint `/api/buscar` configurado para recibir parámetros por la URL y devolver respuestas en formato `JSON`, sentando las bases para conectar una base de datos en el futuro.

## ⚙️ Cómo ejecutar el proyecto localmente

Sigue estos pasos para correr el servidor en tu computadora:

1. **Instalar Node.js**: Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu equipo.
2. **Abrir la terminal** en la carpeta raíz del proyecto.
3. **Instalar las dependencias**:
   ```bash
   npm install
   ```
4. **Iniciar el servidor**:
   ```bash
   node index.js
   ```
5. **Ver la aplicación**:
   Abre tu navegador de internet y entra a: [http://localhost:3000](http://localhost:3000)

## 📁 Estructura Principal
- `index.js`: Archivo principal del servidor (backend).
- `public/`: Contiene todo el frontend que ve el usuario (archivos `.html`, estilos, imágenes).
- `package.json`: Configuración del proyecto y sus dependencias (como `express`).
- `explicacion_codigo.md`: Documento de apoyo para entender paso a paso cómo está construido el servidor.
