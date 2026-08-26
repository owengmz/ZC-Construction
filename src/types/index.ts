/**
 * Contratos de tipos de la landing de Zycor Construction LLC.
 *
 * Principio de diseño que rige todo este archivo: se separa la ESTRUCTURA
 * (lo que no cambia al cambiar de idioma: imágenes, URLs, orden, layout)
 * del CONTENIDO (lo que sí cambia: títulos, párrafos, etiquetas, textos alt).
 *
 *  - La estructura vive en `data/services.ts`, `data/projects.ts` y `data/site.ts`.
 *  - El contenido vive en `data/content.en.ts` y `data/content.es.ts`, ambos
 *    tipados como `SiteContent`.
 *
 * El mecanismo de seguridad pedido —"si me olvido de traducir una clave,
 * TypeScript tira error"— se apoya en dos decisiones:
 *
 *  1. Ambos archivos de contenido se anotan con el MISMO tipo (`SiteContent`),
 *     por lo que una clave faltante es error de compilación, no texto sin
 *     traducir en producción.
 *  2. Las colecciones por elemento se modelan con `Record<Id, Copy>` sobre
 *     uniones literales cerradas (`ServiceId`, `ProjectId`, …) en lugar de
 *     arrays. Un `Record` exige que estén TODAS las claves del union; un
 *     array aceptaría dos elementos en inglés y tres en español sin quejarse.
 *
 * Todas las propiedades son `readonly`: son datos estáticos de build, no
 * estado mutable. Un `readonly` de más aquí evita mutaciones accidentales
 * desde un componente sin coste alguno en tiempo de ejecución.
 */

/* ────────────────────────────────────────────────────────────────────────────
 * 1. Idioma
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Idiomas soportados por el sitio. El inglés es el idioma por defecto
 * (el sitio actual arranca en inglés y persiste la elección del usuario).
 */
export type Lang = 'en' | 'es';

/**
 * Nombre de la cookie donde se recuerda el idioma elegido.
 *
 * Es una cookie y no `localStorage` porque quien necesita leer la preferencia
 * es el middleware, que decide a qué idioma redirigir `/` antes de que exista
 * ningún JavaScript de cliente. `localStorage` sólo es visible desde el
 * navegador, así que el servidor no podría consultarlo.
 *
 * Se conserva el nombre `zc-lang` del sitio actual por continuidad conceptual,
 * aunque el mecanismo de almacenamiento haya cambiado.
 */
export type LangCookieName = 'zc-lang';

/**
 * Ruta raíz de cada idioma.
 *
 * El tipo de plantilla ata las URLs a la unión `Lang`: `/fr` no compila
 * mientras el francés no exista como idioma soportado.
 */
export type LangRoute = `/${Lang}`;

/* ────────────────────────────────────────────────────────────────────────────
 * 2. Identificadores (uniones literales cerradas)
 *
 * Estos tipos son la columna vertebral del modelo: cada uno se usa a la vez
 * como identificador estructural y como clave obligatoria de traducción.
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Secciones ancladas de la página única. El valor coincide con el `id` del
 * elemento en el DOM, de modo que el enlace de navegación se construye como
 * `#${SectionId}` sin posibilidad de escribir un ancla inexistente.
 */
export type SectionId = 'hero' | 'services' | 'portfolio' | 'insurance' | 'contact';

/**
 * Los tres servicios principales.
 *
 * Los valores coinciden a propósito con los `value` de las opciones del
 * formulario de contacto del sitio actual (framing / renovation / roofing),
 * para que el `<select>` y las tarjetas de servicio compartan un único
 * vocabulario.
 */
export type ServiceId = 'framing' | 'renovation' | 'roofing';

/** Proyectos de la galería antes/después. El id codifica servicio + ciudad. */
export type ProjectId = 'framing-newark' | 'roofing-trenton' | 'renovation-jersey-city';

/**
 * Redes sociales presentes en el footer.
 *
 * BUG CORREGIDO EN LA MIGRACIÓN: el sitio actual tiene marcado para TikTok y
 * YouTube apuntando a `assets/icons/tiktok.svg` y `assets/icons/youtube.svg`,
 * archivos que no existen en el repositorio. Hoy están comentados en el HTML,
 * así que no rompen producción, pero tampoco son código vivo. Se dejan fuera
 * del union hasta que existan los iconos reales: añadirlos entonces será
 * agregar un miembro aquí y el compilador señalará todo lo que falta completar.
 */
