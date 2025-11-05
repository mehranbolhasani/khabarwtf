# khabarwtf - خبر جمع‌کن

A tiny news aggregator in Farsi that collects news from multiple RSS feeds and displays them in a clean, modern interface.

## Features

- 📰 Aggregates news from multiple Farsi RSS feeds
- 🏷️ Category filtering
- 🔄 Automatic updates every 12 hours via Vercel Cron Jobs
- 📱 Responsive design with RTL support
- 🎨 Modern UI built with shadcn/ui and Tailwind CSS
- 🚀 Deployed on Vercel

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Vercel Postgres
- **RSS Parsing**: rss-parser
- **Scheduling**: Vercel Cron Jobs

## Setup

### Prerequisites

- Node.js 18+ and npm
- Vercel account
- Vercel Postgres database

### Local Development

Yes, you can test the project locally! Here's how:

#### Option 1: Using Vercel Postgres (Recommended)

This uses the same database as production, so you can test with real data.

1. **Install Vercel CLI** (if you haven't):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project**:
   ```bash
   vercel link
   ```
   This will connect your local project to your Vercel project.

4. **Pull environment variables**:
   ```bash
   vercel env pull .env.local
   ```
   This automatically creates `.env.local` with all your database credentials from Vercel.

5. **Install dependencies**:
   ```bash
   npm install
   ```

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

8. **Initialize the database** (first time only):
   - Make sure the dev server is running (`npm run dev`)
   - The database will be initialized automatically when you call the cron endpoint
   - Trigger it manually:
     ```bash
     # Option 1: Use the npm script (easier)
     npm run fetch-news
     
     # Option 2: Manual curl command
     curl http://localhost:3000/api/cron/update-news \
       -H "Authorization: Bearer your_cron_secret"
     ```

#### Option 2: Manual Environment Setup

If you prefer not to use Vercel CLI:

1. **Clone and install**:
   ```bash
   git clone https://github.com/mehranbolhasani/khabarwtf.git
   cd khabarwtf
   npm install
   ```

2. **Create `.env.local`** with your database credentials:
   ```env
   # Get these from Vercel Dashboard → Your Project → Storage → Postgres → .env.local
   POSTGRES_URL=your_postgres_url
   POSTGRES_PRISMA_URL=your_prisma_url
   POSTGRES_URL_NON_POOLING=your_non_pooling_url
   POSTGRES_USER=your_user
   POSTGRES_HOST=your_host
   POSTGRES_PASSWORD=your_password
   POSTGRES_DATABASE=your_database

   CRON_SECRET=your_secret_key_for_cron_endpoint
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Initialize the database** (first time only):
   ```bash
   # Make sure the dev server is running first!
   npm run fetch-news
   
   # Or manually:
   curl http://localhost:3000/api/cron/update-news \
     -H "Authorization: Bearer your_cron_secret"
   ```

#### Local Testing Tips

- **Hot reload**: The dev server auto-reloads on code changes
- **Database**: Uses the same Vercel Postgres database (or you can set up a local Postgres)
- **API routes**: Test at `http://localhost:3000/api/news`
- **Cron endpoint**: Test manually with the curl command above

## Deployment on Vercel with GitHub Auto-Deploy

Yes! Vercel can automatically deploy from GitHub. Here's how:

### First-Time Setup

1. **Push your code to GitHub** (if you haven't already):
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import your repository in Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository (`khabarwtf`)
   - Vercel will automatically detect it's a Next.js project

3. **Set up Vercel Postgres**:
   - In your Vercel project dashboard, go to "Storage" tab
   - Click "Create Database" → "Postgres"
   - Create a new database (e.g., "khabarwtf-db")

4. **Add environment variables** in Vercel project settings:
   - Go to "Settings" → "Environment Variables"
   - Vercel will automatically add all `POSTGRES_*` variables from your database
   - Add `CRON_SECRET` - Generate a random secret (e.g., using `openssl rand -hex 32`)
   - `NEXT_PUBLIC_BASE_URL` is optional (Vercel auto-detects it)

5. **Deploy**:
   - Click "Deploy" (or it will auto-deploy from GitHub)
   - Wait for the build to complete

### Automatic Deployments

Once set up, Vercel will **automatically deploy**:
- ✅ Every push to `main` branch → Production deployment
- ✅ Every pull request → Preview deployment
- ✅ Cron jobs will run automatically every 12 hours

You can also manually trigger deployments from the Vercel dashboard.

## RSS Feeds

The app currently aggregates from these Farsi news sources:
- BBC Persian
- Radio Farda
- Iran International
- DW Persian
- VOA Persian

You can add more feeds by editing `lib/rss/feeds.ts`.

## Project Structure

```
/app
  /api
    /cron/update-news    # Cron job endpoint
    /news                 # News API endpoint
  /components
    /ui                  # shadcn/ui components
    ArticleCard.tsx      # Article display component
    CategoryFilter.tsx   # Category filter component
  /lib
    /rss                 # RSS fetching and parsing
    /db                  # Database client and schema
  page.tsx               # Main homepage
```

## License

MIT
