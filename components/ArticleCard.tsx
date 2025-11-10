import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale/fa-IR";
import { ExternalLink } from "lucide-react";

interface ArticleCardProps {
  id: string;
  title: string;
  summary: string | null;
  link: string;
  category: string;
  source: string;
  publishedAt: string;
  imageUrl?: string | null;
}

export function ArticleCard({
  title,
  summary,
  link,
  category,
  source,
  publishedAt,
  imageUrl,
}: ArticleCardProps) {
  const publishedDate = new Date(publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, {
    addSuffix: true,
    locale: faIR,
  });

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="secondary">{category}</Badge>
          <span className="text-xs text-muted-foreground">{source}</span>
        </div>
        <CardTitle className="line-clamp-2">
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      {summary && (
        <CardContent className="flex-grow">
          <CardDescription className="line-clamp-3 text-sm">
            {summary}
          </CardDescription>
        </CardContent>
      )}
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{timeAgo}</span>
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          خواندن بیشتر
          <ExternalLink className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}

