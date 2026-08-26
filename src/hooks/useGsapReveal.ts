'use client';

import gsap from 'gsap';
import { useRef, type RefObject } from 'react';

import { registrarGsap, SECTION } from '@/animations/gsapConfig';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Revelado de secciones al hacer scroll.
 *
 * Las cuatro secciones del sitio (Servicios, Trabajos, Seguro y Contacto)
 * repiten en `legacy/` el mismo patrón con pequeñas variaciones: la cabecera
 * entra deslizándose desde la izquierda, y después los elementos aparecen
 * desde abajo o desde los lados, escalonados. Eran cuatro archivos casi
 * idénticos; aquí es un hook con parámetros.
 */

/** Punto de disparo, con los mismos nombres que en `animConfig.js`. */
export type PuntoInicio = keyof typeof SECTION.start;

/** Desplazamiento inicial desde el que entra un elemento. */
export interface Desplazamiento {
  readonly x?: number;
  readonly y?: number;
}

/** Un conjunto de elementos que se revela con los mismos parámetros. */
export interface GrupoReveal {
  /**
   * Función que devuelve los nodos a revelar, en el orden del escalonado.
   *
   * Es una función y no un array por una razón concreta: el hook se invoca
   * durante el render, cuando las referencias todavía valen `null` porque
   * React aún no ha escrito en el DOM. Pasar `[cabeceraRef.current]` guardaría
   * ese `null` para siempre y la animación no encontraría nada que animar.
   * Difiriendo la lectura al efecto, que corre después del commit, los nodos
   * ya existen.
   *
   * Se admiten `null` en el resultado: se filtran antes de animar.
   */
  readonly elementos: () => readonly (HTMLElement | null)[];
  /** Dónde empieza la animación respecto al viewport. */
  readonly inicio: PuntoInicio;
  /**
   * Desde dónde entra cada elemento.
   *
   * Admite una función del índice porque la sección de Seguro necesita que sus
   * dos tarjetas entren desde lados opuestos: `(i) => ({ x: i === 0 ? -45 : 45 })`.
   */
  readonly desde: Desplazamiento | ((indice: number) => Desplazamiento);
  readonly duracion: number;
  /** Separación entre elementos consecutivos, en segundos. */
  readonly escalonado?: number;
  /** Espera antes de arrancar el grupo entero, en segundos. */
  readonly retardo?: number;
}

/**
 * Monta las animaciones de entrada de una sección.
 *
 * Cada grupo se dispara una sola vez (`once: true`), igual que en el sitio
 * actual: son animaciones de presentación, no efectos que deban repetirse al
 * subir y volver a bajar.
 *
 * @param seccionRef Referencia a la sección, que actúa como disparador.
 * @param grupos Conjuntos de elementos con sus parámetros de entrada.
 */
export function useGsapReveal(
  seccionRef: RefObject<HTMLElement | null>,
  grupos: readonly GrupoReveal[],
): void {
  /**
   * La configuración se guarda en una referencia y el efecto se monta una sola
   * vez.
   *
   * Si `grupos` fuese dependencia del efecto, un array construido en línea
   * —que es lo natural al llamar al hook— tendría identidad nueva en cada
   * render y las animaciones se desmontarían y volverían a montar sin parar.
   * Leerlas de una referencia evita obligar a quien llama a memoizar.
   *
   * Es correcto porque estas animaciones son `once: true`: se ejecutan una vez
   * y no se rearman, así que no hay nada que resincronizar después.
   */
  const gruposRef = useRef(grupos);
  gruposRef.current = grupos;

  useIsomorphicLayoutEffect(() => {
    const seccion = seccionRef.current;
    if (!seccion) return;

    registrarGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Igual que en el sitio actual: sin movimiento preferido, no hay
      // revelado. Los elementos se quedan visibles en su posición final.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        for (const grupo of gruposRef.current) {
          const elementos = grupo
            .elementos()
            .filter((elemento): elemento is HTMLElement => elemento !== null);
          if (elementos.length === 0) continue;

          const disparador = {
            trigger: seccion,
            start: SECTION.start[grupo.inicio],
            once: true,
          };

          if (typeof grupo.desde === 'function') {
            // Desplazamiento distinto por elemento: cada uno lleva su propio
            // tween, con el retardo calculado a mano en lugar de `stagger`.
            const desde = grupo.desde;
            elementos.forEach((elemento, indice) => {
              gsap.from(elemento, {
                scrollTrigger: disparador,
                autoAlpha: 0,
                ...desde(indice),
                duration: grupo.duracion,
                delay: (grupo.retardo ?? 0) + indice * (grupo.escalonado ?? 0),
                ease: SECTION.ease,
              });
            });
            continue;
          }

          gsap.from(elementos, {
            scrollTrigger: disparador,
            autoAlpha: 0,
            ...grupo.desde,
            duration: grupo.duracion,
            delay: grupo.retardo,
            stagger: grupo.escalonado,
            ease: SECTION.ease,
          });
        }
      });
    }, seccion);

    return () => ctx.revert();
  }, [seccionRef]);
}
