// ==========================================
// MÓDULO: VISTAS (Plantillas HTML estáticas)
// Archivo: js/vistas.js
// ==========================================

window.templates = window.templates || {};

// --- 1. VISTA HOME ---
window.templates.home = `
    <div class="module-fade-in" style="padding-top: 30px; padding-bottom: 50px;">
        <header class="text-center mb-4 mt-2">
            <h3 class="fw-bold" style="color: var(--text-dark);">Inicio</h3>
        </header>

        <div class="row g-4 px-2">
            
            <!-- Card 1: Tour Operadores (Enlace al Directorio) -->
            <div class="col-6">
                <div class="folder-card h-100 d-flex flex-column align-items-center justify-content-center text-center py-4 px-2" style="cursor:pointer;" onclick="window.location.hash='tour_operadores'">
                    <div class="squircle bg-cat-purple mb-3 mx-auto">
                        <i class="bi bi-person-walking"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-1 text-wrap" style="font-size: 0.95rem; line-height: 1.2;">Tour Operadores</h6>
                        <small class="fw-bold d-block" style="color: var(--cat-purple); font-size: 0.8rem;">Ver Directorio</small>
                    </div>
                </div>
            </div>
            
            <!-- Card 2: Emprendimientos (Enlace al Directorio) -->
            <div class="col-6">
                <div class="folder-card h-100 d-flex flex-column align-items-center justify-content-center text-center py-4 px-2" style="cursor:pointer;" onclick="window.location.hash='emprendimientos'">
                    <div class="squircle bg-cat-blue mb-3 mx-auto">
                        <i class="bi bi-shop"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-1 text-wrap" style="font-size: 0.95rem; line-height: 1.2;">Emprendimientos</h6>
                        <small class="fw-bold d-block" style="color: var(--cat-blue); font-size: 0.8rem;">Ver Directorio</small>
                    </div>
                </div>
            </div>
            
            <div class="col-6">
                <div class="folder-card h-100 d-flex flex-column align-items-center justify-content-center text-center py-4 px-2" style="cursor:pointer;" onclick="window.showSysAlert('info', 'Rutas', 'Próximamente disponible.')">
                    <div class="squircle bg-cat-orange mb-3 mx-auto"><i class="bi bi-map"></i></div>
                    <div>
                        <h6 class="fw-bold mb-1 text-wrap" style="font-size: 0.95rem; line-height: 1.2;">Rutas (GPX, KMZ)</h6>
                        <small class="fw-bold d-block" style="color: var(--cat-orange); font-size: 0.8rem;">Próximamente</small>
                    </div>
                </div>
            </div>
            
            <div class="col-6">
                <div class="folder-card h-100 d-flex flex-column align-items-center justify-content-center text-center py-4 px-2" style="cursor:pointer;" onclick="window.showSysAlert('info', 'Otros', 'Próximamente disponible.')">
                    <div class="squircle bg-cat-pink mb-3 mx-auto"><i class="bi bi-grid-fill"></i></div>
                    <div>
                        <h6 class="fw-bold mb-1 text-wrap" style="font-size: 0.95rem; line-height: 1.2;">Otros</h6>
                        <small class="fw-bold d-block" style="color: var(--cat-pink); font-size: 0.8rem;">Próximamente</small>
                    </div>
                </div>
            </div>

        </div>
    </div>
`;

// --- VISTA: DIRECTORIO TOUR OPERADORES ---
window.templates.tour_operadores = `
    <div class="module-fade-in pb-5">
        <header class="top-bar mb-2">
            <a href="#home" class="btn-circle text-decoration-none shadow-sm"><i class="bi bi-arrow-left fs-5"></i></a>
        </header>
        
        <div class="mb-3 mt-2 px-2 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0" style="color: var(--text-dark);">Tour Operadores Afiliados</h5>
            <!-- BOTONES DE VISTA -->
            <div class="d-flex shadow-sm" style="border-radius: 0.8rem; overflow: hidden; border: 1px solid var(--input-border); background: var(--input-bg);">
                <button id="btn-grid-operadores" class="btn btn-sm px-3 py-1" style="background: var(--teal-main); color: white; border-radius: 0;" onclick="if(window.cambiarVistaDirectorio) window.cambiarVistaDirectorio('operadores', 'grid')"><i class="bi bi-grid-fill fs-6"></i></button>
                <button id="btn-list-operadores" class="btn btn-sm px-3 py-1" style="background: transparent; color: var(--text-muted); border-radius: 0;" onclick="if(window.cambiarVistaDirectorio) window.cambiarVistaDirectorio('operadores', 'list')"><i class="bi bi-list-ul fs-6"></i></button>
            </div>
        </div>

        <!-- BUSCADOR EN TIEMPO REAL -->
        <div class="px-2 mb-4">
            <div class="position-relative">
                <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3" style="color: var(--text-muted); z-index: 10;"></i>
                <input type="text" id="search-operadores" class="form-control custom-input shadow-sm ps-5" placeholder="Buscar por nombre, tel, idiomas..." oninput="if(window.filtrarDirectorio) window.filtrarDirectorio('operadores', this.value)" style="background-color: var(--input-bg) !important; color: var(--text-dark) !important; border-color: var(--input-border) !important;">
            </div>
        </div>

        <div id="grid-tour-operadores" class="grid-afiliados">
            <div style="grid-column: 1 / -1;" class="text-center w-100 py-5">
                <span class="spinner-border text-teal mb-2"></span><br>
                <small class="fw-bold text-muted">Cargando directorio...</small>
            </div>
        </div>
    </div>
`;

