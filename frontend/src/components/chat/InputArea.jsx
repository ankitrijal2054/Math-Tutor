import React, { useState, useRef, useEffect } from "react";
import { Send, Zap, Mic, X } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { compressImage } from "../../utils/imageCompression";
import toast from "react-hot-toast";

const InputArea = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Auto-expand textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120); // max 5 lines ~20px each
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  // Handle image selection from ImageUpload component
  const handleImageSelect = async (imageData) => {
    if (!imageData) {
      setSelectedImage(null);
      return;
    }

    try {
      setIsCompressing(true);
      // Compress the image
      const compressedDataURL = await compressImage(imageData.file);
      setSelectedImage({
        ...imageData,
        compressed: compressedDataURL,
      });
    } catch (error) {
      console.error("Image compression error:", error);
      toast.error("Failed to compress image. Please try again.");
      setSelectedImage(null);
    } finally {
      setIsCompressing(false);
    }
  };

  // Handle sending text message
  const handleSend = () => {
    if (!disabled && !isCompressing) {
      if (selectedImage && selectedImage.compressed) {
        // Send image message
        onSend({
          type: "image",
          content: selectedImage.compressed, // base64 data URL
          caption: input.trim() || "",
        });
        setInput("");
        setSelectedImage(null);
      } else if (input.trim()) {
        // Send text message
        onSend({
          type: "text",
          content: input.trim(),
        });
        setInput("");
      }
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Send on Enter, but allow Shift+Enter for new lines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Drag and drop handlers for the entire input area
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set false if leaving the drop zone entirely
    if (e.target === dropZoneRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageSelect({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    } else if (file) {
      toast.error("Please drop an image file.");
    }
  };

  // Send button disabled states
  const isSendDisabled =
    disabled || isCompressing || (!input.trim() && !selectedImage?.compressed);

  return (
    <div
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-t border-slate-700 bg-slate-800 p-4 space-y-3 transition-colors duration-200 ${
        isDragging ? "bg-slate-700/50 border-indigo-500" : ""
      }`}
    >
      {/* Drag overlay indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-indigo-500/10 border-2 border-dashed border-indigo-500 rounded flex items-center justify-center pointer-events-none">
          <div className="text-indigo-400 font-medium">Drop image here</div>
        </div>
      )}

      {/* Image Preview */}
      {selectedImage && (
        <div className="flex gap-3 items-start">
          <div className="relative inline-block flex-shrink-0">
            <img
              src={selectedImage.preview}
              alt="Selected"
              className="h-24 w-24 object-cover rounded-lg border-2 border-indigo-500 shadow-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              disabled={disabled || isCompressing}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-full p-1 transition-colors duration-200"
              title="Remove image"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            {isCompressing && (
              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                <div className="animate-spin">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 truncate">
              {selectedImage.name}
            </p>
          </div>
        </div>
      )}

      {/* Input Row */}
      <div className="flex gap-2 items-end">
        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedImage
                ? "Add caption or ask a question..."
                : "Ask a math question..."
            }
            disabled={disabled || isCompressing}
            className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-400 rounded-xl border border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 resize-none"
            rows={1}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={isSendDisabled}
          className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 flex-shrink-0"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <ImageUpload
          onImageSelect={handleImageSelect}
          disabled={disabled || isCompressing}
        />
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
