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

### Desktop task prompt (current wording; paste into the task in the Claude app → Scheduled → "Sub Signal weekly A&R editorial" → edit)

```
You are running Sub Signal's weekly editorial step unattended. Nobody is watching; do not ask questions; if something blocks you, write it into the report instead.

Repository (local checkout, pushes work over SSH): /Users/lucasbellamy/Desktop/CLAUDE MISC/sub-signal

1. cd into that folder. Run: git checkout main && git pull git@github.com:lucasbellamy14/sub-signal.git main
   If node_modules is missing, run npm ci. Make sure no dev server is running in this folder before any build (never run `npm run build` while `next dev` runs there).
2. Read the file .claude/skills/weekly-ar/SKILL.md in that folder and follow it exactly, start to finish. It defines the house rules (numbers only from data/ar, every fact sourced from a page you read, no private details, licensed photos only, skip rather than pad), the procedure (data-first check, npm run ar:draft, research, npm run ar:photo, the gates: npm run check-links, npx tsc --noEmit, npm run lint, npm run build, npm run ar:test), and the report format.
3. The week id is the current ISO week (date +%G-W%V). GitHub's scheduled data run is sometimes hours late: if main has no "A&R data: week <week>" commit made today, the skill's step 0 tells you to run the data step yourself (node scripts/ar/run.mjs, about 20 minutes) and push that one data commit to main. Do that rather than stopping.
4. Keep every new artist entry as draft: true. Apart from the data commit in step 3, never push to main. Append the "## Editorial run" report section to data/ar/reports/<week>.md even when no artist cleared the gate, commit on branch claude/ar-<week>, and push it with the SSH URL above. If that branch already exists on GitHub, start from it as the skill says; never force-push. The repository's GitHub workflow opens the pull request and posts the report on the week's issue; you do not need gh or any GitHub login.
5. End by printing the report section you wrote, and leave the checkout on main (git checkout main).
```

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
