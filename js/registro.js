<!-- ==========================================
    MÓDULO: REGISTRO (registro.html)
    Depende de index.html
=========================================== -->

<div class="view-module" id="module-register">
    <header class="top-bar d-flex align-items-center mb-4">
        <!-- El botón regresar llama a loadModule('login') para volver al login -->
        <button class="btn-circle me-3" type="button" onclick="loadModule('login', document.querySelectorAll('.nav-item')[4])">
            <i class="bi bi-arrow-left fs-5"></i>
        </button>
        <h5 class="mb-0 fw-bold">Crear Cuenta</h5>
    </header>

    <form id="registerForm" onsubmit="handleRegister(event)" class="px-2 pb-5">
        <div class="row g-2 mb-3">
            <div class="col-12">
                <input type="text" id="reg-nombre" class="form-control custom-input" placeholder="Nombre" required>
            </div>
            <div class="col-6">
                <input type="text" id="reg-ape1" class="form-control custom-input" placeholder="Primer Apellido" required>
            </div>
            <div class="col-6">
                <input type="text" id="reg-ape2" class="form-control custom-input" placeholder="Segundo Apellido">
            </div>
        </div>

        <div class="mb-3">
            <input type="email" id="reg-email" class="form-control custom-input" placeholder="Email" required>
        </div>

        <div class="mb-3">
            <input type="tel" id="reg-tel" class="form-control custom-input" placeholder="Teléfono" required>
        </div>

        <div class="mb-3">
            <div class="input-group">
                <input type="password" id="reg-pass" class="form-control custom-input" placeholder="Contraseña" required>
                <span class="input-group-text custom-addon" onclick="toggleRegisterPassword('reg-pass', 'reg-eye-1')">
                    <i class="bi bi-eye" id="reg-eye-1"></i>
                </span>
            </div>
        </div>

        <div class="mb-3">
            <div class="input-group">
                <input type="password" id="reg-pass2" class="form-control custom-input" placeholder="Verificar Contraseña" required>
                <span class="input-group-text custom-addon" onclick="toggleRegisterPassword('reg-pass2', 'reg-eye-2')">
                    <i class="bi bi-eye" id="reg-eye-2"></i>
                </span>
            </div>
            <div id="pass-error" class="text-danger small fw-bold mt-1 d-none ms-1">Las contraseñas no coinciden</div>
        </div>

        <div class="mb-4">
            <label class="form-label fw-bold small text-muted ms-1">PIN de recuperación (6 dígitos)</label>
            <!-- Validación para solo permitir 6 números -->
            <input type="text" id="reg-pin" class="form-control custom-input text-center fs-4 tracking-widest" placeholder="••••••" maxlength="6" pattern="\d{6}" required oninput="this.value = this.value.replace(/[^0-9]/g, '');">
        </div>

        <button type="submit" class="btn btn-teal w-100 mb-4" id="btn-registrar">Registrar y Generar Llave</button>
    </form>
</div>

<script>
    function toggleRegisterPassword(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        
        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash', 'text-teal');
        } else {
            input.type = "password";
            icon.classList.remove('bi-eye-slash', 'text-teal');
            icon.classList.add('bi-eye');
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        
        const pass1 = document.getElementById('reg-pass').value;
        const pass2 = document.getElementById('reg-pass2').value;
        const errLabel = document.getElementById('pass-error');

        if(pass1 !== pass2) {
            errLabel.classList.remove('d-none');
            return;
        }
        errLabel.classList.add('d-none');

        const btn = document.getElementById('btn-registrar');
        const originalText = btn.innerText;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
        btn.disabled = true;

        const nombre = document.getElementById('reg-nombre').value;
        const ape1 = document.getElementById('reg-ape1').value;
        const ape2 = document.getElementById('reg-ape2').value;
        const email = document.getElementById('reg-email').value;
        const tel = document.getElementById('reg-tel').value;
        const pin = document.getElementById('reg-pin').value;

        try {
            // CONEXIÓN AL BACKEND REAL (SQLite)
            const API_URL = 'http://localhost:3000/api/registro';
            
            const response = await fetch(API_URL, {
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
                // Registro exitoso en SQLite, generamos llave
                const salt = dcodeIO.bcrypt.genSaltSync(10);
                const hashPassword = dcodeIO.bcrypt.hashSync(pass1, salt);
                const hashPin = dcodeIO.bcrypt.hashSync(pin, salt);

                const userData = {
                    nombre,
                    primer_apellido: ape1,
                    segundo_apellido: ape2,
                    email,
                    telefono: tel,
                    password_hash: hashPassword,
                    pin_hash: hashPin,
                    creado: new Date().toISOString()
                };

                const jsonStr = JSON.stringify(userData, null, 2);
                const blob = new Blob([jsonStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement("a");
                a.href = url;
                a.download = `myCloudKey_${nombre.toLowerCase()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                document.getElementById('registerForm').reset();
                
                if(typeof showSysAlert === 'function') {
                    showSysAlert('success', '¡Cuenta Creada!', 'Se ha guardado en la Base de Datos. Redirigiendo al login...');
                }

                // Redirigir al login
                setTimeout(() => {
                    loadModule('login', document.querySelectorAll('.nav-item')[4]);
                }, 3500);

            } else {
                if(typeof showSysAlert === 'function') {
                    showSysAlert('warning', 'Error de Registro', data.message || 'No se pudo crear la cuenta.');
                }
            }
        } catch (error) {
            console.error(error);
            if(typeof showSysAlert === 'function') {
                showSysAlert('warning', 'Error de red', 'No pudimos conectar con el servidor.');
            }
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
</script>