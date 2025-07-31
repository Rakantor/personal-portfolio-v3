import { CONFIG, FALLBACK_MESSAGES } from './constants.js';
import { loadWelcomeSVG, startTypingAnimation, animateTextChange } from './animations.js';

class I18nManager {
  constructor() {
    this.currentLang = CONFIG.DEFAULT_LANGUAGE;
    this.messages = null;
  }

  async loadMessages() {
    try {
      const response = await fetch('messages.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.messages = await response.json();
    } catch (error) {
      console.error('Failed to load messages:', error);
      this.messages = FALLBACK_MESSAGES;
    }
  }

  t(key) {
    const keys = key.split('.');
    let value = this.messages[this.currentLang];
    for (const k of keys) {
      value = value[k];
    }
    return value;
  }

  setLanguage(lang) {
    this.currentLang = lang;
    loadWelcomeSVG(lang);
    this.updateContent();
    startTypingAnimation((key) => this.t(key));
  }

  updateContent() {
    document.getElementById('animated-text').textContent = this.t('hero.intro');
    
    this.updateStaticContentWithAnimation();
    this.updateProjectTextsWithAnimation();
  }

  updateStaticContentWithAnimation() {
    if (!this.messages) return;
    
    const projectsTitle = document.querySelector('.projects-text h2');
    const projectsSubtitle = document.querySelector('.projects-text p');
    
    animateTextChange([projectsTitle, projectsSubtitle], () => {
      if (projectsTitle) {
        projectsTitle.textContent = this.t('projects.title');
      }
      if (projectsSubtitle) {
        projectsSubtitle.textContent = this.t('projects.subtitle');
      }
    });
  }

  updateProjectTextsWithAnimation() {
    const projects = document.querySelectorAll('.project-text');
    const paragraphs = Array.from(projects).map(project => project.querySelector('.project-paragraph'));
    
    animateTextChange(paragraphs, () => {
      projects.forEach(project => {
        const key = project.dataset.textKey;
        if (key) {
          project.querySelector('.project-paragraph').textContent = this.t(`projects.${key}`);
        }
      });
    });
  }

  getCurrentLang() {
    return this.currentLang;
  }
}

export const i18n = new I18nManager();