// --- VISTA: DIRECTORIO EMPRENDIMIENTOS ---
window.templates.emprendimientos = `
    <div class="module-fade-in pb-5">
        <header class="top-bar mb-2">
            <a href="#home" class="btn-circle text-decoration-none shadow-sm"><i class="bi bi-arrow-left fs-5"></i></a>
        </header>

        <div class="mb-3 mt-2 px-2 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0" style="color: var(--text-dark);">Emprendimientos Afiliados</h5>
            <!-- BOTONES DE VISTA -->
            <div class="d-flex shadow-sm" style="border-radius: 0.8rem; overflow: hidden; border: 1px solid var(--input-border); background: var(--input-bg);">
                <button id="btn-grid-emprendimientos" class="btn btn-sm px-3 py-1" style="background: var(--teal-main); color: white; border-radius: 0;" onclick="if(window.cambiarVistaDirectorio) window.cambiarVistaDirectorio('emprendimientos', 'grid')"><i class="bi bi-grid-fill fs-6"></i></button>
                <button id="btn-list-emprendimientos" class="btn btn-sm px-3 py-1" style="background: transparent; color: var(--text-muted); border-radius: 0;" onclick="if(window.cambiarVistaDirectorio) window.cambiarVistaDirectorio('emprendimientos', 'list')"><i class="bi bi-list-ul fs-6"></i></button>
            </div>
        </div>

        <!-- BUSCADOR EN TIEMPO REAL -->
        <div class="px-2 mb-4">
            <div class="position-relative">
                <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3" style="color: var(--text-muted); z-index: 10;"></i>
                <input type="text" id="search-emprendimientos" class="form-control custom-input shadow-sm ps-5" placeholder="Buscar por nombre, servicio, contacto..." oninput="if(window.filtrarDirectorio) window.filtrarDirectorio('emprendimientos', this.value)" style="background-color: var(--input-bg) !important; color: var(--text-dark) !important; border-color: var(--input-border) !important;">
            </div>
        </div>

        <div id="grid-emprendimientos" class="grid-afiliados">
            <div style="grid-column: 1 / -1;" class="text-center w-100 py-5">
                <span class="spinner-border text-teal mb-2"></span><br>
                <small class="fw-bold text-muted">Cargando directorio...</small>
            </div>
        </div>
    </div>
`;

// --- VISTA FOLDER ---
window.templates.folder = `
    <div class="module-fade-in pb-4">
        <header class="top-bar d-flex justify-content-between align-items-center mb-3">
            <button class="btn-circle"><i class="bi bi-list fs-5"></i></button>
            <h5 class="mb-0 fw-bold">Folder</h5>
            <button class="btn-circle"><i class="bi bi-search fs-5"></i></button>
        </header>
        <div class="row g-3 px-2">
            <div class="col-6"><div class="folder-card"><div class="d-flex justify-content-between align-items-start mb-2"><i class="bi bi-folder-fill"></i><i class="bi bi-three-dots text-muted"></i></div><h6 class="fw-bold mb-0">Supernatural</h6><small class="text-muted">80 files</small></div></div>
            <div class="col-6"><div class="folder-card"><div class="d-flex justify-content-between align-items-start mb-2"><i class="bi bi-folder-fill"></i><i class="bi bi-three-dots text-muted"></i></div><h6 class="fw-bold mb-0 text-truncate">Naruto Shipp...</h6><small class="text-muted">500 files</small></div></div>
        </div>
    </div>
`;

// --- VISTA OVERVIEW ---
window.templates.overview = `
    <div class="module-fade-in pb-4">
        <header class="top-bar mb-2">
            <a href="#home" class="btn-circle text-decoration-none shadow-sm"><i class="bi bi-arrow-left fs-5"></i></a>
        </header>
        
        <div class="mb-4 mt-2 px-2 d-flex justify-content-between align-items-center">
            <h4 class="fw-bold mb-0" style="color: var(--text-dark);">Overview</h4>
            <button class="btn-circle shadow-sm"><i class="bi bi-three-dots fs-5"></i></button>
        </div>

        <div class="storage-card p-4 mb-4 text-center">
            <h6 class="mb-4">Available Storage</h6>
            <div class="progress-circle mx-auto mb-4" style="width: 120px; height: 120px;"><span style="font-size: 1.5rem;">80%</span></div>
            <div class="d-flex justify-content-around">
                <div><div class="small opacity-75"><i class="bi bi-circle-fill me-1" style="font-size: 0.5rem; color: white;"></i>Total</div><div class="fw-bold">512 GB</div></div>
                <div><div class="small opacity-75"><i class="bi bi-circle-fill me-1" style="font-size: 0.5rem; color: rgba(255,255,255,0.5);"></i>Used</div><div class="fw-bold">130 GB</div></div>
            </div>
        </div>
    </div>
`;