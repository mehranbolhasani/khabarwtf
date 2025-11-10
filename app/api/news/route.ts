import { NextResponse } from "next/server";
import { readCategoryNews, readAllCategories } from "@/lib/cache/reader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;

    if (category) {
      // Return articles for specific category
      const categoryData = await readCategoryNews(category);
      if (!categoryData) {
        return NextResponse.json({
          articles: [],
          category,
          lastUpdated: null,
        });
      }

      return NextResponse.json({
        articles: categoryData.articles,
        category: categoryData.category,
        lastUpdated: categoryData.lastUpdated,
      });
    } else {
      // Return all categories
      const allCategories = await readAllCategories();
      const result: Record<string, any> = {};

      for (const [cat, data] of allCategories.entries()) {
        result[cat] = {
          articles: data.articles,
          lastUpdated: data.lastUpdated,
        };
      }

      return NextResponse.json(result);
    }
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
