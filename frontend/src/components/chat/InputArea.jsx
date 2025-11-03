import React, { useState, useRef, useEffect } from "react";
import { Send, Camera, Zap, Mic } from "lucide-react";

const InputArea = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Auto-expand textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120); // max 5 lines ~20px each
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter, but allow Shift+Enter for new lines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-700 bg-slate-800 p-4 space-y-3">
      {/* Input Row */}
      <div className="flex gap-2 items-end">
        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a math question..."
            disabled={disabled}
            className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-400 rounded-xl border border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 resize-none"
            rows={1}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 flex-shrink-0"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          disabled
          title="Image upload coming soon"
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors duration-200"
        >
          <Camera className="w-5 h-5" />
        </button>
        <button
          disabled
          title="Whiteboard coming soon"
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors duration-200"
        >
          <Zap className="w-5 h-5" />
        </button>
        <button
          disabled
          title="Voice coming soon"
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors duration-200"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InputArea;
