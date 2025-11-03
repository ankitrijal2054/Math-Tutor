const { onRequest } = require("firebase-functions/https");
const cors = require("cors");
const admin = require("firebase-admin");
const { callChatCompletion } = require("../utils/openai");
const { SOCRATIC_SYSTEM_PROMPT } = require("../utils/prompts");

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
 * Main chat endpoint - Handles Socratic dialogue
 * POST /chat
 * Body: { conversationId, message, userId }
 * Header: Authorization: Bearer <Firebase ID Token>
 */
const chat = onRequest(async (req, res) => {
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
      const { conversationId, message, userId } = req.body;

      if (!conversationId || !message || !userId) {
        res.status(400).json({
          error: "Missing required fields: conversationId, message, userId",
        });
        return;
      }

      if (uid !== userId) {
        res.status(403).json({ error: "User ID mismatch" });
        return;
      }

      // ========== 3. FETCH CONVERSATION CONTEXT ==========
      let messageHistory = [];
      let conversationExists = false;

      try {
        const conversationDoc = await db
          .collection("conversations")
          .doc(conversationId)
          .get();

        if (conversationDoc.exists) {
          conversationExists = true;

          // Fetch last 15 messages for context
          const messagesSnapshot = await db
            .collection("conversations")
            .doc(conversationId)
            .collection("messages")
            .orderBy("timestamp", "desc")
            .limit(15)
            .get();

          // Reverse to chronological order
          messageHistory = messagesSnapshot.docs.reverse().map((doc) => {
            const data = doc.data();
            return {
              role: data.role, // 'user' or 'assistant'
              content: data.content,
            };
          });
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ error: "Failed to fetch conversation history" });
        return;
      }

      // ========== 4. BUILD MESSAGES FOR OPENAI ==========
      const messagesForOpenAI = [
        {
          role: "system",
          content: SOCRATIC_SYSTEM_PROMPT,
        },
        ...messageHistory,
        {
          role: "user",
          content: message,
        },
      ];

      // ========== 5. CALL OPENAI API ==========
      let aiResponse;
      try {
        const completion = await callChatCompletion(messagesForOpenAI, {
          model: "gpt-4o-mini",
          temperature: 0.7,
          maxTokens: 500,
        });

        aiResponse = completion.choices[0].message.content;
      } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).json({
          error: "Failed to generate response. Please try again.",
          details: error.message,
        });
        return;
      }

      // ========== 6. SAVE MESSAGES TO FIRESTORE ==========
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      const userMessageRef = db
        .collection("conversations")
        .doc(conversationId)
        .collection("messages")
        .doc();

      const assistantMessageRef = db
        .collection("conversations")
        .doc(conversationId)
        .collection("messages")
        .doc();

      try {
        // Save user message
        await userMessageRef.set({
          role: "user",
          content: message,
          timestamp,
          type: "text",
          userId,
        });

        // Save assistant message
        await assistantMessageRef.set({
          role: "assistant",
          content: aiResponse,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          type: "text",
        });

        // Update conversation's lastMessageAt
        await db.collection("conversations").doc(conversationId).update({
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          lastMessage: message,
        });

        // If conversation doesn't exist, create it
        if (!conversationExists) {
          await db.collection("conversations").doc(conversationId).set(
            {
              userId,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              lastMessage: message,
              messageCount: 1,
            },
            { merge: true }
          );
        }
      } catch (error) {
        console.error("Error saving messages:", error);
        res.status(500).json({ error: "Failed to save conversation" });
        return;
      }

      // ========== 7. RETURN RESPONSE ==========
      res.status(200).json({
        success: true,
        message: aiResponse,
        messageId: assistantMessageRef.id,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Unexpected error in chat endpoint:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

module.exports = { chat };
