const { onRequest } = require("firebase-functions/https");
const cors = require("cors");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

// Load .env file in development (for local testing)
if (process.env.NODE_ENV !== "production") {
  try {
    require("dotenv").config();
  } catch (e) {
    // dotenv not installed, that's okay for production
  }
}

const { OpenAI } = require("openai");

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp();
}

// Configure CORS - same as chat.js and ocr.js
const corsHandler = cors({
  origin: true,
  credentials: true,
  methods: ["POST", "OPTIONS"],
});

const db = admin.firestore();
const auth = admin.auth();

// OpenAI client - lazy initialized on first use
let openaiClient;

function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY environment variable is not set. Please set it before making TTS API calls."
      );
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

// Available voices from OpenAI TTS API
const AVAILABLE_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

// Rate limiting constants (per user)
const DAILY_LIMIT = 500; // TTS calls per day
const HOUR_LIMIT = 100; // TTS calls per hour

/**
 * Check rate limits for the user
 * @param {string} userId - Firebase user ID
 * @returns {Promise<{allowed: boolean, callsRemaining: number, resetTime: Date}>}
 */
async function checkRateLimit(userId) {
  try {
    const userRef = db.collection("ttsUsage").doc(userId);
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const thisHour = new Date(now);
    thisHour.setMinutes(0, 0, 0);

    const doc = await userRef.get();
    let data = doc.data() || {};

    // Initialize counts if not present
    if (
      !data.dailyUsage ||
      new Date(data.dailyDate).toDateString() !== today.toDateString()
    ) {
      data.dailyUsage = 0;
      data.dailyDate = today;
    }
    if (
      !data.hourlyUsage ||
      new Date(data.hourlyDate).getTime() !== thisHour.getTime()
    ) {
      data.hourlyUsage = 0;
      data.hourlyDate = thisHour;
    }

    const dailyRemaining = DAILY_LIMIT - data.dailyUsage;
    const hourlyRemaining = HOUR_LIMIT - data.hourlyUsage;

    if (data.dailyUsage >= DAILY_LIMIT) {
      const resetTime = new Date(data.dailyDate);
      resetTime.setDate(resetTime.getDate() + 1);
      return {
        allowed: false,
        reason: "daily",
        callsRemaining: 0,
        resetTime,
      };
    }

    if (data.hourlyUsage >= HOUR_LIMIT) {
      const resetTime = new Date(data.hourlyDate);
      resetTime.setHours(resetTime.getHours() + 1);
      return {
        allowed: false,
        reason: "hourly",
        callsRemaining: 0,
        resetTime,
      };
    }

    return {
      allowed: true,
      callsRemaining: Math.min(dailyRemaining, hourlyRemaining),
      resetTime: new Date(data.dailyDate + DAILY_LIMIT * 24 * 60 * 60 * 1000),
    };
  } catch (error) {
    logger.error("Error checking rate limit:", error);
    throw new Error("Failed to check rate limits");
  }
}

/**
 * Update rate limit usage after successful TTS call
 * @param {string} userId - Firebase user ID
 * @returns {Promise<void>}
 */
async function updateRateLimitUsage(userId) {
  try {
    const userRef = db.collection("ttsUsage").doc(userId);
    const now = new Date();

    await userRef.update({
      dailyUsage: admin.firestore.FieldValue.increment(1),
      hourlyUsage: admin.firestore.FieldValue.increment(1),
      lastUsed: now,
    });
  } catch (error) {
    logger.error("Error updating rate limit usage:", error);
    // Don't throw - non-critical
  }
}

/**
 * Cloud Function: Convert text to speech using OpenAI TTS API
 * POST /tts
 * Request body: { text, voice, speed, format }
 * Response: { audio, callsRemaining, mimeType }
 */
const tts = onRequest(async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      // Handle OPTIONS request
      if (req.method === "OPTIONS") {
        res.status(200).send("OK");
        return;
      }

      if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
      }

      // 1. Authenticate user
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ error: "Missing Authorization header" });
        return;
      }

      let userId;
      try {
        const decodedToken = await auth.verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (error) {
        logger.error("Auth verification failed:", error);
        res
          .status(401)
          .json({ error: "Invalid or expired authentication token" });
        return;
      }

      // 2. Validate input
      const { text, voice = "nova", speed = 1.0, format = "mp3" } = req.body;

      if (!text || typeof text !== "string") {
        res
          .status(400)
          .json({ error: "Text input is required and must be a string" });
        return;
      }

      if (text.length > 4096) {
        res.status(400).json({ error: "Text cannot exceed 4096 characters" });
        return;
      }

      if (text.trim().length === 0) {
        res.status(400).json({ error: "Text cannot be empty" });
        return;
      }

      if (!AVAILABLE_VOICES.includes(voice)) {
        res.status(400).json({
          error: `Invalid voice. Available voices: ${AVAILABLE_VOICES.join(
            ", "
          )}`,
        });
        return;
      }

      if (speed < 0.25 || speed > 4.0) {
        res.status(400).json({ error: "Speed must be between 0.25 and 4.0" });
        return;
      }

      if (!["mp3", "opus", "aac", "flac", "wav", "pcm"].includes(format)) {
        res.status(400).json({
          error: "Invalid format. Supported: mp3, opus, aac, flac, wav, pcm",
        });
        return;
      }

      // 3. Check rate limits
      const rateLimitCheck = await checkRateLimit(userId);
      if (!rateLimitCheck.allowed) {
        const resetTime = rateLimitCheck.resetTime.toISOString();
        res.status(429).json({
          error: `Rate limit exceeded (${rateLimitCheck.reason}). Resets at ${resetTime}`,
        });
        return;
      }

      // 4. Call OpenAI TTS API
      logger.info(
        `Generating TTS for user ${userId}: voice=${voice}, length=${text.length}`
      );

      const openai = getOpenAIClient();

      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice,
        input: text,
        speed,
        response_format: format,
      });

      // 5. Convert response to base64
      const audioBuffer = await response.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString("base64");

      // 6. Update usage tracking
      await updateRateLimitUsage(userId);

      // Get updated remaining calls
      const updatedLimit = await checkRateLimit(userId);

      logger.info(`TTS generated successfully for user ${userId}`);

      res.status(200).json({
        success: true,
        audio: audioBase64,
        format,
        callsRemaining: updatedLimit.callsRemaining,
        mimeType: `audio/${format === "opus" ? "ogg" : format}`,
      });
    } catch (error) {
      logger.error("TTS API Error:", error);

      // Send user-friendly error message
      const errorMessage =
        error.message || "An error occurred while generating speech";

      res.status(500).json({
        error: errorMessage,
      });
    }
  });
});

module.exports = { tts };
