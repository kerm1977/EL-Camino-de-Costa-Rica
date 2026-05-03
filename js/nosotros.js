// ==========================================
// MÓDULO: NOSOTROS (Información Institucional)
// Archivo: js/nosotros.js
// ==========================================

window.templates = window.templates || {};

// Función local para abrir/cerrar acordeones
window.toggleNosotros = function(sectionId, iconId) {
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

// Generador de Componente Acordeón (Ahora con soporte dinámico de color)
const buildAccordion = (id, title, htmlContent, color, isOpen = false) => {
    const displayClass = isOpen ? '' : 'd-none';
    const iconClass = isOpen ? 'bi-chevron-up' : 'bi-chevron-down';
    
    return `
    <div class="card-perfil p-0 mb-3 overflow-hidden border" style="box-shadow: none; border-color: var(--input-border) !important;">
        <div class="p-3 d-flex justify-content-between align-items-center" style="cursor:pointer; background: var(--white);" onclick="window.toggleNosotros('ns-content-${id}', 'ns-icon-${id}')">
            <h6 class="fw-bold mb-0" style="color: ${color};">${title}</h6>
            <i class="bi ${iconClass}" style="color: ${color};" id="ns-icon-${id}"></i>
        </div>
        <div id="ns-content-${id}" class="p-3 pt-0 border-top ${displayClass}" style="background: var(--white); border-color: var(--input-border) !important;">
            <div class="small mt-3 text-muted" style="color: var(--text-dark) !important; line-height: 1.6; text-align: justify;">
                ${htmlContent}
            </div>
        </div>
    </div>`;
};

// --- CONTENIDOS ---
const content1 = `
<p>La Asociación Mar a Mar es una asociación sin ánimo de lucro para el desarrollo rural. Hemos creado un viaje lleno de aventuras y pintorescos pueblos costarricenses desde el Atlántico hasta el Pacífico.</p>
<p>La organización desarrolla y refuerza el nexo entre la conservación y protección de la biodiversidad, el turismo sostenible y el desarrollo económico de las comunidades vulnerables.</p>
<p>Mar a Mar funciona como una DMO, Organización de Gestión de Destinos, garantizando los principios del turismo sostenible y también funciona como un Fondo Comunitario, aportando recursos de diversas fuentes para invertir en las comunidades a lo largo del Camino de Costa Rica, fomentando el desarrollo sostenible y la protección del medio ambiente al mismo tiempo. En todas sus actividades, Mar a Mar fomenta la conservación y protección de la biodiversidad e implica a un gran número de personas e instituciones locales.</p>
<p>Mar a Mar cuenta con más de 35 asociados entre los que se encuentran empresarios, profesionales del turismo, líderes locales y excursionistas. Se constituyó como organización sin ánimo de lucro en Costa Rica en noviembre de 2015 (Cédula jurídica N° 3-002-718717).</p>
<p>La asociación cuenta con una sólida Junta Directiva seleccionada por su experiencia en diversos sectores. La Junta elige a un Director Ejecutivo que dirige la parte operativa de la organización y dirige 7 grupos de trabajo:</p>
<ul class="mb-0">
    <li>Desarrollo y mantenimiento de senderos</li>
    <li>Participación de la Comunidad</li>
    <li>Compromiso institucional</li>
    <li>Arte y Cultura</li>
    <li>Marketing y Comunicación</li>
    <li>Recaudación de fondos</li>
    <li>Cuestiones jurídicas y fiscales</li>
</ul>`;

const content2 = `<p class="mb-0">Nuestro objetivo es desarrollar comunidades rurales sostenibles comprometidas con el turismo sostenible y la protección de sus recursos naturales. Para ello, la organización promueve una ruta de senderismo de larga distancia de categoría mundial, El Camino de Costa Rica, que atrae a excursionistas de zonas urbanas de Costa Rica y del extranjero para que experimenten de primera mano la belleza natural y la cultura local en el corazón del país.</p>`;

const content3 = `
<p>A medida que crece el número de excursionistas y turistas, El Camino de Costa Rica se convierte en un motor de desarrollo modelo para las comunidades vulnerables del país, aportando nuevos recursos, infraestructura social y unos ingresos muy necesarios que también garantizarán la conservación y protección de la biodiversidad existente.</p>
<p class="mb-0">El trabajo de Mar a Mar tiene como objetivo un impacto real y duradero.</p>`;

const content4 = `<p class="mb-0">Para lograr sus objetivos, Mar a Mar trabaja con tres pilares principales y con los grupos informales de base que hemos desarrollado y con los que hemos trabajado. El objetivo global es el impacto positivo a largo plazo sobre las condiciones socioeconómicas y el medio ambiente.</p>`;

const content5 = `
<p>El primer pilar es la promoción y el mantenimiento de la ruta mediante esfuerzos de marketing locales e internacionales y proporcionando información a los excursionistas, señalización continua y programas de mantenimiento principalmente mediante voluntarios y colaboración local. Pronto se desarrollará de forma más estructurada un programa internacional para excursionistas voluntarios.</p>
<p class="mb-0">Grupo de Facebook de excursionistas y operadores de 1,9k miembros interesados en adquirir o proporcionar información sobre rutas, así como en compartir recomendaciones de mejoras y destacar iniciativas valiosas.</p>`;

const content6 = `
<p>La capacitación de pequeñas empresas y organizaciones locales y la difusión de las tradiciones locales se gestionan a través de un Fondo Comunitario que constituye el segundo pilar. Programas de pequeñas subvenciones y donaciones directas a escuelas, clínicas y otras entidades locales para satisfacer las necesidades de la comunidad. Se utilizan dos redes sociales para promover la comunicación de oportunidades y proyectos a lo largo de la ruta.</p>
<ul class="mb-0">
    <li class="mb-2">Red de propietarios de alojamientos y restaurantes a lo largo de la ruta llamada Red de Albergues del Camino de Costa Rica.</li>
    <li>Red de asociaciones de desarrollo a lo largo de la ruta denominada Red de ADIs del Camino de Costa Rica.</li>
</ul>`;

const content7 = `
<p>El tercer pilar, Conservación y Biodiversidad, se centra en la educación, la reforestación y el homenaje a los ecosistemas ricos y biodiversos de la ruta, que es uno de los mayores atractivos de El Camino de Costa Rica. La atención se centra en los jóvenes de las comunidades para lograr un impacto tanto a corto como a largo plazo. Allí donde existen, se faculta a las asociaciones de desarrollo local para que definan y lleven a cabo dichos proyectos, y Mar a Mar desempeña un papel de guía y apoyo.</p>
<ul class="mb-0">
    <li class="mb-2">Programa de Clubes Medioambientales para educar y capacitar a los estudiantes que, a su vez, pueden influir significativamente en sus comunidades. Esto implica actividades prácticas de exploración y protección de la biodiversidad in situ, enseñando prácticas sostenibles para las comunidades. Se está ampliando para incluir el desarrollo de lugares para los jóvenes mediante aulas al aire libre y otros lugares.</li>
    <li>Se está planificando un proyecto a largo plazo para desarrollar un Centro de Biodiversidad y Educación Medioambiental en el que participe un consorcio de universidades, organizaciones e instituciones comunitarias de base. Cuando existan, se facultará a las asociaciones de desarrollo local para que definan y lleven a cabo dichos proyectos, y Mar a Mar desempeñará un papel de guía y apoyo.</li>
</ul>`;

const content8 = `
<ul class="mb-0 ps-3">
    <li class="mb-2"><b>Sostenibilidad social y medioambiental:</b> El doble objetivo del desarrollo económico y la conservación de la biodiversidad van de la mano y son totalmente compatibles en nuestro trabajo. Promoviendo la apreciación de la flora y la fauna a lo largo de la ruta y protegiendo la biodiversidad, que es lo que atrae a turistas y excursionistas, podemos garantizar el éxito del proyecto.</li>
    <li class="mb-2"><b>Participación y compromiso:</b> Todas las partes interesadas se comprometen y participan activamente para garantizar el éxito de todas las iniciativas.</li>
    <li class="mb-2"><b>Solidaridad:</b> Creemos que la única forma de que el desarrollo sea sostenible es mediante el crecimiento equilibrado de todos los elementos de la comunidad, garantizando los beneficios mutuos y la colaboración.</li>
    <li><b>Perseverancia:</b> Reconocemos los retos y obstáculos a los que se enfrentarán los participantes y nos esforzamos por capacitarlos y apoyarlos manteniendo siempre presentes la visión y los objetivos a largo plazo. Mar a Mar es miembro de la Fundación Costa Rica Estados Unidos de América para la Cooperación (CRUSA) y cuenta con Amigos de Costa Rica como su paraguas la 501 C(3).</li>
</ul>`;

// Helper para crear círculos numerados indeformables y con color dinámico
const renderBadge = (number, color) => `
    <div class="me-3 flex-shrink-0 d-flex align-items-center justify-content-center text-white rounded-circle shadow-sm fw-bold fs-6" 
         style="background-color: ${color}; width: 35px; height: 35px; min-width: 35px; min-height: 35px;">
        ${number}
    </div>
`;

const content9 = `
<div class="d-flex mb-3 align-items-start">
    ${renderBadge(1, '#38b2ac')}
    <div><b>Proporcionando una ruta apta para una gran variedad de excursionistas</b> que incluye muchas experiencias únicas apreciando los atractivos naturales y culturales de Costa Rica mediante un sendero de travesía que une los océanos Atlántico y Pacífico. <br><small class="fw-bold" style="color: #38b2ac;">Descubre El Camino</small></div>
</div>

<div class="d-flex mb-3 align-items-start">
    ${renderBadge(2, '#667eea')}
    <div><b>Garantizar la información precisa</b>, la señalización y el mantenimiento de la ruta, así como los valores y normas de una ruta internacional de larga distancia. <br><small class="fw-bold" style="color: #667eea;">Prepárate para la Caminata</small></div>
</div>

<div class="d-flex mb-3 align-items-start">
    ${renderBadge(3, '#48bb78')}
    <div><b>Ayudar al desarrollo de pequeñas empresas rurales</b> con un compromiso de sostenibilidad a través de nuestro papel como Fondo Comunitario. <br><small class="fw-bold" style="color: #48bb78;">Únete a nuestra comunidad</small></div>
</div>

<div class="d-flex mb-3 align-items-start">
    ${renderBadge(4, '#ed8936')}
    <div><b>Apoyar el desarrollo sostenible en pequeñas comunidades</b>, mediante el apoyo a artesanos, guías locales y el fortalecimiento de las organizaciones comunitarias. <br><small class="fw-bold" style="color: #ed8936;">Beneficiarios</small></div>
</div>

<div class="d-flex mb-3 align-items-start">
    ${renderBadge(5, '#ed64a6')}
    <div><b>Atraer visitantes al aire libre</b> para que aprecien las montañas, bosques, valles y pueblos de Costa Rica, apreciando su biodiversidad. <br><small class="fw-bold" style="color: #ed64a6;">Sobre el sendero</small></div>
</div>

<div class="d-flex mb-0 align-items-start">
    ${renderBadge(6, '#4299e1')}
    <div><b>Promover la protección de la biodiversidad</b> y contribuir a la educación medioambiental.</div>
</div>`;

// --- PLANTILLA HTML (Se inyecta en app-container) ---
window.templates.nosotros = `
    <div class="module-fade-in pb-5">
        <header class="top-bar d-flex align-items-center px-3 pt-3 mb-4">
            <a href="#home" class="btn-circle text-decoration-none shadow-sm flex-shrink-0 me-3"><i class="bi bi-arrow-left fs-5"></i></a>
            <h5 class="mb-0 fw-bold flex-grow-1" style="color: var(--text-dark);">Nosotros</h5>
        </header>
        
        <div class="px-3 pb-4">
            <div class="text-center mb-4">
                <img src="img/logo.png" style="width: 100px; height: 100px; object-fit: contain; border-radius: 50%; border: 3px solid var(--teal-light); padding: 5px; background: white;" class="shadow-sm mb-3">
                <h4 class="fw-bold text-teal mb-1">Mar a Mar</h4>
                <p class="text-muted small fw-bold">Asociación para el desarrollo rural</p>
            </div>

            ${buildAccordion('1', 'Quiénes somos', content1, '#38b2ac', true)} <!-- Teal -->
            ${buildAccordion('2', 'Misión:', content2, '#667eea')}             <!-- Índigo -->
            ${buildAccordion('3', 'Visión:', content3, '#4299e1')}             <!-- Azul Acero -->
            ${buildAccordion('4', 'Los tres pilares de la Asociación', content4, '#48bb78')} <!-- Verde Salvia -->
            ${buildAccordion('5', 'La ruta:', content5, '#f56565')}             <!-- Coral -->
            ${buildAccordion('6', 'Comunidades:', content6, '#ed8936')}         <!-- Ocaso -->
            ${buildAccordion('7', 'Conservación y Biodiversidad:', content7, '#9f7aea')} <!-- Lavanda -->
            ${buildAccordion('8', 'Valores y principios', content8, '#ed64a6')}   <!-- Rosa Vintage -->
            ${buildAccordion('9', 'Nuestros objetivos', content9, '#b7791f')}     <!-- Moca Claro -->

        </div>
    </div>
`;