# khabarwtf - خبر جمع‌کن

A tiny, simple news aggregator in Farsi that collects news from multiple RSS feeds, summarizes them with Gemini AI, and displays them in a clean, modern interface.

## Features

- 📰 Aggregates news from multiple Farsi RSS feeds
- 🤖 AI-powered summaries using Google Gemini API
- 🏷️ Category-based organization (world, politics, tech, sport, science, economy, culture)
- 🔄 Automatic updates every 24 hours via Vercel Cron Jobs
- 📱 Responsive design with RTL support
- 🎨 Modern UI built with shadcn/ui and Tailwind CSS
- 🌓 Dark/light mode support
- 🔤 Estedad font for beautiful Farsi typography
- 💾 Static JSON caching (no database needed)
- 🚀 Deployed on Vercel with GitHub auto-deploy

## Tech Stack

- **Framework**: Next.js 16+ (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **AI**: Google Gemini API for article summarization
- **RSS Parsing**: rss-parser
- **Scheduling**: Vercel Cron Jobs (24 hours)
- **Storage**: Static JSON files (no database)

## Setup

### Prerequisites

- Node.js 18+ and npm
- Vercel account
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/mehranbolhasani/khabarwtf.git
cd khabarwtf
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create `.env.local`** with your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key
CRON_SECRET=your_secret_key_for_cron_endpoint
```

4. **Run the development server**:
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

6. **Generate initial news data** (first time only):
```bash
# Make sure the dev server is running first!
npm run fetch-news
```

This will fetch RSS feeds, summarize articles with Gemini, and save them to `public/data/news/*.json`.

## Deployment on Vercel

### First-Time Setup

1. **Push your code to GitHub**:
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

3. **Add environment variables** in Vercel project settings:
   - Go to "Settings" → "Environment Variables"
   - Add `GEMINI_API_KEY` - Your Google Gemini API key
   - Add `CRON_SECRET` - Generate a random secret (e.g., using `openssl rand -hex 32`)

4. **Deploy**:
   - Click "Deploy" (or it will auto-deploy from GitHub)
   - Wait for the build to complete

5. **Trigger initial news fetch**:
   - Go to your Vercel project → Functions tab
   - Find `/api/cron/update-news`
   - Click "Invoke" to manually trigger it
   - This will generate the initial JSON files

6. **Commit generated JSON files** (important!):
   - The cron job generates JSON files in `public/data/news/`
   - Commit these files to git so they're available at build time
   - Or set up a GitHub Action to auto-commit them

### Automatic Deployments

Once set up, Vercel will **automatically deploy**:
- ✅ Every push to `main` branch → Production deployment
- ✅ Every pull request → Preview deployment
- ✅ Cron jobs will run automatically every 24 hours (daily at midnight UTC)

## RSS Feeds

The app currently aggregates from these Farsi news sources:
- BBC Persian
- Radio Farda
- Iran International
- DW Persian
- VOA Persian

You can add more feeds by editing `lib/rss/feeds.ts` and assigning them to appropriate categories.

## Categories

- **جهان** (World) - International news
- **سیاست** (Politics) - Political news
- **فناوری** (Tech) - Technology news
- **ورزش** (Sport) - Sports news
- **علم** (Science) - Science news
- **اقتصاد** (Economy) - Economic news
- **فرهنگ** (Culture) - Cultural news

## Project Structure

```
/app
  /api
    /cron/update-news    # Cron job endpoint (fetches RSS, summarizes, saves JSON)
    /news                 # News API endpoint (reads JSON files)
  /components
    /ui                  # shadcn/ui components
    ArticleCard.tsx      # Article display component
    CategoryTabs.tsx     # Category navigation tabs
    ThemeToggle.tsx      # Dark/light mode toggle
  /lib
    /rss                 # RSS fetching and parsing
    /ai                  # Gemini AI summarization
    /cache               # JSON file read/write utilities
    fonts.ts             # Estedad font configuration
  /public
    /data/news           # Generated JSON files (committed to git)
    /fonts               # Estedad font files
  page.tsx               # Main homepage
```

## How It Works

1. **Cron Job** (`/api/cron/update-news`) runs every 24 hours:
   - Fetches RSS feeds from configured sources
   - Parses articles
   - Summarizes each article using Gemini AI
   - Groups articles by category
   - Saves to JSON files in `public/data/news/`

2. **Frontend** reads from JSON files:
   - Displays articles by category
   - Shows AI-generated summaries
   - Provides links to original articles

3. **No Database**: Everything is stored in static JSON files, making it simple and fast.

## Environment Variables

- `GEMINI_API_KEY` - Required for article summarization
- `CRON_SECRET` - Secret key to protect the cron endpoint

## License

MIT
