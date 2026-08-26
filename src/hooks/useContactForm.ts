'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent, type RefObject } from 'react';

import { siteConfig } from '@/data/site';
import type { ContactFormStatus } from '@/types';

/**
 * Milisegundos que el aviso de resultado permanece visible.
 *
 * Mismo valor que el `setTimeout` de `legacy/assets/js/contact-form.js`.
 */
const MS_AVISO_VISIBLE = 5000;

export interface ControlesFormulario {
  /** Se asigna al `<form>`; sirve para leer los campos y para animarlo. */
  readonly formRef: RefObject<HTMLFormElement | null>;
  readonly estado: ContactFormStatus;
  readonly enviar: (evento: FormEvent<HTMLFormElement>) => void;
}

/**
 * Envío del formulario de contacto a Formspree.
 *
 * Reproduce `contact-form.js` con una diferencia de fondo: allí el estado del
 * envío estaba implícito en el DOM —el botón deshabilitado, unas clases
 * puestas a mano sobre el aviso— y aquí es un valor explícito
 * (`idle` → `submitting` → `success` | `error`) del que se derivan el texto del
 * botón, si está deshabilitado y qué aviso se muestra.
 *
 * Los campos se leen del DOM con `FormData` en lugar de mantenerlos en estado
 * de React. Para un formulario que sólo se envía y se vacía, controlar cada
 * campo obligaría a re-renderizar en cada pulsación sin ganar nada: no hay
 * validación en vivo ni dependencias entre campos.
 *
 * @returns Referencia al formulario, estado del envío y manejador de submit.
 */
export function useContactForm(): ControlesFormulario {
  const formRef = useRef<HTMLFormElement>(null);
  const [estado, setEstado] = useState<ContactFormStatus>('idle');

  /** Temporizador que devuelve el formulario a reposo tras mostrar el aviso. */
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Si el componente se desmonta con el aviso en pantalla —al cambiar de
  // idioma, por ejemplo—, el temporizador intentaría actualizar un componente
  // que ya no existe.
  useEffect(() => {
    return () => {
      if (temporizadorRef.current !== null) clearTimeout(temporizadorRef.current);
    };
  }, []);

  const programarVueltaAReposo = useCallback(() => {
    if (temporizadorRef.current !== null) clearTimeout(temporizadorRef.current);
    temporizadorRef.current = setTimeout(() => setEstado('idle'), MS_AVISO_VISIBLE);
  }, []);

  const enviar = useCallback(
    (evento: FormEvent<HTMLFormElement>) => {
      evento.preventDefault();

      const formulario = evento.currentTarget;
      setEstado('submitting');

      // `void` porque el manejador de submit no puede ser asíncrono: React
      // espera que devuelva void, no una promesa.
      void (async () => {
        try {
          const respuesta = await fetch(siteConfig.formspreeEndpoint, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(formulario),
          });

          if (!respuesta.ok) throw new Error(`Formspree respondió ${respuesta.status}`);

          setEstado('success');
          formulario.reset();
        } catch {
          // Un fallo de red y un rechazo de Formspree se tratan igual: al
          // visitante le sirve el mismo mensaje y la misma acción, reintentar.
          setEstado('error');
        } finally {
          programarVueltaAReposo();
        }
      })();
    },
    [programarVueltaAReposo],
  );

  return { formRef, estado, enviar };
}
