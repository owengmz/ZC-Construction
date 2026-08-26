'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { useLang } from '@/context/LangContext';
import { siteConfig } from '@/data/site';

import styles from './WhatsAppFab.module.css';

/**
 * Trazado del logotipo de WhatsApp.
 *
 * Se declara una vez y se reutiliza en los dos tamaños en que aparece: 18 px
 * en cada contacto del panel y 32 px en el botón flotante. En el sitio actual
 * este mismo trazado estaba copiado tres veces en el HTML.
 */
const TRAZADO_WHATSAPP =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

/** Icono de WhatsApp al tamaño indicado. */
function IconoWhatsApp({ tamano }: { readonly tamano: number }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={TRAZADO_WHATSAPP} />
    </svg>
  );
}

/**
 * Botón flotante de WhatsApp con los dos contactos de la empresa.
 *
 * Sustituye a `legacy/assets/js/whatsapp-fab.js`, que manipulaba estilos en
 * línea para abrir y cerrar el panel.
 */
export function WhatsAppFab() {
  const { content } = useLang();
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const idPanel = useId();

  /**
   * Cierre al pulsar fuera y con Escape.
   *
   * El sitio actual detenía la propagación del clic del botón para que su
   * propio manejador global no lo cerrara al instante. Aquí no hace falta:
   * basta comprobar si el clic cayó dentro del contenedor, que incluye tanto
   * el botón como el panel. Evitar `stopPropagation` es preferible porque no
   * interfiere con otros manejadores de la página.
   *
   * Escape no estaba en el sitio actual; es lo mínimo para poder cerrar el
   * panel sin ratón.
   */
  useEffect(() => {
    if (!abierto) return;

    const alPulsarFuera = (evento: MouseEvent) => {
      if (!contenedorRef.current?.contains(evento.target as Node)) setAbierto(false);
    };

    const alPulsarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setAbierto(false);
    };

    document.addEventListener('click', alPulsarFuera);
    document.addEventListener('keydown', alPulsarTecla);

    return () => {
      document.removeEventListener('click', alPulsarFuera);
      document.removeEventListener('keydown', alPulsarTecla);
    };
  }, [abierto]);

  return (
    <div ref={contenedorRef} className={styles.contenedor}>
      <div
        id={idPanel}
        className={abierto ? `${styles.panel} ${styles.panelAbierto}` : styles.panel}
        // Sigue en el DOM cerrado por la transición, pero no debe ser
        // navegable ni anunciarse mientras está oculto.
        aria-hidden={!abierto}
      >
        <div className={styles.tarjeta}>
          <p className={styles.titulo}>{content.whatsapp.panelTitle}</p>

          {siteConfig.phones.map((telefono) => (
            <a
              key={telefono.id}
              href={telefono.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contacto}
              tabIndex={abierto ? undefined : -1}
            >
              <span className={styles.avatar}>
                <IconoWhatsApp tamano={18} />
              </span>
              <span className={styles.datosContacto}>
                <span className={styles.rol}>{content.whatsapp.contactRoles[telefono.id]}</span>
                <span className={styles.numero}>{telefono.display}</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={styles.boton}
        onClick={() => setAbierto((estaAbierto) => !estaAbierto)}
        aria-label={content.whatsapp.toggleLabel}
        aria-expanded={abierto}
        aria-controls={idPanel}
      >
        <IconoWhatsApp tamano={32} />
      </button>
    </div>
  );
}
