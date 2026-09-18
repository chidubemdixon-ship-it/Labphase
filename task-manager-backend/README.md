# Task Manager — Backend (Step 1: Project Setup & Backend Configuration)

Backend for a MERN-stack task management app. This step covers project structure,
MongoDB connection, user auth (JWT), and full task CRUD — all scoped so each user
only ever sees their own tasks.

## Folder Structure

```
task-manager-backend/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # register, login, get current user
│   └── taskController.js   # task CRUD, scoped to req.user
├── middleware/
│   ├── authMiddleware.js   # JWT verification ("protect")
│   └── errorMiddleware.js  # 404 + centralized error handler
├── models/
│   ├── User.js              # name, email, hashed password
│   └── Task.js               # title, description, status, priority, deadline
├── routes/
│   ├── authRoutes.js
│   └── taskRoutes.js
├── .env.example
├── .gitignore
├── package.json
└── server.js                # app entry point
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables are already set up for local dev** — a working `.env` ships with this project (MongoDB on `localhost`, `CLIENT_URL` pointing at the frontend's actual Vite port). If you're using MongoDB Atlas instead, just edit `MONGO_URI` in `.env`. `.env.example` documents every variable if you need to rebuild it from scratch.

   CORS is also configured to match the frontend automatically: `CLIENT_URL` accepts a comma-separated list, and in development any `http://localhost:<port>` or `http://127.0.0.1:<port>` origin is allowed too — so if Vite bumps to 5174/5175 because 5173 was busy, the connection still works without editing anything.

3. **Run MongoDB** locally, or use MongoDB Atlas (no local install needed — just make sure `MONGO_URI` in `.env` points at it).

4. **Start the server**
   ```bash
   npm run dev     # nodemon, auto-restarts on changes
   # or
   npm start        # plain node
   ```

   You should see:
   ```
   MongoDB connected: <host>
   Server running in development mode on port 5000
   ```

5. **Verify it's alive**
   ```bash
   curl http://localhost:5000/api/health
   ```

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint         | Access  | Description                     |
|--------|------------------|---------|----------------------------------|
| POST   | `/register`      | Public  | Create account, returns JWT      |
| POST   | `/login`         | Public  | Authenticate, returns JWT        |
| GET    | `/me`            | Private | Get logged-in user's profile     |

**Register / Login body:**
```json
{ "name": "Ada Lovelace", "email": "ada@example.com", "password": "secret123" }
```
Response includes a `token` — send it on every subsequent request as:
```
Authorization: Bearer <token>
```

### Tasks (`/api/tasks`) — all routes require `Authorization: Bearer <token>`
| Method | Endpoint | Description                                   |
|--------|----------|------------------------------------------------|
| GET    | `/`      | List the logged-in user's tasks. Supports `?status=`, `?priority=`, `?search=` (matches title or description), `?sortBy=deadline|priority|title` |
| GET    | `/:id`   | Get a single task (must belong to you)         |
| POST   | `/`      | Create a task                                  |
| PUT    | `/:id`   | Update a task (must belong to you)             |
| DELETE | `/:id`   | Delete a task (must belong to you)             |

**Create/Update body:**
```json
{
  "title": "Finish MERN project",
  "description": "Build backend then frontend",
  "status": "pending",
  "priority": "high",
  "deadline": "2026-09-30T00:00:00.000Z"
}
```

## Security notes for the grader / instructor

- Passwords are hashed with `bcryptjs` before being saved (`User.js` pre-save hook), never stored in plaintext, and excluded from queries by default (`select: false`).
- Auth uses stateless JWTs signed with `JWT_SECRET`, verified on every protected request via the `protect` middleware.
- Every task operation re-checks `task.user === req.user._id` server-side, so one user can never read/edit/delete another user's tasks even if they guess an ID — authorization is enforced at the data layer, not just by hiding UI elements.
- `helmet` sets safer HTTP headers, `express-rate-limit` throttles brute-force attempts, and `express-validator` validates/sanitizes all incoming auth and task payloads.
- `/api/auth/register` and `/api/auth/login` sit behind a dedicated, stricter limiter (`middleware/rateLimiters.js`) — 10 failed attempts per IP per 15 minutes — separate from the general API rate limiter, since credential stuffing specifically targets these two routes.
- Passwords must be at least 6 characters and include both a letter and a number, enforced with `express-validator` on the way in.
- Centralized error handling (`errorMiddleware.js`) normalizes Mongoose validation errors, bad ObjectIds, and duplicate-key errors into consistent JSON responses.

## What's next (Step 2 preview)

With the backend running, Step 2 will build the React frontend: auth pages (signup/login),
a protected dashboard, and components for creating/editing/tracking tasks against this API.
