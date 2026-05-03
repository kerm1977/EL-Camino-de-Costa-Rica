// ==========================================
// MÓDULO: APP (Ruteo, UI Global, Alertas)
// Archivo: js/app.js
// ==========================================

// Variable global para evitar consultar la base de datos en cada clic
window.appState = window.appState || { profileLoaded: false };

// 1. Alertas del Sistema Globales
window.showSysAlert = function(type, title, message) {
    const alertTitle = document.getElementById('sysAlertTitle');
    const alertMsg = document.getElementById('sysAlertMsg');
    const alertIcon = document.getElementById('sysAlertIcon');
    const modalEl = document.getElementById('sysAlertModal');
    
    if(!alertTitle || !alertMsg || !alertIcon || !modalEl) return;

    alertTitle.innerText = title;
    alertMsg.innerText = message;
    
    let iconHtml = '';
    if(type === 'success') iconHtml = '<i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>';
    else if (type === 'warning') iconHtml = '<i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 3rem;"></i>';
    else iconHtml = '<i class="bi bi-info-circle-fill text-info" style="font-size: 3rem;"></i>';
    
    alertIcon.innerHTML = iconHtml;
    new bootstrap.Modal(modalEl).show();
};

// 2. Animación del Botón Flotante Central
window.handleAction = function(e) {
    e.preventDefault();
    const fab = document.querySelector('.fab');
    if(fab) {
        fab.style.transform = 'scale(0.8)';
        setTimeout(() => fab.style.transform = '', 150);
    }
    // Aquí puedes agregar la acción real que desees que haga el logo central
};

// 3. Tema Oscuro / Claro
window.toggleTheme = function() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
        if(themeIcon) themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
        localStorage.setItem('theme', 'dark');
    } else {
        if(themeIcon) themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
        localStorage.setItem('theme', 'light');
    }
};

// 4. Cerrar Sesión
window.logout = function(e) {
    if(e) e.preventDefault();
    
    // Limpiar localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail'); 
    
    // Resetear variables en memoria
    window.appState.profileLoaded = false;
    window.currentProfileData = {}; 
    
    // Resetear ícono visual superior
    const topProfileBtn = document.getElementById('top-profile-btn');
    if (topProfileBtn) topProfileBtn.innerHTML = '<i class="bi bi-person-circle fs-5 text-teal"></i>';
    
    // Destruir botón global de WhatsApp si existía
    const btnWa = document.getElementById('floating-wa-btn');
    if(btnWa) btnWa.remove();

    // Redirigir al inicio
    window.location.hash = 'home';
    route(); 
};

// 5. Motor de Ruteo (Navegación SPA)
function route() {
    const viewId = window.location.hash.substring(1) || 'home';
    const container = document.getElementById('app-container');
    const bottomNav = document.querySelector('.bottom-nav');
    const topProfileBtn = document.getElementById('top-profile-btn');

    if(!container) return;

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Evitar que usuarios logueados vean login/registro
    if (isLoggedIn && (viewId === 'login' || viewId === 'registro')) {
        window.location.hash = 'home';
        return;
    }

    // Mostrar u ocultar barra inferior en pantallas específicas
    if (bottomNav) {
        if (viewId === 'login' || viewId === 'registro' || viewId === 'tour_operadores' || viewId === 'emprendimientos') {
            bottomNav.style.display = 'none';
        } else {
            bottomNav.style.display = 'block';
        }
    }

    // Mostrar botón superior de perfil si está logueado y no está en autenticación
    if (topProfileBtn) {
        if (isLoggedIn && viewId !== 'login' && viewId !== 'registro') {
            topProfileBtn.style.display = 'flex';
        } else {
            topProfileBtn.style.display = 'none';
        }
    }

    // Cargar Plantilla HTML desde window.templates
    if(window.templates && window.templates[viewId]) {
        container.innerHTML = window.templates[viewId];

        // --- MANEJO DE DIRECTORIOS PÚBLICOS ---
        if (viewId === 'tour_operadores') {
            if(typeof window.cargarDirectorio === 'function') window.cargarDirectorio('operadores');
        } else if (viewId === 'emprendimientos') {
            if(typeof window.cargarDirectorio === 'function') window.cargarDirectorio('emprendimientos');
        }

        // --- CARGADOR INTELIGENTE DE DATOS DEL PERFIL ---
        if (isLoggedIn) {
            // Caso A: Primera vez que rutea (Ej. Recién logueado o abrió la App), carga la BD en 2do plano
            if (!window.appState.profileLoaded) {
                window.appState.profileLoaded = true;
                setTimeout(() => {
                    if(typeof window.loadProfileData === 'function') window.loadProfileData();
                }, 100);
            }
            // Caso B: Entró explícitamente a la vista de perfil (hay que recargar para llenar el formulario HTML)
            else if (viewId === 'perfil') {
                setTimeout(() => {
                    if(typeof window.loadProfileData === 'function') window.loadProfileData();
                }, 50);
            }
            // Caso C: Navega entre otras vistas (Aseguramos que el ícono siga pintado sin consultar a la BD)
            else {
                setTimeout(() => {
                    if(typeof window.updateProfileIcons === 'function') window.updateProfileIcons();
                }, 50);
            }
        }
        
    } else {
        container.innerHTML = `<div class="text-center mt-5 pt-5"><h4>Error 404</h4><p>Vista no encontrada.</p></div>`;
    }

    // Actualizar el botón de perfil/login en la barra de navegación inferior
    const profileNav = document.querySelector('.nav-link[data-target="login"]');
    if (profileNav) {
        if (isLoggedIn) {
            profileNav.href = "#";
            profileNav.onclick = window.logout;
            profileNav.innerHTML = '<i class="bi bi-box-arrow-right"></i>';
        } else {
            profileNav.href = "#login";
            profileNav.onclick = null;
            profileNav.innerHTML = '<i class="bi bi-person-fill"></i>';
        }
    }

    // Marcar pestaña activa en el menú
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    // Como perfil no está en el nav de abajo, evitamos errores al buscar su clase
    const activeNav = document.querySelector(`.nav-link[data-target="${viewId === 'perfil' ? 'login' : viewId}"]`);
    if(activeNav) activeNav.classList.add('active');

    window.scrollTo(0, 0);
}

// 6. Inicialización de la App
window.addEventListener('hashchange', route);

window.addEventListener('DOMContentLoaded', () => {
    // Restaurar tema guardado
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        const themeIcon = document.getElementById('theme-icon');
        if(themeIcon) themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
    }
    route(); // Arrancar la primera vista
});