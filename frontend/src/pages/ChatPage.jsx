import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ChatContainer from "../components/chat/ChatContainer";
import { useChatContext } from "../contexts/ChatContext";

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { loadConversation, clearChat } = useChatContext();

  useEffect(() => {
    const initializeConversation = async () => {
      try {
        if (conversationId) {
          // Load existing conversation from URL
          await loadConversation(conversationId);
        } else {
          // No conversationId: clear chat state (e.g., after deleting all conversations)
          clearChat();
        }
      } catch (error) {
        console.error("Failed to load conversation:", error);
      }
    };

    initializeConversation();
  }, [conversationId, loadConversation, clearChat]);

  return (
    <Layout>
      <ChatContainer />
    </Layout>
  );
};

export default ChatPage;
