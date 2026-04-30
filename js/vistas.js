// js/vistas.js
window.templates = window.templates || {};

window.templates.home = `
    <div class="module-fade-in d-flex flex-column justify-content-center" style="min-height: 75vh;">
        <!-- Header 100% limpio y minimalista -->
        <header class="text-center mb-5">
            <h3 class="fw-bold" style="color: var(--text-dark);">Inicio</h3>
        </header>

        <!-- Cuadrícula 2x2 con el diseño exacto de la imagen (Squircles grandes) -->
        <div class="row text-center px-3 gy-5">
            
            <!-- Card 1: Tour Operadores -->
            <div class="col-6">
                <div style="cursor:pointer;" onclick="window.showSysAlert('info', 'Tour Operadores', 'Próximamente disponible.')">
                    <div class="mx-auto shadow-sm d-flex align-items-center justify-content-center" 
                         style="background-color: var(--cat-purple); width: 85px; height: 85px; border-radius: 1.8rem; color: white; font-size: 2.2rem;">
                        <i class="bi bi-compass-fill"></i>
                    </div>
                    <span class="fw-bold d-block mt-3" style="font-size: 1rem; color: var(--text-dark); line-height: 1.2;">Tour<br>Operadores</span>
                </div>
            </div>
            
            <!-- Card 2: Emprendedores -->
            <div class="col-6">
                <div style="cursor:pointer;" onclick="window.showSysAlert('info', 'Emprendedores', 'Próximamente disponible.')">
                    <div class="mx-auto shadow-sm d-flex align-items-center justify-content-center" 
                         style="background-color: var(--cat-blue); width: 85px; height: 85px; border-radius: 1.8rem; color: white; font-size: 2.2rem;">
                        <i class="bi bi-shop-window"></i>
                    </div>
                    <span class="fw-bold d-block mt-3" style="font-size: 1rem; color: var(--text-dark); line-height: 1.2;">Emprendedores</span>
                </div>
            </div>
            
            <!-- Card 3: Mapas -->
            <div class="col-6">
                <div style="cursor:pointer;" onclick="window.showSysAlert('info', 'Mapas', 'Próximamente disponible.')">
                    <div class="mx-auto shadow-sm d-flex align-items-center justify-content-center" 
                         style="background-color: var(--cat-orange); width: 85px; height: 85px; border-radius: 1.8rem; color: white; font-size: 2.2rem;">
                        <i class="bi bi-map-fill"></i>
                    </div>
                    <span class="fw-bold d-block mt-3" style="font-size: 1rem; color: var(--text-dark); line-height: 1.2;">Mapas</span>
                </div>
            </div>
            
            <!-- Card 4: Otros -->
            <div class="col-6">
                <div style="cursor:pointer;" onclick="window.showSysAlert('info', 'Otros', 'Próximamente disponible.')">
                    <div class="mx-auto shadow-sm d-flex align-items-center justify-content-center" 
                         style="background-color: var(--cat-pink); width: 85px; height: 85px; border-radius: 1.8rem; color: white; font-size: 2.2rem;">
                        <i class="bi bi-grid-fill"></i>
                    </div>
                    <span class="fw-bold d-block mt-3" style="font-size: 1rem; color: var(--text-dark); line-height: 1.2;">Otros</span>
                </div>
            </div>

        </div>
    </div>
`;

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
                <div><div class="small opacity-75"><i class="bi bi-circle-fill me-1" style="font-size: 0.5rem; color: white;"></i>Total</div><div class="fw-bold">512 GB</div></div>
                <div><div class="small opacity-75"><i class="bi bi-circle-fill me-1" style="font-size: 0.5rem; color: rgba(255,255,255,0.5);"></i>Used</div><div class="fw-bold">130 GB</div></div>
            </div>
        </div>
    </div>
`;