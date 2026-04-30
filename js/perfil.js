// ==========================================
// MÓDULO: PERFIL (Vista, Edición y Persistencia)
// Archivo: js/perfil.js
// ==========================================

window.templates = window.templates || {};

// --- 1. GENERADORES AUXILIARES ---
window.generarActivadoresHTML = function(prefix) {
    const redes = ['WhatsApp', 'Signal', 'Email', 'Facebook', 'Instagram', 'TikTok', 'Telegram', 'URL Waze', 'URL Google Maps'];
    let html = '';
    redes.forEach((red, i) => {
        const id = `${prefix}-act-${i}`;
        html += `
        <div class="field-container mb-2 p-2" style="background: var(--input-bg); border-radius: 1rem;">
            <div class="form-check form-switch m-0 d-flex justify-content-between align-items-center">
                <label class="form-check-label small fw-bold m-0" for="${id}">${red}</label>
                <input class="form-check-input m-0 profile-input" type="checkbox" id="${id}" onchange="window.toggleSection('${id}-input', this.checked)">
            </div>
            <input type="text" id="${id}-input" class="form-control custom-input mt-2 d-none profile-input" placeholder="Ingresa datos o URL de ${red}">
        </div>`;
    });
    
    html += `
        <div class="field-container d-flex gap-2 mt-3">
            <button class="btn btn-sm btn-teal w-50" style="font-size: 0.7rem;"><i class="bi bi-whatsapp me-1"></i>Contactar WA Registrado</button>
            <button class="btn btn-sm btn-teal w-50" style="font-size: 0.7rem;"><i class="bi bi-envelope-fill me-1"></i>Contactar por Email</button>
        </div>
    `;
    return html;
};

