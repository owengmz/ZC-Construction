/**
 * Comprobación de las fotos de la galería.
 *
 *     npm run check:gallery
 *
 * Existe por una razón concreta. La ficha dibuja cada foto en un marco de
 * proporción fija y la recorta para llenarlo. Eso funciona mientras se cumplan
 * dos condiciones, y ninguna de las dos la puede verificar TypeScript, porque
 * las dos dependen de bytes que están en `public/images/`:
 *
 *   1. Que el `width` y el `height` declarados en `data/gallery.ts` sean los
 *      REALES del archivo. Aquí ya no hay salto de maquetación —el marco tiene
 *      proporción propia y reserva su hueco solo—, pero las dimensiones siguen
 *      alimentando al visor a pantalla completa, que sí dibuja la foto entera,
 *      y son de donde sale la comprobación de recorte de abajo. Declararlas mal
 *      hace que esta herramienta mienta.
 *
 *   2. Que ninguna foto se aleje tanto del marco como para que el recorte se
 *      coma lo que la foto venía a enseñar. Un 3∶4 o un 4∶3 pierden un cuarto
 *      de una de sus dimensiones y se leen de sobra; una vertical de móvil
 *      (9∶16) pierde el 44 % del alto, y ahí ya no se sabe qué se está viendo.
 *
 * ── Qué sustituye ──
 *
 * Hasta el rediseño de la galería, la segunda comprobación miraba otra cosa: si
 * las DOS fotos de una obra tenían proporciones demasiado dispares entre sí.
 * Tenía sentido cuando la ficha las ponía una al lado de la otra sin recortar y
 * repartía el ancho entre ellas. Ahora las dos comparten un único marco
 * cuadrado, así que da igual cómo se lleven entre ellas: lo que importa es cómo
 * se lleva cada una con el marco. La comprobación es por foto, no por par.
 *
 * Conviene ejecutarlo después de añadir obras a `data/gallery.ts`. Devuelve
 * código de salida 1 si encuentra algo, así que también sirve en un hook de
 * pre-commit o en integración continua.
 */
import { readFileSync } from 'node:fs';

import sharp from 'sharp';

const ARCHIVO_DATOS = 'src/data/gallery.ts';

/**
 * Proporción del marco de la ficha, en ancho ÷ alto.
 *
 * Es 1 porque el marco es cuadrado, y está aquí como constante con nombre para
 * que el día que la ficha cambie de proporción esta herramienta se ajuste
 * cambiando un número, en lugar de seguir avisando de recortes que ya no son
 * los que ocurren. Su gemelo vive en `ProjectCard.module.css`, en la regla
 * `aspect-ratio` de `.marco`.
 */
const PROPORCION_MARCO = 1;

/**
 * Cuánto puede comerse el recorte, en tanto por uno de la dimensión afectada.
 *
 * Con marco cuadrado, un 3∶4 o un 4∶3 pierden exactamente 0,25: es el precio
 * asumido del rediseño y tiene que pasar sin avisos. El 0,35 deja ese caso
 * holgado y salta con lo que de verdad preocupa —proporciones más extremas que
 * unos 1,54∶1, como una panorámica o una vertical de móvil—, donde el centro
 * recortado deja de contar la obra.
 */
const RECORTE_MAXIMO = 0.35;

/** Reduce una proporción a su forma más simple: 1200×1600 → 3:4. */
function razon(ancho, alto) {
  const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));
  const d = mcd(ancho, alto);
  return `${ancho / d}:${alto / d}`;
}

/**
 * Qué fracción de la foto descarta `object-fit: cover` contra el marco.
 *
 * Una foto más estrecha que el marco se recorta por arriba y por abajo, y
 * conserva la fracción `proporcion / marco` de su alto; una más ancha se recorta
 * por los lados y conserva `marco / proporcion` de su ancho. En los dos casos lo
 * que se pierde es uno menos la fracción conservada.
 *
 * @param proporcion Ancho ÷ alto de la foto.
 * @returns Fracción descartada, entre 0 y 1.
 */
function recorte(proporcion) {
  const conservado =
    proporcion < PROPORCION_MARCO ? proporcion / PROPORCION_MARCO : PROPORCION_MARCO / proporcion;

  return 1 - Math.min(1, conservado);
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
  for (const lado of ['before', 'after']) {
    const declarada = obra[lado];
    const { width, height } = await sharp('public' + declarada.src).metadata();

    if (width !== declarada.width || height !== declarada.height) {
      problemas.push(
        `${obra.id} · ${lado}: ${declarada.src}\n` +
          `    declarado ${declarada.width}×${declarada.height}, real ${width}×${height}\n` +
          `    Corrija las dimensiones en ${ARCHIVO_DATOS}: de ellas dependen el visor a\n` +
          '    pantalla completa y la comprobación de recorte de esta misma herramienta.',
      );

      // Sin dimensiones fiables, el recorte calculado sería el de otra foto.
      continue;
    }

    const descartado = recorte(width / height);

    if (descartado > RECORTE_MAXIMO) {
      const eje = width / height < PROPORCION_MARCO ? 'alto' : 'ancho';

      problemas.push(
        `${obra.id} · ${lado}: ${declarada.src}\n` +
          `    ${width}×${height} (${razon(width, height)}) en un marco ${razon(PROPORCION_MARCO * 1000, 1000)}\n` +
          `    el recorte se lleva el ${(descartado * 100).toFixed(1)} % del ${eje}; el máximo admitido es ${RECORTE_MAXIMO * 100} %.\n` +
          '    Vuelva a encuadrar la foto en un formato menos extremo, o recórtela a mano\n' +
          '    eligiendo usted qué parte se queda. Si el encuadre es correcto pero el centro\n' +
          '    no es el asunto, el campo opcional `focus` mueve el recorte a un extremo.',
      );
    }
  }
}

console.log(`\nGalería: ${obras.length} obra(s), ${obras.length * 2} fotos comprobadas.`);

if (problemas.length === 0) {
  console.log(
    'Dimensiones bien declaradas y ninguna foto se descuadra en el marco de la ficha.\n',
  );
  process.exit(0);
}

console.error(`\n${problemas.length} aviso(s):\n`);
for (const problema of problemas) console.error(`  - ${problema}\n`);
process.exit(1);
