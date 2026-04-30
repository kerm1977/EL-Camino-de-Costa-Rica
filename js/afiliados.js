// ==========================================
// MÓDULO: AFILIADOS (Grupos y Emprendimientos)
// Archivo: js/afiliados.js
// Contiene la lógica y HTML compartido entre Registro y Perfil
// ==========================================

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
            <input type="text" id="${id}-input" class="form-control custom-input mt-2 d-none profile-input" placeholder="Ingresa datos o URL de ${red}">
        </div>`;
    });
    
    html += `
        <div class="field-container d-flex gap-2 mt-3">
            <button class="btn btn-sm btn-teal w-50" style="font-size: 0.7rem;" type="button"><i class="bi bi-whatsapp me-1"></i>Contactar WA Registrado</button>
            <button class="btn btn-sm btn-teal w-50" style="font-size: 0.7rem;" type="button"><i class="bi bi-envelope-fill me-1"></i>Contactar por Email</button>
        </div>
    `;
    return html;
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
        <div id="section-grupo-${prefix}">
            <div class="field-container d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-people-fill me-2"></i>Anunciar Grupo</h6>
                <div class="form-check form-switch m-0"><input class="form-check-input profile-input" type="checkbox" id="${prefix}-switch-grupo" onchange="window.toggleSection('${prefix}-form-grupo', this.checked)"></div>
            </div>
            
            <div id="${prefix}-form-grupo" class="d-none mt-3 mb-4">
                <div class="field-container mb-2"><input type="text" id="${prefix}-g-op" class="form-control custom-input profile-input" placeholder="Nombre del Operador"></div>
                <div class="field-container mb-2"><input type="text" id="${prefix}-g-coord" class="form-control custom-input profile-input" placeholder="Nombre del Coordinador o Encargado"></div>
                
                <div class="field-container mb-2">
                    <label class="small text-muted fw-bold ms-1 mt-2">Ubicación</label>
                    <select id="${prefix}-g-prov" class="form-select custom-input profile-input" style="appearance: none;">
                        <option value="">Selecciona Provincia</option>
                        <option value="San José">San José</option><option value="Alajuela">Alajuela</option><option value="Cartago">Cartago</option>
                        <option value="Heredia">Heredia</option><option value="Guanacaste">Guanacaste</option><option value="Puntarenas">Puntarenas</option><option value="Limón">Limón</option>
                    </select>
                </div>

                <div class="field-container mb-2"><label class="small text-muted fw-bold ms-1 mt-2">Logotipos y Certificados</label><input type="file" id="${prefix}-g-logo" class="form-control custom-input profile-input" accept="image/*" title="Agrega tu Logo"></div>
                <div class="field-container mb-2"><input type="file" id="${prefix}-g-cert" class="form-control custom-input profile-input" accept="application/pdf,image/*" title="Agrega tu Certificado"></div>

                <div class="field-container mb-2">
                    <label class="small text-muted fw-bold ms-1 mt-2">Opciones de Servicio</label>
                    <div class="d-flex gap-3 flex-wrap mb-2">
                        <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${prefix}-g-ext"><label class="form-check-label small fw-bold" for="${prefix}-g-ext">Atención a Extranjeros</label></div>
                        <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${prefix}-g-ind"><label class="form-check-label small fw-bold" for="${prefix}-g-ind">Atención Individual</label></div>
                        <div class="form-check"><input class="form-check-input profile-input" type="checkbox" id="${prefix}-g-full"><label class="form-check-label small fw-bold" for="${prefix}-g-full">Servicio Completo</label></div>
                    </div>
                </div>

                <div class="field-container row g-2 mb-3">
                    <div class="col-6"><input type="tel" id="${prefix}-g-tellocal" class="form-control custom-input profile-input" placeholder="Teléfono Local"></div>
                    <div class="col-6"><input type="tel" id="${prefix}-g-celular" class="form-control custom-input profile-input" placeholder="Celular"></div>
                </div>

                <h6 class="fw-bold text-muted mt-3 mb-2 small">Comunicación (Activadores)</h6>
                ${window.generarActivadoresHTML(prefix + '-g')}
            </div>
        </div>
    `;
};

