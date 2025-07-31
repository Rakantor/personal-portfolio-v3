class ModalManager {
  constructor() {
    this.modal = document.getElementById("image-modal");
    this.modalImg = document.getElementById("modal-img");
    this.closeBtn = document.getElementById("modal-close");
    this.currentImageIndex = 0;
    this.currentProjectImages = [];
    
    this.init();
  }

  init() {
    this.modal.insertAdjacentHTML('beforeend', `
      <button id="prev-img" class="modal-nav">&lt;</button>
      <button id="next-img" class="modal-nav">&gt;</button>
      <div id="image-counter" class="image-counter">1/1</div>
    `);

    this.prevBtn = document.getElementById("prev-img");
    this.nextBtn = document.getElementById("next-img");
    this.imageCounter = document.getElementById("image-counter");

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.prevImage();
    });

    this.nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.nextImage();
    });

    this.closeBtn.addEventListener("click", () => {
      this.closeModal();
    });

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!this.modal.classList.contains("hidden")) {
        switch(e.key) {
          case "Escape":
            this.closeModal();
            break;
          case "ArrowRight":
          case "ArrowUp":
            e.preventDefault();
            this.nextImage();
            break;
          case "ArrowLeft":
          case "ArrowDown":
            e.preventDefault();
            this.prevImage();
            break;
        }
      }
    });
  }

  openModal(projectImages, startIndex = 0) {
    this.currentProjectImages = projectImages;
    this.currentImageIndex = startIndex;
    this.updateModalImage();
    this.modal.classList.remove("hidden");
  }

  closeModal() {
    this.modal.classList.add("hidden");
  }

  updateModalImage() {
    this.modalImg.src = this.currentProjectImages[this.currentImageIndex];
    this.imageCounter.textContent = `${this.currentImageIndex + 1}/${this.currentProjectImages.length}`;
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.currentProjectImages.length) % this.currentProjectImages.length;
    this.updateModalImage();
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.currentProjectImages.length;
    this.updateModalImage();
  }

  setupProjectImageEvents(projectImages) {
    document.querySelectorAll(".project-img").forEach(img => {
      img.addEventListener("click", () => {
        const projectTitle = img.dataset.projectTitle;
        const images = projectImages.get(projectTitle);
        this.openModal(images, 0);
      });
    });
  }
}

export const modal = new ModalManager();