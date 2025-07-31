import { CONFIG } from './constants.js';

class ScrollManager {
  constructor() {
    this.scrollChevron = document.getElementById("scroll-chevron");
    this.scrollToTopBtn = document.getElementById("scroll-to-top");
    this.init();
  }

  init() {
    setTimeout(() => {
      const chevron = document.querySelector('.scroll-chevron');
      chevron.classList.remove('hidden');
    }, CONFIG.ANIMATION.CHEVRON_SHOW_DELAY);

    window.addEventListener("scroll", this.handleScroll.bind(this));
    this.scrollToTopBtn.addEventListener("click", this.scrollToTop);
  }

  handleScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > CONFIG.SCROLL.HIDE_THRESHOLD) {
      this.scrollChevron.classList.add("hidden");
    } else {
      this.scrollChevron.classList.remove("hidden");
    }

    if (scrollY > CONFIG.SCROLL.SCROLL_TO_TOP_THRESHOLD) {
      this.scrollToTopBtn.classList.remove("hidden");
    } else {
      this.scrollToTopBtn.classList.add("hidden");
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

class LanguageDropdown {
  constructor(i18nManager) {
    this.i18n = i18nManager;
    this.langDropdown = document.getElementById('lang-dropdown');
    this.langList = document.getElementById('lang-list');
    this.langFlag = document.getElementById('lang-flag');
    this.langAbbr = document.getElementById('lang-abbr');
    this.init();
  }

  init() {
    this.loadFlagSVGs();
    this.setupEventListeners();
    this.updateLangDropdown();
  }

  async loadFlagSVGs() {
    await this.loadFlagSVG('flag-en', CONFIG.SVG_PATHS.FLAG_EN);
    await this.loadFlagSVG('flag-de', CONFIG.SVG_PATHS.FLAG_DE);
  }

  async loadFlagSVG(flagId, svgPath) {
    try {
      const response = await fetch(svgPath);
      const svg = await response.text();
      document.getElementById(flagId).innerHTML = svg;
    } catch (error) {
      console.error(`Failed to load flag SVG: ${svgPath}`, error);
    }
  }

  setupEventListeners() {
    this.langDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = this.langDropdown.getAttribute('aria-expanded') === 'true';
      this.langDropdown.setAttribute('aria-expanded', !expanded);
      this.langList.classList.toggle('hidden');
    });

    this.langList.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-lang]');
      if (li) {
        this.i18n.setLanguage(li.dataset.lang);
        this.langDropdown.setAttribute('aria-expanded', 'false');
        this.langList.classList.add('hidden');
        this.updateLangDropdown();
      }
    });

    document.addEventListener('click', (e) => {
      if (!this.langDropdown.contains(e.target) && !this.langList.contains(e.target)) {
        this.langDropdown.setAttribute('aria-expanded', 'false');
        this.langList.classList.add('hidden');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.langDropdown.setAttribute('aria-expanded', 'false');
        this.langList.classList.add('hidden');
      }
    });
  }

  async updateLangDropdown() {
    const currentLang = this.i18n.getCurrentLang();
    const flagPath = currentLang === 'en' ? CONFIG.SVG_PATHS.FLAG_EN : CONFIG.SVG_PATHS.FLAG_DE;
    
    try {
      const response = await fetch(flagPath);
      const svg = await response.text();
      this.langFlag.innerHTML = svg;
    } catch (error) {
      console.error('Failed to update flag:', error);
    }

    this.langAbbr.textContent = currentLang.toUpperCase();
    
    document.querySelectorAll('.lang-list li').forEach(li => {
      li.setAttribute('aria-selected', li.dataset.lang === currentLang ? 'true' : 'false');
    });
  }
}

class FooterManager {
  constructor() {
    this.init();
  }

  init() {
    const yearSpan = document.getElementById("current-year");
    yearSpan.textContent = new Date().getFullYear();
  }
}

export { ScrollManager, LanguageDropdown, FooterManager };