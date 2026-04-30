// js/vistas.js
window.templates = window.templates || {};

window.templates.home = `
    <div class="module-fade-in pb-4">
        <header class="top-bar d-flex justify-content-between align-items-center mb-3">
            <button class="btn-circle"><i class="bi bi-list fs-5"></i></button>
            <h5 class="mb-0 fw-bold">Home</h5>
            <button class="btn-circle"><i class="bi bi-search fs-5"></i></button>
        </header>
        <div class="storage-card p-4 mb-4 d-flex align-items-center">
            <div class="progress-circle me-3"><span>80%</span></div>
            <div><h6 class="mb-1 fw-bold">Available Storage</h6><small class="opacity-75">130GB / 512GB</small></div>
        </div>
        <div class="row text-center mb-4 g-2">
            <div class="col-3"><div class="cat-icon-box" style="background-color: var(--cat-purple);"><i class="bi bi-grid-fill"></i></div><span class="cat-text">All</span></div>
            <div class="col-3"><div class="cat-icon-box" style="background-color: var(--cat-blue);"><i class="bi bi-folder-fill"></i></div><span class="cat-text">Folder</span></div>
            <div class="col-3"><div class="cat-icon-box" style="background-color: var(--cat-orange);"><i class="bi bi-file-earmark-text-fill"></i></div><span class="cat-text">File</span></div>
            <div class="col-3"><div class="cat-icon-box" style="background-color: var(--cat-pink);"><i class="bi bi-person-fill"></i></div><span class="cat-text">People</span></div>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3 px-2">
            <h6 class="fw-bold mb-0">Recent files</h6><a href="#" class="text-teal text-decoration-none small fw-bold">See all ></a>
        </div>
        <div class="file-item"><div class="file-icon" style="background-color: var(--cat-purple);"><i class="bi bi-play-fill"></i></div><div class="flex-grow-1"><h6 class="mb-0 fw-bold">Preview.mp4</h6><small class="text-muted fw-bold">8 MB</small></div><i class="bi bi-three-dots text-muted"></i></div>
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