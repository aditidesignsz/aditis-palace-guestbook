# Aditi's Palace Guestbook

A simple, beautiful guestbook for your portfolio. Visitors can sign and leave a card with their name, a drawn signature, and a colour theme.

---

## Project Structure

```
aditis-palace-guestbook/
│
├── app/
│   ├── layout.jsx              ← Root layout (fonts, global CSS)
│   ├── globals.css             ← All global styles + design tokens
│   ├── page.jsx                ← PAGE 1: Gallery of all visitor cards
│   │
│   ├── sign/
│   │   └── page.jsx            ← PAGE 2: Sign the guestbook form
│   │
│   └── api/
│       ├── visitors/
│       │   └── route.js        ← GET /api/visitors (returns all cards)
│       └── visit/
│           └── route.js        ← POST /api/visit (saves a new card)
│
├── components/
│   ├── VisitorCard.jsx         ← Card component (swap Figma designs here!)
│   └── SignatureCanvas.jsx     ← Drawing canvas for signatures
│
├── lib/
│   └── supabase.js             ← Supabase client setup
│
├── .env.local.example          ← Template for your secret keys
├── .gitignore
├── next.config.js
├── package.json
└── README.md                   ← This file
```

---

## STEP 1 — Set Up Supabase (Database)

Supabase is a free database service. Follow these steps:

### 1.1 Create a free account
1. Go to **https://supabase.com**
2. Click **Start your project** and sign up (free)

### 1.2 Create a new project
1. Click **New project**
2. Give it a name like `aditis-palace`
3. Choose a database password (save it somewhere)
4. Choose a region close to you
5. Click **Create new project** and wait ~1 minute

### 1.3 Create the database table
1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Paste the following SQL and click **Run**:

```sql
-- Create the visitors table
CREATE TABLE visitors (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  card_color TEXT NOT NULL CHECK (card_color IN ('blue', 'green', 'orange', 'pink')),
  signature  TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anyone to read and insert (no login needed)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visitors"
  ON visitors FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert a visitor"
  ON visitors FOR INSERT
  WITH CHECK (true);
```

4. You should see **"Success. No rows returned"** — that means it worked!

### 1.4 Get your API keys
1. Click **Project Settings** (gear icon) in the left sidebar
2. Click **API**
3. You need two values:
   - **Project URL** — looks like `https://abcxyz.supabase.co`
   - **anon public** key — a long string of letters

Keep these open for the next step.

---

## STEP 2 — Set Up the Project on Your Computer

### 2.1 Install Node.js (if you haven't already)
Download and install from: **https://nodejs.org** (choose the LTS version)

### 2.2 Download this project
Place the `aditis-palace-guestbook` folder somewhere on your computer.

### 2.3 Add your Supabase keys
1. Inside the project folder, find the file called `.env.local.example`
2. Make a **copy** of it in the same folder
3. Rename the copy to exactly: `.env.local`
4. Open `.env.local` in any text editor (Notepad, TextEdit, VS Code)
5. Replace the placeholder values with your real Supabase values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### 2.4 Install dependencies and run locally
Open a terminal (or Command Prompt on Windows) in the project folder and run:

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser. You should see the guestbook!

---

## STEP 3 — Upload to GitHub

GitHub is where you store and manage your code. You need this before deploying to Vercel.

### 3.1 Create a GitHub account (if you don't have one)
Go to **https://github.com** and sign up (free).

### 3.2 Create a new repository
1. Click the **+** icon → **New repository**
2. Name it `aditis-palace-guestbook`
3. Set it to **Private** (recommended — keeps your code private)
4. Click **Create repository**

### 3.3 Upload your code
The easiest way is using GitHub Desktop:

1. Download **GitHub Desktop** from https://desktop.github.com
2. Open it and sign in to your GitHub account
3. Click **File → Add Local Repository**
4. Choose your `aditis-palace-guestbook` folder
5. If it says "not a Git repository", click **create a repository**
6. Click **Publish repository** and choose your GitHub account
7. Make sure **Keep this code private** is checked → click **Publish**

Your code is now on GitHub! ✓

---

## STEP 4 — Deploy to Vercel (Free Hosting)

### 4.1 Create a Vercel account
Go to **https://vercel.com** and sign up with your GitHub account (free).

### 4.2 Import your project
1. On your Vercel dashboard, click **Add New → Project**
2. Find `aditis-palace-guestbook` in the list and click **Import**
3. Leave all settings as default — Vercel auto-detects Next.js

