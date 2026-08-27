import type { SiteContent } from '@/types';

/**
 * Contenido del sitio en inglés — idioma por defecto.
 *
 * Salvo donde se indique con `NUEVO`, cada cadena está copiada literalmente de
 * `legacy/index.html` (o de `legacy/assets/js/lang-toggle.js` y
 * `contact-form.js`, que era donde vivían los textos generados por JavaScript).
 * Las marcas `NUEVO` señalan textos que NO existen en el sitio actual y que
 * hubo que redactar: etiquetas accesibles que faltaban y textos alternativos
 * de imagen que eran inexistentes o incorrectos.
 *
 * La anotación `: SiteContent` es la que hace el trabajo: si falta una clave,
 * el error aparece aquí y no como texto sin traducir en producción.
 */
export const contentEn: SiteContent = {
  lang: 'en',

  meta: {
    title: 'ZYCOR CONSTRUCTION | Framing, Roofing & Renovation in New Jersey',
    description:
      'Zycor Construction LLC — Expert Framing, Interior & Exterior Renovation and Roofing in New Jersey. Licensed & Insured.',
    ogTitle: 'ZYCOR CONSTRUCTION | Framing, Roofing & Renovation in New Jersey',
    ogDescription:
      'Expert Framing, Interior & Exterior Renovation and Roofing in New Jersey. Licensed & Insured.',
    // El sitio actual acorta el título para Twitter ("NJ" en vez de "New Jersey").
    twitterTitle: 'ZYCOR CONSTRUCTION | Framing, Roofing & Renovation in NJ',
    twitterDescription:
      'Expert Framing, Interior & Exterior Renovation and Roofing in New Jersey.',
    ogLocale: 'en_US',
    // NUEVO: el sitio actual nunca declaró `og:image:alt`. Descripción neutra
    // de marca, válida para cualquier composición: conviene ajustarla si la
    // imagen final muestra una obra concreta.
    ogImageAlt: 'Zycor Construction LLC — framing, renovation and roofing contractors in New Jersey.',
  },

  nav: {
    logoAlt: 'Zycor Construction',
    links: {
      hero: 'Start',
      services: 'Services',
      portfolio: 'Our Work',
      insurance: 'Insurance & Warranty',
      contact: 'Contact',
    },
    ctaDesktop: 'GET QUOTE',
    ctaMobile: 'GET A FREE QUOTE',
    openMenuLabel: 'Open menu',
    closeMenuLabel: 'Close menu', // NUEVO: el botón sólo tenía etiqueta para abrir
    langToggleLabel: 'Select language', // NUEVO: el selector EN|ES no tenía etiqueta accesible
  },

  hero: {
    logoAlt: 'Zycor Construction emblem',
    // NUEVO: el alt original era la palabra "fondo", en español y dentro del
    // sitio en inglés. Descripción escrita tras revisar la fotografía.
    backgroundAlt:
      'Two-story timber and steel building under construction at dusk, with workers on site',
    title: 'We Build & Protect Your Home',
    subtitle:
      'Quality, precision, and results that last. Schedule your free inspection today and get a clear, no-obligation estimate. Contact us now and secure your spot on our schedule.',
  },

  services: {
    sectionTitle: 'Core Services',
    items: {
      framing: {
        title: 'Framing',
        description:
          'We specialize in all types of framing — from structural repairs to full new construction. We reinforce damaged structures, build porches, handle additions, and construct complete framing systems.',
        imageAlt: 'Wooden roof framing of a house under construction', // NUEVO: antes "Framing Service"
      },
      renovation: {
        title: 'Interior & Exterior Renovation',
        description:
          'From kitchens and bathrooms to full exterior upgrades. Quality materials and professional execution for long-lasting results.',
        imageAlt: 'Renovated open-plan kitchen with a white island and dark wood floor', // NUEVO
      },
      roofing: {
        // El sitio actual titula la tarjeta "Roofing Solutions" pero llama
        // "Roofing" a la opción del formulario. Se conservan ambos literales.
        title: 'Roofing Solutions',
        description:
          'Complete roofing services including repairs and full replacements. We inspect every project to identify issues and recommend the best solution — backed by a warranty of up to 10 years.',
        imageAlt: 'House undergoing a full roof replacement', // NUEVO: antes "Roofing Service"
      },
    },
  },

  portfolio: {
    sectionTitle: 'Our Work',
    intro: 'Real results from real projects. See the transformation our clients experience.',
    beforeLabel: 'Before',
    afterLabel: 'After',
    videoTag: 'VIDEO', // NUEVO: rótulo del marco del panel de vídeo
    videoPlaceholder: 'Site walkthrough coming soon', // NUEVO Y PROVISIONAL
    galleryCtaLabel: 'See full gallery', // NUEVO: enlace a /en/our-work
    items: {
      'framing-newark': {
        label: 'Framing — Newark, NJ',
        // NUEVO: los alt originales eran "Project 1 Before" / "Project 1 After",
        // que no describen nada para quien usa lector de pantalla.
        beforeAlt: 'Roof framing under construction before completion',
        afterAlt: 'Finished house with new roof and siding',
      },
      'roofing-trenton': {
        label: 'Roofing — Trenton, NJ',
        beforeAlt: 'Roof stripped down during shingle replacement', // NUEVO
        afterAlt: 'Completed home with a newly installed roof', // NUEVO
      },
      'renovation-jersey-city': {
        label: 'Renovation — Jersey City, NJ',
        beforeAlt: 'Bathroom stripped to the studs with plumbing rough-in', // NUEVO
        afterAlt: 'Finished shower tiled in marble-look stone', // NUEVO
      },
    },
  },

  // NUEVO: página de galería completa (/en/our-work). Sólo lo que la página
  // añade; el título y la introducción se reutilizan de `portfolio`, y las
  // etiquetas de los filtros salen de `contact.form.serviceOptions`.
  gallery: {
    eyebrow: 'PROJECT ARCHIVE',
    filtersLabel: 'Filter projects by service',
    allFilterLabel: 'All',
    emptyState: 'No projects in this category yet',
    // Los marcadores {category} y {location} los sustituye `textosDeEntrada()`
    // en data/gallery.ts. Sólo se usan en las obras SIN texto artesanal.
    beforeAltTemplate: '{category} project in {location}, before the work',
    afterAltTemplate: '{category} project in {location}, after completion',
    meta: {
      title: 'Our Work — Project Gallery',
      description:
        'Before and after photos from framing, roofing and renovation projects across New Jersey.',
    },
  },

  insurance: {
    sectionTitle: 'Insurance & Warranty',
    cards: {
      insured: {
        badge: 'Licensed & Insured in New Jersey',
        title: 'Fully Insured',
        body: "Zycor Construction LLC carries full liability insurance and workers' compensation. Our clients operate with zero financial risk on every project.",
      },
      warranty: {
        badge: 'Quality Guaranteed',
        title: 'Our Guarantee',
        body: 'All workmanship is backed by our structural warranty of up to 10 years. If any aspect of our work does not meet our rigorous standards, we return to make it right.',
      },
    },
    warrantyCtaLabel: 'View Full Warranty',
  },

  warranty: {
    title: 'Roofing Warranty',
    lead: {
      before:
        'At Zycor Construction LLC, we stand behind the quality of our roofing work by offering up to a ',
      highlight: '10-year workmanship warranty',
      after:
        '. This warranty covers installation-related defects caused directly by our workmanship during the roofing installation process.',
    },
    procedure:
      'If an issue is determined to be the result of an installation error performed by our team, we will inspect and, if necessary, repair the affected area at no additional labor cost during the warranty period.',
    limitationsTitle: 'Warranty Limitations',
    limitationsIntro:
      'This warranty does not cover damages caused by factors outside of our control, including but not limited to:',
    limitations: [
      'Hurricanes, tornadoes, strong winds, or severe storms',
      'Hail, extreme weather conditions, or natural disasters',
      'Structural problems existing prior to installation',
      'Improper maintenance or neglect',
      'Damage caused by third-party modifications or repairs',
      'Manufacturer defects in roofing materials',
    ],
    scope:
      'This workmanship warranty applies only to labor and installation services provided by Zycor Construction LLC. Material warranties remain the responsibility of the manufacturer.',
    disclaimer:
      "We strongly recommend that all property owners maintain active homeowner's insurance coverage to protect against damages caused by weather events or other unforeseen circumstances beyond our control.",
    closeLabel: 'Close warranty details', // NUEVO: el botón de cierre no tenía etiqueta
  },

  contact: {
    sectionTitle: "Let's Build",
    intro:
      'Ready to start your next heavy-duty project? Fill out the form or schedule a meeting directly with our technical team.',
    scheduleCtaLabel: 'Schedule a Meeting',
    form: {
      labels: {
        name: 'Name',
        // El sitio actual no traduce esta etiqueta: es "Email" en ambos idiomas.
        email: 'Email',
        phone: 'Phone',
        service: 'Service',
        message: 'Message',
      },
      // Textos tomados de `serviceOptions` en legacy/assets/js/lang-toggle.js.
      serviceOptions: {
        framing: 'Framing',
        renovation: 'Interior & Exterior Renovation',
        roofing: 'Roofing',
        other: 'Other',
      },
      submitLabel: 'Send Inquiry',
      submittingLabel: 'Sending…', // NUEVO: el sitio actual sólo deshabilita el botón
      // Mensajes tomados de legacy/assets/js/contact-form.js.
      successMessage: "Message sent! We'll be in touch soon.",
      errorMessage: 'Something went wrong. Please try again.',
    },
  },

  footer: {
    logoAlt: 'Zycor Construction',
    location: 'New Jersey, USA',
    connectTitle: 'Connect',
    companyTitle: 'Company',
    privacyLabel: 'Privacy Policy',
    termsLabel: 'Terms of Service',
    rightsLabel: 'All rights reserved.',
    developedByLabel: 'Developed by',
    socialLabels: {
      instagram: 'Instagram',
      facebook: 'Facebook',
    },
  },

  whatsapp: {
    panelTitle: 'Contact Us',
    contactRoles: {
      owner: 'Owner — Zycor',
      partner: 'Partner — Zycor',
    },
    toggleLabel: 'Open WhatsApp contacts', // NUEVO: el botón flotante no tenía etiqueta
  },

  // NUEVO en bloque: los tres controles del lightbox son botones con sólo un
  // icono SVG dentro, sin texto ni `aria-label`. Un lector de pantalla los
  // anuncia hoy como "botón" a secas.
  lightbox: {
    closeLabel: 'Close gallery',
    prevLabel: 'Previous image',
    nextLabel: 'Next image',
  },
};
