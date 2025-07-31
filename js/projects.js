import { CONFIG } from './constants.js';
import { modal } from './modal.js';

class ProjectsManager {
  constructor(i18nManager) {
    this.i18n = i18nManager;
    this.grid = document.getElementById("project-grid");
    this.projectImages = new Map();
  }

  async loadProjects() {
    try {
      const response = await fetch("projects.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      data.data.forEach(project => {
        this.projectImages.set(project.title, project.images.map(imgPath => `${CONFIG.CDN}${imgPath}`));
      });

      for (const project of data.data) {
        await this.createProjectElement(project);
      }

      modal.setupProjectImageEvents(this.projectImages);
    } catch (error) {
      console.error("Failed to load projects:", error);
      this.showErrorMessage();
    }
  }

  async createProjectElement(project) {
    const projectDiv = document.createElement("div");
    projectDiv.className = "project";

    const wrapDiv = document.createElement("div");
    wrapDiv.className = "project-wrap";

    const imgDiv = this.createImageDiv(project);
    const textDiv = this.createTextDiv(project);
    const btnDiv = await this.createButtonsDiv(project);

    wrapDiv.appendChild(imgDiv);
    wrapDiv.appendChild(textDiv);
    
    projectDiv.appendChild(wrapDiv);
    projectDiv.appendChild(btnDiv);

    this.grid.appendChild(projectDiv);
  }

  createImageDiv(project) {
    const imgDiv = document.createElement("div");
    imgDiv.className = "project-img";
    imgDiv.dataset.projectTitle = project.title;
    imgDiv.dataset.bgImage = this.projectImages.get(project.title)[0];
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.style.backgroundImage = `url('${target.dataset.bgImage}')`;
          observer.unobserve(target);
        }
      });
    }, { threshold: CONFIG.INTERSECTION.THRESHOLD });
    
    observer.observe(imgDiv);
    return imgDiv;
  }

  createTextDiv(project) {
    const textDiv = document.createElement("div");
    textDiv.dataset.textKey = project.text;
    textDiv.className = "project-text";

    const title = document.createElement("h3");
    title.className = "project-title";
    title.textContent = project.title;

    const para = document.createElement("p");
    para.className = "project-paragraph";
    para.textContent = this.i18n.t(`projects.${project.text}`);

    const techDiv = document.createElement("div");
    techDiv.className = "project-tech";
    project.tech.forEach(tech => {
      const chip = document.createElement("span");
      chip.className = "tech-chip";
      chip.textContent = tech;
      techDiv.appendChild(chip);
    });

    textDiv.appendChild(title);
    textDiv.appendChild(para);
    textDiv.appendChild(techDiv);

    return textDiv;
  }

  async createButtonsDiv(project) {
    const btnDiv = document.createElement("div");
    btnDiv.className = "project-buttons";

    for (const button of project.buttons) {
      const a = document.createElement("a");
      a.href = button.href;
      a.setAttribute("aria-label", button.aria);
      a.target = "_blank";
      a.rel = "noopener";

      const iconElement = await this.createButtonIcon(button);
      a.appendChild(iconElement);
      btnDiv.appendChild(a);
    }

    return btnDiv;
  }

  async createButtonIcon(button) {
    const svgPath = this.getSvgPath(button.icon);
    
    if (!svgPath) {
      return this.createFallbackIcon(button);
    }

    try {
      const response = await fetch(svgPath);
      const svgContent = await response.text();
      const div = document.createElement("div");
      div.className = "project-btn-icon";
      div.innerHTML = svgContent;
      
      const svg = div.querySelector("svg");
      if (svg) {
        svg.setAttribute("width", CONFIG.ICON_SIZE.WIDTH);
        svg.setAttribute("height", CONFIG.ICON_SIZE.HEIGHT);
      }
      
      return div;
    } catch (error) {
      console.error(`Failed to load SVG: ${svgPath}`, error);
      return this.createFallbackIcon(button);
    }
  }

  getSvgPath(iconType) {
    const svgMap = {
      "WebSVG": CONFIG.SVG_PATHS.WEB,
      "GITSVG": CONFIG.SVG_PATHS.GITHUB,
      "PDFSVG": CONFIG.SVG_PATHS.PDF
    };
    return svgMap[iconType];
  }

  createFallbackIcon(button) {
    const img = document.createElement("img");
    img.src = this.getSvgPath(button.icon) || button.icon;
    img.alt = button.aria || "Project Icon";
    img.width = CONFIG.ICON_SIZE.WIDTH;
    img.height = CONFIG.ICON_SIZE.HEIGHT;
    return img;
  }

  showErrorMessage() {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'padding: 2rem; text-align: center; color: #666;';
    errorDiv.textContent = 'Unable to load projects. Please check your connection and try again.';
    this.grid.appendChild(errorDiv);
  }
}

export { ProjectsManager };