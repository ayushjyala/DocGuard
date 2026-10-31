# DocGuard Frontend

React + Vite + Tailwind dashboard for DocGuard (Team OdeX, Hacktoberfest 2026 Hack Day Sonipat).

## Run
```bash
cd frontend
cp .env.example .env     # VITE_API_BASE_URL=http://localhost:8000
npm install
npm run dev              # http://localhost:5173
npm run build            # production build in dist/
```

## Modes
- **Live** (default): calls `GET /health`, `GET /api/model-status`, `POST /api/analyze`. If the backend is down you get an error. Sample data is never substituted.
- **Demo**: toggle in the top bar (or "View Demo" on the landing page). Uses `src/data/demoData.js`; every screen shows a "sample data" banner.

## When the backend schema changes
Edit **only** `src/services/api.js` (`ENDPOINTS`, `normalizeFinding`, `normalizeAnalysis`). Optional fields (confidence, changed_files, documentation_files) render only when the backend sends them.

## Notes
- Live analyses are kept in this browser's localStorage (no database). History page tries an optional `GET /api/history` and falls back to the local list.
- Backend needs CORS enabled for `http://localhost:5173` (FastAPI `CORSMiddleware`).
