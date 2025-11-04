import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ChatContainer from "../components/chat/ChatContainer";
import { useChatContext } from "../contexts/ChatContext";

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { loadConversation, createNewConversation, isLoading } =
    useChatContext();

  useEffect(() => {
    const initializeConversation = async () => {
      try {
        if (conversationId) {
          // Load existing conversation
          await loadConversation(conversationId);
        } else {
          // Create a new conversation
          const newConvId = await createNewConversation();
          if (newConvId) {
            // Navigate to the new conversation URL
            navigate(`/chat/${newConvId}`, { replace: true });
          }
        }
      } catch (error) {
        console.error("Failed to initialize conversation:", error);
      }
    };

    initializeConversation();
  }, [conversationId, loadConversation, createNewConversation, navigate]);

  return (
    <Layout>
      <ChatContainer />
    </Layout>
  );
};

export default ChatPage;
