import Image from 'next/image';

import type { ImageAsset, ProjectCopy } from '@/types';

import styles from './ProjectCard.module.css';

/**
 * Desplazamiento de cada foto dentro del proyecto: 0 el antes, 1 el después.
 *
 * Es el mismo desplazamiento con el que la galería a pantalla completa calcula
 * su índice plano (`indiceProyecto * 2 + desplazamiento`), así que se tipa para
 * que quien reciba el callback no pueda pasarle otra cosa.
 */
export type DesplazamientoFoto = 0 | 1;

interface ProjectCardProps {
  /**
   * Fotografía del estado previo a la intervención.
   *
   * Se reciben las dos imágenes sueltas y no el objeto de proyecto entero
   * porque la ficha la usan dos fuentes de datos distintas: la portada y la
   * galería completa leen ambas de `data/gallery.ts`, pero mientras dure la
   * migración `data/projects.ts` sigue existiendo con otra forma. Pidiendo
   * sólo lo que de verdad se pinta, la ficha no queda atada a ninguna de las
   * dos y no habrá que tocarla cuando una desaparezca.
   */
  readonly before: ImageAsset;
  /** Fotografía del resultado final. */
  readonly after: ImageAsset;
  /** Textos ya resueltos en el idioma activo. */
  readonly copy: ProjectCopy;
  /** Pie de la fotografía previa, traducido ("Before" / "Antes"). */
  readonly beforeLabel: string;
  /** Pie de la fotografía final, traducido ("After" / "Después"). */
  readonly afterLabel: string;
  /** Valor de `sizes` para `next/image`, que depende de la caja de quien la use. */
  readonly sizes: string;
  /**
   * Qué hacer al pulsar una foto.
   *
   * Opcional a propósito: en la portada abre la galería a pantalla completa,
   * pero la página de galería completa todavía no la monta. Sin callback las
   * fotos se renderizan como figuras inertes en lugar de como botones, que es
   * lo correcto —un botón que no hace nada es peor que ningún botón.
   */
  readonly onFotoClick?: (desplazamiento: DesplazamientoFoto) => void;
  /**
   * Cómo encaja la fotografía en su hueco.
   *
   *  - `'cover'` (por defecto): caja de proporción fija —4:3— y la foto
   *    recortada por el centro para llenarla. Todas las fichas miden lo mismo,
   *    a costa de perder parte de cada imagen. Es el tratamiento del teaser de
   *    la portada, donde la ficha compite en altura con el panel de vídeo y esa
   *    uniformidad sostiene la composición.
   *  - `'natural'`: sin caja y sin recorte. La foto conserva su proporción
   *    real y la ficha mide lo que midan sus fotos. Es el tratamiento de la
   *    galería completa, donde lo que se enseña ES la obra y recortarla
   *    contradice el propósito de la página.
   *
   * El valor por defecto es `'cover'` a propósito: así el teaser de la portada
   * no cambia por el hecho de que la galería haya adoptado otro criterio.
   */
  readonly ajuste?: 'cover' | 'natural';
}

/**
 * Ficha de un proyecto: ubicación arriba y par antes/después debajo.
 *
 * Componente de servidor: no tiene estado ni efectos. Quien necesite la
 * galería a pantalla completa le pasa `onFotoClick` desde su propio componente
 * de cliente.
 *
 * @param props Datos, textos y comportamiento de la ficha.
 * @returns La ficha renderizada.
 */
export function ProjectCard({
  before,
  after,
  copy,
  beforeLabel,
  afterLabel,
  sizes,
  onFotoClick,
  ajuste = 'cover',
}: ProjectCardProps) {
  const natural = ajuste === 'natural';

  /**
   * Antes y después comparten estructura, así que se recorren en lugar de
   * duplicar el marcado. El orden del array ES el orden de lectura.
   */
  const fotos = [
    {
      imagen: before,
      alt: copy.beforeAlt,
      pie: beforeLabel,
      clasePie: '',
      desplazamiento: 0 as const,
    },
    {
      imagen: after,
      alt: copy.afterAlt,
      pie: afterLabel,
      clasePie: styles.pieDespues,
      desplazamiento: 1 as const,
    },
  ];

  return (
    <article className={styles.ficha}>
      <div className={styles.encabezado}>
        <span className={styles.marca} aria-hidden="true" />
        <p className={styles.ubicacion}>{copy.label}</p>
      </div>

      <div className={natural ? styles.parNatural : styles.par}>
        {fotos.map((foto) => {
          /*
           * Dos formas distintas de pedirle la imagen a `next/image`, no la
           * misma con otro `object-fit`.
           *
           * `fill` obliga a que la imagen llene un contenedor de tamaño
           * conocido, así que sólo tiene sentido cuando ese contenedor impone
           * una proporción: es el modo con recorte. En modo natural se pasan
           * el ancho y el alto INTRÍNSECOS del archivo, y el navegador reserva
           * el hueco exacto antes de descargar nada. Ese es el mecanismo que
           * hace que la foto salga entera: no hay caja a la que amoldarse
           * porque la caja la define la propia foto.
           */
          const contenido = (
            <>
              {natural ? (
                <Image
                  src={foto.imagen.src}
                  alt={foto.alt}
                  width={foto.imagen.width}
                  height={foto.imagen.height}
                  sizes={sizes}
                  className={styles.imagenNatural}
                />
              ) : (
                <Image
                  src={foto.imagen.src}
                  alt={foto.alt}
                  fill
                  sizes={sizes}
                  className={styles.imagen}
                />
              )}
              <span className={`${styles.pie} ${foto.clasePie}`}>{foto.pie}</span>
            </>
          );

          const claseFoto = natural ? styles.fotoNatural : styles.foto;

          return onFotoClick ? (
            <button
              key={foto.desplazamiento}
              type="button"
              className={`${claseFoto} ${styles.disparador}`}
              onClick={() => onFotoClick(foto.desplazamiento)}
            >
              {contenido}
            </button>
          ) : (
            <div key={foto.desplazamiento} className={claseFoto}>
              {contenido}
            </div>
          );
        })}
      </div>
    </article>
  );
}