// --- 2. PLANTILLA HTML ---
window.templates.perfil = `
    <div class="module-fade-in pb-5">
        <header class="top-bar d-flex justify-content-between align-items-center mb-4 pt-3">
            <a href="#home" class="btn-circle text-decoration-none"><i class="bi bi-arrow-left fs-5"></i></a>
            <h5 class="mb-0 fw-bold">Mi Perfil</h5>
            <div style="width: 45px;"></div>
        </header>

        <div class="card-perfil position-relative" style="background: var(--white); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow);">
            <!-- Botón Flotante para Editar/Cancelar -->
            <button id="btn-edit-profile" class="btn btn-light btn-circle position-absolute shadow-sm" style="top: 1rem; right: 1rem; width: 40px; height: 40px; z-index: 10;" onclick="window.toggleEditMode()">
                <i class="bi bi-pencil-fill"></i>
            </button>

            <h6 class="fw-bold mb-3 text-teal"><i class="bi bi-person-lines-fill me-2"></i>Información Personal</h6>
            
            <div class="field-container mb-3"><label class="small text-muted fw-bold ms-1">Nombre Completo</label><input type="text" id="perf-nombre" class="form-control custom-input profile-input" placeholder="Nombre Apellidos"></div>
            <div class="field-container mb-3"><label class="small text-muted fw-bold ms-1">Correo Electrónico</label><input type="email" id="perf-email" class="form-control custom-input profile-input" readonly></div>
            <div class="field-container mb-3"><label class="small text-muted fw-bold ms-1">Teléfono</label><input type="tel" id="perf-tel" class="form-control custom-input profile-input" placeholder="+506 8888 8888"></div>

            <hr class="my-4" style="border-color: var(--input-border); opacity: 0.3;">

            <!-- SECCIÓN GRUPO -->
            <div id="section-grupo">
                <div class="field-container d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-people-fill me-2"></i>Anunciar Grupo</h6>
                    <div class="form-check form-switch m-0"><input class="form-check-input profile-input" type="checkbox" id="perf-switch-grupo" onchange="window.toggleSection('form-grupo', this.checked)"></div>
                </div>
                
                <div id="form-grupo" class="d-none mt-3 mb-4">
                    <div class="field-container mb-2"><input type="text" id="perf-g-op" class="form-control custom-input profile-input" placeholder="Nombre del Operador"></div>
                    <div class="field-container mb-2"><input type="text" id="perf-g-coord" class="form-control custom-input profile-input" placeholder="Nombre del Coordinador o Encargado"></div>
                    
                    <div class="field-container mb-2">
                        <label class="small text-muted fw-bold ms-1 mt-2">Ubicación</label>
                        <select id="perf-g-prov" class="form-select custom-input profile-input" style="appearance: none;">
                            <option value="">Selecciona Provincia</option>
                            <option value="San José">San José</option><option value="Alajuela">Alajuela</option><option value="Cartago">Cartago</option>
                            <option value="Heredia">Heredia</option><option value="Guanacaste">Guanacaste</option><option value="Puntarenas">Puntarenas</option><option value="Limón">Limón</option>
                        </select>
                    </div>

                    <div class="field-container mb-2"><label class="small text-muted fw-bold ms-1 mt-2">Logotipos y Certificados</label><input type="file" id="perf-g-logo" class="form-control custom-input profile-input" accept="image/*" title="Agrega tu Logo"></div>
                    <div class="field-container mb-2"><input type="file" id="perf-g-cert" class="form-control custom-input profile-input" accept="application/pdf,image/*" title="Agrega tu Certificado"></div>

                    <div class="field-container mb-2">
                        <label class="small text-muted fw-bold ms-1 mt-2">Opciones de Servicio</label>
                        <div class="d-flex gap-3 flex-wrap mb-2">
                            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="perf-g-ext"><label class="form-check-label small fw-bold" for="perf-g-ext">Atención a Extranjeros</label></div>
                            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="perf-g-ind"><label class="form-check-label small fw-bold" for="perf-g-ind">Atención Individual</label></div>
                            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="perf-g-full"><label class="form-check-label small fw-bold" for="perf-g-full">Servicio Completo</label></div>
                        </div>
                    </div>

                    <div class="field-container row g-2 mb-3">
                        <div class="col-6"><input type="tel" id="perf-g-tellocal" class="form-control custom-input profile-input" placeholder="Teléfono Local"></div>
                        <div class="col-6"><input type="tel" id="perf-g-celular" class="form-control custom-input profile-input" placeholder="Celular"></div>
                    </div>

                    <h6 class="fw-bold text-muted mt-3 mb-2 small">Comunicación (Activadores)</h6>
                    ${window.generarActivadoresHTML('perf-g')}
                </div>
                <hr class="my-4" style="border-color: var(--input-border); opacity: 0.3;">
            </div>

            <!-- SECCIÓN EMPRENDIMIENTO -->
            <div id="section-emp">
                <div class="field-container d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-shop me-2"></i>Anunciar Emprendimiento</h6>
                    <div class="form-check form-switch m-0"><input class="form-check-input profile-input" type="checkbox" id="perf-switch-emp" onchange="window.toggleSection('form-emp', this.checked)"></div>
                </div>
                
                <div id="form-emp" class="d-none mt-3 mb-2">
                    <div class="field-container mb-2"><input type="text" id="perf-emp-nombre" class="form-control custom-input profile-input" placeholder="Nombre del Emprendimiento"></div>
                    <div class="field-container mb-2"><input type="text" id="perf-emp-cont" class="form-control custom-input profile-input" placeholder="Nombre del Contacto"></div>
                    
                    <div class="field-container mb-2"><label class="small text-muted fw-bold ms-1 mt-2">Imagen del Comercio</label><input type="file" id="perf-emp-img" class="form-control custom-input profile-input" accept="image/*"></div>
                    
                    <div class="field-container form-check form-switch mb-2 mt-3">
                        <input class="form-check-input profile-input" type="checkbox" id="perf-emp-sello" onchange="window.toggleSection('perf-emp-sello-input', this.checked)">
                        <label class="form-check-label small fw-bold" for="perf-emp-sello">¿Tienes Sello?</label>
                    </div>
                    <div class="field-container mb-2"><input type="file" id="perf-emp-sello-input" class="form-control custom-input d-none profile-input" accept="image/*" title="Imagen del Sello"></div>

                    <div class="field-container mb-2"><input type="text" id="perf-emp-etapa" class="form-control custom-input mt-2 profile-input" placeholder="Etapa"></div>
                    <div class="field-container mb-2"><input type="tel" id="perf-emp-tel" class="form-control custom-input profile-input" placeholder="Teléfono (+506...)"></div>
                    <div class="field-container mb-2"><input type="text" id="perf-emp-horario" class="form-control custom-input profile-input" placeholder="Horario (Ej. L-V 8am - 5pm)"></div>

                    <div class="field-container mb-2">
                        <label class="small text-muted fw-bold ms-1 mt-2">Tipo de Servicio</label>
                        <select id="perf-emp-tipo" class="form-select custom-input profile-input" onchange="window.checkOtroServicio(this)" style="appearance: none;">
                            <option value="Restaurante">Restaurante</option><option value="Soda">Soda</option><option value="Pulpería">Pulpería</option>
                            <option value="Hostal">Hostal</option><option value="Estadía">Estadía</option><option value="Hotel">Hotel</option>
                            <option value="Casa Hospedaje">Casa Hospedaje</option><option value="Apicultura">Apicultura</option>
                            <option value="Transporte Terrestre">Transporte Terrestre</option><option value="Transporte Acuatico">Transporte Acuatico</option>
                            <option value="Acarreo">Acarreo</option><option value="Guía Local">Guía Local</option><option value="Asociación">Asociación</option>
                            <option value="Museo">Museo</option><option value="Zona de Camping">Zona de Camping</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>
                    <div class="field-container mb-2"><input type="text" id="perf-emp-tipo-otro" class="form-control custom-input d-none profile-input" placeholder="Especificar otro servicio"></div>

                    <h6 class="fw-bold text-muted mt-3 mb-2 small">Comunicación (Activadores)</h6>
                    ${window.generarActivadoresHTML('perf-e')}
                </div>
            </div>
        </div>

        <button id="btn-save-profile-bottom" class="btn btn-teal w-100 mb-4 py-3 fs-5" onclick="window.guardarPerfil()"><i class="bi bi-save2-fill me-2"></i>Guardar Perfil Completo</button>

        <!-- SECCIONES DE SEGURIDAD (Se ocultan en modo lectura) -->
        <div id="profile-settings-sections">
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

            <div class="card-perfil" style="border: 2px solid #fc8181; background-color: #fff5f5; border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow);">
                <h6 class="fw-bold mb-2 text-danger"><i class="bi bi-exclamation-triangle-fill me-2"></i>Zona de Peligro</h6>
                <p class="small text-muted mb-3">Si eliminas tu perfil, perderás acceso a tu nube, grupos y emprendimientos. Esta acción no se puede revertir.</p>
                <button class="btn btn-danger-custom w-100" onclick="window.iniciarBorrado()"><i class="bi bi-trash3-fill me-2"></i>Eliminar Perfil</button>
            </div>
        </div>
    </div>
`;

