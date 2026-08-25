import { SECTION } from '../animConfig.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initPortfolio(motion) {
  if (!motion) return;

  gsap.from('#portfolio .mb-16', {
    scrollTrigger: {
      trigger: '#portfolio',
      start: SECTION.start.title,
      once: true,
    },
    autoAlpha: 0,
    x: -35,
    duration: 0.7,
    ease: SECTION.ease,
  });

  gsap.from('#portfolio .group', {
    scrollTrigger: {
      trigger: '#portfolio',
      start: SECTION.start.cards,
      once: true,
    },
    autoAlpha: 0,
    y: 45,
    duration: 0.7,
    stagger: 0.15,
    ease: SECTION.ease,
  });
}
