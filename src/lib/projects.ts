export interface Project {
  name: string;
  description: string;
  language: string;
  tags: string[];
  github?: string;
  website?: string;
  featured?: boolean;
  sticker?: string;
}

export const projects: Project[] = [
  {
    name: "Tend",
    description:
      "Nurture your relationships with gentle reminders and AI-powered messages shaped by your tone and history together.",
    language: "Swift",
    tags: ["iOS", "SwiftUI", "Relationships"],
    website: "https://usetend.org",
    featured: true,
  },
  {
    name: "IronLock",
    description:
      "Secure file encryption CLI using Argon2id and ChaCha20-Poly1305.",
    language: "Rust",
    tags: ["CLI", "Cryptography", "Security"],
    github: "https://github.com/christurgeon/ironlock",
    sticker: "CLI",
  },
  {
    name: "GrooveFactory",
    description:
      "An AI-powered MIDI generator for electronic music producers.",
    language: "TypeScript",
    tags: ["AI", "Music", "MIDI"],
    github: "https://github.com/christurgeon/groovefactory",
    sticker: "APP",
  },
  {
    name: "RawDog",
    description: "No-nonsense Sony ARW to JPEG converter.",
    language: "Rust",
    tags: ["CLI", "Photography", "Image Processing"],
    github: "https://github.com/christurgeon/rawdog",
    sticker: "CLI",
  },
  {
    name: "Tracks4Africa Forum Scraper",
    description:
      "Search Tracks4Africa forums for road and track condition reports by place name.",
    language: "Python",
    tags: ["Scraping", "Travel", "CLI"],
    github: "https://github.com/christurgeon/tracks4africa-forum-scraper",
    sticker: "CLI",
  },
];

const languageColors: Record<string, string> = {
  Swift: "#F05138",
  Rust: "#DEA584",
  TypeScript: "#3178C6",
  Python: "#3572A5",
};

export function getLanguageColor(language: string): string {
  return languageColors[language] ?? "#6B7280";
}
