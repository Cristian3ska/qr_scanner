const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = 'registros.json';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Sirve archivos estáticos de la carpeta 'public'

// Inicializar "Base de datos" JSON si no existe
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// --- API ENDPOINTS ---

// 1. GET: Ver registros
app.get('/api/registros', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DB_FILE));
        res.json(data);
    } catch (error) {
        res.json([]); // Si falla al leer, devuelve array vacío por seguridad
    }
});

// 2. POST: Guardar nuevo escaneo
app.post('/api/escanear', (req, res) => {
    const { contenido } = req.body;
    if (!contenido) return res.status(400).json({ error: 'Sin contenido' });

    const registros = JSON.parse(fs.readFileSync(DB_FILE));
    const nuevoRegistro = {
        id: Date.now(),
        contenido: contenido,
        fecha: new Date().toLocaleString('es-MX')
    };

    registros.unshift(nuevoRegistro); // Agrega al inicio del array
    fs.writeFileSync(DB_FILE, JSON.stringify(registros, null, 2));

    console.log(`✅ Registro guardado: ID ${nuevoRegistro.id}`);
    res.json({ success: true, registro: nuevoRegistro });
});

// 3. DELETE: Vaciar todos los registros
app.delete('/api/registros', (req, res) => {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
    console.log('🗑️ Todos los registros han sido borrados.');
    res.json({ success: true, message: 'Registros vaciados' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});