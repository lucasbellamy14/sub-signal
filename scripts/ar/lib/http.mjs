/**
 * One HTTP client for every source: a polite per-host rate limit, retries with
 * backoff on 429/5xx/network errors, a timeout, and counters so a run can say
 * which sources were healthy. `fetchImpl` is injectable so tests can replay
 * canned responses or simulate outages without touching the network.
 */
import { sleep } from "./util.mjs";

export const USER_AGENT = "SubSignal-AR/0.1 (https://sub-signal.vercel.app; lucasbellamy14@gmail.com)";

export function createHttp({
  fetchImpl = globalThis.fetch,
  userAgent = USER_AGENT,
  log = (m) => console.error(m),
  retries = 3,
  baseDelayMs = 1000,
  timeoutMs = 20000,
} = {}) {
  const lastCall = new Map(); // host -> timestamp of the last request
  const chains = new Map(); // host -> promise chain that serialises the gaps
  const stats = {}; // host -> { ok, fail, retried }

  function gate(host, minGap) {
    const prev = chains.get(host) || Promise.resolve();
    const next = prev.then(async () => {
      const wait = (lastCall.get(host) || 0) + minGap - Date.now();
      if (wait > 0) await sleep(wait);
      lastCall.set(host, Date.now());
    });
    chains.set(host, next.catch(() => {}));
    return next;
  }

  async function request(url, { minGap = 0, headers = {}, accept = "json", retryOn = [408, 425, 429, 500, 502, 503, 504] } = {}) {
    const host = new URL(url).host;
    stats[host] ??= { ok: 0, fail: 0, retried: 0 };
    let lastErr = "";
    let delay = baseDelayMs;
    for (let attempt = 0; attempt <= retries; attempt++) {
      await gate(host, minGap);
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), timeoutMs);
        let res;
        try {
          res = await fetchImpl(url, { headers: { "User-Agent": userAgent, Accept: accept === "json" ? "application/json" : "*/*", ...headers }, signal: ctrl.signal, redirect: "follow" });
        } finally {
          clearTimeout(timer);
        }
        if (res.ok) {
          const body = accept === "json" ? await res.json() : await res.text();
          stats[host].ok++;
          return { ok: true, status: res.status, body };
        }
        if (!retryOn.includes(res.status)) {
          stats[host].fail++;
          return { ok: false, status: res.status, error: `HTTP ${res.status}` };
        }
        lastErr = `HTTP ${res.status}`;
      } catch (e) {
        lastErr = e?.name === "AbortError" ? "timeout" : e?.message || String(e);
      }
      if (attempt < retries) {
        stats[host].retried++;
        await sleep(delay);
        delay *= 3;
      }
    }
    stats[host].fail++;
    log(`  http  FAIL ${url} — ${lastErr}`);
    return { ok: false, error: lastErr };
  }

  return {
    stats,
    request,
    json: (url, o) => request(url, { ...o, accept: "json" }),
    text: (url, o) => request(url, { ...o, accept: "text" }),
  };
}
