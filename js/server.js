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
// ¡MUY IMPORTANTE! Aumentamos el límite a 200mb para evitar bloqueos por tamaño de imagen
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(cors()); // Permite que tu app de Capacitor se conecte sin bloqueos

// 1. Conectar y crear la base de datos SQLite automáticamente
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error("❌ Error conectando a SQLite:", err.message);
    } else {
        console.log("✅ Conectado a la base de datos SQLite correctamente.");
        // NUEVO: Activamos el modo WAL. Esto evita al 100% el error "database is locked" en SQLite
        db.run('PRAGMA journal_mode = WAL;');
    }
});

// 2. Crear la tabla y aplicar Auto-Migración
db.serialize(() => {
    // NUEVO: Aseguramos que la columna profile_data nazca con la tabla desde el inicio
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        apellidos TEXT,
        email TEXT UNIQUE,
        telefono TEXT,
        password_hash TEXT,
        pin_hash TEXT,
        profile_data TEXT
    )`);

    // 3. AUTO-MIGRACIÓN: Intentamos agregar la columna 'profile_data'.
    // Si la columna ya existe, SQLite tira un error silencioso que ignoramos.
    db.run(`ALTER TABLE usuarios ADD COLUMN profile_data TEXT`, (err) => {
        if (err && !err.message.includes("duplicate column")) {
            console.log("Nota SQL:", err.message);
        } else if (!err) {
            console.log("⚙️ Migración exitosa: Columna 'profile_data' añadida a la base de datos antigua.");
        }
    });
});

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
                console.warn(`⚠️ Intento de registro duplicado para: ${email}`);
                return res.status(400).json({ message: "Este correo ya está registrado." });
            }
            console.error("❌ Error en registro:", err.message);
            return res.status(500).json({ message: "Error interno en la base de datos." });
        }
        console.log(`✅ Nuevo usuario registrado: ${email}`);
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
        if (!row) {
            console.warn(`⚠️ Intento de login fallido (Usuario no existe): ${email}`);
            return res.status(401).json({ message: "El correo no está registrado en el sistema." });
        }

        // Comparamos la contraseña escrita con la encriptada en la base de datos
        const passCorrecta = bcrypt.compareSync(password, row.password_hash);
        
        if (!passCorrecta) {
            console.warn(`⚠️ Intento de login fallido (Clave incorrecta): ${email}`);
            return res.status(401).json({ message: "La contraseña es incorrecta." });
        }

        console.log(`✅ Login exitoso: ${email}`);
        // Si todo coincide, damos acceso real
        res.status(200).json({ 
            success: true, 
            message: "Login correcto.", 
            usuario: { nombre: row.nombre, email: row.email } 
        });
    });
});

// ==========================================
// RUTA 3: GUARDAR PERFIL 
// ==========================================
app.post('/api/perfil', (req, res) => {
    const { email, profileData } = req.body;
    
    if (!email) {
        console.error("❌ Error al guardar perfil: Falta el email en la petición.");
        return res.status(400).json({ error: "Falta el email para identificar al usuario." });
    }

    // Convertimos todo el objeto del perfil (incluyendo el Base64 de la imagen) en String
    const jsonStr = JSON.stringify(profileData);
    
    db.run(`UPDATE usuarios SET profile_data = ? WHERE email = ?`, [jsonStr, email], function(err) {
        if (err) {
            console.error("❌ Error de SQLite guardando perfil:", err.message);
            return res.status(500).json({ error: err.message });
        }
        
        // this.changes nos dice cuántas filas se actualizaron. Si es 0, el correo no existe.
        if (this.changes === 0) {
            console.warn(`⚠️ Intento de guardar perfil fallido: No se encontró al usuario ${email}`);
            return res.status(404).json({ error: "Usuario no encontrado en la base de datos." });
        }

        console.log(`✅ Perfil y/o Logo guardados correctamente para: ${email}`);
        res.status(200).json({ success: true, message: "Perfil guardado en SQLite." });
    });
});

// ==========================================
// RUTA 4: CARGAR PERFIL 
// ==========================================
app.get('/api/perfil', (req, res) => {
    const email = req.query.email;
    
    if (!email) {
        return res.status(400).json({ error: "Se requiere un email." });
    }

    db.get(`SELECT profile_data FROM usuarios WHERE email = ?`, [email], (err, row) => {
        if (err) {
            console.error("❌ Error de SQLite cargando perfil:", err.message);
            return res.status(500).json({ error: err.message });
        }
        
        if (row && row.profile_data) {
            res.status(200).json({ profileData: row.profile_data });
        } else {
            // Si el usuario existe pero no ha configurado el perfil, mandamos un JSON vacío
            res.status(200).json({ profileData: "{}" });
        }
    });
});

// ==========================================
// RUTA 5: OBTENER DIRECTORIO PÚBLICO
// ==========================================
app.get('/api/directorio', (req, res) => {
    db.all(`SELECT profile_data FROM usuarios WHERE profile_data IS NOT NULL`, [], (err, rows) => {
        if (err) {
            console.error("❌ Error de SQLite cargando directorio:", err.message);
            return res.status(500).json({ error: err.message });
        }
        
        let operadores = [];
        let emprendimientos = [];

        rows.forEach(row => {
            try {
                const data = JSON.parse(row.profile_data);
                // Si prendieron el switch de Operador y le pusieron nombre
                if (data['perf-switch-grupo'] && data['perf-g-op']) operadores.push(data);
                // Si prendieron el switch de Emprendimiento y le pusieron nombre
                if (data['perf-switch-emp'] && data['perf-emp-nombre']) emprendimientos.push(data);
            } catch(e) {
                // Ignorar JSON malformado
            }
        });

        res.status(200).json({ operadores, emprendimientos });
    });
});

// ==========================================
// INICIAR EL SERVIDOR
// ==========================================
const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`🚀 Servidor Backend corriendo y escuchando en http://localhost:${PUERTO}`);
});