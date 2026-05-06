// ==========================================
// MÓDULO: DONACIONES
// Archivo: js/donaciones.js
// Responsabilidad: Renderizar la vista de donaciones, cuentas bancarias y acordeones
// ==========================================

window.templates = window.templates || {};

// Función local para abrir/cerrar acordeones de Donaciones
window.toggleDonacion = function(sectionId, iconId) {
    const content = document.getElementById(sectionId);
    const icon = document.getElementById(iconId);
    if (!content || !icon) return;
    
    if (content.classList.contains('d-none')) {
        content.classList.remove('d-none');
        icon.classList.replace('bi-chevron-down', 'bi-chevron-up');
    } else {
        content.classList.add('d-none');
        icon.classList.replace('bi-chevron-up', 'bi-chevron-down');
    }
};

// Función para cambiar de pestañas (Colones / Dólares / SINPE)
window.switchTabDonacion = function(tabName) {
    ['colones', 'dolares', 'sinpe'].forEach(tab => {
        const contentTab = document.getElementById('tab-don-' + tab);
        const btnTab = document.getElementById('btn-tab-don-' + tab);
        
        if(contentTab) contentTab.classList.add('d-none');
        
        if(btnTab) {
            btnTab.classList.remove('bg-teal', 'text-white', 'shadow-sm');
            btnTab.classList.add('bg-transparent', 'text-muted');
            btnTab.style.borderColor = 'transparent';
        }
    });
    
    const activeContent = document.getElementById('tab-don-' + tabName);
    const activeBtn = document.getElementById('btn-tab-don-' + tabName);
    
    if(activeContent) activeContent.classList.remove('d-none');
    if(activeBtn) {
        activeBtn.classList.remove('bg-transparent', 'text-muted');
        activeBtn.classList.add('bg-teal', 'text-white', 'shadow-sm');
    }
};

// Generador de Componente Acordeón con color dinámico
const buildAccordionDonacion = (id, title, htmlContent, color, isOpen = false) => {
    const displayClass = isOpen ? '' : 'd-none';
    const iconClass = isOpen ? 'bi-chevron-up' : 'bi-chevron-down';
    
    return `
    <div class="card-perfil p-0 mb-3 overflow-hidden border" style="box-shadow: none; border-color: var(--input-border) !important;">
        <div class="p-3 d-flex justify-content-between align-items-center" style="cursor:pointer; background: var(--white);" onclick="window.toggleDonacion('don-content-${id}', 'don-icon-${id}')">
            <h6 class="fw-bold mb-0" style="color: ${color};">${title}</h6>
            <i class="bi ${iconClass}" style="color: ${color};" id="don-icon-${id}"></i>
        </div>
        <div id="don-content-${id}" class="p-3 pt-0 border-top ${displayClass}" style="background: var(--white); border-color: var(--input-border) !important;">
            <div class="small mt-3 text-muted" style="color: var(--text-dark) !important; line-height: 1.6; text-align: justify;">
                ${htmlContent}
            </div>
        </div>
    </div>`;
};

// --- CONTENIDOS ACORDEONES ---
const donContentZelle = `
<p>Zelle es una nueva forma de hacer pagos de banco a banco. Es gratuito y muy seguro. Para enviar un donativo a través de Zelle, avisa a <strong>Amigos de Costa Rica</strong> enviando un correo electrónico a <a href="mailto:admin@amigosofcostarica.org" class="fw-bold" style="color: var(--teal-main);">admin@amigosofcostarica.org</a> para indicar tu intención de enviar fondos a través de Zelle, así como cualquier solicitud de dirigir tu donativo para apoyar un proyecto específico.</p>
<p>Los fondos enviados a través de Zelle pueden enviarse a: <a href="mailto:emily@amigosofcostarica.org" class="fw-bold" style="color: var(--teal-main);">emily@amigosofcostarica.org</a></p>
<div class="alert mt-3 mb-0 border-0 p-3" style="background-color: rgba(56, 178, 172, 0.1); border-radius: 1rem;">
    <p class="small mb-0" style="color: var(--teal-main);">* Estas dos opciones se realizan a través de la plataforma Amigos de Costa Rica. Esta organización sin ánimo de lucro nos cobra un 3% de cada donación en concepto de tasa administrativa. Puedes cubrir esta comisión incluyendo un 3% adicional a tu donación. Amigos de Costa Rica es una organización exenta de impuestos 501(c)3, y tu donación es deducible de impuestos dentro de las directrices de la legislación estadounidense. Para reclamar un donativo como deducción en tus impuestos estadounidenses, conserva el recibo de donativo enviado por correo electrónico como registro oficial.</p>
</div>
`;

