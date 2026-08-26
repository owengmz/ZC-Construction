import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { WhatsAppFab } from '@/components/layout/WhatsAppFab';
import { Contact } from '@/components/sections/Contact';
import { Hero } from '@/components/sections/Hero';
import { Insurance } from '@/components/sections/Insurance';
import { Portfolio } from '@/components/sections/Portfolio';
import { Services } from '@/components/sections/Services';

/**
 * Landing de un idioma.
 *
 * Estructura completa del sitio: las cinco secciones ancladas de
 * `ORDEN_SECCIONES` dentro de `<main>`, con la barra, el pie y el botón
 * flotante de WhatsApp fuera, en el mismo orden que en el sitio actual.
 *
 * Barra, pie y botón flotante viven aquí y no en el layout porque de momento
 * sólo hay una página. Si la Etapa 3 añadiera rutas —una página de privacidad,
 * por ejemplo—, su sitio natural pasaría a ser `app/[lang]/layout.tsx`.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Insurance />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
