import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import type { CategoryNews } from "@/types/article";

// Read from public directory (served statically)
const DATA_DIR = join(process.cwd(), "public", "data", "news");

export async function readCategoryNews(
  category: string
): Promise<CategoryNews | null> {
  try {
    const filePath = join(DATA_DIR, `${category}.json`);
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return null;
    }
    
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as CategoryNews;
  } catch (error) {
    console.error(`Error reading category ${category}:`, error);
    return null;
  }
}

export async function readAllCategories(): Promise<Map<string, CategoryNews>> {
  const categories = [
    "world",
    "politics",
    "tech",
    "sport",
    "science",
    "economy",
    "culture",
  ];

  const results = new Map<string, CategoryNews>();

  for (const category of categories) {
    const data = await readCategoryNews(category);
    if (data) {
      results.set(category, data);
    }
  }

  return results;
}
