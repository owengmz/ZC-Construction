import type { SiteContent } from '@/types';

/**
 * Contenido del sitio en español.
 *
 * Mismo criterio que en `content.en.ts`: salvo las marcas `NUEVO`, cada cadena
 * está copiada literalmente de los `<span class="lang-es">` de
 * `legacy/index.html` y de los mensajes en español de
 * `legacy/assets/js/lang-toggle.js` y `contact-form.js`.
 *
 * Única desviación deliberada de la transcripción literal: el registro se
 * unificó al tratamiento de "usted" en todo el sitio. El HTML original lo
 * mezclaba —el hero tuteaba ("tu Hogar", "Agenda tu inspección") mientras
 * Seguro y Garantía y Contacto trataban de usted—, y se homogeneizó hacia el
 * registro que ya era dominante. Afecta a cinco campos: `hero.title`,
 * `hero.subtitle`, `portfolio.intro`, `contact.form.errorMessage` y
 * `whatsapp.panelTitle`. El resto sigue siendo copia literal del sitio actual.
 */
export const contentEs: SiteContent = {
  lang: 'es',

  // NUEVO en bloque: el sitio actual sólo tiene metaetiquetas en inglés; se
  // sirven igual a quien visita la web en español. Estas son su traducción.
  meta: {
    title: 'ZYCOR CONSTRUCTION | Estructuras, Techado y Remodelación en New Jersey',
    description:
      'Zycor Construction LLC — Expertos en estructuras, remodelación interior y exterior y techado en New Jersey. Con licencia y asegurados.',
    ogTitle: 'ZYCOR CONSTRUCTION | Estructuras, Techado y Remodelación en New Jersey',
    ogDescription:
      'Expertos en estructuras, remodelación interior y exterior y techado en New Jersey. Con licencia y asegurados.',
    twitterTitle: 'ZYCOR CONSTRUCTION | Estructuras, Techado y Remodelación en NJ',
    twitterDescription:
      'Expertos en estructuras, remodelación interior y exterior y techado en New Jersey.',
    ogLocale: 'es_US',
    ogImageAlt:
      'Zycor Construction LLC — contratistas de estructuras, remodelación y techado en New Jersey.',
  },

  nav: {
    logoAlt: 'Zycor Construction',
    links: {
      hero: 'Inicio',
      services: 'Servicios',
      portfolio: 'Trabajos',
      insurance: 'Seguro y Garantía',
      contact: 'Contacto',
    },
    ctaDesktop: 'COTIZAR',
    ctaMobile: 'OBTÉN UNA COTIZACIÓN',
    openMenuLabel: 'Abrir menú', // NUEVO: el aria-label del sitio actual está sólo en inglés
    closeMenuLabel: 'Cerrar menú', // NUEVO
    langToggleLabel: 'Seleccionar idioma', // NUEVO
  },

  hero: {
    logoAlt: 'Emblema de Zycor Construction',
    // NUEVO: descripción escrita tras revisar la fotografía.
    backgroundAlt:
      'Edificio de dos plantas en construcción al anochecer, con estructura de madera y acero y operarios en obra',
    title: 'Construimos y Protegemos su Hogar',
    subtitle:
      'Calidad, precisión y resultados duraderos. Agende su inspección gratuita hoy y obtenga un presupuesto claro sin compromiso. Contáctenos y asegure su lugar en nuestra agenda.',
  },

  services: {
    sectionTitle: 'Servicios Principales',
    items: {
      framing: {
        title: 'Estructuras',
        description:
          'Nos especializamos en todo tipo de encuadrado — desde reparaciones estructurales hasta construcción nueva. Reforzamos estructuras, construimos porches, manejamos ampliaciones y sistemas completos de enmarcado.',
        imageAlt: 'Estructura de madera del tejado de una casa en construcción', // NUEVO
      },
      renovation: {
        title: 'Remodelación Interior y Exterior',
        description:
          'Desde cocinas y baños hasta renovaciones exteriores completas. Materiales de calidad y ejecución profesional para resultados duraderos.',
        imageAlt: 'Cocina abierta remodelada con isla blanca y suelo de madera oscura', // NUEVO
      },
      roofing: {
        title: 'Soluciones de Techado',
        description:
          'Servicios completos de techado incluyendo reparaciones y reemplazos totales. Inspeccionamos cada proyecto para identificar problemas y recomendar la mejor solución, respaldada por una garantía de hasta 10 años.',
        imageAlt: 'Vivienda durante el reemplazo completo de su tejado', // NUEVO
      },
    },
  },

  portfolio: {
    sectionTitle: 'Nuestros Trabajos',
    intro:
      'Resultados reales de proyectos reales. Mire la transformación que nuestros clientes experimentan.',
    // NUEVO: en el sitio actual estos dos rótulos están escritos directamente
    // en el HTML sin pareja en español, así que hoy se leen "Before" y "After"
    // también con el idioma en español.
    beforeLabel: 'Antes',
    afterLabel: 'Después',
    // NUEVO: rótulos accesibles del comparador arrastrable y de su botón de
    // ampliar. No se ven; los lee quien navega con lector de pantalla.
    compareLabel: 'Comparador antes y después',
    expandLabel: 'Ver la fotografía completa',
    videoTag: 'VIDEO',
    videoDescripcion: 'Recorrido por una obra terminada de Zycor Construction',
    videoExpandLabel: 'Ver con sonido',
    videoModalTitle: 'Recorrido de obra',
    videoCloseLabel: 'Cerrar el recorrido',
    galleryCtaLabel: 'Ver toda la galería',
    items: {
      'framing-newark': {
        label: 'Estructuras — Newark, NJ',
        beforeAlt: 'Estructura del tejado en construcción antes de terminarse', // NUEVO
        afterAlt: 'Casa terminada con tejado y revestimiento nuevos', // NUEVO
      },
      'roofing-trenton': {
        label: 'Techado — Trenton, NJ',
        beforeAlt: 'Tejado desmontado durante el reemplazo de las tejas', // NUEVO
        afterAlt: 'Vivienda terminada con el tejado recién instalado', // NUEVO
      },
      'renovation-jersey-city': {
        label: 'Remodelación — Jersey City, NJ',
        beforeAlt: 'Baño desmontado hasta la estructura, con la fontanería a la vista', // NUEVO
        afterAlt: 'Ducha terminada con alicatado de aspecto mármol', // NUEVO
      },
    },
  },

  // NUEVO: página de galería completa (/es/nuestros-trabajos).
  gallery: {
    eyebrow: 'ARCHIVO DE EXPEDIENTES',
    filtersLabel: 'Filtrar proyectos por servicio',
    allFilterLabel: 'Todos',
    emptyState: 'Todavía no hay proyectos en esta categoría',
    // Los marcadores {category} y {location} los sustituye `textosDeEntrada()`.
    // La plantilla arranca con "Proyecto de" porque las tres categorías reales
    // son sustantivos femeninos o plurales ("Estructuras", "Remodelación…",
    // "Techado") y así se evita tener que concordar el artículo con cada una.
    beforeAltTemplate: 'Proyecto de {category} en {location}, antes del trabajo',
    afterAltTemplate: 'Proyecto de {category} en {location}, ya terminado',
    meta: {
      title: 'Nuestros Trabajos — Galería de Proyectos',
      description:
        'Fotos de antes y después de proyectos de estructuras, techado y remodelación en New Jersey.',
    },
  },

  insurance: {
    sectionTitle: 'Seguro y Garantía',
    cards: {
      insured: {
        badge: 'Licencia y Seguro en New Jersey',
        title: 'Totalmente Asegurados',
        body: 'Zycor Construction LLC cuenta con seguro de responsabilidad civil total y compensación laboral. Nuestros clientes operan con cero riesgo financiero en cada proyecto.',
      },
      warranty: {
        badge: 'Calidad Garantizada',
        title: 'Nuestra Garantía',
        body: 'Toda nuestra mano de obra está respaldada por nuestra garantía estructural de hasta 10 años. Si algún aspecto no cumple con nuestros estándares, regresamos para corregirlo.',
      },
    },
    warrantyCtaLabel: 'Ver Garantía Completa',
  },

  warranty: {
    title: 'Garantía de Techado',
    lead: {
      before:
        'En Zycor Construction LLC, respaldamos la calidad de nuestro trabajo de techado ofreciendo una ',
      highlight: 'garantía de mano de obra de hasta 10 años',
      after:
        '. Esta garantía cubre defectos relacionados con la instalación causados directamente por nuestra mano de obra durante el proceso de instalación.',
    },
    procedure:
      'Si se determina que un problema es resultado de un error de instalación realizado por nuestro equipo, inspeccionaremos y, si es necesario, repararemos el área afectada sin costo adicional de mano de obra durante el período de garantía.',
    limitationsTitle: 'Limitaciones de la Garantía',
    limitationsIntro:
      'Esta garantía no cubre daños causados por factores fuera de nuestro control, incluyendo pero no limitado a:',
    limitations: [
      'Huracanes, tornados, vientos fuertes o tormentas severas',
      'Granizo, condiciones climáticas extremas o desastres naturales',
      'Problemas estructurales existentes antes de la instalación',
      'Mantenimiento inadecuado o negligencia',
      'Daños causados por modificaciones o reparaciones de terceros',
      'Defectos de fábrica en los materiales de techado',
    ],
    scope:
      'Esta garantía de mano de obra aplica únicamente a los servicios de mano de obra e instalación proporcionados por Zycor Construction LLC. Las garantías de materiales son responsabilidad del fabricante.',
    disclaimer:
      'Recomendamos encarecidamente que todos los propietarios mantengan una cobertura activa de seguro de vivienda para protegerse contra daños causados por eventos climáticos u otras circunstancias imprevistas fuera de nuestro control.',
    closeLabel: 'Cerrar detalles de la garantía', // NUEVO
  },

  contact: {
    sectionTitle: 'Construyamos',
    intro:
      '¿Listo para comenzar su próximo proyecto de alto rendimiento? Complete el formulario o agende una cita directamente con nuestro equipo técnico.',
    scheduleCtaLabel: 'Agendar una Cita',
    form: {
      labels: {
        name: 'Nombre',
        // Sin traducir también en el sitio actual: la etiqueta es "Email".
        email: 'Email',
        phone: 'Teléfono',
        service: 'Servicio',
        message: 'Mensaje',
      },
      serviceOptions: {
        framing: 'Estructuras',
        renovation: 'Remodelación Interior y Exterior',
        roofing: 'Techado',
        other: 'Otro',
      },
      submitLabel: 'Enviar Consulta',
      submittingLabel: 'Enviando…', // NUEVO
      successMessage: '¡Mensaje enviado! Nos pondremos en contacto pronto.',
      errorMessage: 'Algo salió mal. Inténtelo de nuevo.',
    },
  },

  footer: {
    logoAlt: 'Zycor Construction',
    // Sin traducir en el sitio actual, y se mantiene: es un topónimo.
    location: 'New Jersey, USA',
    connectTitle: 'Síguenos', // NUEVO: en el sitio actual dice "Connect" también en español
    companyTitle: 'Empresa', // NUEVO: en el sitio actual dice "Company" también en español
    privacyLabel: 'Política de Privacidad',
    termsLabel: 'Términos de Servicio',
    rightsLabel: 'Todos los derechos reservados.',
    developedByLabel: 'Desarrollado por',
    // Nombres propios: idénticos en ambos idiomas.
    socialLabels: {
      instagram: 'Instagram',
      facebook: 'Facebook',
    },
  },

  whatsapp: {
    panelTitle: 'Contáctenos',
    contactRoles: {
      owner: 'Dueño — Zycor',
      partner: 'Socio — Zycor',
    },
    toggleLabel: 'Abrir contactos de WhatsApp', // NUEVO
  },

  // NUEVO en bloque: los controles del lightbox no tienen texto ni etiqueta
  // accesible en el sitio actual.
  lightbox: {
    closeLabel: 'Cerrar galería',
    prevLabel: 'Imagen anterior',
    nextLabel: 'Imagen siguiente',
  },
};
