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

  introTitle: "IMAGINE receiving this\non Raksha Bandhan 🥹❤️",
  introSubtitle: "For the most special Akka...",
  introButton: "OPEN YOUR SURPRISE ✨",

  characterGreeting: "Heyyy Akka! I made something\nspecial for you! ❤️",
  characterQuestion: "Do you wanna see it?",
  noReactions: [
    "Akka, are you REALLY sure? 🥺",
    "Akka come on please!! 😭",
    "Aiyoo Akka! The button is getting too big!! 💣",
    "BOOM! 💥 Thambi won! You have to see this! 😌❤️",
  ],

  letterHeader: "To My Forever Best Akka ❤️",
  letter: `Dear Akka,

I don't always say it,
but I'm genuinely grateful to have you in my life.

You've been my biggest supporter,
my secret keeper,
my partner in all the random nonsense,
and one of the most important people in my life.

From endless talks to silly fights,
from laughing at absolutely nothing
to annoying each other for no reason...

Life feels brighter because you're in it.

No matter how much we grow,
you'll always be my Akka,
my best friend,
and my favorite person.

Happy Raksha Bandhan Akka ❤️

Always stay happy.
Always keep smiling.`,
  letterSignature: "With lots of love,\nYour Thambi ❤️",

  memoriesTitle: "MEMORIES ❤️",
  memoriesSubtitle: "A few moments I'll always keep close.",

  memories: [
    {
      image: getAssetPath("assets/sister/photo1.jpg"),
      caption: "Partners in crime ❤️",
      alt: "Memory photo 1 with Akka",
      rotation: -4,
      shinchanAnimation: "peek",
    },
    {
      image: getAssetPath("assets/sister/photo2.jpg"),
      caption: "That one crazy day 😂",
      alt: "Memory photo 2 with Akka",
      rotation: 3,
      shinchanAnimation: "walk",
    },
    {
      image: getAssetPath("assets/sister/photo3.jpg"),
      caption: "Forever memories 💕",
      alt: "Memory photo 3 with Akka",
      rotation: -2,
      shinchanAnimation: "happy",
    },
    {
      image: getAssetPath("assets/sister/photo4.jpg"),
      caption: "Best moments 🌟",
      alt: "Memory photo 4 with Akka",
      rotation: 5,
      shinchanAnimation: "gift",
    },
    {
      image: getAssetPath("assets/sister/photo5.jpg"),
      caption: "Us being us 😜",
      alt: "Memory photo 5 with Akka",
      rotation: -3,
      shinchanAnimation: "cry",
    },
    {
      image: getAssetPath("assets/sister/photo6.jpg"),
      caption: "Always together 🤗",
      alt: "Memory photo 6 with Akka",
      rotation: 2,
      shinchanAnimation: "jump",
    },
  ],

  awardTitle: "BEST AKKA AWARD 🏆",
  awardPresentation: "This award is proudly presented to",
  awardQualities: [
    "Being annoying (lovingly)",
    "Being incredibly caring",
    "Being the best supporter",
    "Being hilariously funny",
    "Being absolutely irreplaceable",
  ],
  awardRating: "∞ / 10",

  finalTitle: "Happy Raksha Bandhan Akka ❤️",
  finalMessage: `No matter where life takes us,
you'll always have a special place
in my heart.`,
  finalSignoff: "Love you always Akka — Your Thambi ❤️",
};

export default cardData;
