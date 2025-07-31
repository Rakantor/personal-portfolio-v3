import { CONFIG } from './constants.js';

export async function loadWelcomeSVG(lang) {
  try {
    const svgPath = `svg/welcome_${lang}.svg`;
    const response = await fetch(svgPath);
    if (!response.ok) {
      throw new Error(`Failed to load SVG: ${response.status}`);
    }
    const svgContent = await response.text();
    
    document.getElementById('welcome-container').innerHTML = svgContent;
    
    setTimeout(() => {
      animateWelcomeSVG('welcome', 'welcome_path', '#fff');
    }, CONFIG.ANIMATION.WELCOME_DELAY);
  } catch (error) {
    console.error('Failed to load welcome SVG:', error);
    if (lang !== 'en') {
      loadWelcomeSVG('en');
    }
  }
}

export const animateWelcomeSVG = (svgId, pathId, color) => {
  setTimeout(() => {
    let currentFrame = 0;
    const svg = document.getElementById(svgId);
    const path = svg.getElementById ? svg.getElementById(pathId) : svg.querySelector(`#${pathId}`);

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length} ${length}`;
    path.style.strokeDashoffset = length;
    path.style.stroke = color;

    const draw = () => {
      const progress = currentFrame / CONFIG.ANIMATION.TOTAL_FRAMES;
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
  }, CONFIG.ANIMATION.WELCOME_DELAY);
};

export function startTypingAnimation(textGetter) {
  const container = document.getElementById("animated-text");
  const text = textGetter('hero.intro');
  const words = text.split(" ");
  let currentWord = 0;
  container.textContent = "";
  
  function showNextWord() {
    if (currentWord < words.length) {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = words[currentWord];
      container.appendChild(span);
      container.appendChild(document.createTextNode(" "));
      void span.offsetWidth;
      span.classList.add("visible");
      currentWord++;
      setTimeout(showNextWord, CONFIG.ANIMATION.TYPING_DELAY);
    }
  }

  showNextWord();
}

export function animateTextChange(elements, updateCallback) {
  elements.forEach(el => {
    if (el) {
      el.classList.add('lang-switching');
    }
  });

  setTimeout(() => {
    updateCallback();
    elements.forEach(el => {
      if (el) {
        el.classList.remove('lang-switching');
      }
    });
  }, 150);
}