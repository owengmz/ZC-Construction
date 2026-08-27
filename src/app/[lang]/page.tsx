import { Contact } from '@/components/sections/Contact';
import { Hero } from '@/components/sections/Hero';
import { Insurance } from '@/components/sections/Insurance';
import { Portfolio } from '@/components/sections/Portfolio';
import { Services } from '@/components/sections/Services';

/**
 * Landing de un idioma.
 *
 * Las cinco secciones ancladas de `ORDEN_SECCIONES` dentro de `<main>`.
 *
 * Barra, pie y botón flotante ya no están aquí: se movieron a
 * `app/[lang]/layout.tsx` al aparecer la segunda ruta del sitio, la galería
 * completa. Es el movimiento que anticipaba la nota que había en este archivo
 * cuando la portada era la única página.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Portfolio />
      <Insurance />
      <Contact />
    </main>
  );
}
