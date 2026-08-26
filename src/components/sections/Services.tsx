'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { useLang } from '@/context/LangContext';
import { services } from '@/data/services';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import type { ServiceLayout } from '@/types';

import styles from './Services.module.css';

/**
 * Clase de disposición de cada tarjeta.
 *
 * Se escribe como `Record<ServiceLayout, string>` en lugar de indexar
 * `styles[servicio.layout]` para que el compilador exija una entrada nueva si
 * algún día se añade una cuarta variante. Indexando el objeto de estilos, una
 * variante sin clase daría `undefined` en silencio y la tarjeta saldría sin
 * ancho ni alto.
 */
const CLASE_LAYOUT: Record<ServiceLayout, string> = {
  wide: styles.wide,
  narrow: styles.narrow,
  full: styles.full,
};

/**
 * Anchos que ocupará cada tarjeta, para que `next/image` elija bien del srcset.
 *
 * Se derivan de la rejilla: sobre un contenedor máximo de 1440 px, la tarjeta
 * ancha ocupa 8 de 12 columnas, la estrecha 4 y la completa las 12. Por debajo
 * de 768 px todas ocupan el ancho de la ventana.
 */
const SIZES_LAYOUT: Record<ServiceLayout, string> = {
  wide: '(max-width: 767px) 100vw, (max-width: 1440px) 66vw, 933px',
  narrow: '(max-width: 767px) 100vw, (max-width: 1440px) 33vw, 453px',
  full: '(max-width: 1440px) 100vw, 1440px',
};

/**
 * Sección de Servicios Principales.
 *
 * Recorre `data/services.ts` —que aporta imagen, marcador y disposición— y
 * resuelve los textos de cada tarjeta contra el contenido del idioma activo.
 * Los dos conjuntos se cruzan por el `id` del servicio, así que no hay forma
 * de emparejar la foto de un servicio con la descripción de otro.
 */
export function Services() {
  const { content } = useLang();

  const seccionRef = useRef<HTMLElement>(null);
  const cabeceraRef = useRef<HTMLDivElement>(null);
  const tarjetasRef = useRef<(HTMLElement | null)[]>([]);

  // Mismos valores que `animServices.js`: la cabecera entra desde la izquierda
  // y las tarjetas desde abajo, escalonadas 0,18 s.
  useGsapReveal(seccionRef, [
    {
      elementos: () => [cabeceraRef.current],
      inicio: 'title',
      desde: { x: -35 },
      duracion: 0.7,
    },
    {
      elementos: () => tarjetasRef.current,
      inicio: 'cards',
      desde: { y: 55 },
      duracion: 0.75,
      escalonado: 0.18,
    },
  ]);

  return (
    <section id="services" ref={seccionRef} className={styles.seccion}>
      <div ref={cabeceraRef} className={styles.cabecera}>
        <h2 className={styles.tituloSeccion}>{content.services.sectionTitle}</h2>
        <div className={styles.subrayado} />
      </div>

      <div className={styles.rejilla}>
        {services.map((servicio, indice) => {
          const copy = content.services.items[servicio.id];

          return (
            <article
              key={servicio.id}
              ref={(elemento) => {
                tarjetasRef.current[indice] = elemento;
              }}
              className={`${styles.tarjeta} ${CLASE_LAYOUT[servicio.layout]}`}
            >
              <Image
                src={servicio.image.src}
                alt={copy.imageAlt}
                fill
                sizes={SIZES_LAYOUT[servicio.layout]}
                className={styles.imagen}
              />

              {/* Sólo aporta contraste, no información. */}
              <div className={styles.velo} aria-hidden="true" />

              <div className={styles.texto}>
                <span className={styles.marcador}>{servicio.marker}</span>
                <h3 className={styles.titulo}>{copy.title}</h3>
                <p className={styles.descripcion}>{copy.description}</p>
              </div>

              <div className={styles.desvanecido} aria-hidden="true" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
