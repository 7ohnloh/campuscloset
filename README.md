# CampusCloset

A demo second-hand clothing marketplace for university students — an online campus flea market — with AI natural-language search, grounded catalogue Q&A, item comparison and AI-assisted listing drafts.

Built for the CognitioLabs Associate FDE assessment. See `/notes` on the deployed site for product decisions, AI usage and known limitations.

## Stack

- Next.js (App Router) + Tailwind CSS, deployed on Vercel
- Seeded catalogue in `data/` (60 listings, 8 stalls)
- Model calls happen only in server route handlers (`app/api/*`) via an OpenAI-compatible gateway

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in your own values
npm run dev
```

Without AI credentials the app still runs: search falls back to keyword matching and Q&A reports that the assistant is unavailable.

## Environment variables

| Name | Purpose |
| --- | --- |
| `AI_BASE_URL` | OpenAI-compatible base URL of the AI gateway (e.g. `https://…/v1`) |
| `AI_API_KEY` | Gateway API key — server-side only, never commit |
| `AI_MODEL` | Model name used for search, Q&A and listing drafts |

`GET /api/health` checks that the deployed site can reach the model (it never returns the key).
