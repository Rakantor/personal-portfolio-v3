const cdn = "https://d29l6egdxvgg9c.cloudfront.net/";

// Typing animation
const text = "I'm a Software Developer based in Vienna, Austria. I have a passion for crafting a wide range of applications.";

const words = text.split(" ");
const container = document.getElementById("animated-text");
let currentWord = 0;

function showNextWord() {
  if (currentWord < words.length) {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = words[currentWord];

    container.appendChild(span);
    container.appendChild(document.createTextNode(" "));

    void span.offsetWidth; // Force reflow to start animation
    span.classList.add("visible");

    currentWord++;
    setTimeout(showNextWord, 30);
  }
}

showNextWord();

// Show chevron after 5 seconds
setTimeout(() => {
  const chevron = document.querySelector('.scroll-chevron');
  chevron.classList.remove('hidden');
}, 5000);

// Scroll arrow functionality
const scrollChevron = document.getElementById("scroll-chevron");

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    scrollChevron.classList.add("hidden");
  } else {
    scrollChevron.classList.remove("hidden");
  }
});

// Load projects
const grid = document.getElementById("project-grid");
let projectImages = new Map(); // Store project images by project title

fetch("projects.json")
  .then(res => res.json())
  .then(async data => {
    // Preload all images first
    await Promise.all(data.data.map(async project => {
      projectImages.set(project.title, await Promise.all(
        project.images.map(async imgPath => {
          const imgUrl = `${cdn}${imgPath}`;
          const img = new Image();
          img.src = imgUrl;
          await img.decode(); // Wait for image to load
          return imgUrl;
        })
      ));
    }));

    // Then create project elements
    data.data.forEach(project => {
      const projectDiv = document.createElement("div");
      projectDiv.className = "project";

      // Project image
      const wrapDiv = document.createElement("div");
      wrapDiv.className = "project-wrap";

      const imgDiv = document.createElement("div");
      imgDiv.className = "project-img";
      imgDiv.style.backgroundImage = `url('${projectImages.get(project.title)[0]}')`;
      imgDiv.dataset.projectTitle = project.title; // Store project title for modal

      wrapDiv.appendChild(imgDiv);

      // Project text
      const textDiv = document.createElement("div");
      textDiv.className = "project-text";

      const title = document.createElement("h3");
      title.textContent = project.title;

      const para = document.createElement("p");
      para.className = "project-parragraph";
      para.textContent = project.text;

      textDiv.appendChild(title);
      textDiv.appendChild(para);

      wrapDiv.appendChild(textDiv);

      // Buttons
      const btnDiv = document.createElement("div");
      btnDiv.className = "project-buttons";

      project.buttons.forEach(button => {
        const a = document.createElement("a");
        a.href = button.href;
        a.setAttribute("aria-label", button.aria);
        a.target = "_blank";
        a.rel = "noopener";

        // Simple icon fallback
        const img = document.createElement("img");
        if (button.icon === "WebSVG") {
          img.src = "./svg/web.svg";
          img.alt = "Web Icon";
        } else if (button.icon === "GITSVG") {
          img.src = "./svg/github.svg";
          img.alt = "GitHub Icon";
        } else if (button.icon === "NPMSVG") {
          img.src = "./svg/pdf.svg";
          img.alt = "PDF Icon";
        } else {
          img.src = button.icon; // Fallback to custom icon
          img.alt = button.aria || "Project Icon";
        }

        img.width = 32;
        img.height = 32;
        a.appendChild(img);

        btnDiv.appendChild(a);
      });

      projectDiv.appendChild(wrapDiv);
      projectDiv.appendChild(btnDiv);

      grid.appendChild(projectDiv);
    });

    // After creating projects, set up modal events
    setupModalEvents();
  })
  .catch(err => console.error("Failed to load projects:", err));

// Updated Modal code
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.getElementById("modal-close");

// Add navigation buttons to modal
modal.insertAdjacentHTML('beforeend', `
  <button id="prev-img" class="modal-nav">&lt;</button>
  <button id="next-img" class="modal-nav">&gt;</button>
  <div id="image-counter" class="image-counter">1/1</div>
`);

const prevBtn = document.getElementById("prev-img");
const nextBtn = document.getElementById("next-img");
const imageCounter = document.getElementById("image-counter");

let currentImageIndex = 0;
let currentProjectImages = [];

function updateModalImage() {
  modalImg.src = currentProjectImages[currentImageIndex];
  imageCounter.textContent = `${currentImageIndex + 1}/${currentProjectImages.length}`;
}

function setupModalEvents() {
  document.querySelectorAll(".project-img").forEach(img => {
    img.addEventListener("click", () => {
      const projectTitle = img.dataset.projectTitle;
      currentProjectImages = projectImages.get(projectTitle);
      currentImageIndex = 0;
      updateModalImage();
      modal.classList.remove("hidden");
    });
  });
}

prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
  updateModalImage();
});

nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
  updateModalImage();
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// Set current year in footer
const yearSpan = document.getElementById("current-year");
yearSpan.textContent = new Date().getFullYear();

// Add scroll to top functionality
const scrollToTopBtn = document.getElementById("scroll-to-top");
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Show scroll to top button after scrolling down
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.remove("hidden");
  } else {
    scrollToTopBtn.classList.add("hidden");
  }
});