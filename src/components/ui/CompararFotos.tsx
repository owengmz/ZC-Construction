'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';

import type { ImageAsset } from '@/types';

import styles from './CompararFotos.module.css';

/**
 * Dónde nace el divisor, en tanto por ciento del ancho del marco.
 *
 * Es 50 y no un valor decorativo: al arrancar todas las fichas en el mismo
 * punto, la página se abre con los divisores alineados de columna a columna y
 * de fila a fila. Esa vertical compartida es justo lo que la galería no podía
 * tener mientras cada ficha medía una cosa distinta.
 */
const POSICION_INICIAL = 50;

/**
 * Cuánto avanza el divisor con cada pulsación de flecha.
 *
 * Cuatro por ciento da veinticinco pasos de tope a tope: suficientes para
 * encuadrar un detalle sin que recorrer el marco entero sea un ejercicio.
 */
const PASO_TECLADO = 4;

interface CompararFotosProps {
  /** Fotografía del estado previo, la que se descubre al arrastrar. */
  readonly before: ImageAsset;
  /** Fotografía del resultado final, la que está debajo y siempre se ve. */
  readonly after: ImageAsset;
  /** Texto alternativo de la fotografía previa. */
  readonly beforeAlt: string;
  /** Texto alternativo de la fotografía final. */
  readonly afterAlt: string;
  /** Pie de la fotografía previa, traducido ("Before" / "Antes"). */
  readonly beforeLabel: string;
  /** Pie de la fotografía final, traducido ("After" / "Después"). */
  readonly afterLabel: string;
  /** Valor de `sizes` para `next/image`, que depende de la caja de quien la use. */
  readonly sizes: string;
  /** Nombre accesible del control, ya compuesto con la obra que compara. */
  readonly ariaLabel: string;
  /**
   * Marca la fotografía «después» como candidata a elemento LCP.
   *
   * Sólo debe activarla quien sepa que este comparador está sobre el pliegue, y
   * únicamente en UNO por página: `priority` precarga la imagen y adelantarlas
   * todas devolvería el problema al revés, compitiendo entre ellas por el ancho
   * de banda de la primera pantalla.
   *
   * Se aplica a la «después» y no a la «antes» porque es la que está debajo y
   * siempre se ve entera; la «antes» va recortada por el divisor, así que su
   * parte visible depende de dónde esté el tirador.
   */
  readonly prioridad?: boolean;
}

/** Encierra un porcentaje dentro de los topes del recorrido. */
const acotar = (valor: number) => Math.min(100, Math.max(0, valor));

/**
 * Comparador antes/después: las dos fotos superpuestas y un divisor que se
 * arrastra.
 *
 * ── Por qué superpuestas y no una al lado de la otra ──
 *
 * La ficha enseñaba las dos fotos contiguas, separadas por una costura fija.
 * Esa costura era un elemento de maquetación, y como tal tenía una posición que
 * dependía de las proporciones del par: cambiaba de una ficha a otra y no había
 * manera de alinearla entre filas sin recortar las fotos. Superponiéndolas, la
 * costura deja de existir como maquetación y pasa a ser un control: no hay nada
 * que pueda desalinearse porque no queda nada fijo que alinear.
 *
 * ── Cómo se descubre el «antes» ──
 *
 * El «después» va debajo y siempre completo. El «antes» va encima dentro de una
 * capa recortada con `clip-path`, y no con un `width` decreciente: recortar no
 * reescala la imagen, así que la foto de arriba y la de abajo coinciden píxel a
 * píxel en todo momento. Con un ancho variable, la de arriba se comprimiría y
 * las dos dejarían de casar en cuanto el divisor se moviera.
 *
 * La posición viaja como custom property (`--posicion`) y no como dos estilos
 * en línea distintos: la usan el recorte de la capa y el desplazamiento del
 * divisor, y escribiéndola una sola vez no pueden quedar descuadrados.
 *
 * ── Sobre la captura de puntero ──
 *
 * `setPointerCapture` en la pulsación es lo que permite arrastrar más allá del
 * borde del marco y seguir mandando sobre el divisor. Y de paso hace innecesario
 * un estado «arrastrando»: `hasPointerCapture` ya responde a esa pregunta, así
 * que el componente guarda un solo número.
 *
 * @param props Las dos fotos, sus textos y la caja donde se dibujan.
 * @returns El marco comparador, para meterse en una caja con proporción propia.
 */
