'use client';

import { useEffect, useState } from 'react';

/**
 * Píxeles de desplazamiento a partir de los cuales la barra deja de ser
 * transparente. Mismo umbral que `legacy/assets/js/navbar-scroll.js`.
 */
const UMBRAL_PX = 10;

/**
 * Indica si la página está desplazada lo suficiente como para que la barra de
 * navegación adopte su fondo translúcido.
 *
 * Sustituye a `navbar-scroll.js`, que añadía y quitaba clases de Tailwind
 * directamente sobre el DOM. Aquí el resultado es un booleano y es el
 * componente quien decide qué clase aplicar.
 *
 * @returns `true` cuando hay desplazamiento vertical suficiente.
 */
export function useNavbarScroll(): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const actualizar = () => {
      setIsScrolled(window.scrollY > UMBRAL_PX);
    };

    // Una lectura inicial, igual que hacía el script antiguo: si se recarga la
    // página a media altura, el navegador restaura el scroll y la barra debe
    // salir ya con su fondo, no transparente.
    actualizar();

    // `passive: true` promete que el manejador no llamará a preventDefault,
    // lo que permite al navegador seguir desplazando sin esperar a que
    // termine el manejador.
    window.addEventListener('scroll', actualizar, { passive: true });

    return () => {
      window.removeEventListener('scroll', actualizar);
    };
  }, []);

  return isScrolled;
}
