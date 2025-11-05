export interface Article {
  id: string;
  title: string;
  description: string | null;
  link: string;
  category: string;
  source: string;
  publishedAt: Date;
  fetchedAt: Date;
  imageUrl?: string | null;
}

export interface RSSFeed {
  url: string;
  source: string;
  category: string;
}

