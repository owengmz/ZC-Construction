import type { SiteConfig } from '@/types';

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
