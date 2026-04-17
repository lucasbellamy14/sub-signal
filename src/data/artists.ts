export interface TimelineArtist {
  id: string;
  slug: string;
  name: string;
  meta: string;
  photos: [string, string];
  photoLabels: [string, string];
  cardNumber: string;
  cardTag: string;
  cardTitle: string;
  cardBody: string;
  genres: string[];
  spotifyTrackId?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  spotify?: string;
  featuredDate: string;
  timeline: { year: string; title: string; body: string }[];
}

export const ARTISTS: TimelineArtist[] = [
  {
    id: "mkgee",
    slug: "mk-gee",
    name: "Mk.gee",
    meta: "Los Angeles · Alt-R&B · b. 1996",
    photos: ["/images/mkgee-early.jpg", "/images/mkgee-recent.jpg"],
    photoLabels: ["Linwood, NJ · Early Days", "Los Angeles · 2024"],
    cardNumber: "01",
    cardTag: "Discovery",
    cardTitle: "Mk.gee Is Building Cathedrals",
    cardBody: "From bedroom recordings in New Jersey to a critically acclaimed debut — Mk.gee turned years of quiet obsession into one of 2024's most talked-about albums.",
    genres: ["Alt-R&B", "Indie Rock"],
    spotifyTrackId: "00uvWPbNBali6gKlZxUxIU",
    instagram: "https://www.instagram.com/mk.gee_/",
    tiktok: "https://www.tiktok.com/@mk.gee_",
    twitter: "https://x.com/mk_gee_",
    spotify: "https://open.spotify.com/artist/7tr9pbgNEKtG0GQTKe08Tz",
    featuredDate: "2026-04-14",
    timeline: [
      { year: "1996", title: "Linwood, New Jersey", body: "Michael Todd Gordon was born in Somers Point, New Jersey, and grew up in nearby Linwood. He started studying piano and composing music at the age of five. Guitar lessons came next, and by his teenage years he had developed a deep interest in jazz." },
      { year: "2015", title: "Mainland Regional to LA", body: "Graduated from Mainland Regional High School and moved to Los Angeles to study Popular Music at USC Thornton School of Music. He would eventually drop out before finishing his degree — but LA had already become home." },
      { year: "2017", title: "First Single. Quiet Start.", body: "Released his debut single \"I Know How You Get\" — the lead track of what would become his first EP. No label push, no industry rollout. Just a song put into the world to see what happened." },
      { year: "2018", title: "Two EPs. A Sound Takes Shape.", body: "Released two EPs back to back: Pronounced McGee in May and Fool later that year. The sound was already unmistakable — wet guitars, warped textures, something between R&B and indie that resisted easy labels." },
      { year: "2020", title: "A Museum of Contradiction", body: "Released his first mixtape, A Museum of Contradiction. Still working independently, still refining the sonic world he had been building since those early sessions. The audience grew slowly but steadily." },
      { year: "2024", title: "Two Star & the Dream Police", body: "Debut album Two Star & the Dream Police dropped via R&R Records to widespread critical acclaim. A North American headline tour followed, then a world tour through the fall. In November he performed on Saturday Night Live. Production credits with Fred Again, Bon Iver, and Justin Bieber put his name in rooms it had never been." },
    ],
  },
  {
    id: "nia-archives",
    slug: "nia-archives",
    name: "Nia Archives",
    meta: "London · Jungle · b. 1999",
    photos: ["/images/nia-early.jpg", "/images/nia-recent.jpg"],
    photoLabels: ["Leeds, UK · Early Days", "London · 2024"],
    cardNumber: "02",
    cardTag: "Profile",
    cardTitle: "Nia Archives and the New Jungle Sound",
    cardBody: "From Bradford to Beyoncé's world tour — how a self-taught producer from West Yorkshire became the face of jungle's resurgence.",
    genres: ["Jungle / D&B", "Electronic"],
    spotifyTrackId: "7wLHg91FTqYc2aZKpWmG9r",
    instagram: "https://www.instagram.com/archives.nia/",
    tiktok: "https://www.tiktok.com/@archives_nia",
    twitter: "https://x.com/archives_nia",
    spotify: "https://open.spotify.com/artist/7BMR0fwtEvzGtK4rNGdoiQ",
    featuredDate: "2026-04-12",
    timeline: [
      { year: "1999", title: "Bradford Born, Leeds Raised", body: "Born Dehaney Nia Lishahn Hunt in Bradford, West Yorkshire. Moved to Leeds at age seven. Half-Jamaican, she grew up surrounded by dub, reggae, and electronic sounds at her parents' backyard parties." },
      { year: "2017", title: "A Bootleg Copy of Logic Pro", body: "Fed up with how local producers were treating her, she downloaded a bootleg copy of Logic Pro and started making music on her own. As she sped her productions up, she realized she was making jungle — and started researching the genre's roots." },
      { year: "2020", title: "Sober Feels. No Label. Her Own.", body: "Sent her track \"Sober Feels\" to every local jungle and drum & bass label she could find. None were interested. So she released it herself under the name Nia Archives, on her own label Hijinxx." },
      { year: "2021", title: "Headz Gone West. DJ Flight.", body: "Released the Headz Gone West EP. Joined the EQ50 mentorship scheme, where she was paired with jungle legend DJ Flight. Goldie became a mentor too — she calls him \"Uncle Golds.\"" },
      { year: "2022", title: "NME Best Producer. 23 Years Old.", body: "Released the Forbidden Feelingz EP and won Best Producer at the BandLab NME Awards. The warehouse raves she had been playing were getting bigger. The world was catching up." },
      { year: "2024", title: "Silence Is Loud", body: "Debut album Silence Is Loud arrived — a fusion of jungle and Britpop. She played Glastonbury's West Holts Stage, headlined the 28-date Junglists Worldwide Tour, and had already supported Beyoncé on the Renaissance World Tour the year before." },
    ],
  },
  {
    id: "paris-texas",
    slug: "paris-texas",
    name: "Paris Texas",
    meta: "Los Angeles · Alt-Rap · Est. 2018",
    photos: ["/images/paristexas-early.jpg", "/images/paristexas-recent.jpg"],
    photoLabels: ["Los Angeles · Early Days", "Los Angeles · 2024"],
    cardNumber: "03",
    cardTag: "Mix",
    cardTitle: "90 Minutes with Paris Texas",
    cardBody: "An exclusive mixtape session blending hip-hop, noise rock, and internet-age absurdism — a snapshot of two artists who refuse to be categorized.",
    genres: ["Alt-Rap", "Experimental"],
    spotifyTrackId: "35ZDgSGHRkV04aYdkP1VfI",
    instagram: "https://www.instagram.com/paristexas/",
    twitter: "https://x.com/ParisTexasUSA",
    spotify: "https://open.spotify.com/artist/1SCrMreNPJYSRZIlRe9SUq",
    featuredDate: "2026-04-10",
    timeline: [
      { year: "2013", title: "El Camino College. A Mutual Friend.", body: "Louie Pastel and Felix — both pseudonyms, real names unknown — met during freshman year at El Camino College. A mutual friend introduced them. They bonded over Florida rapper Robb Banks and started making music together within months." },
      { year: "2018", title: "Paris Texas Is Born.", body: "After years of making music together, they formalized as a duo and took the name Paris Texas — a reference to Wim Wenders' 1984 road film. Louie, a Compton native who once dreamed of being an actor or comic book artist. Felix, from South Central. Both found their thing in the space between rap, punk, and noise rock." },
      { year: "2021", title: "Boy Anonymous. Out of Nowhere.", body: "Partnered with The Orchard and LA-based management Good Buddy. Released their debut mixtape Boy Anonymous in May, followed by Red Hand Akimbo. The sound was eclectic — hip-hop fused with grunge, punk, metal, and new wave. Hard to categorize. Impossible to ignore." },
      { year: "2023", title: "Mid Air. Headlining.", body: "Hosted an album listening event at Brain Dead Studios on Fairfax, debuting their album Mid Air for fans in person before the official release. Then announced their first international headlining tour across North America and Europe." },
      { year: "Now", title: "Still Unpredictable.", body: "Multiple projects deep with no signs of settling into anything expected. Every release pushes the sound somewhere new. The duo answers to no one and keeps it that way." },
    ],
  },
  {
    id: "riz-la-vie",
    slug: "riz-la-vie",
    name: "Riz La Vie",
    meta: "New York · Alt-R&B",
    photos: ["/images/rizlavie-early.jpg", "/images/rizlavie-recent.jpg"],
    photoLabels: ["New Jersey · Early Days", "New York · Now"],
    cardNumber: "04",
    cardTag: "Discovery",
    cardTitle: "Riz La Vie and the Art of the Slow Burn",
    cardBody: "A second-generation Lebanese American from New Jersey who turned quiet vulnerability into one of indie R&B's most honest voices — 37 million streams and counting.",
    genres: ["Alt-R&B", "Neo-Soul"],
    spotifyTrackId: "0YvzawIC5nFFYj5YAvv5HP",
    instagram: "https://www.instagram.com/thankyouriz/",
    tiktok: "https://www.tiktok.com/@thankyouriz",
    twitter: "https://x.com/THANKYOURIZ",
    spotify: "https://open.spotify.com/artist/0QkgnHpxSCOYdTnhUR9S5k",
    featuredDate: "2026-04-07",
    timeline: [
      { year: "Early", title: "New Jersey. Music First.", body: "A second-generation Lebanese American raised in New Jersey. He had a passion for music for as long as he can remember. Started making his own music at fourteen, inspired by Lil Wayne dropping No Ceilings — which kicked off his DIY approach to recording and releasing on his own terms." },
      { year: "2017", title: "Two EPs. Nobody Watching.", body: "Released his debut EP Found, followed later that year by Keep. An artful, grainy hybrid of R&B, hip-hop, and pop — occasionally bluesy, always personal. A few hundred plays. Enough to know the songs were finding people." },
      { year: "2018", title: "Napkins Goes Everywhere.", body: "\"Napkins\" dropped and spread through word of mouth and playlist adds. The single has since surpassed 37 million streams — all without a label, a manager, or a single paid promotion at the start." },
      { year: "2020", title: "Feed.", body: "Released the EP Feed, featuring tracks \"Tesla\" and \"She Said\" that expanded his audience further. The sound kept evolving — still raw, still honest, but with a growing confidence in the production." },
      { year: "2023", title: "Haven.", body: "Released his album Haven — the most complete statement of his vision to date. Based in New York City now, still independent, still writing songs that sound like they were meant for one person to hear even when millions do." },
    ],
  },
  {
    id: "oliver-malcolm",
    slug: "oliver-malcolm",
    name: "Oliver Malcolm",
    meta: "London · Alt-Pop",
    photos: ["/images/olivermalcolm-early.jpg", "/images/olivermalcolm-recent.jpg"],
    photoLabels: ["London · Early Days", "London · Now"],
    cardNumber: "05",
    cardTag: "Profile",
    cardTitle: "Oliver Malcolm: Producer First, Artist Always",
    cardBody: "A Swedish-born, London-raised producer who built his name behind the boards for MF DOOM and Joey Bada$$ — then stepped in front of the mic himself.",
    genres: ["Alt-Pop", "Electronic"],
    spotifyTrackId: "2qtJUSJmPz5mkVhFHrtCd7",
    instagram: "https://www.instagram.com/olivermalcolm/",
    tiktok: "https://www.tiktok.com/@olivermalcolm",
    twitter: "https://x.com/OliverMalcolm",
    spotify: "https://open.spotify.com/artist/5ut4VhaCRPsEjAZ93jpPfK",
    featuredDate: "2026-04-04",
    timeline: [
      { year: "Early", title: "Sweden to London.", body: "Born in Sweden, raised in London. Bought his own set of turntables and started DJing before realizing producing was what he really wanted to do. At fifteen, he began making beats in a cracked copy of Logic Pro." },
      { year: "2017", title: "MF DOOM. First Credit.", body: "His first major production credit landed at age seventeen — IDK's \"Pizza Shop\" featuring MF DOOM. He followed it up by co-producing IDK's \"Lil Arrogant\" featuring Joey Bada$$. Production credits for Russ, Cee-Lo Green, and Masego followed. All of this under his producer alias, Big Kidd." },
      { year: "2019", title: "Darkroom Signs Him.", body: "Signed to Darkroom/Interscope Records — the same imprint that broke Billie Eilish. The plan was to step out from behind the boards and develop his own voice as a solo artist." },
      { year: "2020", title: "Switched Up. Solo Debut.", body: "Released his debut single \"Switched Up\" — the first full song he ever made was also the first song he put out. It landed on Spotify's New Music Friday playlist and surpassed 1.5 million streams. Follow-up single \"Helen\" cemented the arrival." },
      { year: "Now", title: "Producer Turned Artist.", body: "Still making music that fuses pop, indie, and electronic sounds with an energy that comes from years of working behind the scenes with some of the best in the game. The transition from producer to artist is complete — but the producer ear never leaves." },
    ],
  },
  {
    id: "contradash",
    slug: "contradash",
    name: "Contradash",
    meta: "SoCal · Alt-Pop",
    photos: ["/images/contradash-early.jpg", "/images/contradash-recent.jpg"],
    photoLabels: ["Southern California · Early Days", "Los Angeles · Now"],
    cardNumber: "06",
    cardTag: "Discovery",
    cardTitle: "Contradash: From Cover Art to Center Stage",
    cardBody: "A graphic designer from Southern California who made cover art for Tyga and Ski Mask — then built his own world of early-2000s pop-soaked songs that Interscope couldn't ignore.",
    genres: ["Alt-Pop", "Pop"],
    spotifyTrackId: "5rhWIr9NmeuwRU3MFC8LBM",
    instagram: "https://www.instagram.com/contradash/",
    tiktok: "https://www.tiktok.com/@neverstopdash",
    twitter: "https://x.com/contradash",
    spotify: "https://open.spotify.com/artist/1pVa1yITCEfqfAvQaaHvAt",
    featuredDate: "2026-04-01",
    timeline: [
      { year: "Early", title: "Southern California. Design First.", body: "Grew up in Southern California with a gift for graphic design. Built a reputation creating cover art for rappers like Tyga, Ski Mask the Slump God, and Desiigner — all commissioned through the internet, all before he ever released a song of his own." },
      { year: "2017", title: "Dominic Fike. A Door Opens.", body: "His design work caught the attention of Dominic Fike. What started as an online connection led to a trip to Florida in 2018 to record in a real studio for the first time. Being around working musicians flipped something — he realized he wanted to make music, not just design for it." },
      { year: "2019", title: "Blocked. First Song Ever.", body: "Released his first song, \"Blocked.\" Heavily influenced by early 2000s pop, it sounded nothing like what anyone expected from someone who came up in the rap world's orbit. It was playful, melodic, and unapologetically pop." },
      { year: "2020", title: "250 to 250,000.", body: "\"Blocked\" hit No. 12 on Spotify's New Music Friday. He went from 250 monthly listeners to 250,000 overnight. Every major label reached out within hours. He signed to Interscope Records on February 10. Singles \"white lie,\" \"cat out of the bag,\" and \"favorite color\" followed. Then the ten-track EP all-star." },
      { year: "Now", title: "His Own World.", body: "Still building a sound rooted in the pop he grew up loving — bright, catchy, and designed with the same visual precision he brought to cover art. The graphic designer's eye never left. It just found a new medium." },
    ],
  },
];

export const TICKER_ARTISTS = [
  "Mk.gee",
  "Nia Archives",
  "Jean Dawson",
  "Amaarae",
  "Paris Texas",
  "Raveena",
  "Bladee",
  "Riz La Vie",
  "Oliver Malcolm",
  "Contradash",
];
