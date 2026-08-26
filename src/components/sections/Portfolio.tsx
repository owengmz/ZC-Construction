'use client';

import Image from 'next/image';
import { useMemo, useRef } from 'react';

import { LightboxModal } from '@/components/ui/LightboxModal';
import { useLang } from '@/context/LangContext';
import { projects } from '@/data/projects';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { useLightbox } from '@/hooks/useLightbox';
import type { LightboxItem } from '@/types';

import styles from './Portfolio.module.css';

/**
 * Cada proyecto aporta dos fotos a la galería: el antes y el después.
 *
 * Se declara como constante para que la aritmética de índices de más abajo
 * (`indiceProyecto * FOTOS_POR_PROYECTO`) diga por qué multiplica por dos.
 */
const FOTOS_POR_PROYECTO = 2;

/**
 * Sección de Nuestros Trabajos.
 *
 * Paridad visual con el sitio actual: rejilla de proyectos, par antes/después
 * por cada uno y galería a pantalla completa al pulsar cualquier foto. El
 * rediseño de esta sección es una fase posterior.
 */
export function Portfolio() {
  const { content } = useLang();

  const seccionRef = useRef<HTMLElement>(null);
  const cabeceraRef = useRef<HTMLDivElement>(null);
  const proyectosRef = useRef<(HTMLElement | null)[]>([]);

  /**
   * Lista plana de las seis fotos, en el orden en que se navegan con las
   * flechas: proyecto 1 antes, proyecto 1 después, proyecto 2 antes…
   *
   * El sitio actual escribía este orden a mano en el atributo `data-index` de
   * cada botón (`0` a `5`). Derivarlo de los datos elimina la posibilidad de
   * que un índice quede desincronizado con la galería al reordenar proyectos.
   */
  const fotos = useMemo<LightboxItem[]>(
    () =>
      projects.flatMap((proyecto) => {
        const copy = content.portfolio.items[proyecto.id];
        return [
          { image: proyecto.before, alt: copy.beforeAlt, caption: content.portfolio.beforeLabel },
          { image: proyecto.after, alt: copy.afterAlt, caption: content.portfolio.afterLabel },
        ];
      }),
    [content],
  );

  const lightbox = useLightbox(fotos.length);

  // Mismos valores que `animPortfolio.js`.
  useGsapReveal(seccionRef, [
    {
      elementos: () => [cabeceraRef.current],
      inicio: 'title',
      desde: { x: -35 },
      duracion: 0.7,
    },
    {
      elementos: () => proyectosRef.current,
      inicio: 'cards',
      desde: { y: 45 },
      duracion: 0.7,
      escalonado: 0.15,
    },
  ]);

  return (
    <section id="portfolio" ref={seccionRef} className={styles.seccion}>
      <div ref={cabeceraRef} className={styles.cabecera}>
        <h2 className={styles.tituloSeccion}>{content.portfolio.sectionTitle}</h2>
        <div className={styles.subrayado} />
        <p className={styles.intro}>{content.portfolio.intro}</p>
      </div>

      <div className={styles.rejilla}>
        {projects.map((proyecto, indiceProyecto) => {
          const copy = content.portfolio.items[proyecto.id];
          const indiceAntes = indiceProyecto * FOTOS_POR_PROYECTO;

          return (
            <div
              key={proyecto.id}
              ref={(elemento) => {
                proyectosRef.current[indiceProyecto] = elemento;
              }}
              className={styles.proyecto}
            >
              <p className={styles.etiqueta}>{copy.label}</p>

              <div className={styles.par}>
                {/* Antes y después comparten estructura; se recorren para no
                    duplicar el marcado. El desplazamiento respecto al índice
                    del proyecto es 0 para el antes y 1 para el después. */}
                {(
                  [
                    { imagen: proyecto.before, alt: copy.beforeAlt, pie: content.portfolio.beforeLabel, clasePie: styles.pieAntes, desplazamiento: 0 },
                    { imagen: proyecto.after, alt: copy.afterAlt, pie: content.portfolio.afterLabel, clasePie: styles.pieDespues, desplazamiento: 1 },
                  ] as const
                ).map((foto) => (
                  <button
                    key={foto.desplazamiento}
                    type="button"
                    className={styles.disparador}
                    onClick={() => lightbox.abrir(indiceAntes + foto.desplazamiento)}
                  >
                    <Image
                      src={foto.imagen.src}
                      alt={foto.alt}
                      fill
                      /* Tres columnas sobre 1440 px, menos el espacio entre
                         ellas, y cada tarjeta partida en dos fotos. */
                      sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, 230px"
                      className={styles.imagen}
                    />
                    <span className={`${styles.pie} ${foto.clasePie}`}>{foto.pie}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {lightbox.abierto && (
        <LightboxModal
          items={fotos}
          indice={lightbox.indice}
          onClose={lightbox.cerrar}
          onPrev={lightbox.anterior}
          onNext={lightbox.siguiente}
        />
      )}
    </section>
  );
}
