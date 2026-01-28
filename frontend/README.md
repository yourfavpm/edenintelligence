# EdenSummariser Frontend

Next.js + TypeScript + Tailwind frontend scaffold for the Meeting Intelligence product.

Commands:

```bash
cd frontend
npm install
npm run dev
```

Notes:
- The frontend expects the backend base URL in `NEXT_PUBLIC_API_BASE`.
- Authentication uses http-only cookies; fetch requests include `credentials: 'include'`.
- Pages call backend endpoints (e.g., `/dashboard/meetings`, `/summaries`, `/transcripts`).
