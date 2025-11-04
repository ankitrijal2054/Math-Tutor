import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db, auth } from "./firebase";

/**
 * Generate a title from the first message (max 50 characters)
 * @param {string} message - The message to create title from
 * @returns {string} Trimmed title
 */
export const generateConversationTitle = (message) => {
  const maxLength = 50;
  const title = message.trim().replace(/\n/g, " ");
  return title.length > maxLength
    ? title.substring(0, maxLength) + "..."
    : title;
};

/**
 * Create a new conversation
 * @param {string} firstMessage - The first user message
 * @returns {Promise<string>} The conversation ID
 */
export const createConversation = async (firstMessage) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const conversationsRef = collection(db, "conversations");
  const title = generateConversationTitle(firstMessage);

  try {
    const newConvDoc = await addDoc(conversationsRef, {
      userId: auth.currentUser.uid,
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messageCount: 0,
      lastMessage: firstMessage,
    });

    return newConvDoc.id;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw new Error("Failed to create conversation");
  }
};

/**
 * Update conversation metadata
 * @param {string} conversationId - The conversation ID
 * @param {Object} updates - Object with fields to update (title, messageCount, etc)
 * @returns {Promise<void>}
 */
export const updateConversation = async (conversationId, updates) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const conversationRef = doc(db, "conversations", conversationId);

  try {
    await updateDoc(conversationRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating conversation:", error);
    throw new Error("Failed to update conversation");
  }
};

/**
 * Save a message to Firestore
 * @param {string} conversationId - The conversation ID
 * @param {string} role - "user" or "assistant"
 * @param {string} content - Message content
 * @param {string} type - Message type (default "text")
 * @param {Object} additionalData - Additional fields (caption, extractedText, etc)
 * @returns {Promise<string>} The message ID
 */
export const saveMessage = async (
  conversationId,
  role,
  content,
  type = "text",
  additionalData = {}
) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const messagesRef = collection(
    db,
    "conversations",
    conversationId,
    "messages"
  );

  try {
    const messageDoc = await addDoc(messagesRef, {
      role,
      content,
      type,
      timestamp: serverTimestamp(),
      userId: auth.currentUser.uid,
      ...additionalData, // Include caption, extractedText, etc
    });

    // Update conversation metadata
    const conversationRef = doc(db, "conversations", conversationId);
    const conversationSnap = await getDoc(conversationRef);
    const currentCount = conversationSnap.data()?.messageCount || 0;

    await updateDoc(conversationRef, {
      messageCount: currentCount + 1,
      updatedAt: serverTimestamp(),
      lastMessage: additionalData.caption || content,
    });

    return messageDoc.id;
  } catch (error) {
    console.error("Error saving message:", error);
    throw new Error("Failed to save message");
  }
};

/**
 * Load all messages for a conversation
 * @param {string} conversationId - The conversation ID
 * @returns {Promise<Array>} Array of message objects
 */
export const loadMessages = async (conversationId) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const messagesRef = collection(
    db,
    "conversations",
    conversationId,
    "messages"
  );
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  try {
    const snapshot = await getDocs(q);

    const messages = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        role: data.role,
        content: data.content,
        type: data.type || "text",
        caption: data.caption,
        extractedText: data.extractedText,
        timestamp:
          data.timestamp?.toDate?.()?.toISOString?.() ||
          new Date().toISOString(),
        userId: data.userId,
      };
    });

    return messages;
  } catch (error) {
    console.error("Error loading messages:", error);
    throw new Error("Failed to load conversation messages");
  }
};

/**
 * Load a single conversation with metadata
 * @param {string} conversationId - The conversation ID
 * @returns {Promise<Object>} Conversation object with metadata
 */
export const loadConversationMetadata = async (conversationId) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const conversationRef = doc(db, "conversations", conversationId);

  try {
    const snapshot = await getDoc(conversationRef);

    if (!snapshot.exists()) {
      throw new Error("Conversation not found");
    }

    const data = snapshot.data();
    return {
      id: conversationId,
      userId: data.userId,
      title: data.title,
      createdAt:
        data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      updatedAt:
        data.updatedAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      messageCount: data.messageCount || 0,
      lastMessage: data.lastMessage,
    };
  } catch (error) {
    console.error("Error loading conversation metadata:", error);
    throw new Error("Failed to load conversation metadata");
  }
};

/**
 * Load all conversations for the current user
 * @returns {Promise<Array>} Array of conversation objects
 */
export const loadUserConversations = async () => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const conversationsRef = collection(db, "conversations");
  const q = query(
    conversationsRef,
    where("userId", "==", auth.currentUser.uid),
    orderBy("updatedAt", "desc")
  );

  try {
    const snapshot = await getDocs(q);

    const conversations = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        title: data.title,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString?.() ||
          new Date().toISOString(),
        updatedAt:
          data.updatedAt?.toDate?.()?.toISOString?.() ||
          new Date().toISOString(),
        messageCount: data.messageCount || 0,
        lastMessage: data.lastMessage,
      };
    });

    return conversations;
  } catch (error) {
    console.error("Error loading user conversations:", error);
    throw new Error("Failed to load conversations");
  }
};

/**
 * Delete a conversation and all its messages
 * @param {string} conversationId - The conversation ID
 * @returns {Promise<void>}
 */
export const deleteConversation = async (conversationId) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const batch = writeBatch(db);

  try {
    // Delete all messages in the subcollection
    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const messagesSnapshot = await getDocs(messagesRef);

    messagesSnapshot.docs.forEach((msgDoc) => {
      batch.delete(msgDoc.ref);
    });

    // Delete the conversation document
    const conversationRef = doc(db, "conversations", conversationId);
    batch.delete(conversationRef);

    // Commit batch write
    await batch.commit();
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw new Error("Failed to delete conversation");
  }
};
