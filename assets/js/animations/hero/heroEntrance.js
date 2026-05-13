import gsap from 'gsap';
import { HERO } from '../animConfig.js';

export function initHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: HERO.ease.enter } });

  tl
    .from('#hero-logo', {
      opacity: 0,
      scale: 0.78,
      rotation: -4,
      duration: HERO.duration.logo,
    })
    .from(
      '#hero-title',
      {
        opacity: 0,
        y: 60,
        duration: HERO.duration.title,
      },
      '-=0.75'
    )
    .from(
      '#hero-subtitle',
      {
        opacity: 0,
        y: 30,
        filter: 'blur(8px)',
        duration: HERO.duration.subtitle,
      },
      '-=0.6'
    )
    .from(
      '#hero-ctas > *',
      {
        opacity: 0,
        y: 24,
        scale: 0.94,
        duration: HERO.duration.ctas,
        stagger: 0.2,
        ease: 'back.out(1.5)',
      },
      '-=0.5'
    );
}
