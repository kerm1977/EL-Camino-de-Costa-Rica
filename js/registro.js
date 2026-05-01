// ==========================================
// MÓDULO: REGISTRO (Creación de cuenta y configuración inicial)
// Archivo: js/registro.js
// Depende de: js/afiliados.js
// ==========================================

window.templates = window.templates || {};

// Funciones auxiliares para asegurar que existan al cargar
window.toggleSection = window.toggleSection || function(elementId, show) {
    const el = document.getElementById(elementId);
    if(el) { show ? el.classList.remove('d-none') : el.classList.add('d-none'); }
};

// Función local para parsear imágenes en el registro
window.regGetBase64 = function(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

// --- 1. PLANTILLA HTML ---
window.templates.registro = `
    <div class="module-fade-in pb-5">
        <header class="top-bar d-flex align-items-center mb-4 pt-3">
            <a href="#login" class="btn-circle me-3 text-decoration-none"><i class="bi bi-arrow-left fs-5"></i></a>
            <h5 class="mb-0 fw-bold">Crear Cuenta</h5>
        </header>
        <form id="registerForm" onsubmit="window.handleRegister(event)" class="px-2 pb-4">
            
            <h6 class="fw-bold mb-3 text-teal"><i class="bi bi-person-lines-fill me-2"></i>Información Personal</h6>
            <div class="row g-2 mb-3">
                <div class="col-12"><input type="text" id="reg-nombre" class="form-control custom-input" placeholder="Nombre" required></div>
                <div class="col-6"><input type="text" id="reg-ape1" class="form-control custom-input" placeholder="Primer Apellido" required></div>
                <div class="col-6"><input type="text" id="reg-ape2" class="form-control custom-input" placeholder="Segundo Apellido"></div>
            </div>
            <div class="mb-3"><input type="email" id="reg-email" class="form-control custom-input" placeholder="Email" required></div>
            <div class="mb-3"><input type="tel" id="reg-tel" class="form-control custom-input" placeholder="Teléfono" required></div>

            <hr class="my-4" style="border-color: var(--input-border); opacity: 0.3;">

            <!-- SECCIÓN GRUPO IMPORTADA DE AFILIADOS.JS -->
            ${window.generarSeccionGrupo ? window.generarSeccionGrupo('reg') : '<div class="alert alert-danger">Falta cargar afiliados.js</div>'}

            <hr class="my-4" style="border-color: var(--input-border); opacity: 0.3;">

            <!-- SECCIÓN EMPRENDIMIENTO IMPORTADA DE AFILIADOS.JS -->
            ${window.generarSeccionEmprendimiento ? window.generarSeccionEmprendimiento('reg') : '<div class="alert alert-danger">Falta cargar afiliados.js</div>'}

            <hr class="my-4" style="border-color: var(--input-border); opacity: 0.3;">

            <h6 class="fw-bold mb-3 text-teal"><i class="bi bi-shield-lock-fill me-2"></i>Seguridad de la Cuenta</h6>
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

// --- 2. LÓGICA DE NEGOCIO ---

window.toggleRegPassword = function(inputId, iconId) {
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

window.handleRegister = async function(e) {
    e.preventDefault();
    const pass1 = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2').value;
    const errLabel = document.getElementById('pass-error');

    if(pass1 !== pass2) { errLabel.classList.remove('d-none'); return; }
    errLabel.classList.add('d-none');

    const btn = document.getElementById('btn-registrar');
    const originalText = btn.innerText;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creando Nube...';
    btn.disabled = true;

    try {
        const nombre = document.getElementById('reg-nombre').value;
        const ape1 = document.getElementById('reg-ape1').value;
        const ape2 = document.getElementById('reg-ape2').value;
        const email = document.getElementById('reg-email').value;
        const tel = document.getElementById('reg-tel').value;
        const pin = document.getElementById('reg-pin').value;

        // 1. Petición para crear el usuario en SQLite
        const response = await fetch('http://localhost:3000/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nombre: nombre, 
                apellidos: `${ape1} ${ape2}`.trim(),
                email: email, 
                telefono: tel,
                password: pass1, 
                pin: pin
            })
        });

        const data = await response.json();

        if (response.ok) {
            // 2. Mapear toda la información extendida hacia el Perfil
            const profileData = {
                'perf-nombre': nombre,
                'perf-ape1': ape1,
                'perf-ape2': ape2,
                'perf-tel': tel,
                
                // Mapeo Grupo
                'perf-switch-grupo': document.getElementById('reg-switch-grupo')?.checked || false,
                'perf-g-op': document.getElementById('reg-g-op')?.value || '',
                'perf-g-coord': document.getElementById('reg-g-coord')?.value || '',
                'perf-g-prov': document.getElementById('reg-g-prov')?.value || '',
                'perf-g-ext': document.getElementById('reg-g-ext')?.checked || false,
                'perf-g-ind': document.getElementById('reg-g-ind')?.checked || false,
                'perf-g-full': document.getElementById('reg-g-full')?.checked || false,
                'perf-g-tellocal': document.getElementById('reg-g-tellocal')?.value || '',
                'perf-g-celular': document.getElementById('reg-g-celular')?.value || '',
                'perf-g-nota': document.getElementById('reg-g-nota')?.innerHTML || '', // Rich Text
                
                // Mapeo Emprendimiento
                'perf-switch-emp': document.getElementById('reg-switch-emp')?.checked || false,
                'perf-emp-nombre': document.getElementById('reg-emp-nombre')?.value || '',
                'perf-emp-cont': document.getElementById('reg-emp-cont')?.value || '',
                'perf-emp-sello': document.getElementById('reg-emp-sello')?.checked || false,
                'perf-emp-ext': document.getElementById('reg-emp-ext')?.checked || false,
                'perf-emp-etapa': document.getElementById('reg-emp-etapa')?.value || '',
                'perf-emp-tel': document.getElementById('reg-emp-tel')?.value || '',
                'perf-emp-horario': document.getElementById('reg-emp-horario')?.value || '',
                'perf-emp-tipo': document.getElementById('reg-emp-tipo')?.value || '',
                'perf-emp-tipo-otro': document.getElementById('reg-emp-tipo-otro')?.value || '',
                'perf-emp-nota': document.getElementById('reg-emp-nota')?.innerHTML || '' // Rich Text
            };

            // Mapeo Activadores (Redes sociales)
            const redes = ['WhatsApp', 'Signal', 'Email', 'Facebook', 'Instagram', 'TikTok', 'Telegram', 'URL Waze', 'URL Google Maps'];
            redes.forEach((red, i) => {
                profileData[`perf-g-act-${i}`] = document.getElementById(`reg-g-act-${i}`)?.checked || false;
                profileData[`perf-g-act-${i}-input`] = document.getElementById(`reg-g-act-${i}-input`)?.value || '';
                profileData[`perf-e-act-${i}`] = document.getElementById(`reg-e-act-${i}`)?.checked || false;
                profileData[`perf-e-act-${i}-input`] = document.getElementById(`reg-e-act-${i}-input`)?.value || '';
            });

            // Mapeo Idiomas Soportados
            const idiomasList = ['es', 'en', 'de', 'it', 'fr', 'pt', 'zh'];
            idiomasList.forEach(lang => {
                profileData[`perf-g-lang-${lang}`] = document.getElementById(`reg-g-lang-${lang}`)?.checked || false;
                profileData[`perf-emp-lang-${lang}`] = document.getElementById(`reg-emp-lang-${lang}`)?.checked || false;
            });

            // Procesamiento de Imágenes (Convertir a Base64 antes de guardar en SQLite)
            const fileGLogo = document.getElementById('reg-g-logo')?.files[0];
            if(fileGLogo) profileData['perf-g-logo'] = await window.regGetBase64(fileGLogo);

            const fileGCert = document.getElementById('reg-g-cert')?.files[0];
            if(fileGCert) profileData['perf-g-cert'] = await window.regGetBase64(fileGCert);

            const fileEmpImg = document.getElementById('reg-emp-img')?.files[0];
            if(fileEmpImg) profileData['perf-emp-img'] = await window.regGetBase64(fileEmpImg);

            const fileEmpSello = document.getElementById('reg-emp-sello-input')?.files[0];
            if(fileEmpSello) profileData['perf-emp-sello-input'] = await window.regGetBase64(fileEmpSello);

            // 3. ENVIAR TODO EL PERFIL AL BACKEND DE INMEDIATO
            await fetch('http://localhost:3000/api/perfil', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, profileData: profileData })
            });

            // Guardar inicio de sesión
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email); 

            // Generación de Llave JSON de seguridad
            const salt = dcodeIO.bcrypt.genSaltSync(10);
            const userDataKey = {
                nombre: nombre, 
                email: email,
                password_hash: dcodeIO.bcrypt.hashSync(pass1, salt),
                pin_hash: dcodeIO.bcrypt.hashSync(pin, salt)
            };

            const blob = new Blob([JSON.stringify(userDataKey, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `myCloudKey_${nombre.toLowerCase()}.json`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if(typeof window.showSysAlert === 'function') {
                window.showSysAlert('success', '¡Cuenta Creada!', 'Se ha guardado tu cuenta y tu perfil en la base de datos. Se descargó tu llave.');
            }
            
            setTimeout(() => { window.location.hash = 'home'; }, 3500);
        } else {
            if(typeof window.showSysAlert === 'function') {
                window.showSysAlert('warning', 'Error de Registro', data.message || 'No se pudo crear la cuenta.');
            }
        }
    } catch (error) {
        console.error("Error conectando al servidor:", error);
        if(typeof window.showSysAlert === 'function') {
            window.showSysAlert('warning', 'Error de red', 'No pudimos conectar con el servidor Node.js. Verifica que esté en ejecución.');
        }
    } finally {
        btn.innerHTML = originalText; 
        btn.disabled = false; 
    }
};