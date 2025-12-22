# HydroMetInsight

Hydrometallurgy News and Content Platform

## Last Update Date
Latest working version - All features completed

## Features

### ✅ Completed Features

1. **Homepage**
   - Latest News section
   - TechInsight section
   - All News section
   - Events section
   - AdSense ad integration

2. **Pages**
   - News list and detail pages
   - TechInsight list and detail pages
   - Events page
   - Sponsors page
   - Calculations page
   - About page
   - Questions/Contact page

3. **Admin Panel**
   - Dashboard
   - News management
   - Categories management
   - TechInsight management
   - Events management
   - Statistics page
   - JWT authentication

4. **API Routes**
   - Admin API routes (CRUD operations)
   - Analytics tracking
   - Newsletter subscription
   - Comments API

5. **UI/UX**
   - Responsive design
   - Modern navbar
   - Footer with newsletter
   - Image placeholders
   - Loading states

6. **Integrations**
   - Google AdSense
   - Analytics tracking
   - Newsletter system

## Installation

### Requirements
- Node.js 18+
- npm or yarn
- SQLite (with Prisma)

### Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Prepare the database:**
```bash
npx prisma generate
npx prisma db push
```

3. **Set environment variables:**
Create `.env` file:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_GOOGLE_ADSENSE_ID="ca-pub-XXXXXXXXXXXXXXXX"
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open in browser:**
```
http://localhost:3000
```

## Admin Panel

Access the admin panel:
```
http://localhost:3000/admin
```

**Note:** You may need to run a script to create the first admin user.

## Project Structure

```
├── app/
│   ├── admin/          # Admin panel pages
│   ├── api/            # API routes
│   ├── about/          # About page
│   ├── news/           # News pages
│   ├── techinsight/    # TechInsight pages
│   └── ...
├── components/         # React components
├── lib/                # Utility functions
├── prisma/             # Database schema
└── public/             # Static files
```

## Technologies

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** SQLite (Prisma ORM)
- **Styling:** Tailwind CSS
- **Authentication:** JWT
- **Ads:** Google AdSense

## Important Notes

1. **Database:** SQLite is used, PostgreSQL is recommended for production
2. **Environment Variables:** Don't forget to create the `.env` file
3. **AdSense:** `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` must be set to see ads
4. **Admin User:** A script may be required to create the first admin user

## Git Usage

This project is under version control with Git. To revert changes:

```bash
# Revert to last commit
git reset --hard HEAD

# Revert to a specific commit
git log
git reset --hard <commit-hash>
```

## License

This is a private project.

