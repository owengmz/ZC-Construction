'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

import { LangToggle } from '@/components/ui/LangToggle';
import { useLang } from '@/context/LangContext';
import { ORDEN_SECCIONES } from '@/data/navigation';
import { siteConfig } from '@/data/site';
import { useNavbarScroll } from '@/hooks/useNavbarScroll';

import { MobileMenu } from './MobileMenu';
import styles from './Navbar.module.css';

/**
 * Barra de navegación fija con selector de idioma y menú móvil.
 *
 * Reúne lo que en el sitio actual estaba repartido entre el marcado del
 * `<header>`, `navbar-scroll.js` y `mobile-menu.js`.
 *
 * El logo sale del maestro único de `siteConfig`: `next/image` genera el
 * tamaño que toca. El sitio anterior servía aquí un `logo-navbar.webp` de
 * 320×213 mantenido a mano.
 */
export function Navbar() {
  const { content } = useLang();
  const isScrolled = useNavbarScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // `useCallback` porque se pasa a MobileMenu, que lo usa como dependencia de
  // un efecto: una identidad nueva en cada render reengancharía los listeners.
  const cerrarMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <>
      <header
        id="site-header"
        className={isScrolled ? `${styles.header} ${styles.headerScrolled}` : styles.header}
      >
        <nav className={styles.nav}>
          <div className={styles.marca}>
            <a href="#hero">
              <Image
                src={siteConfig.logo.src}
                alt={content.nav.logoAlt}
                width={siteConfig.logo.width}
                height={siteConfig.logo.height}
                className={styles.logo}
                /**
                 * El logo es visible desde el primer instante, así que no debe
                 * cargarse en diferido: aparecería con un salto. `sizes` acota
                 * lo que se descarga a lo que realmente ocupa en pantalla
                 * (72 px de ancho en móvil, 84 px a partir de 768 px), no a los
                 * 1536 px del archivo maestro.
                 */
                priority
                sizes="(max-width: 767px) 72px, 84px"
              />
            </a>
            <a href="#hero" className={styles.marcaTexto}>
              {siteConfig.brandName}
            </a>
          </div>

          <div className={styles.enlaces}>
            {ORDEN_SECCIONES.map((seccion) => (
              <a key={seccion} href={`#${seccion}`} className={styles.enlace}>
                {content.nav.links[seccion]}
              </a>
            ))}
          </div>

          <div className={styles.acciones}>
            <LangToggle />

            <a href="#contact" className={styles.cta}>
              {content.nav.ctaDesktop}
            </a>

            <button
              type="button"
              className={styles.hamburguesa}
              onClick={() => setIsMenuOpen((abierto) => !abierto)}
              aria-label={isMenuOpen ? content.nav.closeMenuLabel : content.nav.openMenuLabel}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span
                className={isMenuOpen ? `${styles.barra} ${styles.barraAbierta1}` : styles.barra}
              />
              <span
                className={isMenuOpen ? `${styles.barra} ${styles.barraAbierta2}` : styles.barra}
              />
              <span
                className={isMenuOpen ? `${styles.barra} ${styles.barraAbierta3}` : styles.barra}
              />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={cerrarMenu} />
    </>
  );
}
