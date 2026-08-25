import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SECTION } from '../animConfig.js';

export function initInsurance(motion) {
  if (!motion) return;

  gsap.from('#insurance .mb-16', {
    scrollTrigger: { trigger: '#insurance', start: SECTION.start.title, toggleActions: 'play none none none', once: true },
    autoAlpha: 0,
    x: -35,
    duration: 0.7,
    ease: SECTION.ease,
  });

  const cards = gsap.utils.toArray('#insurance .structural-card');
  cards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: '#insurance', start: SECTION.start.cards, toggleActions: 'play none none none', once: true },
      autoAlpha: 0,
      x: i === 0 ? -45 : 45,
      duration: 0.75,
      delay: i * 0.18,
      ease: SECTION.ease,
    });
  });
}
