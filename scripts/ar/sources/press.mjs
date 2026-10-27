/**
 * Music press RSS feeds. We keep headline, outlet, URL and date only, never
 * article text. A feed that fails is skipped; "press" is unavailable only when
 * every feed fails.
 */
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) =>
  String(s || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/<[^>]+>/g, "")
    .trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return m ? decode(m[1]) : "";
};

/** Parses RSS 2.0 and Atom well enough for headlines. Exported for tests. */
export function parseFeed(xml) {
  const items = [];
  for (const m of xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)) {
    const block = m[2];
    const title = tag(block, "title");
    let url = tag(block, "link");
    if (!url) {
      const href = block.match(/<link[^>]*href="([^"]+)"/i);
      url = href ? href[1] : "";
    }
    const date = tag(block, "pubDate") || tag(block, "dc:date") || tag(block, "published") || tag(block, "updated");
    if (title) items.push({ title, url, date: date ? new Date(date).toISOString() : null });
  }
  return items;
}

export function press(http, feeds, { maxAgeDays = 35, now = new Date() } = {}) {
  return {
    name: "press",
    async items() {
      const all = [];
      let okFeeds = 0;
      for (const f of feeds) {
        const r = await http.text(f.url, { minGap: 300, headers: { Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" } });
        if (!r.ok) continue;
        const parsed = parseFeed(r.body);
        if (!parsed.length) continue;
        okFeeds++;
        for (const it of parsed) {
          if (it.date && (now - new Date(it.date)) / 86400000 > maxAgeDays) continue;
          all.push({ outlet: f.outlet, ...it });
        }
      }
      if (!okFeeds) return undefined;
      return { items: all, feedsOk: okFeeds, feedsTotal: feeds.length };
    },
  };
}

/**
 * Which pool artists does a headline mention? Whole-word, case-insensitive.
 * Short or dictionary-like names are matched only when a music word is near,
 * which cuts most false positives from names like "Cola" or "Chalk". The
 * editorial run re-checks every match before it counts for publication.
 */
const COMMON = new Set(["the", "and", "you", "new", "music", "live", "love", "home", "air", "sun", "moon", "fire", "water", "girl", "boy", "night", "day", "life", "time", "real", "true", "young", "old", "big", "little", "black", "white", "gold", "silver", "king", "queen", "man", "men", "hot", "cold", "cool"]);
const MUSIC_WORDS = /\b(album|single|song|track|ep|lp|tour|video|remix|mixtape|debut|release|releases|announces|shares|drops|signs|premiere|watch|listen|stream|band|rapper|singer|producer|dj)\b/i;

export function matchPress(items, names) {
  const out = new Map(); // normName -> [{outlet,title,url,date}]
  const compiled = names
    .filter((n) => n && n.length >= 3 && !COMMON.has(n.toLowerCase()))
    .map((n) => ({ name: n, re: new RegExp(`(^|[^a-z0-9])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[^a-z0-9])`, "i"), weak: n.length <= 5 || !/\s/.test(n) && /^[a-z]+$/i.test(n) && n.length <= 7 }));
  for (const it of items) {
    let hits = compiled.filter((c) => c.re.test(it.title) && !(c.weak && !MUSIC_WORDS.test(it.title)));
    // "Nia" must not claim a headline about "Nia Archives": keep only names not contained in a longer matching name
    hits = hits.filter((c) => !hits.some((o) => o !== c && o.name.length > c.name.length && o.name.toLowerCase().includes(c.name.toLowerCase())));
    for (const c of hits) {
      if (!out.has(c.name)) out.set(c.name, []);
      out.get(c.name).push(it);
    }
  }
  return out;
}
