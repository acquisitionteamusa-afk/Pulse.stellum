import { Subscription } from "./types";

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [];

export const POPULAR_DIRECTORY = [
  {
    name: "Netflix",
    category: "Streaming",
    cost: 15.49,
    logoColor: "bg-red-500",
    description: "Stream unlimited TV shows, movies, and mobile games.",
    popularAlternatives: ["Tubi (Free)", "Pluto TV (Free)", "Hulu ($7.99/mo)"]
  },
  {
    name: "Disney+",
    category: "Streaming",
    cost: 13.99,
    logoColor: "bg-blue-500",
    description: "The home of Disney, Pixar, Marvel, Star Wars, and National Geographic.",
    popularAlternatives: ["Peacock ($5.99/mo)", "Youtube (Free)"]
  },
  {
    name: "Spotify",
    category: "Music",
    cost: 11.99,
    logoColor: "bg-emerald-500",
    description: "Listen to millions of songs, podcasts, and audiobooks ad-free.",
    popularAlternatives: ["Spotify Free (Ad-supported)", "YouTube Music ($10.99/mo)"]
  },
  {
    name: "YouTube Premium",
    category: "Streaming",
    cost: 13.99,
    logoColor: "bg-red-600",
    description: "Ad-free YouTube, offline access, and YouTube Music.",
    popularAlternatives: ["Brave Browser (Free Ad-Block)", "Standard YouTube (Free)"]
  },
  {
    name: "ChatGPT Plus",
    category: "AI & Tech",
    cost: 20.00,
    logoColor: "bg-teal-600",
    description: "Access GPT-4o, advanced data analysis, and custom GPT models.",
    popularAlternatives: ["Gemini Free (Free)", "Claude Free (Free)"]
  },
  {
    name: "Adobe Lightroom",
    category: "SaaS",
    cost: 9.99,
    logoColor: "bg-sky-600",
    description: "The complete cloud photo service for professional photography.",
    popularAlternatives: ["GIMP (Free)", "Photopea (Free Web editor)"]
  },
  {
    name: "Xbox Game Pass Ultimate",
    category: "Gaming",
    cost: 16.99,
    logoColor: "bg-green-600",
    description: "Hundreds of high-quality games on console, PC, and cloud.",
    popularAlternatives: ["Standard Epic Store Free Games", "Steam Sales"]
  },
  {
    name: "Peloton App One",
    category: "Health & Fitness",
    cost: 12.99,
    logoColor: "bg-neutral-800",
    description: "Access thousands of live and on-demand classes on your phone.",
    popularAlternatives: ["YouTube Workouts (Free)", "Nike Run Club (Free)"]
  }
];

export const CATEGORY_ICONS: Record<string, string> = {
  Streaming: "Clapperboard",
  Music: "Music",
  "AI & Tech": "Cpu",
  SaaS: "Cloud",
  Gaming: "Gamepad2",
  "Health & Fitness": "Dumbbell",
};
