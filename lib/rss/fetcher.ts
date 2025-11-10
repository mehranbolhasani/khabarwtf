import { RSS_FEEDS, getCategoryKey } from "./feeds";
import { parseFeed, mapFeedItemToArticle } from "./parser";
import { summarizeArticle } from "@/lib/ai/summarizer";
import { writeAllCategories } from "@/lib/cache/writer";
import type { Article, CategoryNews } from "@/types/article";
import { randomUUID } from "crypto";

export async function fetchAllFeeds(): Promise<{
  success: number;
  failed: number;
  total: number;
  articlesByCategory: Map<string, Article[]>;
}> {
  let success = 0;
  let failed = 0;
  const articlesByCategory = new Map<string, Article[]>();

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`Fetching feed: ${feed.source} (${feed.url})`);
      const items = await parseFeed(feed.url);

      let processed = 0;
      for (const item of items) {
        try {
          // Map RSS item to article structure
          const articleData = mapFeedItemToArticle(
            item,
            feed.category,
            feed.source
          );

          // Generate summary with Gemini (with fallback to contentSnippet)
          const content = item.content || item.contentSnippet || item.description || "";
          const summary = await summarizeArticle(articleData.title, content);
          
          // Create article with summary
          const article: Article = {
            id: randomUUID(),
            title: articleData.title,
            summary: summary || articleData.description?.substring(0, 200) || null,
            link: articleData.link,
            category: feed.category,
            source: feed.source,
            publishedAt: articleData.publishedAt.toISOString(),
            imageUrl: articleData.imageUrl || null,
          };

          // Group by category
          if (!articlesByCategory.has(feed.category)) {
            articlesByCategory.set(feed.category, []);
          }
          articlesByCategory.get(feed.category)!.push(article);
          processed++;
        } catch (error) {
          console.error(`Error processing article from ${feed.source}:`, error);
        }
      }

      console.log(
        `✓ ${feed.source}: ${processed} articles processed from ${items.length} items`
      );
      success++;
    } catch (error) {
      console.error(`✗ Failed to fetch ${feed.source}:`, error);
      failed++;
    }
  }

  // Sort articles by published date (newest first) for each category
  for (const [category, articles] of articlesByCategory.entries()) {
    articles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    // Limit to latest 50 articles per category
    articlesByCategory.set(category, articles.slice(0, 50));
  }

  return {
    success,
    failed,
    total: RSS_FEEDS.length,
    articlesByCategory,
  };
}

export async function processAndSaveNews(): Promise<void> {
  console.log("Starting news fetch and processing...");
  const result = await fetchAllFeeds();

  // Convert to CategoryNews format, mapping Persian category names to English keys
  const categoryData = new Map<string, CategoryNews>();
  const now = new Date().toISOString();

  for (const [persianCategory, articles] of result.articlesByCategory.entries()) {
    const categoryKey = getCategoryKey(persianCategory);
    if (categoryKey) {
      categoryData.set(categoryKey, {
        category: persianCategory, // Keep Persian name in data
        articles,
        lastUpdated: now,
      });
    } else {
      console.warn(`Unknown category: ${persianCategory}, skipping...`);
    }
  }

  // Write all categories to JSON files (using English keys as filenames)
  await writeAllCategories(categoryData);

  console.log(
    `✓ Processing complete: ${result.success}/${result.total} feeds succeeded, ${result.failed} failed`
  );
  console.log(`✓ Saved ${categoryData.size} categories with articles`);
}
