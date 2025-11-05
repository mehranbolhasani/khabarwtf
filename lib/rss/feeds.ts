import type { RSSFeed } from "@/types/article";

// Major Farsi news RSS feeds
export const RSS_FEEDS: RSSFeed[] = [
  {
    url: "https://www.bbc.com/persian/index.xml",
    source: "BBC Persian",
    category: "خبر",
  },
  {
    url: "https://www.radiofarda.com/rss.xml",
    source: "Radio Farda",
    category: "خبر",
  },
  {
    url: "https://www.iranintl.com/fa/rss",
    source: "Iran International",
    category: "خبر",
  },
  {
    url: "https://www.dw.com/fa-ir/rss.xml",
    source: "DW Persian",
    category: "خبر",
  },
  {
    url: "https://www.voanews.com/persian/rss.xml",
    source: "VOA Persian",
    category: "خبر",
  },
  // Add more feeds as needed
];

