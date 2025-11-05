import { NextResponse } from "next/server";
import { fetchAllFeeds } from "@/lib/rss/fetcher";
import { initializeDatabase } from "@/lib/db/client";

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
    // Initialize database on first run
    await initializeDatabase();

    // Fetch all feeds
    const result = await fetchAllFeeds();

    return NextResponse.json({
      success: true,
      message: "News updated successfully",
      feeds: result,
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

