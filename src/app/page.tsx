/**
 * Página raíz — marcador temporal.
 *
 * La landing real se construye en la Etapa 3 (integración de Next.js), cuando
 * las secciones de `components/sections/` ya existan. Este archivo sólo evita
 * que `/` quede rota entre etapas y sustituye a la página de demostración que
 * genera create-next-app (aquella referenciaba SVG de ejemplo que no forman
 * parte de este proyecto).
 */
export default function Home() {
  return (
    <main style={{ padding: '4rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Zycor Construction — migración en curso</h1>
      <p>Etapa 1: capa de datos tipada.</p>
    </main>
  );
}
