import { NextResponse } from "next/server";
import { getArticleCount, getCategories } from "@/lib/db/client";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check database connection
    const articleCount = await getArticleCount();
    const categories = await getCategories();
    
    // Check if table exists
    let tableExists = false;
    try {
      const result = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'articles'
        );
      `;
      tableExists = result.rows[0]?.exists || false;
    } catch (error) {
      // Ignore errors
    }

    return NextResponse.json({
      status: "ok",
      database: {
        connected: true,
        tableExists,
        articleCount,
        categories,
      },
      environment: {
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasCronSecret: !!process.env.CRON_SECRET,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        database: {
          connected: false,
        },
        environment: {
          hasPostgresUrl: !!process.env.POSTGRES_URL,
          hasCronSecret: !!process.env.CRON_SECRET,
        },
      },
      { status: 500 }
    );
  }
}

