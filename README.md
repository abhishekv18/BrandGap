# BrandGap Website

The website for BrandGap — a growth-focused digital agency. Built with React, Vite and Tailwind CSS, with GSAP and Framer Motion for animation and Three.js for the 3D hero.

---

## Requirements

- **Node.js 20.19+ or 22.12+** (check with `node -v`). Download from [nodejs.org](https://nodejs.org) — the LTS version is fine.
- npm (comes with Node.js).

---

## Running the project

1. **Unzip** the folder and open a terminal inside it (the folder that contains `package.json`).

2. **Install the dependencies** (first time only — takes a minute or two):

   ```bash
   npm install
   ```

3. **Create the settings file.** Copy `.env.example` to a new file named `.env`:

   ```bash
   cp .env.example .env
   ```

   On Windows Command Prompt use `copy .env.example .env`. The defaults work as they are — see [Settings](#settings) below.

4. **Start the site:**

   ```bash
   npm run dev
   ```

   Open **http://localhost:5173** in your browser. Changes to the code reload automatically.

To stop the server, press `Ctrl + C` in the terminal.

---

## Other commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server at http://localhost:5173 |
| `npm run build` | Builds the production version into the `dist/` folder |
| `npm run preview` | Serves the built `dist/` folder at http://localhost:4173, to check the production build |

---

## Settings

Settings live in `.env` (copied from `.env.example`). All of them are optional for running the site locally.

| Setting | Purpose |
|---|---|
| `VITE_SITE_URL` | The live address of the site, used for SEO tags and the sitemap |
| `VITE_WEB3FORMS_KEY` | Web3Forms access key — form submissions are delivered by email |
| `VITE_GA4_ID` | Google Analytics 4 ID (optional) |
| `VITE_META_PIXEL_ID` | Meta Pixel ID (optional) |
| `VITE_CLARITY_ID` | Microsoft Clarity ID (optional) |
| `VITE_LEADS_ENDPOINT` | Optional alternative to Web3Forms (a webhook that receives form data as JSON) |

Analytics scripts only load once an ID is set **and** the visitor accepts the cookie banner.

After changing `.env`, stop and restart `npm run dev`.

---

## Project structure

```
public/            Images, fonts and other static files
src/
  data/            Site content — text, case studies, services, insights, contact details
  pages/           One file per page (Home, Portfolio, Services, About, Contact, …)
  sections/        The homepage sections (Hero, Services, Work, Growth, …)
  components/      Shared building blocks (navbar, footer, forms, cards, …)
  3d/              The 3D logo scene in the hero
  hooks/, utils/   Small helpers (SEO, form delivery, analytics, …)
  styles/          Global styles and design tokens (colours, type scale, spacing)
```

Most content updates only need changes in **`src/data/`** — for example, contact details in `contact.js`, case studies in `projects.js` and articles in `insights.js`.

---

## Tools that are not launched yet

The **Gap Score**, **Free audit** and **ROAS calculator** pages are built but currently show a "Coming soon" page. To launch one, set `LAUNCHED = true` at the top of its file in `src/pages/` (`GapScore.jsx`, `FreeAudit.jsx`, `RoasCalculatorPage.jsx`) and add its route to the sitemap list in `vite.config.js`.

---

## Deployment

The site is set up for **Vercel** (`vercel.json` handles page routing and caching). Import the project in Vercel, add the settings from `.env` as Environment Variables, and deploy. Any static host works as well: run `npm run build` and upload the `dist/` folder, making sure all routes fall back to `index.html`.

---

## Troubleshooting

- **`npm install` fails** — check the Node.js version (`node -v`); it must be 20.19 or newer.
- **Port 5173 already in use** — another dev server is running; stop it, or run `npm run dev -- --port 3000`.
- **Blank page after changing `.env`** — restart `npm run dev`.
- **3D hero not showing** — it needs WebGL; on phones and older devices the site automatically shows a lighter, non-3D version.
