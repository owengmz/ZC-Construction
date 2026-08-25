'use client';

import { useMemo } from 'react';

import { useLang } from '@/context/LangContext';
import { IDIOMAS } from '@/data/langs';
import type { Lang, LangRoute } from '@/types';

/** Una de las dos opciones del selector, ya lista para pintar. */
export interface LangToggleOption {
  readonly lang: Lang;
  /** Texto del botón: "EN" o "ES". */
  readonly label: string;
  /** Si es el idioma activo, para el estilo resaltado y el `aria-current`. */
  readonly isActive: boolean;
  /**
   * Destino del enlace.
   *
   * Cambiar de idioma es navegar, así que cada opción es un enlace real y no
   * un `onClick`. Eso lo hace rastreable por buscadores, abrible en pestaña
   * nueva con el botón central y utilizable sin JavaScript.
   */
  readonly href: LangRoute;
}

/** Valor devuelto por `useLangToggle`. */
export interface UseLangToggleResult {
  readonly lang: Lang;
  readonly options: readonly LangToggleOption[];
  /** `aria-label` del grupo de enlaces, ya traducido. */
  readonly groupLabel: string;
}

/**
 * Prepara todo lo que necesita el selector de idioma de la barra de navegación.
 *
 * Existe además de `useLang()` para que el componente sea puramente
 * declarativo: recibe una lista de opciones y las pinta, sin saber cuántos
 * idiomas hay, cuál está activo ni a qué URL apunta cada uno. Añadir un tercer
 * idioma no tocaría el componente, sólo `IDIOMAS` en `data/langs.ts`.
 *
 * En el sitio actual esta lógica estaba repartida entre el HTML (dos botones
 * escritos a mano) y `lang-toggle.js`, que además manipulaba estilos en línea
 * para marcar el activo.
 *
 * @returns Idioma activo, opciones listas para renderizar y etiqueta del grupo.
 */
export function useLangToggle(): UseLangToggleResult {
  const { lang, content } = useLang();

  const options = useMemo<readonly LangToggleOption[]>(
    () =>
      IDIOMAS.map((idioma) => ({
        lang: idioma,
        label: idioma.toUpperCase(),
        isActive: idioma === lang,
        href: `/${idioma}` as LangRoute,
      })),
    [lang],
  );

  return {
    lang,
    options,
    groupLabel: content.nav.langToggleLabel,
  };
}
