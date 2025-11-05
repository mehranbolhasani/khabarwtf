import { NextResponse } from "next/server";
import { getArticles, getArticleCount, getCategories } from "@/lib/db/client";
import type { ArticleRow } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mapRowToArticle(row: ArticleRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    link: row.link,
    category: row.category,
    source: row.source,
    publishedAt: row.published_at.toISOString(),
    fetchedAt: row.fetched_at.toISOString(),
    imageUrl: row.image_url,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = (page - 1) * limit;

    const [articles, totalCount, categories] = await Promise.all([
      getArticles({ category, limit, offset }),
      getArticleCount(category),
      getCategories(),
    ]);

    return NextResponse.json({
      articles: articles.map(mapRowToArticle),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      categories,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

