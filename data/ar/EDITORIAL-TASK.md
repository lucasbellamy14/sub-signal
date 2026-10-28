# Scheduled task: Sub Signal weekly editorial run

Create at https://claude.ai/code/routines (or `/schedule` in Claude Code).

- **Name:** Sub Signal weekly A&R editorial
- **Schedule:** Monday 09:07 America/Los_Angeles (cron, UTC: `7 16 * * 1` in winter clock, `7 17 * * 1` in summer; or pick the preset "weekly, Monday 09:07" in local time)
- **Repository:** https://github.com/lucasbellamy14/sub-signal
- **Environment:** Default (Trusted network). Add these to Allowed domains if runs report blocked requests: api.deezer.com, ws.audioscrobbler.com, rss.marketingtools.apple.com, musicbrainz.org, www.wikidata.org, commons.wikimedia.org, upload.wikimedia.org, open.spotify.com, en.wikipedia.org, plus `--allow all` for press sites, or switch the environment to Full network access.
- **Connectors:** none required. GitHub access comes from the connected GitHub account.
- **Model:** the default.
- **Prompt:**

```
Run the weekly Sub Signal editorial step. The repository has a skill at
.claude/skills/weekly-ar/SKILL.md — read it first and follow it exactly.
This week's data run already committed its files under data/ar/ on main.
Work on a branch named claude/ar-<week>, keep every new artist entry as
draft: true, open a pull request, and post the report as a comment on the
open GitHub issue titled "A&R week <week>: data run". If no artist clears
the gate, open no PR and post a report saying so. Never publish directly,
never invent a number, never cite a page you have not read.
```

The data run (GitHub Actions, Monday 08:07 PT) must have committed this
week's shortlist before this runs; if `data/ar/shortlists/<week>.json` is
missing, the task should report that and stop.
