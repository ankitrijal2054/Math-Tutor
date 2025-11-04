import React, { useState } from "react";
import { Check, Edit2, RotateCcw, X, AlertCircle } from "lucide-react";

/**
 * OCRConfirmation component - Shows extracted text from image with confirmation flow
 * User can confirm, edit, or re-upload the image
 */
const OCRConfirmation = ({
  imageDataURL,
  extractedText,
  confidence,
  onConfirm,
  onEdit,
  onReupload,
  isLoading = false,
}) => {
  const [editedText, setEditedText] = useState(extractedText);
  const [isEditing, setIsEditing] = useState(false);

  const handleConfirm = () => {
    onConfirm(editedText);
    setEditedText(extractedText); // Reset for next use
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditedText(extractedText); // Reset edits
    setIsEditing(false);
  };

  const handleReupload = () => {
    setEditedText(extractedText);
    setIsEditing(false);
    onReupload();
  };

  // Get confidence color
  const getConfidenceColor = () => {
    if (confidence === "high") return "text-green-500 bg-green-500/10";
    if (confidence === "medium") return "text-yellow-500 bg-yellow-500/10";
    return "text-red-500 bg-red-500/10";
  };

  const getConfidenceText = () => {
    if (confidence === "high") return "High confidence";
    if (confidence === "medium") return "Medium confidence";
    return "Low confidence - review carefully";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">
            Review Extracted Text
          </h2>
          <button
            onClick={handleReupload}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            title="Close and re-upload"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Confidence Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor()}`}
          >
            {confidence === "low" && <AlertCircle className="w-4 h-4" />}
            {getConfidenceText()}
          </div>

          {/* Image Preview and Text Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Preview */}
            <div className="flex flex-col">
              <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">
                Original Image
              </p>
              <img
                src={imageDataURL}
                alt="Original"
                className="w-full h-48 object-contain rounded-lg border border-slate-600 bg-slate-900"
              />
            </div>

            {/* Extracted Text */}
            <div className="flex flex-col">
              <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">
                Extracted Text
              </p>
              {isEditing ? (
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full h-48 p-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none text-sm"
                  placeholder="Edit the extracted text here..."
                />
              ) : (
                <div className="w-full h-48 p-3 bg-slate-700 text-white border border-slate-600 rounded-lg overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {editedText || "(No text extracted)"}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isLoading || !editedText.trim()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Confirm Edit
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleReupload}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Re-upload
                </button>
                <button
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Confirm
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCRConfirmation;
