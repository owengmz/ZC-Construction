/**
 * Comprobación de las fotos de la galería.
 *
 *     npm run check:gallery
 *
 * Existe por una razón concreta. La galería enseña cada foto ENTERA, sin
 * recortar: el hueco lo define la proporción real del archivo. Eso funciona
 * mientras se cumplan dos condiciones, y ninguna de las dos la puede verificar
 * TypeScript, porque las dos dependen de bytes que están en `public/images/`:
 *
 *   1. Que el `width` y el `height` declarados en `data/gallery.ts` sean los
 *      REALES del archivo. Si no lo son, el navegador reserva un hueco de la
 *      proporción equivocada y la página da un salto al cargar la foto.
 *
 *   2. Que el «antes» y el «después» de una misma obra compartan proporción.
 *      Si no, en la ficha una de las dos queda más corta que la otra y deja
 *      ver el fondo debajo. La página NO lo resuelve recortando por su cuenta:
 *      ese hueco es deliberado, y este script está para avisar de él antes de
 *      que llegue a producción, de modo que la decisión —recortar, recuadrar o
 *      dejarlo así— se tome obra por obra y a la vista.
 *
 * Conviene ejecutarlo después de añadir obras a `data/gallery.ts`. Devuelve
 * código de salida 1 si encuentra algo, así que también sirve en un hook de
 * pre-commit o en integración continua.
 */
import { readFileSync } from 'node:fs';

import sharp from 'sharp';

const ARCHIVO_DATOS = 'src/data/gallery.ts';
/**
 * Desvío de proporción por debajo del cual dos fotos se consideran iguales.
 *
 * El 1 % no es arbitrario: en una columna de galería de unos 340 px, un 1 % de
 * desvío son tres píxeles de diferencia de alto. Por debajo de eso el hueco no
 * se ve, y avisar sería ruido.
 */
const TOLERANCIA = 0.01;

/** Reduce una proporción a su forma más simple: 1200×1600 → 3:4. */
function razon(ancho, alto) {
  const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));
  const d = mcd(ancho, alto);
  return `${ancho / d}:${alto / d}`;
}

/**
 * Extrae las obras de `data/gallery.ts`.
 *
 * Se lee el archivo como texto en lugar de importarlo porque es TypeScript y
 * usa el alias `@/`, que Node no resuelve. A cambio, se comprueba que el número
 * de obras extraídas coincida con el de identificadores presentes: si el
 * formato del archivo cambia y la extracción deja de funcionar, el script lo
 * dice en vez de informar alegremente de que todo está bien.
 *
 * @returns Lista de obras con sus dos fotos y las dimensiones declaradas.
 */
function leerObras() {
  const fuente = readFileSync(ARCHIVO_DATOS, 'utf8');

  const patron =
    /id:\s*'([^']+)'[\s\S]*?before:\s*\{\s*src:\s*'([^']+)',\s*width:\s*(\d+),\s*height:\s*(\d+)\s*\}[\s\S]*?after:\s*\{\s*src:\s*'([^']+)',\s*width:\s*(\d+),\s*height:\s*(\d+)\s*\}/g;

  const obras = [...fuente.matchAll(patron)].map((m) => ({
    id: m[1],
    before: { src: m[2], width: Number(m[3]), height: Number(m[4]) },
    after: { src: m[5], width: Number(m[6]), height: Number(m[7]) },
  }));

  // Se cuentan sólo los `id:` del array de datos, no los de los comentarios.
  const declarados = (fuente.match(/^\s{4}id:\s*'/gm) ?? []).length;
  if (obras.length !== declarados) {
    console.error(
      `\nNo se pudieron leer todas las obras de ${ARCHIVO_DATOS}: ` +
        `${obras.length} extraídas frente a ${declarados} declaradas.\n` +
        'Probablemente ha cambiado el formato del archivo y hay que ajustar el patrón de este script.',
    );
    process.exit(1);
  }

  return obras;
}

const obras = leerObras();
const problemas = [];

for (const obra of obras) {
  const lados = {};

  for (const lado of ['before', 'after']) {
    const declarada = obra[lado];
    const { width, height } = await sharp('public' + declarada.src).metadata();
    lados[lado] = { width, height };

    if (width !== declarada.width || height !== declarada.height) {
      problemas.push(
        `${obra.id} · ${lado}: ${declarada.src}\n` +
          `    declarado ${declarada.width}×${declarada.height}, real ${width}×${height}\n` +
          `    Corrija las dimensiones en ${ARCHIVO_DATOS}, o la página saltará al cargar la foto.`,
      );
    }
  }

  const pAntes = lados.before.width / lados.before.height;
  const pDespues = lados.after.width / lados.after.height;
  const desvio = Math.abs(pAntes - pDespues) / pAntes;

  if (desvio > TOLERANCIA) {
    problemas.push(
      `${obra.id} · el antes y el después NO comparten proporción\n` +
        `    antes   ${lados.before.width}×${lados.before.height}  (${razon(lados.before.width, lados.before.height)})\n` +
        `    después ${lados.after.width}×${lados.after.height}  (${razon(lados.after.width, lados.after.height)})\n` +
        `    desvío ${(desvio * 100).toFixed(1)} %. La ficha mostrará la más corta con fondo debajo.\n` +
        '    Decida qué hacer con esta obra: recortar una de las dos al mismo formato,\n' +
        '    volver a exportarlas, o dejarlo así si el hueco no molesta.',
    );
  }
}

console.log(`\nGalería: ${obras.length} obra(s), ${obras.length * 2} fotos comprobadas.`);

if (problemas.length === 0) {
  console.log('Todas las fotos tienen sus dimensiones bien declaradas y cada par comparte proporción.\n');
  process.exit(0);
}

console.error(`\n${problemas.length} aviso(s):\n`);
for (const problema of problemas) console.error(`  - ${problema}\n`);
process.exit(1);
