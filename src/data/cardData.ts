import { getAssetPath } from "../utils/assets";

export type Scene =
  | "intro"
  | "character"
  | "question"
  | "letter"
  | "memories"
  | "award"
  | "final";

export interface MemoryItem {
  image: string;
  caption: string;
  alt: string;
  rotation: number;
  shinchanAnimation?: string;
}

export interface CardDataType {
  sisterName: string;
  browserTitle: string;
  browserUrl: string;
  introTitle: string;
  introSubtitle: string;
  introButton: string;
  characterGreeting: string;
  characterQuestion: string;
  noReactions: string[];
  letterHeader: string;
  letter: string;
  letterSignature: string;
  memoriesTitle: string;
  memoriesSubtitle: string;
  memories: MemoryItem[];
  awardTitle: string;
  awardPresentation: string;
  awardQualities: string[];
  awardRating: string;
  finalTitle: string;
  finalMessage: string;
  finalSignoff: string;
}

const cardData: CardDataType = {
  sisterName: "Akka",

  browserTitle: "Thambi's Secret Gift 💝",
  browserUrl: "special-surprise.local",

  introTitle: "என் அன்பு அக்காவுக்கு...\nஒரு இனிய சர்ப்ரைஸ் 🥹❤️",
  introSubtitle: "A Lovely Raksha Bandhan Surprise For My Dear Akka ✨",
  introButton: "SURPRISE-ஐ திறக்க இங்கே கிளிக் செய்யவும் ✨",

  characterGreeting: "Heyyy Akka! I made something\nspecial for you! ❤️",
  characterQuestion: "Do you wanna see it?",
  noReactions: [
    "Akka, are you REALLY sure? 🥺",
    "Akka come on please!! 😭",
    "Aiyoo Akka! The button is getting too big!! 💣",
    "BOOM! 💥 Thambi won! You have to see this! 😌❤️",
  ],

  letterHeader: "To My Lovely Sweet Akka ❤️",
  letter: `To the best sister and my everything,

Happy Raksha Bandhan to my lovely, sweet Akka! ❤️

I may not always say it out loud,
but you are truly the greatest gift in my life.
My world is complete and full of happiness
just having you by my side.

You've been my biggest supporter,
my secret keeper, my guide,
and my favorite person in the whole universe.

I hope and pray from the bottom of my heart
that we will be brother and sister forever...
And even in every birth to come (ஏழு ஜென்மத்துக்கும்),
I only wish and pray that YOU are my Akka.

No matter where life takes us,
you'll always have the most special place in my heart.

Happy Raksha Bandhan Akka! 🪢✨
Always stay happy and keep smiling!`,
  letterSignature: "With endless love & affection,\nYour Thambi ❤️",

  memoriesTitle: "MEMORIES ❤️",
  memoriesSubtitle: "A few moments I'll always keep close.",

  memories: [
    {
      image: getAssetPath("assets/sister/photo1.jpeg"),
      caption: "Partners in crime ❤️",
      alt: "Memory photo 1 with Akka",
      rotation: -4,
      shinchanAnimation: "peek",
    },
    {
      image: getAssetPath("assets/sister/photo2.jpeg"),
      caption: "That one crazy day 😂",
      alt: "Memory photo 2 with Akka",
      rotation: 3,
      shinchanAnimation: "walk",
    },
    {
      image: getAssetPath("assets/sister/photo3.jpeg"),
      caption: "Forever memories 💕",
      alt: "Memory photo 3 with Akka",
      rotation: -2,
      shinchanAnimation: "happy",
    },
    {
      image: getAssetPath("assets/sister/photo4.jpeg"),
      caption: "Best moments 🌟",
      alt: "Memory photo 4 with Akka",
      rotation: 5,
      shinchanAnimation: "gift",
    },
    {
      image: getAssetPath("assets/sister/photo5.jpeg"),
      caption: "Us being us 😜",
      alt: "Memory photo 5 with Akka",
      rotation: -3,
      shinchanAnimation: "cry",
    },
    {
      image: getAssetPath("assets/sister/photo6.jpeg"),
      caption: "Always together 🤗",
      alt: "Memory photo 6 with Akka",
      rotation: 2,
      shinchanAnimation: "jump",
    },
  ],

  awardTitle: "BEST AKKA AWARD 🏆",
  awardPresentation: "This award is proudly presented to",
  awardQualities: [
    "Being the sweetest sister ever",
    "Always caring & supporting me",
    "Being my forever secret keeper",
    "Being hilariously funny & loving",
    "Being absolutely irreplaceable in my life",
  ],
  awardRating: "∞ / 10",

  finalTitle: "Happy Raksha Bandhan Akka ❤️",
  finalMessage: `Even in the afterbirth,
I wish and pray you are always my Akka.
Love you to the moon and back!`,
  finalSignoff: "Love you always Akka — Your Thambi ❤️",
};

export default cardData;
