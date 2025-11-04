import React from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../../contexts/ChatContext";
import { createConversation } from "../../services/firestore";
import toast from "react-hot-toast";

/**
 * EmptySidebarState - Shows when user has no conversations yet
 * Provides quick-start example problems to get started
 */
const EmptySidebarState = () => {
  const navigate = useNavigate();
  const { createNewConversation } = useChatContext();
  const [isLoading, setIsLoading] = React.useState(false);

  // Example problems to get user started
  const exampleProblems = [
    "Solve 2x + 5 = 13",
    "Find the area of a circle with radius 7cm",
    "What is the slope of the line y = 3x - 2?",
  ];

  /**
   * Handle quick-start problem click
   */
  const handleExampleClick = async (problem) => {
    try {
      setIsLoading(true);

      // Create new conversation with example problem
      const conversationId = await createConversation(problem);

      // Navigate to the new conversation
      navigate(`/chat/${conversationId}`);

      // Send the example problem as first message
      setTimeout(() => {
        const chatEvent = new CustomEvent("sendMessage", {
          detail: { message: problem },
        });
        window.dispatchEvent(chatEvent);
      }, 100);

      toast.success("Let's solve this together!");
    } catch (error) {
      console.error("Error creating conversation from example:", error);
      toast.error("Failed to start conversation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 text-center space-y-4">
      {/* Icon */}
      <div className="text-5xl mb-2">✨</div>

      {/* Main Message */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-1">
          No Conversations Yet
        </h3>
        <p className="text-xs text-slate-400">
          Start your first problem to begin learning!
        </p>
      </div>

      {/* Example Problems */}
      <div className="space-y-2 pt-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Try These Problems
        </p>
        {exampleProblems.map((problem, idx) => (
          <button
            key={idx}
            onClick={() => handleExampleClick(problem)}
            disabled={isLoading}
            className="w-full text-left px-3 py-2 text-xs rounded-lg bg-slate-700/50 hover:bg-slate-600 text-slate-200 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed truncate"
            title={problem}
          >
            {problem}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptySidebarState;
