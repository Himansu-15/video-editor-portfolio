# Abhijeet Portfolio - Project Specification

## Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Animation**: GSAP + ScrollTrigger, Framer Motion
- **Smooth Scroll**: Lenis
- **Database**: MongoDB with Mongoose
- **Validation**: Zod

## Brand Tokens
- **Background**: `#0B0B0D`
- **Surface**: `#171719`
- **Accent (Champagne Gold)**: `#D6AE70` — used sparingly (~2% of UI)
- **Text**: `#F4F1EB`
- **Muted**: `#96949A`

## Fonts
- **Headings**: Space Grotesk
- **Body**: Inter
- **Style**: Minimal, premium, cinematic

## Video Assets
YouTube Video IDs:
1. `S14dA5Ybuvk`
2. `LsQ_RyC1sLw`
3. `FCfU-iuUDPE`
4. `VL3aANLPGNA`
5. `n3dAaPGhiuU`

## Working Rules
1. **No repeated code** — extract shared logic into reusable utils and components
2. **No unnecessary code** — don't write code, comments, or files that aren't needed
3. **Verify everything before moving on** — build must pass, lint must pass, API must respond, preloader must work without layout shift

## Site Copy Source
All site copy and content lives in `src/data/site.ts`. Components must read from this file and never hardcode copy. Placeholder values are marked with `// DUMMY` comments.

## Environment Variables
See `.env.example` for all required variables:
- `MONGODB_URI`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `AUTH_SECRET`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_NOINDEX`

## Preloader
- Logo reveal using `/public/logo.png` (falls back to "ABHIJEET" in wide-tracked Space Grotesk)
- Smooth fade into page
- Shows once per session (sessionStorage)

## Global Design System & Layout Architecture
- **Tokens**:
  - `--color-bg`: `#0B0B0D` (Page, hero, navbar, footer)
  - `--color-surface`: `#171719` (Cards, panels, borders)
  - `--color-accent`: `#D6AE70` (CTA buttons, active nav indicator, ~2% UI sparingly)
  - `--color-text`: `#F4F1EB` (Headings, primary copy)
  - `--color-muted`: `#96949A` (Descriptions, metadata)
- **Shared Animation Tokens (`src/lib/animation.ts`)**:
  - Easings: `EASINGS.cinema` (`[0.22, 1, 0.36, 1]`), `EASINGS.smooth` (`[0.25, 0.46, 0.45, 0.94]`)
  - Durations: `fast: 0.25s`, `base: 0.5s`, `slow: 0.85s`, `cinema: 1.1s`
  - Variants: `pageTransitionVariants`, `fadeUpVariant`, `fadeInVariant`, `staggerContainer`
- **Layout Components**:
  - `Navbar` (`src/components/Navbar.tsx`): Responsive, "A" logo mark fallback, active link indicator (`layoutId="activeNavIndicator"`), animated mobile drawer
  - `Footer` (`src/components/Footer.tsx`): Sourced dynamically from `src/data/site.ts`
  - `CustomCursor` (`src/components/CustomCursor.tsx`): Ivory dot + lagging gold ring (`useSpring`), dynamic "Play" and "View" modes on `[data-cursor]`, disabled on touch devices (`pointer: coarse`)
  - `FilmGrain` (`src/components/FilmGrain.tsx`): Lightweight CSS-only SVG noise filter (`0.035` opacity)
  - `LenisProvider` (`src/components/LenisProvider.tsx`): Lenis smooth scrolling wired directly into GSAP ScrollTrigger and `gsap.ticker`
  - `Template` (`src/app/template.tsx`): Route transitions via Framer Motion

## Backend Architecture & Portfolio Projects API
- **Project Model (`src/models/Project.ts`)**:
  - Fields: `title`, `slug` (unique), `category`, `location`, `craft` (`['Cuts', 'Color Grading', 'Motion Graphics']`), `role`, `client`, `year`, `description`, `youtubeId`, `thumbnail`, `previewLoopUrl`, `beforeAfter` (`{ before, after }`), `tools`, `featured`, `order`, `timestamps`.
- **Validation (`src/lib/validations/project.ts`)**:
  - `createProjectSchema`, `updateProjectSchema`, `projectQuerySchema` with strict Zod validation.
- **API Endpoints**:
  - `GET /api/projects`: List all projects with optional `category`, `craft`, and `featured` filters.
  - `GET /api/projects/[slug]`: Fetch single project by unique slug.
  - `POST /api/projects`: Create project (protected with `x-admin-secret` or Bearer token header).
  - `PUT /api/projects/[slug]`: Update project (protected with `x-admin-secret` or Bearer token header).
  - `DELETE /api/projects/[slug]`: Delete project (protected with `x-admin-secret` or Bearer token header).
- **Seed Script (`scripts/seed.ts`)**:
  - Runs with `npm run seed`.
  - Fetches titles via YouTube oEmbed (`https://www.youtube.com/oembed?url=https://youtu.be/<ID>&format=json`).
  - Resolves thumbnails to `maxresdefault.jpg` (with `hqdefault.jpg` fallback).
  - Generates slugs, sets `Cinematic Edit` category, all 3 craft values, current year, and logs TODO list for missing locations.