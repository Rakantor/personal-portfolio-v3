export const CONFIG = {
  CDN: "https://d29l6egdxvgg9c.cloudfront.net/",
  ANIMATION: {
    TOTAL_FRAMES: 800,
    TYPING_DELAY: 30,
    WELCOME_DELAY: 100,
    CHEVRON_SHOW_DELAY: 5000
  },
  SCROLL: {
    HIDE_THRESHOLD: 10,
    SCROLL_TO_TOP_THRESHOLD: 300
  },
  INTERSECTION: {
    THRESHOLD: 0.1
  },
  DEFAULT_LANGUAGE: 'en',
  SVG_PATHS: {
    WEB: "./svg/web.svg",
    GITHUB: "./svg/github.svg",
    PDF: "./svg/pdf.svg",
    FLAG_EN: 'svg/flag_gb.svg',
    FLAG_DE: 'svg/flag_at.svg'
  },
  ICON_SIZE: {
    WIDTH: 32,
    HEIGHT: 32
  }
};

export const FALLBACK_MESSAGES = {
  en: {
    hero: { 
      intro: "I'm a Software Developer based in Vienna, Austria. I have a passion for crafting a wide range of applications." 
    },
    projects: { 
      title: "My Work", 
      subtitle: "A collection of projects I've worked on." 
    }
  }
};