### 4.3 Add your environment variables
**This step is critical.** Without this, the database won't connect.

1. Before clicking Deploy, scroll down to **Environment Variables**
2. Add the first variable:
   - Name:  `NEXT_PUBLIC_SUPABASE_URL`
   - Value: your Supabase project URL
3. Add the second variable:
   - Name:  `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: your Supabase anon key
4. Click **Deploy**

### 4.4 Wait for deployment
Vercel will build and deploy in ~1–2 minutes. When it's done, you'll get a live URL like:
`https://aditis-palace-guestbook.vercel.app`

That's your live guestbook! ✓

### 4.5 Future updates
Whenever you push changes to GitHub, Vercel will automatically re-deploy. No extra steps needed.

---

## STEP 5 — Embed or Link from WordPress

You have two options:

### Option A — Simple Link (recommended)
Add a button or link on your WordPress site that opens the guestbook:

```html
<a href="https://aditis-palace-guestbook.vercel.app" target="_blank">
  Sign My Guestbook ✦
</a>
```

In WordPress, paste this into any **Custom HTML block**.

### Option B — Embed with iframe
If you want the guestbook to appear directly on a WordPress page:

1. In WordPress, add a **Custom HTML** block
2. Paste this code:

```html
<iframe
  src="https://aditis-palace-guestbook.vercel.app"
  width="100%"
  height="700px"
  style="border: none; border-radius: 12px;"
  title="Aditi's Palace Guestbook"
></iframe>
```

3. Adjust the `height` value to fit your page layout

**Note:** Replace the URL with your actual Vercel URL in both options.

---

## STEP 6 — Swap in Your Figma Designs Later

When your Figma card designs are ready, here's exactly how to replace the placeholders:

### Where to make changes
Open: `components/VisitorCard.jsx`

There is a clearly marked section at the top of the file called `CARD_THEMES`. This is where all four colour definitions live.

### Option A — Replace with exported images from Figma

1. In Figma, export each card design as a PNG (one per colour)
2. Name them: `card-blue.png`, `card-green.png`, `card-orange.png`, `card-pink.png`
3. Place them in a new folder: `public/cards/`
4. In `VisitorCard.jsx`, replace the `<div className="card-placeholder">` block with:

```jsx
import Image from 'next/image';

// Inside the return:
<article className="card-wrapper" style={{ position: 'relative', height: '200px' }}>
  <Image
    src={`/cards/card-${card_color}.png`}
    alt={`${name}'s visitor card`}
    fill
    style={{ objectFit: 'cover', borderRadius: '14px' }}
  />
  {/* Overlay the name and date on top of the image */}
  <div style={{ position: 'absolute', bottom: '16px', left: '18px', color: '#fff' }}>
    <div style={{ fontSize: '15px', fontWeight: 700 }}>{name}</div>
    <div style={{ fontSize: '11px', opacity: 0.7 }}>{formatDate(created_at)}</div>
  </div>
</article>
```

### Option B — Export as React component from Figma
Some Figma plugins (like Figma to Code) export designs as JSX. If you use one:

1. Export the card component from Figma
2. Paste the exported component code into `components/VisitorCard.jsx`
3. Pass `name`, `card_color`, `signature`, and `created_at` as props to it

The outer `<article className="card-wrapper">` should be kept — it handles the hover animation.

---

## Quick Reference — API Routes

| Method | Route            | What it does                     |
|--------|------------------|----------------------------------|
| GET    | `/api/visitors`  | Returns all cards, newest first  |
| POST   | `/api/visit`     | Saves a new visitor card         |

### POST body format (JSON):
```json
{
  "name":       "Alex Kim",
  "card_color": "pink",
  "signature":  "data:image/png;base64,..."
}
```

---

## Troubleshooting

**"Missing Supabase environment variables" error**
→ Make sure you created `.env.local` (not `.env.local.example`) and filled in both values.

**Cards not loading / blank gallery**
→ Check the Supabase table name is exactly `visitors` (lowercase).
→ Check the Row Level Security policies were applied (Step 1.3).

**Vercel deployment fails**
→ Make sure you added both environment variables in the Vercel dashboard before deploying.

**Signature not saving**
→ The signature is stored as a base64 image string. If it seems too large, the Supabase text column handles it fine. No changes needed.

---

*Built with Next.js · Supabase · Vercel · Made for Aditi's Palace ✦*
