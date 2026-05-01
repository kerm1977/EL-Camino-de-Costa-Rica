// ==========================================
// MÓDULO: PERFIL (Vista Tarjeta, Edición, Persistencia, WA y Temas)
// Archivo: js/perfil.js
// ==========================================

window.templates = window.templates || {};
window.currentProfileData = {};

// --- GESTIÓN DE INDEXEDDB (OFFLINE CACHE) ---
window.idbCache = {
    dbPromise: null,
    init() {
        this.dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open('CloudAppDB', 1);
            request.onupgradeneeded = (e) => {
                e.target.result.createObjectStore('profiles', { keyPath: 'email' });
            };
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    },
    async set(email, data) {
        if (!this.dbPromise) this.init();
        try {
            const db = await this.dbPromise;
            const tx = db.transaction('profiles', 'readwrite');
            tx.objectStore('profiles').put({ email, data });
            return new Promise((resolve) => {
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            });
        } catch (e) { console.error("IDB Set Error", e); return false; }
    },
    async get(email) {
        if (!this.dbPromise) this.init();
        try {
            const db = await this.dbPromise;
            return new Promise((resolve) => {
                const tx = db.transaction('profiles', 'readonly');
                const req = tx.objectStore('profiles').get(email);
                req.onsuccess = () => resolve(req.result ? req.result.data : null);
                req.onerror = () => resolve(null);
            });
        } catch (e) { console.error("IDB Get Error", e); return null; }
    }
};

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

