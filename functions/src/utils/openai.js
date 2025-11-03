// Load .env file in development (for local testing)
if (process.env.NODE_ENV !== "production") {
  try {
    require("dotenv").config();
  } catch (e) {
    // dotenv not installed, that's okay for production
  }
}

const { OpenAI } = require("openai");

// Lazy-initialize OpenAI client on first use
let client;

function getOpenAIClient() {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY environment variable is not set. Please set it before making API calls."
      );
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

/**
 * Exponential backoff retry helper
 * @param {number} attempt - Current attempt number (0-indexed)
 * @returns {number} - Delay in milliseconds
 */
function getBackoffDelay(attempt) {
  const baseDelay = 1000; // 1 second
  const maxDelay = 16000; // 16 seconds
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add jitter (±10%)
  return delay * (0.9 + Math.random() * 0.2);
}

/**
 * Call OpenAI Chat Completion API with retry logic
 * @param {Array} messages - Message history in OpenAI format
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - OpenAI completion response
 */
async function callChatCompletion(messages, options = {}) {
  const {
    model = "gpt-4o-mini",
    temperature = 0.7,
    maxTokens = 500,
    maxRetries = 3,
  } = options;

  let lastError;
  const openai = getOpenAIClient();

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      return response;
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      const isRetryable =
        error.status === 429 || // Rate limit
        error.status === 500 || // Server error
        error.status === 502 || // Bad gateway
        error.status === 503 || // Service unavailable
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT";

      if (!isRetryable || attempt === maxRetries) {
        break;
      }

      // Wait before retrying
      const delay = getBackoffDelay(attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // If we get here, all retries failed
  const errorMessage = lastError.message || "Unknown OpenAI API error";
  const errorCode = lastError.status || lastError.code || "UNKNOWN_ERROR";

  throw new Error(`OpenAI API Error (${errorCode}): ${errorMessage}`);
}

module.exports = { callChatCompletion };
