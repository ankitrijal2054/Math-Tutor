import React from "react";
import { Search, X } from "lucide-react";

/**
 * SearchConversations - Optional search and filter component for sidebar
 * Allows users to search conversations by title
 */
const SearchConversations = ({ value, onChange, onClear }) => {
  return (
    <div className="px-2 py-3 border-b border-slate-700">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
          size={16}
        />
        <input
          type="text"
          placeholder="Search conversations..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 pr-9 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors duration-150"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchConversations;
