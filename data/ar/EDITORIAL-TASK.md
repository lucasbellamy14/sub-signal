# The editorial run: how it is scheduled

Two engines can run `.claude/skills/weekly-ar/SKILL.md`. Either way the run
pushes a `claude/ar-<week>` branch and `.github/workflows/ar-editorial.yml`
opens the pull request and posts the report on the week's issue; the Tuesday
watchdog (`ar-watchdog.yml`) flags a missed week.

## Engine in use: Desktop scheduled task (Claude app on Lucas's Mac)

Created from this session with the app's scheduled-tasks tool; it appears
under **Scheduled** in the Claude app's sidebar. Monday 09:07 local time,
in auto permission mode, in the local checkout at
`/Users/lucasbellamy/Desktop/CLAUDE MISC/sub-signal`. It runs while the app
is open; if the app is closed at the time it runs on the next launch, and the
watchdog says so on Tuesday if nothing arrived. No GitHub login is needed:
pushes use the Mac's SSH key, and the workflow does the rest.

## Alternative: cloud scheduled task (claude.ai/code/routines)

Needs the GitHub account connected to the Claude account
(claude.ai/connect-github, both steps). Once that exists, create with:

- **Name:** Sub Signal weekly A&R editorial
- **Schedule:** Monday 09:07 America/Los_Angeles (`7 17 * * 1` UTC in winter)
- **Repository:** https://github.com/lucasbellamy14/sub-signal
- **Environment:** Default (add press/music domains or Full network if runs report blocked requests)
- **Model:** Opus
- **Prompt:**

```
Run the weekly Sub Signal editorial step. The repository has a skill at
.claude/skills/weekly-ar/SKILL.md: read it first and follow it exactly.
This week's data run already committed its files under data/ar/ on main; the
week id is the newest file in data/ar/shortlists/. Install dependencies with
npm ci, work on a branch named claude/ar-<week>, keep every new artist entry
as draft: true, run every gate the skill lists, and push the branch; the
repository workflow opens the PR and posts the report. Never publish to
main, never invent a number, never cite a page you have not read, and skip
an artist rather than pad thin sources.
```