const donContentUnica = `
<p>Cualquier cantidad, a partir de $1, mejorará nuestro trabajo. Tu apoyo inmediato con un donativo se destina a cualquiera de nuestros proyectos específicos y repercutirá positivamente en nuestras comunidades.</p>
<p class="fw-bold text-dark mb-2">Tu donativo a cualquier nivel puede ayudar:</p>
<ul class="mb-0 ps-3">
    <li class="mb-2"><strong class="text-teal">$20</strong> promociona el sendero para atraer a más excursionistas que apoyen a las empresas rurales.</li>
    <li class="mb-2"><strong class="text-teal">$50</strong> apoya a un pequeño empresario en la comercialización de su pequeña empresa sostenible.</li>
    <li class="mb-2"><strong class="text-teal">$75</strong> financian libros de texto y actividades de educación medioambiental para una escuela rural.</li>
    <li class="mb-2"><strong class="text-teal">$100</strong> mejora la señalización y la seguridad de 1 km del sendero.</li>
    <li class="mb-2"><strong class="text-teal">$500</strong> financian una subvención a un microempresario para que haga crecer su pequeña empresa sostenible.</li>
    <li><strong class="text-teal">$1000</strong> nos permiten cubrir las necesidades básicas de infraestructura de una pequeña comunidad, como agua potable o electricidad.</li>
</ul>
`;

const donContentMensual = `
<p>Una donación sostenida en el tiempo, con una donación mensual programada, nos permitirá proyectar nuestras actividades y garantizar el apoyo a largo plazo a nuestros beneficiarios.</p>
<p class="mb-0">Como <strong style="color: var(--cat-orange);">Navegante del Cambio</strong>, te conviertes en un socio clave en nuestro esfuerzo continuado por el desarrollo sostenible.</p>
`;

