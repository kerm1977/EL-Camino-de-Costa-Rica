// ==========================================
// MÓDULO: DIRECTORIO (Tour Operadores y Emprendimientos)
// Archivo: js/directorio.js
// Responsabilidad: Renderizar grillas, listas, búsqueda en tiempo real y mostrar perfil público
// ==========================================

// Cache global y estado de la vista preferida (por defecto: grid)
window.directorioCache = { operadores: [], emprendimientos: [] };
window.vistaDirectorio = { operadores: 'grid', emprendimientos: 'grid' };
window.listaActualVista = { operadores: [], emprendimientos: [] }; // Para saber qué tarjeta se tocó

// ==========================================
// FUNCIÓN BLINDADA PARA CERRAR EL PERFIL
// Destruye completamente la capa para evitar bloqueos táctiles en móviles
// ==========================================
window.cerrarPerfilPublico = function() {
    const pageEl = document.getElementById('publicProfileFullPage');
    if (pageEl) {
        pageEl.remove(); // DESTRUCCIÓN TOTAL DE LA VISTA
    }
};

// Función accionada por los botones (Card/Lista) para alternar las vistas
window.cambiarVistaDirectorio = function(tipo, vista) {
    window.vistaDirectorio[tipo] = vista;
    
    // Cambiar estilos visuales de los botones (Activo/Inactivo)
    const btnGrid = document.getElementById('btn-grid-' + tipo);
    const btnList = document.getElementById('btn-list-' + tipo);
    
    if (btnGrid && btnList) {
        if (vista === 'grid') {
            btnGrid.style.background = 'var(--teal-main)';
            btnGrid.style.color = 'white';
            btnList.style.background = 'transparent';
            btnList.style.color = 'var(--text-muted)';
        } else {
            btnList.style.background = 'var(--teal-main)';
            btnList.style.color = 'white';
            btnGrid.style.background = 'transparent';
            btnGrid.style.color = 'var(--text-muted)';
        }
    }
    
    // Volver a aplicar el filtro actual o renderizar todo con la nueva vista
    const searchInput = document.getElementById('search-' + tipo);
    const query = searchInput ? searchInput.value : '';
    if(window.filtrarDirectorio) window.filtrarDirectorio(tipo, query);
};

// Carga principal desde el servidor (Ruta 5)
window.cargarDirectorio = async function(tipo) {
    const gridId = tipo === 'operadores' ? 'grid-tour-operadores' : 'grid-emprendimientos';
    const container = document.getElementById(gridId);
    if(!container) return;

    try {
        const response = await fetch('http://localhost:3000/api/directorio');
        
        // Escudo contra 404 HTML
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Por favor, reinicia tu servidor Node.js (Ctrl+C y luego node server.js).");
        }
        
        const data = await response.json();
        
        // Guardamos los datos en memoria para búsquedas instantáneas
        window.directorioCache.operadores = data.operadores || [];
        window.directorioCache.emprendimientos = data.emprendimientos || [];
        
        window.renderDirectorioGrid(window.directorioCache[tipo], tipo);

    } catch(error) {
        console.error("Error cargando directorio:", error);
        container.innerHTML = `
            <div style="grid-column: 1 / -1;" class="text-center w-100 py-5 text-danger">
                <i class="bi bi-exclamation-triangle fs-1 d-block mb-2"></i>
                <small class="fw-bold">No se pudo conectar con el directorio.</small><br>
                <small class="text-muted mt-2 d-block">${error.message}</small>
            </div>`;
    }
};

// Buscador en tiempo real
window.filtrarDirectorio = function(tipo, query) {
    const termino = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const listaCompleta = window.directorioCache[tipo];
    
    if(!termino) {
        window.renderDirectorioGrid(listaCompleta, tipo);
        return;
    }

    const filtrados = listaCompleta.filter(item => {
        const { 'perf-g-logo': _l, 'perf-g-cert': _c, 'perf-emp-img': _i, 'perf-emp-sello-input': _s, ...datosLimpios } = item;
        const perfilComoTexto = JSON.stringify(datosLimpios).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return perfilComoTexto.includes(termino);
    });

    window.renderDirectorioGrid(filtrados, tipo);
};

