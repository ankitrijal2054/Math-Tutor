import { auth } from "./firebase";

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL;
const OCR_API_URL = import.meta.env.VITE_OCR_API_URL;

if (!CHAT_API_URL) {
  console.error("VITE_CHAT_API_URL is not defined in environment variables");
}

if (!OCR_API_URL) {
  console.warn(
    "VITE_OCR_API_URL is not defined. OCR features will not work. Please set it in your .env.local file after deploying the OCR Cloud Function."
  );
}

/**
 * Send a message to the chat API and get a Socratic response
 * @param {string} conversationId - The conversation ID
 * @param {string} message - The user's message
 * @returns {Promise<Object>} Response with success status, message, messageId, and timestamp
 */
export async function callChatAPI(conversationId, message) {
  try {
    // Get Firebase ID token for authentication
    if (!auth.currentUser) {
      throw new Error("User not authenticated");
    }

    const token = await auth.currentUser.getIdToken();
    const userId = auth.currentUser.uid;

    // Make API request to Cloud Function
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        message,
        userId,
      }),
    });

    // Parse response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      const errorMessage = data.error || `API Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return {
      success: true,
      message: data.message,
      messageId: data.messageId,
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
}

/**
 * Test the API connectivity (for debugging)
 */
export async function testAPI() {
  try {
    if (!auth.currentUser) {
      throw new Error("User not authenticated");
    }

    const token = await auth.currentUser.getIdToken();

    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: "test",
        message: "Test message",
        userId: auth.currentUser.uid,
      }),
    });

    const data = await response.json();
    console.log("API Test Result:", { status: response.status, data });
    return { status: response.status, data };
  } catch (error) {
    console.error("API Test Failed:", error);
    throw error;
  }
}

/**
 * Send an image to the OCR API for text extraction
 * @param {string} imageDataURL - Base64 encoded image data URL
 * @param {string} conversationId - The conversation ID (for context)
 * @returns {Promise<Object>} Response with extractedText, confidence, and timestamp
 */
export async function callOCRAPI(imageDataURL, conversationId) {
  try {
    // Get Firebase ID token for authentication
    if (!auth.currentUser) {
      throw new Error("User not authenticated");
    }

    if (!OCR_API_URL) {
      throw new Error("OCR_API_URL is not configured");
    }

    const token = await auth.currentUser.getIdToken();

    // Make API request to OCR Cloud Function
    const response = await fetch(OCR_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageDataURL,
        conversationId,
      }),
    });

    // Parse response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      const errorMessage = data.error || `OCR Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return {
      success: true,
      extractedText: data.extractedText,
      confidence: data.confidence,
      timestamp: data.timestamp,
      notes: data.notes,
    };
  } catch (error) {
    console.error("OCR API Error:", error);
    throw error;
  }
}
