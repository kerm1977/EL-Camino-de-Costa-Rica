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
    fab.style.transform = 'scale(0.8)';
    setTimeout(() => fab.style.transform = '', 150);
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

function route() {
    const viewId = window.location.hash.substring(1) || 'login';
    const container = document.getElementById('app-container');

    if(window.templates && window.templates[viewId]) {
        container.innerHTML = window.templates[viewId];
    } else {
        container.innerHTML = `<div class="text-center mt-5 pt-5"><h4>Error 404</h4><p>Vista no encontrada.</p></div>`;
    }

    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-link[data-target="${viewId === 'registro' ? 'login' : viewId}"]`);
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