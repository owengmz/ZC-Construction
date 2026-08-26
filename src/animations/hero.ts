import gsap from 'gsap';

import { HERO } from './gsapConfig';

/**
 * Animaciones del hero.
 *
 * Reúne los tres archivos que en el sitio actual vivían separados:
 * `heroBg.js`, `heroEntrance.js` y `heroExit.js`. Los valores —duraciones,
 * desplazamientos, curvas— son idénticos; lo único que cambia es que en lugar
 * de buscar elementos por `document.getElementById` los recibe ya resueltos.
 *
 * Ese cambio no es cosmético: con selectores globales, dos instancias del
 * mismo componente animarían los mismos nodos. Con referencias, cada instancia
 * anima los suyos.
 */

/** Nodos del hero que participan en las animaciones. */
export interface ElementosHero {
  readonly seccion: HTMLElement;
  readonly fondo: HTMLElement;
  readonly logo: HTMLElement;
  readonly titulo: HTMLElement;
  readonly subtitulo: HTMLElement;
}

/**
 * Desplazamiento máximo, en píxeles, para considerar que la página está "arriba".
 *
 * Por encima de este valor no se lanza la animación de entrada: ver la
 * explicación en `crearAnimacionesHero`.
 */
const UMBRAL_INICIO_PX = 10;

/**
 * Fondo: aparición inicial y paralaje al hacer scroll.
 *
 * El fondo se desplaza 80 px hacia abajo mientras la sección sale por arriba,
 * más despacio que el contenido, que es lo que produce la sensación de
 * profundidad.
 */
function animarFondo({ seccion, fondo }: ElementosHero): void {
  gsap.from(fondo, {
    opacity: 0,
    scale: 1.15,
    duration: HERO.duration.bg,
    ease: HERO.ease.bg,
  });

  gsap.to(fondo, {
    y: 80,
    ease: 'none',
    scrollTrigger: {
      trigger: seccion,
      start: 'top top',
      end: 'bottom top',
      scrub: HERO.scrub,
    },
  });
}

/**
 * Entrada escalonada del logo, el título y el subtítulo.
 *
 * Los desfases negativos (`-=0.75`, `-=0.6`) solapan cada elemento con el
 * anterior: no es una cadena de tres animaciones seguidas sino una sola
 * secuencia continua.
 */
function animarEntrada({ logo, titulo, subtitulo }: ElementosHero): void {
  const tl = gsap.timeline({ defaults: { ease: HERO.ease.enter } });

  tl.from(logo, {
    opacity: 0,
    scale: 0.78,
    rotation: -4,
    duration: HERO.duration.logo,
  })
    .from(
      titulo,
      {
        opacity: 0,
        y: 60,
        duration: HERO.duration.title,
      },
      '-=0.75',
    )
    .from(
      subtitulo,
      {
        opacity: 0,
        y: 30,
        filter: 'blur(8px)',
        duration: HERO.duration.subtitle,
      },
      '-=0.6',
    );
}

/**
 * Salida vinculada al scroll: el contenido se desvanece y sube al abandonar
 * la pantalla, con un ligero escalonado entre los tres elementos.
 */
function animarSalida({ seccion, logo, titulo, subtitulo }: ElementosHero): void {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: seccion,
      start: 'top top',
      end: 'bottom top',
      scrub: HERO.scrub,
    },
  });

  tl.to(logo, { autoAlpha: 0, y: -40, scale: 0.88, ease: HERO.ease.exit }, 0)
    .to(titulo, { autoAlpha: 0, y: -28, ease: HERO.ease.exit }, 0.04)
    .to(subtitulo, { autoAlpha: 0, y: -18, ease: HERO.ease.exit }, 0.08);
}

/**
 * Monta las animaciones del hero.
 *
 * Debe llamarse dentro de un `gsap.context()` para que el `revert()` del
 * desmontaje se lleve por delante tanto las líneas de tiempo como los
 * ScrollTrigger asociados.
 *
 * Respeta `prefers-reduced-motion` mediante `gsap.matchMedia()`, igual que el
 * sitio actual: quien haya pedido menos movimiento en su sistema operativo ve
 * el hero estático, sin paralaje ni entrada escalonada.
 *
 * @param elementos Nodos del hero ya resueltos.
 */
export function crearAnimacionesHero(elementos: ElementosHero): void {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    animarFondo(elementos);
    animarSalida(elementos);

    /**
     * La entrada sólo se lanza si la página está arriba del todo.
     *
     * El sitio actual resolvía esto a lo bruto: deshabilitaba la restauración
     * de scroll del navegador y forzaba `window.scrollTo(0, 0)` en cada carga,
     * porque si se recargaba a media altura la entrada y la salida peleaban
     * por los mismos elementos.
     *
     * Aquí no se puede hacer eso: romperíamos los enlaces con ancla y el
     * cambio de idioma, que conserva la posición a propósito. La alternativa
     * es esta comprobación: si ya se ha bajado, la animación de salida es la
     * que manda y la de entrada no llega a existir.
     */
    if (window.scrollY <= UMBRAL_INICIO_PX) {
      animarEntrada(elementos);
    }
  });
}
