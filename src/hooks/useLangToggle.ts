'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useLang } from '@/context/LangContext';
import { IDIOMAS } from '@/data/langs';
import { paginaDeRuta, rutaDePagina } from '@/data/routes';
import type { Lang } from '@/types';

/** Una de las dos opciones del selector, ya lista para pintar. */
export interface LangToggleOption {
  readonly lang: Lang;
  /** Texto del botón: "EN" o "ES". */
  readonly label: string;
  /** Si es el idioma activo, para el estilo resaltado y el `aria-current`. */
  readonly isActive: boolean;
  /**
   * Destino del enlace: la MISMA página en el otro idioma, con su ancla si la
   * hubiera.
   *
   * Se tipa como `string` y no como `LangRoute` (`/${Lang}`) desde que el
   * destino dejó de ser siempre la portada: `/es/nuestros-trabajos#contact` es
   * un destino legítimo que aquella plantilla no admite.
   *
   * Cambiar de idioma es navegar, así que cada opción es un enlace real y no
   * un `onClick`. Eso lo hace rastreable por buscadores, abrible en pestaña
   * nueva con el botón central y utilizable sin JavaScript.
   */
  readonly href: string;
}

/** Valor devuelto por `useLangToggle`. */
export interface UseLangToggleResult {
  readonly lang: Lang;
  readonly options: readonly LangToggleOption[];
  /** `aria-label` del grupo de enlaces, ya traducido. */
  readonly groupLabel: string;
}

/**
 * Ancla de la URL actual, incluido el `#`, o cadena vacía si no hay.
 *
 * El ancla no viaja en `usePathname()`: los navegadores no la envían al
 * servidor, así que sólo existe en el cliente. De ahí que el estado arranque
 * vacío y se rellene tras montar —igual en servidor y en cliente, sin desajuste
 * de hidratación— en lugar de leerse durante el render.
 *
 * Se resincroniza por dos vías, y hacen falta las dos: `hashchange` cubre el
 * salto entre secciones de una misma página, y la dependencia del camino cubre
 * la navegación a otra página, que no dispara aquel evento.
 *
 * @param pathname Camino actual, que fuerza la resincronización al navegar.
 * @returns El ancla con su almohadilla ("#contact"), o "".
 */
function useAnclaActual(pathname: string): string {
  const [ancla, setAncla] = useState('');

  useEffect(() => {
    const sincronizar = () => setAncla(window.location.hash);

    sincronizar();
    window.addEventListener('hashchange', sincronizar);
    return () => window.removeEventListener('hashchange', sincronizar);
  }, [pathname]);

  return ancla;
}

/**
 * Prepara todo lo que necesita el selector de idioma de la barra de navegación.
 *
 * Su trabajo real es responder a una pregunta: si el visitante está AQUÍ y
 * cambia de idioma, ¿a dónde va? La respuesta era «a la portada» porque el
 * sitio tenía una sola página, y siguió siéndolo después de añadir la galería,
 * de modo que cambiar a español desde `/en/our-work` echaba al visitante a la
 * portada y le hacía volver a buscar lo que estaba mirando.
 *
 * Ahora la respuesta se calcula: se deduce la página actual del camino con
 * `paginaDeRuta`, se pide su equivalente en el otro idioma con `rutaDePagina`,
 * y se le vuelve a pegar el ancla si la había. El componente sigue sin saber
 * nada de esto: recibe una lista de opciones y las pinta.
 *
 * @returns Idioma activo, opciones listas para renderizar y etiqueta del grupo.
 */
export function useLangToggle(): UseLangToggleResult {
  const { lang, content } = useLang();
  const pathname = usePathname();
  const ancla = useAnclaActual(pathname);

  const options = useMemo<readonly LangToggleOption[]>(() => {
    const pagina = paginaDeRuta(pathname);

    return IDIOMAS.map((idioma) => ({
      lang: idioma,
      label: idioma.toUpperCase(),
      isActive: idioma === lang,
      href: `${rutaDePagina(pagina, idioma)}${ancla}`,
    }));
  }, [lang, pathname, ancla]);

  return {
    lang,
    options,
    groupLabel: content.nav.langToggleLabel,
  };
}
