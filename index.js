const express = require('express');
const path = require('path'); // Módulo de Node para manejar rutas de archivos

const app = express();
const PORT = 3000;

app.use(express.json());

// Configuramos Express para que pueda servir archivos estáticos (CSS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// 1. Ruta "Home" (Página principal)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. Ruta "Productos"
app.get('/productos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'productos.html'));
});

// 3. Ruta "Acerca de nosotros"
app.get('/acerca-de', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'acerca-de.html'));
});

// 4. Ruta para procesar la barra de búsqueda (API)
app.get('/api/buscar', (req, res) => {
    // req.query captura lo que el usuario envía en la URL (ej: ?q=zapatos)
    const terminoBusqueda = req.query.q || '';
    
    // Por ahora solo respondemos con un mensaje, luego aquí conectaríamos una Base de Datos
    res.json({ 
        mensaje: `Has buscado: "${terminoBusqueda}". ¡Pronto mostraremos resultados aquí!` 
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
