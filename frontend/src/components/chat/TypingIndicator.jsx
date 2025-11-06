import React from "react";
import { MessageCircle } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 mb-4 animate-fadeIn">
      {/* Assistant Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <MessageCircle className="w-5 h-5 text-white" />
      </div>

      {/* Typing Bubble */}
      <div className="max-w-xs lg:max-w-md flex flex-col items-start">
        <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-600/30 animate-glow">
          <div className="flex gap-1.5">
            <div
              className="w-2 h-2 rounded-full bg-white animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-white animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-white animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