const renderColorPalette = () => {
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

// --- GESTIÓN DE BOTÓN WHATSAPP ---
window.renderWhatsAppButton = function() {
    const data = window.currentProfileData || {};
    let phone = null;
    
    if(data['perf-switch-grupo']) {
        phone = data['perf-g-celular'] || data['perf-g-tellocal'];
    } else if(data['perf-switch-emp']) {
        phone = data['perf-emp-tel'];
    }
    
    const existingBtn = document.getElementById('floating-wa-btn');
    if(existingBtn) existingBtn.remove();
    
    if(phone && phone.trim() !== '') {
        let cleanPhone = phone.replace(/\D/g, '');
        if(!cleanPhone.startsWith('506') && cleanPhone.length === 8) cleanPhone = '506' + cleanPhone;
        
        const btn = document.createElement('a');
        btn.id = 'floating-wa-btn';
        btn.href = `https://wa.me/${cleanPhone}`;
        btn.target = '_blank';
        btn.innerHTML = '<i class="bi bi-whatsapp"></i>';
        btn.className = 'btn-circle shadow-lg d-flex align-items-center justify-content-center module-fade-in';
        btn.style.cssText = 'position: fixed; bottom: 95px; right: 15px; width: 55px; height: 55px; background-color: #25D366; color: white !important; font-size: 2rem; z-index: 1040; text-decoration: none;';
        document.body.appendChild(btn);
    }
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

// --- COMPRESOR DE IMÁGENES Y LÍMITE DE TAMAÑO (500KB) ---
window.getBase64 = function(file) {
    return new Promise((resolve, reject) => {
        if (file.size > 512000) {
            return reject(new Error(`El archivo "${file.name}" supera los 500KB máximos permitidos.\n\nPara mantener el rendimiento de la aplicación, comprime tu imagen o PDF. Te recomendamos usar un convertidor gratuito como "JPG to WEBP" ingresando a:\n\nhttps://convertio.co/es/jpg-webp/\n\nUna vez comprimido, intenta subirlo de nuevo.`));
        }

        if (!file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                } else {
                    if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                resolve(compressedBase64);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// --- UTILIDADES GENÉRICAS ---
window.toggleEditSection = window.toggleEditSection || function(sectionId, iconId) {
    const content = document.getElementById(sectionId);
    const icon = document.getElementById(iconId);
    if(!content || !icon) return;
    
    if(content.classList.contains('d-none')) {
        content.classList.remove('d-none');
        icon.classList.replace('bi-chevron-down', 'bi-chevron-up');
    } else {
        content.classList.add('d-none');
        icon.classList.replace('bi-chevron-up', 'bi-chevron-down');
    }
};

window.toggleSection = window.toggleSection || function(elementId, show) {
    const el = document.getElementById(elementId);
    if(el) { show ? el.classList.remove('d-none') : el.classList.add('d-none'); }
};

window.toggleValMethod = function() {
    const isPin = document.getElementById('valPin').checked;
    window.toggleSection('val-pin-section', isPin);
    window.toggleSection('val-json-section', !isPin);
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
            topBtn.innerHTML = `<img src="${logoBase64}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border: 2px solid var(--teal-main);">`;
        } else {
            topBtn.innerHTML = `<i class="bi bi-person-circle fs-5 text-teal"></i>`;
        }
    }
};

window.isEditingProfile = false; 

window.loadProfileData = async function() {
    const emailInput = document.getElementById('perf-email');
    const email = localStorage.getItem('userEmail');
    if(emailInput) emailInput.value = email || 'usuario@nube.com';

    let dataLoaded = false;

    try {
        const response = await fetch(`http://localhost:3000/api/perfil?email=${email}`);
        if (response.ok) {
            const result = await response.json();
            const data = typeof result.profileData === 'string' ? JSON.parse(result.profileData) : (result.profileData || {});
            window.currentProfileData = data;
            await window.idbCache.set(email, data);
            dataLoaded = true;
        }
    } catch (error) {
        console.warn("Fallo de servidor, intentando carga offline (IndexedDB).", error);
    }

    if (!dataLoaded) {
        const offlineData = await window.idbCache.get(email);
        if (offlineData && Object.keys(offlineData).length > 0) {
            window.currentProfileData = offlineData;
            dataLoaded = true;
            if(typeof window.showSysAlert === 'function') window.showSysAlert('info', 'Modo Offline', 'Se ha cargado tu perfil desde el almacenamiento local.');
        }
    }

    if (dataLoaded) {
        const data = window.currentProfileData;
        Object.keys(data).forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                if (el.classList.contains('profile-rich-text')) el.innerHTML = data[id] || '';
                else if (el.type === 'checkbox' || el.type === 'radio') el.checked = data[id];
                else if (el.type !== 'file') el.value = data[id];
            }
        });

        if(data['perf-theme-main']) {
            window.selectProfileTheme(data['perf-theme-main'], data['perf-theme-light']);
        }
        window.isEditingProfile = false; 
    } else {
        window.currentProfileData = {};
        window.isEditingProfile = true;
    }
    
    window.renderEditModeState();
    window.updateProfileIcons();
    window.renderWhatsAppButton();
};

window.guardarPerfil = async function() {
    const inputs = document.querySelectorAll('.profile-input');
    const email = localStorage.getItem('userEmail');
    const data = { ...window.currentProfileData }; 
    
    const btnSave = document.getElementById('btn-save-profile-bottom');
    const originalText = btnSave ? btnSave.innerHTML : 'Guardar';
    if(btnSave) { btnSave.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Guardando...'; btnSave.disabled = true; }

    try {
        for (let i of inputs) {
            if (i.classList.contains('profile-rich-text')) {
                data[i.id] = i.innerHTML;
            } else if (i.type === 'checkbox') {
                data[i.id] = i.checked;
            } else if (i.type === 'file') {
                if (i.files && i.files.length > 0) {
                    data[i.id] = await window.getBase64(i.files[0]);
                }
            } else {
                data[i.id] = i.value;
            }
        }
        
        data['perf-theme-main'] = window.selectedTheme.main;
        data['perf-theme-light'] = window.selectedTheme.light;

        const response = await fetch('http://localhost:3000/api/perfil', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, profileData: data })
        });

        if (response.ok) {
            window.currentProfileData = data;
            await window.idbCache.set(email, data);
            
            if(typeof window.showSysAlert === 'function') window.showSysAlert('success', 'Perfil Guardado', 'Tu información se almacenó exitosamente en la nube.');
            window.isEditingProfile = false; 
            window.renderEditModeState(); 
            window.updateProfileIcons();
            window.renderWhatsAppButton();
        } else {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || errData.message || "Rechazado por el servidor.");
        }

    } catch (error) {
        if(typeof window.showSysAlert === 'function') window.showSysAlert('warning', 'Aviso', error.message);
    } finally {
        if(btnSave) { btnSave.innerHTML = originalText; btnSave.disabled = false; }
    }
};

window.toggleEditMode = function() {
    window.isEditingProfile = !window.isEditingProfile;
    window.renderEditModeState();
};

