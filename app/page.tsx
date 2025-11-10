import { Suspense } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { readCategoryNews } from "@/lib/cache/reader";
import { CATEGORIES } from "@/lib/rss/feeds";
import type { Article } from "@/types/article";

async function getNews(category?: string) {
  if (!category || category === "all") {
    // Return all categories combined
    const allArticles: Article[] = [];
    for (const catKey of Object.keys(CATEGORIES)) {
      const categoryData = await readCategoryNews(catKey);
      if (categoryData) {
        allArticles.push(...categoryData.articles);
      }
    }
    // Sort by date, newest first
    allArticles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return allArticles.slice(0, 30); // Limit to 30 most recent
  }

  const categoryData = await readCategoryNews(category);
  return categoryData?.articles || [];
}

interface HomePageProps {
  searchParams: { category?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const category = searchParams.category;
  const articles = await getNews(category);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                khabarwtf
              </h1>
              <p className="text-muted-foreground text-sm">
                خبرخوان کوچک برای اخبار فارسی
              </p>
            </div>
            <ThemeToggle />
          </div>
          <Suspense fallback={<div className="h-10" />}>
            <CategoryTabs />
          </Suspense>
        </header>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              خبری یافت نشد. لطفاً بعداً دوباره تلاش کنید.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: Article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
