import React, { useState, useCallback } from "react";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import TypingIndicator from "./TypingIndicator";

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle sending a message
  const handleSend = useCallback((userMessage) => {
    // Add user message to the list
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    // Simulate typing indicator (in Task 1.4 this will call the backend)
    setIsLoading(true);

    // TODO: In Task 1.4, replace this with actual API call to Cloud Functions
    // For now, simulate a response after 1.5 seconds
    setTimeout(() => {
      const mockResponse = `Great question! Let me guide you through this step by step.\n\nFirst, can you tell me what the problem is asking? What do you need to find?`;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: mockResponse,
          timestamp: new Date(),
        },
      ]);

      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-800">
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
