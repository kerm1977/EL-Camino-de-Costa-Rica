// ==========================================
// MÓDULO: IMAGE EDITOR (Ajuste de Imágenes)
// Archivo: js/image_editor.js
// Responsabilidad: Zoom y desplazamiento (Pan X, Y) de imágenes antes de guardarlas
// ==========================================

window.ImageEditor = {
    modalId: 'imageEditorModal',
    callback: null,
    img: null,
    canvasSize: 300, // Tamaño del lienzo en la UI
    exportSize: 800, // Tamaño de alta calidad final
    scale: 1,
    panX: 0,
    panY: 0,

    init() {
        if (document.getElementById(this.modalId)) return;
        
        // Estilos para los sliders integrados en tiempo de ejecución
        const style = document.createElement('style');
        style.innerHTML = `
            .custom-range { width: 100%; height: 6px; background: var(--input-bg); border-radius: 5px; outline: none; -webkit-appearance: none; }
            .custom-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--teal-main); cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        `;
        document.head.appendChild(style);

        const html = `
            <div class="modal fade" id="${this.modalId}" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 1.5rem; border: none; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                        <div class="modal-header border-bottom-0 pb-0">
                            <h5 class="modal-title fw-bold text-teal"><i class="bi bi-crop me-2"></i>Ajustar Imagen</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center pt-3 pb-4">
                            <!-- Lienzo de visualización -->
                            <div style="width: ${this.canvasSize}px; height: ${this.canvasSize}px; margin: 0 auto; border: 2px dashed var(--teal-light); border-radius: 1rem; overflow: hidden; background: #f8f9fa;">
                                <canvas id="editorCanvas" width="${this.canvasSize}" height="${this.canvasSize}" style="cursor: move; touch-action: none;"></canvas>
                            </div>
                            
                            <!-- Controles -->
                            <div class="mt-4 text-start px-2">
                                <label class="small fw-bold mb-1" style="color: var(--text-dark);"><i class="bi bi-zoom-in me-1"></i>Aumentar (Zoom)</label>
                                <input type="range" class="custom-range" id="editorZoom" min="0.1" max="3" step="0.01" value="1">
                                
                                <label class="small fw-bold mb-1 mt-3" style="color: var(--text-dark);"><i class="bi bi-arrows-move me-1"></i>Desplazar Horizontal (X)</label>
                                <input type="range" class="custom-range" id="editorPanX" min="-500" max="500" step="1" value="0">
                                
                                <label class="small fw-bold mb-1 mt-3" style="color: var(--text-dark);"><i class="bi bi-arrows-expand me-1" style="transform: rotate(90deg); display: inline-block;"></i>Desplazar Vertical (Y)</label>
                                <input type="range" class="custom-range" id="editorPanY" min="-500" max="500" step="1" value="0">
                            </div>
                        </div>
                        <div class="modal-footer justify-content-center border-top-0 pt-0 pb-4">
                            <button type="button" class="btn btn-secondary px-4 py-2 fw-bold" data-bs-dismiss="modal" style="border-radius: 1rem;">Cancelar</button>
                            <button type="button" class="btn btn-teal px-4 py-2" onclick="window.ImageEditor.confirm()">Aplicar y Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        
        // Vincular los eventos de las barras deslizantes (sliders)
        document.getElementById('editorZoom').addEventListener('input', (e) => { this.scale = parseFloat(e.target.value); this.draw(); });
        document.getElementById('editorPanX').addEventListener('input', (e) => { this.panX = parseFloat(e.target.value); this.draw(); });
        document.getElementById('editorPanY').addEventListener('input', (e) => { this.panY = parseFloat(e.target.value); this.draw(); });

        // EXTRAS: Permitir arrastrar la imagen en el lienzo con el mouse o el dedo
        const cvs = document.getElementById('editorCanvas');
        let isDragging = false;
        let startX, startY;
        
        const startDrag = (x, y) => { isDragging = true; startX = x; startY = y; };
        const doDrag = (x, y) => {
            if(!isDragging) return;
            const dx = x - startX;
            const dy = y - startY;
            this.panX += dx;
            this.panY += dy;
            
            // Actualizar UI de los sliders
            document.getElementById('editorPanX').value = this.panX;
            document.getElementById('editorPanY').value = this.panY;
            
            startX = x; startY = y;
            this.draw();
        };
        const endDrag = () => { isDragging = false; };

        cvs.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
        cvs.addEventListener('mousemove', e => doDrag(e.clientX, e.clientY));
        cvs.addEventListener('mouseup', endDrag);
        cvs.addEventListener('mouseleave', endDrag);
        
        cvs.addEventListener('touchstart', e => { if(e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY); }, {passive: false});
        cvs.addEventListener('touchmove', e => { if(e.touches.length === 1) { e.preventDefault(); doDrag(e.touches[0].clientX, e.touches[0].clientY); } }, {passive: false});
        cvs.addEventListener('touchend', endDrag);
    },

    open(file, onConfirmCallback) {
        this.init();
        this.callback = onConfirmCallback;
        
        if (!file.type.startsWith('image/')) {
            if(typeof window.showSysAlert === 'function') window.showSysAlert('warning', 'Formato Inválido', 'Por favor selecciona una imagen válida.');
            return;
        }

        // Límite de seguridad 10MB para no colapsar el editor en la lectura inicial
        if (file.size > 10485760) {
            if(typeof window.showSysAlert === 'function') window.showSysAlert('warning', 'Archivo Inmenso', 'La imagen es demasiado pesada para el editor. Por favor comprímela primero.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.img = new Image();
            this.img.onload = () => {
                this.panX = 0;
                this.panY = 0;
                
                // Calcular escala ideal inicial para que la imagen "cubra" el lienzo
                const scaleX = this.canvasSize / this.img.width;
                const scaleY = this.canvasSize / this.img.height;
                this.scale = Math.max(scaleX, scaleY);
                
                // Configurar límites lógicos de los sliders según el tamaño de la imagen
                const zoomSlider = document.getElementById('editorZoom');
                zoomSlider.min = Math.min(scaleX, scaleY) * 0.3; // Zoom out
                zoomSlider.max = this.scale * 4; // Zoom in
                zoomSlider.value = this.scale;

                document.getElementById('editorPanX').min = -this.img.width * 2;
                document.getElementById('editorPanX').max = this.img.width * 2;
                document.getElementById('editorPanX').value = 0;

                document.getElementById('editorPanY').min = -this.img.height * 2;
                document.getElementById('editorPanY').max = this.img.height * 2;
                document.getElementById('editorPanY').value = 0;

                this.draw();
                
                let modalInstance = bootstrap.Modal.getInstance(document.getElementById(this.modalId));
                if (!modalInstance) modalInstance = new bootstrap.Modal(document.getElementById(this.modalId));
                modalInstance.show();
            };
            this.img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    draw() {
        if (!this.img) return;
        const cvs = document.getElementById('editorCanvas');
        const ctx = cvs.getContext('2d');
        
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        
        const cx = cvs.width / 2;
        const cy = cvs.height / 2;
        
        ctx.save();
        ctx.translate(cx + this.panX, cy + this.panY);
        ctx.scale(this.scale, this.scale);
        ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
        ctx.restore();
    },

    confirm() {
        // Generar salida de alta resolución pero comprimida (JPEG 70%)
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = this.exportSize;
        finalCanvas.height = this.exportSize;
        const ctx = finalCanvas.getContext('2d');
        
        const ratio = this.exportSize / this.canvasSize;
        
        // Fondo blanco (Por si es PNG transparente y el usuario lo encogió)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        
        const cx = finalCanvas.width / 2;
        const cy = finalCanvas.height / 2;
        
        ctx.save();
        ctx.translate(cx + (this.panX * ratio), cy + (this.panY * ratio));
        ctx.scale(this.scale * ratio, this.scale * ratio);
        ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
        ctx.restore();
        
        // Comprimir automáticamente
        const finalBase64 = finalCanvas.toDataURL('image/jpeg', 0.7);
        
        if (this.callback) this.callback(finalBase64);
        
        const modalInstance = bootstrap.Modal.getInstance(document.getElementById(this.modalId));
        if(modalInstance) modalInstance.hide();
    }
};