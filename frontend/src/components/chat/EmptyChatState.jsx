import React from "react";
import { useChatContext } from "../../contexts/ChatContext";

/**
 * EmptyChatState - Shows when chat has no messages yet
 * Displays welcome message and clickable example problems
 */
const EmptyChatState = ({ onSendExample }) => {
  const { isLoading } = useChatContext();

  // Example problems
  const examples = [
    {
      title: "Algebra",
      problem: "Solve 2x + 5 = 13",
    },
    {
      title: "Geometry",
      problem: "Find the area of a circle with radius 7cm",
    },
    {
      title: "Word Problem",
      problem:
        "If John has 3 apples and buys 5 more, then gives away 2, how many does he have?",
    },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8 text-center animate-fadeIn">
      {/* Welcome Header */}
      <div className="mb-8 max-w-md animate-slideDown">
        <div
          className="text-6xl mb-4 animate-bounce"
          style={{ animationDuration: "2s" }}
        >
          🎓
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome to AI Math Tutor
        </h2>
        <p className="text-slate-300">
          I'm here to help you understand math through guided questions and
          hints. No direct answers—just the right guidance to build your
          understanding.
        </p>
      </div>

      {/* Example Problems */}
      <div className="w-full max-w-2xl">
        <p className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wide">
          Try These Examples
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => onSendExample(example.problem)}
              disabled={isLoading}
              className="p-4 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-600 hover:border-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group animate-scaleIn hover:scale-105 hover:shadow-lg"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {idx === 0 ? "📐" : idx === 1 ? "🔷" : "📝"}
              </div>
              <div className="text-xs font-semibold text-slate-300 mb-2">
                {example.title}
              </div>
              <p className="text-xs text-slate-400 leading-snug">
                {example.problem}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 max-w-md text-left space-y-2">
        <p className="text-sm text-slate-400">
          <span className="font-semibold text-slate-300">💡 How it works:</span>
        </p>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>1️⃣ &nbsp;Ask a math question or share a problem</li>
          <li>
            2️⃣ &nbsp;I'll ask you guiding questions instead of giving answers
          </li>
          <li>3️⃣ &nbsp;Work through the problem step-by-step</li>
          <li>4️⃣ &nbsp;Build real understanding and confidence!</li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyChatState;
