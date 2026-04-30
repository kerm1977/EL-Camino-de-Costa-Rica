// js/perfil.js
window.templates = window.templates || {};

// ==========================================
// 1. LÓGICA DEL PERFIL
// ==========================================

window.generarActivadoresHTML = function(prefix) {
    const redes = ['WhatsApp', 'Signal', 'Email', 'Facebook', 'Instagram', 'TikTok', 'Telegram', 'URL Waze', 'URL Google Maps'];
    let html = '';
    redes.forEach((red, i) => {
        const id = `${prefix}-act-${i}`;
        html += `
        <div class="mb-2 p-2" style="background: var(--input-bg); border-radius: 1rem;">
            <div class="form-check form-switch m-0 d-flex justify-content-between align-items-center">
                <label class="form-check-label small fw-bold m-0" for="${id}">${red}</label>
                <input class="form-check-input m-0" type="checkbox" id="${id}" onchange="window.toggleSection('${id}-input', this.checked)">
            </div>
            <input type="text" id="${id}-input" class="form-control custom-input mt-2 d-none" placeholder="Ingresa datos o URL de ${red}">
        </div>`;
    });
    
    html += `
        <div class="d-flex gap-2 mt-3">
            <button class="btn btn-sm btn-teal w-50" style="font-size: 0.7rem;"><i class="bi bi-whatsapp me-1"></i>Contactar WA Registrado</button>
            <button class="btn btn-sm btn-teal w-50" style="font-size: 0.7rem;"><i class="bi bi-envelope-fill me-1"></i>Contactar por Email</button>
        </div>
    `;
    return html;
};

window.toggleSection = function(elementId, show) {
    const el = document.getElementById(elementId);
    if(el) { show ? el.classList.remove('d-none') : el.classList.add('d-none'); }
};

window.checkOtroServicio = function(selectEl) {
    const inputOtro = document.getElementById('emp-tipo-otro');
    if(selectEl.value === 'Otros') { inputOtro.classList.remove('d-none'); } 
    else { inputOtro.classList.add('d-none'); }
};

window.toggleValMethod = function() {
    const isPin = document.getElementById('valPin').checked;
    window.toggleSection('val-pin-section', isPin);
    window.toggleSection('val-json-section', !isPin);
};

window.validarIdentidad = function() {
    // Al conectar a Backend, aquí se haría un fetch() para validar.
    window.showSysAlert('success', 'Validación Correcta', 'Identidad confirmada. Ahora puedes cambiar tu contraseña.');
    document.getElementById('new-password-section').classList.remove('d-none');
};

