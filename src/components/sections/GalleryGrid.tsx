'use client';

import { useCallback, useMemo, useState } from 'react';

import { LightboxModal } from '@/components/ui/LightboxModal';
import { ProjectCard } from '@/components/ui/ProjectCard';
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
 * Ahora cada ficha lleva UN marco que ocupa su ancho entero, así que la cuenta
 * es directamente el ancho de columna de la rejilla, tramo por tramo:
 *
 *   - hasta 767 px  · una columna, márgenes de 20 px  → 100vw − 40
 *   - hasta 1279 px · dos columnas, márgenes de 40 px y una calle de 24
 *                     → (100vw − 104) / 2
 *   - hasta 1439 px · tres columnas y dos calles      → (100vw − 128) / 3
 *   - a partir de ahí el contenedor se topa en 1440 px y la columna se queda
 *     clavada en 437 px.
 *
 * Se escribe con `calc()` y no con porcentajes de ventana redondeados porque
 * las calles y los márgenes son fijos: un `33vw` pediría archivos de más en las
 * pantallas anchas y de menos en las estrechas del mismo tramo.
 */
const SIZES_FOTO =
  '(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) calc((100vw - 104px) / 2), (max-width: 1439px) calc((100vw - 128px) / 3), 437px';

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
          {visibles.map((obra, indiceObra) => (
            /*
             * Ya no hace falta envolver la ficha. El envoltorio existía para
             * llevar `break-inside: avoid` y el margen inferior, que eran
             * propiedades del elemento columnado; con una rejilla normal, la
             * ficha es el elemento de la rejilla y la separación la pone `gap`.
             */
            <ProjectCard
              key={obra.id}
              before={obra.before}
              after={obra.after}
              copy={textosDeEntrada(obra, content)}
              beforeLabel={content.portfolio.beforeLabel}
              afterLabel={content.portfolio.afterLabel}
              compareLabel={content.portfolio.compareLabel}
              expandLabel={content.portfolio.expandLabel}
              sizes={SIZES_FOTO}
              /* El visor abre por el «antes» de esta obra, que es el orden en
                 que se leen las dos fotos; desde ahí las flechas avanzan al
                 «después» y a la obra siguiente. */
              onAmpliar={() => lightbox.abrir(indiceObra * FOTOS_POR_OBRA)}
            />
          ))}
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
