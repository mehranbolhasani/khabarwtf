"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/rss/feeds";

export function CategoryTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      <Link
        href="/"
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
          currentCategory === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-muted hover:bg-muted/80"
        )}
      >
        همه
      </Link>
      {Object.entries(CATEGORIES).map(([key, label]) => (
        <Link
          key={key}
          href={`/?category=${key}`}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            currentCategory === key
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

