import { createContext, useContext, useState, useCallback } from "react";
import { auth } from "../services/firebase";
import { callChatAPI, callOCRAPI } from "../services/api";
import {
  createConversation,
  loadMessages,
  loadConversationMetadata,
  updateConversation,
  uploadImageToStorage,
  saveMessage,
} from "../services/firestore";
import toast from "react-hot-toast";

const ChatContext = createContext(null);

/**
 * ChatProvider component that wraps the app and provides chat state
 */
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [conversationMetadata, setConversationMetadata] = useState(null);

  // OCR state management
  const [ocrState, setOCRState] = useState({
    isProcessing: false,
    imageDataURL: null,
    extractedText: null,
    confidence: null,
    error: null,
    originalImage: null, // Store original image for re-upload flow
  });

  /**
   * Process image with OCR and show confirmation
   */
  const processImageWithOCR = useCallback(
    async (imageDataURL) => {
      try {
        setOCRState((prev) => ({
          ...prev,
          isProcessing: true,
          error: null,
          imageDataURL,
          originalImage: imageDataURL,
        }));

        // Create conversation if it doesn't exist yet (lazy creation)
        let convId = conversationId;
        if (!convId) {
          convId = await createConversation("Image upload");
          setConversationId(convId);

          // Initialize metadata for new conversation
          setConversationMetadata({
            id: convId,
            userId: auth.currentUser.uid,
            title: "Image upload",
            messageCount: 0,
            lastMessage: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        // Call OCR API with conversation ID
        const result = await callOCRAPI(imageDataURL, convId);

        setOCRState((prev) => ({
          ...prev,
          isProcessing: false,
          extractedText: result.extractedText,
          confidence: result.confidence,
          error: null,
        }));

        toast.success("Text extracted successfully!");
      } catch (err) {
        console.error("OCR error:", err);
        setOCRState((prev) => ({
          ...prev,
          isProcessing: false,
          error: err.message || "Failed to extract text from image",
          extractedText: null,
          confidence: null,
        }));
        toast.error("Failed to extract text from image");
      }
    },
    [conversationId]
  );

  /**
   * Clear OCR state
   */
  const clearOCRState = useCallback(() => {
    setOCRState({
      isProcessing: false,
      imageDataURL: null,
      extractedText: null,
      confidence: null,
      error: null,
      originalImage: null,
    });
  }, []);

  /**
   * Send confirmed OCR text as message
   */
  const sendConfirmedOCRText = useCallback(
    async (confirmedText, imageDataURL) => {
      try {
        setError(null);
        setIsLoading(true);

        // Create conversation if it doesn't exist yet (lazy creation)
        let convId = conversationId;
        if (!convId) {
          convId = await createConversation(confirmedText);
          setConversationId(convId);

          // Initialize metadata for new conversation
          setConversationMetadata({
            id: convId,
            userId: auth.currentUser.uid,
            title: confirmedText.trim().substring(0, 50),
            messageCount: 0,
            lastMessage: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        // Upload image to Firebase Storage to get a URL (not base64)
        const imageStorageURL = await uploadImageToStorage(
          imageDataURL,
          convId
        );

        // Save image message to Firestore and get the message ID
        const messageId = await saveMessage(
          convId,
          "user",
          imageStorageURL,
          "image",
          {
            caption: confirmedText,
            extractedText: confirmedText,
          }
        );

        // Add user message with the real ID from Firestore
        const userMessageObj = {
          id: messageId,
          role: "user",
          type: "image",
          content: imageStorageURL,
          caption: confirmedText,
          extractedText: confirmedText,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessageObj]);

        // Send extracted text to chat API
        const response = await callChatAPI(convId, confirmedText);

        if (!response.success) {
          throw new Error(response.error || "Failed to get response");
        }

        // Add AI response
        const aiMessageObj = {
          id: response.messageId,
          role: "assistant",
          type: "text",
          content: response.message,
          timestamp: response.timestamp,
        };

        setMessages((prev) => [...prev, aiMessageObj]);

        // Update conversation title if first message
        if (messages.length === 0) {
          const title = confirmedText.trim().substring(0, 50);
          await updateConversation(convId, { title });
          setConversationMetadata((prev) => ({
            ...prev,
            title,
          }));
        }

        // Clear OCR state and show success
        clearOCRState();
        toast.success("Problem sent to tutor!");
        setIsLoading(false);
      } catch (err) {
        console.error("Send message error:", err);
        setError(err.message);
        setIsLoading(false);
        toast.error(err.message || "Failed to send message. Please try again.");
      }
    },
    [conversationId, messages.length, clearOCRState]
  );

  /**
   * Send a message and get AI response
   */
  const sendMessage = useCallback(
    async (userMessageData) => {
      try {
        setError(null);

        // Handle both old string format and new object format
        let messageType = "text";
        let messageContent = "";
        let messageCaption = "";

        if (typeof userMessageData === "string") {
          // Legacy string format
          messageContent = userMessageData;
        } else if (typeof userMessageData === "object") {
          messageType = userMessageData.type || "text";
          messageContent = userMessageData.content || "";
          messageCaption = userMessageData.caption || "";
        }

        if (!messageContent.trim()) {
          setError("Message cannot be empty");
          return;
        }

        // If this is an image, trigger OCR flow instead of direct send
        if (messageType === "image") {
          await processImageWithOCR(messageContent);
          return;
        }

        // Create conversation if it doesn't exist yet (lazy creation)
        let convId = conversationId;
        if (!convId) {
          convId = await createConversation(messageContent);
          setConversationId(convId);

          // Initialize metadata for new conversation
          setConversationMetadata({
            id: convId,
            userId: auth.currentUser.uid,
            title: messageContent.trim().substring(0, 50),
            messageCount: 0,
            lastMessage: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        // Build additional data - only include caption if it has a value
        const additionalData = {};
        if (messageCaption) {
          additionalData.caption = messageCaption;
        }

        // Save user message to Firestore FIRST (before API call)
        const userMessageId = await saveMessage(
          convId,
          "user",
          messageContent,
          messageType,
          additionalData
        );

        // Create user message object with REAL Firestore ID
        const userMessageObj = {
          id: userMessageId,
          role: "user",
          type: messageType,
          content: messageContent,
          ...(messageCaption && { caption: messageCaption }),
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessageObj]);
        setIsLoading(true);

        // For image messages, send text description to API
        const apiMessageContent =
          messageType === "image" && messageCaption
            ? `[Image uploaded] ${messageCaption}`
            : messageType === "image"
            ? "[Image uploaded]"
            : messageContent;

        // Call the backend API
        const response = await callChatAPI(convId, apiMessageContent);

        if (!response.success) {
          throw new Error(response.error || "Failed to get response");
        }

        // Add AI response to messages (backend already saved it)
        const aiMessageObj = {
          id: response.messageId,
          role: "assistant",
          type: "text",
          content: response.message,
          timestamp: response.timestamp,
        };

        setMessages((prev) => [...prev, aiMessageObj]);

        // Update conversation title if first message
        if (messages.length === 0) {
          const title = (messageCaption || messageContent)
            .trim()
            .substring(0, 50);
          await updateConversation(convId, { title });
          setConversationMetadata((prev) => ({
            ...prev,
            title,
          }));
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Send message error:", err);
        setError(err.message);
        setIsLoading(false);

        // Show error toast
        toast.error(err.message || "Failed to send message. Please try again.");

        // Remove the user message on error (it was already saved but failed to get response)
        setMessages((prev) => prev.slice(0, -1));
      }
    },
    [conversationId, messages.length, processImageWithOCR]
  );

  /**
   * Load conversation messages and metadata from Firestore
   */
  const loadConversation = useCallback(async (convId) => {
    try {
      setError(null);
      setIsLoading(true);
      setConversationId(convId);

      // Load messages
      const loadedMessages = await loadMessages(convId);
      setMessages(loadedMessages);

      // Load conversation metadata
      const metadata = await loadConversationMetadata(convId);
      setConversationMetadata(metadata);

      setIsLoading(false);
    } catch (err) {
      console.error("Load conversation error:", err);
      setError(err.message);
      setIsLoading(false);
      toast.error("Failed to load conversation");
    }
  }, []);

  /**
   * Switch to a different conversation
   * Clears current messages and loads new conversation
   */
  const switchConversation = useCallback(
    async (convId) => {
      // Don't reload if already on this conversation
      if (convId === conversationId) {
        return;
      }

      await loadConversation(convId);
    },
    [conversationId, loadConversation]
  );

  /**
   * Create a new conversation
   */
  const createNewConversation = useCallback(async () => {
    try {
      setError(null);
      setMessages([]);

      // Create a new conversation document in Firestore with default title
      if (!auth.currentUser) {
        throw new Error("User not authenticated");
      }

      const newConvId = await createConversation("New Conversation");
      setConversationId(newConvId);

      // Initialize metadata
      setConversationMetadata({
        id: newConvId,
        userId: auth.currentUser.uid,
        title: "New Conversation",
        messageCount: 0,
        lastMessage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return newConvId;
    } catch (err) {
      console.error("Create conversation error:", err);
      setError(err.message);
      toast.error("Failed to create new conversation");
      return null;
    }
  }, []);

  /**
   * Clear chat state when no active conversation
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setConversationMetadata(null);
    setError(null);
    clearOCRState();
  }, [clearOCRState]);

  const value = {
    messages,
    isLoading,
    error,
    conversationId,
    conversationMetadata,
    sendMessage,
    loadConversation,
    createNewConversation,
    switchConversation,
    setConversationId,
    setMessages,
    clearChat,
    // OCR state and handlers
    ocrState,
    processImageWithOCR,
    clearOCRState,
    sendConfirmedOCRText,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

/**
 * Hook to use ChatContext
 */
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
