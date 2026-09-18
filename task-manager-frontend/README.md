# Ledger — Task Manager Frontend (Step 2)

A React frontend for the task management app, built to sit on top of the
`task-manager-backend` API from Step 1. Tasks are presented as entries in a
running ledger rather than a generic card grid — each row shows its due date,
a priority mark, and a stamp of status, laid out left-to-right like a real
account book.

## Stack

React 18 · React Router 6 · Tailwind CSS · Axios · date-fns · Vite

## Folder Structure

```
task-manager-frontend/
├── index.html
├── src/
│   ├── main.jsx                 # entry point, wraps app in Router + AuthProvider
│   ├── App.jsx                  # route table
│   ├── index.css                # Tailwind + base styles
│   ├── api/
│   │   └── axios.js             # configured axios instance, attaches JWT, handles 401
│   ├── context/
│   │   └── AuthContext.jsx      # session state: login, signup, logout, current user
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx   # redirects to /login if not authenticated
│   │   ├── TaskRow.jsx          # one ledger entry
│   │   ├── TaskList.jsx
│   │   ├── TaskFormModal.jsx    # create/edit form
│   │   ├── ConfirmDialog.jsx    # delete confirmation
│   │   └── EmptyState.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx        # the ledger itself
│   │   └── NotFound.jsx
│   └── utils/
│       └── date.js              # ledger date-column formatting
├── tailwind.config.js           # custom palette: ink / paper / stamp / wax / ledger
├── package.json
└── .env.example
```

## Setup

1. **Make sure the backend from Step 1 is running** on `http://localhost:5000`
   (or wherever you've deployed it).

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **The API URL is already configured** — a working `.env` ships with this project, pointing at `http://localhost:5000/api` to match the backend's default port. Only edit it if your backend runs somewhere else.
   ```bash
   cat .env   # VITE_API_URL=http://localhost:5000/api
   ```

4. **Run it**
   ```bash
   npm run dev
   ```
   Open the printed local URL (typically `http://localhost:5173`).

5. **Build for production**
   ```bash
   npm run build     # outputs to dist/
   npm run preview   # serve the production build locally to check it
   ```

## What it does

- **Sign up / sign in** against the backend's JWT auth endpoints; the token is
  kept in `localStorage` and attached to every API request automatically.
- **Filter, search, and sort**: status tabs (All / Pending / In progress / Completed) with live counts, a search box that matches against title and notes, and a sort dropdown (deadline soonest, priority highest, title A–Z, newest first). All three combine — e.g. search within "Pending" sorted by priority.
- **Add / edit / delete** tasks through a modal form (title, notes, due date,
  priority, and — when editing — status).
- **One-tap complete**: the circular mark on each row toggles a task between
  pending and completed with an optimistic UI update (rolls back if the
  request fails).
- **Session handling**: an expired or invalid token automatically clears the
  session and returns you to the sign-in screen rather than leaving you stuck.

## Design notes

The visual language is a "ledger," not a SaaS dashboard: hairline-divided
rows instead of shadowed cards, a stacked day/month date column on the left
of each entry, and a single amber "stamp" accent reserved for the primary
action and near-due markers. Headings use Spectral (serif) for a bound-book
feel; UI text uses Work Sans. Full palette and type roles are defined in
`tailwind.config.js`.

## Connecting to Step 1's backend

This frontend expects the exact response shapes from the Step 1 API:
- `POST /api/auth/register` / `POST /api/auth/login` → `{ data: { _id, name, email, token } }`
- `GET /api/auth/me` → `{ data: { _id, name, email } }`
- `GET /api/tasks` → `{ data: [ { _id, title, description, status, priority, deadline, ... } ] }`
- `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`

If you change the backend's response shape, update `AuthContext.jsx` and
`Dashboard.jsx` accordingly.
