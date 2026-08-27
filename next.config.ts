import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * Redirecciones de las URLs cruzadas de la galería.
   *
   * La galería tiene un segmento distinto en cada idioma —`/en/our-work` y
   * `/es/nuestros-trabajos`— y cada uno vive en su propia carpeta de `app/`,
   * así que las dos combinaciones cruzadas devolverían 404. Una de ellas no
   * puede: `/es/our-work` estuvo publicada mientras la galería era un
   * esqueleto, y romperla dejaría enlaces muertos en cualquier sitio donde se
   * hubiera compartido.
   *
   * `permanent: true` emite un 308 y no un 307: el cambio de dirección es
   * definitivo, y así los buscadores trasladan al slug español lo que hubieran
   * acumulado para el inglés en lugar de tratarlas como dos páginas distintas.
   *
   * La regla inversa (`/en/nuestros-trabajos`) se añade por simetría. Nunca
   * estuvo publicada, pero es la equivocación natural de quien edita la URL a
   * mano tras haber visto la versión española, y llevarla a su sitio cuesta
   * cuatro líneas.
   *
   * Las rutas van escritas literalmente y no interpoladas desde
   * `SLUG_GALERIA`: este archivo lo lee el proceso de build de Next.js antes de
   * que exista el alias `@/`, así que importar desde `src/` no es posible.
   * Si se renombra un slug hay que tocar aquí también.
   */
  async redirects() {
    return [
      {
        source: '/es/our-work',
        destination: '/es/nuestros-trabajos',
        permanent: true,
      },
      {
        source: '/en/nuestros-trabajos',
        destination: '/en/our-work',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
