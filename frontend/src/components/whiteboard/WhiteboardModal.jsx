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
  const [isSending, setIsSending] = useState(false);

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
    if (!canvasRef) {
      toast.error("Canvas not ready");
      return;
    }

    if (drawingHistory.length === 0) {
      toast.error("Please draw something first");
      return;
    }

    try {
      setIsSending(true);

      // Convert canvas to image data URL
      const imageDataURL = canvasRef.toDataURL("image/png");

      // Send via parent callback with whiteboard type
      onSend({
        type: "whiteboard",
        content: imageDataURL,
        caption: captionText.trim() || "",
      });

      // Close modal and reset after successful send
      closeWhiteboard();
      clearWhiteboard();
      toast.success("Drawing sent!");
    } catch (error) {
      console.error("Failed to send whiteboard:", error);
      toast.error("Failed to send drawing. Please try again.");
    } finally {
      setIsSending(false);
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

      {/* Modal - Only covers chat section, not sidebar */}
      <div
        className={`fixed bottom-0 right-0 bg-slate-900 rounded-t-2xl shadow-2xl transition-all duration-300 z-50 flex flex-col md:left-[250px] left-0`}
        style={{
          height: "60vh",
          transform: isWhiteboardOpen ? "translateY(0)" : "translateY(100%)",
        }}
      >
        {/* Header - Compact */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800">
          <button
            onClick={closeWhiteboard}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors duration-200"
            title="Close canvas"
            disabled={isSending}
          >
            <X className="w-4 h-4 text-slate-200" />
          </button>
          <h3 className="text-xs font-semibold text-slate-100">Canvas</h3>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>

        {/* Canvas Area - Maximized with Floating Toolbar */}
        <div className="flex-1 overflow-hidden relative bg-slate-900">
          <WhiteboardCanvas height="100%" />

          {/* Floating Toolbar - Overlays Canvas */}
          <div className="absolute top-3 left-3 z-40 flex gap-1 bg-slate-800/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-slate-700">
            {toolButtons.map((tool) => {
              const Icon = tool.icon;
              const isActive = selectedTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  disabled={isSending}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-500 text-white shadow-md scale-110"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  } ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={tool.label}
                >
                  {Icon ? (
                    <Icon className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-xs font-bold">{tool.char}</span>
                  )}
                </button>
              );
            })}
            <div className="w-px bg-slate-600 mx-1" /> {/* Divider */}
            <button
              onClick={() => undo()}
              disabled={drawingHistory.length === 0 || isSending}
              className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => redo()}
              disabled={redoHistory.length === 0 || isSending}
              className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer - Compact Single Row */}
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-t border-slate-700 bg-slate-800">
          <button
            onClick={handleClear}
            disabled={drawingHistory.length === 0 || isSending}
            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
            title="Clear canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
            placeholder="Caption (optional)"
            maxLength={100}
            disabled={isSending}
            className="flex-1 min-w-0 px-2 py-1.5 text-xs bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <button
            onClick={handleSend}
            disabled={drawingHistory.length === 0 || isSending}
            className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 flex-shrink-0"
            title={isSending ? "Sending..." : "Send drawing"}
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
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
