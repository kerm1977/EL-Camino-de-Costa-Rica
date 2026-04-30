// ==========================================
// BACKEND REAL (server.js)
// Este código NO va en tu carpeta 'www' de Capacitor.
// Esto se ejecuta en un servidor Node.js independiente.
// ==========================================

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors()); // Permite que tu app de Capacitor se conecte sin bloqueos

// 1. Conectar y crear la base de datos SQLite automáticamente
// Esto creará un archivo llamado "database.sqlite" en la misma carpeta donde corras este server.js
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error("❌ Error conectando a SQLite:", err.message);
    } else {
        console.log("✅ Conectado a la base de datos SQLite correctamente.");
    }
});

// 2. Crear la tabla de usuarios si no existe
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    apellidos TEXT,
    email TEXT UNIQUE,
    telefono TEXT,
    password_hash TEXT,
    pin_hash TEXT
)`);

// ==========================================
// RUTA 1: REGISTRO DE USUARIOS REAL
// ==========================================
app.post('/api/registro', (req, res) => {
    const { nombre, apellidos, email, telefono, password, pin } = req.body;
    
    // Encriptamos la contraseña y el pin antes de guardarlos en SQLite
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashPin = bcrypt.hashSync(pin, salt);

    const sql = `INSERT INTO usuarios (nombre, apellidos, email, telefono, password_hash, pin_hash) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [nombre, apellidos, email, telefono, hashPass, hashPin], function(err) {
        if (err) {
            // Si el correo ya existe en SQLite, falla por la regla "UNIQUE"
            if(err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).json({ message: "Este correo ya está registrado." });
            }
            return res.status(500).json({ message: "Error interno en la base de datos." });
        }
        res.status(200).json({ message: "Usuario creado exitosamente.", userId: this.lastID });
    });
});

// ==========================================
// RUTA 2: LOGIN REAL
// ==========================================
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Buscamos el correo en SQLite
    db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], (err, row) => {
        if (err) return res.status(500).json({ message: "Error consultando la base de datos." });
        
        // Si no se encuentra el correo:
        if (!row) return res.status(401).json({ message: "El correo no está registrado en el sistema." });

        // Comparamos la contraseña escrita con la encriptada en la base de datos
        const passCorrecta = bcrypt.compareSync(password, row.password_hash);
        
        if (!passCorrecta) {
            return res.status(401).json({ message: "La contraseña es incorrecta." });
        }

        // Si todo coincide, damos acceso real
        res.status(200).json({ 
            success: true, 
            message: "Login correcto.", 
            usuario: { nombre: row.nombre, email: row.email } 
        });
    });
});

// ==========================================
// INICIAR EL SERVIDOR
// ==========================================
const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`🚀 Servidor Backend corriendo y escuchando en http://localhost:${PUERTO}`);
});