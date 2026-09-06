import { CompararFotos } from '@/components/ui/CompararFotos';
import type { ImageAsset, ProjectCopy } from '@/types';

import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  /**
   * Fotografía del estado previo a la intervención.
   *
   * Se reciben las dos imágenes sueltas y no el objeto de obra entero. Nació
   * como precaución para la migración —convivían dos fuentes de datos con
   * formas distintas— y la precaución acertó: `data/projects.ts` acabó
   * borrándose y esta ficha no hubo que tocarla. Pidiendo sólo lo que de
   * verdad se pinta, sigue sin quedar atada a la forma de `GalleryEntry`.
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
  /** Nombre del comparador para lectores de pantalla, sin la obra. */
  readonly compareLabel: string;
  /** Rótulo accesible del botón que abre el visor a pantalla completa. */
  readonly expandLabel: string;
  /** Valor de `sizes` para `next/image`, que depende de la caja de quien la use. */
  readonly sizes: string;
  /**
   * Marca la fotografía «después» de esta ficha como candidata a elemento LCP.
   *
   * Existe por la galería completa, que no tiene portada por delante: allí la
   * primera fila de fichas ES lo que se ve al abrir, y sin esto Next.js avisa
   * en consola de que el elemento LCP se está cargando en diferido.
   *
   * En la portada se deja apagada, que es su valor por omisión: allí el LCP es
   * el fondo del hero y ya lo tiene declarado.
   */
  readonly prioridad?: boolean;
  /**
   * Qué hacer al pulsar el botón de ampliar.
   *
   * Opcional a propósito: sin él la ficha no dibuja el botón, que es lo
   * correcto —un control que no hace nada es peor que ningún control—. Ya no
   * recibe desplazamiento porque la ficha tiene un solo marco: quien la monta
   * sabe qué obra es y calcula el índice del visor por su cuenta.
   */
  readonly onAmpliar?: () => void;
}

/**
 * Ficha de un proyecto: barra de datos arriba y comparador antes/después
 * debajo.
 *
 * ── Por qué un marco cuadrado ──
 *
 * Las dos fotos llenan un único marco 1∶1 con `object-fit: cover`, es decir
 * recortadas. Es una decisión tomada a conciencia después de probar lo
 * contrario: respetando el encuadre original, cada ficha medía una cosa
 * distinta y la comparación entre obras se falseaba —una foto apaisada se
 * mostraba a poco más de la mitad de la altura de una vertical, así que la
 * misma obra parecía menor por haberse fotografiado de otra manera—.
 *
 * De todas las proporciones posibles, 1∶1 es la única que trata igual a una
 * vertical y a una apaisada, porque es la única que es su propia inversa: a un
 * 3∶4 le quita el 25 % del alto y a un 4∶3 el 25 % del ancho. Cualquier otra
 * favorece a una orientación a costa de la otra, y en obra se fotografía lo que
 * cabe, no lo que cuadra. `scripts/verificar-galeria.mjs` avisa cuando una foto
 * se aleja tanto del cuadrado que su recorte deja de ser aceptable.
 *
 * El encuadre original no se pierde: el visor a pantalla completa que abre el
 * botón de ampliar sigue mostrando la fotografía entera, con `object-fit:
 * contain`. El recorte es de la rejilla, no del archivo.
 *
 * ── Sobre el botón de ampliar ──
 *
 * Antes se abría el visor pulsando la foto. Con el comparador, la pulsación
 * sobre el marco mueve el divisor, así que abrir el visor necesita un control
 * propio. Va FUERA del comparador y no dentro: anidar un botón dentro de un
 * elemento con `role="slider"` deja un control accionable al que la navegación
 * por teclado llega en un orden que ningún lector de pantalla sabe explicar.
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
  compareLabel,
  expandLabel,
  sizes,
  prioridad = false,
  onAmpliar,
}: ProjectCardProps) {
  return (
    <article className={styles.ficha}>
      <div className={styles.encabezado}>
        <span className={styles.marca} aria-hidden="true" />
        <p className={styles.ubicacion}>{copy.label}</p>
      </div>

      <div className={styles.marco}>
        <CompararFotos
          before={before}
          after={after}
          beforeAlt={copy.beforeAlt}
          afterAlt={copy.afterAlt}
          beforeLabel={beforeLabel}
          afterLabel={afterLabel}
          sizes={sizes}
          ariaLabel={`${compareLabel}: ${copy.label}`}
          prioridad={prioridad}
        />

        {onAmpliar && (
          <button type="button" className={styles.ampliar} aria-label={expandLabel} onClick={onAmpliar}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 1H1V6M10 15H15V10M1 10V15H6M15 6V1H10"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="square"
              />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}
