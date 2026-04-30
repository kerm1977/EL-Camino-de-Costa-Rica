// ==========================================
// MÓDULO: VISTAS (Plantillas HTML estáticas)
// Archivo: js/vistas.js
// ==========================================

window.templates = window.templates || {};

// --- 1. VISTA HOME (Inicio con 4 Squircles en 2x2) ---
window.templates.home = `
    <div class="module-fade-in" style="padding-top: 30px; padding-bottom: 50px;">
        <header class="text-center mb-4 mt-2">
            <h3 class="fw-bold" style="color: var(--text-dark);">Inicio</h3>
        </header>

        <div class="row g-4 px-2">
            
            <!-- Card 1: Tour Operadores -->
            <div class="col-6">
                <div class="folder-card h-100 d-flex flex-column align-items-center justify-content-center text-center py-4 px-2" style="cursor:pointer;" onclick="window.showSysAlert('info', 'Tour Operadores', 'Próximamente disponible.')">
                    <div class="squircle bg-cat-purple mb-3 mx-auto">
                        <i class="bi bi-person-walking"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-1 text-wrap" style="font-size: 0.95rem; line-height: 1.2;">Tour Operadores</h6>
                        <small class="text-muted d-block" style="font-size: 0.8rem;">Próximamente</small>
                    </div>
                </div>
            </div>
            
            <!-- Card 2: Emprendedores -->
            <div class="col-6">
                <div class="folder-card h-100 d-flex flex-column align-items-center justify-content-center text-center py-4 px-2" style="cursor:pointer;" onclick="window.showSysAlert('info', 'Emprendedores', 'Próximamente disponible.')">
                    <div class="squircle bg-cat-blue mb-3 mx-auto">
                        <i class="bi bi-shop"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-1 text-wrap" style="font-size: 0.95rem; line-height: 1.2;">Emprendedores</h6>
                        <small class="text-muted d-block" style="font-size: 0.8rem;">Próximamente</small>
                    </div>
                </div>
            </div>
            
            <!-- Card 3: Rutas -->
            <div class="col-6">
                <div class="folder-card h-100 d-flex flex-column align-items-center justify-content-center text-center py-4 px-2" style="cursor:pointer;" onclick="window.showSysAlert('info', 'Rutas', 'Próximamente disponible.')">
                    <div class="squircle bg-cat-orange mb-3 mx-auto">
                        <i class="bi bi-map"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-1 text-wrap" style="font-size: 0.95rem; line-height: 1.2;">Rutas (GPX, KMZ)</h6>
                        <small class="text-muted d-block" style="font-size: 0.8rem;">Próximamente</small>
                    </div>
                </div>
            </div>
            
            <!-- Card 4: Otros -->
            <div class="col-6">
                <div class="folder-card h-100 d-flex flex-column align-items-center justify-content-center text-center py-4 px-2" style="cursor:pointer;" onclick="window.showSysAlert('info', 'Otros', 'Próximamente disponible.')">
                    <div class="squircle bg-cat-pink mb-3 mx-auto">
                        <i class="bi bi-grid-fill"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-1 text-wrap" style="font-size: 0.95rem; line-height: 1.2;">Otros</h6>
                        <small class="text-muted d-block" style="font-size: 0.8rem;">Próximamente</small>
                    </div>
                </div>
            </div>

        </div>
    </div>
`;

// --- 2. VISTA FOLDER ---
window.templates.folder = `
    <div class="module-fade-in pb-4">
        <header class="top-bar d-flex justify-content-between align-items-center mb-3">
            <button class="btn-circle"><i class="bi bi-list fs-5"></i></button>
            <h5 class="mb-0 fw-bold">Folder</h5>
            <button class="btn-circle"><i class="bi bi-search fs-5"></i></button>
        </header>
        <div class="row g-3 px-2">
            <div class="col-6">
                <div class="folder-card">
                    <div class="d-flex justify-content-between align-items-start mb-2"><i class="bi bi-folder-fill"></i><i class="bi bi-three-dots text-muted"></i></div>
                    <h6 class="fw-bold mb-0">Supernatural</h6>
                    <small class="text-muted">80 files</small>
                </div>
            </div>
            <div class="col-6">
                <div class="folder-card">
                    <div class="d-flex justify-content-between align-items-start mb-2"><i class="bi bi-folder-fill"></i><i class="bi bi-three-dots text-muted"></i></div>
                    <h6 class="fw-bold mb-0 text-truncate">Naruto Shipp...</h6>
                    <small class="text-muted">500 files</small>
                </div>
            </div>
        </div>
    </div>
`;

// --- 3. VISTA OVERVIEW ---
window.templates.overview = `
    <div class="module-fade-in pb-4">
        <header class="top-bar d-flex justify-content-between align-items-center mb-3">
            <a href="#home" class="btn-circle text-decoration-none"><i class="bi bi-arrow-left fs-5"></i></a>
            <h5 class="mb-0 fw-bold">Overview</h5>
            <button class="btn-circle"><i class="bi bi-three-dots fs-5"></i></button>
        </header>
        <div class="storage-card p-4 mb-4 text-center">
            <h6 class="mb-4">Available Storage</h6>
            <div class="progress-circle mx-auto mb-4" style="width: 120px; height: 120px;"><span style="font-size: 1.5rem;">80%</span></div>
            <div class="d-flex justify-content-around">
                <div>
                    <div class="small opacity-75"><i class="bi bi-circle-fill me-1" style="font-size: 0.5rem; color: white;"></i>Total</div>
                    <div class="fw-bold">512 GB</div>
                </div>
                <div>
                    <div class="small opacity-75"><i class="bi bi-circle-fill me-1" style="font-size: 0.5rem; color: rgba(255,255,255,0.5);"></i>Used</div>
                    <div class="fw-bold">130 GB</div>
                </div>
            </div>
        </div>
    </div>
`;