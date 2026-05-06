// ==========================================
// MÓDULO: PERFIL (Vista Principal y Plantilla)
// Archivo: js/perfil.js
// Responsabilidad: Plantilla HTML y Renderizado de la Tarjeta
// ==========================================

window.templates = window.templates || {};

window.updateProfileCardView = function() {
    const data = window.currentProfileData || {};
    const email = localStorage.getItem('userEmail') || 'usuario@correo.com';

    // 1. Aplicar Tema Guardado
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

    // 2. Encabezado Inteligente
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

    // 3. Avatar del Encabezado
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

    // Helper: Generador de Activadores (Mejorado para hacer clic y añadir Web)
    const renderActivadores = (prefix) => {
        const redesNombres = ['WhatsApp', 'Signal', 'Email', 'Facebook', 'Instagram', 'TikTok', 'Telegram', 'Waze', 'Google Maps', 'Página Web'];
        const redesIconos = ['bi-whatsapp', 'bi-chat-dots', 'bi-envelope', 'bi-facebook', 'bi-instagram', 'bi-tiktok', 'bi-telegram', 'bi-cone-striped', 'bi-geo-alt', 'bi-globe'];
        const redesColores = ['#25D366', '#3A76F0', '#ea4335', '#1877F2', '#E1306C', '#000000', '#0088cc', '#33ccff', '#34a853', '#4a5568'];
        let html = '';
        for(let i=0; i<redesNombres.length; i++) {
            if(data[`${prefix}-act-${i}`] && data[`${prefix}-act-${i}-input`]) {
                let url = data[`${prefix}-act-${i}-input`];
                let href = url;
                
                if (i === 1) { // Signal
                    let cPhone = url.replace(/\D/g, '');
                    if(!cPhone.startsWith('506') && cPhone.length >= 8) cPhone = '506' + cPhone;
                    href = `https://signal.me/#p/+${cPhone}`;
                } else if (i === 2) { // Email
                    href = `mailto:${url}`;
                } else if (i === 0) { // Whatsapp
                    let cPhone = url.replace(/\D/g, '');
                    if(!cPhone.startsWith('506') && cPhone.length >= 8) cPhone = '506' + cPhone;
                    href = `https://wa.me/${cPhone}`;
                } else {
                    if(!href.startsWith('http')) href = `https://${href}`;
                }

                html += `<a href="${href}" target="_blank" class="d-flex align-items-center mb-2 text-decoration-none"><i class="bi ${redesIconos[i]} me-2" style="color: ${redesColores[i]}; font-size: 1.1rem;"></i><span class="small text-break text-teal fw-bold">${url}</span></a>`;
            }
        }
        return html ? `<div class="mt-3 pt-2 border-top"><h6 class="fw-bold small mb-2" style="color: var(--text-dark); opacity: 0.8;">Enlaces y Redes</h6>${html}</div>` : '';
    };

    let dynamicHtml = '';

    // --- 4. CONSTRUCCIÓN: GRUPO ---
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
        dynamicHtml += window.buildCollapsibleSection('card-section-grupo', 'Grupo Afiliado', 'bi-people-fill', contentHtml);
    }

    // --- 5. CONSTRUCCIÓN: EMPRENDIMIENTO ---
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
        dynamicHtml += window.buildCollapsibleSection('card-section-emp', 'Emprendimiento', 'bi-shop', contentHtml);
    }

    // --- 6. CONSTRUCCIÓN: IDIOMAS ---
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
        dynamicHtml += window.buildCollapsibleSection('card-section-turistas', 'Atención a Turistas', 'bi-translate', innerTuristas);
    }

    // --- 7. CONSTRUCCIÓN: CONTACTO PERSONAL ---
    if (headerEntityActive) {
        let contentPersonal = `
            <div class="d-flex mb-2"><i class="bi bi-person-fill me-2" style="color: var(--cat-blue); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Nombre:</strong> ${fullName}</span></div>
            <div class="d-flex mb-2"><i class="bi bi-envelope-fill me-2" style="color: var(--cat-pink); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Email:</strong> ${email}</span></div>
            ${data['perf-tel'] ? `<div class="d-flex mb-2"><i class="bi bi-telephone-fill me-2" style="color: var(--cat-orange); font-size: 1.1rem;"></i><span class="small" style="color: var(--text-dark);"><strong>Teléfono:</strong> ${data['perf-tel']}</span></div>` : ''}
        `;
        dynamicHtml += window.buildCollapsibleSection('card-section-contacto', 'Contacto Personal', 'bi-person-lines-fill', contentPersonal);
    }

    // --- 8. CONSTRUCCIÓN: CERTIFICADO ---
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
        dynamicHtml += window.buildCollapsibleSection('card-section-cert', 'Certificación', 'bi-award-fill', contentCert);
    }

    if(!data['perf-switch-grupo'] && !data['perf-switch-emp'] && !headerEntityActive) {
        dynamicHtml += `<p class="text-muted small text-center mt-3" style="color: var(--text-dark);"><em>No hay grupos ni emprendimientos afiliados aún.</em></p>`;
    }

    const cardContent = document.getElementById('card-dynamic-content');
    if (cardContent) cardContent.innerHTML = dynamicHtml;
    
    if(typeof window.updateProfileIcons === 'function') window.updateProfileIcons(); 
};

// --- PLANTILLA HTML PRINCIPAL ---
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
                        ${window.renderColorPalette ? window.renderColorPalette() : ''}
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