export function CompararFotos({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  sizes,
  ariaLabel,
  prioridad = false,
}: CompararFotosProps) {
  const [posicion, setPosicion] = useState(POSICION_INICIAL);

  const seguirPuntero = useCallback((evento: PointerEvent<HTMLDivElement>) => {
    const caja = evento.currentTarget.getBoundingClientRect();

    // Un marco de ancho cero sólo ocurre si el elemento está oculto; dividir por
    // él daría `Infinity` y dejaría el divisor clavado en un tope.
    if (caja.width === 0) return;

    setPosicion(acotar(((evento.clientX - caja.left) / caja.width) * 100));
  }, []);

  const alPulsar = useCallback(
    (evento: PointerEvent<HTMLDivElement>) => {
      evento.currentTarget.setPointerCapture(evento.pointerId);
      seguirPuntero(evento);
    },
    [seguirPuntero],
  );

  const alMover = useCallback(
    (evento: PointerEvent<HTMLDivElement>) => {
      // Sin captura no hay arrastre en curso: el puntero sólo está paseando por
      // encima, y mover el divisor al pasar por delante sería un sobresalto.
      if (!evento.currentTarget.hasPointerCapture(evento.pointerId)) return;

      seguirPuntero(evento);
    },
    [seguirPuntero],
  );

  const alTeclear = useCallback((evento: KeyboardEvent<HTMLDivElement>) => {
    const salto =
      evento.key === 'ArrowLeft' ? -PASO_TECLADO : evento.key === 'ArrowRight' ? PASO_TECLADO : 0;

    if (salto !== 0) {
      // Sin esto, las flechas desplazarían además la página por debajo.
      evento.preventDefault();
      setPosicion((actual) => acotar(actual + salto));
      return;
    }

    if (evento.key === 'Home') {
      evento.preventDefault();
      setPosicion(0);
      return;
    }

    if (evento.key === 'End') {
      evento.preventDefault();
      setPosicion(100);
    }
  }, []);

  const redondeada = Math.round(posicion);

  return (
    <div
      className={styles.comparador}
      style={{ '--posicion': `${posicion}%` } as CSSProperties}
      /*
       * `role="slider"` y no un `<input type="range">` girado con CSS: el rango
       * nativo trae su propio raíl y su propio pulgar, que habría que anular en
       * tres motores distintos para dibujar encima un divisor a toda altura. El
       * papel ARIA aporta la semántica sin arrastrar el aspecto.
       */
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={redondeada}
      /* Un lector de pantalla que anuncie «50» no dice nada; que anuncie
         «50 % Antes» explica qué mide el número. */
      aria-valuetext={`${redondeada} % ${beforeLabel}`}
      onPointerDown={alPulsar}
      onPointerMove={alMover}
      onKeyDown={alTeclear}
    >
      <Image
        src={after.src}
        alt={afterAlt}
        fill
        sizes={sizes}
        className={styles.foto}
        style={{ objectPosition: after.focus ?? 'center' }}
        priority={prioridad}
      />

      <div className={styles.capaAntes}>
        <Image
          src={before.src}
          alt={beforeAlt}
          fill
          sizes={sizes}
          className={styles.foto}
          style={{ objectPosition: before.focus ?? 'center' }}
        />
      </div>

      {/*
        El filete va en el gris del logo y el agarre lleva el filete ember, y no
        al revés. Es el reparto de acentos del sitio aplicado a un control: el
        acero organiza —traza por dónde va el corte— y el ember señala lo único
        que hay que tocar.
      */}
      <span className={styles.divisor} aria-hidden="true">
        <span className={styles.agarre}>
          <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden="true">
            <path
              d="M6 1L1 5.5L6 10"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="square"
            />
          </svg>
          <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden="true">
            <path
              d="M1 1L6 5.5L1 10"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="square"
            />
          </svg>
        </span>
      </span>

      <span className={`${styles.pie} ${styles.pieAntes}`}>{beforeLabel}</span>
      <span className={`${styles.pie} ${styles.pieDespues}`}>{afterLabel}</span>
    </div>
  );
}
