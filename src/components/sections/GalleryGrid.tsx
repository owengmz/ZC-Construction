'use client';

import { useCallback, useMemo, useState } from 'react';

import { LightboxModal } from '@/components/ui/LightboxModal';
import { ProjectCard, type DesplazamientoFoto } from '@/components/ui/ProjectCard';
import { useLang } from '@/context/LangContext';
import { gallery, textosDeEntrada } from '@/data/gallery';
import { useLightbox } from '@/hooks/useLightbox';
import type { GalleryFilter, LightboxItem, ServiceOptionValue } from '@/types';

import styles from './GalleryGrid.module.css';

/**
 * Cada obra aporta dos fotos al lightbox: el antes y el después.
 *
 * Constante y no un `2` suelto para que la aritmética de índices de más abajo
 * (`indiceObra * FOTOS_POR_OBRA`) diga por qué multiplica. Mismo criterio que
 * en la sección de portada.
 */
const FOTOS_POR_OBRA = 2;

/**
 * Orden de los pines de categoría, después del de "Todos".
 *
 * Reproduce el orden en que aparecen las opciones en el `<select>` del
 * formulario de contacto, que es el orden en que la empresa presenta sus
 * servicios. Repetirlo aquí es deliberado: `Record` no garantiza orden de
 * iteración estable para todas las claves, y este orden es una decisión de
 * presentación, no un detalle del diccionario.
 */
const ORDEN_CATEGORIAS = ['framing', 'renovation', 'roofing', 'other'] as const;

/**
 * Comprobación de cobertura: si mañana se añade un servicio a `ServiceId`, la
 * opción aparece sola en el formulario de contacto, pero su pin NO aparecería
 * aquí y las obras de esa categoría quedarían inalcanzables desde los filtros.
 * Esta línea deja de compilar antes de que eso llegue a producción.
 */
type CategoriasPresentes = (typeof ORDEN_CATEGORIAS)[number];
type AfirmarCobertura<T extends true> = T;
export type _CoberturaCategorias = AfirmarCobertura<
  [Exclude<ServiceOptionValue, CategoriasPresentes>] extends [never] ? true : false
>;

/**
 * Anchos de las fotos para que `next/image` elija bien del srcset.
 *
 * Cada ficha lleva dos fotos a mitad de su ancho, y la ficha ocupa una columna
 * de un tablón que va de una a dos columnas. Por debajo de 1024 px hay una sola
 * columna, así que cada foto es media ventana descontando márgenes; por encima
 * son dos columnas sobre un contenedor que se detiene en 1440 px, de donde
 * salen los 340 px.
 *
 * Importa acertar aquí más que en el modo recortado: sin caja de proporción
 * fija, pedir un archivo más grande de la cuenta no sólo gasta ancho de banda,
 * sino que no aporta un solo píxel visible.
 */
const SIZES_FOTO = '(max-width: 1023px) 48vw, 340px';

/**
 * Rejilla filtrable de la galería completa.
 *
 * Es el único componente de cliente de la página, y lo es por una razón
 * concreta: el filtro es estado. Todo lo demás —cabecera, título, filete— se
 * renderiza en el servidor desde `GalleryPage`, así que al navegador sólo baja
 * el JavaScript de esta pieza y no el de la página entera.
 *
 * @returns Los pines de filtro y la rejilla de obras que les corresponde.
 */
