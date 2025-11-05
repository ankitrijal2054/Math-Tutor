const { onRequest } = require("firebase-functions/https");
const cors = require("cors");
const admin = require("firebase-admin");
const { callChatCompletion } = require("../utils/openai");
const { PROBLEM_GENERATION_PROMPT } = require("../utils/prompts");

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

const db = admin.firestore();
const auth = admin.auth();

/**
 * Generate practice problems similar to a given solved problem
 * POST /generateProblems
 * Body: { solvedProblem, numberOfProblems?, userId }
 * Header: Authorization: Bearer <Firebase ID Token>
 */
const generateProblems = onRequest(async (req, res) => {
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
        console.error("Token verification error:", error.message);
        res.status(401).json({ error: "Invalid or expired token" });
        return;
      }

      // ========== 2. VALIDATE REQUEST BODY ==========
      const { solvedProblem, numberOfProblems = 3, userId } = req.body;

      // Verify user ID matches token
      if (userId !== decodedToken.uid) {
        res.status(403).json({ error: "User ID mismatch" });
        return;
      }

      // Validate input
      if (!solvedProblem || typeof solvedProblem !== "string") {
        res
          .status(400)
          .json({ error: "solvedProblem is required and must be a string" });
        return;
      }

      if (solvedProblem.trim().length === 0) {
        res.status(400).json({ error: "solvedProblem cannot be empty" });
        return;
      }

      const numProblems = Math.min(
        Math.max(parseInt(numberOfProblems) || 3, 1),
        5
      );
      const problemCharLimit = 2000;

      if (solvedProblem.length > problemCharLimit) {
        res.status(400).json({
          error: `Problem text exceeds ${problemCharLimit} characters`,
        });
        return;
      }

      // ========== 3. CHECK RATE LIMITING ==========
      const uid = decodedToken.uid;
      const today = new Date().toISOString().split("T")[0];
      const generationUsageRef = db.collection("generationUsage").doc(uid);

      const usageDoc = await generationUsageRef.get();
      const currentUsage = usageDoc.data() || {};

      // Daily limit: 50 generations
      // Hourly limit: 10 generations
      if (!currentUsage[today]) {
        currentUsage[today] = 0;
      }

      const currentHour = new Date().toISOString().split(":")[0];
      const hourKey = `${today}-${currentHour}`;

      if (!currentUsage[hourKey]) {
        currentUsage[hourKey] = 0;
      }

      if (currentUsage[today] >= 50) {
        res.status(429).json({
          error: "Daily generation limit reached (50 per day)",
          retryAfter: 86400,
        });
        return;
      }

      if (currentUsage[hourKey] >= 10) {
        res.status(429).json({
          error: "Hourly generation limit reached (10 per hour)",
          retryAfter: 3600,
        });
        return;
      }

      // ========== 4. CALL OPENAI API ==========
      const userMessage = `Generate ${numProblems} practice problems similar to this one:

${solvedProblem}

Make sure each generated problem covers the same mathematical concept but with different numbers and context.`;

      let generatedContent;
      try {
        const completion = await callChatCompletion([
          {
            role: "system",
            content: PROBLEM_GENERATION_PROMPT,
          },
          {
            role: "user",
            content: userMessage,
          },
        ]);

        generatedContent = completion.choices[0].message.content;
      } catch (error) {
        console.error("OpenAI API error:", error.message);
        if (error.message.includes("429")) {
          res.status(429).json({
            error: "API rate limit exceeded. Please try again in a moment.",
          });
        } else if (error.message.includes("500")) {
          res.status(503).json({
            error: "OpenAI service temporarily unavailable. Please try again.",
          });
        } else {
          res.status(500).json({
            error: "Failed to generate problems. Please try again.",
          });
        }
        return;
      }

      // ========== 5. PARSE GENERATED PROBLEMS ==========
      let problems;
      try {
        // Extract JSON from response (in case model adds extra text)
        const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in response");
        }

        const parsed = JSON.parse(jsonMatch[0]);
        if (!parsed.problems || !Array.isArray(parsed.problems)) {
          throw new Error("Invalid response structure");
        }

        problems = parsed.problems.slice(0, numProblems);

        // Validate each problem
        for (let i = 0; i < problems.length; i++) {
          if (!problems[i].text || typeof problems[i].text !== "string") {
            throw new Error(`Problem ${i + 1} missing valid text field`);
          }
          if (!problems[i].difficulty) {
            problems[i].difficulty = "medium";
          }
        }
      } catch (error) {
        console.error("JSON parsing error:", error.message);
        res.status(500).json({
          error: "Failed to parse generated problems",
          details: error.message,
        });
        return;
      }

      // ========== 6. UPDATE USAGE TRACKING ==========
      currentUsage[today] = (currentUsage[today] || 0) + 1;
      currentUsage[hourKey] = (currentUsage[hourKey] || 0) + 1;
      currentUsage.lastUsed = admin.firestore.FieldValue.serverTimestamp();

      try {
        await generationUsageRef.set(currentUsage);
      } catch (error) {
        console.error("Usage update error (non-blocking):", error.message);
        // Continue anyway - usage tracking is non-critical
      }

      // ========== 7. RETURN RESPONSE ==========
      res.status(200).json({
        success: true,
        problems: problems,
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Unexpected error in generateProblems:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  });
});

module.exports = { generateProblems };
