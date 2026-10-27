# Sub Signal A&R data

Everything the weekly discovery system records lives here, in git, so the
history is auditable and a bad week is one `git revert` away.

| File | What it is |
| --- | --- |
| `config.json` | Countries, feeds, thresholds, scoring curves. Tune here, not in code. |
| `artists.json` | The ledger: one record per artist we have ever looked at (identity, links, status, score history). |
| `snapshots/<week>.json` | Every tracked artist's numbers for that ISO week, plus which sources were healthy. |
| `shortlists/<week>.json` | That week's scored shortlist, watchlist and roster momentum. |
| `reports/<week>.md` | The weekly report, also posted as a GitHub issue by the workflow. |

Ledger statuses: `roster` (already on the site), `candidate`, `watchlist`,
`shortlisted` (cleared the publish gate; the editorial run picks it up),
`published`, `dropped`.

Run locally: `npm run ar:run -- --limit 40` (needs `LASTFM_API_KEY` in the
environment for streaming and listener growth; without it those components
are marked unavailable). Tests: `npm run ar:test`.

Sources and the terms they bind us to are listed in the proposal; in short:
Deezer and Last.fm are non-commercial-only, press feeds are read for
headlines only, Apple feeds link back to Apple Music, MusicBrainz data is
CC0. Spotify is never read here; it stays an embed on the site.
