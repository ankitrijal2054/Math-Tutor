import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const MessageBubble = ({ role, content, timestamp }) => {
  const [showTimestamp, setShowTimestamp] = useState(false);
  const { user } = useAuth();

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

  // Get user initial from displayName or email
  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
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

        {/* Timestamp - Always reserve space, show on hover */}
        <p
          className={`text-xs mt-1 h-4 transition-all duration-200 ${
            showTimestamp && timestamp
              ? "text-slate-400 opacity-100"
              : "text-transparent opacity-0"
          }`}
        >
          {timestamp ? formatTime(timestamp) : "00:00"}
        </p>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <span className="text-xs font-semibold text-white">
            {getUserInitial()}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
