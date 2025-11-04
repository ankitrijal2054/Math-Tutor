import { createContext, useContext, useState, useCallback } from "react";
import { auth } from "../services/firebase";
import { callChatAPI } from "../services/api";
import {
  createConversation,
  loadMessages,
  loadConversationMetadata,
  updateConversation,
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

  /**
   * Send a message and get AI response
   */
  const sendMessage = useCallback(
    async (userMessage) => {
      if (!conversationId || !userMessage.trim()) {
        setError("Invalid message or conversation");
        return;
      }

      try {
        setError(null);

        // Optimistic update - add user message immediately
        const userMessageObj = {
          id: `msg_${Date.now()}`,
          role: "user",
          content: userMessage,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessageObj]);
        setIsLoading(true);

        // Call the backend API
        const response = await callChatAPI(conversationId, userMessage);

        if (!response.success) {
          throw new Error(response.error || "Failed to get response");
        }

        // Add AI response to messages
        const aiMessageObj = {
          id: response.messageId,
          role: "assistant",
          content: response.message,
          timestamp: response.timestamp,
        };

        setMessages((prev) => [...prev, aiMessageObj]);

        // Update conversation title if first message
        if (messages.length === 0) {
          const title = userMessage.trim().substring(0, 50);
          await updateConversation(conversationId, { title });
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

        // Remove the optimistic user message on error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== `msg_${Date.now()}`)
        );
      }
    },
    [conversationId, messages.length]
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

  const value = {
    messages,
    isLoading,
    error,
    conversationId,
    conversationMetadata,
    sendMessage,
    loadConversation,
    createNewConversation,
    setConversationId,
    setMessages,
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
