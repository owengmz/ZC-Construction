import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` en el navegador, `useEffect` en el servidor.
 *
 * Las animaciones de GSAP necesitan `useLayoutEffect`: se ejecuta después de
 * que React haya escrito en el DOM pero ANTES de que el navegador pinte. Ahí
 * está la diferencia entre que funcione y que parpadee.
 *
 * Un `gsap.from(elemento, { opacity: 0 })` fija el estado inicial en el
 * momento de crearse. Con `useEffect`, que corre después del pintado, el
 * visitante alcanza a ver el hero completo y opaco durante un fotograma antes
 * de que se ponga a cero para empezar la entrada. Con `useLayoutEffect` ese
 * estado inicial se aplica antes del primer pintado y el parpadeo no existe.
 *
 * El problema es que `useLayoutEffect` no puede correr en el servidor y React
 * avisa por consola en cada prerenderizado. Como estas páginas se generan
 * estáticas en el build, el aviso saldría siempre. De ahí la elección en
 * función de si existe `window`: en el servidor nunca se ejecuta ninguno de
 * los dos, así que la sustitución es inocua.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
