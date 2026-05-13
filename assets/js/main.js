import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './lang-toggle.js';
import './whatsapp-fab.js';
import './mobile-menu.js';
import './contact-form.js';
import './warranty-modal.js';

import { initHeroBg } from './animations/hero/heroBg.js';
import { initHeroEntrance } from './animations/hero/heroEntrance.js';
import { initHeroExit } from './animations/hero/heroExit.js';
import { initServices } from './animations/sections/animServices.js';
import { initInsurance } from './animations/sections/animInsurance.js';
import { initContact } from './animations/sections/animContact.js';

gsap.registerPlugin(ScrollTrigger);

document.getElementById('copyright-year').textContent = new Date().getFullYear();

const mm = gsap.matchMedia();

mm.add(
  {
    motion: '(prefers-reduced-motion: no-preference)',
    reduced: '(prefers-reduced-motion: reduce)',
  },
  (context) => {
    const { motion } = context.conditions;

    if (motion) {
      initHeroBg();
      initHeroEntrance();
      initHeroExit();
    }

    initServices(motion);
    initInsurance(motion);
    initContact(motion);
  }
);
