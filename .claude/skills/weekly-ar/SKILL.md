---
name: weekly-ar
description: Sub Signal's weekly editorial run. Turns this week's A&R shortlist (data/ar) into draft artist profiles with sourced copy, licensed photos and verified links, then opens a pull request. Use for "run the weekly A&R editorial step", "/weekly-ar", or when a scheduled task asks for the editorial run.
---

# Weekly A&R editorial run

You are the editorial half of Sub Signal's A&R system. The data half already
ran this morning (GitHub Actions) and left this week's files in `data/ar/`.
Your job: for each shortlisted artist, confirm who they are, research sourced
facts, write the profile in the site's exact format, get a rights-cleared
photo or accept the generative fallback, run every gate, and open a pull
request. You never publish directly in PR mode.

## House rules (non-negotiable)

1. **Numbers come only from `data/ar/`.** Never quote a stream count, listener
   count, follower count, chart position or growth figure from memory or from
   a web page. If it is not in the snapshot or shortlist, it does not go in.
2. **Every fact needs a source you have read**, cited by URL in the timeline
   entry's `sources`, and the page must name the artist (the link checker
   verifies this). Wikipedia plus one other independent source is the minimum.
3. **Never:** birthdates, family, health, legal names, unconfirmed social
   handles, quotes you cannot link, promotional claims ("poised", "undeniable",
   "taking the world by storm"), superlatives without a comparison.
4. **Identity before prose.** Confirm the MusicBrainz id, Deezer id and the
   Spotify artist URL all point at the same act. A `notes` entry in the
   shortlist saying the links disagree means you must resolve it or skip.
5. **Photos:** only what `npm run ar:photo` accepts (Commons CC0/PD/CC BY/
   CC BY-SA) or the generative fallback. Never download an image yourself.
6. **Spotify is embed-only.** Find the featured track's Spotify URL on the
   artist's Spotify page via search engines or MusicBrainz links; verify it
   with `https://open.spotify.com/oembed?url=...` (the checker does this too).
7. **Write like a music publication, not a press release.** "Why we're
   watching" is two or three sentences: the concrete event, the numbers from
   the evidence list, the independent validation. Vary openings week to week
   (read the last four weeks of `signal.json` entries first).
8. **Skip rather than stretch.** An artist with thin sources, an unresolved
   identity, or copy you had to pad is skipped this week and stays on the
   watchlist. Say so in the report. Zero artists is an acceptable outcome.

## Procedure

```
WEEK=$(ls data/ar/shortlists | sort | tail -n 1 | sed 's/\.json$//')
```

1. **Read** `data/ar/shortlists/$WEEK.json` (`eligible`, `overflow`, `watch`),
   `data/ar/reports/$WEEK.md`, and `src/data/artists.ts` for the house style.
   If `eligible` is empty, go to step 8 with "no artists cleared the gate".
2. **For each eligible artist, in score order, at most `cap` of them:**
   - `npm run ar:draft -- --key <key> --week $WEEK --drop` creates the stub,
     the signal entry, the map pin and this week's Drop.
   - `npm run sync-artists` records the Deezer id and, once `spotifyTrackId`
     is set, the featured title.
   - Research: Wikipedia, the artist's official site, label pages, press from
     the evidence list, Bandcamp. Read each page. Build 3–6 timeline entries
     (year, title, one or two sentences, `sources: [...]`).
   - Fill `cardTitle` ("Artist: what happened"), `cardBody` (2–3 sentences),
     `meta`, `location`, `genres` (match existing label wording), `spotify`,
     `spotifyTrackId`, `instagram`/`website` only from official sources.
   - Fill `whyWatching` in `src/data/signal.json` from the evidence list.
   - `npm run ar:photo -- <slug> --hotlink`. Read its output; if it says
     generative art, that is fine.
   - If anything cannot be sourced, revert that artist (`git checkout` the
     touched files, delete its photo) and note why.
3. **Gates, all of them:** `npm run check-links` (drafts are name-checked),
   `npx tsc --noEmit`, `npm run lint`, `npm run build`,
   `npm run ar:test`. Fix what you can; drop the artist if you cannot.
4. **Completeness check per artist:** photo file or hotlink or generative
   fallback noted; `spotifyTrackId` set and valid; at least three timeline
   entries each with sources; no "TODO" anywhere in the entry or its signal;
   `whyWatching` mentions no number that is absent from `evidence`.
5. **Keep `draft: true` on every new entry.** Lucas merges the PR and removes
   the flags, or asks you to. (After launch approval this step changes to:
   remove the flags, push to main, verify the live pages.)
6. **Record** the report (step 8's text) in `data/ar/reports/$WEEK.md`
   under a heading `## Editorial run` (append; keep the data run's text).
   Do this even when no artist cleared the gate.
7. **Commit and push** on a branch `claude/ar-$WEEK` (create it from main with
   `git checkout -B claude/ar-$WEEK main`; if a rehearsal or earlier attempt
   already pushed that branch, push with `--force-with-lease`) with message
   `A&R $WEEK: <n> draft profile(s): <names>` (or `A&R $WEEK: no drafts`).
   Push with `git push -u git@github.com:lucasbellamy14/sub-signal.git claude/ar-$WEEK`
   (SSH; never HTTPS). You do NOT open the pull request or comment on the
   issue yourself: the repository workflow `.github/workflows/ar-editorial.yml`
   runs on every push to a `claude/ar-*` branch, opens or updates the PR when
   `src/` changed, and posts the `## Editorial run` section of the report as a
   comment on the week's issue. If `gh` happens to be installed and
   authenticated you may additionally run `gh pr view` to confirm, nothing more.
8. **Report**, in this shape (it is what the workflow posts):

```
SUB SIGNAL WEEKLY A&R REPORT — editorial
Week of <Monday date>
New artists drafted: <n> (PR #<n>)
Top discovery: <name> — <two sentences of evidence>
Artists drafted:
1. <name>: <category>, <score>/100 — <photo: Commons / Deezer / generative>
Skipped: <name> — <reason>
Watchlist: <n> artists under observation
Existing artists with renewed momentum: <from the data report>
System status: <sources line from the data report>
Issues: <anything that failed, or "none">
```

Running locally (Desktop scheduled task on Lucas's Mac): the repository is at
`/Users/lucasbellamy/Desktop/CLAUDE MISC/sub-signal`. Start with
`git checkout main && git pull git@github.com:lucasbellamy14/sub-signal.git main`
so this week's data-run commit is present, and `npm ci` only if
`node_modules` is missing. Never run `npm run build` while a dev server is
running in that folder (it corrupts `.next`); stop the dev server first.

If the repo cannot be pushed or a gate cannot be run, stop and write what
happened into the report section instead of working around it.
