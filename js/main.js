import { i18n } from './i18n.js';
import { loadWelcomeSVG, startTypingAnimation } from './animations.js';
import { ProjectsManager } from './projects.js';
import { ScrollManager, LanguageDropdown, FooterManager } from './ui.js';

class App {
  constructor() {
    this.i18n = i18n;
    this.projectsManager = new ProjectsManager(this.i18n);
    this.scrollManager = new ScrollManager();
    this.languageDropdown = new LanguageDropdown(this.i18n);
    this.footerManager = new FooterManager();
  }

  async init() {
    try {
      await this.i18n.loadMessages();
      this.i18n.updateStaticContentWithAnimation();
      loadWelcomeSVG(this.i18n.getCurrentLang());
      startTypingAnimation((key) => this.i18n.t(key));
      await this.projectsManager.loadProjects();
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }
}

const app = new App();
app.init();