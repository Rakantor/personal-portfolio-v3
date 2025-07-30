const cdn = "https://d29l6egdxvgg9c.cloudfront.net/";

// Function to load welcome SVG based on language
async function loadWelcomeSVG(lang) {
  try {
    const svgPath = `svg/welcome_${lang}.svg`;
    const response = await fetch(svgPath);
    if (!response.ok) {
      throw new Error(`Failed to load SVG: ${response.status}`);
    }
    const svgContent = await response.text();
    
    document.getElementById('welcome-container').innerHTML = svgContent;
    
    // Start animation after a short delay
    setTimeout(() => {
      fillPath('welcome', 'welcome_path', '#fff');
    }, 100);
  } catch (error) {
    console.error('Failed to load welcome SVG:', error);
    // Fallback to English if the requested language fails
    if (lang !== 'en') {
      loadWelcomeSVG('en');
    }
  }
}

// Welcome SVG animation
const fillPath = (svgId, pathId, color) => {
  setTimeout(() => {
    let currentFrame = 0;
    const totalFrames = 800;
    const svg = document.getElementById(svgId);
    const path = svg.getElementById ? svg.getElementById(pathId) : svg.querySelector(`#${pathId}`);

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length} ${length}`;
    path.style.strokeDashoffset = length;
    path.style.stroke = color;

    const draw = () => {
      const progress = currentFrame / totalFrames;
      if (progress > 0.25) {
        path.style.fill = color;
        window.cancelAnimationFrame(handle);
      } else {
        currentFrame++;
        path.style.strokeDashoffset = Math.floor(length * (1 - progress));
        handle = window.requestAnimationFrame(draw);
      }
    };

    let handle = window.requestAnimationFrame(draw);
  }, 100);
};

// Typing animation for hero text
function startTypingAnimation() {
  const container = document.getElementById("animated-text");
  const text = t('hero.intro');
  const words = text.split(" ");
  let currentWord = 0;
  container.textContent = ""; // Clear any previous content
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
}

// Show scroll down chevron after 5 seconds
setTimeout(() => {
  const chevron = document.querySelector('.scroll-chevron');
  chevron.classList.remove('hidden');
}, 5000);

// Scroll down chevron functionality
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

let currentLang = 'en';
let messages = null;

// Load messages first
async function loadMessages() {
  try {
    const response = await fetch('messages.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    messages = await response.json();
  } catch (error) {
    console.error('Failed to load messages:', error);
    // Fallback to English-only mode
    messages = {
      en: {
        hero: { intro: "I'm a Software Developer based in Vienna, Austria. I have a passion for crafting a wide range of applications." },
        projects: { title: "My Work", subtitle: "A collection of projects I've worked on." }
      }
    };
  }
}

// Function to change language
function setLanguage(lang) {
  currentLang = lang;
  loadWelcomeSVG(lang);
  updateContent();
  startTypingAnimation();
}

// Function to get translated text
function t(key) {
  const keys = key.split('.');
  let value = messages[currentLang];
  for (const k of keys) {
    value = value[k];
  }
  return value;
}

// Update all content
function updateContent() {
  // Update hero text
  document.getElementById('animated-text').textContent = t('hero.intro');
  
  // Update project titles and subtitles
  document.querySelector('.projects-text h2').textContent = t('projects.title');
  document.querySelector('.projects-text p').textContent = t('projects.subtitle');
  
  // Update project descriptions
  const projects = document.querySelectorAll('.project-text');
  projects.forEach(project => {
    const key = project.dataset.textKey;
    if (key) {
      project.querySelector('.project-paragraph').textContent = t(`projects.${key}`);
    }
  });
}

// Initialize
async function init() {
  await loadMessages();
  loadWelcomeSVG(currentLang);
  startTypingAnimation();
  // Load projects after messages are loaded
  fetch("projects.json")
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(async data => {
      // Store image URLs without preloading for lazy loading
      data.data.forEach(project => {
        projectImages.set(project.title, project.images.map(imgPath => `${cdn}${imgPath}`));
      });

      // Then create project elements
      data.data.forEach(project => {
        const projectDiv = document.createElement("div");
        projectDiv.className = "project";

        // Project image
        const wrapDiv = document.createElement("div");
        wrapDiv.className = "project-wrap";

        const imgDiv = document.createElement("div");
        imgDiv.className = "project-img";
        imgDiv.dataset.projectTitle = project.title; // Store project title for modal
        imgDiv.dataset.bgImage = projectImages.get(project.title)[0]; // Store image URL for lazy loading
        
        // Implement lazy loading with Intersection Observer
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const target = entry.target;
              target.style.backgroundImage = `url('${target.dataset.bgImage}')`;
              observer.unobserve(target);
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(imgDiv);

        wrapDiv.appendChild(imgDiv);

        // Project text
        const textDiv = document.createElement("div");
        textDiv.dataset.textKey = project.text;
        textDiv.className = "project-text";

        const title = document.createElement("h3");
        title.className = "project-title";
        title.textContent = project.title;

        const para = document.createElement("p");
        para.className = "project-paragraph";
        para.textContent = t(`projects.${project.text}`);

        textDiv.appendChild(title);
        textDiv.appendChild(para);

        wrapDiv.appendChild(textDiv);

        // Used technologies as badges/chips
        const techDiv = document.createElement("div");
        techDiv.className = "project-tech";
        project.tech.forEach(tech => {
          const chip = document.createElement("span");
          chip.className = "tech-chip";
          chip.textContent = tech;
          techDiv.appendChild(chip);
        });
        textDiv.appendChild(techDiv);

        // Buttons
        const btnDiv = document.createElement("div");
        btnDiv.className = "project-buttons";

        project.buttons.forEach(async button => {
          const a = document.createElement("a");
          a.href = button.href;
          a.setAttribute("aria-label", button.aria);
          a.target = "_blank";
          a.rel = "noopener";

          // Load SVG inline for proper CSS styling
          let svgPath;
          if (button.icon === "WebSVG") {
            svgPath = "./svg/web.svg";
          } else if (button.icon === "GITSVG") {
            svgPath = "./svg/github.svg";
          } else if (button.icon === "NPMSVG") {
            svgPath = "./svg/pdf.svg";
          } else {
            // Fallback to img element for custom icons
            const img = document.createElement("img");
            img.src = button.icon;
            img.alt = button.aria || "Project Icon";
            img.width = 32;
            img.height = 32;
            a.appendChild(img);
            btnDiv.appendChild(a);
            return;
          }

          try {
            const response = await fetch(svgPath);
            const svgContent = await response.text();
            const div = document.createElement("div");
            div.className = "project-btn-icon";
            div.innerHTML = svgContent;
            
            // Set width and height on the SVG element
            const svg = div.querySelector("svg");
            if (svg) {
              svg.setAttribute("width", "32");
              svg.setAttribute("height", "32");
            }
            
            a.appendChild(div);
          } catch (error) {
            console.error(`Failed to load SVG: ${svgPath}`, error);
            // Fallback to img element
            const img = document.createElement("img");
            img.src = svgPath;
            img.alt = button.aria || "Project Icon";
            img.width = 32;
            img.height = 32;
            a.appendChild(img);
          }

          btnDiv.appendChild(a);
        });

        projectDiv.appendChild(wrapDiv);
        projectDiv.appendChild(btnDiv);

        grid.appendChild(projectDiv);
      });

      // After creating projects, set up modal events
      setupModalEvents();
    })
    .catch(err => {
      console.error("Failed to load projects:", err);
      // Show error message to user
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'padding: 2rem; text-align: center; color: #666;';
      errorDiv.textContent = 'Unable to load projects. Please check your connection and try again.';
      grid.appendChild(errorDiv);
    });
  // ... rest of your initialization code
}

init();

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

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
  updateModalImage();
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
  updateModalImage();
}

prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  prevImage();
});

nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  nextImage();
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// Add keyboard navigation for modal
document.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("hidden")) {
    switch(e.key) {
      case "Escape":
        modal.classList.add("hidden");
        break;
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        nextImage();
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        prevImage();
        break;
    }
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

// --- Language Switcher Dropdown Logic ---
const langDropdown = document.getElementById('lang-dropdown');
const langList = document.getElementById('lang-list');
const langFlag = document.getElementById('lang-flag');
const langAbbr = document.getElementById('lang-abbr');

// Load SVGs for flags from /svg instead of inlining
function loadFlagSVG(flagId, svgPath) {
  fetch(svgPath)
    .then(response => response.text())
    .then(svg => {
      document.getElementById(flagId).innerHTML = svg;
    });
}
loadFlagSVG('flag-en', 'svg/flag_gb.svg');
loadFlagSVG('flag-de', 'svg/flag_at.svg');

const FLAGS = {
  en: 'svg/flag_gb.svg',
  de: 'svg/flag_at.svg'
};

function updateLangDropdown() {
  // Load the flag SVG for the current language
  fetch(FLAGS[currentLang])
    .then(response => response.text())
    .then(svg => {
      langFlag.innerHTML = svg;
    });
  langAbbr.textContent = currentLang.toUpperCase();
  // Highlight selected in dropdown
  document.querySelectorAll('.lang-list li').forEach(li => {
    li.setAttribute('aria-selected', li.dataset.lang === currentLang ? 'true' : 'false');
  });
}

langDropdown.addEventListener('click', (e) => {
  e.stopPropagation();
  const expanded = langDropdown.getAttribute('aria-expanded') === 'true';
  langDropdown.setAttribute('aria-expanded', !expanded);
  langList.classList.toggle('hidden');
});

langList.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-lang]');
  if (li) {
    setLanguage(li.dataset.lang);
    langDropdown.setAttribute('aria-expanded', 'false');
    langList.classList.add('hidden');
    updateLangDropdown();
  }
});

document.addEventListener('click', (e) => {
  if (!langDropdown.contains(e.target) && !langList.contains(e.target)) {
    langDropdown.setAttribute('aria-expanded', 'false');
    langList.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    langDropdown.setAttribute('aria-expanded', 'false');
    langList.classList.add('hidden');
  }
});

// Update dropdown on language change
const origSetLanguage = setLanguage;
setLanguage = function(lang) {
  origSetLanguage(lang);
  updateLangDropdown();
};

// Initial render
updateLangDropdown();