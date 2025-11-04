import React from "react";

/**
 * MessageSkeletons - Shows loading skeletons while messages are being loaded
 * Alternates between left (AI) and right (User) messages for realistic preview
 */
const MessageSkeletons = () => {
  // Create alternating skeleton messages
  const skeletons = [
    { role: "assistant", width: "w-2/3" },
    { role: "user", width: "w-3/4" },
    { role: "assistant", width: "w-1/2" },
    { role: "user", width: "w-2/3" },
  ];

  return (
    <div className="space-y-4 animate-pulse">
      {skeletons.map((skeleton, idx) => (
        <div
          key={idx}
          className={`flex ${
            skeleton.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`
              p-3 rounded-lg space-y-2
              ${
                skeleton.role === "assistant"
                  ? "bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:1000px_100%] animate-shimmer"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:1000px_100%] animate-shimmer"
              }
              ${skeleton.width}
            `}
          >
            <div className="h-4 bg-slate-600/50 rounded w-full"></div>
            <div className="h-4 bg-slate-600/50 rounded w-5/6"></div>
            <div className="h-3 bg-slate-600/50 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeletons;
