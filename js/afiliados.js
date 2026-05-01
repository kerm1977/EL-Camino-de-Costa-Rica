// ==========================================
// MÓDULO: AFILIADOS (Grupos y Emprendimientos)
// Archivo: js/afiliados.js
// Contiene la lógica y HTML compartido entre Registro y Perfil
// ==========================================

// Función global para manejar acordeones de edición
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

// Función global para manejar exclusión mutua entre Grupo y Emprendimiento
window.handleMutuallyExclusiveToggle = function(currentSwitchId, otherSwitchId, otherWrapperId, currentBodyId, currentIconId) {
    const currentSwitch = document.getElementById(currentSwitchId);
    const otherSwitch = document.getElementById(otherSwitchId);
    const otherWrapper = document.getElementById(otherWrapperId);
    const currentBody = document.getElementById(currentBodyId);
    const currentIcon = document.getElementById(currentIconId);
    
    if (currentSwitch && currentSwitch.checked) {
        if(currentBody) currentBody.classList.remove('d-none');
        if(currentIcon) currentIcon.classList.replace('bi-chevron-down', 'bi-chevron-up');
        
        if (otherSwitch) otherSwitch.checked = false;
        if (otherWrapper) otherWrapper.classList.add('d-none');
    } else {
        if(currentBody) currentBody.classList.add('d-none');
        if(currentIcon) currentIcon.classList.replace('bi-chevron-up', 'bi-chevron-down');
        
        if (otherWrapper) otherWrapper.classList.remove('d-none');
    }
};

window.generarActivadoresHTML = function(prefix) {
    const redes = ['WhatsApp', 'Signal', 'Email', 'Facebook', 'Instagram', 'TikTok', 'Telegram', 'URL Waze', 'URL Google Maps'];
    let html = '';
    redes.forEach((red, i) => {
        const id = `${prefix}-act-${i}`;
        html += `
        <div class="field-container mb-2 p-2" style="background: var(--input-bg); border-radius: 1rem;">
            <div class="form-check form-switch m-0 d-flex justify-content-between align-items-center">
                <label class="form-check-label small fw-bold m-0" for="${id}">${red}</label>
                <input class="form-check-input m-0 profile-input" type="checkbox" id="${id}" onchange="window.toggleSection('${id}-input', this.checked)">
            </div>
            <input type="text" id="${id}-input" class="form-control custom-input mt-2 d-none profile-input" placeholder="Ingresa URL o Usuario">
        </div>`;
    });
    return html; 
};

window.generarIdiomasHTML = function(idPrefix) {
    return `
    <div id="${idPrefix}-idiomas-container" class="d-none mt-2 mb-3 p-3 shadow-sm border" style="background: var(--bg-color); border-radius: 1rem; border-color: var(--input-border) !important;">
        <label class="small text-teal fw-bold mb-2 d-block"><i class="bi bi-translate me-1"></i>Idiomas Soportados</label>
        <div class="d-flex gap-3 flex-wrap">
            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${idPrefix}-lang-es"><label class="form-check-label small fw-bold" for="${idPrefix}-lang-es">🇨🇷 Español</label></div>
            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${idPrefix}-lang-en"><label class="form-check-label small fw-bold" for="${idPrefix}-lang-en">🇺🇸 Inglés</label></div>
            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${idPrefix}-lang-de"><label class="form-check-label small fw-bold" for="${idPrefix}-lang-de">🇩🇪 Alemán</label></div>
            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${idPrefix}-lang-it"><label class="form-check-label small fw-bold" for="${idPrefix}-lang-it">🇮🇹 Italiano</label></div>
            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${idPrefix}-lang-fr"><label class="form-check-label small fw-bold" for="${idPrefix}-lang-fr">🇫🇷 Francés</label></div>
            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${idPrefix}-lang-pt"><label class="form-check-label small fw-bold" for="${idPrefix}-lang-pt">🇧🇷 Portugués</label></div>
            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${idPrefix}-lang-zh"><label class="form-check-label small fw-bold" for="${idPrefix}-lang-zh">🇨🇳 Mandarín</label></div>
        </div>
    </div>
    `;
};