export type SocialNetwork = 'instagram' | 'facebook';

/** Los dos contactos telefónicos de la empresa (dueño y socio). */
export type PhoneContactId = 'owner' | 'partner';

/** Las dos tarjetas de la sección "Seguro y Garantía". */
export type InsuranceCardId = 'insured' | 'warranty';

/* ────────────────────────────────────────────────────────────────────────────
 * 3. Assets
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Imagen lista para `next/image`.
 *
 * `width` y `height` son obligatorios: son las dimensiones INTRÍNSECAS del
 * archivo en `public/images/`, no el tamaño con el que se renderiza. Next.js
 * las usa para reservar el espacio antes de la descarga y evitar el salto de
 * layout (CLS). El tamaño visual se controla desde el CSS Module.
 *
 * `alt` NO forma parte de este tipo a propósito: es texto visible para
 * lectores de pantalla y por tanto se traduce, así que vive en `SiteContent`.
 */
export interface ImageAsset {
  /**
   * Ruta pública servida desde `public/`. El tipo de plantilla obliga a que
   * empiece por `/images/`: una ruta relativa heredada del sitio Vite
   * (`assets/images/...`) no compila.
   */
  readonly src: `/images/${string}`;
  /** Ancho intrínseco en píxeles. */
  readonly width: number;
  /** Alto intrínseco en píxeles. */
  readonly height: number;
  /**
   * Miniatura incrustada como data URI para el `placeholder="blur"` de
   * `next/image`.
   *
   * Opcional porque sólo compensa en imágenes grandes y visibles de entrada.
   * En una foto de tarjeta que carga en diferido no aporta nada; en el fondo
   * del hero, que pesa 1,4 MB y es el elemento LCP, evita que el visitante
   * mire un rectángulo vacío mientras descarga.
   */
  readonly blurDataURL?: string;
}

/** Icono SVG servido desde `public/icons/`. */
export type IconSrc = `/icons/${string}`;

/* ────────────────────────────────────────────────────────────────────────────
 * 4. Datos estructurales: servicios y proyectos
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Variante de maquetación de cada tarjeta de servicio dentro del grid
 * asimétrico de 12 columnas.
 *
 * Se modela como dato y no directamente en CSS porque la asimetría pertenece
 * a cada servicio, no a su posición: si mañana se reordenan las tarjetas, el
 * ancho debe viajar con el servicio. El componente traduce esta variante a
 * una clase del CSS Module; el dato no conoce ninguna clase concreta.
 *
 *  - `wide`   → 8 de 12 columnas, alto 500px  (Estructuras)
 *  - `narrow` → 4 de 12 columnas, alto 500px  (Remodelación)
 *  - `full`   → 12 de 12 columnas, alto 400px, degradado lateral (Techado)
 */
export type ServiceLayout = 'wide' | 'narrow' | 'full';

/** Datos estructurales de un servicio (sin textos: esos van en `SiteContent`). */
export interface Service {
  readonly id: ServiceId;
  /** Marcador visual de la tarjeta: "01", "02", "03". */
  readonly marker: string;
  /** Imagen de fondo de la tarjeta. */
  readonly image: ImageAsset;
  /** Variante de maquetación dentro del grid asimétrico. */
  readonly layout: ServiceLayout;
}

/** Datos estructurales de un proyecto de la galería antes/después. */
export interface Project {
  readonly id: ProjectId;
  /** Fotografía del estado previo a la intervención. */
  readonly before: ImageAsset;
  /** Fotografía del resultado final. */
  readonly after: ImageAsset;
}

/**
 * Entrada del lightbox: una imagen individual navegable con flechas.
 *
 * No se escribe a mano. Se deriva de `projects` aplanando cada proyecto en sus
 * dos fotos (antes, después), que es exactamente el orden 0..5 que hoy fija a
 * mano el atributo `data-index` del HTML. Derivarlo elimina la posibilidad de
 * que un índice quede desincronizado con la galería.
 */
export interface LightboxItem {
  readonly image: ImageAsset;
  /** Texto alternativo ya traducido. */
  readonly alt: string;
  /** Pie de foto mostrado bajo la imagen ("Before" / "Antes"). */
  readonly caption: string;
}

