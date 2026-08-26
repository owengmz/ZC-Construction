'use client';

import gsap from 'gsap';
import Image from 'next/image';
import { useRef } from 'react';

import { crearAnimacionesHero } from '@/animations/hero';
import { registrarGsap } from '@/animations/gsapConfig';
import { useLang } from '@/context/LangContext';
import { heroBackground } from '@/data/hero';
import { siteConfig } from '@/data/site';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

import styles from './Hero.module.css';

/**
 * Sección de apertura del sitio.
 *
 * Dos asuntos concentran casi todo lo interesante de este componente: cómo se
 * sirve una fotografía de 1,4 MB sin castigar el LCP, y cómo se montan y
 * desmontan las animaciones de GSAP sin dejar ScrollTrigger huérfanos.
 */
export function Hero() {
  const { content } = useLang();

  /**
   * Referencias a los nodos que anima GSAP.
   *
   * El sitio actual los buscaba con `document.getElementById`. Con referencias
   * el componente se puede montar más de una vez sin que las instancias se
   * pisen, y TypeScript avisa si se anima algo que no existe.
   */
  const seccionRef = useRef<HTMLElement>(null);
  const fondoRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const subtituloRef = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const seccion = seccionRef.current;
    const fondo = fondoRef.current;
    const logo = logoRef.current;
    const titulo = tituloRef.current;
    const subtitulo = subtituloRef.current;

    // Si algún nodo faltara, montar animaciones a medias dejaría elementos
    // congelados en su estado inicial, es decir, invisibles.
    if (!seccion || !fondo || !logo || !titulo || !subtitulo) return;

    registrarGsap();

    /**
     * `gsap.context` es la pieza que hace que esto sea seguro en React.
     *
     * Registra todo lo que se cree dentro —líneas de tiempo, tweens,
     * ScrollTrigger, matchMedia— y `revert()` lo deshace de golpe al
     * desmontar: mata las animaciones, elimina los ScrollTrigger y devuelve a
     * los elementos los estilos que tenían antes.
     *
     * Sin esto, cada navegación entre `/en` y `/es` dejaría atrás un juego
     * completo de ScrollTrigger apuntando a nodos que ya no están en el
     * documento. Se acumularían en cada cambio de idioma y seguirían
     * recalculándose en cada scroll.
     *
     * El segundo argumento acota el ámbito a la sección: cualquier selector
     * que se use dentro sólo puede alcanzar nodos de este hero.
     */
    const ctx = gsap.context(() => {
      crearAnimacionesHero({ seccion, fondo, logo, titulo, subtitulo });
    }, seccion);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={seccionRef} className={styles.seccion}>
      <div ref={fondoRef} className={styles.fondo}>
        <Image
          src={heroBackground.src}
          alt={content.hero.backgroundAlt}
          fill
          /**
           * Ésta es la única imagen de la página con `priority`: es el elemento
           * LCP. `priority` hace dos cosas —carga `eager` y un
           * `<link rel="preload">` en el `<head>`— pero, comprobado en el
           * código de Next 15.5, NO emite `fetchpriority` en el `<img>`: ése es
           * un prop aparte que hay que pasar a mano, y por eso va explícito
           * aquí abajo.
           *
           * `sizes="100vw"` le dice al navegador que la imagen ocupa todo el
           * ancho de la ventana, de modo que elija del srcset el archivo justo
           * para su pantalla. Un móvil de 640 px acaba descargando unas
           * decenas de kilobytes, no los 1,4 MB del original: ahí está resuelto
           * el problema del peso, sin tocar el archivo de partida.
           *
           * El placeholder difuminado son 76 bytes incrustados en el HTML que
           * cubren el hueco durante la descarga.
           */
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={heroBackground.blurDataURL}
          className={styles.imagenFondo}
        />
      </div>

      {/* Sólo decorativo: el contraste lo aporta él, no información. */}
      <div className={styles.velo} aria-hidden="true" />

      <div className={styles.contenido}>
        <Image
          ref={logoRef}
          src={siteConfig.logo.src}
          alt={content.hero.logoAlt}
          width={siteConfig.logo.width}
          height={siteConfig.logo.height}
          /**
           * `loading="eager"` en lugar de `priority`: está en la primera
           * pantalla, así que diferirlo no tiene sentido, pero el LCP es el
           * fondo y `priority` es suyo.
           *
           * Matiz medido: `eager` no evita la precarga. React 19 emite un
           * `<link rel="preload">` para toda imagen `eager`, así que esta
           * también se precarga. La diferencia real con `priority` está en el
           * `fetchPriority`, que aquí no se pone: el navegador la descarga,
           * pero por detrás del fondo. Suficiente, porque este emblema arranca
           * invisible y la animación de entrada lo revela a lo largo de 1,3 s.
           */
          loading="eager"
          sizes="(max-width: 639px) 288px, (max-width: 767px) 320px, (max-width: 1023px) 384px, 448px"
          className={styles.logo}
        />

        <h1 ref={tituloRef} className={styles.titulo}>
          {content.hero.title}
        </h1>

        <p ref={subtituloRef} className={styles.subtitulo}>
          {content.hero.subtitle}
        </p>
      </div>
    </section>
  );
}
