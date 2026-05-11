import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO } from '../animConfig.js';

export function initHeroBg() {
  const bg = document.getElementById('hero-bg');
  const section = document.getElementById('hero');

  gsap.from(bg, {
    autoAlpha: 0,
    scale: 1.1,
    duration: HERO.duration.bg,
    ease: HERO.ease.bg,
  });

  gsap.to(bg, {
    scale: 1.14,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: HERO.scrub,
    },
  });
}
