import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

const MessageBubble = ({ role, content, timestamp }) => {
  const [showTimestamp, setShowTimestamp] = useState(false);

  const isUser = role === "user";
  const isAssistant = role === "assistant";

  // Format timestamp for display
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex gap-3 mb-4 animate-fadeIn ${
        isUser ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Message Content */}
      <div
        className={`max-w-xs lg:max-w-md flex flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 ${
            isUser
              ? "bg-white text-slate-900 rounded-br-none"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-bl-none"
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{content}</p>
        </div>

        {/* Timestamp on Hover */}
        {showTimestamp && timestamp && (
          <p className="text-xs text-slate-400 mt-1 animate-fadeIn">
            {formatTime(timestamp)}
          </p>
        )}
      </div>

      {/* User Avatar Placeholder */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center">
          <span className="text-xs font-semibold text-white">U</span>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
