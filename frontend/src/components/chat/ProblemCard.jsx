import React from "react";
import MathRenderer from "../shared/MathRenderer";

/**
 * Displays a single generated practice problem in card format
 * @param {Object} problem - Problem object with text and difficulty
 * @param {Function} onSelect - Callback when user clicks to use this problem
 * @param {boolean} isLoading - Whether action is loading
 */
const ProblemCard = ({ problem, onSelect, isLoading = false }) => {
  if (!problem) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200";
      case "hard":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getDifficultyLabel = (difficulty) => {
    return difficulty
      ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
      : "Medium";
  };

  return (
    <button
      onClick={() => onSelect(problem)}
      disabled={isLoading}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        isLoading
          ? "opacity-50 cursor-not-allowed"
          : "border-gray-200 hover:border-indigo-300 hover:shadow-md cursor-pointer"
      }`}
    >
      {/* Problem Content */}
      <div className="mb-3">
        <MathRenderer content={problem.text} />
      </div>

      {/* Difficulty Badge */}
      <div
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
          problem.difficulty
        )}`}
      >
        {getDifficultyLabel(problem.difficulty)}
      </div>
    </button>
  );
};

export default ProblemCard;
