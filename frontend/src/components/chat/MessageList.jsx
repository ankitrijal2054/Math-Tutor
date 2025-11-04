import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages = [] }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-700 rounded-full w-3/4 animate-pulse"></div>
        <div className="h-4 bg-slate-700 rounded-full w-1/2 animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg"
    >
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Welcome to AI Math Tutor
          </h3>
          <p className="text-slate-400 max-w-xs">
            Start by asking a math question, and I'll guide you through the
            solution step-by-step!
          </p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              type={message.type || "text"}
              caption={message.caption}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;
