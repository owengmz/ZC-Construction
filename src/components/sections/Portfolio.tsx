'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { LightboxModal } from '@/components/ui/LightboxModal';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { VideoModal } from '@/components/ui/VideoModal';
import { useLang } from '@/context/LangContext';
import { gallery, textosDeEntrada } from '@/data/gallery';
import { rutaDePagina } from '@/data/routes';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { useLightbox } from '@/hooks/useLightbox';
import { useModalBehavior } from '@/hooks/useModalBehavior';
import type { LightboxItem } from '@/types';

import styles from './Portfolio.module.css';

/**
 * Cada proyecto aporta dos fotos a la galería: el antes y el después.
 *
 * Se declara como constante para que la aritmética de índices de más abajo
 * (`indiceProyecto * FOTOS_POR_PROYECTO`) diga por qué multiplica por dos.
 */
const FOTOS_POR_PROYECTO = 2;

/**
 * Cuántas fichas caben en la composición aprobada, junto al panel de vídeo.
 *
 * Una. La portada enseña UN expediente, con sus dos fotos enteras y sin
 * recortar, y el resto del catálogo se lee en la galería completa, que es
 * exactamente para lo que existe.
 *
 * No recorta la lista —de eso se encarga `featured` en `data/gallery.ts`— sino
 * que documenta el límite del diseño y sirve de red: la anchura de las columnas
 * de `.cuerpo` está calculada contra el alto de UNA ficha, así que una segunda
 * obra marcada como destacada estiraría la columna al doble y dejaría el panel
 * de vídeo con media altura de fondo vacío debajo de su icono.
 */
const FICHAS_EN_PORTADA = 1;

/**
 * Anchos con los que se dibuja el marco, para que `next/image` elija bien.
 *
 * Ya no hay que estimar qué fracción del hueco se lleva cada foto: las dos
 * llenan el mismo marco, y el marco es el ancho de su columna. A partir de
 * 1024 px la fila se reparte en dos mitades iguales con una calle de 24 px y
 * márgenes de 40, de donde salen los 668 px con el contenedor ya topado en
 * 1440. Por debajo, la ficha es la fila entera.
 */
const SIZES_FOTO =
  '(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 80px), (max-width: 1439px) calc((100vw - 104px) / 2), 668px';

/**
 * Sección de Nuestros Trabajos.
 *
 * Rediseño «Expediente de Obra»: panel de vídeo a la izquierda —marco de visor
 * con los cuatro ángulos, a la espera de la pieza real— y un único expediente
 * destacado a la derecha, con su ubicación y su par antes/después sin recortar.
 *
 * Las dos piezas no están puestas una al lado de la otra: están dimensionadas
 * la una contra la otra. El detalle del cálculo está en `.cuerpo`, en la hoja
 * de estilos de la sección.
 */
