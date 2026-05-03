// ==========================================
// MÓDULO: PERFIL TOOLS (Herramientas y Seguridad)
// Archivo: js/perfil_tools.js
// Responsabilidad: Temas, Descarga JPG, Compartir y Utilidades de Perfil
// ==========================================

// --- GESTIÓN DE TEMA (PERMANENTE EN BASE DE DATOS) ---
window.themeColors = [
    { name: 'Teal (Original)', main: '#38b2ac', light: '#4fd1c5' },
    { name: 'Índigo Suave', main: '#667eea', light: '#7f9cf5' },
    { name: 'Azul Acero', main: '#4299e1', light: '#63b3ed' },
    { name: 'Verde Salvia', main: '#48bb78', light: '#68d391' },
    { name: 'Coral Suave', main: '#f56565', light: '#fc8181' },
    { name: 'Ocaso', main: '#ed8936', light: '#f6ad55' },
    { name: 'Lavanda', main: '#9f7aea', light: '#b794f4' },
    { name: 'Rosa Vintage', main: '#ed64a6', light: '#f687b3' },
    { name: 'Pizarra', main: '#a0aec0', light: '#cbd5e0' },
    { name: 'Moca Claro', main: '#b7791f', light: '#d69e2e' }
];

window.selectedTheme = { main: '#38b2ac', light: '#4fd1c5' };

window.selectProfileTheme = function(main, light) {
    window.selectedTheme = { main, light };
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        if(btn.dataset.main === main) {
            btn.style.border = '3px solid var(--text-dark)';
            btn.style.transform = 'scale(1.1)';
        } else {
            btn.style.border = '2px solid white';
            btn.style.transform = 'scale(1)';
        }
    });

    document.documentElement.style.setProperty('--teal-main', main);
    document.documentElement.style.setProperty('--teal-light', light);
};

window.renderColorPalette = function() {
    let html = '';
    window.themeColors.forEach((color) => {
        html += `<button type="button" class="theme-btn btn-circle shadow-sm m-1" data-main="${color.main}" style="width: 35px; height: 35px; background-color: ${color.main}; border: 2px solid white; transition: all 0.2s;" onclick="window.selectProfileTheme('${color.main}', '${color.light}')" title="${color.name}"></button>`;
    });
    const styleId = 'theme-contrast-fix';
    if(!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `.btn-teal { color: white !important; } .text-teal { font-weight: bold; }`;
        document.head.appendChild(style);
    }
    return html;
};

// --- GESTIÓN DE BOTÓN WHATSAPP GLOBAL (ELIMINADO) ---
// Mantenemos la función para que no dé error en la carga, 
// pero solo la usamos para limpiar si quedó algún botón "pegado".
window.renderWhatsAppButton = function() {
    const existingBtn = document.getElementById('floating-wa-btn');
    if(existingBtn) existingBtn.remove();
};

// --- VISOR DE CERTIFICADOS INCRUSTADO ---
window.toggleEmbeddedCert = function() {
    const certContainer = document.getElementById('embedded-cert-container');
    const certBtn = document.getElementById('btn-toggle-cert');
    if(certContainer && certBtn) {
        if(certContainer.classList.contains('d-none')) {
            certContainer.classList.remove('d-none');
            certBtn.innerHTML = 'Ocultar Certificado';
        } else {
            certContainer.classList.add('d-none');
            certBtn.innerHTML = 'Mostrar Certificado';
        }
    }
};

// --- UTILIDADES GENÉRICAS Y SEGURIDAD ---
window.toggleValMethod = function() {
    const isPin = document.getElementById('valPin').checked;
    if(typeof window.toggleSection === 'function') {
        window.toggleSection('val-pin-section', isPin);
        window.toggleSection('val-json-section', !isPin);
    }
};

window.validarIdentidad = function() {
    if(typeof window.showSysAlert === 'function') window.showSysAlert('success', 'Validación Correcta', 'Identidad confirmada.');
    document.getElementById('new-password-section').classList.remove('d-none');
};

