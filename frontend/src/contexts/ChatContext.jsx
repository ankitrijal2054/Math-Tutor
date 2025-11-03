import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { callChatAPI } from "../services/api";
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

        // Save messages to Firestore
        const conversationRef = collection(
          db,
          "conversations",
          conversationId,
          "messages"
        );

        // Save user message
        await addDoc(conversationRef, {
          role: "user",
          content: userMessage,
          timestamp: serverTimestamp(),
          userId: auth.currentUser?.uid,
        });

        // Save AI message
        await addDoc(conversationRef, {
          role: "assistant",
          content: response.message,
          timestamp: serverTimestamp(),
        });

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
    [conversationId]
  );

  /**
   * Load conversation messages from Firestore
   */
  const loadConversation = useCallback(async (convId) => {
    try {
      setError(null);
      setIsLoading(true);
      setConversationId(convId);

      const messagesRef = collection(db, "conversations", convId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));
      const snapshot = await getDocs(q);

      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp:
          doc.data().timestamp?.toDate?.()?.toISOString?.() ||
          new Date().toISOString(),
      }));

      setMessages(loadedMessages);
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

      // Create a new conversation document in Firestore
      const conversationsRef = collection(db, "conversations");
      const newConvDoc = await addDoc(conversationsRef, {
        userId: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        title: "New Conversation",
      });

      setConversationId(newConvDoc.id);
      return newConvDoc.id;
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