export function GalleryGrid() {
  const { content } = useLang();
  const [filtro, setFiltro] = useState<GalleryFilter>('all');

  /**
   * Las obras que se ven ahora mismo.
   *
   * `'all'` no filtra: devuelve el catálogo entero. Ese caso se trata aparte y
   * no como una categoría más porque "todos" no es un valor de `category`, y
   * compararlo lo haría siempre falso.
   */
  const visibles = useMemo(
    () => (filtro === 'all' ? gallery : gallery.filter((obra) => obra.category === filtro)),
    [filtro],
  );

  /**
   * Lista plana de las fotos VISIBLES, en el orden en que se navegan con las
   * flechas del lightbox: obra 1 antes, obra 1 después, obra 2 antes…
   *
   * Se deriva de `visibles` y no del catálogo completo a propósito: con un
   * filtro activo, quien abre una foto y avanza con las flechas debe recorrer
   * lo que tiene en pantalla, no obras de categorías que acaba de descartar.
   */
  const fotos = useMemo<LightboxItem[]>(
    () =>
      visibles.flatMap((obra) => {
        const copy = textosDeEntrada(obra, content);
        return [
          { image: obra.before, alt: copy.beforeAlt, caption: content.portfolio.beforeLabel },
          { image: obra.after, alt: copy.afterAlt, caption: content.portfolio.afterLabel },
        ];
      }),
    [content, visibles],
  );

  const lightbox = useLightbox(fotos.length);
  const { cerrar } = lightbox;

  /**
   * Cambia el filtro y cierra el lightbox antes de hacerlo.
   *
   * El cierre no es defensa de una situación imposible: es lo que mantiene
   * coherente el índice. `useLightbox` guarda un número dentro de una lista que
   * acaba de cambiar de longitud, así que sin cerrar, el índice 5 de una lista
   * de seis fotos apuntaría al vacío en una lista de dos.
   *
   * @param nuevo Categoría elegida, o `'all'` para quitar el filtro.
   */
  const cambiarFiltro = useCallback(
    (nuevo: GalleryFilter) => {
      cerrar();
      setFiltro(nuevo);
    },
    [cerrar],
  );

  /**
   * Los pines, ya resueltos en el idioma activo.
   *
   * Ninguna de estas etiquetas es texto nuevo: las cuatro categorías salen del
   * mismo diccionario que alimenta el `<select>` de contacto, y "Todos" es la
   * única cadena propia de la galería.
   */
  const pines: readonly { valor: GalleryFilter; etiqueta: string }[] = useMemo(
    () => [
      { valor: 'all', etiqueta: content.gallery.allFilterLabel },
      ...ORDEN_CATEGORIAS.map((categoria) => ({
        valor: categoria,
        etiqueta: content.contact.form.serviceOptions[categoria],
      })),
    ],
    [content],
  );

  return (
    <>
      <div className={styles.filtros} role="group" aria-label={content.gallery.filtersLabel}>
        {pines.map((pin) => {
          const activo = pin.valor === filtro;

          return (
            <button
              key={pin.valor}
              type="button"
              className={`${styles.pin} ${activo ? styles.pinActivo : ''}`}
              /* `aria-pressed` y no `aria-current`: son botones que conmutan un
                 estado, no enlaces a la página actual. Sin él, un lector de
                 pantalla anuncia cinco botones idénticos sin decir cuál rige. */
              aria-pressed={activo}
              onClick={() => cambiarFiltro(pin.valor)}
            >
              {pin.etiqueta}
            </button>
          );
        })}
      </div>

      {visibles.length === 0 ? (
        /**
         * Estado vacío.
         *
         * No es un caso hipotético: la galería está arrancando y hay categorías
         * con cero obras. `role="status"` hace que el mensaje se anuncie al
         * cambiar de filtro; sin él, quien navega con lector de pantalla pulsa
         * un pin y no recibe ninguna señal de que la rejilla se ha vaciado.
         */
        <p className={styles.vacio} role="status">
          <span className={styles.marcaVacio} aria-hidden="true" />
          {content.gallery.emptyState}
        </p>
      ) : (
        <div className={styles.rejilla}>
          {visibles.map((obra, indiceObra) => {
            const indiceAntes = indiceObra * FOTOS_POR_OBRA;

            return (
              /*
               * La ficha va envuelta porque `break-inside: avoid` y el margen
               * inferior son propiedades del elemento COLUMNADO, y `ProjectCard`
               * es un componente compartido: no puede llevar encima reglas que
               * sólo tienen sentido dentro de un tablón de columnas.
               */
              <div key={obra.id} className={styles.celda}>
                <ProjectCard
                  before={obra.before}
                  after={obra.after}
                  copy={textosDeEntrada(obra, content)}
                  beforeLabel={content.portfolio.beforeLabel}
                  afterLabel={content.portfolio.afterLabel}
                  sizes={SIZES_FOTO}
                  /* Aquí lo que se enseña ES la obra, así que la foto sale
                     entera. El teaser de la portada sigue en 'cover'. */
                  ajuste="natural"
                  onFotoClick={(desplazamiento: DesplazamientoFoto) =>
                    lightbox.abrir(indiceAntes + desplazamiento)
                  }
                />
              </div>
            );
          })}
        </div>
      )}

      {lightbox.abierto && (
        <LightboxModal
          items={fotos}
          indice={lightbox.indice}
          onClose={lightbox.cerrar}
          onPrev={lightbox.anterior}
          onNext={lightbox.siguiente}
        />
      )}
    </>
  );
}
