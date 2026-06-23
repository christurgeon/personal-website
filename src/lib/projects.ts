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
    description: "Nurture your relationships with gentle reminders and AI-powered messages shaped by your tone and history together.",
    language: "Swift",
    tags: ["iOS", "SwiftUI", "Relationships"],
    website: "https://usetend.org",
    featured: true,
  },
  {
    name: "Shortlist",
    description: "Quantitative stock pre-screener that scores quality, moat, growth, momentum/value, and insider activity across FMP, Finnhub, SEC EDGAR, and Yahoo into a ranked shortlist for a human deep dive. Config-driven, sector-aware, and free-tier friendly.",
    language: "Python",
    tags: ["CLI", "Finance", "Quant"],
    github: "https://github.com/christurgeon/shortlist",
    sticker: "CLI",
  },
  {
    name: "IronLock",
    description: "Secure file encryption CLI using Argon2id and ChaCha20-Poly1305.",
    language: "Rust",
    tags: ["CLI", "Cryptography", "Security"],
    github: "https://github.com/christurgeon/ironlock",
    sticker: "CLI",
  },
  {
    name: "GrooveFactory",
    description: "An AI-powered MIDI generator for electronic music producers.",
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
    description: "Search Tracks4Africa forums for road and track condition reports by place name.",
    language: "Python",
    tags: ["Scraping", "Travel", "CLI"],
    github: "https://github.com/christurgeon/tracks4africa-forum-scraper",
    sticker: "CLI",
  },
  {
    name: "autobuild",
    description: "Point it at a backlog and walk away. autobuild drains a task list toward a goal by spawning fresh, isolated Claude Code sessions in parallel git worktrees — each one plans, self-reviews, implements, runs your checks, then opens a PR or auto-merges. All state lives in files and git, so a run is disposable and crash-safe.",
    language: "Python",
    tags: ["AI Agents", "Automation", "CLI"],
    github: "https://github.com/christurgeon/autobuild",
    sticker: "TOOL",
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
