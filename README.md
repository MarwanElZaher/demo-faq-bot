# NovaTech FAQ Bot

**Client:** NovaTech (fictional — internal Maro's LAB delivery validation)
**Built from:** [maros-lab-starter](https://github.com/MarwanElZaher/maros-lab-starter)

An AI-powered internal FAQ assistant. Employees type a question; Claude answers using the company knowledge base stored in PostgreSQL. Prompt caching is on by default.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| AI | Anthropic Claude (`claude-sonnet-4-6`) + prompt caching |
| Database | PostgreSQL + Prisma |
| Hosting | Vercel |

---

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and ANTHROPIC_API_KEY at minimum
docker compose -f docker/docker-compose.yml up -d
npm run db:migrate
npm run db:seed               # loads 7 NovaTech demo FAQ entries
npm run dev                   # → http://localhost:3000
```

---

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/faq` | List all FAQ entries |
| `POST` | `/api/faq` | Ask a question `{ "message": "..." }` |
| `GET` | `/api/health` | Health check (DB connectivity) |

---

## Engagement notes

See the lessons-learned document linked from MAR-5 for friction points discovered during this demo run.
