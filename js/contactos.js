// ==========================================
// MÓDULO: CONTACTOS (Información de Contacto y Soporte)
// Archivo: js/contactos.js
// Responsabilidad: Renderizar la vista de soporte e información institucional
// ==========================================

window.templates = window.templates || {};

// Función para alternar la leyenda de información de La Tribu
window.toggleInfoTribu = function() {
    const infoDiv = document.getElementById('info-tribu-desarrollo');
    const icon = document.getElementById('info-tribu-icon');
    if (!infoDiv || !icon) return;

    if (infoDiv.classList.contains('d-none')) {
        infoDiv.classList.remove('d-none');
        icon.classList.replace('bi-info-circle-fill', 'bi-chevron-up');
    } else {
        infoDiv.classList.add('d-none');
        icon.classList.replace('bi-chevron-up', 'bi-info-circle-fill');
    }
};

window.templates.contactos = `
    <div class="module-fade-in pb-5">
        <header class="top-bar d-flex align-items-center px-3 pt-3 mb-4">
            <a href="#home" class="btn-circle text-decoration-none shadow-sm flex-shrink-0 me-3"><i class="bi bi-arrow-left fs-5"></i></a>
            <h5 class="mb-0 fw-bold flex-grow-1" style="color: var(--text-dark);">Contacto y Soporte</h5>
        </header>
        
        <div class="px-3 pb-4">
            
            <!-- Tarjeta Informativa: Asociación Mar a Mar -->
            <div class="card-perfil p-0 mb-4 overflow-hidden border" style="box-shadow: var(--card-shadow); border-color: var(--input-border) !important;">
                <div class="p-3 border-bottom d-flex align-items-center" style="background: var(--bg-color);">
                    <div class="me-3 flex-shrink-0 d-flex align-items-center justify-content-center bg-teal text-white rounded-circle shadow-sm" style="width: 45px; height: 45px;">
                        <i class="bi bi-signpost-split-fill fs-5"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-0 text-teal">El Camino de Costa Rica</h6>
                        <small class="text-muted fw-bold">Asociación Mar a Mar</small>
                    </div>
                </div>
                <div class="p-3" style="background: var(--white);">
                    <!-- Enlace Email -->
                    <a href="mailto:info@maramar.org" class="d-flex align-items-center mb-3 text-decoration-none">
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 40px; height: 40px; background: rgba(234, 67, 53, 0.1);">
                            <i class="bi bi-envelope-fill fs-5" style="color: #ea4335;"></i>
                        </div>
                        <div class="overflow-hidden">
                            <strong class="d-block text-dark small">Correo Electrónico</strong>
                            <span class="text-muted small text-truncate">info@maramar.org</span>
                        </div>
                    </a>
                    
                    <!-- Enlace WhatsApp -->
                    <a href="https://wa.me/50671442415" target="_blank" class="d-flex align-items-center mb-3 text-decoration-none">
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 40px; height: 40px; background: rgba(37, 211, 102, 0.1);">
                            <i class="bi bi-whatsapp fs-5" style="color: #25D366;"></i>
                        </div>
                        <div class="overflow-hidden">
                            <strong class="d-block text-dark small">Teléfono / WhatsApp</strong>
                            <span class="text-muted small text-truncate">+506 7144 2415</span>
                        </div>
                    </a>

                    <!-- Enlace Web -->
                    <a href="https://caminodecostarica.org" target="_blank" class="d-flex align-items-center mb-3 text-decoration-none">
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 40px; height: 40px; background: rgba(74, 85, 104, 0.1);">
                            <i class="bi bi-globe fs-5" style="color: #4a5568;"></i>
                        </div>
                        <div class="overflow-hidden">
                            <strong class="d-block text-dark small">Página Web</strong>
                            <span class="text-muted small text-truncate">caminodecostarica.org</span>
                        </div>
                    </a>

                    <!-- Enlace Instagram -->
                    <a href="https://www.instagram.com/elcaminodecostarica/" target="_blank" class="d-flex align-items-center mb-3 text-decoration-none">
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 40px; height: 40px; background: rgba(225, 48, 108, 0.1);">
                            <i class="bi bi-instagram fs-5" style="color: #E1306C;"></i>
                        </div>
                        <div class="overflow-hidden">
                            <strong class="d-block text-dark small">Instagram</strong>
                            <span class="text-muted small text-truncate">@elcaminodecostarica</span>
                        </div>
                    </a>

                    <!-- Enlace Facebook -->
                    <a href="https://www.facebook.com/ElCaminoDeCostaRica" target="_blank" class="d-flex align-items-center text-decoration-none">
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 40px; height: 40px; background: rgba(24, 119, 242, 0.1);">
                            <i class="bi bi-facebook fs-5" style="color: #1877F2;"></i>
                        </div>
                        <div class="overflow-hidden">
                            <strong class="d-block text-dark small">Facebook</strong>
                            <span class="text-muted small text-truncate">El Camino De Costa Rica</span>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Tarjeta de Soporte Técnico -->
            <div class="card-perfil p-0 mb-4 overflow-hidden border" style="box-shadow: var(--card-shadow); border-color: var(--input-border) !important;">
                <div class="p-3 border-bottom d-flex align-items-center" style="background: var(--bg-color);">
                    <div class="me-3 flex-shrink-0 d-flex align-items-center justify-content-center text-white rounded-circle shadow-sm" style="width: 45px; height: 45px; background: var(--cat-orange);">
                        <i class="bi bi-tools fs-5"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-0" style="color: var(--cat-orange);">Soporte Técnico de la App</h6>
                        <small class="text-muted fw-bold">Problemas con esta app</small>
                    </div>
                </div>
                <div class="p-3" style="background: var(--white);">
                    <div class="d-flex align-items-center mb-3">
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 40px; height: 40px; background: rgba(160, 174, 192, 0.1);">
                            <i class="bi bi-person-badge-fill fs-5 text-muted"></i>
                        </div>
                        <div class="overflow-hidden">
                            <strong class="d-block text-dark small">Desarrollador</strong>
                            <span class="text-muted small text-truncate">Kenneth Ruiz Matamoros</span>
                        </div>
                    </div>
                    
                    <a href="https://wa.me/50686227500" target="_blank" class="d-flex align-items-center mb-3 text-decoration-none">
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 40px; height: 40px; background: rgba(37, 211, 102, 0.1);">
                            <i class="bi bi-whatsapp fs-5" style="color: #25D366;"></i>
                        </div>
                        <div class="overflow-hidden">
                            <strong class="d-block text-dark small">Teléfono / WhatsApp</strong>
                            <span class="text-muted small text-truncate">+506 8622 7500</span>
                        </div>
                    </a>
                    
                    <a href="mailto:lthikingcr@gmail.com" class="d-flex align-items-center mb-3 text-decoration-none">
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 40px; height: 40px; background: rgba(234, 67, 53, 0.1);">
                            <i class="bi bi-envelope-fill fs-5" style="color: #ea4335;"></i>
                        </div>
                        <div class="overflow-hidden">
                            <strong class="d-block text-dark small">Correo Electrónico</strong>
                            <span class="text-muted small text-truncate">lthikingcr@gmail.com</span>
                        </div>
                    </a>
                    
                    <!-- Sección Colapsable Acerca del Desarrollo -->
                    <div class="mt-4 pt-3 border-top">
                        <button class="btn btn-sm shadow-sm w-100 py-2 d-flex align-items-center justify-content-center" 
                                onclick="window.toggleInfoTribu()" 
                                style="background: var(--input-bg); color: var(--text-dark); border-radius: 1rem; font-weight: bold; border: 1px solid var(--input-border);">
                            <i id="info-tribu-icon" class="bi bi-info-circle-fill me-2" style="color: var(--teal-main);"></i> 
                            Acerca del Desarrollo
                        </button>
                        
                        <div id="info-tribu-desarrollo" class="d-none mt-3 p-3 rounded shadow-inner" style="background: var(--bg-color); border: 1px dashed var(--input-border);">
                            <p class="small text-dark mb-3" style="line-height: 1.6; text-align: justify; font-weight: 600;">
                                Esta aplicación fue desarrollada por la iniciativa y colaboración de la comunidad de <strong class="text-teal">La Tribu de Los Libres</strong>. Esta agrupación tuvo la dicha de realizar 2 veces el Camino de Costa Rica con una comunidad bastante alegre y unida, ya tuvimos nuestro cierre. Pero no por ello dejamos de apoyar esta iniciativa y excelente actividad de El Camino de Costa Rica.
                            </p>
                            <a href="https://www.latribu.top" target="_blank" class="fw-bold px-4 py-2 w-100 text-center" style="background: var(--white); border-radius: 0.8rem; border: 1px solid var(--input-border); color: var(--text-dark); text-decoration: none; display: inline-block; font-size: 0.85rem;">
                                <i class="bi bi-globe me-2 text-teal"></i>www.latribu.top
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
`;