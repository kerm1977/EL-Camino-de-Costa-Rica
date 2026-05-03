// ==========================================
// MÓDULO: PERFIL UI (Controladores de Interfaz)
// Archivo: js/perfil_ui.js
// Responsabilidad: Cambio de modos (Lectura/Edición), Acordeones y Vistas Dinámicas
// ==========================================

window.toggleEditMode = function() {
    window.isEditingProfile = !window.isEditingProfile;
    if(typeof window.renderEditModeState === 'function') {
        window.renderEditModeState();
    }
};

window.renderEditModeState = function() {
    const cardView = document.getElementById('profile-card-view');
    const editView = document.getElementById('profile-edit-view');
    const settingsView = document.getElementById('session-settings-view');

    if (window.isEditingProfile) {
        if(cardView) cardView.classList.add('d-none');
        if(settingsView) settingsView.classList.add('d-none');
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
        
        // --- PREVISUALIZACIÓN, ELIMINAR ARCHIVOS Y LANZAMIENTO DEL EDITOR DE IMÁGENES ---
        const fileFields = ['perf-g-logo', 'perf-g-cert', 'perf-emp-img', 'perf-emp-sello-input'];
        fileFields.forEach(id => {
            const input = document.getElementById(id);
            if (input && input.parentElement) {
                
                // 1. Contenedor de Preview
                let preview = document.getElementById('preview-' + id);
                if (!preview) {
                    preview = document.createElement('div');
                    preview.id = 'preview-' + id;
                    preview.className = 'mb-2 text-center module-fade-in';
                    input.parentElement.insertBefore(preview, input);
                }
                
                const fileData = window.currentProfileData[id];
                if (fileData) {
                    const isDocument = (id === 'perf-g-cert' || id === 'perf-emp-sello-input');
                    
                    if (fileData.startsWith('data:application/pdf')) {
                        preview.innerHTML = `<iframe src="${fileData}" style="width:100%; height:120px; border:1px solid var(--input-border); border-radius:0.5rem; background:white;"></iframe>`;
                        preview.onclick = null; // Los PDF no se re-editan visualmente
                    } else if (isDocument) {
                        // VISTA PREVIA PARA CERTIFICADOS: Respeta 100% la proporción original sin forzar a cuadrado
                        preview.innerHTML = `
                            <div class="position-relative d-inline-block">
                                <img src="${fileData}" style="max-height: 120px; max-width:100%; border-radius: 0.5rem; object-fit: contain; border: 1px solid var(--input-border); padding:2px; background: white;">
                            </div>
                        `;
                        preview.onclick = null; // Los documentos no se recortan
                    } else {
                        // VISTA PREVIA PARA LOGOS: Se muestran redondos y permiten re-editar (crop cuadrado)
                        preview.innerHTML = `
                            <div class="position-relative d-inline-block" style="cursor: pointer;" title="Haz clic para reajustar imagen">
                                <img src="${fileData}" style="width: 85px; height: 85px; border-radius: 50%; object-fit: cover; border: 2px solid var(--input-border); padding:2px; background: white;">
                                <div class="position-absolute bottom-0 end-0 bg-teal text-white rounded-circle d-flex align-items-center justify-content-center shadow" style="width: 24px; height: 24px; transform: translate(10%, 10%);">
                                    <i class="bi bi-pencil-fill" style="font-size: 0.7rem;"></i>
                                </div>
                            </div>
                        `;
                        
                        // Re-empaquetamos el Base64 a File para mandarlo al ImageEditor al hacer clic
                        preview.onclick = function() {
                            if (window.ImageEditor) {
                                try {
                                    const arr = fileData.split(',');
                                    const mime = arr[0].match(/:(.*?);/)[1];
                                    const bstr = atob(arr[1]);
                                    let n = bstr.length;
                                    const u8arr = new Uint8Array(n);
                                    while (n--) {
                                        u8arr[n] = bstr.charCodeAt(n);
                                    }
                                    const file = new File([u8arr], "imagen_guardada.jpg", { type: mime });
                                    
                                    window.ImageEditor.open(file, (finalBase64) => {
                                        window.currentProfileData[id] = finalBase64;
                                        window.renderEditModeState(); // Recargar vista
                                    });
                                } catch(e) {
                                    console.error("Error al reabrir la imagen:", e);
                                    if(typeof window.showSysAlert === 'function') window.showSysAlert('warning', 'Error', 'No se pudo abrir la imagen guardada.');
                                }
                            }
                        };
                    }
                    preview.style.display = 'block';
                } else {
                    preview.style.display = 'none';
                    preview.innerHTML = '';
                    preview.onclick = null;
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
                            window.showSysAlert('info', 'Archivo Quitado', 'Se quitó de la vista. Haz clic en "Guardar" para aplicarlo.');
                        }
                    };
                    input.parentElement.appendChild(delBtn);
                }
                
                const delBtn = document.getElementById('del-btn-' + id);
                if(delBtn) delBtn.style.display = fileData ? 'block' : 'none';

                // 3. EVENTO PARA LANZAR EDITOR (Si es un archivo NUEVO seleccionado)
                if (!input.dataset.editorBound) {
                    input.dataset.editorBound = 'true';
                    input.addEventListener('change', function(e) {
                        const file = e.target.files[0];
                        if (!file) return;

                        const isDocument = (id === 'perf-g-cert' || id === 'perf-emp-sello-input');

                        // Si es imagen, NO es certificado y tenemos el editor disponible (Usa herramienta de Crop Cuadrado)
                        if (file.type.startsWith('image/') && window.ImageEditor && !isDocument) {
                            window.ImageEditor.open(file, (finalBase64) => {
                                window.currentProfileData[id] = finalBase64;
                                input.value = ""; // Limpiar el input file
                                window.renderEditModeState(); // Recargar previas
                            });
                        } else {
                            // Si es PDF o CERTIFICADO (Se salta el editor y usa su tamaño original)
                            if(typeof window.getBase64 === 'function') {
                                window.getBase64(file).then(b64 => {
                                    window.currentProfileData[id] = b64;
                                    input.value = "";
                                    window.renderEditModeState();
                                }).catch(err => {
                                    if(typeof window.showSysAlert === 'function') window.showSysAlert('warning', 'Aviso', err.message);
                                    input.value = "";
                                });
                            }
                        }
                    });
                }
            }
        });

    } else {
        if(editView) editView.classList.add('d-none');
        if(cardView) {
            cardView.classList.remove('d-none');
            if(typeof window.updateProfileCardView === 'function') window.updateProfileCardView(); 
        }
        if(settingsView) settingsView.classList.remove('d-none');
        
        const btnWa = document.getElementById('floating-wa-btn');
        if(btnWa) btnWa.classList.remove('d-none');
    }
};

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

window.buildCollapsibleSection = function(id, title, iconClass, innerHtml) {
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