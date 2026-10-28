/**
 * Map pins for src/data/origins.ts. The existing pins were generated with
 * d3-geo's Natural Earth I projection on a 1000×500 canvas; these constants
 * were fitted to those pins (error under 0.1 px on the checked cities), so a
 * new pin lands exactly where the original script would have put it.
 */
const SCALE = 182.7985;
const TX = 500.035;
const TY = 287.088;

const l = (p) => 0.8707 - 0.131979 * p * p - 0.013791 * p ** 4 + 0.003971 * p ** 10 - 0.001529 * p ** 12;
const d = (p) => 1.007226 * p + 0.015085 * p ** 3 - 0.044475 * p ** 7 + 0.028874 * p ** 9 - 0.005916 * p ** 11;

export function project(lat, lon) {
  const p = (lat * Math.PI) / 180;
  const L = (lon * Math.PI) / 180;
  const x = TX + SCALE * (L * l(p));
  const y = TY - SCALE * d(p);
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

const PLACE_WORDS = /\b(city|town|village|suburb|borough|municipality|locality|capital|county|parish|district|state|province|region|country|island|territory|commune|neighbou?rhood|settlement|urban area|metropolitan)\b/i;

/**
 * Finds a place on Wikidata and returns its coordinates. Tries the whole
 * string first ("Kincumber, New South Wales"), then the first part alone.
 */
export async function geocode(http, place) {
  if (!place) return null;
  const candidates = [place, place.split(/[,·]/)[0].trim()].filter((v, i, a) => v && a.indexOf(v) === i);
  for (const q of candidates) {
    const r = await http.json(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(q)}&language=en&type=item&limit=5&format=json`, { minGap: 300 });
    if (!r.ok) return undefined;
    for (const hit of r.body?.search || []) {
      if (!PLACE_WORDS.test(hit.description || "")) continue;
      const c = await http.json(`https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${hit.id}&property=P625&format=json`, { minGap: 300 });
      const v = c.ok ? c.body?.claims?.P625?.[0]?.mainsnak?.datavalue?.value : null;
      if (v) {
        const precision = /\b(state|province|region|country|territory|county)\b/i.test(hit.description || "") ? "region" : "city";
        return { qid: hit.id, label: hit.label, description: hit.description, lat: v.latitude, lon: v.longitude, precision };
      }
    }
  }
  return null;
}