// Motor principal de renderizado (Genera Grilla o Lista)
window.renderDirectorioGrid = function(lista, tipo) {
    const gridId = tipo === 'operadores' ? 'grid-tour-operadores' : 'grid-emprendimientos';
    const container = document.getElementById(gridId);
    if(!container) return;

    if(!lista || lista.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1;" class="text-center w-100 py-5 text-muted module-fade-in">
                <i class="bi bi-search fs-1 d-block mb-2 text-teal" style="opacity: 0.5;"></i>
                <small class="fw-bold">No se encontraron resultados.</small>
            </div>`;
        return;
    }

    const vistaActual = window.vistaDirectorio[tipo];
    let listaRender = [...lista];

    // Ordenamos alfabéticamente si estamos en vista lista
    if (vistaActual === 'list') {
        listaRender.sort((a, b) => {
            const nomA = (tipo === 'operadores' ? a['perf-g-op'] : a['perf-emp-nombre']) || '';
            const nomB = (tipo === 'operadores' ? b['perf-g-op'] : b['perf-emp-nombre']) || '';
            return nomA.localeCompare(nomB);
        });
    }

    // Actualizamos la caché visual para poder abrir los perfiles exactos después
    window.listaActualVista[tipo] = listaRender;

    let html = '';
    let letraActual = '';

    listaRender.forEach((item, index) => {
        const nombre = tipo === 'operadores' ? item['perf-g-op'] : item['perf-emp-nombre'];
        const logo = tipo === 'operadores' ? item['perf-g-logo'] : item['perf-emp-img'];
        const atiendeTuristas = tipo === 'operadores' ? item['perf-g-ext'] : item['perf-emp-ext'];
        
        let banderas = '';
        if(atiendeTuristas) {
            const idiomas = [
                { id: 'es', flag: '🇨🇷', name: 'Español' }, { id: 'en', flag: '🇺🇸', name: 'Inglés' }, 
                { id: 'de', flag: '🇩🇪', name: 'Alemán' }, { id: 'it', flag: '🇮🇹', name: 'Italiano' }, 
                { id: 'fr', flag: '🇫🇷', name: 'Francés' }, { id: 'pt', flag: '🇧🇷', name: 'Portugués' }, 
                { id: 'zh', flag: '🇨🇳', name: 'Mandarín' }
            ];
            idiomas.forEach(lang => {
                const soporta = tipo === 'operadores' ? item[`perf-g-lang-${lang.id}`] : item[`perf-emp-lang-${lang.id}`];
                if (soporta) banderas += `<span title="${lang.name}" style="cursor:help;">${lang.flag}</span>`;
            });
        }

        const defaultIcon = tipo === 'operadores' ? 'bi-person-walking' : 'bi-shop';

        // --- RENDERIZADO SEGÚN LA VISTA ELEGIDA ---
        if (vistaActual === 'list') {
            const primeraLetra = nombre ? nombre.charAt(0).toUpperCase() : '#';
            
            // Generar el separador de Letras Alfabéticas
            if (primeraLetra !== letraActual) {
                letraActual = primeraLetra;
                html += `
                <div style="grid-column: 1 / -1;" class="mt-3 mb-1">
                    <div class="d-flex align-items-center">
                        <span class="fs-5 fw-bold" style="color: var(--teal-main);">${letraActual}</span>
                        <div class="ms-2 flex-grow-1" style="height: 2px; background: var(--input-bg);"></div>
                    </div>
                </div>`;
            }

            // APLICAMOS MÁSCARA DE RECORTE INQUEBRANTABLE AL CÍRCULO EN LA LISTA
            const logoList = (logo && (logo.startsWith('data:image') || logo.includes('/'))) 
                ? `<div class="shadow-sm flex-shrink-0" style="width: 55px; height: 55px; min-width: 55px; min-height: 55px; border-radius: 50%; border: 2px solid var(--teal-light); background: var(--white); overflow: hidden; display: flex; justify-content: center; align-items: center;">
                       <img src="${logo}" style="width: 100% !important; height: 100% !important; min-width: 100% !important; min-height: 100% !important; object-fit: cover !important; border-radius: 50% !important; display: block !important; margin: 0 !important; padding: 0 !important;">
                   </div>` 
                : `<div class="shadow-sm flex-shrink-0 d-flex align-items-center justify-content-center text-white" style="width: 55px; height: 55px; min-width: 55px; min-height: 55px; border-radius: 50%; background: var(--teal-main);">
                       <i class="bi ${defaultIcon} fs-3"></i>
                   </div>`;

            // Fila Horizontal List-View
            html += `
                <div style="grid-column: 1 / -1;" class="module-fade-in d-flex align-items-center p-3 mb-2 rounded shadow-sm border" onclick="window.mostrarPerfilPublico('${tipo}', ${index})" style="background: var(--white); border-color: var(--input-border) !important; cursor: pointer;">
                    <div class="me-3 d-flex align-items-center justify-content-center">${logoList}</div>
                    <div class="flex-grow-1 text-start overflow-hidden">
                        <h6 class="fw-bold mb-1 text-truncate" style="color: var(--text-dark);">${nombre}</h6>
                        ${banderas ? `<div class="d-flex gap-1 flex-wrap">${banderas}</div>` : ''}
                    </div>
                    <i class="bi bi-chevron-right text-muted ms-2"></i>
                </div>
            `;
        } else {
            // APLICAMOS MÁSCARA DE RECORTE INQUEBRANTABLE AL CÍRCULO EN LA GRILLA
            const logoVisual = (logo && (logo.startsWith('data:image') || logo.includes('/'))) 
                ? `<div class="shadow-sm" style="width: 65px; height: 65px; min-width: 65px; min-height: 65px; border-radius: 50%; border: 3px solid var(--teal-light); background: var(--white); overflow: hidden; display: flex; justify-content: center; align-items: center; margin: 0 auto 12px auto;">
                       <img src="${logo}" style="width: 100% !important; height: 100% !important; min-width: 100% !important; min-height: 100% !important; object-fit: cover !important; border-radius: 50% !important; display: block !important; margin: 0 !important; padding: 0 !important;">
                   </div>` 
                : `<div class="shadow-sm d-flex align-items-center justify-content-center text-white" style="width: 65px; height: 65px; min-width: 65px; min-height: 65px; border-radius: 50%; background: var(--teal-main); margin: 0 auto 12px auto;">
                       <i class="bi ${defaultIcon} fs-2"></i>
                   </div>`;

            html += `
                <div class="card-afiliado module-fade-in" onclick="window.mostrarPerfilPublico('${tipo}', ${index})">
                    ${logoVisual}
                    <div class="card-afiliado-title">${nombre}</div>
                    ${banderas ? `<div class="card-afiliado-flags mt-auto pt-2 w-100">${banderas}</div>` : ''}
                </div>
            `;
        }
    });

    container.innerHTML = html;
};

// ==========================================
// VISTA: PERFIL PÚBLICO (HOJA COMPLETA + CTA WHATSAPP)
// ==========================================
window.mostrarPerfilPublico = function(tipo, index) {
    const item = window.listaActualVista[tipo][index];
    if(!item) return;

    const isOp = (tipo === 'operadores');
    
    // Extracción de datos básicos
    const nombre = isOp ? item['perf-g-op'] : item['perf-emp-nombre'];
    const logo = isOp ? item['perf-g-logo'] : item['perf-emp-img'];
    const nota = isOp ? item['perf-g-nota'] : item['perf-emp-nota'];
    const ubicacion = isOp ? item['perf-g-prov'] : '';
    const contacto = isOp ? item['perf-g-coord'] : item['perf-emp-cont'];
    
    // Obtener teléfono para el botón de WhatsApp
    const telefono = isOp ? (item['perf-g-celular'] || item['perf-g-tellocal']) : item['perf-emp-tel'];

    // 1. CONSTRUIR BOTÓN GRANDE DE WHATSAPP (FIJO EN EL FOOTER)
    let waButtonHtml = '';
    if(telefono) {
        let cleanPhone = telefono.replace(/\D/g, '');
        if(!cleanPhone.startsWith('506') && cleanPhone.length >= 8) cleanPhone = '506' + cleanPhone;
        
        const textoNombre = nombre ? `Contacta a ${nombre}` : 'Contactar';
        
        waButtonHtml = `
        <div class="p-3 w-100 mx-auto" style="max-width: 500px;">
            <a href="https://wa.me/${cleanPhone}" target="_blank" class="btn w-100 py-3 shadow-lg d-flex justify-content-center align-items-center text-decoration-none" style="background-color: #25D366; color: white; border-radius: 1rem;">
                <i class="bi bi-whatsapp me-3" style="font-size: 2rem;"></i>
                <div class="d-flex flex-column text-start">
                    <span class="fw-bold" style="line-height: 1.1; font-size: 1.1rem;">${textoNombre}</span>
                    <span style="font-size: 0.9rem; line-height: 1.1; opacity: 0.9;">WhatsApp Directo</span>
                </div>
            </a>
        </div>`;
    }

    // 2. CONSTRUIR REDES SOCIALES Y ENLACES (Activadores)
    const prefix = isOp ? 'perf-g' : 'perf-e';
    const redesNombres = ['WhatsApp', 'Signal', 'Email', 'Facebook', 'Instagram', 'TikTok', 'Telegram', 'URL Waze', 'URL Google Maps'];
    const redesIconos = ['bi-whatsapp', 'bi-chat-dots', 'bi-envelope', 'bi-facebook', 'bi-instagram', 'bi-tiktok', 'bi-telegram', 'bi-cone-striped', 'bi-geo-alt'];
    const redesColores = ['#25D366', '#3A76F0', '#ea4335', '#1877F2', '#E1306C', '#000000', '#0088cc', '#33ccff', '#34a853'];
    
    let redesHtml = '';
    for(let i=0; i<9; i++) {
        // Ignoramos el WhatsApp secundario para dejar solo el CTA principal
        if (i === 0) continue; 

        if(item[`${prefix}-act-${i}`] && item[`${prefix}-act-${i}-input`]) {
            let val = item[`${prefix}-act-${i}-input`].trim();
            let url = val;
            
            if (i === 1) { // Signal
                let cPhone = val.replace(/\D/g, '');
                if(!cPhone.startsWith('506') && cPhone.length >= 8) cPhone = '506' + cPhone;
                url = `https://signal.me/#p/+${cPhone}`;
            } else if (i === 2) { // Email
                url = `mailto:${val}`;
            } else { // Web, FB, Insta...
                if(!url.startsWith('http')) url = `https://${url}`;
            }

            redesHtml += `
            <a href="${url}" target="_blank" class="d-flex align-items-center mb-3 text-decoration-none p-3 rounded shadow-sm" style="background: var(--white); border: 1px solid var(--input-border);">
                <div class="d-flex align-items-center justify-content-center rounded-circle me-3" style="width: 45px; height: 45px; background-color: ${redesColores[i]}20; color: ${redesColores[i]};">
                    <i class="bi ${redesIconos[i]} fs-5"></i>
                </div>
                <div class="d-flex flex-column overflow-hidden">
                    <span class="fw-bold" style="color: var(--text-dark);">${redesNombres[i]}</span>
                    <span class="small text-truncate" style="color: var(--text-muted);">${val}</span>
                </div>
            </a>`;
        }
    }

    // 3. CONSTRUIR DETALLES ESPECÍFICOS
    const agregarDetalle = (icono, color, titulo, valor) => {
        if (!valor) return '';
        return `
        <div class="d-flex align-items-start mb-3">
            <i class="bi ${icono} me-3 mt-1 fs-5" style="color: ${color};"></i>
            <div>
                <strong style="color: var(--text-dark); display: block; font-size: 0.95rem;">${titulo}</strong>
                <span style="color: var(--text-muted); font-size: 0.9rem;">${valor}</span>
            </div>
        </div>`;
    };

    let detallesHtml = '';
    if(isOp) {
        let servicios = [];
        if(item['perf-g-ext']) servicios.push('Extranjeros');
        if(item['perf-g-ind']) servicios.push('Individual');
        if(item['perf-g-full']) servicios.push('Completo');
        if(servicios.length > 0) {
            detallesHtml += agregarDetalle('bi-check-circle-fill', 'var(--teal-main)', 'Servicios Habilitados', servicios.join(', '));
        }
    } else {
        const tipoServicio = item['perf-emp-tipo'] === 'Otros' && item['perf-emp-tipo-otro'] ? item['perf-emp-tipo-otro'] : item['perf-emp-tipo'];
        detallesHtml += agregarDetalle('bi-briefcase-fill', 'var(--teal-main)', 'Servicio / Industria', tipoServicio);
        detallesHtml += agregarDetalle('bi-bar-chart-line-fill', 'var(--cat-purple)', 'Etapa del Negocio', item['perf-emp-etapa']);
        detallesHtml += agregarDetalle('bi-clock-fill', 'var(--cat-blue)', 'Horario de Atención', item['perf-emp-horario']);
    }

    // 4. CONSTRUIR IDIOMAS
    const atiendeTuristas = isOp ? item['perf-g-ext'] : item['perf-emp-ext'];
    let banderas = '';
    if(atiendeTuristas) {
        const idiomas = [
            { id: 'es', flag: '🇨🇷', name: 'Español' }, { id: 'en', flag: '🇺🇸', name: 'Inglés' }, 
            { id: 'de', flag: '🇩🇪', name: 'Alemán' }, { id: 'it', flag: '🇮🇹', name: 'Italiano' }, 
            { id: 'fr', flag: '🇫🇷', name: 'Francés' }, { id: 'pt', flag: '🇧🇷', name: 'Portugués' }, 
            { id: 'zh', flag: '🇨🇳', name: 'Mandarín' }
        ];
        idiomas.forEach(lang => {
            const soporta = isOp ? item[`perf-g-lang-${lang.id}`] : item[`perf-emp-lang-${lang.id}`];
            if (soporta) banderas += `<span title="${lang.name}" class="fs-3 me-2">${lang.flag}</span>`;
        });
        if(banderas) detallesHtml += agregarDetalle('bi-translate', 'var(--teal-main)', 'Idiomas', banderas);
    }

    // 5. CONSTRUIR CERTIFICADO Y SELLO (COLAPSABLE)
    let certHtml = '';
    const collapseId = `cert-collapse-${index}`;

    if (isOp && item['perf-g-cert']) {
        const c = item['perf-g-cert'];
        let certMedia = c.startsWith('data:application/pdf')
            ? `<iframe src="${c}" style="width:100%; height:250px; border:1px solid var(--input-border); border-radius: 0.5rem; background:white;"></iframe>`
            : `<img src="${c}" style="width:100%; max-height:250px; object-fit:contain; border-radius:0.5rem;">`;
            
        certHtml = `
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <i class="bi bi-award-fill fs-4 me-3" style="color: var(--teal-main);"></i>
                <strong style="color: var(--text-dark); font-size: 0.95rem;">Certificado Oficial</strong>
            </div>
            <button class="btn btn-sm shadow-sm" style="background: var(--input-bg); color: var(--text-dark); border: 1px solid var(--input-border); border-radius: 0.5rem;" onclick="document.getElementById('${collapseId}').classList.toggle('d-none')">
                <i class="bi bi-arrows-expand me-1"></i> Ver
            </button>
        </div>
        <div id="${collapseId}" class="d-none mt-3 text-center module-fade-in p-2 rounded" style="background: var(--input-bg); border: 1px solid var(--input-border);">
            ${certMedia}
        </div>`;
    }
    
    if (!isOp && item['perf-emp-sello-input']) {
        certHtml = `
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <i class="bi bi-patch-check-fill fs-4 me-3 text-warning"></i>
                <strong style="color: var(--text-dark); font-size: 0.95rem;">Sello Comercial</strong>
            </div>
            <button class="btn btn-sm shadow-sm" style="background: var(--input-bg); color: var(--text-dark); border: 1px solid var(--input-border); border-radius: 0.5rem;" onclick="document.getElementById('${collapseId}').classList.toggle('d-none')">
                <i class="bi bi-arrows-expand me-1"></i> Ver
            </button>
        </div>
        <div id="${collapseId}" class="d-none mt-3 text-center module-fade-in p-2 rounded" style="background: var(--input-bg); border: 1px solid var(--input-border);">
            <img src="${item['perf-emp-sello-input']}" style="max-height:150px; object-fit:contain; border-radius:0.5rem;">
        </div>`;
    }

    // 6. APLICAMOS MÁSCARA DE RECORTE INQUEBRANTABLE AL CÍRCULO DEL PERFIL COMPLETO (130px)
    const logoImg = (logo && (logo.startsWith('data:image') || logo.includes('/'))) ? logo : '';
    const logoEl = logoImg 
        ? `<div class="shadow-sm mx-auto d-block mt-3 mb-3" style="width: 130px; height: 130px; min-width: 130px; min-height: 130px; border-radius: 50%; border: 4px solid var(--teal-light); background: var(--white); overflow: hidden; display: flex; justify-content: center; align-items: center;">
               <img src="${logoImg}" style="width: 100% !important; height: 100% !important; min-width: 100% !important; min-height: 100% !important; object-fit: cover !important; border-radius: 50% !important; display: block !important; margin: 0 !important; padding: 0 !important;">
           </div>`
        : `<div class="shadow-sm d-flex align-items-center justify-content-center mx-auto d-block mt-3 mb-3 text-white" style="width: 130px; height: 130px; min-width: 130px; min-height: 130px; border-radius: 50%; background: var(--teal-main); border: 4px solid var(--teal-light);">
               <i class="bi bi-person-walking" style="font-size: 4rem;"></i>
           </div>`;

    // 7. INYECTAR Y MOSTRAR COMO HOJA COMPLETA (FULL PAGE)
    // Limpiamos primero si ya existía para evitar duplicados zombies
    let pageEl = document.getElementById('publicProfileFullPage');
    if (pageEl) {
        pageEl.remove();
    }

    document.body.insertAdjacentHTML('beforeend', `
        <div id="publicProfileFullPage" class="module-fade-in d-flex flex-column" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2000; background: var(--bg-color);">
            
            <!-- Encabezado Fijo (BOTÓN ATRÁS BLINDADO) -->
            <header class="top-bar d-flex align-items-center px-3 shadow-sm flex-shrink-0" style="background: var(--bg-color); padding-top: max(1rem, env(safe-area-inset-top)); padding-bottom: 0.8rem; z-index: 10;">
                <button type="button" class="btn-circle shadow-sm flex-shrink-0 me-3 d-flex justify-content-center align-items-center" onclick="window.cerrarPerfilPublico()" style="width: 40px; height: 40px; background: var(--input-bg); color: var(--text-dark); border: 1px solid var(--input-border); cursor: pointer;">
                    <i class="bi bi-arrow-left fs-5" style="pointer-events: none;"></i>
                </button>
                <h5 class="mb-0 fw-bold text-truncate flex-grow-1" style="color: var(--text-dark);">Perfil de Afiliado</h5>
            </header>
            
            <!-- Cuerpo Escroleable de la Hoja -->
            <div id="publicProfileFullPageBody" class="flex-grow-1 overflow-auto position-relative">
                <div class="container px-0">
                    <div class="p-3 text-center border-bottom" style="border-color: var(--input-border) !important;">
                        ${logoEl}
                        <h4 class="fw-bold mb-1" style="color: var(--text-dark);">${nombre || 'Sin Nombre'}</h4>
                        ${contacto ? `<p class="small fw-bold mb-1" style="color: var(--text-muted);"><i class="bi bi-person-fill me-1"></i>${contacto}</p>` : ''}
                        ${ubicacion ? `<p class="small fw-bold mb-3" style="color: var(--text-muted);"><i class="bi bi-geo-alt-fill me-1"></i>${ubicacion}</p>` : ''}
                    </div>
                    
                    <div class="p-3 text-start mt-2 pb-4">
                        ${detallesHtml ? `<div class="mb-4 border-bottom pb-4" style="border-color: var(--input-border) !important;">${detallesHtml}</div>` : ''}
                        
                        ${nota ? `<div class="mb-4 border-bottom pb-4" style="border-color: var(--input-border) !important;"><h6 class="fw-bold text-teal mb-3"><i class="bi bi-card-text me-2"></i>Acerca de nosotros</h6><div style="color: var(--text-dark); font-size: 0.95rem; line-height: 1.6;">${nota}</div></div>` : ''}
                        
                        ${certHtml ? `<div class="mb-4 border-bottom pb-4" style="border-color: var(--input-border) !important;">${certHtml}</div>` : ''}

                        ${redesHtml ? `<div><h6 class="fw-bold text-teal mb-3"><i class="bi bi-link-45deg me-2"></i>Redes y Enlaces</h6>${redesHtml}</div>` : ''}
                    </div>
                </div>
            </div>

            <!-- Footer Fijo para el Botón de WhatsApp -->
            <div id="publicProfileFullPageFooter" class="flex-shrink-0 shadow-lg" style="background: var(--bg-color); border-top: 1px solid var(--input-border); padding-bottom: env(safe-area-inset-bottom);">
                ${waButtonHtml}
            </div>
        </div>
    `);

    pageEl = document.getElementById('publicProfileFullPage');
    if(pageEl) {
        pageEl.style.display = 'flex';
        const bodyEl = document.getElementById('publicProfileFullPageBody');
        if(bodyEl) bodyEl.scrollTop = 0;
    }
};