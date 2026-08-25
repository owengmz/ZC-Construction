import { Navbar } from '@/components/layout/Navbar';
import { ORDEN_SECCIONES } from '@/data/navigation';

/**
 * Landing de un idioma.
 *
 * Ahora mismo sólo monta la barra de navegación; las secciones son marcadores
 * con el `id` correcto para que los anclas de la barra y el efecto de scroll
 * se puedan probar de verdad. Cada marcador se irá sustituyendo por su
 * componente real conforme avance la Etapa 2.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {ORDEN_SECCIONES.map((seccion) => (
          <section
            key={seccion}
            id={seccion}
            style={{
              minHeight: '80vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px solid var(--color-surface-variant)',
              color: 'var(--color-outline)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {seccion}
          </section>
        ))}
      </main>
    </>
  );
}
