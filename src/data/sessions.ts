export interface Session {
  id: string;
  artistSlug: string;
  videoUrl: string;
  songTitle: string;
  /** "Official video", "Live session", etc. */
  kind: string;
  /** The YouTube channel that published it (as reported by YouTube). */
  source: string;
}

/**
 * Every URL below was checked against YouTube's oEmbed endpoint: the video
 * exists, allows embedding, and the title/channel match the artist.
 * Re-check any link you add or swap — see scripts/check-links.mjs.
 */
export const SESSIONS: Session[] = [
  {
    id: "mkgee-rockman",
    artistSlug: "mk-gee",
    videoUrl: "https://www.youtube.com/watch?v=0wQ-Wx-4pYw",
    songTitle: "ROCKMAN",
    kind: "Official audio",
    source: "Mkgee",
  },
  {
    id: "nia-archives-forbidden-feelingz",
    artistSlug: "nia-archives",
    videoUrl: "https://www.youtube.com/watch?v=PjCVcVw8f1Y",
    songTitle: "Forbidden Feelingz",
    kind: "Official video",
    source: "Nia Archives",
  },
  {
    id: "paris-texas-heavy-metal",
    artistSlug: "paris-texas",
    videoUrl: "https://www.youtube.com/watch?v=TocORUNKzh4",
    songTitle: "HEAVY METAL",
    kind: "Official video",
    source: "Paris Texas",
  },
  {
    id: "rizlavie-audiotree",
    artistSlug: "riz-la-vie",
    videoUrl: "https://www.youtube.com/watch?v=tTpgFefqRSE",
    songTitle: "Full session",
    kind: "Live session",
    source: "Audiotree",
  },
  {
    id: "oliver-malcolm-mexico",
    artistSlug: "oliver-malcolm",
    videoUrl: "https://www.youtube.com/watch?v=OI1aeip5FUs",
    songTitle: "Mexico",
    kind: "Official video",
    source: "OliverMalcolmVEVO",
  },
  {
    id: "contradash-superficial",
    artistSlug: "contradash",
    videoUrl: "https://www.youtube.com/watch?v=hoJiT55sQLA",
    songTitle: "Superficial",
    kind: "Official video",
    source: "contradashVEVO",
  },
  {
    id: "dove-ellis-to-the-sandals",
    artistSlug: "dove-ellis",
    videoUrl: "https://www.youtube.com/watch?v=bD0MofU5udE",
    songTitle: "To The Sandals",
    kind: "Official audio",
    source: "Dove Ellis",
  },
  {
    id: "absolutely-i-just-dont-know-you-yet",
    artistSlug: "absolutely",
    videoUrl: "https://www.youtube.com/watch?v=nQ5aIl_yfAw",
    songTitle: "I Just Don't Know You Yet",
    kind: "Official video",
    source: "AbsolutelyVEVO",
  },
  {
    id: "devon-again-this-time-its-different",
    artistSlug: "devon-again",
    videoUrl: "https://www.youtube.com/watch?v=I8KW42D2vvM",
    songTitle: "this time it's different",
    kind: "Official live video",
    source: "DevonAgainVEVO",
  },
  {
    id: "fakemink-easter-pink",
    artistSlug: "fakemink",
    videoUrl: "https://www.youtube.com/watch?v=KB5TKob9PeA",
    songTitle: "Easter Pink",
    kind: "Video",
    source: "fakemink",
  },
  {
    id: "jean-dawson-delusional-world-champion",
    artistSlug: "jean-dawson",
    videoUrl: "https://www.youtube.com/watch?v=jaGxL8DglSs",
    songTitle: "delusional world champion",
    kind: "Official video",
    source: "Jean Dawson",
  },
  {
    id: "nettspend-fck-swag",
    artistSlug: "nettspend",
    videoUrl: "https://www.youtube.com/watch?v=BRfZe0mLcpw",
    songTitle: "F*CK SWAG",
    kind: "Official video",
    source: "Lyrical Lemonade",
  },
  {
    id: "whatmore-put-it-on-hearts",
    artistSlug: "whatmore",
    videoUrl: "https://www.youtube.com/watch?v=DWyXxf8qGa4",
    songTitle: "put it on hearts",
    kind: "COLORS performance",
    source: "COLORS",
  },
  {
    id: "sailorr-pookies-requiem",
    artistSlug: "sailorr",
    videoUrl: "https://www.youtube.com/watch?v=cygmozoGLI8",
    songTitle: "Pookie's Requiem (with Summer Walker)",
    kind: "Official video",
    source: "SAILORR",
  },
  {
    id: "jahson-paynter-medium-sized-backyard",
    artistSlug: "jahson-paynter",
    videoUrl: "https://www.youtube.com/watch?v=3PvoXOWl4fg",
    songTitle: "Live in the Medium Sized Backyard",
    kind: "Live session",
    source: "Pigeons & Planes",
  },
  {
    id: "sarah-kinsley-lonely-touch",
    artistSlug: "sarah-kinsley",
    videoUrl: "https://www.youtube.com/watch?v=FfrgilkozCY",
    songTitle: "Lonely Touch",
    kind: "Official video",
    source: "SarahKinsleyVEVO",
  },
];