export function Portfolio() {
  const { content } = useLang();

  const seccionRef = useRef<HTMLElement>(null);
  const cabeceraRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const piezaRef = useRef<HTMLVideoElement>(null);
  const fichasRef = useRef<(HTMLElement | null)[]>([]);
  const pieRef = useRef<HTMLDivElement>(null);

  /**
   * Los expedientes que se enseñan aquí. El resto queda para la galería.
   *
   * Quien decide cuáles son es el campo `featured` de cada obra en
   * `data/gallery.ts`, no este componente: así se cambia la selección de la
   * portada editando un `true` en el catálogo, sin abrir código de React.
   */
  const destacados = useMemo(
    () => gallery.filter((obra) => obra.featured).slice(0, FICHAS_EN_PORTADA),
    [],
  );

  /**
   * Lista plana de las fotos VISIBLES, en el orden en que se navegan con las
   * flechas: proyecto 1 antes, proyecto 1 después, proyecto 2 antes…
   *
   * Se deriva de `destacados` y no de `gallery` entera a propósito: si
   * incluyera todas las obras, quien abriera una foto y avanzara con las
   * flechas acabaría viendo proyectos que no están en pantalla, sin entender
   * de dónde salen.
   */
  const fotos = useMemo<LightboxItem[]>(
    () =>
      destacados.flatMap((obra) => {
        const copy = textosDeEntrada(obra, content);
        return [
          { image: obra.before, alt: copy.beforeAlt, caption: content.portfolio.beforeLabel },
          { image: obra.after, alt: copy.afterAlt, caption: content.portfolio.afterLabel },
        ];
      }),
    [content, destacados],
  );

  const lightbox = useLightbox(fotos.length);

  /**
   * Apertura del recorrido a tamaño completo.
   *
   * El estado vive aquí y no dentro de `VideoModal` por el mismo reparto que
   * usa `Insurance` con el modal de garantía: el modal se monta sólo mientras
   * está abierto, así que no puede ser él quien recuerde si lo está.
   */
  const [recorridoAbierto, setRecorridoAbierto] = useState(false);
  const cerrarRecorrido = useCallback(() => setRecorridoAbierto(false), []);

  // Escape y congelado del fondo, comunes a las tres capas modales del sitio.
  useModalBehavior({ abierto: recorridoAbierto, alCerrar: cerrarRecorrido });

  /**
   * Detiene el bucle si el sistema pide movimiento reducido.
   *
   * El `autoPlay` va en el marcado y no aquí a propósito: así el vídeo arranca
   * con el HTML del servidor, sin esperar a la hidratación. El precio es que en
   * el caso de movimiento reducido llega a reproducir unas décimas antes de que
   * este efecto lo pare; a cambio, el caso normal —que es el de casi todo el
   * mundo— no paga un parpadeo de póster en cada carga.
   *
   * Se vuelve al fotograma cero para que quede exactamente el póster, y no un
   * cuadro cualquiera del recorrido congelado a media zancada.
   */
  useEffect(() => {
    const pieza = piezaRef.current;
    if (!pieza) return;

    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');

    const aplicar = () => {
      if (consulta.matches) {
        pieza.pause();
        pieza.currentTime = 0;
      } else {
        // `play()` devuelve una promesa que el navegador rechaza si la pestaña
        // está oculta o la política de autoreproducción lo impide. No es un
        // fallo que haya que tratar: el póster ya cubre ese caso.
        void pieza.play().catch(() => {});
      }
    };

    aplicar();
    consulta.addEventListener('change', aplicar);
    return () => consulta.removeEventListener('change', aplicar);
  }, []);

  // Un solo despliegue orquestado para toda la sección: cabecera desde la
  // izquierda, y después el panel de vídeo y las fichas desde abajo,
  // escalonados. El pie cierra la secuencia.
  useGsapReveal(seccionRef, [
    {
      elementos: () => [cabeceraRef.current],
      inicio: 'title',
      desde: { x: -35 },
      duracion: 0.7,
    },
    {
      elementos: () => [videoRef.current, ...fichasRef.current],
      inicio: 'cards',
      desde: { y: 45 },
      duracion: 0.7,
      escalonado: 0.15,
    },
    {
      elementos: () => [pieRef.current],
      inicio: 'cards',
      desde: { y: 20 },
      duracion: 0.6,
      retardo: 0.45,
    },
  ]);

  return (
    <section id="portfolio" ref={seccionRef} className={styles.seccion}>
      <div className={styles.contenedor}>
        <div ref={cabeceraRef} className={styles.cabecera}>
          <h2 className={styles.tituloSeccion}>{content.portfolio.sectionTitle}</h2>
          <div className={styles.filete} />
          <p className={styles.intro}>{content.portfolio.intro}</p>
        </div>

        <div className={styles.cuerpo}>
          <div ref={videoRef} className={styles.video}>
            <span className={`${styles.esquina} ${styles.esquinaSupIzq}`} aria-hidden="true" />
            <span className={`${styles.esquina} ${styles.esquinaSupDer}`} aria-hidden="true" />
            <span className={`${styles.esquina} ${styles.esquinaInfIzq}`} aria-hidden="true" />
            <span className={`${styles.esquina} ${styles.esquinaInfDer}`} aria-hidden="true" />

            {/* El recorrido de obra, sin pista de audio y en bucle. Va antes
                que el rótulo en el orden del marcado para que este quede por
                encima sin necesidad de disputarse el apilamiento.

                `preload="metadata"` y no `auto`: la sección vive bajo el
                pliegue, así que de entrada sólo se piden las cabeceras y el
                navegador difiere los 2,7 MB hasta que el panel se acerca a la
                pantalla. El póster es lo que se ve mientras tanto. */}
            <video
              ref={piezaRef}
              className={styles.videoPieza}
              src="/videos/zc-teaser.mp4"
              poster="/images/zc-teaser-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={content.portfolio.videoDescripcion}
            />

            <span className={styles.videoTag}>{content.portfolio.videoTag}</span>

            {/* Abajo a la izquierda, en el eje del rótulo de arriba: los dos
                son placas atornilladas al mismo marco. El de arriba nombra la
                pieza y este ofrece la acción, que es lo que justifica que sea
                el único ember del panel además de los ángulos. */}
            <button
              type="button"
              onClick={() => setRecorridoAbierto(true)}
              className={styles.videoAmpliar}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                {/* Altavoz con una onda: el botón promete sonido, no tamaño. */}
                <path
                  d="M1 5v4h2.5L7 11.5v-9L3.5 5H1Z"
                  fill="currentColor"
                />
                <path
                  d="M9.5 4.6a3.2 3.2 0 0 1 0 4.8"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
                <path
                  d="M11.6 2.8a5.8 5.8 0 0 1 0 8.4"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
              {content.portfolio.videoExpandLabel}
            </button>
          </div>

          <div className={styles.fichas}>
            {destacados.map((obra, indiceProyecto) => {
              const indiceAntes = indiceProyecto * FOTOS_POR_PROYECTO;

              return (
                <div
                  key={obra.id}
                  ref={(elemento) => {
                    fichasRef.current[indiceProyecto] = elemento;
                  }}
                >
                  <ProjectCard
                    before={obra.before}
                    after={obra.after}
                    copy={textosDeEntrada(obra, content)}
                    beforeLabel={content.portfolio.beforeLabel}
                    afterLabel={content.portfolio.afterLabel}
                    compareLabel={content.portfolio.compareLabel}
                    expandLabel={content.portfolio.expandLabel}
                    sizes={SIZES_FOTO}
                    onAmpliar={() => lightbox.abrir(indiceAntes)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div ref={pieRef} className={styles.pieSeccion}>
          {/* El segmento de la galería cambia con el idioma (`/en/our-work`,
              `/es/nuestros-trabajos`), así que la ruta no se interpola aquí:
              la resuelve `routeSlugs`, que es su única fuente. */}
          <Link href={rutaDePagina('ourWork', content.lang)} className={styles.galeriaCta}>
            {content.portfolio.galleryCtaLabel}
            <svg
              className={styles.flecha}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </Link>
        </div>
      </div>

      {lightbox.abierto && (
        <LightboxModal
          items={fotos}
          indice={lightbox.indice}
          onClose={lightbox.cerrar}
          onPrev={lightbox.anterior}
          onNext={lightbox.siguiente}
        />
      )}

      {/* Montaje condicional, como las otras dos capas: mientras nadie lo abre
          no existe en el árbol, y con `preload="none"` dentro eso significa que
          los 12 MB de la pieza con audio no se piden hasta este momento. */}
      {recorridoAbierto && <VideoModal onClose={cerrarRecorrido} />}
    </section>
  );
}