window.generarEditorNota = function(id) {
    return `
    <div class="border rounded mb-3 overflow-hidden" style="border-color: var(--input-border) !important;">
        <div class="p-3 d-flex justify-content-between align-items-center" style="cursor:pointer; background: var(--white);" onclick="window.toggleEditSection('${id}-col', '${id}-icon')">
            <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-card-text me-2"></i>Nota / Descripción Detallada</h6>
            <i class="bi bi-chevron-down text-teal" id="${id}-icon"></i>
        </div>
        <div id="${id}-col" class="p-3 pt-0 border-top d-none" style="background: var(--white); border-color: var(--input-border) !important;">
            <div class="border rounded" style="border-color: var(--input-border) !important; background: var(--input-bg);">
                <div class="d-flex gap-1 p-1 border-bottom" style="border-color: var(--input-border) !important;">
                    <button type="button" class="btn btn-sm btn-light py-0 px-2 shadow-sm" onclick="document.execCommand('bold',false,null)"><b>B</b></button>
                    <button type="button" class="btn btn-sm btn-light py-0 px-2 shadow-sm" onclick="document.execCommand('italic',false,null)"><i>I</i></button>
                    <button type="button" class="btn btn-sm btn-light py-0 px-2 shadow-sm" onclick="document.execCommand('underline',false,null)"><u>U</u></button>
                    <button type="button" class="btn btn-sm btn-light py-0 px-2 shadow-sm" onclick="document.execCommand('strikeThrough',false,null)"><s>S</s></button>
                </div>
                <div id="${id}" class="p-2 custom-input profile-input profile-rich-text" contenteditable="true" style="min-height: 120px; outline: none; border: none; background: transparent; font-weight: normal;"></div>
            </div>
        </div>
    </div>`;
};

window.checkOtroServicioAfiliado = function(selectEl, targetId) {
    const inputOtro = document.getElementById(targetId);
    if(inputOtro) {
        if(selectEl.value === 'Otros') { inputOtro.classList.remove('d-none'); } 
        else { inputOtro.classList.add('d-none'); }
    }
};

