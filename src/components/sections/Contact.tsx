'use client';

import { Fragment, useId, useRef, type ReactNode } from 'react';

import { useLang } from '@/context/LangContext';
import { siteConfig } from '@/data/site';
import { useContactForm } from '@/hooks/useContactForm';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import type { ServiceOptionValue } from '@/types';

import styles from './Contact.module.css';

/** Orden de las opciones del desplegable de servicio, como en el sitio actual. */
const ORDEN_SERVICIOS: readonly ServiceOptionValue[] = [
  'framing',
  'renovation',
  'roofing',
  'other',
];

/** Trazados de los iconos de los tres datos de contacto. */
const ICONO_UBICACION: ReactNode = (
  <>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </>
);

const ICONO_SOBRE: ReactNode = (
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
);

const ICONO_TELEFONO: ReactNode = (
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
);

/**
 * Sección de contacto: datos de la empresa y formulario a Formspree.
 *
 * Es la última de la página y la única con lógica de red. La máquina de
 * estados del envío vive en `useContactForm`; aquí sólo se decide qué se pinta
 * en cada estado.
 */
export function Contact() {
  const { content } = useLang();
  const { formRef, estado, enviar } = useContactForm();

  const seccionRef = useRef<HTMLElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const datosRef = useRef<(HTMLElement | null)[]>([]);

  /**
   * Prefijo para los `id` de los campos.
   *
   * Se generan en vez de escribirlos fijos para que el vínculo entre `<label>`
   * y su control no se rompiera si la sección llegara a renderizarse dos veces
   * en la misma página: dos `id="field-name"` harían que pulsar la etiqueta
   * enfocara siempre el primero.
   */
  const idBase = useId();
  const idCampo = (nombre: string) => `${idBase}-${nombre}`;

  // Mismos valores que `animContact.js`: título, luego los datos escalonados,
  // y el formulario entrando desde abajo con un cuarto de segundo de retraso.
  useGsapReveal(seccionRef, [
    {
      elementos: () => [tituloRef.current],
      inicio: 'title',
      desde: { x: -35 },
      duracion: 0.7,
    },
    {
      elementos: () => datosRef.current,
      inicio: 'cards',
      desde: { x: -25 },
      duracion: 0.55,
      escalonado: 0.12,
    },
    {
      elementos: () => [formRef.current],
      inicio: 'cards',
      desde: { y: 35 },
      duracion: 0.75,
      retardo: 0.25,
    },
  ]);

  const datos = [
    { icono: ICONO_UBICACION, contenido: siteConfig.address },
    { icono: ICONO_SOBRE, contenido: siteConfig.email },
    {
      icono: ICONO_TELEFONO,
      contenido: siteConfig.phones.map((telefono, indice) => (
        <Fragment key={telefono.id}>
          {indice > 0 && <br />}
          {telefono.display}
        </Fragment>
      )),
    },
  ];

  return (
    <section id="contact" ref={seccionRef} className={styles.seccion}>
      <div className={styles.rejilla}>
        <div>
          <h2 ref={tituloRef} className={styles.tituloSeccion}>
            {content.contact.sectionTitle}
          </h2>
          <p className={styles.intro}>{content.contact.intro}</p>

          <div className={styles.datos}>
            {datos.map((dato, indice) => (
              <div
                key={indice}
                ref={(elemento) => {
                  datosRef.current[indice] = elemento;
                }}
                className={styles.dato}
              >
                <svg
                  className={styles.iconoDato}
                  width="28"
                  height="28"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {dato.icono}
                </svg>
                <p className={styles.textoDato}>{dato.contenido}</p>
              </div>
            ))}
          </div>

          <div className={styles.acciones}>
            <a
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.botonCalendly}
            >
              {content.contact.scheduleCtaLabel}
              <svg
                className={styles.iconoCalendario}
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </a>
          </div>
        </div>

        <div className={styles.panel}>
          {/* Sin `noValidate`: se deja actuar a la validación nativa del
              navegador sobre `required` y `type="email"`, igual que el sitio
              actual, que tampoco la desactivaba. */}
          <form ref={formRef} onSubmit={enviar} className={styles.formulario}>
            <div className={styles.fila}>
              <div className={styles.campo}>
                <label htmlFor={idCampo('name')} className={styles.etiqueta}>
                  {content.contact.form.labels.name}
                </label>
                <input
                  id={idCampo('name')}
                  name="name"
                  type="text"
                  required
                  className={styles.control}
                />
              </div>

              <div className={styles.campo}>
                <label htmlFor={idCampo('email')} className={styles.etiqueta}>
                  {content.contact.form.labels.email}
                </label>
                <input
                  id={idCampo('email')}
                  name="email"
                  type="email"
                  required
                  className={styles.control}
                />
              </div>
            </div>

            <div className={styles.fila}>
              <div className={styles.campo}>
                <label htmlFor={idCampo('phone')} className={styles.etiqueta}>
                  {content.contact.form.labels.phone}
                </label>
                <input id={idCampo('phone')} name="phone" type="tel" className={styles.control} />
              </div>

              <div className={styles.campo}>
                <label htmlFor={idCampo('service')} className={styles.etiqueta}>
                  {content.contact.form.labels.service}
                </label>
                <select id={idCampo('service')} name="service" className={styles.control}>
                  {ORDEN_SERVICIOS.map((valor) => (
                    // El `value` viaja a Formspree sin traducir, igual que en el
                    // sitio actual: lo que cambia con el idioma es la etiqueta.
                    <option key={valor} value={valor}>
                      {content.contact.form.serviceOptions[valor]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.campo}>
              <label htmlFor={idCampo('message')} className={styles.etiqueta}>
                {content.contact.form.labels.message}
              </label>
              <textarea
                id={idCampo('message')}
                name="message"
                rows={4}
                className={styles.control}
              />
            </div>

            <button type="submit" className={styles.botonEnviar} disabled={estado === 'submitting'}>
              {estado === 'submitting'
                ? content.contact.form.submittingLabel
                : content.contact.form.submitLabel}
            </button>

            {/**
             * Aviso del resultado.
             *
             * `role="status"` para el acierto y `role="alert"` para el fallo: el
             * primero se anuncia sin interrumpir, el segundo sí. En el sitio
             * actual este bloque no tenía ningún rol, así que quien usa lector
             * de pantalla no se enteraba de si el mensaje se había enviado.
             */}
            {estado === 'success' && (
              <p role="status" className={`${styles.aviso} ${styles.avisoExito}`}>
                {content.contact.form.successMessage}
              </p>
            )}

            {estado === 'error' && (
              <p role="alert" className={`${styles.aviso} ${styles.avisoError}`}>
                {content.contact.form.errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
