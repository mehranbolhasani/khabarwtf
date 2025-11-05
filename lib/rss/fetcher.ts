import { RSS_FEEDS } from "./feeds";
import { parseFeed, mapFeedItemToArticle } from "./parser";
import { insertArticle } from "@/lib/db/client";

export async function fetchAllFeeds(): Promise<{
  success: number;
  failed: number;
  total: number;
}> {
  let success = 0;
  let failed = 0;

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`Fetching feed: ${feed.source} (${feed.url})`);
      const items = await parseFeed(feed.url);
      
      let inserted = 0;
      for (const item of items) {
        const article = mapFeedItemToArticle(
          item,
          feed.category,
          feed.source
        );
        const result = await insertArticle({
          title: article.title,
          description: article.description,
          link: article.link,
          category: article.category,
          source: article.source,
          publishedAt: article.publishedAt,
          imageUrl: article.imageUrl || null,
        });
        if (result) {
          inserted++;
        }
      }
      
      console.log(
        `✓ ${feed.source}: ${inserted} new articles from ${items.length} items`
      );
      success++;
    } catch (error) {
      console.error(`✗ Failed to fetch ${feed.source}:`, error);
      failed++;
    }
  }

  return {
    success,
    failed,
    total: RSS_FEEDS.length,
  };
}

