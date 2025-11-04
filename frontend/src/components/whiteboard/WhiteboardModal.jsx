import React, { useState } from "react";
import { X, Pen, Eraser, Undo2, Redo2, Trash2, Send } from "lucide-react";
import WhiteboardCanvas from "./WhiteboardCanvas";
import { useWhiteboard } from "../../contexts/WhiteboardContext";
import toast from "react-hot-toast";

const WhiteboardModal = ({ onSend }) => {
  const {
    isWhiteboardOpen,
    closeWhiteboard,
    clearWhiteboard,
    selectedTool,
    setSelectedTool,
    undo,
    redo,
    captionText,
    setCaptionText,
    canvasRef,
    drawingHistory,
    redoHistory,
  } = useWhiteboard();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isWhiteboardOpen) return null;

  const handleClear = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    clearWhiteboard();
    setShowClearConfirm(false);
    toast.success("Canvas cleared");
  };

  const handleSend = async () => {
    if (!canvasRef || !canvasRef.current) {
      toast.error("No canvas to save");
      return;
    }

    try {
      // Convert canvas to image
      const imageDataURL = canvasRef.current.toDataURL("image/png");

      // Send via parent callback
      onSend({
        type: "whiteboard",
        content: imageDataURL,
        caption: captionText.trim() || "",
      });

      // Close modal and reset
      closeWhiteboard();
      clearWhiteboard();
      toast.success("Drawing sent!");
    } catch (error) {
      console.error("Failed to send whiteboard:", error);
      toast.error("Failed to send drawing");
    }
  };

  const toolButtons = [
    { id: "pen", icon: Pen, label: "Pen" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "line", label: "Line", char: "/" },
    { id: "circle", label: "Circle", char: "●" },
    { id: "rectangle", label: "Rectangle", char: "▭" },
  ];

  return (
    <>
      {/* Overlay */}
      {isWhiteboardOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-200"
          onClick={closeWhiteboard}
          style={{ top: 0 }}
        />
      )}

      {/* Modal */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 z-50 flex flex-col`}
        style={{
          height: "40vh",
          transform: isWhiteboardOpen ? "translateY(0)" : "translateY(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <button
            onClick={closeWhiteboard}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            title="Close whiteboard"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
          <h3 className="text-sm font-semibold text-slate-700">Whiteboard</h3>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-hidden">
          <WhiteboardCanvas height="100%" />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 bg-slate-50 gap-2">
          <div className="flex gap-1 flex-wrap">
            {toolButtons.map((tool) => {
              const Icon = tool.icon;
              const isActive = selectedTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-500 text-white shadow-md scale-110"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                  title={tool.label}
                >
                  {Icon ? (
                    <Icon className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold">{tool.char}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => undo()}
              disabled={drawingHistory.length === 0}
              className="p-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => redo()}
              disabled={redoHistory.length === 0}
              className="p-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Caption Input */}
        <div className="px-4 py-2 border-t border-slate-200">
          <input
            type="text"
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
            placeholder="Add caption (optional)"
            maxLength={100}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
          />
        </div>

        {/* Footer - Action Buttons */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClear}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
            title="Clear canvas"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <button
            onClick={handleSend}
            disabled={drawingHistory.length === 0}
            className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
            title="Send drawing"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowClearConfirm(false)}
          />
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm mx-4 relative z-50">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Clear all drawings?
            </h3>
            <p className="text-slate-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhiteboardModal;
