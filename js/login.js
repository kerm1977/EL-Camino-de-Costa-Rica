<!-- ==========================================
    MÓDULO: LOGIN (login.html)
    Depende de index.html
=========================================== -->

<div class="view-module" id="module-login">
    <header class="top-bar text-center mb-4 pt-4">
        <div class="btn-circle mx-auto mb-3" style="width: 70px; height: 70px; background-color: var(--teal-light); color: white;">
            <i class="bi bi-cloud-check-fill fs-1"></i>
        </div>
        <h4 class="fw-bold mb-1">Bienvenido</h4>
        <p class="text-muted small">Inicia sesión para acceder a tu nube</p>
    </header>

    <form onsubmit="handleLogin(event)" class="px-2">
        <div class="mb-3">
            <label class="form-label fw-bold small text-muted ms-1">Email</label>
            <input type="email" class="form-control custom-input" placeholder="tu@correo.com" required>
        </div>

        <div class="mb-3">
            <label class="form-label fw-bold small text-muted ms-1">Contraseña</label>
            <div class="input-group">
                <input type="password" id="login-pass" class="form-control custom-input" placeholder="••••••••" required>
                <span class="input-group-text custom-addon" onclick="toggleLoginPassword('login-pass', 'login-eye')">
                    <i class="bi bi-eye" id="login-eye"></i>
                </span>
            </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4 px-1">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="rememberMe">
                <label class="form-check-label small fw-bold text-muted" for="rememberMe">
                    Recordar Contraseña
                </label>
            </div>
            <!-- Abre el modal de recuperación que está en index.html -->
            <a href="#" class="text-teal text-decoration-none small fw-bold" data-bs-toggle="modal" data-bs-target="#recoveryModal">Olvidé Contraseña</a>
        </div>

        <button type="submit" class="btn btn-teal w-100 mb-4">Ingresar</button>

        <div class="text-center">
            <span class="text-muted small fw-bold">¿No tienes cuenta?</span>
            <a href="#" class="text-teal text-decoration-none small fw-bold ms-1" onclick="loadModule('registro', document.querySelectorAll('.nav-item')[4])">Regístrate</a>
        </div>
    </form>
</div>

<script>
    function toggleLoginPassword(inputId, iconId) {
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

    async function handleLogin(e) {
        e.preventDefault();
        
        const email = document.querySelector('#module-login input[type="email"]').value;
        const pass = document.getElementById('login-pass').value;
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerText;

        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Validando...';
        btn.disabled = true;

        try {
            // Llama a tu servidor Node.js real
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: pass })
            });

            const data = await response.json();

            if (response.ok) {
                // Login exitoso verificado por SQLite
                localStorage.setItem('isLoggedIn', 'true');
                if(typeof showSysAlert === 'function') {
                    showSysAlert('success', '¡Conectado!', 'Validado en la base de datos correctamente.');
                }

                setTimeout(() => {
                    const alertModal = document.getElementById('sysAlertModal');
                    if(alertModal) {
                        const modalInstance = bootstrap.Modal.getInstance(alertModal);
                        if(modalInstance) modalInstance.hide();
                    }
                    loadModule('home', document.querySelectorAll('.nav-item')[0]);
                }, 1500);
            } else {
                // Backend dice que el correo/clave está mal
                if(typeof showSysAlert === 'function') {
                    showSysAlert('warning', 'Acceso Denegado', data.message || 'Credenciales incorrectas.');
                }
            }
        } catch (error) {
            console.error("Error:", error);
            if(typeof showSysAlert === 'function') {
                showSysAlert('warning', 'Error de red', 'El servidor Node.js no está respondiendo.');
            }
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
    
    // Función para procesar el archivo JSON en el modal de recuperación
    // (Se define aquí para que esté disponible cuando se cargue el módulo de login)
    window.processRecoveryFile = function() {
        const fileInput = document.getElementById('jsonKeyFile');
        if(!fileInput.files.length) {
            showSysAlert('warning', 'Atención', 'Por favor, selecciona tu archivo .json primero.');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if(data.password_hash && data.pin_hash) {
                    const modalEl = document.getElementById('recoveryModal');
                    const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                    modalInstance.hide();
                    
                    showSysAlert('success', 'Llave Validada', `Hola ${data.nombre}, hemos verificado tu llave. Ahora puedes reestablecer tu contraseña.`);
                    // Aquí podrías cargar un módulo de 'reset-password'
                } else {
                    showSysAlert('warning', 'Archivo Inválido', 'El archivo cargado no contiene una llave de recuperación válida.');
                }
            } catch(err) {
                showSysAlert('warning', 'Error', 'El archivo está corrupto o no es un JSON válido.');
            }
        };
        reader.readAsText(file);
    };
</script>