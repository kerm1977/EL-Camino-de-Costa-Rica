// ==========================================
// MÓDULO: PERFIL DATA (Motor de Datos y Caché)
// Archivo: js/perfil_data.js
// Responsabilidad: Carga, Guardado, SQLite, IndexedDB y Compresión Base64
// ==========================================

window.currentProfileData = window.currentProfileData || {};

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

// --- CARGA DE DATOS (NUBE + OFFLINE) ---
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
            if(typeof window.selectProfileTheme === 'function') {
                window.selectProfileTheme(data['perf-theme-main'], data['perf-theme-light']);
            }
        }
        window.isEditingProfile = false; 
    } else {
        window.currentProfileData = {};
        window.isEditingProfile = true;
    }
    
    // Llamadas a la UI (Están en los otros archivos)
    if(typeof window.renderEditModeState === 'function') window.renderEditModeState();
    if(typeof window.updateProfileIcons === 'function') window.updateProfileIcons();
    if(typeof window.renderWhatsAppButton === 'function') window.renderWhatsAppButton();
};

// --- GUARDADO DE DATOS EN LA NUBE ---
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
        
        if (window.selectedTheme) {
            data['perf-theme-main'] = window.selectedTheme.main;
            data['perf-theme-light'] = window.selectedTheme.light;
        }

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
            
            // Llamadas a la UI
            if(typeof window.renderEditModeState === 'function') window.renderEditModeState();
            if(typeof window.updateProfileIcons === 'function') window.updateProfileIcons();
            if(typeof window.renderWhatsAppButton === 'function') window.renderWhatsAppButton();
        } else {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || errData.message || "Rechazado por el servidor.");
        }

    } catch (error) {
        if(typeof window.showSysAlert === 'function') window.showSysAlert('warning', 'Atención', error.message);
    } finally {
        if(btnSave) { btnSave.innerHTML = originalText; btnSave.disabled = false; }
    }
};