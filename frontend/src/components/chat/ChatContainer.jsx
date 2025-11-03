import React from "react";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import TypingIndicator from "./TypingIndicator";
import { useChatContext } from "../../contexts/ChatContext";

const ChatContainer = () => {
  const { messages, isLoading, sendMessage, error } = useChatContext();

  // Handle sending a message
  const handleSend = (userMessage) => {
    sendMessage(userMessage);
  };

  return (
    <div className="flex flex-col h-full bg-slate-800">
      {/* Error Alert */}
      {error && (
        <div className="px-4 pt-4">
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <MessageList messages={messages} />

      {/* Typing Indicator */}
      {isLoading && (
        <div className="px-4 pb-2">
          <TypingIndicator />
        </div>
      )}

      {/* Input Area */}
      <InputArea onSend={handleSend} disabled={isLoading} />
    </div>
  );
};

export default ChatContainer;
