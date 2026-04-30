// js/login.js
window.templates = window.templates || {};
window.templates.login = `
    <div class="module-fade-in pb-5">
        <header class="top-bar text-center mb-4 pt-4">
            <img src="img/logo.png" alt="Logo" class="mx-auto d-block mb-3" style="width: 80px; height: 80px; object-fit: contain;">
            <h4 class="fw-bold mb-1">Bienvenido</h4>
            <p class="text-muted small">Inicia sesión para acceder a tu nube</p>
        </header>
        <form onsubmit="window.handleLogin(event)" class="px-2">
            <div class="mb-3">
                <label class="form-label fw-bold small text-muted ms-1">Email</label>
                <input type="email" class="form-control custom-input" placeholder="tu@correo.com" required>
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
            <button type="submit" class="btn btn-teal w-100 mb-4">Ingresar</button>
            <div class="text-center">
                <span class="text-muted small fw-bold">¿No tienes cuenta?</span>
                <a href="#registro" class="text-teal text-decoration-none small fw-bold ms-1">Regístrate</a>
            </div>
        </form>
    </div>
`;

window.toggleLoginPassword = function(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === "password") {
        input.type = "text"; icon.classList.replace('bi-eye', 'bi-eye-slash'); icon.classList.add('text-teal');
    } else {
        input.type = "password"; icon.classList.replace('bi-eye-slash', 'bi-eye'); icon.classList.remove('text-teal');
    }
};

window.handleLogin = function(e) {
    e.preventDefault();
    window.showSysAlert('success', '¡Conectado!', 'Has iniciado sesión correctamente.');
    setTimeout(() => {
        const alertModal = document.getElementById('sysAlertModal');
        if(alertModal) { const modalInstance = bootstrap.Modal.getInstance(alertModal); if(modalInstance) modalInstance.hide(); }
        window.location.hash = 'home';
    }, 1500);
};

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
        } catch(err) { window.showSysAlert('warning', 'Error', 'El archivo cargado no es válido o está corrupto.'); }
    };
    reader.readAsText(fileInput.files[0]);
};