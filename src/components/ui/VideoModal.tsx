'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useLang } from '@/context/LangContext';

import styles from './VideoModal.module.css';

interface VideoModalProps {
  readonly onClose: () => void;
}

/**
 * Recorrido de obra a tamaño completo, con audio y controles nativos.
 *
 * Es la contrapartida del panel de la portada, no un duplicado: aquel es un
 * fondo mudo en bucle que arranca solo, y este es una pieza que el visitante
 * decide reproducir. De ahí las tres diferencias deliberadas —archivo con
 * audio, `controls` nativos y ningún `autoPlay`—: con sonido real, arrancar sin
 * que nadie lo pida es exactamente lo que no debe hacerse.
 *
 * Sólo se monta mientras está abierto. El bloqueo del fondo y el cierre con
 * Escape los aporta `useModalBehavior` desde `Portfolio`, que es quien gobierna
 * el estado de apertura, igual que `Insurance` con el modal de garantía.
 */
export function VideoModal({ onClose }: VideoModalProps) {
  const { content } = useLang();
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const piezaRef = useRef<HTMLVideoElement>(null);

  /**
   * Identificador estable entre servidor y cliente para `aria-labelledby`.
   *
   * Mismo motivo que en el modal de garantía: sin él el diálogo se anunciaría
   * sin nombre. Aquí importa algo más, porque lo que hay dentro es un vídeo y
   * el título es la única pista de qué se va a reproducir.
   */
  const idTitulo = useId();

  /**
   * Foco al abrir, devuelto a su sitio al cerrar.
   *
   * Sigue faltando atrapar el foco dentro del diálogo, la misma deuda anotada
   * en la galería y en el modal de garantía. Se mantiene igual a propósito: son
   * tres capas con el mismo comportamiento, y arreglarlo en una sola las
   * separaría sin resolver nada.
   */
  useEffect(() => {
    const previo = document.activeElement;
    cerrarRef.current?.focus();

    return () => {
      if (previo instanceof HTMLElement) previo.focus();
    };
  }, []);

  /**
   * Detiene la reproducción al desmontar.
   *
   * Sin esto, cerrar el modal a media reproducción dejaría el audio sonando:
   * React desmonta el elemento, pero el navegador no garantiza que corte el
   * sonido antes de descartarlo, y el usuario oiría la obra sin nada en
   * pantalla que explique de dónde sale.
   *
   * Va en un efecto propio y no en `onClose` porque el modal se cierra por tres
   * vías —el botón, el velo y la tecla Escape— y el desmontaje es el único
   * punto por el que pasan las tres.
   */
  useEffect(() => {
    const pieza = piezaRef.current;
    return () => {
      pieza?.pause();
    };
  }, []);

  const { portfolio } = content;

  return createPortal(
    // Al body, como las otras dos capas: GSAP deja transformaciones en línea
    // sobre el panel de la sección al terminar el revelado, y un ancestro
    // transformado rompería el `position: fixed` de esta capa.
    <div className={styles.raiz} role="dialog" aria-modal="true" aria-labelledby={idTitulo}>
      <div className={styles.velo} onClick={onClose} />

      <div className={styles.panel}>
        <div className={styles.cabecera}>
          <h3 id={idTitulo} className={styles.titulo}>
            {portfolio.videoModalTitle}
          </h3>

          <button
            type="button"
            ref={cerrarRef}
            onClick={onClose}
            className={styles.cerrar}
            aria-label={portfolio.videoCloseLabel}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* `preload="none"` es la razón de que los 12 MB no cuesten nada en la
            portada: hasta que este componente se monta, el navegador no ha
            pedido un solo byte del archivo. El póster es el mismo del panel,
            que a estas alturas ya está en caché. */}
        <video
          ref={piezaRef}
          className={styles.pieza}
          src="/videos/zc-teaser-full.mp4"
          poster="/images/zc-teaser-poster.webp"
          controls
          playsInline
          preload="none"
          aria-label={portfolio.videoDescripcion}
        />
      </div>
    </div>,
    document.body,
  );
}
