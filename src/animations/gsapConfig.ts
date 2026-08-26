import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Configuración compartida de las animaciones GSAP.
 *
 * Transcripción de `legacy/assets/js/animations/animConfig.js`, ahora tipada.
 * Los valores son los mismos: la migración conserva las duraciones, las curvas
 * de aceleración y los puntos de disparo del sitio actual.
 */

/** Parámetros de las tres animaciones del hero: fondo, entrada y salida. */
export const HERO = {
  /**
   * Suavizado del scrub. Con 0,7 el desplazamiento vinculado al scroll llega
   * con una ligera inercia en lugar de seguir el dedo píxel a píxel.
   */
  scrub: 0.7,
  ease: {
    enter: 'power3.out',
    exit: 'power2.inOut',
    bg: 'power2.out',
  },
  duration: {
    bg: 1.8,
    logo: 1.3,
    title: 0.9,
    subtitle: 0.85,
    ctas: 0.7,
  },
} as const;

/** Parámetros de las revelaciones al hacer scroll del resto de secciones. */
export const SECTION = {
  ease: 'power2.out',
  start: {
    title: 'top 85%',
    cards: 'top 78%',
  },
} as const;

/**
 * Registra los plugins de GSAP una sola vez.
 *
 * `registerPlugin` es idempotente, pero llamarlo en el cuerpo de un módulo que
 * se importa desde varios componentes lo ejecutaría en el servidor durante el
 * prerenderizado, donde ScrollTrigger no tiene ni `window` ni `document`.
 * Envolverlo en una función deja el control a quien la llama, que siempre es
 * un efecto de cliente.
 */
export function registrarGsap(): void {
  gsap.registerPlugin(ScrollTrigger);
}
