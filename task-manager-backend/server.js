const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to MongoDB
connectDB();

const app = express();

// --- Security & utility middleware ---
app.use(helmet()); // sets sensible security-related HTTP headers
// --- CORS ---
// CLIENT_URL supports a single origin or a comma-separated list, e.g.
// "http://localhost:5173,https://myapp.vercel.app". In development, any
// localhost/127.0.0.1 origin is also allowed automatically — Vite bumps
// to 5174, 5175, etc. if 5173 is already taken, and hardcoding one port
// would silently break the connection when that happens.
const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isLocalhostOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

// Vercel gives every branch, PR, and commit its own preview URL in addition
// to the stable production one (e.g. task-manager-frontend-git-main-xxx,
// task-manager-frontend-<hash>-xxx). Rather than whitelist each one by
// hand, allow any *.vercel.app subdomain that starts with the same project
// name as the configured CLIENT_URL, so preview deploys aren't blocked.
const vercelProjectPattern = (() => {
  try {
    const host = new URL(configuredOrigins[0]).hostname;
    const projectName = host.split('.vercel.app')[0].split('-').slice(0, 3).join('-');
    return new RegExp(`^https:\\/\\/${projectName}[a-z0-9-]*\\.vercel\\.app$`);
  } catch {
    return null;
  }
})();

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (curl, Postman, server-to-server) which
      // send no Origin header at all.
      if (!origin) return callback(null, true);

      if (configuredOrigins.includes(origin)) return callback(null, true);

      if (vercelProjectPattern && vercelProjectPattern.test(origin)) {
        return callback(null, true);
      }

      if (process.env.NODE_ENV !== 'production' && isLocalhostOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS: origin "${origin}" is not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' })); // parse JSON bodies
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // log requests in dev
}

// Basic rate limiting to slow down brute-force / abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Task Manager API is running' });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

// Gracefully handle unhandled promise rejections (e.g. DB connection issues)
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;