window.renderEditModeState = function() {
    const cardView = document.getElementById('profile-card-view');
    const editView = document.getElementById('profile-edit-view');

    if (window.isEditingProfile) {
        if(cardView) cardView.classList.add('d-none');
        if(editView) editView.classList.remove('d-none');
        
        const switchGrupo = document.getElementById('perf-switch-grupo');
        const switchEmp = document.getElementById('perf-switch-emp');
        const wrapperGrupo = document.getElementById('wrapper-grupo-perf');
        const wrapperEmp = document.getElementById('wrapper-emp-perf');
        const bodyGrupo = document.getElementById('perf-form-grupo-body');
        const bodyEmp = document.getElementById('perf-form-emp-body');
        const iconGrupo = document.getElementById('perf-grupo-icon');
        const iconEmp = document.getElementById('perf-emp-icon');

        if (switchGrupo && switchEmp && wrapperGrupo && wrapperEmp) {
            wrapperGrupo.classList.remove('d-none');
            wrapperEmp.classList.remove('d-none');
            
            if (switchGrupo.checked) {
                wrapperEmp.classList.add('d-none');
                if(bodyGrupo) bodyGrupo.classList.remove('d-none');
                if(iconGrupo) iconGrupo.classList.replace('bi-chevron-down', 'bi-chevron-up');
            } else {
                if(bodyGrupo) bodyGrupo.classList.add('d-none');
                if(iconGrupo) iconGrupo.classList.replace('bi-chevron-up', 'bi-chevron-down');
            }

            if (switchEmp.checked) {
                wrapperGrupo.classList.add('d-none');
                if(bodyEmp) bodyEmp.classList.remove('d-none');
                if(iconEmp) iconEmp.classList.replace('bi-chevron-down', 'bi-chevron-up');
            } else {
                if(bodyEmp) bodyEmp.classList.add('d-none');
                if(iconEmp) iconEmp.classList.replace('bi-chevron-up', 'bi-chevron-down');
            }
        }

        const switchGExt = document.getElementById('perf-g-ext');
        if (switchGExt && window.toggleSection) window.toggleSection('perf-g-idiomas-container', switchGExt.checked);

        const switchEmpExt = document.getElementById('perf-emp-ext');
        if (switchEmpExt && window.toggleSection) window.toggleSection('perf-emp-idiomas-container', switchEmpExt.checked);
        
        const btnWa = document.getElementById('floating-wa-btn');
        if(btnWa) btnWa.classList.add('d-none');
        
        // --- INYECCIÓN DE PREVISUALIZACIÓN Y BOTONES ELIMINAR ARCHIVOS ---
        const fileFields = ['perf-g-logo', 'perf-g-cert', 'perf-emp-img', 'perf-emp-sello-input'];
        fileFields.forEach(id => {
            const input = document.getElementById(id);
            if (input && input.parentElement) {
                
                // 1. Imagen o iframe de Preview
                let preview = document.getElementById('preview-' + id);
                if (!preview) {
                    preview = document.createElement('div');
                    preview.id = 'preview-' + id;
                    preview.className = 'mb-2 text-center';
                    input.parentElement.insertBefore(preview, input);
                }
                
                const fileData = window.currentProfileData[id];
                if (fileData) {
                    if (fileData.startsWith('data:application/pdf')) {
                        preview.innerHTML = `<iframe src="${fileData}" style="width:100%; height:120px; border:1px solid var(--input-border); border-radius:0.5rem; background:white;"></iframe>`;
                    } else {
                        preview.innerHTML = `<img src="${fileData}" style="max-height: 80px; max-width:100%; border-radius: 0.5rem; object-fit: contain; border: 1px solid var(--input-border); padding:2px; background: white;">`;
                    }
                    preview.style.display = 'block';
                } else {
                    preview.style.display = 'none';
                    preview.innerHTML = '';
                }

                // 2. Botón Eliminar
                if (!document.getElementById('del-btn-' + id)) {
                    const delBtn = document.createElement('button');
                    delBtn.id = 'del-btn-' + id;
                    delBtn.type = 'button';
                    delBtn.className = 'btn btn-sm btn-outline-danger mt-2 w-100 fw-bold';
                    delBtn.innerHTML = '<i class="bi bi-trash-fill me-1"></i>Eliminar Archivo Guardado';
                    delBtn.onclick = function() {
                        delete window.currentProfileData[id];
                        input.value = "";
                        this.style.display = 'none';
                        preview.style.display = 'none';
                        preview.innerHTML = '';
                        if(typeof window.showSysAlert === 'function') {
                            window.showSysAlert('info', 'Archivo Quitado', 'Se quitó de la vista. Haz clic en "Guardar Perfil Completo" para aplicar el cambio permanentemente.');
                        }
                    };
                    input.parentElement.appendChild(delBtn);
                }
                
                const delBtn = document.getElementById('del-btn-' + id);
                if(delBtn) delBtn.style.display = fileData ? 'block' : 'none';
            }
        });

    } else {
        if(editView) editView.classList.add('d-none');
        if(cardView) {
            cardView.classList.remove('d-none');
            window.updateProfileCardView(); 
        }
        
        const btnWa = document.getElementById('floating-wa-btn');
        if(btnWa) btnWa.classList.remove('d-none');
    }
};

// --- GESTIÓN DE COLAPSABLES PARA LA TARJETA (LECTURA) ---
window.toggleCardSection = function(sectionId, headerIconId) {
    const content = document.getElementById(sectionId);
    const icon = document.getElementById(headerIconId);
    if (!content || !icon) return;

    if (content.classList.contains('d-none')) {
        content.classList.remove('d-none');
        icon.classList.replace('bi-chevron-down', 'bi-chevron-up');
        localStorage.setItem('collapse_' + sectionId, 'open');
    } else {
        content.classList.add('d-none');
        icon.classList.replace('bi-chevron-up', 'bi-chevron-down');
        localStorage.setItem('collapse_' + sectionId, 'closed');
    }
};

