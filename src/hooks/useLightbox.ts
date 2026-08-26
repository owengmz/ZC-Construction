'use client';

import { useCallback, useMemo, useState } from 'react';

import { useModalBehavior } from './useModalBehavior';

/**
 * Estado y controles de la galería a pantalla completa.
 *
 * Sustituye a `legacy/assets/js/lightbox.js`, que inyectaba su propio HTML en
 * el `<body>` con `insertAdjacentHTML` y leía las imágenes recorriendo el DOM.
 * Aquí el estado es explícito y las imágenes vienen de los datos.
 */
export interface ControlesLightbox {
  readonly abierto: boolean;
  /** Índice de la imagen visible dentro de la lista aplanada. */
  readonly indice: number;
  readonly abrir: (indice: number) => void;
  readonly cerrar: () => void;
  readonly anterior: () => void;
  readonly siguiente: () => void;
}

/**
 * Gobierna la galería: qué imagen se ve, teclado y bloqueo del fondo.
 *
 * @param total Número de imágenes navegables.
 * @returns Estado y manejadores para el componente de la galería.
 */
export function useLightbox(total: number): ControlesLightbox {
  const [abierto, setAbierto] = useState(false);
  const [indice, setIndice] = useState(0);

  const abrir = useCallback((nuevoIndice: number) => {
    setIndice(nuevoIndice);
    setAbierto(true);
  }, []);

  const cerrar = useCallback(() => setAbierto(false), []);

  /**
   * Navegación circular: desde la última se pasa a la primera y al revés.
   *
   * El `+ total` antes del módulo es lo que evita el índice negativo al
   * retroceder desde la posición cero, porque en JavaScript `-1 % 6` es `-1`,
   * no `5`.
   */
  const anterior = useCallback(() => {
    setIndice((actual) => (actual - 1 + total) % total);
  }, [total]);

  const siguiente = useCallback(() => {
    setIndice((actual) => (actual + 1) % total);
  }, [total]);

  /**
   * Se memoiza porque es dependencia del efecto de `useModalBehavior`: un
   * objeto literal nuevo en cada render volvería a enganchar y desenganchar el
   * listener de teclado continuamente.
   */
  const teclas = useMemo(
    () => ({ ArrowLeft: anterior, ArrowRight: siguiente }),
    [anterior, siguiente],
  );

  // Escape y bloqueo del fondo son comunes a todas las capas modales.
  useModalBehavior({ abierto, alCerrar: cerrar, teclas });

  return { abierto, indice, abrir, cerrar, anterior, siguiente };
}