window.generarSeccionGrupo = function(prefix) {
    return `
        <div id="wrapper-grupo-${prefix}" class="card-perfil p-0 mb-3 overflow-hidden">
            <div class="p-3 d-flex justify-content-between align-items-center" style="background: var(--white);">
                <div class="d-flex align-items-center flex-grow-1" style="cursor:pointer;" onclick="window.toggleEditSection('${prefix}-form-grupo-body', '${prefix}-grupo-icon')">
                    <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-people-fill me-2"></i>Anunciar Grupo</h6>
                    <i class="bi bi-chevron-down text-teal ms-2" id="${prefix}-grupo-icon"></i>
                </div>
                <div class="form-check form-switch m-0">
                    <input class="form-check-input profile-input" type="checkbox" id="${prefix}-switch-grupo" onchange="window.handleMutuallyExclusiveToggle('${prefix}-switch-grupo', '${prefix}-switch-emp', 'wrapper-emp-${prefix}', '${prefix}-form-grupo-body', '${prefix}-grupo-icon')">
                </div>
            </div>
            
            <div id="${prefix}-form-grupo-body" class="p-3 pt-0 border-top d-none" style="background: var(--white); border-color: var(--input-border) !important;">
                <div class="field-container mb-2"><input type="text" id="${prefix}-g-op" class="form-control custom-input profile-input" placeholder="Nombre del Operador"></div>
                <div class="field-container mb-2"><input type="text" id="${prefix}-g-coord" class="form-control custom-input profile-input" placeholder="Nombre del Coordinador o Encargado"></div>
                
                <div class="field-container mb-3">
                    <label class="small text-muted fw-bold ms-1 mt-2">Ubicación</label>
                    <select id="${prefix}-g-prov" class="form-select custom-input profile-input" style="appearance: none;">
                        <option value="">Selecciona Provincia</option>
                        <option value="San José">San José</option><option value="Alajuela">Alajuela</option><option value="Cartago">Cartago</option>
                        <option value="Heredia">Heredia</option><option value="Guanacaste">Guanacaste</option><option value="Puntarenas">Puntarenas</option><option value="Limón">Limón</option>
                    </select>
                </div>

                <div class="field-container mb-2 mt-3">
                    <label class="small text-teal fw-bold ms-1 mb-1 d-block"><i class="bi bi-image me-1"></i>Logotipo del Grupo (Soporta 500kb max.)</label>
                    <input type="file" id="${prefix}-g-logo" class="form-control custom-input profile-input mb-1" accept="image/*">
                </div>
                <div class="field-container mb-3 mt-3">
                    <label class="small text-teal fw-bold ms-1 mb-1 d-block"><i class="bi bi-file-earmark-pdf me-1"></i>Certificado (PDF o Imagen - Soporta 500kb max.)</label>
                    <input type="file" id="${prefix}-g-cert" class="form-control custom-input profile-input mb-1" accept="application/pdf,image/*">
                </div>

                ${window.generarEditorNota(prefix + '-g-nota')}

                <div class="border rounded mb-3 overflow-hidden" style="border-color: var(--input-border) !important;">
                    <div class="p-3 d-flex justify-content-between align-items-center" style="cursor:pointer; background: var(--white);" onclick="window.toggleEditSection('${prefix}-opciones-g-col', '${prefix}-opciones-g-icon')">
                        <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-gear-fill me-2"></i>Opciones de Servicio</h6>
                        <i class="bi bi-chevron-down text-teal" id="${prefix}-opciones-g-icon"></i>
                    </div>
                    <div id="${prefix}-opciones-g-col" class="p-3 pt-0 border-top d-none" style="background: var(--white); border-color: var(--input-border) !important;">
                        <div class="d-flex gap-3 flex-wrap mb-2">
                            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${prefix}-g-ext" onchange="window.toggleSection('${prefix}-g-idiomas-container', this.checked)"><label class="form-check-label small fw-bold" for="${prefix}-g-ext">Atención a Turistas / Extranjeros</label></div>
                            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${prefix}-g-ind"><label class="form-check-label small fw-bold" for="${prefix}-g-ind">Atención Individual</label></div>
                            <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${prefix}-g-full"><label class="form-check-label small fw-bold" for="${prefix}-g-full">Servicio Completo</label></div>
                        </div>
                        ${window.generarIdiomasHTML(prefix + '-g')}
                    </div>
                </div>

                <div class="border rounded mb-3 overflow-hidden" style="border-color: var(--input-border) !important;">
                    <div class="p-3 d-flex justify-content-between align-items-center" style="cursor:pointer; background: var(--white);" onclick="window.toggleEditSection('${prefix}-activadores-g-col', '${prefix}-activadores-g-icon')">
                        <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-link-45deg me-2"></i>Comunicación (Activadores)</h6>
                        <i class="bi bi-chevron-down text-teal" id="${prefix}-activadores-g-icon"></i>
                    </div>
                    <div id="${prefix}-activadores-g-col" class="p-3 pt-0 border-top d-none" style="background: var(--white); border-color: var(--input-border) !important;">
                        <div class="row g-2 mb-3 mt-2">
                            <div class="col-6"><input type="tel" id="${prefix}-g-tellocal" class="form-control custom-input profile-input" placeholder="Teléfono Local"></div>
                            <div class="col-6"><input type="tel" id="${prefix}-g-celular" class="form-control custom-input profile-input" placeholder="Celular"></div>
                        </div>
                        ${window.generarActivadoresHTML(prefix + '-g')}
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.generarSeccionEmprendimiento = function(prefix) {
    return `
        <div id="wrapper-emp-${prefix}" class="card-perfil p-0 mb-3 overflow-hidden">
            <div class="p-3 d-flex justify-content-between align-items-center" style="background: var(--white);">
                <div class="d-flex align-items-center flex-grow-1" style="cursor:pointer;" onclick="window.toggleEditSection('${prefix}-form-emp-body', '${prefix}-emp-icon')">
                    <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-shop me-2"></i>Anunciar Emprendimiento</h6>
                    <i class="bi bi-chevron-down text-teal ms-2" id="${prefix}-emp-icon"></i>
                </div>
                <div class="form-check form-switch m-0">
                    <input class="form-check-input profile-input" type="checkbox" id="${prefix}-switch-emp" onchange="window.handleMutuallyExclusiveToggle('${prefix}-switch-emp', '${prefix}-switch-grupo', 'wrapper-grupo-${prefix}', '${prefix}-form-emp-body', '${prefix}-emp-icon')">
                </div>
            </div>
            
            <div id="${prefix}-form-emp-body" class="p-3 pt-0 border-top d-none" style="background: var(--white); border-color: var(--input-border) !important;">
                <div class="field-container mb-2"><input type="text" id="${prefix}-emp-nombre" class="form-control custom-input profile-input" placeholder="Nombre del Emprendimiento"></div>
                <div class="field-container mb-2"><input type="text" id="${prefix}-emp-cont" class="form-control custom-input profile-input" placeholder="Nombre del Contacto"></div>
                
                <div class="field-container mb-2 mt-3">
                    <label class="small text-teal fw-bold ms-1 mb-1 d-block"><i class="bi bi-image me-1"></i>Imagen del Comercio / Logo (Soporta 500kb max.)</label>
                    <input type="file" id="${prefix}-emp-img" class="form-control custom-input profile-input mb-1" accept="image/*">
                </div>
                
                <div class="field-container form-check form-switch mb-2 mt-3">
                    <input class="form-check-input profile-input" type="checkbox" id="${prefix}-emp-sello" onchange="window.toggleSection('${prefix}-emp-sello-input', this.checked)">
                    <label class="form-check-label small fw-bold" for="${prefix}-emp-sello">¿Tienes Sello de Certificación?</label>
                </div>
                <div class="field-container mb-3">
                    <input type="file" id="${prefix}-emp-sello-input" class="form-control custom-input d-none profile-input mb-1" accept="image/*" title="Imagen del Sello">
                </div>

                ${window.generarEditorNota(prefix + '-emp-nota')}

                <div class="border rounded mb-3 overflow-hidden" style="border-color: var(--input-border) !important;">
                    <div class="p-3 d-flex justify-content-between align-items-center" style="cursor:pointer; background: var(--white);" onclick="window.toggleEditSection('${prefix}-opciones-e-col', '${prefix}-opciones-e-icon')">
                        <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-gear-fill me-2"></i>Opciones de Servicio</h6>
                        <i class="bi bi-chevron-down text-teal" id="${prefix}-opciones-e-icon"></i>
                    </div>
                    <div id="${prefix}-opciones-e-col" class="p-3 pt-0 border-top d-none" style="background: var(--white); border-color: var(--input-border) !important;">
                        <div class="form-check form-switch mb-2 mt-2">
                            <input class="form-check-input profile-input" type="checkbox" id="${prefix}-emp-ext" onchange="window.toggleSection('${prefix}-emp-idiomas-container', this.checked)">
                            <label class="form-check-label small fw-bold" for="${prefix}-emp-ext">¿Atención a Turistas / Extranjeros?</label>
                        </div>
                        ${window.generarIdiomasHTML(prefix + '-emp')}
                        
                        <label class="small text-muted fw-bold ms-1 mt-2">Etapa</label>
                        <select id="${prefix}-emp-etapa" class="form-select custom-input profile-input mb-2" style="appearance: none;">
                            <option value="">Selecciona Etapa</option>
                            <option value="Etapa 1a">Etapa 1a</option><option value="Etapa 1b">Etapa 1b</option>
                            <option value="Etapa 2">Etapa 2</option><option value="Etapa 3">Etapa 3</option>
                            <option value="Etapa 4">Etapa 4</option><option value="Etapa 5">Etapa 5</option>
                            <option value="Etapa 6">Etapa 6</option><option value="Etapa 7">Etapa 7</option>
                            <option value="Etapa 8">Etapa 8</option><option value="Etapa 9">Etapa 9</option>
                            <option value="Etapa 10">Etapa 10</option><option value="Etapa 11">Etapa 11</option>
                            <option value="Etapa 12">Etapa 12</option><option value="Etapa 13">Etapa 13</option>
                            <option value="Etapa 14">Etapa 14</option><option value="Etapa 15">Etapa 15</option>
                            <option value="Etapa 16">Etapa 16</option>
                        </select>

                        <label class="small text-muted fw-bold ms-1 mt-2">Tipo de Servicio</label>
                        <select id="${prefix}-emp-tipo" class="form-select custom-input profile-input mb-2" onchange="window.checkOtroServicioAfiliado(this, '${prefix}-emp-tipo-otro')" style="appearance: none;">
                            <option value="Restaurante">Restaurante</option><option value="Soda">Soda</option><option value="Pulpería">Pulpería</option>
                            <option value="Hostal">Hostal</option><option value="Estadía">Estadía</option><option value="Hotel">Hotel</option>
                            <option value="Casa Hospedaje">Casa Hospedaje</option><option value="Apicultura">Apicultura</option>
                            <option value="Transporte Terrestre">Transporte Terrestre</option><option value="Transporte Acuatico">Transporte Acuatico</option>
                            <option value="Acarreo">Acarreo</option><option value="Guía Local">Guía Local</option><option value="Asociación">Asociación</option>
                            <option value="Museo">Museo</option><option value="Zona de Camping">Zona de Camping</option>
                            <option value="Otros">Otros</option>
                        </select>
                        <input type="text" id="${prefix}-emp-tipo-otro" class="form-control custom-input d-none profile-input mb-2" placeholder="Especificar otro servicio">
                    </div>
                </div>

                <div class="border rounded mb-3 overflow-hidden" style="border-color: var(--input-border) !important;">
                    <div class="p-3 d-flex justify-content-between align-items-center" style="cursor:pointer; background: var(--white);" onclick="window.toggleEditSection('${prefix}-activadores-e-col', '${prefix}-activadores-e-icon')">
                        <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-link-45deg me-2"></i>Comunicación (Activadores)</h6>
                        <i class="bi bi-chevron-down text-teal" id="${prefix}-activadores-e-icon"></i>
                    </div>
                    <div id="${prefix}-activadores-e-col" class="p-3 pt-0 border-top d-none" style="background: var(--white); border-color: var(--input-border) !important;">
                        <input type="tel" id="${prefix}-emp-tel" class="form-control custom-input profile-input mb-2 mt-2" placeholder="Teléfono (+506...)">
                        <input type="text" id="${prefix}-emp-horario" class="form-control custom-input profile-input mb-3" placeholder="Horario (Ej. L-V 8am - 5pm)">
                        ${window.generarActivadoresHTML(prefix + '-e')}
                    </div>
                </div>
            </div>
        </div>
    `;
};