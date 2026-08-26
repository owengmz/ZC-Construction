'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useLang } from '@/context/LangContext';

import styles from './WarrantyModal.module.css';

interface WarrantyModalProps {
  readonly onClose: () => void;
}

/**
 * Modal con el texto completo de la garantía de techado.
 *
 * Sólo se monta mientras está abierto; el bloqueo del fondo y el cierre con
 * Escape los aporta `useModalBehavior` desde el componente padre, que es quien
 * gobierna el estado de apertura.
 */
export function WarrantyModal({ onClose }: WarrantyModalProps) {
  const { content } = useLang();
  const cerrarRef = useRef<HTMLButtonElement>(null);

  /**
   * Identificador generado para enlazar el diálogo con su título.
   *
   * `useId` produce un valor estable entre servidor y cliente, que es lo que
   * evita que la hidratación se queje. Se usa en `aria-labelledby` para que un
   * lector de pantalla anuncie "Garantía de Techado" al abrirse, en lugar de
   * un diálogo sin nombre.
   */
  const idTitulo = useId();

  /** Foco al abrir, devuelto a su sitio al cerrar. Mismo criterio que la galería. */
  useEffect(() => {
    const previo = document.activeElement;
    cerrarRef.current?.focus();

    return () => {
      if (previo instanceof HTMLElement) previo.focus();
    };
  }, []);

  const { warranty } = content;

  return createPortal(
    // Al igual que la galería, se renderiza en el body: las tarjetas de la
    // sección llevan transformaciones de GSAP, y un ancestro transformado
    // rompería el `position: fixed` de esta capa.
    <div className={styles.raiz} role="dialog" aria-modal="true" aria-labelledby={idTitulo}>
      <div className={styles.velo} onClick={onClose} />

      <div className={styles.panel}>
        <button
          type="button"
          ref={cerrarRef}
          onClick={onClose}
          className={styles.cerrar}
          aria-label={warranty.closeLabel}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 id={idTitulo} className={styles.titulo}>
          {warranty.title}
        </h3>

        <div className={styles.cuerpo}>
          {/* El fragmento en negrita viene partido en tres desde la capa de
              datos, así se compone con JSX normal y sin HTML incrustado. */}
          <p>
            {warranty.lead.before}
            <strong className={styles.destacado}>{warranty.lead.highlight}</strong>
            {warranty.lead.after}
          </p>

          <p>{warranty.procedure}</p>

          <h4 className={styles.subtitulo}>{warranty.limitationsTitle}</h4>

          <p>{warranty.limitationsIntro}</p>

          <ul className={styles.lista}>
            {warranty.limitations.map((limitacion) => (
              <li key={limitacion}>{limitacion}</li>
            ))}
          </ul>

          <p>{warranty.scope}</p>

          <p className={styles.aviso}>{warranty.disclaimer}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
