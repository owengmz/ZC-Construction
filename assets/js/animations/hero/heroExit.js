import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO } from '../animConfig.js';

export function initHeroExit() {
  const section = document.getElementById('hero');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: HERO.scrub,
    },
  });

  tl
    .to(
      '#hero-logo',
      {
        autoAlpha: 0,
        y: -40,
        scale: 0.88,
        ease: HERO.ease.exit,
      },
      0
    )
    .to(
      '#hero-title',
      {
        autoAlpha: 0,
        y: -28,
        ease: HERO.ease.exit,
      },
      0.04
    )
    .to(
      '#hero-subtitle',
      {
        autoAlpha: 0,
        y: -18,
        ease: HERO.ease.exit,
      },
      0.08
    )
    .to(
      '#hero-ctas > *',
      {
        autoAlpha: 0,
        y: -12,
        ease: HERO.ease.exit,
      },
      0.12
    );
}
