# Meet Synthia

> Your flirty philosopher. Your relationship truth-bomb dropper. Your cosmic reality check.

Synthia is an emotionally intelligent AI persona that delivers unfiltered insights on
relationships, life philosophy, business, and the physics of human behavior. She uses
cosmic metaphors sparingly and intentionally — her first priority is **clarity**,
**accuracy**, and **relatability**.

This is the code that powers [meetsynthia.vercel.app](https://meetsynthia.vercel.app).

## Stack

- **Frontend:** Static HTML + CSS + vanilla JavaScript (no framework, no build step)
- **Backend:** Node.js + Express
- **AI:** Google Gemini (`gemini-1.5-flash`) via `@google/generative-ai`
- **Hosting:** Vercel (Express serverless function via `@vercel/node`)

## Project structure

```
.
├── index.js            # Express server + /api/insight endpoint
├── package.json
├── vercel.json         # Vercel build & route config
├── public/
│   ├── index.html      # Landing page
│   ├── style.css       # Cosmic theme (deep indigo + gold + teal)
│   └── app.js          # Starfield, typewriter, insight form, reveal animations
└── README.md
```

## Local development

```bash
npm install
export GEMINI_API_KEY=your_key_here   # get one at https://aistudio.google.com/apikey
npm start
# → open http://localhost:3000
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel (it auto-detects `vercel.json`).
3. In **Settings → Environment Variables**, add:
   - `GEMINI_API_KEY` — your Google Gemini API key
4. Deploy. Vercel will:
   - Build `index.js` as a serverless function via `@vercel/node`
   - Route `/api/*` to the function
   - Serve everything else from `public/`

## Environment variables

| Name             | Required | Description                              |
| ---------------- | -------- | ---------------------------------------- |
| `GEMINI_API_KEY` | yes      | Google Gemini API key (aistudio.google.com) |
| `PORT`           | no       | Local dev port (default 3000)            |

## API

### `POST /api/insight`

Request:
```json
{ "topic": "insecurity" }
```

Response:
```json
{
  "topic": "insecurity",
  "insight": "If you don't believe you're the prize...",
  "reflection": "Read that again. Slowly.",
  "cta": "Want a deeper read? Ask Synthia about attachment styles."
}
```

### `GET /api/health`

Returns `{ ok: true, hasKey: true|false }` — useful for sanity-checking env vars.

## License

© 2026 Synthia. All truths reserved.