window.generarSeccionEmprendimiento = function(prefix) {
    return `
        <div id="section-emp-${prefix}">
            <div class="field-container d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0 text-teal"><i class="bi bi-shop me-2"></i>Anunciar Emprendimiento</h6>
                <div class="form-check form-switch m-0"><input class="form-check-input profile-input" type="checkbox" id="${prefix}-switch-emp" onchange="window.toggleSection('${prefix}-form-emp', this.checked)"></div>
            </div>
            
            <div id="${prefix}-form-emp" class="d-none mt-3 mb-2">
                <div class="field-container mb-2"><input type="text" id="${prefix}-emp-nombre" class="form-control custom-input profile-input" placeholder="Nombre del Emprendimiento"></div>
                <div class="field-container mb-2"><input type="text" id="${prefix}-emp-cont" class="form-control custom-input profile-input" placeholder="Nombre del Contacto"></div>
                
                <div class="field-container mb-2"><label class="small text-muted fw-bold ms-1 mt-2">Imagen del Comercio</label><input type="file" id="${prefix}-emp-img" class="form-control custom-input profile-input" accept="image/*"></div>
                
                <div class="field-container form-check form-switch mb-2 mt-3">
                    <input class="form-check-input profile-input" type="checkbox" id="${prefix}-emp-sello" onchange="window.toggleSection('${prefix}-emp-sello-input', this.checked)">
                    <label class="form-check-label small fw-bold" for="${prefix}-emp-sello">¿Tienes Sello?</label>
                </div>
                <div class="field-container mb-2"><input type="file" id="${prefix}-emp-sello-input" class="form-control custom-input d-none profile-input" accept="image/*" title="Imagen del Sello"></div>

                <div class="field-container mb-2">
                    <label class="small text-muted fw-bold ms-1 mt-2">Etapa</label>
                    <select id="${prefix}-emp-etapa" class="form-select custom-input profile-input" style="appearance: none;">
                        <option value="">Selecciona Etapa</option>
                        <option value="Etapa 1a">Etapa 1a</option>
                        <option value="Etapa 1b">Etapa 1b</option>
                        <option value="Etapa 2">Etapa 2</option>
                        <option value="Etapa 3">Etapa 3</option>
                        <option value="Etapa 4">Etapa 4</option>
                        <option value="Etapa 5">Etapa 5</option>
                        <option value="Etapa 6">Etapa 6</option>
                        <option value="Etapa 7">Etapa 7</option>
                        <option value="Etapa 8">Etapa 8</option>
                        <option value="Etapa 9">Etapa 9</option>
                        <option value="Etapa 10">Etapa 10</option>
                        <option value="Etapa 11">Etapa 11</option>
                        <option value="Etapa 12">Etapa 12</option>
                        <option value="Etapa 13">Etapa 13</option>
                        <option value="Etapa 14">Etapa 14</option>
                        <option value="Etapa 15">Etapa 15</option>
                        <option value="Etapa 16">Etapa 16</option>
                    </select>
                </div>
                
                <div class="field-container mb-2"><input type="tel" id="${prefix}-emp-tel" class="form-control custom-input profile-input" placeholder="Teléfono (+506...)"></div>
                <div class="field-container mb-2"><input type="text" id="${prefix}-emp-horario" class="form-control custom-input profile-input" placeholder="Horario (Ej. L-V 8am - 5pm)"></div>

                <div class="field-container mb-2">
                    <label class="small text-muted fw-bold ms-1 mt-2">Tipo de Servicio</label>
                    <select id="${prefix}-emp-tipo" class="form-select custom-input profile-input" onchange="window.checkOtroServicioAfiliado(this, '${prefix}-emp-tipo-otro')" style="appearance: none;">
                        <option value="Restaurante">Restaurante</option>
                        <option value="Soda">Soda</option>
                        <option value="Pulpería / Abastecedor">Pulpería / Abastecedor</option>
                        <option value="Hostal">Hostal</option>
                        <option value="Estadía">Estadía</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Casa Hospedaje">Casa Hospedaje</option>
                        <option value="Apicultura">Apicultura</option>
                        <option value="Transporte Terrestre">Transporte Terrestre</option>
                        <option value="Transporte Acuatico">Transporte Acuatico</option>
                        <option value="Acarreo">Acarreo</option>
                        <option value="Guía Local">Guía Local</option>
                        <option value="Asociación">Asociación</option>
                        <option value="Museo">Museo</option>
                        <option value="Zona de Camping">Zona de Camping</option>
                        <option value="Otros">Otros</option>
                    </select>
                </div>
                <div class="field-container mb-2"><input type="text" id="${prefix}-emp-tipo-otro" class="form-control custom-input d-none profile-input" placeholder="Especificar otro servicio"></div>

                <h6 class="fw-bold text-muted mt-3 mb-2 small">Comunicación (Activadores)</h6>
                ${window.generarActivadoresHTML(prefix + '-e')}
            </div>
        </div>
    `;
};