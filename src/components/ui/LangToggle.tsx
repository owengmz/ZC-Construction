'use client';

import Link from 'next/link';
import { Fragment } from 'react';

import { useLangToggle } from '@/hooks/useLangToggle';

import styles from './LangToggle.module.css';

/**
 * Selector de idioma de la barra de navegación.
 *
 * Cada opción es un `<Link>` a la raíz de su idioma, no un botón: así el
 * cambio de idioma es una navegación real, indexable por buscadores y abrible
 * en una pestaña nueva. El sitio actual usaba `<button>` con un manejador de
 * JavaScript, de modo que para un rastreador la versión en español no existía.
 *
 * El componente no conoce los idiomas: recibe de `useLangToggle` una lista de
 * opciones ya resueltas y se limita a pintarlas.
 */
export function LangToggle() {
  const { options, groupLabel } = useLangToggle();

  return (
    // `role="group"` es necesario para que `aria-label` se anuncie: un <div>
    // sin rol no expone nombre accesible.
    <div className={styles.grupo} role="group" aria-label={groupLabel}>
      {options.map((opcion, indice) => (
        <Fragment key={opcion.lang}>
          {indice > 0 && (
            <span className={styles.separador} aria-hidden="true">
              |
            </span>
          )}
          <Link
            href={opcion.href}
            /**
             * `scroll={false}` conserva la posición de desplazamiento al
             * cambiar de idioma. Sin esto, Next.js salta al principio de la
             * página y quien estuviera leyendo la sección de garantía
             * aparecería de vuelta en el hero. El sitio actual no movía el
             * scroll porque sólo alternaba clases CSS.
             */
            scroll={false}
            hrefLang={opcion.lang}
            aria-current={opcion.isActive ? 'true' : undefined}
            className={opcion.isActive ? `${styles.opcion} ${styles.activa}` : styles.opcion}
          >
            {opcion.label}
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
