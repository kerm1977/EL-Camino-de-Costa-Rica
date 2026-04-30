// js/app.js
window.showSysAlert = function(type, title, message) {
    document.getElementById('sysAlertTitle').innerText = title;
    document.getElementById('sysAlertMsg').innerText = message;
    
    let iconHtml = '';
    if(type === 'success') iconHtml = '<i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>';
    else if (type === 'warning') iconHtml = '<i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 3rem;"></i>';
    else iconHtml = '<i class="bi bi-info-circle-fill text-info" style="font-size: 3rem;"></i>';
    
    document.getElementById('sysAlertIcon').innerHTML = iconHtml;
    new bootstrap.Modal(document.getElementById('sysAlertModal')).show();
};

window.handleAction = function(e) {
    e.preventDefault();
    const fab = document.querySelector('.fab');
    if(fab) {
        fab.style.transform = 'scale(0.8)';
        setTimeout(() => fab.style.transform = '', 150);
    }
};

// Función para alternar Modo Oscuro
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

// --- NUEVO: Función para cerrar sesión ---
window.logout = function(e) {
    if(e) e.preventDefault();
    localStorage.removeItem('isLoggedIn'); // Borramos la sesión
    window.location.hash = 'login'; // Forzamos ir al login
};

function route() {
    const viewId = window.location.hash.substring(1) || 'login';
    const container = document.getElementById('app-container');
    const bottomNav = document.querySelector('.bottom-nav');

    // 1. GUARDIAS DE RUTA (Verificamos si hay sesión)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Si está conectado y quiere ir al login/registro -> Lo regresamos al Home
    if (isLoggedIn && (viewId === 'login' || viewId === 'registro')) {
        window.location.hash = 'home';
        return;
    }

    // Si NO está conectado y quiere ver contenido privado -> Lo mandamos al Login
    if (!isLoggedIn && viewId !== 'login' && viewId !== 'registro') {
        window.location.hash = 'login';
        return;
    }

    // 2. OCULTAR BARRA INFERIOR EN LOGIN/REGISTRO
    if (bottomNav) {
        if (viewId === 'login' || viewId === 'registro') {
            bottomNav.style.display = 'none'; // Desaparece la barra
        } else {
            bottomNav.style.display = 'block'; // Aparece la barra
        }
    }

    // 3. RENDERIZAR LA VISTA
    if(window.templates && window.templates[viewId]) {
        container.innerHTML = window.templates[viewId];
    } else {
        container.innerHTML = `<div class="text-center mt-5 pt-5"><h4>Error 404</h4><p>Vista no encontrada.</p></div>`;
    }

    // 4. CAMBIAR ÍCONO DE PERFIL POR "SALIR"
    const profileNav = document.querySelector('.nav-link[data-target="login"]');
    if (profileNav) {
        if (isLoggedIn) {
            profileNav.href = "#";
            profileNav.onclick = window.logout;
            profileNav.innerHTML = '<i class="bi bi-box-arrow-right"></i>'; // Ícono de salir
        } else {
            profileNav.href = "#login";
            profileNav.onclick = null;
            profileNav.innerHTML = '<i class="bi bi-person-fill"></i>';
        }
    }

    // 5. MARCAR ÍCONO ACTIVO
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-link[data-target="${viewId}"]`);
    if(activeNav) activeNav.classList.add('active');

    window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);

// Recuperar tema al cargar y ejecutar ruteo inicial
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        const themeIcon = document.getElementById('theme-icon');
        if(themeIcon) themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
    }
    route();
});