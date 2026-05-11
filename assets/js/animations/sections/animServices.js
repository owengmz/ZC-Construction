import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SECTION } from '../animConfig.js';

export function initServices(motion) {
  if (!motion) return;

  gsap.from('#services .mb-16', {
    scrollTrigger: { trigger: '#services', start: SECTION.start.title, toggleActions: 'play none none none', once: true },
    autoAlpha: 0,
    x: -35,
    duration: 0.7,
    ease: SECTION.ease,
  });

  gsap.from('#services .structural-card', {
    scrollTrigger: { trigger: '#services', start: SECTION.start.cards, toggleActions: 'play none none none', once: true },
    autoAlpha: 0,
    y: 55,
    duration: 0.75,
    stagger: 0.18,
    ease: SECTION.ease,
  });
}