// --- 3. LÓGICA DE NEGOCIO ---

window.toggleSection = function(elementId, show) {
    const el = document.getElementById(elementId);
    if(el) { show ? el.classList.remove('d-none') : el.classList.add('d-none'); }
};

window.checkOtroServicio = function(selectEl) {
    const inputOtro = document.getElementById('perf-emp-tipo-otro');
    if(selectEl.value === 'Otros') { inputOtro.classList.remove('d-none'); } 
    else { inputOtro.classList.add('d-none'); }
};

window.toggleValMethod = function() {
    const isPin = document.getElementById('valPin').checked;
    window.toggleSection('val-pin-section', isPin);
    window.toggleSection('val-json-section', !isPin);
};

window.validarIdentidad = function() {
    window.showSysAlert('success', 'Validación Correcta', 'Identidad confirmada. Ahora puedes cambiar tu contraseña.');
    document.getElementById('new-password-section').classList.remove('d-none');
};

window.generarNuevaLlave = function() {
    const p1 = document.getElementById('perf-new-pass1').value;
    const p2 = document.getElementById('perf-new-pass2').value;
    if(!p1 || p1 !== p2) return window.showSysAlert('warning', 'Error', 'Las nuevas contraseñas no coinciden o están vacías.');
    
    const blob = new Blob([JSON.stringify({msg: "Nueva llave simulada"}, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `myCloudKey_actualizada.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    window.showSysAlert('success', '¡Actualizado!', 'Contraseña cambiada y nueva llave descargada.');
    document.getElementById('new-password-section').classList.add('d-none');
    document.getElementById('perf-new-pass1').value = ''; document.getElementById('perf-new-pass2').value = '';
};

// --- LÓGICA DE PERSISTENCIA Y MODO LECTURA/EDICIÓN DEL PERFIL ---
window.isEditingProfile = true; 

window.loadProfileData = function() {
    const emailInput = document.getElementById('perf-email');
    if(emailInput) emailInput.value = localStorage.getItem('userEmail') || 'usuario@nube.com';

    const savedData = localStorage.getItem('userProfileData');
    if(savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                if(el.type === 'checkbox') {
                    el.checked = data[id];
                    if(el.onchange) el.onchange(); 
                } else {
                    el.value = data[id];
                }
            }
        });
        // Activar modo vista si ya hay datos guardados
        window.isEditingProfile = true;
        window.toggleEditMode();
    } else {
        // Si es la primera vez, activar modo edición directamente
        window.isEditingProfile = false;
        window.toggleEditMode();
    }
};

window.guardarPerfil = function() {
    const inputs = document.querySelectorAll('.profile-input');
    const data = {};
    inputs.forEach(i => {
        if(i.type === 'checkbox') {
            data[i.id] = i.checked;
        } else if(i.type !== 'file') {
            data[i.id] = i.value;
        }
    });
    localStorage.setItem('userProfileData', JSON.stringify(data));
    window.showSysAlert('success', 'Perfil Guardado', 'Tu información se ha actualizado correctamente.');
    window.isEditingProfile = true; 
    window.toggleEditMode(); 
};

window.toggleEditMode = function() {
    window.isEditingProfile = !window.isEditingProfile;
    const btn = document.getElementById('btn-edit-profile');
    const inputs = document.querySelectorAll('.profile-input');
    const fieldContainers = document.querySelectorAll('.field-container');
    const settingsSection = document.getElementById('profile-settings-sections');
    const saveBtn = document.getElementById('btn-save-profile-bottom');
    
    if (window.isEditingProfile) {
        // MODO EDICIÓN
        btn.innerHTML = '<i class="bi bi-x-lg"></i>';
        btn.classList.replace('btn-light', 'btn-teal');
        
        inputs.forEach(i => {
            if(i.id !== 'perf-email') {
                i.removeAttribute('readonly');
                i.removeAttribute('disabled');
            }
            if(i.type === 'file') i.parentElement.classList.remove('d-none');
        });
        
        fieldContainers.forEach(c => c.classList.remove('d-none'));
        settingsSection.classList.remove('d-none');
        saveBtn.classList.remove('d-none');
        
        window.toggleSection('form-grupo', document.getElementById('perf-switch-grupo').checked);
        window.toggleSection('form-emp', document.getElementById('perf-switch-emp').checked);
        
    } else {
        // MODO LECTURA (Tarjeta)
        btn.innerHTML = '<i class="bi bi-pencil-fill"></i>';
        btn.classList.replace('btn-teal', 'btn-light');
        
        inputs.forEach(i => {
            i.setAttribute('readonly', true);
            if(i.tagName === 'SELECT' || i.type === 'checkbox' || i.type === 'radio') {
                i.setAttribute('disabled', true);
            }
            if(i.type === 'file') i.parentElement.classList.add('d-none'); 
        });
        
        // Ocultar campos vacíos en modo lectura
        fieldContainers.forEach(c => {
            const input = c.querySelector('.profile-input');
            if (input) {
                if (input.type !== 'checkbox' && (input.value.trim() === '' || input.value === 'false')) {
                    c.classList.add('d-none');
                } else {
                    c.classList.remove('d-none');
                }
            }
        });
        
        if(!document.getElementById('perf-switch-grupo').checked) {
            document.getElementById('section-grupo').classList.add('d-none');
        }
        if(!document.getElementById('perf-switch-emp').checked) {
            document.getElementById('section-emp').classList.add('d-none');
        }
        
        settingsSection.classList.add('d-none');
        saveBtn.classList.add('d-none');
    }
};

window.iniciarBorrado = function() {
    window.showSysConfirm('Advertencia 1/3', '¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.', () => {
        window.showSysConfirm('Advertencia 2/3', '¿Completamente seguro? Se perderá absolutamente toda tu información, grupos, y emprendimientos.', () => {
            window.showSysConfirm('Advertencia 3/3', 'ÚLTIMA ADVERTENCIA. ¿Eliminar permanentemente tu cuenta de la nube?', () => {
                localStorage.clear();
                window.showSysAlert('success', 'Perfil Eliminado', 'Tu información ha sido borrada permanentemente del servidor.');
                setTimeout(() => { window.location.hash = 'home'; }, 2000);
            });
        });
    });
};