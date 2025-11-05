import Parser from "rss-parser";
import type { Article } from "@/types/article";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "media"],
      ["media:thumbnail", "thumbnail"],
    ],
  },
});

export interface ParsedFeedItem {
  title: string;
  link: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  description?: string;
  media?: any;
  thumbnail?: any;
}

export async function parseFeed(url: string): Promise<ParsedFeedItem[]> {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || []).map((item) => {
      const itemAny = item as any;
      return {
        title: item.title || "",
        link: item.link || "",
        pubDate: item.pubDate || item.isoDate || undefined,
        contentSnippet: item.contentSnippet || item.summary || undefined,
        content: item.content || undefined,
        description: itemAny.description || undefined,
        media: itemAny.media || undefined,
        thumbnail: itemAny.thumbnail || undefined,
      };
    });
  } catch (error) {
    console.error(`Error parsing feed ${url}:`, error);
    return [];
  }
}

export function extractImageUrl(item: ParsedFeedItem): string | null {
  if (item.thumbnail?.$.url) {
    return item.thumbnail.$.url;
  }
  if (item.media?.$?.url) {
    return item.media.$.url;
  }
  // Try to extract from content/description
  const content = item.content || item.description || "";
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i);
  if (imgMatch) {
    return imgMatch[1];
  }
  return null;
}

export function mapFeedItemToArticle(
  item: ParsedFeedItem,
  category: string,
  source: string
): Omit<Article, "id" | "fetchedAt"> {
  const description =
    item.contentSnippet || item.description || null;
  const publishedAt = item.pubDate
    ? new Date(item.pubDate)
    : new Date();
  const imageUrl = extractImageUrl(item);

  return {
    title: item.title,
    description,
    link: item.link,
    category,
    source,
    publishedAt,
    imageUrl,
  };
}

