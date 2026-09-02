# Explicación del Servidor Node.js

Como es tu primera vez desarrollando en Node.js, aquí tienes una explicación paso a paso de cada bloque de código que hemos escrito en el archivo `index.js`. 

Este código utiliza **Express**, que es el framework (marco de trabajo) más popular para crear servidores web y APIs en Node.js, ya que simplifica mucho las tareas.

---

## 1. Importación y Configuración Inicial

```javascript
const express = require('express');

const app = express();
const PORT = 3000;
```

- `require('express')`: Aquí estamos importando la librería `express` que acabamos de instalar en tu proyecto.
- `const app = express()`: Inicializamos la aplicación llamando a la función `express()`. La constante `app` ahora representa tu servidor y será la que utilicemos para configurarlo.
- `const PORT = 3000`: Definimos en qué "puerto" de tu computadora va a vivir este servidor. Piensa en el puerto como si fuera la puerta de un edificio; las peticiones entrarán por la puerta 3000.

---

## 2. Configuración de Middlewares

```javascript
app.use(express.json());
```

- `app.use(...)`: Esto se llama un "middleware". Es una función que se ejecuta cada vez que el servidor recibe una petición.
- `express.json()`: En este caso, le estamos diciendo a nuestra aplicación que sea capaz de entender y procesar información enviada en formato JSON. Es muy útil cuando empezamos a enviar datos desde el cliente (una web o una app móvil) hacia el servidor.

---

## 3. Creación de las "Rutas" (Endpoints)

Las rutas son las diferentes URLs (direcciones) a las que puede responder nuestro servidor. 

### Ruta Principal
```javascript
app.get('/', (req, res) => {
    res.send('¡Hola, mundo! El servidor de Corardei está funcionando.');
});
```

- `app.get(...)`: Define que el servidor escuchará peticiones de tipo **GET** (peticiones para leer información).
- `'/'`: Esta es la ruta raíz. Significa que si entras a `http://localhost:3000/`, se ejecutará este bloque.
- `(req, res)`: Es una función que recibe dos cosas:
  - `req` (Request / Petición): Contiene toda la información de lo que el usuario está pidiendo o enviando.
  - `res` (Response / Respuesta): Contiene los métodos que usamos para responderle al usuario.
- `res.send(...)`: Envía texto simple como respuesta.

### Ruta de API en formato JSON
```javascript
app.get('/api/saludo', (req, res) => {
    res.json({ mensaje: 'Bienvenido a tu primera API con Node.js y Express' });
});
```
- Funciona igual que la anterior, pero cuando entres a `http://localhost:3000/api/saludo`, el servidor responderá usando `res.json(...)`, lo que enviará un objeto con formato JSON. Así es como normalmente se construyen las APIs que se conectan a bases de datos.

---

## 4. Encender el Servidor

```javascript
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
```

- `app.listen(...)`: Le indica a nuestro servidor que se encienda y empiece a "escuchar" peticiones en el puerto que definimos (el 3000).
- La función de adentro `() => { ... }` se ejecuta solo una vez cuando el servidor arranca exitosamente.
- `console.log(...)`: Imprime un mensaje en la terminal para que sepamos que todo salió bien y el servidor está corriendo.

---

### ¿Cómo probarlo?
1. Abre tu terminal en la carpeta del proyecto.
2. Escribe el comando: `node index.js`
3. Abre tu navegador de internet y entra a: [http://localhost:3000](http://localhost:3000)
