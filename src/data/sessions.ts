export interface Session {
  id: string;
  artistSlug: string;
  videoUrl: string;
  songTitle: string;
  recordingDate: string;
  venue: string;
}

export const SESSIONS: Session[] = [
  {
    id: "mkgee-colors",
    artistSlug: "mk-gee",
    videoUrl: "https://www.youtube.com/watch?v=FmuFBHoGmYI",
    songTitle: "DNM",
    recordingDate: "2024-09-15",
    venue: "A COLORS SHOW",
  },
  {
    id: "nia-archives-colors",
    artistSlug: "nia-archives",
    videoUrl: "https://www.youtube.com/watch?v=mVCgT1FVA5g",
    songTitle: "Silence Is Loud",
    recordingDate: "2024-06-20",
    venue: "A COLORS SHOW",
  },
  {
    id: "paris-texas-audiotree",
    artistSlug: "paris-texas",
    videoUrl: "https://www.youtube.com/watch?v=kqMEhKnjsKs",
    songTitle: "HEAVY METAL",
    recordingDate: "2023-11-08",
    venue: "Audiotree Live",
  },
  {
    id: "rizlavie-mahogany",
    artistSlug: "riz-la-vie",
    videoUrl: "https://www.youtube.com/watch?v=_49AoDgzuRU",
    songTitle: "Napkins",
    recordingDate: "2022-03-12",
    venue: "Mahogany Sessions",
  },
  {
    id: "oliver-malcolm-vevo",
    artistSlug: "oliver-malcolm",
    videoUrl: "https://www.youtube.com/watch?v=Tyi8RJrYvp0",
    songTitle: "Runaway",
    recordingDate: "2021-07-22",
    venue: "Vevo DSCVR",
  },
  {
    id: "contradash-live",
    artistSlug: "contradash",
    videoUrl: "https://www.youtube.com/watch?v=r5GCn1BKkxg",
    songTitle: "Blocked",
    recordingDate: "2021-02-10",
    venue: "Live Session",
  },
];
