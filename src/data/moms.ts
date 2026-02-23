export interface Mom {
  id: number;
  name: string;
  neighborhood: string;
  kids: string[];
  interests: string[];
  availability: string[];
  bio: string;
  fullBio: string;
  distance: string;
  verified: boolean;
  liked: boolean;
  avatar: string;
  avatarColor: string;
  memberSince: string;
  playdatesHosted: number;
  connectionsCount: number;
  languages: string[];
  preferredSpots: string[];
  icebreakers: string[];
}

export const MOMS: Mom[] = [
  {
    id: 1,
    name: "Jessica M.",
    neighborhood: "Riverside Park",
    kids: ["3 yrs", "5 yrs"],
    interests: ["Outdoor play", "Arts & Crafts", "Montessori", "Nature walks", "Picnics"],
    availability: ["Weekday mornings", "Saturday afternoons", "Sunday mornings"],
    bio: "Coffee-fueled mama of two who loves hiking trails and spontaneous park days. Looking for moms who don't mind a little mud!",
    fullBio:
      "Hi! I'm Jessica — a stay-at-home mom of two energetic kiddos (Lily, 5, and Max, 3). We moved to Riverside Park two years ago and I've been looking for a real community ever since. We're big on outdoor adventures, sensory play, and creative projects. On any given weekday morning you'll find us at the park with snacks, sidewalk chalk, and probably some muddy boots. I believe in slow mornings, spontaneous picnics, and honest friendships. If that sounds like you, let's connect!",
    distance: "0.4 mi",
    verified: true,
    liked: false,
    avatar: "JM",
    avatarColor: "hsl(142 38% 40%)",
    memberSince: "Jan 2025",
    playdatesHosted: 12,
    connectionsCount: 8,
    languages: ["English"],
    preferredSpots: ["Riverside Park", "Oakwood Playground", "Community Garden"],
    icebreakers: [
      "What's your kids' favorite outdoor game right now?",
      "Coffee date at the park this week?",
      "Our kids are close in age — want to set up a playdate?",
    ],
  },
];

// "Your" profile interests — used to highlight shared interests
export const MY_INTERESTS = ["Outdoor play", "Arts & Crafts", "Nature walks", "Books & Storytime", "Sensory play"];

export const INTEREST_ICONS: Record<string, string> = {
  "Outdoor play": "🛝",
  "Arts & Crafts": "🎨",
  "Montessori": "📚",
  "Nature walks": "🌿",
  "Picnics": "🧺",
  "Sensory play": "🫧",
  "Music & Dance": "🎵",
  "Books & Storytime": "📖",
  "Sports & Active play": "⚽",
  "Cooking together": "🍳",
  "Book clubs": "📚",
  "Hiking": "🥾",
  "Team sports": "🏅",
  "Yoga & Wellness": "🧘",
  "Bilingual": "🌐",
  "Mindfulness": "🌸",
  "Science & STEM": "🔬",
  "Art projects": "🖌️",
  "Museums": "🏛️",
  "Water play": "💧",
};

export const AVAILABILITY_ICONS: Record<string, string> = {
  "Weekday mornings": "☀️",
  "Saturday afternoons": "🌤️",
  "Sunday mornings": "🌅",
  "Weekday afternoons": "🌤️",
  "Holiday mornings": "🎉",
  "Weekend mornings": "🌅",
  "Friday afternoons": "🎊",
  "Thursday evenings": "🌙",
  "Morning walks": "☀️",
  "Saturday mornings": "🌤️",
  "After school (3–5pm)": "🏫",
  "Sunday afternoons": "🌤️",
  "Weekends": "🌈",
  "Wednesday afternoons": "🌤️",
};
