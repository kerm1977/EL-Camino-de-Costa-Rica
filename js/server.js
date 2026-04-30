window.handleLogin = async function(e) {
    e.preventDefault();
    
    // 1. Capturamos los datos del formulario
    const email = document.querySelector('input[type="email"]').value;
    const password = document.getElementById('login-pass').value;

    try {
        // 2. Enviamos la petición POST a tu API (Backend)
        const response = await fetch('https://tu-servidor.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        // 3. Procesamos la respuesta de MySQL
        if (data.success) {
            window.showSysAlert('success', '¡Conectado!', 'Has iniciado sesión correctamente.');
            setTimeout(() => {
                const alertModal = document.getElementById('sysAlertModal');
                if(alertModal) { const modalInstance = bootstrap.Modal.getInstance(alertModal); if(modalInstance) modalInstance.hide(); }
                window.location.hash = 'home';
            }, 1500);
        } else {
            window.showSysAlert('warning', 'Error', data.message);
        }

    } catch (error) {
        console.error('Error de red:', error);
        window.showSysAlert('warning', 'Error de conexión', 'No pudimos conectar con el servidor.');
    }
};