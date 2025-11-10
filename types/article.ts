export interface Article {
  id: string;
  title: string;
  summary: string | null; // Gemini-generated summary
  link: string;
  category: string;
  source: string;
  publishedAt: string; // ISO string for JSON serialization
  imageUrl?: string | null;
}

export interface RSSFeed {
  url: string;
  source: string;
  category: string;
}

export interface CategoryNews {
  category: string;
  articles: Article[];
  lastUpdated: string;
}

