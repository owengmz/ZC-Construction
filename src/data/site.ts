import type { SiteConfig } from '@/types';

/**
 * Color de la barra del navegador y del fondo de arranque de la aplicación
 * instalada (`<meta name="theme-color">` y `theme_color` del manifiesto).
 *
 * Es el valor de `--color-background` de `globals.css`, repetido aquí como
 * literal: ambos consumidores se resuelven en el servidor —los metadatos al
 * prerenderizar y el manifiesto al generarse—, donde el CSS todavía no existe
 * y la custom property no se puede leer. Si cambia la paleta, este es el único
 * punto del proyecto que hay que sincronizar a mano con la hoja de estilos.
 *
 * El sitio anterior declaraba `#ffffff` en su manifiesto pese a ser de tema
 * oscuro único, lo que pintaba de blanco la barra del navegador en Android.
 */
export const COLOR_TEMA = '#141313';

/**
 * Constantes del sitio que no dependen del idioma: URLs canónicas, datos de
 * contacto e integraciones de terceros.
 *
 * Este archivo no estaba en el plan original de la Etapa 1; se propuso al
 * presentar `types/index.ts` y aquí queda materializado. El motivo de que no
 * viva dentro de `content.en.ts` / `content.es.ts`: duplicar el endpoint de
 * Formspree o la URL de Calendly en dos archivos de idioma crea una
 * divergencia silenciosa. Si se actualiza en uno y no en el otro, el
 * formulario deja de enviar sólo para la mitad de los visitantes y ningún
 * tipo lo detecta, porque ambos valores son `string` válidos.
 *
 * Todos los valores están tomados literalmente de `legacy/index.html` y de
 * `legacy/assets/js/contact-form.js`.
 */
export const siteConfig: SiteConfig = {
  url: 'https://zycorconstruction.com',
  legalName: 'Zycor Construction LLC',
  brandName: 'ZYCOR CONSTRUCTION',

  /**
   * Logo maestro único. Navbar, hero y footer lo consumen todos desde aquí:
   * `next/image` deriva cada tamaño servido. El sitio anterior mantenía tres
   * archivos distintos (`logo-navbar.webp`, `logo-hero.webp`,
   * `logo-footer.webp`) que eran la misma imagen reescalada.
   */
  logo: {
    src: '/images/logo-zycor.webp',
    width: 1536,
    height: 1024,
  },

  /**
   * Imagen de la tarjeta de compartición.
   *
   * 1200×630 es la proporción 1.91:1 que esperan Facebook, LinkedIn y WhatsApp,
   * y la misma que usa la tarjeta `summary_large_image` de Twitter: una sola
   * imagen sirve para todas.
   *
   * PENDIENTE: el archivo todavía no existe en `public/images/`. El sitio
   * anterior declaraba `assets/images/og-image.jpg` en su `<head>` pero nunca
   * lo subió, así que hoy los enlaces compartidos salen sin imagen. La ruta
   * queda declarada aquí para que baste con depositar el archivo final; ni el
   * build ni el sitio fallan mientras tanto, sólo la previsualización.
   */
  ogImage: {
    src: '/images/og-image.jpg',
    width: 1200,
    height: 630,
  },

  email: 'zycorconstruction@gmail.com',
  address: '7 Clover Path Apt. D, Maple Shade, NJ, USA',

  /**
   * Los dos teléfonos de la empresa. El orden es el de aparición en el panel
   * de WhatsApp del sitio actual: primero el dueño, después el socio.
   *
   * `whatsappUrl` lleva el número en formato E.164 sin signos ni espacios,
   * que es lo que exige wa.me; `display` conserva el formato legible que se
   * muestra en pantalla.
   */
  phones: [
    {
      id: 'owner',
      display: '+1 (504) 644-1551',
      whatsappUrl: 'https://wa.me/15046441551',
    },
    {
      id: 'partner',
      display: '+1 (609) 205-0407',
      whatsappUrl: 'https://wa.me/16092050407',
    },
  ],

  /**
   * Perfiles sociales del footer.
   *
   * Sólo Instagram y Facebook: TikTok y YouTube estaban comentados en el HTML
   * y apuntaban a iconos inexistentes (`assets/icons/tiktok.svg`,
   * `assets/icons/youtube.svg`). Volverán cuando existan los archivos reales,
   * añadiendo el miembro correspondiente a `SocialNetwork`.
   */
  socials: [
    {
      network: 'instagram',
      url: 'https://www.instagram.com/zycorconstruction?igsh=MXEzMTF1bWIzbzhlaA==&utm_source=ig_contact_invite',
      iconSrc: '/icons/instagram.svg',
    },
    {
      network: 'facebook',
      url: 'https://www.facebook.com/share/14fTeMFDBA5/?mibextid=wwXIfr',
      iconSrc: '/icons/facebook.svg',
    },
  ],

  formspreeEndpoint: 'https://formspree.io/f/mwvyzlgd',
  calendlyUrl: 'https://calendly.com/zycorconstruction/30min',

  developer: {
    name: 'HyperGridStudio',
    url: 'https://hypergridstudio.com',
  },
};
