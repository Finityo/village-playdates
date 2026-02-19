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
  {
    id: 2,
    name: "Amara K.",
    neighborhood: "Sunfield District",
    kids: ["2 yrs"],
    interests: ["Nature walks", "Sensory play", "Music & Dance", "Outdoor play", "Books & Storytime"],
    availability: ["Weekday afternoons", "Sunday mornings", "Holiday mornings"],
    bio: "New in town with my adventurous toddler. Seeking a village of kindred spirits — let's build one together!",
    fullBio:
      "Hello! I'm Amara, and I recently relocated to Sunfield with my husband and our wild little girl, Zara (2). Being new to the area is hard, especially with a toddler — I'm really looking to build genuine friendships here. Zara is obsessed with anything sensory: sand, water, leaves, you name it. I love long nature walks with coffee in hand, spontaneous dance parties at home, and bedtime stories. I'm warm, open-minded, and always down for a good laugh. Let's be each other's village!",
    distance: "0.9 mi",
    verified: true,
    liked: false,
    avatar: "AK",
    avatarColor: "hsl(12 82% 65%)",
    memberSince: "Feb 2025",
    playdatesHosted: 3,
    connectionsCount: 4,
    languages: ["English", "French"],
    preferredSpots: ["Sunfield Common", "City Library Lawn", "Maplewood Tot Lot"],
    icebreakers: [
      "I'm new here — would love to explore the neighborhood together!",
      "Our toddlers could have such a fun sensory playdate!",
      "Know any good nature spots for little ones?",
    ],
  },
  {
    id: 3,
    name: "Sofia R.",
    neighborhood: "Maplewood Heights",
    kids: ["4 yrs", "7 yrs"],
    interests: ["Sports & Active play", "Cooking together", "Book clubs", "Hiking", "Team sports"],
    availability: ["Weekend mornings", "Friday afternoons", "Thursday evenings"],
    bio: "Sports mom raising future athletes (and future chefs 😄). Always planning the next playdate at the big park!",
    fullBio:
      "Hey there! I'm Sofia, mom to Mateo (7) and Isabella (4). We are a full-on sports family — soccer, swimming, bike rides, you name it. Mateo is on a community soccer team and Isabella is learning to ride her balance bike like a champ. I also love cooking with the kids on rainy days (messy but worth it!). I'm looking for active families who enjoy outdoor adventures and don't mind getting a little sweaty. I'm super organized, love planning group playdates, and I make a mean batch of trail mix. Let's hit the park!",
    distance: "1.2 mi",
    verified: false,
    liked: false,
    avatar: "SR",
    avatarColor: "hsl(204 80% 62%)",
    memberSince: "Dec 2024",
    playdatesHosted: 7,
    connectionsCount: 11,
    languages: ["English", "Spanish"],
    preferredSpots: ["Maplewood Sports Park", "Heritage Trail", "Greenfield Pool"],
    icebreakers: [
      "Want to join our Saturday morning park group?",
      "Our kids could kick a ball around together!",
      "Would your family be up for a group hike?",
    ],
  },
  {
    id: 4,
    name: "Priya T.",
    neighborhood: "Cedarwood Commons",
    kids: ["1 yr", "3 yrs"],
    interests: ["Yoga & Wellness", "Outdoor play", "Bilingual", "Mindfulness", "Sensory play"],
    availability: ["Morning walks", "Weekday afternoons", "Saturday mornings"],
    bio: "Mindful mama raising bilingual kiddos. Love slow mornings at the park and spontaneous picnics!",
    fullBio:
      "Namaste! I'm Priya, mama to Rohan (3) and baby Anaya (1). We're a bilingual household (English & Hindi) and we love incorporating mindfulness into our everyday play. I'm a former yoga instructor who now chases two little tornadoes around the park — it's basically the same workout! I'm drawn to calm, intentional parenting communities and love connecting with moms who value wellness alongside adventure. We love morning walks, sensory bins, and ending the day with a good story. If you're a fellow mindful mama, let's connect!",
    distance: "1.8 mi",
    verified: true,
    liked: false,
    avatar: "PT",
    avatarColor: "hsl(42 90% 60%)",
    memberSince: "Nov 2024",
    playdatesHosted: 9,
    connectionsCount: 6,
    languages: ["English", "Hindi"],
    preferredSpots: ["Cedarwood Green", "Lotus Park", "Community Wellness Center"],
    icebreakers: [
      "Want to join our morning walk + coffee group?",
      "Our bilingual kiddos might love playing together!",
      "Do you have a favorite calm park spot for little ones?",
    ],
  },
  {
    id: 5,
    name: "Lauren B.",
    neighborhood: "Green Valley",
    kids: ["6 yrs"],
    interests: ["Science & STEM", "Hiking", "Art projects", "Nature walks", "Museums"],
    availability: ["After school (3–5pm)", "Saturday mornings", "Sunday afternoons"],
    bio: "Science-enthusiast mom who turns every park trip into a nature discovery mission. Snacks always included.",
    fullBio:
      "Hi! I'm Lauren, mom to Ellie (6), my little scientist. We are obsessed with bug hunting, leaf identification, cloud watching, and turning our kitchen into a science lab on weekends. Ellie loves art projects, building things, and asking 'why?' about literally everything (I love it). I work part-time from home and try to make our after-school hours as exploratory as possible. I'm looking for curious, creative families who love learning through play. Bonus points if your kiddo likes museums and doesn't mind getting their hands dirty!",
    distance: "2.1 mi",
    verified: true,
    liked: false,
    avatar: "LB",
    avatarColor: "hsl(133 45% 50%)",
    memberSince: "Oct 2024",
    playdatesHosted: 5,
    connectionsCount: 9,
    languages: ["English"],
    preferredSpots: ["Nature Discovery Park", "Children's Museum", "Green Valley Trails"],
    icebreakers: [
      "Want to do a nature scavenger hunt together?",
      "Our kids could do a mini science experiment playdate!",
      "Do you ever visit the children's museum?",
    ],
  },
  {
    id: 6,
    name: "Maya O.",
    neighborhood: "Harbor View",
    kids: ["2 yrs", "4 yrs"],
    interests: ["Water play", "Arts & Crafts", "Outdoor play", "Music & Dance", "Cooking together"],
    availability: ["Weekends", "Holiday mornings", "Wednesday afternoons"],
    bio: "Water baby mom! We're always finding puddles to jump in and parks to explore. Join our little crew!",
    fullBio:
      "Hey! I'm Maya, mama to Noah (4) and baby Chloe (2). We are water babies through and through — splash pads, puddle jumping, water tables, you name it. Noah is a social butterfly who loves making new friends, and Chloe is just discovering the world with wide eyes. I'm a creative at heart — I love setting up art invitations, baking with the kids, and impromptu dance parties in the living room. Our play style is joyful, messy, and full of laughter. We're looking for other families who love the same kind of playful chaos!",
    distance: "2.4 mi",
    verified: false,
    liked: false,
    avatar: "MO",
    avatarColor: "hsl(204 65% 55%)",
    memberSince: "Mar 2025",
    playdatesHosted: 2,
    connectionsCount: 3,
    languages: ["English"],
    preferredSpots: ["Harbor Splash Pad", "Bayfront Park", "Creative Kids Studio"],
    icebreakers: [
      "Splash pad playdate this week?",
      "Our kids are close in age — would love to meet up!",
      "Want to do an art + snacks afternoon together?",
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
