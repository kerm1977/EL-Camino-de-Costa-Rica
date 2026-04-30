// ==========================================
// MÓDULO: LOGIN (Inicio de sesión y recuperación)
// Archivo: js/login.js
// ==========================================

window.templates = window.templates || {};

// --- 1. PLANTILLA HTML ---
window.templates.login = `
    <div class="module-fade-in pb-5">
        <header class="top-bar position-relative text-center mb-4 pt-4">
            <a href="#home" class="btn-circle position-absolute" style="left: 1rem; top: max(1rem, env(safe-area-inset-top)); text-decoration: none;">
                <i class="bi bi-arrow-left fs-5"></i>
            </a>
            <img src="img/logo.png" alt="Logo" class="mx-auto d-block mb-3" style="width: 80px; height: 80px; object-fit: contain;">
            <h4 class="fw-bold mb-1">Bienvenido</h4>
            <p class="text-muted small">Inicia sesión para acceder a tu perfil</p>
        </header>
        <form onsubmit="window.handleLogin(event)" class="px-2">
            <div class="mb-3">
                <label class="form-label fw-bold small text-muted ms-1">Email</label>
                <input type="email" id="login-email" class="form-control custom-input" placeholder="tu@correo.com" required>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold small text-muted ms-1">Contraseña</label>
                <div class="input-group">
                    <input type="password" id="login-pass" class="form-control custom-input" placeholder="••••••••" required>
                    <span class="input-group-text custom-addon" onclick="window.toggleLoginPassword('login-pass', 'login-eye')">
                        <i class="bi bi-eye" id="login-eye"></i>
                    </span>
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-4 px-1">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="rememberMe">
                    <label class="form-check-label small fw-bold text-muted" for="rememberMe">Recordar Contraseña</label>
                </div>
                <a href="#" class="text-teal text-decoration-none small fw-bold" data-bs-toggle="modal" data-bs-target="#recoveryModal">Olvidé Contraseña</a>
            </div>
            <button type="submit" id="btn-login" class="btn btn-teal w-100 mb-4">Ingresar</button>
            <div class="text-center">
                <span class="text-muted small fw-bold">¿No tienes cuenta?</span>
                <a href="#registro" class="text-teal text-decoration-none small fw-bold ms-1">Regístrate</a>
            </div>
        </form>
    </div>
`;

// --- 2. LÓGICA DE NEGOCIO ---

// Mostrar/Ocultar contraseña
window.toggleLoginPassword = function(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === "password") {
        input.type = "text"; 
        icon.classList.replace('bi-eye', 'bi-eye-slash'); 
        icon.classList.add('text-teal');
    } else {
        input.type = "password"; 
        icon.classList.replace('bi-eye-slash', 'bi-eye'); 
        icon.classList.remove('text-teal');
    }
};

// Manejar el envío del formulario de login
window.handleLogin = async function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    const btn = document.getElementById('btn-login');
    const originalText = btn.innerText;

    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Validando...';
    btn.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pass })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email); 
            window.showSysAlert('success', '¡Conectado!', 'Has iniciado sesión correctamente.');
            
            setTimeout(() => {
                const alertModal = document.getElementById('sysAlertModal');
                if(alertModal) { 
                    const modalInstance = bootstrap.Modal.getInstance(alertModal); 
                    if(modalInstance) modalInstance.hide(); 
                }
                window.location.hash = 'home';
            }, 1500);
        } else {
            window.showSysAlert('warning', 'Acceso Denegado', data.message || 'Credenciales incorrectas.');
        }
    } catch (error) {
        console.error("Error conectando al servidor:", error);
        window.showSysAlert('warning', 'Error de red', 'No pudimos conectar con el servidor Node.js. Asegúrate de tenerlo ejecutándose.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};

// Leer y procesar el archivo JSON de recuperación de cuenta
window.processRecoveryFile = function() {
    const fileInput = document.getElementById('jsonKeyFile');
    if(!fileInput.files.length) return window.showSysAlert('warning', 'Atención', 'Selecciona tu archivo .json');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if(data.password_hash && data.pin_hash) {
                const modalInstance = bootstrap.Modal.getInstance(document.getElementById('recoveryModal'));
                if(modalInstance) modalInstance.hide();
                window.showSysAlert('success', 'Llave Validada', `Hola ${data.nombre}, hemos verificado tu llave.`);
            } else throw new Error();
        } catch(err) { 
            window.showSysAlert('warning', 'Error', 'El archivo cargado no es válido o está corrupto.'); 
        }
    };
    reader.readAsText(fileInput.files[0]);
};