// Database schema definitions
// This file defines the structure of our database tables

export interface ArticleRow {
  id: string;
  title: string;
  description: string | null;
  link: string;
  category: string;
  source: string;
  published_at: Date;
  fetched_at: Date;
  image_url: string | null;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
}

