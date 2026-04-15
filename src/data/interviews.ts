export interface QAPair {
  question: string;
  answer: string;
}

export interface Post {
  id: string;
  type: "article" | "interview";
  title: string;
  date: string;
  summary: string;
  body?: string;
  /** Interview-specific fields */
  artistSlug?: string;
  imageUrl?: string;
  intro?: string;
  transcript?: QAPair[];
  videoUrl?: string;
}

export const POSTS: Post[] = [
  {
    id: "mk-gee-interview",
    type: "interview",
    title: "Mk.gee on Cathedrals, Chaos, and the Sound in Between",
    date: "2026-04-13",
    summary:
      "We sat down with Mk.gee ahead of his world tour to talk about Two Star & the Dream Police, growing up in New Jersey, and why he almost quit music.",
    artistSlug: "mk-gee",
    imageUrl: "/images/mkgee-recent.jpg",
    intro:
      "Michael Gordon — better known as Mk.gee — doesn't do interviews often. When he does, he speaks slowly, carefully, like someone who's spent a long time thinking about every word before it leaves his mouth. We caught him backstage in Los Angeles, two weeks before his world tour kicked off.",
    transcript: [
      {
        question:
          "Two Star & the Dream Police feels like a different world from your earlier EPs. Was there a moment where the album clicked into place?",
        answer:
          "Yeah, there was this one night where I was layering guitars and I accidentally left a vocal take running in the background. When I played it back the next morning, the mistake was the best part. That became the ethos of the whole record — let the accidents in.",
      },
      {
        question:
          "You moved from New Jersey to LA at 19. What did you leave behind?",
        answer:
          "Comfort, mostly. In Linwood, I knew every street, every person. LA was the opposite. I didn't know anyone. But I think that loneliness is what made the early music honest. You write differently when there's no one around to perform for.",
      },
      {
        question: "What's next after the tour?",
        answer:
          "I've been producing for a few people I can't talk about yet. And there's a second album that's about 60% done. It sounds nothing like the first one. I'm trying to make something that scares me a little.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "nia-archives-interview",
    type: "interview",
    title: "Nia Archives: Jungle Is a Feeling",
    date: "2026-04-10",
    summary:
      "The 26-year-old producer on mentorship from Goldie, playing Glastonbury, and why jungle music will never die.",
    artistSlug: "nia-archives",
    imageUrl: "/images/nia-early.jpg",
    intro:
      "Nia Archives is sitting cross-legged on a studio couch in East London, surrounded by vinyl crates and half-finished cups of tea. She's just come from a radio session and has another set in four hours. This is a normal Tuesday.",
    transcript: [
      {
        question:
          "You've talked about downloading a bootleg copy of Logic Pro as the start of everything. What was the first thing you made?",
        answer:
          "It was terrible — like, genuinely awful. I was trying to make a drill beat because that's what everyone around me was making. But I kept speeding it up because I liked how it felt faster. And then I realized, oh, this is jungle. I'd been hearing it my whole life at my parents' parties and didn't know what it was called.",
      },
      {
        question: "Goldie became your mentor. What did he teach you?",
        answer:
          "Uncle Golds taught me that jungle isn't just a genre — it's a culture. It has roots in Black British history, in sound system culture, in rebellion. He made me understand that when I make jungle, I'm carrying something forward. That changed how I approach every track.",
      },
      {
        question:
          "Silence Is Loud mixes jungle with Britpop. Were you worried about purists?",
        answer:
          "Honestly? A little. But the whole point of jungle is that it's supposed to evolve. The original producers in the '90s were pulling from everywhere — reggae, hip-hop, rave. I'm just doing the same thing with different ingredients. If it makes you move, it works.",
      },
    ],
  },
  {
    id: "paris-texas-feature",
    type: "article",
    title: "Why Paris Texas Refuse to Be Categorized",
    date: "2026-04-06",
    summary:
      "A deep dive into the LA duo's genre-defying approach — from punk shows in Compton to headlining international tours.",
    body: "Louie Pastel and Felix met at El Camino College in 2013. A decade later, they've released three projects that span hip-hop, noise rock, grunge, punk, metal, and new wave — sometimes within a single track.\n\nTheir name comes from Wim Wenders' 1984 film, a road movie about a man wandering the American Southwest searching for something he can't name. It's a fitting reference. Paris Texas the duo are perpetually in motion, perpetually searching.\n\n\"We don't sit down and say, let's make a rap song or a punk song,\" Louie explained in a 2023 interview. \"We just make what feels right in the moment. If it sounds like nothing else, that's usually a good sign.\"\n\nTheir 2023 album Mid Air was the clearest statement of this philosophy yet — a 12-track collision of sounds that shouldn't work together but somehow do. They debuted it at Brain Dead Studios on Fairfax before the official release, playing cuts for fans who had driven hours to hear it first.\n\nThe international headlining tour that followed took them across North America and Europe. At every stop, the crowd was different — rap fans, punk kids, art school types — but the energy was the same. Paris Texas make music for people who don't fit neatly into one box, because they don't fit into one either.",
  },
  {
    id: "contradash-interview",
    type: "interview",
    title: "Contradash: The Designer Who Became the Artist",
    date: "2026-03-28",
    summary:
      "From making cover art for Tyga to signing with Interscope — how a graphic designer accidentally became a pop star.",
    artistSlug: "contradash",
    imageUrl: "/images/contradash-early.jpg",
    intro:
      "Contradash is showing me his old design portfolio on an iPad. There are album covers for Tyga, Ski Mask the Slump God, Desiigner — all made before he ever recorded a song. He swipes through them with a mix of pride and disbelief, like he's looking at someone else's life.",
    transcript: [
      {
        question:
          "You went from 250 monthly listeners to 250,000 overnight when 'Blocked' hit New Music Friday. What was that day like?",
        answer:
          "Surreal. I woke up and my phone was just — notifications everywhere. Labels calling, managers emailing. I was 20 years old and I'd made one song. One. And suddenly everyone wanted to talk to me. I remember thinking, I need to make sure the second song is just as good, or this is all going to disappear.",
      },
      {
        question:
          "Your sound is very early 2000s pop. That's an unusual reference point for someone who came up around rap.",
        answer:
          "I grew up on *NSYNC, Backstreet Boys, early Justin Timberlake. That's what was on in my house. The rap world was what I worked in, but pop was what I loved. When I finally started making my own music, I stopped trying to be cool and just made what felt natural. And what felt natural was bright, catchy, melodic pop.",
      },
      {
        question: "Does the graphic design background still influence your music?",
        answer:
          "Every day. I think about songs the way I think about layouts — composition, balance, negative space. A good pop song needs breathing room the same way a good poster does. You can't fill every inch with noise. The space between the sounds is what makes it feel intentional.",
      },
    ],
    videoUrl: "https://vimeo.com/123456789",
  },
];
