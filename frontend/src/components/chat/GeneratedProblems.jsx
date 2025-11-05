import React from "react";
import { Sparkles } from "lucide-react";
import ProblemCard from "./ProblemCard";

/**
 * Displays a list of generated practice problems
 * @param {Array} problems - Array of problem objects
 * @param {Function} onSelectProblem - Callback when user selects a problem
 * @param {boolean} isLoading - Whether problems are being generated
 * @param {string} error - Error message if generation failed
 * @param {Function} onDismiss - Callback to dismiss/hide problems
 */
const GeneratedProblems = ({
  problems,
  onSelectProblem,
  isLoading = false,
  error = null,
  onDismiss,
}) => {
  if (!problems?.length && !isLoading && !error) {
    return null;
  }

  return (
    <div className="my-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-gray-800">Practice Problems</h3>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white rounded-lg border border-gray-200 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Problems List */}
      {!isLoading && !error && problems?.length > 0 && (
        <div className="space-y-3">
          {problems.map((problem, index) => (
            <ProblemCard
              key={index}
              problem={problem}
              onSelect={onSelectProblem}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!problems || problems.length === 0) && (
        <p className="text-gray-600 text-sm">No problems generated</p>
      )}

      {/* Instructions */}
      {!isLoading && !error && problems?.length > 0 && (
        <p className="text-xs text-gray-600 mt-3">
          Click a problem to start practicing with it
        </p>
      )}
    </div>
  );
};

export default GeneratedProblems;
