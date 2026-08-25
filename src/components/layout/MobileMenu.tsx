'use client';

import { useEffect } from 'react';

import { useLang } from '@/context/LangContext';
import { ORDEN_SECCIONES } from '@/data/navigation';

import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  readonly isOpen: boolean;
  /** Se invoca al pulsar un enlace o la tecla Escape. */
  readonly onClose: () => void;
}

/**
 * Menú a pantalla completa para móvil.
 *
 * Se renderiza siempre y se muestra u oculta con opacidad, igual que el sitio
 * actual. Mantenerlo en el DOM permite que la transición de entrada y salida
 * funcione; desmontarlo haría que desapareciera de golpe.
 *
 * @param isOpen Si el menú está desplegado.
 * @param onClose Cierre solicitado por el usuario.
 */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { content } = useLang();

  /**
   * Bloquea el desplazamiento del fondo mientras el menú está abierto, y cierra
   * con Escape.
   *
   * Lo primero lo hacía `mobile-menu.js`; lo segundo no existía en el sitio
   * actual, y es lo mínimo que se espera de una capa modal para quien navega
   * con teclado.
   */
  useEffect(() => {
    if (!isOpen) return;

    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const alPulsarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', alPulsarTecla);

    return () => {
      // Se restaura el valor previo en lugar de vaciarlo: si otro componente
      // (por ejemplo el lightbox) también bloqueó el scroll, no se lo pisamos.
      document.body.style.overflow = anterior;
      document.removeEventListener('keydown', alPulsarTecla);
    };
  }, [isOpen, onClose]);

  return (
    <div
      id="mobile-menu"
      className={isOpen ? `${styles.overlay} ${styles.abierto}` : styles.overlay}
      // Oculto para lectores de pantalla mientras está cerrado: sigue en el
      // DOM por la transición, pero no debe ser navegable.
      aria-hidden={!isOpen}
    >
      <nav className={styles.enlaces}>
        {ORDEN_SECCIONES.map((seccion) => (
          <a
            key={seccion}
            href={`#${seccion}`}
            className={styles.enlace}
            onClick={onClose}
            tabIndex={isOpen ? undefined : -1}
          >
            {content.nav.links[seccion]}
          </a>
        ))}
      </nav>

      <a
        href="#contact"
        className={styles.cta}
        onClick={onClose}
        tabIndex={isOpen ? undefined : -1}
      >
        {content.nav.ctaMobile}
      </a>
    </div>
  );
}
