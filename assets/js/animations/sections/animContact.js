import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SECTION } from '../animConfig.js';

export function initContact(motion) {
  if (!motion) return;

  gsap.from('#contact h2', {
    scrollTrigger: { trigger: '#contact', start: SECTION.start.title, toggleActions: 'play none none none', once: true },
    autoAlpha: 0,
    x: -35,
    duration: 0.7,
    ease: SECTION.ease,
  });

  gsap.from('#contact .space-y-8 > div', {
    scrollTrigger: { trigger: '#contact', start: SECTION.start.cards, toggleActions: 'play none none none', once: true },
    autoAlpha: 0,
    x: -25,
    duration: 0.55,
    stagger: 0.12,
    ease: SECTION.ease,
  });

  gsap.from('#contact form', {
    scrollTrigger: { trigger: '#contact', start: SECTION.start.cards, toggleActions: 'play none none none', once: true },
    autoAlpha: 0,
    y: 35,
    duration: 0.75,
    delay: 0.25,
    ease: SECTION.ease,
  });
}
