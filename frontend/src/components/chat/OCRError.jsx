import React from "react";
import { AlertTriangle, RotateCcw, X, Type } from "lucide-react";

/**
 * OCRError component - Shows error message with retry and fallback options
 */
const OCRError = ({
  error,
  imageDataURL,
  onRetry,
  onTypeManually,
  onClose,
  isLoading = false,
}) => {
  // Determine error type and message
  const getErrorInfo = () => {
    const errorMsg = error?.toLowerCase() || "";

    if (errorMsg.includes("unclear") || errorMsg.includes("blurry")) {
      return {
        title: "Image Too Blurry",
        message:
          "The image is too blurry or unclear to extract text. Try taking a clearer photo or upload a higher quality image.",
        icon: "camera",
      };
    }

    if (errorMsg.includes("not a math") || errorMsg.includes("no math")) {
      return {
        title: "Not a Math Problem",
        message:
          "The image doesn't appear to contain a math problem. Please upload an image of a math problem and try again.",
        icon: "image",
      };
    }

    if (errorMsg.includes("format") || errorMsg.includes("invalid")) {
      return {
        title: "Invalid Image Format",
        message:
          "The image format is not supported. Please try a JPEG, PNG, or WebP image.",
        icon: "image",
      };
    }

    return {
      title: "OCR Processing Failed",
      message:
        error ||
        "Failed to extract text from the image. Please try again or type the problem manually.",
      icon: "error",
    };
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-white" />
            <h2 className="text-white font-semibold text-lg">
              {errorInfo.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Error message */}
          <p className="text-slate-300 text-sm leading-relaxed">
            {errorInfo.message}
          </p>

          {/* Image preview (if available) */}
          {imageDataURL && (
            <div className="flex flex-col">
              <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">
                Original Image
              </p>
              <img
                src={imageDataURL}
                alt="Original"
                className="w-full h-40 object-contain rounded-lg border border-slate-600 bg-slate-900"
              />
            </div>
          )}

          {/* Suggestions */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 space-y-2">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              What you can do:
            </p>
            <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>Take a clearer photo and upload again</li>
              <li>Make sure the math problem is clearly visible</li>
              <li>Try with better lighting and less glare</li>
              <li>Or type the problem manually below</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onTypeManually}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              <Type className="w-4 h-4" />
              Type Manually
            </button>
            <button
              onClick={onRetry}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {isLoading ? "Retrying..." : "Retry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCRError;