// --- PLANTILLA PRINCIPAL ---
window.templates.donaciones = `
    <div class="module-fade-in pb-5">
        <header class="top-bar d-flex align-items-center px-3 pt-3 mb-4">
            <a href="#home" class="btn-circle text-decoration-none shadow-sm flex-shrink-0 me-3"><i class="bi bi-arrow-left fs-5"></i></a>
            <h5 class="mb-0 fw-bold flex-grow-1" style="color: var(--text-dark);">Donaciones</h5>
        </header>
        
        <div class="px-3 pb-4">
            
            <!-- MEDIOS DE DONACIÓN AL INICIO -->
            <h6 class="fw-bold text-dark mb-3 ps-1 mt-2">Transferencia bancaria a/desde Costa Rica</h6>
            <div class="card-perfil p-0 mb-4 overflow-hidden border shadow-sm" style="border-color: var(--input-border) !important;">
                
                <!-- Controles de Pestañas -->
                <div class="d-flex border-bottom" style="background: var(--input-bg);">
                    <button id="btn-tab-don-colones" class="btn bg-teal text-white flex-grow-1 fw-bold small py-3 rounded-0 shadow-sm" style="border: none;" onclick="window.switchTabDonacion('colones')">Colones</button>
                    <button id="btn-tab-don-dolares" class="btn bg-transparent text-muted flex-grow-1 fw-bold small py-3 rounded-0 border-0" onclick="window.switchTabDonacion('dolares')">Dólares</button>
                    <button id="btn-tab-don-sinpe" class="btn bg-transparent text-muted flex-grow-1 fw-bold small py-3 rounded-0 border-0" onclick="window.switchTabDonacion('sinpe')">SINPE</button>
                </div>

                <!-- Contenido Pestañas -->
                <div class="p-4" style="background: var(--white);">
                    
                    <!-- COLONES -->
                    <div id="tab-don-colones" class="module-fade-in text-center">
                        <h6 class="fw-bold text-teal mb-3">BAC San José</h6>
                        <p class="small text-dark mb-1"><strong>Asociación Mar a Mar: Costa Rica</strong></p>
                        <p class="small text-dark mb-1">Cédula Jurídica: 3 -002-718717</p>
                        <div class="p-3 mt-3 rounded" style="background: var(--input-bg);">
                            <p class="small text-dark mb-1">Cuenta en colones: <br><strong class="fs-6">928484088</strong></p>
                            <p class="small text-dark mb-1 mt-2">Cuenta cliente: <br><strong>10200009284840884</strong></p>
                            <p class="small text-dark mb-0 mt-2">IBAN: <br><strong>CR23010200009284840884</strong></p>
                        </div>
                    </div>

                    <!-- DÓLARES -->
                    <div id="tab-don-dolares" class="module-fade-in text-center d-none">
                        <h6 class="fw-bold text-teal mb-3">BAC San José</h6>
                        <p class="small text-dark mb-1"><strong>Asociación Mar a Mar: Costa Rica</strong></p>
                        <p class="small text-dark mb-1">Cédula Jurídica: 3 -002-718717</p>
                        <div class="p-3 mt-3 rounded" style="background: var(--input-bg);">
                            <p class="small text-dark mb-1">Cuenta en dólares: <br><strong class="fs-6">9284840967</strong></p>
                            <p class="small text-dark mb-1 mt-2">Cuenta cliente: <br><strong>10200009284840967</strong></p>
                            <p class="small text-dark mb-1 mt-2">IBAN: <br><strong>CR13010200009284840967</strong></p>
                            <p class="small text-dark mb-0 mt-2">SWIFT: <strong>BSNJCRSJ</strong></p>
                        </div>
                    </div>

                    <!-- SINPE -->
                    <div id="tab-don-sinpe" class="module-fade-in text-center d-none">
                        <div class="d-flex align-items-center justify-content-center mb-3">
                            <i class="bi bi-phone-vibrate text-teal fs-1 me-2"></i>
                            <span class="fs-2 fw-bold" style="color: var(--cat-orange);">+506 7144-2415</span>
                        </div>
                        <p class="small text-dark mb-2">Puedes utilizar SINPE móvil dentro de Costa Rica.</p>
                        <p class="small text-dark mb-3">Por favor, incluye la descripción de <strong>«Donación Mar a Mar»</strong>.</p>
                        <div class="alert py-2 mb-0 border-0 small text-start" style="background: rgba(237, 137, 54, 0.1); color: var(--cat-orange);">
                            <i class="bi bi-info-circle-fill me-1"></i> Las donaciones del SINPE sólo pueden realizarse dentro del sistema bancario costarricense.
                        </div>
                    </div>

                </div>
            </div>

            <!-- Otras formas de donar -->
            <h6 class="fw-bold text-dark mb-3 ps-1 mt-4">Otras formas de hacer una donación</h6>
            <div class="card-perfil mb-4">
                <div class="mb-4">
                    <h6 class="fw-bold mb-3 d-flex align-items-center" style="color: var(--cat-purple);">
                        <div class="rounded-circle d-flex justify-content-center align-items-center me-2" style="width: 35px; height: 35px; background: rgba(102, 126, 234, 0.1);">
                            <i class="bi bi-credit-card-2-front-fill"></i>
                        </div>
                        En línea como 505(c)3
                    </h6>
                    <p class="small text-dark mb-2 fw-bold">Donación con Tarjeta de Crédito*.</p>
                    <p class="small text-dark mb-3">Puedes donar, una vez o mensualmente, en nuestra plataforma Classy, tarjeta de crédito, PayPal o Google Pay.</p>
                    <a href="https://pro.gofundme.com/give/216796/#!/donation/checkout" target="_blank" class="btn btn-teal w-100 py-3 d-flex justify-content-center align-items-center fw-bold shadow-sm"><i class="bi bi-heart-fill me-2"></i>Haz una donación en línea</a>
                </div>
                
                <hr style="border-color: var(--input-border); margin: 2rem 0;">

                <div>
                    <h6 class="fw-bold mb-3 d-flex align-items-center" style="color: var(--cat-orange);">
                        <div class="rounded-circle d-flex justify-content-center align-items-center me-2" style="width: 35px; height: 35px; background: rgba(237, 137, 54, 0.1);">
                            <i class="bi bi-envelope-paper-fill"></i>
                        </div>
                        Por cheque (501(c)3)
                    </h6>
                    <p class="small text-dark mb-3">Por favor, hazlo pagadero a <strong>Amigos de Costa Rica</strong> y envíalo por correo a:</p>
                    <div class="p-3 mb-3 rounded text-center" style="background: var(--input-bg); border: 1px dashed var(--input-border);">
                        <p class="small text-dark mb-0 fw-bold">Amigos de Costa Rica<br>P. Apartado de correos 748<br>West Chester, PA 19380</p>
                    </div>
                    <p class="small text-dark mb-2" style="text-align: justify; line-height: 1.6;">Amigos de Costa Rica nos cobra una comisión del 3% sobre las donaciones. Si deseas cubrir los gastos asociados a tu donación, incluye un 3% adicional.</p>
                    <p class="small text-dark mb-3" style="text-align: justify; line-height: 1.6;">No olvides indicarnos que deseas que tu donativo se destine a la <strong>Asociación Mar a Mar</strong>. Indica Asociación Mar a Mar en la línea de memo e incluye una nota con tu cheque. Los cheques recibidos sin designación se utilizarán para sufragar los gastos generales de funcionamiento de Amigos de Costa Rica. Los recibos se enviarán por correo a la dirección que figure en el cheque, a menos que solicites un recibo digital.</p>
                    <p class="small text-muted mb-0" style="text-align: justify; line-height: 1.5; font-size: 0.75rem;">Amigos de Costa Rica trabaja con la Fundación Costa Rica Estados Unidos para la Cooperación (CRUSA) para promover el desarrollo sostenible de Costa Rica apoyando proyectos innovadores y alianzas estratégicas en todo el país. Amigos de Costa Rica es una organización exenta de impuestos 501(c)3 y tu donativo es deducible de impuestos dentro de las directrices de la legislación estadounidense. Para reclamar un donativo como deducción en tus impuestos estadounidenses, conserva el recibo de donativo enviado por correo electrónico como registro oficial.</p>
                </div>
            </div>

            <!-- Acordeón Zelle -->
            ${buildAccordionDonacion('zelle', 'Donación de Zelle*', donContentZelle, '#4299e1', false)} <!-- Azul -->
            
            <!-- ACORDEONES ¿CUÁNTO DONAR? -->
            <h6 class="fw-bold text-dark mb-3 ps-1 mt-4">¿Cuánto donar?</h6>
            ${buildAccordionDonacion('unica', 'Senderista solidario, donación única', donContentUnica, '#48bb78', true)} <!-- Verde -->
            ${buildAccordionDonacion('mensual', 'Navegador del Cambio, donación mensual', donContentMensual, '#ed8936', false)} <!-- Naranja -->

            <!-- INFORMACIÓN INSTITUCIONAL ABAJO -->
            <h6 class="fw-bold text-dark mb-3 ps-1 mt-5">¿Por qué donar?</h6>
            <div class="card-perfil mb-4 overflow-hidden" style="border-color: var(--input-border) !important;">
                <div class="text-center mb-3">
                    <div class="rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3 shadow-sm" style="width: 60px; height: 60px; background: rgba(245, 101, 101, 0.1);">
                        <i class="bi bi-globe-americas fs-2" style="color: #f56565;"></i>
                    </div>
                    <h5 class="fw-bold text-teal mb-1">Apoya nuestro impacto</h5>
                </div>
                <p class="small text-dark mb-3" style="text-align: justify; line-height: 1.6;">En la Asociación Mar a Mar, llevamos a cabo proyectos de éxito gracias al generoso apoyo de personas y organizaciones que comparten nuestros valores y creen en la protección de la biodiversidad, el desarrollo sostenible y la capacitación de la comunidad.</p>
                <p class="small text-dark mb-3" style="text-align: justify; line-height: 1.6;">Todos los años llevamos a cabo campañas de recaudación de fondos para financiar proyectos en las 25 comunidades de la ruta. Nuestro objetivo es proporcionar igualdad de oportunidades a los empresarios locales, dotándoles de las habilidades y herramientas necesarias para ofrecer servicios turísticos de alta calidad.</p>
                <p class="small text-dark mb-3" style="text-align: justify; line-height: 1.6;">Mediante la formación y el apoyo financiero, hemos mejorado la vida de cientos de empresarios que ahora pueden poner de relieve las riquezas culturales y naturales únicas de su región y atender a los excursionistas con un servicio estandarizado. Este esfuerzo garantiza que las diferencias entre cada etapa del Camino se centren en la diversidad de los ecosistemas y las tradiciones locales y no en la desigualdad económica.</p>
                <p class="small text-dark mb-0" style="text-align: justify; line-height: 1.6;">Nuestro sendero crea puestos de trabajo, desarrolla la capacidad local, proporciona educación medioambiental y mucho más. Obtén más información sobre cómo la Asociación Mar a Mar conecta no sólo dos costas, sino también una vibrante red de desarrollo comunitario sostenible en el corazón mismo de la Costa Rica rural.</p>
            </div>

            <!-- Sobre Nosotros -->
            <div class="card-perfil mb-4" style="border-left: 4px solid var(--cat-blue);">
                <h6 class="fw-bold mb-3" style="color: var(--cat-blue);">Sobre nosotros</h6>
                <p class="small text-dark mb-3" style="text-align: justify; line-height: 1.6;">Para 2024, el objetivo ha sido recaudar 25.000 dólares, que se destinan directamente a proyectos de infraestructura y formación para emprendedores.</p>
                <p class="small text-dark mb-3" style="text-align: justify; line-height: 1.6;">En 2023, pudimos financiar proyectos que repercutieron en las infraestructuras comunitarias de siete comunidades a lo largo de la ruta.</p>
                <p class="small text-dark mb-0" style="text-align: justify; line-height: 1.6;">Al unirte como Senderista Solidario o como Navegante del Cambio, estás contribuyendo directamente a transformar vidas y crear oportunidades. Tanto si decides hacer un donativo único como si te comprometes con un programa de donativos a medio o largo plazo, cada contribución es valiosa y vital para financiar nuestros proyectos.</p>
            </div>

            <!-- Recaudador de Fondos -->
            <div class="card-perfil mt-4 text-center border-0 shadow-lg" style="background: linear-gradient(135deg, var(--cat-blue), #2b6cb0); color: white;">
                <h6 class="fw-bold mb-2 text-white">¿Quieres hacer más por las comunidades rurales de Costa Rica?</h6>
                <p class="small mb-4" style="color: rgba(255,255,255,0.9);">Hazte recaudador de fondos a través de Amigos de Costa Rica</p>
                <a href="https://www.amigosofcostarica.org/" target="_blank" class="btn btn-light fw-bold px-3 py-2 shadow-sm" style="color: var(--cat-blue); border-radius: 1rem; font-size: 0.9rem;">Hazte recaudador de fondos a través de Amigos de Costa Rica</a>
            </div>

        </div>
    </div>
`;