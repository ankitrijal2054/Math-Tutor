const { onRequest } = require("firebase-functions/https");
const cors = require("cors");
const admin = require("firebase-admin");
const { extractTextFromImage } = require("../utils/openai");
const { OCR_EXTRACTION_PROMPT } = require("../utils/prompts");

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp();
}

// Configure CORS
const corsHandler = cors({
  origin: true,
  credentials: true,
  methods: ["POST", "OPTIONS"],
});

const auth = admin.auth();
const db = admin.firestore();

/**
 * Main OCR endpoint - Extracts text from uploaded images
 * POST /ocr
 * Body: { imageDataURL, conversationId }
 * Header: Authorization: Bearer <Firebase ID Token>
 *
 * Response: {
 *   success: true,
 *   extractedText: string,
 *   confidence: 'high' | 'medium' | 'low',
 *   timestamp: string
 * }
 */
const ocr = onRequest(async (req, res) => {
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

      // ========== 1. AUTHENTICATION VERIFICATION ==========
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ error: "Missing Authorization header" });
        return;
      }

      let decodedToken;
      try {
        decodedToken = await auth.verifyIdToken(token);
      } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
        return;
      }

      const uid = decodedToken.uid;

      // ========== 2. VALIDATE REQUEST BODY ==========
      const { imageDataURL, conversationId } = req.body;

      if (!imageDataURL) {
        res.status(400).json({
          error: "Missing required field: imageDataURL",
        });
        return;
      }

      if (!conversationId) {
        res.status(400).json({
          error: "Missing required field: conversationId",
        });
        return;
      }

      // Validate image data URL format
      if (!imageDataURL.startsWith("data:image/")) {
        res.status(400).json({
          error: "Invalid image format. Must be a valid data URL.",
        });
        return;
      }

      // Validate image size (max 20MB for Vision API)
      const imageSizeInBytes = imageDataURL.length;
      const imageSizeInMB = imageSizeInBytes / (1024 * 1024);
      if (imageSizeInMB > 20) {
        res.status(400).json({
          error: `Image too large (${imageSizeInMB.toFixed(
            2
          )}MB). Maximum size is 20MB.`,
        });
        return;
      }

      if (imageSizeInBytes < 1000) {
        console.warn(
          "OCR: Warning - image seems very small:",
          imageSizeInBytes,
          "bytes"
        );
      }

      // ========== 3. CALL VISION API ==========
      let extractedText;
      try {
        console.log(
          "OCR: Calling Vision API with image size:",
          imageDataURL.length,
          "bytes"
        );
        extractedText = await extractTextFromImage(
          imageDataURL,
          OCR_EXTRACTION_PROMPT,
          {
            model: "gpt-4o-mini",
            maxTokens: 300,
          }
        );
        console.log(
          "OCR: Vision API returned:",
          extractedText.substring(0, 100)
        );
      } catch (error) {
        console.error("Vision API Error:", error.message);
        res.status(500).json({
          error: "Failed to extract text from image",
          details: error.message,
        });
        return;
      }

      // ========== 4. NORMALIZE EXTRACTED TEXT ==========
      if (!extractedText || typeof extractedText !== "string") {
        res.status(422).json({
          error: "No text extracted from image",
          extractedText: "",
          confidence: "low",
        });
        return;
      }

      // Check for special markers that indicate extraction issues
      const isUnclear = extractedText.includes("[IMAGE_TOO_UNCLEAR]");
      const notMathProblem = extractedText.includes("[NOT_A_MATH_PROBLEM]");

      if (isUnclear) {
        res.status(422).json({
          error: "Image too blurry or unclear to extract text",
          extractedText: "",
          confidence: "low",
        });
        return;
      }

      if (notMathProblem) {
        res.status(422).json({
          error: "Image does not appear to contain a math problem",
          extractedText: "",
          confidence: "low",
        });
        return;
      }

      // Normalize whitespace
      const normalized = extractedText
        .trim() // Remove leading/trailing whitespace
        .replace(/\n\n+/g, "\n") // Remove multiple consecutive newlines
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim();

      if (normalized.length === 0) {
        res.status(422).json({
          error: "No text could be extracted from the image",
          extractedText: "",
          confidence: "low",
        });
        return;
      }

      // Determine confidence level based on text quality
      // High: Multiple lines or long text, likely complete problem
      // Medium: Standard extraction, readable
      // Low: Short or ambiguous text
      let confidence = "medium";
      const lineCount = normalized.split("\n").length;
      const hasUnclearMarker = normalized.includes("[UNCLEAR");
      const hasDiagramMarker = normalized.includes("[DIAGRAM");

      if (lineCount > 2 && !hasUnclearMarker) {
        confidence = "high";
      } else if (hasUnclearMarker || normalized.length < 20) {
        confidence = "low";
      }

      // ========== 5. SAVE OCR RESULT TO FIRESTORE (optional) ==========
      try {
        await db
          .collection("conversations")
          .doc(conversationId)
          .collection("ocrHistory")
          .add({
            originalText: extractedText,
            normalizedText: normalized,
            confidence,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            uid,
          });
      } catch (error) {
        console.warn("Warning: Could not save OCR history to Firestore", error);
        // Non-critical error; don't fail the request
      }

      // ========== 6. RETURN RESPONSE ==========
      res.status(200).json({
        success: true,
        extractedText: normalized,
        confidence,
        timestamp: new Date().toISOString(),
        notes:
          hasDiagramMarker || hasUnclearMarker
            ? "Review extraction carefully; some parts may need clarification"
            : undefined,
      });
    } catch (error) {
      console.error("Unexpected error in OCR endpoint:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

module.exports = { ocr };
