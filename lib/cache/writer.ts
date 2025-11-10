import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import type { CategoryNews } from "@/types/article";

// Use public directory so files are served statically and can be committed to git
const DATA_DIR = join(process.cwd(), "public", "data", "news");

export async function ensureDataDirectory(): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, that's fine
  }
}

export async function writeCategoryNews(
  category: string,
  data: CategoryNews
): Promise<void> {
  await ensureDataDirectory();
  const filePath = join(DATA_DIR, `${category}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✓ Wrote ${data.articles.length} articles to ${filePath}`);
}

export async function writeAllCategories(
  categoryData: Map<string, CategoryNews>
): Promise<void> {
  await ensureDataDirectory();
  
  const promises = Array.from(categoryData.entries()).map(([category, data]) =>
    writeCategoryNews(category, data)
  );

  await Promise.all(promises);
  console.log(`✓ Wrote ${categoryData.size} category files`);
}

