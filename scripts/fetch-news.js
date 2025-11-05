#!/usr/bin/env node

/**
 * Script to manually trigger the news fetching cron job locally
 * Usage: npm run fetch-news
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.log('💡 Please create .env.local with your CRON_SECRET');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const secretMatch = envContent.match(/CRON_SECRET=(.+)/);

if (!secretMatch || !secretMatch[1]) {
  console.error('❌ CRON_SECRET not found in .env.local!');
  process.exit(1);
}

const secret = secretMatch[1].trim();
const url = 'http://localhost:3000/api/cron/update-news';

console.log('🔄 Fetching news from RSS feeds...');
console.log(`📡 Calling: ${url}\n`);

exec(`curl "${url}" -H "Authorization: Bearer ${secret}"`, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error:', error.message);
    console.error('💡 Make sure the dev server is running: npm run dev');
    process.exit(1);
  }
  
  if (stderr) {
    console.error('⚠️  Warning:', stderr);
  }
  
  console.log(stdout);
  
  try {
    const result = JSON.parse(stdout);
    if (result.success) {
      console.log('\n✅ News fetched successfully!');
      console.log(`   ✓ ${result.feeds.success} feeds succeeded`);
      console.log(`   ✗ ${result.feeds.failed} feeds failed`);
    } else {
      console.error('\n❌ Failed to fetch news:', result.error);
    }
  } catch (e) {
    // Response might not be JSON, that's okay
    console.log('\n✅ Request completed');
  }
});

