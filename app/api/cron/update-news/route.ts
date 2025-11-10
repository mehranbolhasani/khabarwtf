import { NextResponse } from "next/server";
import { processAndSaveNews } from "@/lib/rss/fetcher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verify this is a cron request
  // Vercel Cron Jobs set x-vercel-cron header, or we can use Authorization header for manual calls
  const vercelCron = request.headers.get("x-vercel-cron");
  const authHeader = request.headers.get("authorization");
  
  // Allow if it's a Vercel cron job OR if it has the correct secret
  if (!vercelCron && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all feeds, summarize with Gemini, and save to JSON files
    await processAndSaveNews();

    return NextResponse.json({
      success: true,
      message: "News updated successfully and saved to JSON files",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
