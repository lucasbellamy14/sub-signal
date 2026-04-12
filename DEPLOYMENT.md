# Sub Signal — Deployment Guide

Live site: **https://sub-signal.vercel.app**
GitHub repo: **https://github.com/lucasbellamy14/sub-signal**

---

## How to Add a New Artist

1. Open the folder `src/content/artists/`
2. Copy the file `_template.mdx` and rename it to the artist's name with dashes (e.g., `oliver-malcolm.mdx`)
3. Open the new file and fill in all the fields between the `---` marks (name, slug, role, genre, stats, etc.)
4. Write the "Who They Are" bio and "Before The Signal" origin story below the `---`
5. (Optional) Drop a photo into `public/images/artists/` — name it to match the slug (e.g., `oliver-malcolm.jpg`). If you skip this, a placeholder with initials will show automatically.
6. Push to GitHub (see "How to Push Changes" below)
7. Vercel automatically rebuilds the site in ~60 seconds. Done!

### Important rules for the MDX file:
- The `slug` must match the filename (without `.mdx`)
- Set `featured: true` on only ONE artist at a time (the homepage hero)
- Genre and mood values should match the filter chip options (Indie, Electronic, Experimental, Art Pop, R&B, Lo-fi, Rock, Hip-Hop / Chill, Energetic, Melancholic, Experimental, Dreamy, Raw)
- The photo path should start with `/images/artists/`

---

## How to Update an Existing Artist

1. Open their `.mdx` file in `src/content/artists/`
2. Edit whatever you want (stats, bio, timeline events, etc.)
3. Push to GitHub
4. Site updates automatically

---

## How to Change the Featured Artist

1. Open the current featured artist's `.mdx` file
2. Change `featured: true` to `featured: false`
3. Open the new featured artist's `.mdx` file
4. Change `featured: false` to `featured: true`
5. Update the `featuredDate` and `week` fields
6. Push to GitHub

---

## How to Push Changes to GitHub

Run these commands in your terminal from the `sub-signal` folder:

```bash
git add .
git commit -m "Brief description of what you changed"
git push
```

For example:
```bash
git add .
git commit -m "Add new artist: Oliver Malcolm"
git push
```

Vercel detects the push and rebuilds automatically. Your changes go live in about 60 seconds.

---

## How to Connect a Custom Domain

If you want a domain like `subsignal.com` instead of `sub-signal.vercel.app`:

1. **Buy a domain** from a registrar like Namecheap, Google Domains, or GoDaddy (~$10-15/year)
2. Go to **vercel.com** and open your Sub Signal project
3. Click **"Settings"** in the top nav
4. Click **"Domains"** in the left sidebar
5. Type your domain (e.g., `subsignal.com`) and click **"Add"**
6. Vercel will show you DNS records to add. Go to your domain registrar and:
   - Add an **A record** pointing to `76.76.21.21`
   - Add a **CNAME record** for `www` pointing to `cname.vercel-dns.com`
7. Wait 5-30 minutes for DNS to update
8. Vercel automatically sets up HTTPS (the lock icon in browsers)

---

## Common Issues

### "My new artist isn't showing up"
- Make sure the filename ends in `.mdx` (not `.md`)
- Make sure the filename does NOT start with `_` (that's only for the template)
- Make sure you pushed to GitHub (`git push`)
- Check that the `slug` in the file matches the filename

### "The photo isn't showing"
- Make sure the photo is in `public/images/artists/`
- Make sure the filename matches exactly (case-sensitive)
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

### "The build failed on Vercel"
- Go to vercel.com → your project → "Deployments" tab
- Click the failed deployment to see the error log
- Common cause: a typo in the MDX frontmatter (missing quotes, wrong indentation)

### "I want to undo a change"
```bash
git log --oneline
```
This shows your recent commits. To undo the last push:
```bash
git revert HEAD
git push
```

---

## Admin Tools (not linked on the public site)

- **IG Post Generator:** https://sub-signal.vercel.app/admin/generate-ig
- **Newsletter Generator:** https://sub-signal.vercel.app/admin/newsletter
- **Subscriber list:** stored in `data/subscribers.json`

---

## Tech Stack Reference

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** MDX files
- **Fonts:** Syne (headings) + Space Mono (body/labels)
- **Hosting:** Vercel (free tier)
- **Code:** GitHub

---

## Project Structure

```
sub-signal/
├── src/
│   ├── app/              ← Pages (homepage, artist profiles, admin)
│   ├── components/       ← Reusable UI pieces (Header, Footer, Cards, etc.)
│   ├── content/artists/  ← Artist MDX files (THIS IS WHERE YOU ADD ARTISTS)
│   └── lib/              ← Helper code (reads MDX files)
├── public/images/artists/ ← Artist photos go here
├── data/                 ← Subscriber emails
└── DEPLOYMENT.md         ← This file
```
