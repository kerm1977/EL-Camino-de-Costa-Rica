// js/registro.js
window.templates = window.templates || {};
window.templates.registro = `
    <div class="module-fade-in pb-5">
        <header class="top-bar d-flex align-items-center mb-4">
            <a href="#login" class="btn-circle me-3 text-decoration-none"><i class="bi bi-arrow-left fs-5"></i></a>
            <h5 class="mb-0 fw-bold">Crear Cuenta</h5>
        </header>
        <form id="registerForm" onsubmit="window.handleRegister(event)" class="px-2">
            <div class="row g-2 mb-3">
                <div class="col-12"><input type="text" id="reg-nombre" class="form-control custom-input" placeholder="Nombre" required></div>
                <div class="col-6"><input type="text" id="reg-ape1" class="form-control custom-input" placeholder="Primer Apellido" required></div>
                <div class="col-6"><input type="text" id="reg-ape2" class="form-control custom-input" placeholder="Segundo Apellido"></div>
            </div>
            <div class="mb-3"><input type="email" id="reg-email" class="form-control custom-input" placeholder="Email" required></div>
            <div class="mb-3"><input type="tel" id="reg-tel" class="form-control custom-input" placeholder="Teléfono" required></div>
            <div class="mb-3">
                <div class="input-group">
                    <input type="password" id="reg-pass" class="form-control custom-input" placeholder="Contraseña" required>
                    <span class="input-group-text custom-addon" onclick="window.toggleRegPassword('reg-pass', 'reg-eye-1')"><i class="bi bi-eye" id="reg-eye-1"></i></span>
                </div>
            </div>
            <div class="mb-3">
                <div class="input-group">
                    <input type="password" id="reg-pass2" class="form-control custom-input" placeholder="Verificar Contraseña" required>
                    <span class="input-group-text custom-addon" onclick="window.toggleRegPassword('reg-pass2', 'reg-eye-2')"><i class="bi bi-eye" id="reg-eye-2"></i></span>
                </div>
                <div id="pass-error" class="text-danger small fw-bold mt-1 d-none ms-1">Las contraseñas no coinciden</div>
            </div>
            <div class="mb-4">
                <label class="form-label fw-bold small text-muted ms-1">PIN de recuperación (6 dígitos)</label>
                <input type="text" id="reg-pin" class="form-control custom-input text-center fs-4 tracking-widest" placeholder="••••••" maxlength="6" pattern="[0-9]{6}" required oninput="this.value = this.value.replace(/[^0-9]/g, '');">
            </div>
            <button type="submit" class="btn btn-teal w-100 mb-4" id="btn-registrar">Registrar y Generar Llave</button>
        </form>
    </div>
`;

window.toggleRegPassword = function(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === "password") {
        input.type = "text"; icon.classList.replace('bi-eye', 'bi-eye-slash'); icon.classList.add('text-teal');
    } else {
        input.type = "password"; icon.classList.replace('bi-eye-slash', 'bi-eye'); icon.classList.remove('text-teal');
    }
};

window.handleRegister = function(e) {
    e.preventDefault();
    const pass1 = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2').value;
    const errLabel = document.getElementById('pass-error');

    if(pass1 !== pass2) { errLabel.classList.remove('d-none'); return; }
    errLabel.classList.add('d-none');

    const btn = document.getElementById('btn-registrar');
    const originalText = btn.innerText;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
    btn.disabled = true;

    setTimeout(() => {
        try {
            const nombre = document.getElementById('reg-nombre').value;
            const salt = dcodeIO.bcrypt.genSaltSync(10);
            const userData = {
                nombre: nombre,
                email: document.getElementById('reg-email').value,
                password_hash: dcodeIO.bcrypt.hashSync(pass1, salt),
                pin_hash: dcodeIO.bcrypt.hashSync(document.getElementById('reg-pin').value, salt)
            };

            const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `myCloudKey_${nombre.toLowerCase()}.json`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);

            window.showSysAlert('warning', '¡Llave Generada!', 'Se ha descargado una llave a tu dispositivo. Guárdala en un lugar seguro.');
            setTimeout(() => { window.location.hash = 'login'; }, 3500);
        } catch (error) { window.showSysAlert('warning', 'Error', 'Hubo un problema generando la llave.');
        } finally { btn.innerHTML = originalText; btn.disabled = false; }
    }, 800);
};