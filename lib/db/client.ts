import { sql } from "@vercel/postgres";
import type { ArticleRow } from "./schema";

export async function initializeDatabase() {
  try {
    // Create articles table
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        link TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        source TEXT NOT NULL,
        published_at TIMESTAMP NOT NULL,
        fetched_at TIMESTAMP NOT NULL DEFAULT NOW(),
        image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    // Create index on link for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_articles_link ON articles(link)
    `;

    // Create index on category for filtering
    await sql`
      CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category)
    `;

    // Create index on published_at for sorting
    await sql`
      CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC)
    `;

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

export async function insertArticle(article: {
  title: string;
  description: string | null;
  link: string;
  category: string;
  source: string;
  publishedAt: Date;
  imageUrl?: string | null;
}): Promise<boolean> {
  try {
    await sql`
      INSERT INTO articles (title, description, link, category, source, published_at, image_url)
      VALUES (${article.title}, ${article.description}, ${article.link}, ${article.category}, ${article.source}, ${article.publishedAt}, ${article.imageUrl})
      ON CONFLICT (link) DO NOTHING
    `;
    return true;
  } catch (error) {
    console.error("Error inserting article:", error);
    return false;
  }
}

export async function getArticles(options: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<ArticleRow[]> {
  try {
    const limit = options.limit || 50;
    const offset = options.offset || 0;

    if (options.category) {
      const result = await sql`
        SELECT * FROM articles
        WHERE category = ${options.category}
        ORDER BY published_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
      return result.rows as ArticleRow[];
    } else {
      const result = await sql`
        SELECT * FROM articles
        ORDER BY published_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
      return result.rows as ArticleRow[];
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getArticleCount(category?: string): Promise<number> {
  try {
    let result;
    if (category) {
      result = await sql`
        SELECT COUNT(*) as count FROM articles WHERE category = ${category}
      `;
    } else {
      result = await sql`
        SELECT COUNT(*) as count FROM articles
      `;
    }
    return parseInt(result.rows[0]?.count || "0", 10);
  } catch (error) {
    console.error("Error getting article count:", error);
    return 0;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const result = await sql`
      SELECT DISTINCT category FROM articles ORDER BY category
    `;
    return result.rows.map((row) => row.category as string);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

