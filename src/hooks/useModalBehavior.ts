'use client';

import { useEffect } from 'react';

/**
 * Comportamiento común a las capas modales del sitio.
 *
 * La galería y el modal de garantía necesitan exactamente lo mismo: cerrarse
 * con Escape y congelar el desplazamiento del fondo mientras están abiertos.
 * En `legacy/` estaba escrito dos veces, en `lightbox.js` y en
 * `warranty-modal.js`, con el mismo fallo en ambos: al cerrar vaciaban
 * `document.body.style.overflow` en lugar de restaurar lo que hubiera antes.
 */
export interface OpcionesModal {
  readonly abierto: boolean;
  readonly alCerrar: () => void;
  /**
   * Teclas adicionales, además de Escape.
   *
   * La galería las usa para las flechas. Se declaran aquí para que todo el
   * teclado de una capa modal viva en un único listener en lugar de repartirse
   * entre varios efectos que habría que mantener sincronizados.
   */
  readonly teclas?: Readonly<Record<string, () => void>>;
}

/**
 * Aplica el comportamiento estándar de una capa modal.
 *
 * @param abierto Si la capa está visible.
 * @param alCerrar Qué hacer al pulsar Escape.
 * @param teclas Manejadores adicionales por nombre de tecla.
 */
export function useModalBehavior({ abierto, alCerrar, teclas }: OpcionesModal): void {
  useEffect(() => {
    if (!abierto) return;

    const anteriorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const alPulsarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        alCerrar();
        return;
      }
      teclas?.[evento.key]?.();
    };

    document.addEventListener('keydown', alPulsarTecla);

    return () => {
      /**
       * Se restaura el valor previo en vez de vaciarlo.
       *
       * Importa cuando hay dos capas superpuestas: si la galería se abriera
       * desde el menú móvil y al cerrarse vaciara el estilo, el fondo volvería
       * a desplazarse aunque el menú siguiera abierto.
       */
      document.body.style.overflow = anteriorOverflow;
      document.removeEventListener('keydown', alPulsarTecla);
    };
  }, [abierto, alCerrar, teclas]);
}
