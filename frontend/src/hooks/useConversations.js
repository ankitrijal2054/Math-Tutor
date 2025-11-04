import { useState, useCallback } from "react";
import {
  loadUserConversations,
  deleteConversation,
  loadConversationMetadata,
} from "../services/firestore";
import toast from "react-hot-toast";

/**
 * Custom hook for managing user conversations
 * @returns {Object} Conversations state and methods
 */
export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load all conversations for the current user
   */
  const loadConversations = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const userConversations = await loadUserConversations();
      setConversations(userConversations);
      setIsLoading(false);
    } catch (err) {
      console.error("Load conversations error:", err);
      setError(err.message);
      setIsLoading(false);
      toast.error("Failed to load conversations");
    }
  }, []);

  /**
   * Delete a conversation
   */
  const removeConversation = useCallback(async (conversationId) => {
    try {
      setError(null);
      await deleteConversation(conversationId);
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId)
      );
      toast.success("Conversation deleted");
    } catch (err) {
      console.error("Delete conversation error:", err);
      setError(err.message);
      toast.error("Failed to delete conversation");
    }
  }, []);

  /**
   * Get a single conversation by ID
   */
  const getConversation = useCallback(async (conversationId) => {
    try {
      setError(null);
      const metadata = await loadConversationMetadata(conversationId);
      return metadata;
    } catch (err) {
      console.error("Get conversation error:", err);
      setError(err.message);
      return null;
    }
  }, []);

  return {
    conversations,
    isLoading,
    error,
    loadConversations,
    removeConversation,
    getConversation,
  };
};
