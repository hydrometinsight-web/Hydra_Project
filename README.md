# HydroMetInsight

Hydrometallurgy News and Content Platform built with Next.js 14.

## Features

- **News & Articles** -- publish, categorize, and tag hydrometallurgy news
- **TechInsight** -- in-depth technical analysis and research articles
- **Events** -- upcoming conferences, workshops, and summits
- **Sponsors** -- sponsor management with calculator integration
- **Calculations** -- molecular weight calculator, unit converter, and more
- **Admin Panel** -- full CRUD dashboard with JWT authentication
- **Comments & Likes** -- reader engagement with nested comments
- **Newsletter** -- email subscription and campaign management
- **Analytics** -- page views, country tracking, and statistics dashboard
- **Responsive Design** -- Tailwind CSS with mobile-first approach

## Tech Stack

| Layer        | Technology                  |
| ------------ | --------------------------- |
| Framework    | Next.js 14 (App Router)     |
| Language     | TypeScript                  |
| Database     | PostgreSQL (Prisma ORM)     |
| Styling      | Tailwind CSS                |
| Auth         | JWT (jsonwebtoken + bcrypt) |
| File Storage | Vercel Blob                 |
| Hosting      | Vercel                      |

---

## Local Development

### Requirements

- Node.js 18+
- npm

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (see .env.example)
cp .env.example .env

# 3. Push database schema
npx prisma db push

# 4. (Optional) Seed sample data
npx tsx scripts/seed-tags.ts
npx tsx scripts/seed-events.ts

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Deploy to Vercel (< 1 Hour)

### Step 1: Push to GitHub (5 min)

If you don't have a GitHub repo yet:

1. Go to [github.com/new](https://github.com/new) and create a new repository
2. Run these commands:

```bash
git add .
git commit -m "Prepare for deployment"
git remote add origin https://github.com/YOUR_USERNAME/hydrometinsight.git
git push -u origin master
```

### Step 2: Import to Vercel (2 min)

1. Go to [vercel.com](https://vercel.com) and sign in with your **GitHub account**
2. Click **"Add New Project"**
3. Select your `hydrometinsight` repository
4. Click **Import** -- leave all settings as default
5. **Don't deploy yet** -- first set up the database (Step 3)

### Step 3: Create Vercel Postgres Database (5 min)

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click **Create Database** → select **Postgres** → click **Create**
3. Vercel automatically adds `DATABASE_URL` and `DIRECT_URL` to your project

### Step 4: Create Vercel Blob Storage (3 min)

1. In the same **Storage** tab, click **Create** → select **Blob**
2. Click **Create** -- this adds `BLOB_READ_WRITE_TOKEN` automatically

### Step 5: Set Environment Variables (5 min)

Go to **Settings** → **Environment Variables** and add:

| Variable         | Value                                          |
| ---------------- | ---------------------------------------------- |
| `NEXTAUTH_SECRET`| A strong random string (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL`   | `https://your-project.vercel.app` (update after first deploy) |

### Step 6: Deploy (5 min)

1. Go to the **Deployments** tab
2. Click **Redeploy** (or push a new commit to trigger automatic deploy)
3. Wait for the build to finish (~2-3 minutes)
4. Your site is live at `https://your-project.vercel.app`

### Step 7: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `hydrometinsight.com`)
3. Update DNS records as shown by Vercel
4. Update `NEXTAUTH_URL` to your custom domain

---

## Project Structure

```
├── app/
│   ├── admin/          # Admin panel (dashboard, news, events, etc.)
│   ├── api/            # API routes (CRUD, auth, upload, analytics)
│   ├── about/          # About page
│   ├── haber/          # News detail pages
│   ├── news/           # News listing
│   ├── techinsight/    # TechInsight pages
│   ├── events/         # Events page
│   ├── sponsor/        # Sponsors page
│   └── calculations/   # Calculator tools
├── components/         # Reusable React components
├── lib/                # Utilities (prisma, auth, validation, security)
├── prisma/             # Database schema
├── scripts/            # Seed and utility scripts
└── public/             # Static assets
```

## Environment Variables

See `.env.example` for all required variables.

## License

Private project. All rights reserved.
