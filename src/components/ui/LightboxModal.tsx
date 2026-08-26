'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useLang } from '@/context/LangContext';
import type { LightboxItem } from '@/types';

import styles from './LightboxModal.module.css';

interface LightboxModalProps {
  readonly items: readonly LightboxItem[];
  readonly indice: number;
  readonly onClose: () => void;
  readonly onPrev: () => void;
  readonly onNext: () => void;
}

/**
 * Galería a pantalla completa con navegación entre imágenes.
 *
 * Se monta sólo mientras está abierta: quien la usa la renderiza de forma
 * condicional. El teclado y el bloqueo del fondo los gobierna `useLightbox`.
 */
export function LightboxModal({ items, indice, onClose, onPrev, onNext }: LightboxModalProps) {
  const { content } = useLang();
  const cerrarRef = useRef<HTMLButtonElement>(null);

  /**
   * Lleva el foco al botón de cerrar al abrir y lo devuelve al cerrar.
   *
   * El sitio actual no hacía nada de esto: al abrir la galería con el teclado,
   * el foco se quedaba detrás, en la miniatura, así que tabular recorría la
   * página de fondo mientras la galería tapaba la pantalla.
   *
   * Falta todavía atrapar el foco dentro del diálogo; con estos tres botones y
   * el cierre por Escape el recorrido es corto, pero conviene anotarlo.
   */
  useEffect(() => {
    const previo = document.activeElement;
    cerrarRef.current?.focus();

    return () => {
      if (previo instanceof HTMLElement) previo.focus();
    };
  }, []);

  const actual = items[indice];

  /**
   * No hace falta comprobar si existe `document`: este componente sólo se
   * monta cuando alguien abre la galería, es decir, ya en el cliente. Durante
   * el prerenderizado el padre ni siquiera lo renderiza.
   */
  if (!actual) return null;

  return createPortal(
    /**
     * Se renderiza en `document.body` y no en su lugar del árbol por un motivo
     * concreto: GSAP deja transformaciones en línea sobre las tarjetas al
     * terminar el revelado, y un ancestro con `transform` distinto de `none`
     * crea un bloque contenedor que rompe `position: fixed`. La galería
     * quedaría posicionada respecto a la tarjeta en lugar de respecto a la
     * ventana. El sitio actual esquivaba esto insertando su HTML en el body.
     */
    <div
      className={styles.raiz}
      role="dialog"
      aria-modal="true"
      aria-label={actual.caption}
    >
      {/* Cerrar al pulsar fuera de la imagen, igual que en el sitio actual. */}
      <div className={styles.velo} onClick={onClose} />

      <button
        type="button"
        ref={cerrarRef}
        onClick={onClose}
        className={`${styles.control} ${styles.cerrar}`}
        aria-label={content.lightbox.closeLabel}
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onPrev}
        className={`${styles.control} ${styles.anterior}`}
        aria-label={content.lightbox.prevLabel}
      >
        <svg width="36" height="36" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onNext}
        className={`${styles.control} ${styles.siguiente}`}
        aria-label={content.lightbox.nextLabel}
      >
        <svg width="36" height="36" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <figure className={styles.figura}>
        <Image
          src={actual.image.src}
          alt={actual.alt}
          width={actual.image.width}
          height={actual.image.height}
          sizes="(max-width: 1024px) 100vw, 1024px"
          className={styles.imagen}
        />
        <figcaption className={styles.pie}>{actual.caption}</figcaption>
      </figure>
    </div>,
    document.body,
  );
}