/* ────────────────────────────────────────────────────────────────────────────
 * 5. Configuración del sitio (datos que no se traducen)
 * ──────────────────────────────────────────────────────────────────────────── */

/** Un teléfono de la empresa con su enlace directo a WhatsApp. */
export interface PhoneContact {
  readonly id: PhoneContactId;
  /** Número tal y como se muestra en pantalla: "+1 (504) 644-1551". */
  readonly display: string;
  /** Enlace wa.me con el número en formato E.164 sin signos: "15046441551". */
  readonly whatsappUrl: string;
}

/** Un perfil social del footer. */
export interface SocialLink {
  readonly network: SocialNetwork;
  readonly url: string;
  readonly iconSrc: IconSrc;
}

/**
 * Constantes del sitio que son idénticas en ambos idiomas: URLs, integraciones
 * de terceros y datos de contacto.
 *
 * Vive en `data/site.ts`, un archivo que no estaba en el plan original de la
 * Etapa 1. Se separa de `SiteContent` porque duplicar una URL de Formspree en
 * dos archivos de idioma es una fuente de divergencia silenciosa: si se cambia
 * en uno y no en el otro, el formulario deja de enviar sólo para la mitad de
 * los visitantes y ningún tipo lo detecta.
 */
export interface SiteConfig {
  /** URL canónica de producción, sin barra final. */
  readonly url: string;
  /** Razón social completa, para textos legales: "Zycor Construction LLC". */
  readonly legalName: string;
  /** Marca en pantalla, en mayúsculas: "ZYCOR CONSTRUCTION". */
  readonly brandName: string;
  /** Logo único consolidado, usado en navbar, hero y footer. */
  readonly logo: ImageAsset;
  readonly email: string;
  /** Dirección postal; no se traduce (es un topónimo estadounidense). */
  readonly address: string;
  readonly phones: readonly PhoneContact[];
  readonly socials: readonly SocialLink[];
  /** Endpoint del formulario en Formspree: https://formspree.io/f/mwvyzlgd */
  readonly formspreeEndpoint: string;
  /** Reunión de 30 minutos en Calendly. */
  readonly calendlyUrl: string;
  /** Crédito del estudio que desarrolla el sitio. */
  readonly developer: {
    readonly name: string;
    readonly url: string;
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 6. Formulario de contacto
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Valor del `<select>` de servicio.
 *
 * Se deriva de `ServiceId` en vez de repetir los literales: al añadir un cuarto
 * servicio, la opción del formulario aparece sola y el `Record` de etiquetas
 * de abajo exige su traducción en ambos idiomas.
 */
export type ServiceOptionValue = ServiceId | 'other';

/** Campos que viajan a Formspree. Los nombres coinciden con los `name` del form. */
export interface ContactFormValues {
  readonly name: string;
  readonly email: string;
  /** Opcional en el formulario: el sitio actual no marca el teléfono como requerido. */
  readonly phone: string;
  readonly service: ServiceOptionValue;
  readonly message: string;
}

/**
 * Estado del envío del formulario.
 *
 * `submitting` no existe hoy como estado explícito (el sitio actual sólo
 * deshabilita el botón). Se modela aquí porque en React el estado deshabilitado
 * se deriva del estado, no al revés.
 */
export type ContactFormStatus = 'idle' | 'submitting' | 'success' | 'error';

/* ────────────────────────────────────────────────────────────────────────────
 * 7. Contenido bilingüe
 *
 * A partir de aquí, todo se traduce. `SiteContent` es el contrato único que
 * cumplen `content.en.ts` y `content.es.ts`.
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Párrafo con un fragmento destacado en negrita.
 *
 * El texto de la garantía lleva un `<strong>` en mitad de la frase. Partirlo en
 * tres piezas permite renderizarlo con JSX normal, sin `dangerouslySetInnerHTML`
 * y sin meter etiquetas HTML dentro de los datos: el contenido sigue siendo
 * texto plano y el marcado sigue siendo responsabilidad del componente.
 */
export interface HighlightedParagraph {
  readonly before: string;
  readonly highlight: string;
  readonly after: string;
}

/** Metaetiquetas por idioma: se consumen desde la Metadata API en la Etapa 3. */
export interface MetaContent {
  readonly title: string;
  readonly description: string;
  readonly ogTitle: string;
  readonly ogDescription: string;
  readonly twitterTitle: string;
  readonly twitterDescription: string;
  /** Locale de Open Graph correspondiente al idioma. */
  readonly ogLocale: 'en_US' | 'es_US';
}

/** Navbar de escritorio, menú hamburguesa y selector de idioma. */
export interface NavContent {
  /** Texto alternativo del logo en la barra. */
  readonly logoAlt: string;
  /**
   * Etiqueta de cada enlace de navegación.
   *
   * `Record<SectionId, string>` garantiza que las cinco secciones tengan
   * etiqueta en los dos idiomas: sobra una clave o falta una y no compila.
   */
  readonly links: Record<SectionId, string>;
  /** CTA compacta de la barra en escritorio: "GET QUOTE" / "COTIZAR". */
  readonly ctaDesktop: string;
  /** CTA extendida del menú móvil: "GET A FREE QUOTE" / "OBTÉN UNA COTIZACIÓN". */
  readonly ctaMobile: string;
  /** `aria-label` del botón hamburguesa cuando el menú está cerrado. */
  readonly openMenuLabel: string;
  /** `aria-label` del botón hamburguesa cuando el menú está abierto. */
  readonly closeMenuLabel: string;
  /** `aria-label` del grupo de botones EN | ES. */
  readonly langToggleLabel: string;
}

/** Sección 1 — Hero. */
export interface HeroContent {
  readonly logoAlt: string;
  /** Alt de la fotografía de fondo. */
  readonly backgroundAlt: string;
  readonly title: string;
  readonly subtitle: string;
}

/** Textos de una tarjeta de servicio. */
export interface ServiceCopy {
  readonly title: string;
  readonly description: string;
  readonly imageAlt: string;
}

/** Sección 2 — Servicios Principales. */
export interface ServicesContent {
  readonly sectionTitle: string;
  /** Un bloque de textos por cada `ServiceId`, obligatorio en ambos idiomas. */
  readonly items: Record<ServiceId, ServiceCopy>;
}

/** Textos de un proyecto de la galería. */
export interface ProjectCopy {
  /** Rótulo superior: "Framing — Newark, NJ" / "Estructuras — Newark, NJ". */
  readonly label: string;
  readonly beforeAlt: string;
  readonly afterAlt: string;
}

/** Sección 3 — Nuestros Trabajos. */
export interface PortfolioContent {
  readonly sectionTitle: string;
  readonly intro: string;
  /** Pie común de todas las fotos "antes": "Before" / "Antes". */
  readonly beforeLabel: string;
  /** Pie común de todas las fotos "después": "After" / "Después". */
  readonly afterLabel: string;
  readonly items: Record<ProjectId, ProjectCopy>;
}

/** Textos de una tarjeta de la sección de seguro y garantía. */
export interface InsuranceCardCopy {
  /** Distintivo superior derecho: "Licensed & Insured in New Jersey". */
  readonly badge: string;
  readonly title: string;
  readonly body: string;
}

/** Sección 4 — Seguro y Garantía. */
export interface InsuranceContent {
  readonly sectionTitle: string;
  readonly cards: Record<InsuranceCardId, InsuranceCardCopy>;
  /** Enlace que abre el modal: "View Full Warranty" / "Ver Garantía Completa". */
  readonly warrantyCtaLabel: string;
}

/** Modal de garantía completa de techado. */
export interface WarrantyModalContent {
  readonly title: string;
  /** Primer párrafo, con "garantía de mano de obra de hasta 10 años" en negrita. */
  readonly lead: HighlightedParagraph;
  /** Párrafo sobre el procedimiento de inspección y reparación. */
  readonly procedure: string;
  readonly limitationsTitle: string;
  readonly limitationsIntro: string;
  /** Las seis exclusiones de cobertura, en orden. */
  readonly limitations: readonly string[];
  /** Alcance: la garantía cubre mano de obra, no materiales. */
  readonly scope: string;
  /** Recomendación final, en cursiva. */
  readonly disclaimer: string;
  /** `aria-label` del botón de cierre. */
  readonly closeLabel: string;
}

/** Etiquetas y mensajes del formulario de contacto. */
export interface ContactFormContent {
  /**
   * Etiqueta de cada campo.
   *
   * `Record<keyof ContactFormValues, string>` ata las etiquetas al modelo de
   * datos: si mañana se añade un campo a `ContactFormValues`, el compilador
   * exige su etiqueta en inglés y en español antes de dejar construir.
   */
  readonly labels: Record<keyof ContactFormValues, string>;
  /** Texto visible de cada opción del `<select>` de servicio. */
  readonly serviceOptions: Record<ServiceOptionValue, string>;
  readonly submitLabel: string;
  /** Texto del botón mientras se envía. */
  readonly submittingLabel: string;
  readonly successMessage: string;
  readonly errorMessage: string;
}

/** Sección 5 — Construyamos (contacto). */
export interface ContactContent {
  readonly sectionTitle: string;
  readonly intro: string;
  /** CTA a Calendly: "Schedule a Meeting" / "Agendar una Cita". */
  readonly scheduleCtaLabel: string;
  readonly form: ContactFormContent;
}

/** Sección 6 — Footer. */
export interface FooterContent {
  readonly logoAlt: string;
  /** Ubicación bajo la marca: "New Jersey, USA". */
  readonly location: string;
  /** Encabezado de la columna de redes: "Connect". */
  readonly connectTitle: string;
  /** Encabezado de la columna corporativa: "Company". */
  readonly companyTitle: string;
  readonly privacyLabel: string;
  readonly termsLabel: string;
  /** Cierre del aviso de copyright: "All rights reserved.". El año se calcula. */
  readonly rightsLabel: string;
  /** Crédito del estudio: "Developed by" / "Desarrollado por". */
  readonly developedByLabel: string;
  /** `title` accesible de cada icono social, por red. */
  readonly socialLabels: Record<SocialNetwork, string>;
}

/** Botón flotante de WhatsApp con sus dos contactos. */
export interface WhatsAppContent {
  /** Encabezado del panel: "Contact Us" / "Contáctanos". */
  readonly panelTitle: string;
  /** Rol de cada teléfono: "Owner — Zycor" / "Dueño — Zycor". */
  readonly contactRoles: Record<PhoneContactId, string>;
  /** `aria-label` del botón flotante. */
  readonly toggleLabel: string;
}

/** Controles del lightbox de la galería (sólo etiquetas accesibles). */
export interface LightboxContent {
  readonly closeLabel: string;
  readonly prevLabel: string;
  readonly nextLabel: string;
}

/**
 * Contrato completo del contenido del sitio en un idioma.
 *
 * `content.en.ts` y `content.es.ts` exportan cada uno un objeto anotado como
 * `SiteContent`. Ese es el único punto donde se aplica la garantía de
 * traducción completa, y es lo que convierte un olvido de traducción en un
 * fallo de compilación en lugar de un texto en inglés en la web en español.
 */
export interface SiteContent {
  /** Idioma al que corresponde este objeto; útil para `<html lang>`. */
  readonly lang: Lang;
  readonly meta: MetaContent;
  readonly nav: NavContent;
  readonly hero: HeroContent;
  readonly services: ServicesContent;
  readonly portfolio: PortfolioContent;
  readonly insurance: InsuranceContent;
  readonly warranty: WarrantyModalContent;
  readonly contact: ContactContent;
  readonly footer: FooterContent;
  readonly whatsapp: WhatsAppContent;
  readonly lightbox: LightboxContent;
}

/**
 * Diccionario de contenidos indexado por idioma.
 *
 * `Record<Lang, SiteContent>` obliga a que exista un archivo de contenido por
 * cada idioma declarado en `Lang`: si mañana se añade `'pt'` al union, el
 * compilador reclama el archivo de portugués antes de dejar desplegar.
 */
export type ContentByLang = Record<Lang, SiteContent>;

/**
 * Valor expuesto por `LangContext`.
 *
 * `content` se incluye junto a `lang` para que un componente resuelva su texto
 * con un único `useLang()`, sin tener que importar además el diccionario y
 * indexarlo por su cuenta.
 *
 * No hay `setLang`. Con el idioma en la ruta (`/en`, `/es`), cambiarlo es
 * navegar, no mutar estado: el selector es un enlace y quien decide el idioma
 * es el servidor al resolver el segmento. El contexto queda como simple
 * portador de lo que ya viene resuelto desde arriba.
 */
export interface LangContextValue {
  readonly lang: Lang;
  readonly content: SiteContent;
}
