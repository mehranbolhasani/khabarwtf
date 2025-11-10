import type { RSSFeed } from "@/types/article";

// Category definitions
export const CATEGORIES = {
  world: "جهان",
  politics: "سیاست",
  tech: "فناوری",
  sport: "ورزش",
  science: "علم",
  economy: "اقتصاد",
  culture: "فرهنگ",
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

// Major Farsi news RSS feeds with proper categorization
export const RSS_FEEDS: RSSFeed[] = [
  // World News
  {
    url: "https://www.bbc.com/persian/index.xml",
    source: "BBC Persian",
    category: CATEGORIES.world,
  },
  {
    url: "https://www.radiofarda.com/rss.xml",
    source: "Radio Farda",
    category: CATEGORIES.world,
  },
  {
    url: "https://www.iranintl.com/fa/rss",
    source: "Iran International",
    category: CATEGORIES.world,
  },
  {
    url: "https://www.dw.com/fa-ir/rss.xml",
    source: "DW Persian",
    category: CATEGORIES.world,
  },
  {
    url: "https://www.voanews.com/persian/rss.xml",
    source: "VOA Persian",
    category: CATEGORIES.world,
  },
  // Add more feeds with specific categories as needed
  // Example:
  // {
  //   url: "https://example.com/tech/rss.xml",
  //   source: "Tech News",
  //   category: CATEGORIES.tech,
  // },
];

// Helper function to get all unique categories from feeds
export function getCategoriesFromFeeds(): string[] {
  return Array.from(new Set(RSS_FEEDS.map((feed) => feed.category)));
}

// Map Persian category name to English key
export function getCategoryKey(persianCategory: string): string | null {
  for (const [key, value] of Object.entries(CATEGORIES)) {
    if (value === persianCategory) {
      return key;
    }
  }
  return null;
}
