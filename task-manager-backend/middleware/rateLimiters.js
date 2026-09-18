const rateLimit = require('express-rate-limit');

/**
 * Strict limiter for login/register attempts specifically. Brute-forcing
 * credentials is the main threat here, so this is far tighter than the
 * general API rate limiter in server.js.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only failed attempts count against the limit
  message: {
    success: false,
    message: 'Too many attempts. Please wait a few minutes before trying again.',
  },
});

module.exports = { authLimiter };
