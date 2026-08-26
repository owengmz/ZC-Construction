'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';

import { WarrantyModal } from '@/components/ui/WarrantyModal';
import { useLang } from '@/context/LangContext';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { useModalBehavior } from '@/hooks/useModalBehavior';
import type { InsuranceCardId } from '@/types';

import styles from './Insurance.module.css';

/** Orden de las dos tarjetas en pantalla. */
const ORDEN_TARJETAS: readonly InsuranceCardId[] = ['insured', 'warranty'];

/**
 * Icono de cada tarjeta.
 *
 * Se declara como `Record<InsuranceCardId, ReactNode>` para que el compilador
 * exija un icono si algún día se añade una tercera tarjeta, en lugar de
 * renderizar un hueco vacío.
 */
const ICONOS: Record<InsuranceCardId, ReactNode> = {
  // Escudo con marca de verificación: cobertura.
  insured: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
    />
  ),
  // Sello dentado con marca de verificación: calidad garantizada.
  warranty: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 010 1.186 3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043 3.745 3.745 0 01-1.186 0 3.745 3.745 0 01-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-1.186 0 3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296 3.745 3.745 0 010-1.186 3.745 3.745 0 01-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 010-1.186 3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043 3.745 3.745 0 011.186 0 3.745 3.745 0 013.068-1.593z"
    />
  ),
};

/**
 * Sección de Seguro y Garantía.
 *
 * Dos tarjetas; la segunda abre el modal con el texto legal completo. Es la
 * única sección cuyas tarjetas entran desde lados opuestos, que es el caso
 * para el que `useGsapReveal` admite un desplazamiento en función del índice.
 */
export function Insurance() {
  const { content } = useLang();

  const seccionRef = useRef<HTMLElement>(null);
  const cabeceraRef = useRef<HTMLDivElement>(null);
  const tarjetasRef = useRef<(HTMLElement | null)[]>([]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const cerrarModal = useCallback(() => setModalAbierto(false), []);

  // Escape y bloqueo del fondo; el mismo hook que usa la galería.
  useModalBehavior({ abierto: modalAbierto, alCerrar: cerrarModal });

  // Mismos valores que `animInsurance.js`: la primera tarjeta entra desde la
  // izquierda y la segunda desde la derecha, con 0,18 s de separación.
  useGsapReveal(seccionRef, [
    {
      elementos: () => [cabeceraRef.current],
      inicio: 'title',
      desde: { x: -35 },
      duracion: 0.7,
    },
    {
      elementos: () => tarjetasRef.current,
      inicio: 'cards',
      desde: (indice) => ({ x: indice === 0 ? -45 : 45 }),
      duracion: 0.75,
      escalonado: 0.18,
    },
  ]);

  return (
    <section id="insurance" ref={seccionRef} className={styles.seccion}>
      <div className={styles.contenedor}>
        <div ref={cabeceraRef} className={styles.cabecera}>
          <h2 className={styles.tituloSeccion}>{content.insurance.sectionTitle}</h2>
          <div className={styles.subrayado} />
        </div>

        <div className={styles.rejilla}>
          {ORDEN_TARJETAS.map((id, indice) => {
            const copy = content.insurance.cards[id];

            return (
              <article
                key={id}
                ref={(elemento) => {
                  tarjetasRef.current[indice] = elemento;
                }}
                className={styles.tarjeta}
              >
                <div className={styles.encabezado}>
                  <svg
                    className={styles.icono}
                    width="48"
                    height="48"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    {ICONOS[id]}
                  </svg>
                  <span className={styles.distintivo}>{copy.badge}</span>
                </div>

                <div>
                  <h3 className={styles.tituloTarjeta}>{copy.title}</h3>
                  <p className={styles.cuerpoTarjeta}>{copy.body}</p>

                  {id === 'warranty' && (
                    <button
                      type="button"
                      className={styles.enlaceGarantia}
                      onClick={() => setModalAbierto(true)}
                      aria-haspopup="dialog"
                      aria-expanded={modalAbierto}
                    >
                      {content.insurance.warrantyCtaLabel}
                      <svg
                        className={styles.flecha}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {modalAbierto && <WarrantyModal onClose={cerrarModal} />}
    </section>
  );
}