window.generarNuevaLlave = function() {
    const p1 = document.getElementById('perf-new-pass1').value;
    const p2 = document.getElementById('perf-new-pass2').value;
    if(!p1 || p1 !== p2) return (typeof window.showSysAlert === 'function') ? window.showSysAlert('warning', 'Error', 'Las nuevas contraseñas no coinciden.') : null;
    
    const blob = new Blob([JSON.stringify({msg: "Nueva llave simulada"}, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `myCloudKey_actualizada.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if(typeof window.showSysAlert === 'function') window.showSysAlert('success', '¡Actualizado!', 'Contraseña cambiada.');
    document.getElementById('new-password-section').classList.add('d-none');
};

window.showSysConfirm = function(title, message, callback) {
    const titleEl = document.getElementById('sysConfirmTitle');
    const msgEl = document.getElementById('sysConfirmMsg');
    const modalEl = document.getElementById('sysConfirmModal');
    
    if(titleEl && msgEl && modalEl) {
        titleEl.innerText = title;
        msgEl.innerText = message;
        window.confirmCallback = callback;
        
        let modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (!modalInstance) modalInstance = new bootstrap.Modal(modalEl);
        modalInstance.show();
    }
};

window.iniciarBorrado = function() {
    window.showSysConfirm('Advertencia 1/3', '¿Deseas eliminar tu perfil permanentemente?', () => {
        window.showSysConfirm('Advertencia 2/3', '¿Se perderá absolutamente toda tu información?', () => {
            window.showSysConfirm('Advertencia 3/3', 'ÚLTIMA ADVERTENCIA. ¿Eliminar permanentemente tu cuenta de la nube?', () => {
                localStorage.clear();
                if(typeof window.showSysAlert === 'function') window.showSysAlert('success', 'Perfil Eliminado', 'Borrado permanente.');
                setTimeout(() => window.location.hash = 'home', 2000);
            });
        });
    });
};

window.updateProfileIcons = function() {
    const data = window.currentProfileData || {};
    const logoBase64 = data['perf-g-logo'] || data['perf-emp-img'] || null;
    const topBtn = document.getElementById('top-profile-btn');
    
    if (topBtn) {
        if (logoBase64 && logoBase64.startsWith('data:image')) {
            // Convertimos el botón padre en una "máscara de recorte" perfecta
            topBtn.style.padding = '0';
            topBtn.style.overflow = 'hidden'; 
            topBtn.style.border = '2px solid var(--teal-main)';
            
            // La imagen llenará el botón sin salirse jamás
            topBtn.innerHTML = `<img src="${logoBase64}" style="width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 50%;">`;
        } else {
            // Restauramos los valores si no hay imagen
            topBtn.style.padding = '';
            topBtn.style.overflow = 'visible';
            topBtn.style.border = 'none';
            topBtn.innerHTML = `<i class="bi bi-person-circle fs-5 text-teal"></i>`;
        }
    }
};

// --- COMPARTIR Y DESCARGAR ---
window.shareProfile = async function() {
    const nombreEl = document.getElementById('card-nombre');
    if(!nombreEl) return;
    const nombre = nombreEl.innerText;
    const data = window.currentProfileData || {};
    
    let phone = data['perf-tel'] || '';
    if(data['perf-switch-grupo']) phone = data['perf-g-celular'] || data['perf-g-tellocal'] || phone;
    else if(data['perf-switch-emp']) phone = data['perf-emp-tel'] || phone;

    const textToShare = `¡Hola! Te comparto la información de ${nombre} en Cloud App.\nContacto: ${phone}`;
    
    if (navigator.share) {
        try { await navigator.share({ title: `Tarjeta de ${nombre}`, text: textToShare }); } 
        catch (err) { console.log('Error compartiendo', err); }
    } else {
        if(navigator.clipboard) {
            navigator.clipboard.writeText(textToShare);
            if(typeof window.showSysAlert === 'function') window.showSysAlert('info', 'Texto Copiado', 'Tu navegador no soporta compartir nativo. El texto se ha copiado.');
        }
    }
};

window.downloadProfileJPG = async function() {
    const card = document.getElementById('profile-card-view');
    const actionsFooter = document.getElementById('card-actions-footer');
    const btn = document.getElementById('btn-download-jpg');
    const originalText = btn.innerHTML;
    if(!card) return;

    try {
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Procesando...';
        btn.disabled = true;

        if (typeof html2canvas === 'undefined') {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        if (actionsFooter) actionsFooter.classList.add('d-none');
        
        const originalBorderRadius = card.style.borderRadius;
        const originalBoxShadow = card.style.boxShadow;
        const originalMargin = card.style.marginBottom;
        
        card.style.borderRadius = '0';
        card.style.boxShadow = 'none';
        card.style.marginBottom = '0';

        const canvas = await html2canvas(card, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });

        card.style.borderRadius = originalBorderRadius;
        card.style.boxShadow = originalBoxShadow;
        card.style.marginBottom = originalMargin;
        if (actionsFooter) actionsFooter.classList.remove('d-none');

        const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        const nombreTarjeta = document.getElementById('card-nombre') ? document.getElementById('card-nombre').innerText.replace(/\s+/g, '_') : 'Presentacion';
        link.download = `Tarjeta_${nombreTarjeta}.jpg`;
        link.href = dataUrl;
        link.click();

        if(typeof window.showSysAlert === 'function') window.showSysAlert('success', '¡Descarga Completa!', 'Tu tarjeta se ha guardado.');

    } catch (error) {
        if (actionsFooter) actionsFooter.classList.remove('d-none');
        if(typeof window.showSysAlert === 'function') window.showSysAlert('warning', 'Error', 'No se pudo generar la tarjeta.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};