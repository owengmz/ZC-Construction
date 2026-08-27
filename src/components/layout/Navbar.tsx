'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';

import { LangToggle } from '@/components/ui/LangToggle';
import { useLang } from '@/context/LangContext';
import { ORDEN_SECCIONES } from '@/data/navigation';
import { anclaDeSeccion } from '@/data/routes';
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
  const { lang, content } = useLang();
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
          {/*
           * Todos los enlaces de la barra apuntan a la portada con el prefijo
           * de idioma completo (`/en#services`), nunca a un ancla relativa
           * (`#services`).
           *
           * Las anclas relativas se escribieron cuando el sitio era una única
           * página y allí funcionaban. Desde que existe la galería no: estando
           * en `/en/our-work`, pulsar «Services» dejaba al visitante en
           * `/en/our-work#services`, una URL válida sin ninguna sección que
           * mostrar y sin forma evidente de volver.
           *
           * Y son `<Link>` y no `<a>` para que la vuelta a la portada sea una
           * navegación de cliente —sin recargar el documento entero— igual que
           * el resto del sitio.
           */}
          <div className={styles.marca}>
            <Link href={anclaDeSeccion('hero', lang)}>
              <Image
                src={siteConfig.logo.src}
                alt={content.nav.logoAlt}
                width={siteConfig.logo.width}
                height={siteConfig.logo.height}
                className={styles.logo}
                /**
                 * El logo es visible desde el primer instante, así que no debe
                 * cargarse en diferido: aparecería con un salto.
                 *
                 * No lleva `priority`, que está reservado al fondo del hero
                 * (el elemento LCP). Aun así React 19 le añade un
                 * `<link rel="preload">` por el simple hecho de ser `eager`
                 * —comprobado quitándolo: las precargas bajan de 3 a 2—, así
                 * que sí compite con el hero. Lo que ordena esa competencia es
                 * el `fetchPriority="high"` que sólo lleva el fondo.
                 *
                 * `sizes` acota lo que se descarga a lo que realmente ocupa en
                 * pantalla (72 px de ancho en móvil, 84 px a partir de 768 px),
                 * no a los 1536 px del archivo maestro.
                 */
                loading="eager"
                sizes="(max-width: 767px) 72px, 84px"
              />
            </Link>
            <Link href={anclaDeSeccion('hero', lang)} className={styles.marcaTexto}>
              {siteConfig.brandName}
            </Link>
          </div>

          <div className={styles.enlaces}>
            {ORDEN_SECCIONES.map((seccion) => (
              <Link key={seccion} href={anclaDeSeccion(seccion, lang)} className={styles.enlace}>
                {content.nav.links[seccion]}
              </Link>
            ))}
          </div>

          <div className={styles.acciones}>
            <LangToggle />

            <Link href={anclaDeSeccion('contact', lang)} className={styles.cta}>
              {content.nav.ctaDesktop}
            </Link>

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