const buildCollapsibleSection = (id, title, iconClass, innerHtml) => {
    const isClosed = localStorage.getItem('collapse_' + id) === 'closed';
    const displayClass = isClosed ? 'd-none' : '';
    const chevronClass = isClosed ? 'bi-chevron-down' : 'bi-chevron-up';
    
    return `
    <div class="mb-4 text-start">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3" style="cursor:pointer;" onclick="window.toggleCardSection('${id}', 'chevron-${id}')">
            <h6 class="text-teal fw-bold mb-0"><i class="bi ${iconClass} me-2"></i>${title}</h6>
            <i class="bi ${chevronClass} text-muted" id="chevron-${id}"></i>
        </div>
        <div id="${id}" class="${displayClass}">
            ${innerHtml}
        </div>
    </div>`;
};

window.updateProfileCardView = function() {
    const data = window.currentProfileData || {};
    const email = localStorage.getItem('userEmail') || 'usuario@correo.com';

    if(data['perf-theme-main']) {
        document.documentElement.style.setProperty('--teal-main', data['perf-theme-main']);
        document.documentElement.style.setProperty('--teal-light', data['perf-theme-light']);
    }

    const cardNombre = document.getElementById('card-nombre');
    const cardEmail = document.getElementById('card-email');
    const cardTel = document.getElementById('card-tel');

    if(!cardNombre || !cardEmail || !cardTel) return;

    let headerEntityActive = false;
    const fullName = data['perf-ape1'] ? `${data['perf-nombre'] || ''} ${data['perf-ape1'] || ''} ${data['perf-ape2'] || ''}`.trim() : (data['perf-nombre'] || 'Usuario');

    if (data['perf-switch-grupo'] && data['perf-g-op']) {
        cardNombre.innerText = data['perf-g-op'];
        headerEntityActive = true;
    } else if (data['perf-switch-emp'] && data['perf-emp-nombre']) {
        cardNombre.innerText = data['perf-emp-nombre'];
        headerEntityActive = true;
    } else {
        cardNombre.innerText = fullName || 'Usuario';
    }

    if (headerEntityActive) cardEmail.classList.add('d-none'); 
    else { cardEmail.classList.remove('d-none'); cardEmail.innerText = email; }

    if(data['perf-tel']) { cardTel.innerText = data['perf-tel']; cardTel.parentElement.classList.remove('d-none'); } 
    else cardTel.parentElement.classList.add('d-none');

    const logoBase64 = data['perf-g-logo'] || data['perf-emp-img'] || null;
    const cardProfileIcon = document.getElementById('card-profile-icon');
    if (cardProfileIcon) {
        if (logoBase64 && logoBase64.startsWith('data:image')) {
            cardProfileIcon.innerHTML = `<img src="${logoBase64}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            cardProfileIcon.style.background = 'transparent';
        } else {
            cardProfileIcon.innerHTML = `<i class="bi bi-person"></i>`;
            cardProfileIcon.style.background = 'rgba(255,255,255,0.2)';
        }
    }

    const renderActivadores = (prefix) => {
        const redesNombres = ['WhatsApp', 'Signal', 'Email', 'Facebook', 'Instagram', 'TikTok', 'Telegram', 'Waze', 'Google Maps'];
        const redesIconos = ['bi-whatsapp', 'bi-chat-dots', 'bi-envelope', 'bi-facebook', 'bi-instagram', 'bi-tiktok', 'bi-telegram', 'bi-cone-striped', 'bi-geo-alt'];
        const redesColores = ['#25D366', '#3A76F0', '#ea4335', '#1877F2', '#E1306C', '#000000', '#0088cc', '#33ccff', '#34a853'];
        let html = '';
        for(let i=0; i<9; i++) {
            if(data[`${prefix}-act-${i}`] && data[`${prefix}-act-${i}-input`]) {
                html += `<div class="d-flex align-items-center mb-2"><i class="bi ${redesIconos[i]} me-2" style="color: ${redesColores[i]}; font-size: 1.1rem;"></i><span class="small text-break" style="color: var(--text-dark);">${data[`${prefix}-act-${i}-input`]}</span></div>`;
            }
        }
        return html ? `<div class="mt-3 pt-2 border-top"><h6 class="fw-bold small mb-2" style="color: var(--text-dark); opacity: 0.8;">Enlaces y Redes</h6>${html}</div>` : '';
    };

    let dynamicHtml = '';

    // --- GRUPO ---
    if (data['perf-switch-grupo']) {
        let contentHtml = '';
        if(data['perf-g-op']) contentHtml += `<div class="d-flex mb-2"><i class="bi bi-person-badge-fill me-2" style="color: var(--cat-blue); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Operador:</strong> ${data['perf-g-op']}</span></div>`;
        if(data['perf-g-coord']) contentHtml += `<div class="d-flex mb-2"><i class="bi bi-person-gear me-2" style="color: var(--cat-pink); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Coordinador:</strong> ${data['perf-g-coord']}</span></div>`;
        if(data['perf-g-prov']) contentHtml += `<div class="d-flex mb-2"><i class="bi bi-geo-alt-fill me-2" style="color: var(--teal-main); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Ubicación:</strong> ${data['perf-g-prov']}</span></div>`;
        if(data['perf-g-tellocal']) contentHtml += `<div class="d-flex mb-2"><i class="bi bi-telephone-fill me-2" style="color: var(--cat-orange); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Tel. Local:</strong> ${data['perf-g-tellocal']}</span></div>`;
        if(data['perf-g-celular']) contentHtml += `<div class="d-flex mb-2"><i class="bi bi-phone-fill me-2" style="color: var(--cat-purple); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Celular:</strong> ${data['perf-g-celular']}</span></div>`;
        
        let servicios = [];
        if(data['perf-g-ext']) servicios.push('Extranjeros');
        if(data['perf-g-ind']) servicios.push('Individual');
        if(data['perf-g-full']) servicios.push('Completo');
        if(servicios.length > 0) {
            contentHtml += `<div class="d-flex mb-1"><i class="bi bi-check-circle-fill me-2" style="color: var(--teal-light); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Servicios:</strong> ${servicios.join(', ')}</span></div>`;
            if(data['perf-g-full']) contentHtml += `<div class="d-flex mb-2" style="padding-left: 1.8rem;"><span class="small" style="color: var(--text-dark); opacity: 0.8; font-size: 0.8rem;"><em>*Incluye: Coordinación, Guía, Transporte, Estadía, Atención Bilingüe y más.</em></span></div>`;
            else contentHtml += `<div class="mb-2"></div>`;
        }

        if(data['perf-g-nota'] && data['perf-g-nota'].trim() !== '') {
            contentHtml += `<div class="mt-3 p-3 rounded" style="background: var(--input-bg); color: var(--text-dark); border: 1px solid var(--input-border); font-size: 0.9rem; line-height: 1.4;"><h6 class="small fw-bold mb-2" style="opacity:0.8;">Nota / Descripción:</h6>${data['perf-g-nota']}</div>`;
        }

        contentHtml += renderActivadores('perf-g');
        dynamicHtml += buildCollapsibleSection('card-section-grupo', 'Grupo Afiliado', 'bi-people-fill', contentHtml);
    }

    // --- EMPRENDIMIENTO ---
    if (data['perf-switch-emp']) {
        let contentHtml = '';
        if(data['perf-emp-nombre']) contentHtml += `<div class="d-flex mb-2"><i class="bi bi-tag-fill me-2" style="color: var(--cat-orange); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Nombre:</strong> ${data['perf-emp-nombre']}</span></div>`;
        if(data['perf-emp-cont']) contentHtml += `<div class="d-flex mb-2"><i class="bi bi-person-fill me-2" style="color: var(--cat-blue); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Contacto:</strong> ${data['perf-emp-cont']}</span></div>`;
        
        const tipoServicio = data['perf-emp-tipo'] === 'Otros' && data['perf-emp-tipo-otro'] ? data['perf-emp-tipo-otro'] : data['perf-emp-tipo'];
        if(tipoServicio) contentHtml += `<div class="d-flex mb-2"><i class="bi bi-briefcase-fill me-2" style="color: var(--teal-main); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Servicio:</strong> ${tipoServicio}</span></div>`;
        
        if(data['perf-emp-etapa']) contentHtml += `<div class="d-flex mb-2"><i class="bi bi-bar-chart-line-fill me-2" style="color: var(--cat-purple); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Etapa:</strong> ${data['perf-emp-etapa']}</span></div>`;
        if(data['perf-emp-tel']) contentHtml += `<div class="d-flex mb-2"><i class="bi bi-telephone-fill me-2" style="color: var(--cat-pink); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Teléfono:</strong> ${data['perf-emp-tel']}</span></div>`;
        if(data['perf-emp-horario']) contentHtml += `<div class="d-flex mb-2"><i class="bi bi-clock-fill me-2" style="color: var(--cat-blue); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Horario:</strong> ${data['perf-emp-horario']}</span></div>`;
        
        if(data['perf-emp-sello']) {
            contentHtml += `<div class="d-flex mb-2 align-items-center"><i class="bi bi-patch-check-fill me-2" style="color: #f6ad55; font-size: 1.1rem;"></i><span class="small fw-bold text-warning">Comercio con Sello</span></div>`;
            if(data['perf-emp-sello-input']) contentHtml += `<div class="mt-2 text-center mb-2"><img src="${data['perf-emp-sello-input']}" style="max-height: 80px; border-radius: 0.5rem; object-fit: contain;"></div>`;
        }

        if(data['perf-emp-nota'] && data['perf-emp-nota'].trim() !== '') {
            contentHtml += `<div class="mt-3 p-3 rounded" style="background: var(--input-bg); color: var(--text-dark); border: 1px solid var(--input-border); font-size: 0.9rem; line-height: 1.4;"><h6 class="small fw-bold mb-2" style="opacity:0.8;">Nota / Descripción:</h6>${data['perf-emp-nota']}</div>`;
        }

        contentHtml += renderActivadores('perf-e');
        dynamicHtml += buildCollapsibleSection('card-section-emp', 'Emprendimiento', 'bi-shop', contentHtml);
    }

    // --- IDIOMAS ---
    const idiomasInfo = [
        { id: 'es', flag: '🇨🇷', msg: 'Bienvenidos' }, { id: 'en', flag: '🇺🇸', msg: 'Welcome' },
        { id: 'de', flag: '🇩🇪', msg: 'Willkommen' }, { id: 'it', flag: '🇮🇹', msg: 'Benvenuti' },
        { id: 'fr', flag: '🇫🇷', msg: 'Bienvenue' }, { id: 'pt', flag: '🇧🇷', msg: 'Bem-vindos' },
        { id: 'zh', flag: '🇨🇳', msg: '欢迎' }
    ];

    let idiomasHtml = '';
    idiomasInfo.forEach(lang => {
        let hasLang = false;
        if (data['perf-g-ext'] && data[`perf-g-lang-${lang.id}`]) hasLang = true;
        if (data['perf-emp-ext'] && data[`perf-emp-lang-${lang.id}`]) hasLang = true;
        if (hasLang) {
            idiomasHtml += `
            <div class="d-flex align-items-center me-2 mb-2 px-3 py-2 shadow-sm" style="background: var(--bg-color); border-radius: 1rem; border: 1px solid var(--input-border);">
                <span class="fs-4 me-2">${lang.flag}</span><span class="fw-bold small text-teal">${lang.msg}</span>
            </div>`;
        }
    });

    if (idiomasHtml) {
        const innerTuristas = `<div class="d-flex flex-wrap">${idiomasHtml}</div>`;
        dynamicHtml += buildCollapsibleSection('card-section-turistas', 'Atención a Turistas', 'bi-translate', innerTuristas);
    }

    // --- CONTACTO PERSONAL ---
    if (headerEntityActive) {
        let contentPersonal = `
            <div class="d-flex mb-2"><i class="bi bi-person-fill me-2" style="color: var(--cat-blue); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Nombre:</strong> ${fullName}</span></div>
            <div class="d-flex mb-2"><i class="bi bi-envelope-fill me-2" style="color: var(--cat-pink); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Email:</strong> ${email}</span></div>
            ${data['perf-tel'] ? `<div class="d-flex mb-2"><i class="bi bi-telephone-fill me-2" style="color: var(--cat-orange); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Teléfono:</strong> ${data['perf-tel']}</span></div>` : ''}
        `;
        dynamicHtml += buildCollapsibleSection('card-section-contacto', 'Contacto Personal', 'bi-person-lines-fill', contentPersonal);
    }

    // --- CERTIFICADO ---
    if (data['perf-g-cert']) {
        const certBase64 = data['perf-g-cert'];
        let certMedia = '';
        if(certBase64.startsWith('data:application/pdf')) {
            certMedia = `<iframe src="${certBase64}" style="width:100%; height:50vh; border:none; border-radius: 0.5rem; background:white;"></iframe>`;
        } else {
            certMedia = `<img src="${certBase64}" style="width:100%; height:auto; max-height: 60vh; object-fit:contain; border-radius: 0.5rem; background:white;">`;
        }

        let contentCert = `
            <div class="p-3 shadow-sm" style="background: var(--bg-color); border-radius: 1rem; border: 1px solid var(--input-border);">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-file-earmark-check-fill me-2" style="color: var(--teal-main); font-size: 1.5rem;"></i>
                        <span class="fw-bold" style="color: var(--text-dark);">Certificado Oficial</span>
                    </div>
                    <button id="btn-toggle-cert" class="btn btn-sm btn-light text-teal fw-bold border" onclick="window.toggleEmbeddedCert()">Mostrar Certificado</button>
                </div>
                <div id="embedded-cert-container" class="d-none mt-3 text-center module-fade-in">
                    ${certMedia}
                </div>
            </div>
        `;
        dynamicHtml += buildCollapsibleSection('card-section-cert', 'Certificación', 'bi-award-fill', contentCert);
    }

    if(!data['perf-switch-grupo'] && !data['perf-switch-emp'] && !headerEntityActive) {
        dynamicHtml += `<p class="text-muted small text-center mt-3" style="color: var(--text-dark);"><em>No hay grupos ni emprendimientos afiliados aún.</em></p>`;
    }

    const cardContent = document.getElementById('card-dynamic-content');
    if (cardContent) cardContent.innerHTML = dynamicHtml;
    
    window.updateProfileIcons(); 
};

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

// --- PLANTILLA HTML DEL PERFIL ---
window.templates.perfil = `
    <div class="module-fade-in pb-5">
        
        <header class="top-bar d-flex justify-content-between align-items-center mb-4 pt-3 px-2">
            <a href="#home" class="btn-circle text-decoration-none shadow-sm"><i class="bi bi-arrow-left fs-5"></i></a>
            <h5 class="mb-0 fw-bold">Mi Perfil</h5>
            <div style="width: 45px;"></div>
        </header>

        <!-- 1. VISTA: TARJETA INFORMATIVA -->
        <div id="profile-card-view" class="card-perfil p-0 overflow-hidden" style="background: var(--white); border-radius: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow);">
            <div class="p-4 text-center" style="background: linear-gradient(135deg, var(--teal-light), var(--teal-main)); color: white;">
                <div id="card-profile-icon" class="mx-auto mb-3 overflow-hidden" style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem;">
                    <i class="bi bi-person"></i>
                </div>
                <h4 class="fw-bold mb-0" id="card-nombre">Cargando...</h4>
                <p class="mb-0 opacity-75 small mt-1" id="card-email">...</p>
                <div class="mt-2 d-inline-block px-3 py-1" style="background: rgba(255,255,255,0.2); border-radius: 2rem;">
                    <i class="bi bi-telephone-fill me-1"></i><span class="fw-bold small" id="card-tel">...</span>
                </div>
            </div>
            
            <div class="p-4" id="card-dynamic-content"></div>

            <div id="card-actions-footer" class="p-3 d-flex flex-wrap justify-content-center gap-2 border-top" style="background-color: var(--input-bg);">
                <button class="btn btn-light shadow-sm d-flex align-items-center justify-content-center flex-grow-1" onclick="window.shareProfile()" style="border-radius: 1rem; color: var(--teal-main); font-weight: bold; min-width: 45%;">
                    <i class="bi bi-share-fill me-2"></i> Compartir
                </button>
                <button class="btn btn-light shadow-sm d-flex align-items-center justify-content-center flex-grow-1" onclick="window.toggleEditMode()" style="border-radius: 1rem; color: var(--teal-main); font-weight: bold; min-width: 45%;">
                    <i class="bi bi-pencil-fill me-2"></i> Editar
                </button>
                <button id="btn-download-jpg" class="btn btn-teal shadow-sm d-flex align-items-center justify-content-center w-100 mt-2" onclick="window.downloadProfileJPG()" style="border-radius: 1rem; font-weight: bold;">
                    <i class="bi bi-file-image me-2"></i> Descargar Tarjeta (JPG)
                </button>
            </div>
        </div>

        <!-- 2. VISTA: FORMULARIO EDICIÓN -->
        <div id="profile-edit-view" class="d-none">
            
            <!-- Personalizar Tarjeta (Colapsable) -->
            <div class="card-perfil p-0 mb-3 overflow-hidden border" style="box-shadow: none; border-color: var(--input-border) !important;">
                <div class="p-3 d-flex justify-content-between align-items-center" style="cursor:pointer; background: var(--white);" onclick="window.toggleEditSection('edit-personalizar', 'icon-personalizar')">
                    <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-palette-fill me-2"></i>Personalizar Tarjeta</h6>
                    <i class="bi bi-chevron-down text-teal" id="icon-personalizar"></i>
                </div>
                <div id="edit-personalizar" class="p-3 pt-0 border-top d-none" style="background: var(--white); border-color: var(--input-border) !important;">
                    <p class="small text-muted mb-3 mt-2" style="color: var(--text-dark);">Elige un color para que tu tarjeta destaque y guárdalo en tu perfil.</p>
                    <div class="d-flex flex-wrap justify-content-center p-2 rounded" style="background: var(--input-bg); border: 1px solid var(--input-border);">
                        ${renderColorPalette()}
                    </div>
                </div>
            </div>

            <!-- Información Personal (Colapsable) -->
            <div class="card-perfil p-0 mb-3 overflow-hidden border" style="box-shadow: none; border-color: var(--input-border) !important;">
                <div class="p-3 d-flex justify-content-between align-items-center" style="cursor:pointer; background: var(--white);" onclick="window.toggleEditSection('edit-personal', 'icon-personal')">
                    <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-person-lines-fill me-2"></i>Información Personal</h6>
                    <i class="bi bi-chevron-up text-teal" id="icon-personal"></i>
                </div>
                <div id="edit-personal" class="p-3 pt-0 border-top" style="background: var(--white); border-color: var(--input-border) !important;">
                    <div class="field-container row g-2 mb-3 mt-2">
                        <div class="col-12"><label class="small text-muted fw-bold ms-1">Nombre</label><input type="text" id="perf-nombre" class="form-control custom-input profile-input" placeholder="Nombre" required></div>
                        <div class="col-6"><label class="small text-muted fw-bold ms-1">Primer Apellido</label><input type="text" id="perf-ape1" class="form-control custom-input profile-input" placeholder="Primer Apellido" required></div>
                        <div class="col-6"><label class="small text-muted fw-bold ms-1">Segundo Apellido</label><input type="text" id="perf-ape2" class="form-control custom-input profile-input" placeholder="Segundo Apellido"></div>
                    </div>
                    <div class="field-container mb-3"><label class="small text-muted fw-bold ms-1">Correo Electrónico</label><input type="email" id="perf-email" class="form-control custom-input profile-input" readonly disabled></div>
                    <div class="field-container mb-3"><label class="small text-muted fw-bold ms-1">Teléfono</label><input type="tel" id="perf-tel" class="form-control custom-input profile-input" placeholder="+506 8888 8888"></div>
                </div>
            </div>

            ${window.generarSeccionGrupo ? window.generarSeccionGrupo('perf') : ''}
            
            ${window.generarSeccionEmprendimiento ? window.generarSeccionEmprendimiento('perf') : ''}

            <!-- Cambiar Contraseña (Colapsable) -->
            <div class="card-perfil p-0 mb-3 overflow-hidden border" style="box-shadow: none; border-color: var(--input-border) !important;">
                <div class="p-3 d-flex justify-content-between align-items-center" style="cursor:pointer; background: var(--white);" onclick="window.toggleEditSection('edit-pass', 'icon-pass')">
                    <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-shield-lock-fill me-2"></i>Cambiar Contraseña</h6>
                    <i class="bi bi-chevron-down text-teal" id="icon-pass"></i>
                </div>
                <div id="edit-pass" class="p-3 pt-0 border-top d-none" style="background: var(--white); border-color: var(--input-border) !important;">
                    <div class="d-flex gap-3 mb-3 mt-2">
                        <div class="form-check"><input class="form-check-input" type="radio" name="valMethod" id="valPin" checked onchange="window.toggleValMethod()"><label class="form-check-label small fw-bold" for="valPin">Usar PIN</label></div>
                        <div class="form-check"><input class="form-check-input" type="radio" name="valMethod" id="valJson" onchange="window.toggleValMethod()"><label class="form-check-label small fw-bold" for="valJson">Usar Llave</label></div>
                    </div>
                    <div id="val-pin-section"><input type="password" id="perf-val-pass" class="form-control custom-input mb-2" placeholder="Contraseña Actual"><input type="text" id="perf-val-pin" class="form-control custom-input mb-3 text-center tracking-widest" placeholder="PIN de 6 dígitos" maxlength="6"></div>
                    <div id="val-json-section" class="d-none"><input type="file" id="perf-val-file" class="form-control custom-input mb-3" accept=".json"></div>
                    <button class="btn btn-teal w-100 mb-3" onclick="window.validarIdentidad()">Validar Identidad</button>
                    <div id="new-password-section" class="d-none p-3 mt-3" style="background-color: var(--bg-color); border-radius: 1rem; border: 1px solid var(--teal-light);">
                        <h6 class="fw-bold mb-3 text-success"><i class="bi bi-check-circle-fill me-2"></i>Identidad Validada</h6>
                        <div class="input-group mb-2"><input type="password" id="perf-new-pass1" class="form-control custom-input" placeholder="Nueva Contraseña"></div>
                        <div class="input-group mb-3"><input type="password" id="perf-new-pass2" class="form-control custom-input" placeholder="Verificar Nueva Contraseña"></div>
                        <button class="btn btn-teal w-100" onclick="window.generarNuevaLlave()">Actualizar y Generar Llave</button>
                    </div>
                </div>
            </div>

            <!-- Botones Guardar y Cancelar -->
            <div class="d-flex gap-2 mb-4">
                <button class="btn btn-secondary w-50 py-3 fs-6" onclick="window.toggleEditMode()" style="border-radius: 1rem; font-weight: bold;"><i class="bi bi-x-lg me-2"></i>Cancelar</button>
                <button id="btn-save-profile-bottom" class="btn btn-teal w-50 py-3 fs-6" onclick="window.guardarPerfil()" style="font-weight: bold;"><i class="bi bi-save2-fill me-2"></i>Guardar</button>
            </div>

            <!-- Zona de Peligro (Colapsable) -->
            <div class="card-perfil p-0 mb-3 overflow-hidden border" style="box-shadow: none; border-color: #fc8181 !important;">
                <div class="p-3 d-flex justify-content-between align-items-center" style="cursor:pointer; background: #fff5f5;" onclick="window.toggleEditSection('edit-danger', 'icon-danger')">
                    <h6 class="fw-bold mb-0 text-danger"><i class="bi bi-exclamation-triangle-fill me-2"></i>Zona de Peligro</h6>
                    <i class="bi bi-chevron-down text-danger" id="icon-danger"></i>
                </div>
                <div id="edit-danger" class="p-3 pt-0 border-top d-none" style="background: #fff5f5; border-color: #fc8181 !important;">
                    <p class="small text-muted mb-3 mt-2">Si eliminas tu perfil, perderás acceso a tu nube, grupos y emprendimientos. Esta acción no se puede revertir.</p>
                    <button class="btn btn-danger-custom w-100" onclick="window.iniciarBorrado()"><i class="bi bi-trash3-fill me-2"></i>Eliminar Perfil</button>
                </div>
            </div>
        </div>
    </div>
`;