import { Suspense } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { getArticles, getArticleCount, getCategories } from "@/lib/db/client";
import type { ArticleRow } from "@/lib/db/schema";

interface Article {
  id: string;
  title: string;
  description: string | null;
  link: string;
  category: string;
  source: string;
  publishedAt: string;
  fetchedAt: string;
  imageUrl?: string | null;
}

function mapRowToArticle(row: ArticleRow): Article {
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

async function getNews(category?: string, page: number = 1) {
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const [articles, totalCount, categories] = await Promise.all([
      getArticles({ category, limit, offset }),
      getArticleCount(category),
      getCategories(),
    ]);

    return {
      articles: articles.map(mapRowToArticle),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      categories,
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return {
      articles: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      categories: [],
    };
  }
}

interface HomePageProps {
  searchParams: { category?: string; page?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const category = searchParams.category;
  const page = parseInt(searchParams.page || "1", 10);
  const { articles, categories, pagination } = await getNews(category, page);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center">
            khabarwtf - خبر جمع‌کن
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            خبرخوان کوچک برای اخبار فارسی
          </p>
          <div className="flex justify-center">
            <Suspense fallback={<div>در حال بارگذاری...</div>}>
              <CategoryFilter
                categories={categories}
                currentCategory={category}
              />
            </Suspense>
          </div>
        </header>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              خبری یافت نشد. لطفاً بعداً دوباره تلاش کنید.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.map((article: Article) => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {page > 1 && (
                  <a
                    href={`/?${new URLSearchParams({
                      ...(category && { category }),
                      page: (page - 1).toString(),
                    }).toString()}`}
                    className="px-4 py-2 border rounded hover:bg-accent"
                  >
                    قبلی
                  </a>
                )}
                <span className="px-4 py-2">
                  صفحه {page} از {pagination.totalPages}
                </span>
                {page < pagination.totalPages && (
                  <a
                    href={`/?${new URLSearchParams({
                      ...(category && { category }),
                      page: (page + 1).toString(),
                    }).toString()}`}
                    className="px-4 py-2 border rounded hover:bg-accent"
                  >
                    بعدی
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

