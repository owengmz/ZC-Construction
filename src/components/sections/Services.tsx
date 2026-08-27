'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { useLang } from '@/context/LangContext';
import { services } from '@/data/services';
import { useGsapReveal } from '@/hooks/useGsapReveal';

import styles from './Services.module.css';

/**
 * Anchos que ocupará cada fotografía, para que `next/image` elija bien del
 * srcset.
 *
 * Todas las fichas son iguales desde el rediseño, así que basta un valor: a
 * partir de 768 px la columna de imagen son 5 de 12 columnas sobre un
 * contenedor de 1440 px, unos 580 px; por debajo ocupa el ancho de la ventana.
 * El sitio anterior necesitaba un valor por variante de rejilla.
 */
const SIZES_IMAGEN = '(max-width: 767px) 100vw, (max-width: 1440px) 42vw, 580px';

/**
 * Sección de Servicios Principales.
 *
 * Recorre `data/services.ts` —que aporta imagen y número de expediente— y
 * resuelve los textos de cada ficha contra el contenido del idioma activo. Los
 * dos conjuntos se cruzan por el `id` del servicio, así que no hay forma de
 * emparejar la foto de un servicio con la descripción de otro.
 *
 * Rediseño «Expediente de Obra»: tres fichas horizontales apiladas, cada una
 * con su número arriba a la izquierda. La composición y el detalle visual
 * viven en el CSS Module; aquí sólo queda la estructura.
 */
export function Services() {
  const { content } = useLang();

  const seccionRef = useRef<HTMLElement>(null);
  const cabeceraRef = useRef<HTMLDivElement>(null);
  const tarjetasRef = useRef<(HTMLElement | null)[]>([]);

  // Un solo despliegue orquestado: la cabecera entra desde la izquierda y las
  // fichas desde abajo, escalonadas. Mismos valores que antes del rediseño,
  // porque el ritmo de entrada es el mismo en las cuatro secciones del sitio.
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
      <div className={styles.contenedor}>
        <div ref={cabeceraRef} className={styles.cabecera}>
          <h2 className={styles.tituloSeccion}>{content.services.sectionTitle}</h2>
          <div className={styles.filete} />
        </div>

        <div className={styles.lista}>
          {services.map((servicio, indice) => {
            const copy = content.services.items[servicio.id];

            return (
              <article
                key={servicio.id}
                ref={(elemento) => {
                  tarjetasRef.current[indice] = elemento;
                }}
                className={styles.tarjeta}
              >
                <div className={styles.columnaImagen}>
                  <Image
                    src={servicio.image.src}
                    alt={copy.imageAlt}
                    fill
                    sizes={SIZES_IMAGEN}
                    className={styles.imagen}
                  />
                </div>

                <div className={styles.columnaTexto}>
                  <span className={styles.marcador}>{servicio.marker}</span>
                  <h3 className={styles.titulo}>{copy.title}</h3>
                  <p className={styles.descripcion}>{copy.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
