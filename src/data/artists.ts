export interface TimelineArtist {
  id: string;
  name: string;
  meta: string;
  photos: [string, string];
  photoLabels: [string, string];
  cardNumber: string;
  cardTag: string;
  cardTitle: string;
  cardBody: string;
  timeline: { year: string; title: string; body: string }[];
}

export const ARTISTS: TimelineArtist[] = [
  {
    id: "mkgee",
    name: "Mk.gee",
    meta: "Los Angeles \u00b7 Alt-R&B \u00b7 b. 1998",
    photos: ["/images/mkgee-early.jpg", "/images/mkgee-recent.jpg"],
    photoLabels: ["New Jersey \u00b7 Early Days", "Los Angeles \u00b7 2024"],
    cardNumber: "01",
    cardTag: "Discovery",
    cardTitle: "Mk.gee Is Building Cathedrals",
    cardBody: "A deep dive into the sonic architecture of one of indie\u2019s most meticulous producers \u2014 layering feedback, tape hiss, and devotion into something transcendent.",
    timeline: [
      { year: "1998", title: "Jersey Suburbs, Quiet Kid", body: "Grew up in suburban New Jersey in a Lebanese-American household. His father played oud and classic Arabic pop around the house. He was a quiet kid who spent most of his time alone in his room, drawing and listening to music on an iPod he wasn\u2019t supposed to have yet." },
      { year: "2012", title: "Guitar First. Then Obsession.", body: "Got his first guitar at fourteen and taught himself entirely by ear. No lessons, no tabs \u2014 just slowing songs down and figuring them out alone. Within a year he was recording straight into GarageBand on a family MacBook, layering guitars over drum loops at 1am." },
      { year: "2017", title: "Berklee, Then Gone.", body: "Enrolled at Berklee College of Music in Boston but left within a year. The structure didn\u2019t fit what he was hearing in his head. Moved to Los Angeles with almost nothing and started building a studio setup in a rented room in Silver Lake." },
      { year: "2020", title: "Two EP Drops. Silence.", body: "Released two self-produced EPs quietly with no label, no PR, no rollout. A few thousand plays. Some blog pickups. He kept making music anyway, refining a guitar tone that sounded like nothing else \u2014 wet, spectral, distinctly his own." },
      { year: "2023", title: "Internet Finds Him.", body: "A single clip of him performing live circulates on music Twitter and Reddit overnight. Tens of thousands of shares in 48 hours. Suddenly everyone is asking who he is. Labels reach out within the week. He takes his time responding." },
      { year: "Now", title: "Ascent. On His Terms.", body: "Critically acclaimed debut. Tours selling out. Production credits stacking up with artists he admired growing up. Still records everything himself first. Still sounds like no one else." },
    ],
  },
  {
    id: "nia-archives",
    name: "Nia Archives",
    meta: "London \u00b7 Jungle \u00b7 b. 2000",
    photos: ["/images/nia-early.jpg", "/images/nia-recent.jpg"],
    photoLabels: ["Tottenham, UK \u00b7 Early Days", "East London \u00b7 2024"],
    cardNumber: "02",
    cardTag: "Profile",
    cardTitle: "Nia Archives and the New London Sound",
    cardBody: "From jungle to jazz, Nia Archives is rewriting the rules of UK dance music with a fearless, genre-defying approach that honors the past while sprinting forward.",
    timeline: [
      { year: "2000", title: "Gospel, Funk, Law School", body: "Her mother played gospel every Sunday without fail. Her father kept crates of West African funk stacked against the living room wall. She absorbed all of it without knowing why. The plan back then was law school. Music was not even part of the conversation." },
      { year: "2014", title: "One Tape. Everything Shifts.", body: "Fourteen years old on a drive back from a family thing. A cousin plays a 90s jungle mixtape through blown car speakers and something cracks open. She finds Goldie\u2019s Timeless at a car boot sale for fifty pence. She still has it." },
      { year: "2017", title: "Retail Days. Secret Nights.", body: "College during the week. Primark in Wood Green on weekends. She saves enough for a secondhand laptop, downloads a cracked Ableton, and figures it out entirely alone after her parents fall asleep. No tutorials. Nobody to ask. Nobody in her life even knows she is doing it." },
      { year: "2020", title: "Lockdown. Fake Name. Strangers.", body: "COVID locks London down and she has nothing but time and a laptop. Posts her first track under a name that is not hers. Two hundred plays in week one from people she has never met. She emails a blogger and gets ignored. Emails again. Posts another track anyway." },
      { year: "2022", title: "80 People. 400K Views.", body: "East London warehouse, maybe eighty people in person \u2014 sweaty, close, true believers. Someone films it. By morning four hundred thousand people have watched. Managers, labels, journalists and fans all arrive at once. Her phone is unusable for three straight days." },
      { year: "Now", title: "Signed. Touring. Still Creating.", body: "Label deals, world stages, festival slots. The whole machine kicked in fast and loud. She still makes music alone at night when the world goes quiet. Still has the Goldie record. Some things do not change when they were never about the deal in the first place." },
    ],
  },
  {
    id: "paris-texas",
    name: "Paris Texas",
    meta: "Los Angeles \u00b7 Alt-Rap \u00b7 Est. 2020",
    photos: ["/images/paristexas-early.jpg", "/images/paristexas-recent.jpg"],
    photoLabels: ["Compton, CA \u00b7 Early Days", "Los Angeles \u00b7 2024"],
    cardNumber: "03",
    cardTag: "Mix",
    cardTitle: "90 Minutes with Paris Texas",
    cardBody: "An exclusive mixtape session blending hip-hop, noise rock, and internet-age absurdism \u2014 a snapshot of two artists who refuse to be categorized.",
    timeline: [
      { year: "2000s", title: "Compton Raised. Separately.", body: "Boylan and Houston grew up in Compton but didn\u2019t know each other. Both were deep into music from early \u2014 one through church choir, one through his older brother\u2019s rap tapes. Their paths crossed years later through a mutual friend at a house party in 2019." },
      { year: "2019", title: "One Session. Everything Clicks.", body: "First studio session together runs six hours. They record four songs in one night. Neither of them had ever made something that felt that effortless with anyone else. They don\u2019t talk about it much afterward \u2014 they just keep showing up." },
      { year: "2020", title: "Dropped Online. No Context.", body: "Posted their first project with no bio, no photos, no social media presence. Just music and a name. Music blogs scrambled to figure out who they were. The mystery made people listen harder." },
      { year: "2022", title: "Coachella. Then Quiet Again.", body: "Booked for Coachella before most people had heard of them. Played to a packed tent. Walked off stage and went dark for six months. No posts, no interviews. Let the set speak." },
      { year: "Now", title: "Built Different. Staying That Way.", body: "One of the most talked-about acts in independent rap without ever chasing the spotlight. Debut album landed on dozens of year-end lists. They still answer to no one." },
    ],
  },
  {
    id: "riz-la-vie",
    name: "Riz La Vie",
    meta: "New York \u00b7 Alt-R&B \u00b7 b. 1997",
    photos: ["/images/rizlavie-early.jpg", "/images/rizlavie-recent.jpg"],
    photoLabels: ["Brooklyn, NY \u00b7 Early Days", "New York \u00b7 2024"],
    cardNumber: "04",
    cardTag: "Discovery",
    cardTitle: "Riz La Vie and the Art of the Slow Burn",
    cardBody: "From a Brooklyn bedroom to festival stages \u2014 how a Haitian-American kid with a guitar turned quiet vulnerability into one of indie R&B\u2019s most honest voices.",
    timeline: [
      { year: "1997", title: "Brooklyn. Two Languages.", body: "Born in Brooklyn to Haitian immigrant parents. Grew up speaking Creole at home and English everywhere else. His mother worked double shifts. Music was the radio in the kitchen and hymns at the Haitian church on Sundays. Nobody in the family played an instrument." },
      { year: "2013", title: "A Guitar from Craigslist.", body: "Bought a beat-up acoustic guitar off Craigslist for forty dollars at sixteen. Learned three chords from YouTube and wrote his first song the same week. It was terrible. He wrote another one the next day. Then another. He filled a notebook in two months." },
      { year: "2017", title: "SoundCloud. Real Name. No Safety Net.", body: "Started uploading songs to SoundCloud under his own name while studying at Baruch College. No alias, no distance. Raw vocals over minimal guitar. A few hundred plays here and there. Enough to know strangers were actually listening." },
      { year: "2019", title: "Napkins Goes Everywhere.", body: "\u201CNapkins\u201D drops and spreads through word of mouth and playlist adds. Millions of streams without a label, a manager, or a single paid promotion. People tattoo the lyrics. He finds out about some of them through Instagram DMs from strangers." },
      { year: "2021", title: "Albums. On His Clock.", body: "Releases his debut project independently. No rollout timeline dictated by anyone else. Records in his apartment, mixes with a friend, releases when it feels done. Critics call it one of the most honest R&B records of the year. He doesn\u2019t do press." },
      { year: "Now", title: "Still Independent. Still Writing.", body: "Multiple projects deep. Touring on his own terms. Still writes on the same Craigslist guitar \u2014 re-strung dozens of times but never replaced. Turned down two major label deals. Says the music has to stay his or it stops being real." },
    ],
  },
  {
    id: "oliver-malcolm",
    name: "Oliver Malcolm",
    meta: "London / LA \u00b7 Alt-Rock \u00b7 b. 2001",
    photos: ["/images/olivermalcolm-early.jpg", "/images/olivermalcolm-recent.jpg"],
    photoLabels: ["Essex, UK \u00b7 Early Days", "Los Angeles \u00b7 2024"],
    cardNumber: "05",
    cardTag: "Profile",
    cardTitle: "Oliver Malcolm Won\u2019t Pick a Lane",
    cardBody: "A British-Nigerian kid from Essex who makes punk, R&B, and electronic music \u2014 sometimes in the same song. Genre is a suggestion he keeps ignoring.",
    timeline: [
      { year: "2001", title: "Essex. Between Two Worlds.", body: "Born in Essex to a Nigerian father and English mother. Grew up code-switching between two cultures, two accents, two sets of expectations. His dad played Fela Kuti records on Saturday mornings. His mates at school were into Arctic Monkeys. He loved both and felt like neither." },
      { year: "2015", title: "Garage Band. Literal Garage.", body: "Started making music at fourteen in his parents\u2019 garage with a secondhand mic and a cracked copy of FL Studio. Recorded punk songs, then R&B songs, then songs that were both at once. His friends thought he was joking. He wasn\u2019t." },
      { year: "2018", title: "Uploaded Everything. Waited.", body: "Put every song he had on SoundCloud and Spotify. Dozens of tracks, no filter. Some were rough. Some were brilliant. A few blog writers noticed the brilliant ones. He was seventeen and already had a sound that adults couldn\u2019t categorize." },
      { year: "2020", title: "Runaway Breaks Through.", body: "\u201CRunaway\u201D drops and the internet picks it up fast. The energy is undeniable \u2014 distorted guitars, pitched vocals, chaos that somehow grooves. Labels call. He signs with Because Music and moves to Los Angeles before he can legally drink in either country." },
      { year: "2022", title: "LA. New Chaos.", body: "Recording in real studios for the first time. Collaborating with producers who\u2019ve worked with artists he grew up listening to. He keeps pushing the sound weirder instead of more commercial. The label lets him. The fans follow." },
      { year: "Now", title: "No Genre. No Apology.", body: "Two projects deep with a third on the way. Every release sounds different from the last. He calls it \u201Cgenre fluid\u201D and means it. Plays punk shows and R&B showcases in the same week. The only constant is that nothing stays the same." },
    ],
  },
  {
    id: "contradash",
    name: "Contradash",
    meta: "Atlanta \u00b7 Experimental Rap \u00b7 b. 1999",
    photos: ["/images/contradash-early.jpg", "/images/contradash-recent.jpg"],
    photoLabels: ["Atlanta, GA \u00b7 Early Days", "Atlanta \u00b7 2024"],
    cardNumber: "06",
    cardTag: "Discovery",
    cardTitle: "Contradash Is the Future You Weren\u2019t Ready For",
    cardBody: "Atlanta\u2019s most unpredictable voice \u2014 merging trap bones with art-school ambition and a delivery that shifts shape mid-sentence.",
    timeline: [
      { year: "1999", title: "South Side. Church and Chaos.", body: "Grew up on the south side of Atlanta. Sang in the church choir every Sunday but spent the rest of the week absorbing everything else \u2014 trap from the car stereos on his block, punk from an older cousin\u2019s burned CDs, jazz from a teacher who noticed he had an ear." },
      { year: "2015", title: "Freestyles in the Parking Lot.", body: "Started rapping at sixteen \u2014 freestyles in school parking lots, then over beats pulled from YouTube. His delivery was different from the start. Unpredictable cadences, words that bent in strange directions. People didn\u2019t always get it. He didn\u2019t slow down for them." },
      { year: "2018", title: "First Tape. Fifty Copies.", body: "Recorded his first mixtape on a laptop borrowed from a friend. Burned fifty physical copies and handed them out at local shows. Most ended up in car gloveboxes and forgotten. A few ended up with the right people. One local DJ started spinning a track from it." },
      { year: "2021", title: "Online. Unfiltered.", body: "Started posting raw recordings and visual experiments on social media. No polish, no strategy \u2014 just fragments of whatever he was working on that day. The rawness attracted a niche following who treated each post like a dispatch from somewhere they couldn\u2019t visit." },
      { year: "2023", title: "The Tape That Traveled.", body: "Released a project that got passed around through group chats and music forums. No playlist push, no PR team. Just people sending links to other people saying \u201Cyou need to hear this.\u201D Blog coverage followed. Then a few festival bookings. Then more." },
      { year: "Now", title: "Underground by Design.", body: "Building a following without ever chasing one. Every release is a left turn from the last. He produces most of his own beats, directs his own visuals, and answers to nobody. The mainstream keeps glancing over. He keeps looking the other way." },
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
