
        document.addEventListener('DOMContentLoaded', function() {
            const formAddProject = document.getElementById('formAddProject');
            const formEditProject = document.getElementById('formEditProject');
            const projectContainer = document.getElementById('projectContainer');
            const statProjectCount = document.getElementById('statProjectCount');
            
            // Inisialisasi Modal Bootstrap
            const addProjectModal = new bootstrap.Modal(document.getElementById('addProjectModal'));
            const editProjectModal = new bootstrap.Modal(document.getElementById('editProjectModal'));
            const detailProjectModal = new bootstrap.Modal(document.getElementById('detailProjectModal'));

            let currentEditingItem = null;

            // Toggle Modal Tambah
            const srcTypeFile = document.getElementById('srcTypeFile');
            const srcTypeUrl = document.getElementById('srcTypeUrl');
            const fileUploadGroup = document.getElementById('fileUploadGroup');
            const urlUploadGroup = document.getElementById('urlUploadGroup');

            srcTypeFile.addEventListener('change', function() {
                if(this.checked) {
                    fileUploadGroup.classList.remove('d-none');
                    urlUploadGroup.classList.add('d-none');
                }
            });

            srcTypeUrl.addEventListener('change', function() {
                if(this.checked) {
                    fileUploadGroup.classList.add('d-none');
                    urlUploadGroup.classList.remove('d-none');
                }
            });

            // Toggle Modal Edit
            const editSrcTypeFile = document.getElementById('editSrcTypeFile');
            const editSrcTypeUrl = document.getElementById('editSrcTypeUrl');
            const editFileUploadGroup = document.getElementById('editFileUploadGroup');
            const editUrlUploadGroup = document.getElementById('editUrlUploadGroup');

            editSrcTypeFile.addEventListener('change', function() {
                if(this.checked) {
                    editFileUploadGroup.classList.remove('d-none');
                    editUrlUploadGroup.classList.add('d-none');
                }
            });

            editSrcTypeUrl.addEventListener('change', function() {
                if(this.checked) {
                    editFileUploadGroup.classList.add('d-none');
                    editUrlUploadGroup.classList.remove('d-none');
                }
            });

            // Update Statistik
            function updateProjectCount() {
                const count = projectContainer.querySelectorAll('.project-item').length;
                if (statProjectCount) {
                    statProjectCount.textContent = count + '+';
                }
            }

            // Tambah Project Baru
            formAddProject.addEventListener('submit', function(e) {
                e.preventDefault();

                const title = document.getElementById('projectTitle').value;
                const category = document.getElementById('projectCategory').value;
                const tech = document.getElementById('projectTech').value;
                const desc = document.getElementById('projectDesc').value;
                const imageType = document.querySelector('input[name="imageSourceType"]:checked').value;

                let imgSrc = 'https://placehold.co/600x400/ced4da/580014?text=Project';

                if (imageType === 'file') {
                    const fileInput = document.getElementById('projectFileImage');
                    if (fileInput.files && fileInput.files[0]) {
                        imgSrc = URL.createObjectURL(fileInput.files[0]);
                    }
                } else {
                    const urlInput = document.getElementById('projectUrlImage').value;
                    if(urlInput.trim() !== '') imgSrc = urlInput;
                }

                const newProjectCol = document.createElement('div');
                newProjectCol.className = 'col-md-6 col-lg-4 project-item';
                newProjectCol.setAttribute('data-title', title);
                newProjectCol.setAttribute('data-category', category);
                newProjectCol.setAttribute('data-tech', tech);
                newProjectCol.setAttribute('data-img-src', imgSrc);
                newProjectCol.setAttribute('data-desc', desc);

                newProjectCol.innerHTML = `
                    <div class="card custom-card h-100 border-0">
                        <div class="position-relative">
                            <div class="action-btn-overlay">
                                <button class="btn-card-action bg-light text-dark btn-edit-project" title="Edit Project"><i class="bi bi-pencil-fill"></i></button>
                                <button class="btn-card-action bg-danger text-white btn-delete-project" title="Hapus Project"><i class="bi bi-trash-fill"></i></button>
                            </div>
                            <div class="card-img-wrapper project-img-container">
                                <img src="${imgSrc}" alt="${title}" class="card-img-top">
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="mb-2">
                                <span class="badge me-1 badge-category" style="background-color: var(--accent-maroon);">${category}</span>
                                <span class="badge bg-dark badge-tech">${tech}</span>
                            </div>
                            <h5 class="card-title fw-bold card-project-title" style="color: var(--text-dark);">${title}</h5>
                            <p class="card-text text-muted card-project-desc">${desc}</p>
                        </div>
                        <div class="card-footer bg-transparent border-0 pb-3">
                            <button type="button" class="btn btn-outline-maroon btn-sm w-100 btn-view-detail"><i class="bi bi-box-arrow-up-right me-1"></i>Lihat Detail</button>
                        </div>
                    </div>
                `;

                projectContainer.prepend(newProjectCol);
                updateProjectCount();

                formAddProject.reset();
                addProjectModal.hide();
            });

            // Klik Detail, Edit, & Hapus
            projectContainer.addEventListener('click', function(e) {
                const editBtn = e.target.closest('.btn-edit-project');
                const deleteBtn = e.target.closest('.btn-delete-project');
                const detailBtn = e.target.closest('.btn-view-detail');

                // DETAIL
                if (detailBtn) {
                    const item = detailBtn.closest('.project-item');
                    const title = item.getAttribute('data-title') || item.querySelector('.card-project-title').textContent;
                    const category = item.getAttribute('data-category') || item.querySelector('.badge-category').textContent;
                    const tech = item.getAttribute('data-tech') || item.querySelector('.badge-tech').textContent;
                    const desc = item.getAttribute('data-desc') || item.querySelector('.card-project-desc').textContent;
                    const imgSrc = item.getAttribute('data-img-src') || item.querySelector('img').src;

                    document.getElementById('detailTitle').textContent = title;
                    document.getElementById('detailCategory').textContent = category;
                    document.getElementById('detailTech').textContent = tech;
                    document.getElementById('detailTechFooter').textContent = tech;
                    document.getElementById('detailDesc').textContent = desc;

                    const detailImgWrapper = document.getElementById('detailImageWrapper');
                    if (detailImgWrapper) {
                        detailImgWrapper.innerHTML = `<img src="${imgSrc}" alt="${title}" class="img-fluid rounded">`;
                    }

                    detailProjectModal.show();
                }

                // EDIT
                if (editBtn) {
                    currentEditingItem = editBtn.closest('.project-item');
                    
                    const title = currentEditingItem.getAttribute('data-title') || currentEditingItem.querySelector('.card-project-title').textContent;
                    const category = currentEditingItem.getAttribute('data-category') || currentEditingItem.querySelector('.badge-category').textContent;
                    const tech = currentEditingItem.getAttribute('data-tech') || currentEditingItem.querySelector('.badge-tech').textContent;
                    const desc = currentEditingItem.getAttribute('data-desc') || currentEditingItem.querySelector('.card-project-desc').textContent;

                    document.getElementById('editProjectTitle').value = title;
                    document.getElementById('editProjectCategory').value = category;
                    document.getElementById('editProjectTech').value = tech;
                    document.getElementById('editProjectDesc').value = desc;

                    editProjectModal.show();
                }

                // HAPUS
                if (deleteBtn) {
                    const itemToDelete = deleteBtn.closest('.project-item');
                    const projectTitle = itemToDelete.querySelector('.card-project-title').textContent;

                    if (confirm(`Apakah Anda yakin ingin menghapus project "${projectTitle}"?`)) {
                        itemToDelete.remove();
                        updateProjectCount();
                    }
                }
            });

            // Submit Edit
            formEditProject.addEventListener('submit', function(e) {
                e.preventDefault();

                if (!currentEditingItem) return;

                const newTitle = document.getElementById('editProjectTitle').value;
                const newCategory = document.getElementById('editProjectCategory').value;
                const newTech = document.getElementById('editProjectTech').value;
                const newDesc = document.getElementById('editProjectDesc').value;
                const newImageType = document.querySelector('input[name="editImageSourceType"]:checked').value;

                let newImgSrc = currentEditingItem.getAttribute('data-img-src') || currentEditingItem.querySelector('img').src;

                if (newImageType === 'file') {
                    const fileInput = document.getElementById('editProjectFileImage');
                    if (fileInput.files && fileInput.files[0]) {
                        newImgSrc = URL.createObjectURL(fileInput.files[0]);
                    }
                } else {
                    const urlInput = document.getElementById('editProjectUrlImage').value;
                    if(urlInput.trim() !== '') newImgSrc = urlInput;
                }

                currentEditingItem.setAttribute('data-title', newTitle);
                currentEditingItem.setAttribute('data-category', newCategory);
                currentEditingItem.setAttribute('data-tech', newTech);
                currentEditingItem.setAttribute('data-desc', newDesc);
                currentEditingItem.setAttribute('data-img-src', newImgSrc);

                currentEditingItem.querySelector('.card-project-title').textContent = newTitle;
                currentEditingItem.querySelector('.badge-category').textContent = newCategory;
                currentEditingItem.querySelector('.badge-tech').textContent = newTech;
                currentEditingItem.querySelector('.card-project-desc').textContent = newDesc;
                currentEditingItem.querySelector('img').src = newImgSrc;

                editProjectModal.hide();
                currentEditingItem = null;
            });

            updateProjectCount();
        });
 