window.generarNuevaLlave = function() {
    const p1 = document.getElementById('perf-new-pass1').value;
    const p2 = document.getElementById('perf-new-pass2').value;
    if(!p1 || p1 !== p2) return window.showSysAlert('warning', 'Error', 'Las nuevas contraseñas no coinciden o están vacías.');
    
    // Simulación de descarga de nueva llave
    const blob = new Blob([JSON.stringify({msg: "Nueva llave generada"}, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `myCloudKey_actualizada.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    window.showSysAlert('success', '¡Actualizado!', 'Contraseña cambiada y nueva llave descargada.');
    document.getElementById('new-password-section').classList.add('d-none');
    document.getElementById('perf-new-pass1').value = ''; document.getElementById('perf-new-pass2').value = '';
};

window.guardarPerfil = function() {
    window.showSysAlert('success', 'Perfil Guardado', 'Toda tu información, grupos y emprendimientos se han sincronizado correctamente.');
};

window.confirmCallback = null;
window.showSysConfirm = function(title, message, callback) {
    document.getElementById('sysConfirmTitle').innerText = title;
    document.getElementById('sysConfirmMsg').innerText = message;
    window.confirmCallback = callback;
    const modalEl = document.getElementById('sysConfirmModal');
    if(modalEl) new bootstrap.Modal(modalEl).show();
};

window.executeConfirm = function() {
    const modalEl = document.getElementById('sysConfirmModal');
    if(modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if(modal) modal.hide();
    }
    if(window.confirmCallback) {
        setTimeout(() => window.confirmCallback(), 300);
    }
};

window.iniciarBorrado = function() {
    window.showSysConfirm('Advertencia 1/3', '¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.', () => {
        window.showSysConfirm('Advertencia 2/3', '¿Completamente seguro? Se perderá absolutamente toda tu información, grupos, y emprendimientos.', () => {
            window.showSysConfirm('Advertencia 3/3', 'ÚLTIMA ADVERTENCIA. ¿Eliminar permanentemente tu cuenta de la nube?', () => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                window.showSysAlert('success', 'Perfil Eliminado', 'Tu información ha sido borrada permanentemente del servidor.');
                setTimeout(() => { window.location.hash = 'home'; }, 2000);
            });
        });
    });
};

// ==========================================
// 2. PLANTILLA HTML DEL PERFIL
// ==========================================
window.templates.perfil = `
    <div class="module-fade-in pb-5">
        <header class="top-bar d-flex justify-content-between align-items-center mb-4">
            <a href="#home" class="btn-circle text-decoration-none"><i class="bi bi-arrow-left fs-5"></i></a>
            <h5 class="mb-0 fw-bold">Mi Perfil</h5>
            <div style="width: 45px;"></div>
        </header>

        <!-- Información Básica -->
        <div class="card-perfil" style="background: var(--white); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow);">
            <h6 class="fw-bold mb-3 text-teal"><i class="bi bi-person-lines-fill me-2"></i>Información Personal</h6>
            <div class="mb-3"><label class="small text-muted fw-bold ms-1">Nombre Completo</label><input type="text" id="perf-nombre" class="form-control custom-input" placeholder="Nombre Apellidos"></div>
            <div class="mb-3"><label class="small text-muted fw-bold ms-1">Correo Electrónico (Solo Lectura)</label><input type="email" id="perf-email" class="form-control custom-input" readonly></div>
            <div class="mb-3"><label class="small text-muted fw-bold ms-1">Teléfono</label><input type="tel" id="perf-tel" class="form-control custom-input" placeholder="+506 8888 8888"></div>
        </div>

        <!-- Cambiar Contraseña -->
        <div class="card-perfil" style="background: var(--white); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow);">
            <h6 class="fw-bold mb-3 text-teal"><i class="bi bi-shield-lock-fill me-2"></i>Cambiar Contraseña</h6>
            <p class="small text-muted mb-3">Para cambiar tu contraseña, primero valida tu identidad usando tu PIN o subiendo tu Llave JSON.</p>
            
            <div class="d-flex gap-3 mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="valMethod" id="valPin" checked onchange="window.toggleValMethod()">
                    <label class="form-check-label small fw-bold" for="valPin">Usar PIN y Clave</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="valMethod" id="valJson" onchange="window.toggleValMethod()">
                    <label class="form-check-label small fw-bold" for="valJson">Usar Llave JSON</label>
                </div>
            </div>

            <div id="val-pin-section">
                <input type="password" id="perf-val-pass" class="form-control custom-input mb-2" placeholder="Contraseña Actual">
                <input type="text" id="perf-val-pin" class="form-control custom-input mb-3 text-center tracking-widest" placeholder="PIN de 6 dígitos" maxlength="6">
            </div>
            <div id="val-json-section" class="d-none">
                <input type="file" id="perf-val-file" class="form-control custom-input mb-3" accept=".json">
            </div>

            <button class="btn btn-teal w-100 mb-3" onclick="window.validarIdentidad()">Validar Identidad</button>

            <!-- Inputs de Nueva Contraseña (Ocultos hasta validar) -->
            <div id="new-password-section" class="d-none p-3 mt-3" style="background-color: var(--bg-color); border-radius: 1rem; border: 1px solid var(--teal-light);">
                <h6 class="fw-bold mb-3 text-success"><i class="bi bi-check-circle-fill me-2"></i>Identidad Validada</h6>
                <div class="input-group mb-2">
                    <input type="password" id="perf-new-pass1" class="form-control custom-input" placeholder="Nueva Contraseña">
                    <span class="input-group-text custom-addon" onclick="window.toggleLoginPassword('perf-new-pass1', 'perf-eye-n1')"><i class="bi bi-eye" id="perf-eye-n1"></i></span>
                </div>
                <div class="input-group mb-3">
                    <input type="password" id="perf-new-pass2" class="form-control custom-input" placeholder="Verificar Nueva Contraseña">
                    <span class="input-group-text custom-addon" onclick="window.toggleLoginPassword('perf-new-pass2', 'perf-eye-n2')"><i class="bi bi-eye" id="perf-eye-n2"></i></span>
                </div>
                <button class="btn btn-teal w-100" onclick="window.generarNuevaLlave()">Actualizar y Generar Nueva Llave</button>
            </div>
        </div>

        <!-- Anunciar Grupo -->
        <div class="card-perfil" style="background: var(--white); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow);">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-people-fill me-2"></i>¿Deseas Anunciar tu Grupo?</h6>
                <div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" id="switch-grupo" onchange="window.toggleSection('form-grupo', this.checked)"></div>
            </div>
            
            <div id="form-grupo" class="d-none mt-3">
                <input type="text" class="form-control custom-input mb-2" placeholder="Nombre del Operador">
                <input type="text" class="form-control custom-input mb-2" placeholder="Nombre del Coordinador o Encargado">
                
                <label class="small text-muted fw-bold ms-1 mt-2">Ubicación</label>
                <select class="custom-select mb-2">
                    <option value="">Selecciona Provincia</option>
                    <option value="San José">San José</option><option value="Alajuela">Alajuela</option><option value="Cartago">Cartago</option>
                    <option value="Heredia">Heredia</option><option value="Guanacaste">Guanacaste</option><option value="Puntarenas">Puntarenas</option><option value="Limón">Limón</option>
                </select>

                <label class="small text-muted fw-bold ms-1 mt-2">Logotipos y Certificados</label>
                <input type="file" class="form-control custom-input mb-2" accept="image/*" title="Agrega tu Logo">
                <input type="file" class="form-control custom-input mb-2" accept="application/pdf,image/*" title="Agrega tu Certificado">

                <label class="small text-muted fw-bold ms-1 mt-2">Opciones de Servicio</label>
                <div class="d-flex gap-3 flex-wrap mb-2">
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="g-ext"><label class="form-check-label small" for="g-ext">Atención a Extranjeros</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="g-ind"><label class="form-check-label small" for="g-ind">Atención Individual</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="g-full"><label class="form-check-label small" for="g-full">Servicio Completo</label></div>
                </div>

                <div class="row g-2 mb-3">
                    <div class="col-6"><input type="tel" class="form-control custom-input" placeholder="Teléfono Local"></div>
                    <div class="col-6"><input type="tel" class="form-control custom-input" placeholder="Celular"></div>
                </div>

                <h6 class="fw-bold text-muted mt-3 mb-2 small">Comunicación (Activadores)</h6>
                ${window.generarActivadoresHTML('g')}
            </div>
        </div>

        <!-- Anunciar Emprendimiento -->
        <div class="card-perfil" style="background: var(--white); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow);">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-shop me-2"></i>¿Deseas Anunciar Tu Emprendimiento?</h6>
                <div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" id="switch-emp" onchange="window.toggleSection('form-emp', this.checked)"></div>
            </div>
            
            <div id="form-emp" class="d-none mt-3">
                <input type="text" class="form-control custom-input mb-2" placeholder="Nombre del Emprendimiento">
                <input type="text" class="form-control custom-input mb-2" placeholder="Nombre del Contacto">
                
                <label class="small text-muted fw-bold ms-1 mt-2">Imagen del Comercio</label>
                <input type="file" class="form-control custom-input mb-2" accept="image/*">
                
                <div class="form-check form-switch mb-2 mt-3">
                    <input class="form-check-input" type="checkbox" id="emp-sello-switch" onchange="window.toggleSection('emp-sello-input', this.checked)">
                    <label class="form-check-label small fw-bold" for="emp-sello-switch">¿Tienes Sello?</label>
                </div>
                <input type="file" id="emp-sello-input" class="form-control custom-input mb-2 d-none" accept="image/*" title="Imagen del Sello">

                <input type="text" class="form-control custom-input mb-2 mt-2" placeholder="Etapa">
                <input type="tel" class="form-control custom-input mb-2" placeholder="Teléfono (+506...)">
                <input type="text" class="form-control custom-input mb-2" placeholder="Horario (Ej. L-V 8am - 5pm)">

                <label class="small text-muted fw-bold ms-1 mt-2">Tipo de Servicio</label>
                <select class="custom-select mb-2" onchange="window.checkOtroServicio(this)">
                    <option value="Restaurante">Restaurante</option><option value="Soda">Soda</option><option value="Pulpería">Pulpería</option>
                    <option value="Hostal">Hostal</option><option value="Estadía">Estadía</option><option value="Hotel">Hotel</option>
                    <option value="Casa Hospedaje">Casa Hospedaje</option><option value="Apicultura">Apicultura</option>
                    <option value="Transporte Terrestre">Transporte Terrestre</option><option value="Transporte Acuatico">Transporte Acuatico</option>
                    <option value="Acarreo">Acarreo</option><option value="Guía Local">Guía Local</option><option value="Asociación">Asociación</option>
                    <option value="Museo">Museo</option><option value="Zona de Camping">Zona de Camping</option>
                    <option value="Otros">Otros</option>
                </select>
                <input type="text" id="emp-tipo-otro" class="form-control custom-input mb-2 d-none" placeholder="Especificar otro servicio">

                <h6 class="fw-bold text-muted mt-3 mb-2 small">Comunicación (Activadores)</h6>
                ${window.generarActivadoresHTML('e')}
            </div>
        </div>

        <button class="btn btn-teal w-100 mb-4 py-3 fs-5" onclick="window.guardarPerfil()"><i class="bi bi-save2-fill me-2"></i>Guardar Perfil Completo</button>

        <!-- Zona de Peligro -->
        <div class="card-perfil" style="border: 2px solid #fc8181; background-color: #fff5f5; border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow);">
            <h6 class="fw-bold mb-2 text-danger"><i class="bi bi-exclamation-triangle-fill me-2"></i>Zona de Peligro</h6>
            <p class="small text-muted mb-3">Si eliminas tu perfil, perderás acceso a tu nube, grupos y emprendimientos. Esta acción no se puede revertir.</p>
            <button class="btn btn-danger-custom w-100" onclick="window.iniciarBorrado()"><i class="bi bi-trash3-fill me-2"></i>Eliminar Perfil</button>
        </div>
    </div>
`;