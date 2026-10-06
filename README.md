This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


---

## Adding and publishing artists (the safe workflow)

Everything about an artist lives in `src/data/artists.ts`. **Editorial rule: nothing goes in
unless it is stated in a source you have read, and every timeline entry links to its sources.**

1. `npm run add-artist -- "Artist Name" --city "..." --genres "..."` creates a **draft** and downloads a photo.
2. Research the artist from real sources (Wikipedia + one other, press, label bio). Fill in the
   story: `cardTitle`, `cardBody`, `location`, `genres`, and a `timeline` where each entry has a
   `sources: [...]` list. Leave out birthdates, family, health and any social handle you can't
   confirm from an official source.
3. `npm run sync-artists` records the Deezer ID and featured song the Listen player needs.
4. `npm run check-links` verifies every video, Spotify link, **source URL** and photo.
5. Review locally with the draft preview: `NEXT_PUBLIC_SHOW_DRAFTS=1 npm run dev`
   (drafts are invisible everywhere else, including production builds).
6. Delete the `draft: true` line to publish.

| Command | What it does |
| --- | --- |
| `npm run photos` | Downloads artist photos from Deezer (exact-name match) |
| `npm run add-artist` | Creates a draft artist + photo |
| `npm run sync-artists` | Records Deezer IDs / featured songs for the Listen player |
| `npm run check-links` | Fails if any video, Spotify link, source link or photo is broken |

The **Listen player** plays 30-second Deezer previews. Preview links expire after ~15 minutes
and Deezer's API can't be called from a browser, so `/api/listen/[slug]` fetches fresh ones.
