'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useLang } from '@/context/LangContext';
import { siteConfig } from '@/data/site';

import styles from './Footer.module.css';

/**
 * Año en que se generó la página.
 *
 * Se calcula al construir, así que sirve como valor de partida idéntico en
 * servidor y cliente. Ver la explicación del efecto de más abajo.
 */
const ANIO_DE_BUILD = new Date().getFullYear();

/**
 * Pie del sitio.
 *
 * Los enlaces de privacidad y términos apuntan a `#`, igual que en el sitio
 * actual: son marcadores a la espera de que existan esas páginas.
 */
export function Footer() {
  const { content } = useLang();

  /**
   * Año del aviso de copyright.
   *
   * El sitio actual lo calculaba en el navegador con
   * `new Date().getFullYear()` en cada visita, así que siempre era correcto.
   * Aquí la página es estática: si el año se resolviera sólo al construir,
   * seguiría diciendo 2026 en enero de 2027 hasta que alguien volviera a
   * desplegar.
   *
   * De ahí el rodeo: el estado arranca con el año del build —el mismo valor
   * que trae el HTML, así que la hidratación no encuentra discrepancia— y un
   * efecto lo corrige al año real del visitante. En el 99,99 % de los casos
   * ambos coinciden y no se re-renderiza nada.
   */
  const [anio, setAnio] = useState(ANIO_DE_BUILD);
  useEffect(() => {
    const anioActual = new Date().getFullYear();
    if (anioActual !== ANIO_DE_BUILD) setAnio(anioActual);
  }, []);

  return (
    <footer className={styles.pie}>
      <div className={styles.principal}>
        <div className={styles.marca}>
          <div className={styles.marcaFila}>
            <Image
              src={siteConfig.logo.src}
              alt={content.footer.logoAlt}
              width={siteConfig.logo.width}
              height={siteConfig.logo.height}
              className={styles.logo}
              sizes="48px"
            />
            <span className={styles.nombre}>{siteConfig.brandName}</span>
          </div>
          <p className={styles.ubicacion}>{content.footer.location}</p>
        </div>

        <div className={styles.columnas}>
          <div className={styles.columna}>
            <span className={styles.tituloColumna}>{content.footer.connectTitle}</span>
            <div className={styles.redes}>
              {siteConfig.socials.map((red) => (
                <a
                  key={red.network}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.enlaceRed}
                  title={content.footer.socialLabels[red.network]}
                >
                  <Image
                    src={red.iconSrc}
                    alt={content.footer.socialLabels[red.network]}
                    width={24}
                    height={24}
                    /**
                     * Los SVG se sirven tal cual. Optimizarlos exigiría activar
                     * `dangerouslyAllowSVG` en la configuración, que abre la
                     * puerta a scripts incrustados en archivos SVG servidos
                     * desde el optimizador. No compensa para dos iconos de
                     * medio kilobyte.
                     */
                    unoptimized
                    className={styles.iconoRed}
                  />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.columna}>
            <span className={styles.tituloColumna}>{content.footer.companyTitle}</span>
            <a href="#" className={styles.enlaceLegal}>
              {content.footer.privacyLabel}
            </a>
            <a href="#" className={styles.enlaceLegal}>
              {content.footer.termsLabel}
            </a>
          </div>
        </div>
      </div>

      <div className={styles.inferior}>
        <p className={styles.copyright}>
          © {anio} {siteConfig.legalName} — New Jersey. {content.footer.rightsLabel}
        </p>

        <a
          href={siteConfig.developer.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.creditos}
        >
          {content.footer.developedByLabel}{' '}
          <span className={styles.desarrollador}>{siteConfig.developer.name}</span>
        </a>
      </div>
    </footer>
  );
}
