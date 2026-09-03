/**
 * Client-side Rate Limiter & Anti-Spam Guard
 * Protects browser memory, prevents automated bot hammering,
 * and throttles rapid repeated tool executions.
 */

const requestLog = new Map();

/**
 * Check if an action is permitted under rate limits.
 * @param {string} actionKey - Unique key for the action (e.g. "tool_execution_word-counter")
 * @param {number} maxRequests - Maximum allowed executions in the time window (default: 30)
 * @param {number} windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns {{ allowed: boolean, remaining: number, retryAfterSec: number }}
 */
export function checkRateLimit(actionKey = "global", maxRequests = 30, windowMs = 60000) {
  const now = Date.now();
  const timestamps = requestLog.get(actionKey) || [];

  // Filter out timestamps outside the current sliding window
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldestTimestamp = validTimestamps[0];
    const retryAfterSec = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, retryAfterSec),
    };
  }

  // Record new execution
  validTimestamps.push(now);
  requestLog.set(actionKey, validTimestamps);

  return {
    allowed: true,
    remaining: maxRequests - validTimestamps.length,
    retryAfterSec: 0,
  };
}

/**
 * Reset rate limit history for testing or clearing
 */
export function resetRateLimits() {
  requestLog.clear();
}
