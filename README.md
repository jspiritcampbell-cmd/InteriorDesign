# AI Interior Design Assistant (Next.js + Vercel)

A minimal Next.js app that generates structured interior design plans using OpenAI.

## Quick Start (Local)
1. `cp .env.example .env.local` and fill `OPENAI_API_KEY`
2. `npm i`
3. `npm run dev`
4. Open http://localhost:3000

## Deploy to Vercel
1. Push this project to a Git repo (GitHub/GitLab/Bitbucket).
2. In Vercel:
   - **New Project** → Import the repo
   - Framework: **Next.js**
   - Add Environment Variable: `OPENAI_API_KEY`
   - Deploy
3. Edge runtime is configured via `vercel.json`.

## Notes
- Update `model` in `app/api/design/route.ts` as needed.
- Tailwind is included for quick styling.
- API returns strict JSON. UI validates and renders palette swatches.
