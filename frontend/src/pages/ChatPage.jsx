import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ChatContainer from "../components/chat/ChatContainer";
import { useChatContext } from "../contexts/ChatContext";

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { loadConversation, conversationId: contextConvId } = useChatContext();

  useEffect(() => {
    const initializeConversation = async () => {
      try {
        if (conversationId) {
          // Load existing conversation from URL
          await loadConversation(conversationId);
        }
        // If no conversationId: don't create one yet
        // Let user send a message first, which will create the conversation
      } catch (error) {
        console.error("Failed to load conversation:", error);
      }
    };

    initializeConversation();
  }, [conversationId, loadConversation]);

  return (
    <Layout>
      <ChatContainer />
    </Layout>
  );
};

export default ChatPage;
