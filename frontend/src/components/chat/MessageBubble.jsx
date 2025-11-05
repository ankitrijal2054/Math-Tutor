import React, { useState } from "react";
import { MessageCircle, X, Volume2, Square } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useVoice } from "../../hooks/useVoice";
import MathRenderer from "../shared/MathRenderer";

const MessageBubble = ({
  role,
  content,
  timestamp,
  type = "text",
  caption,
  extractedText,
}) => {
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isSpeakingThisMessage, setIsSpeakingThisMessage] = useState(false);
  const { user } = useAuth();
  const voice = useVoice();

  const isUser = role === "user";
  const isAssistant = role === "assistant";
  const isImage = type === "image";
  const isWhiteboard = type === "whiteboard";

  // Format timestamp for display
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get user initial from displayName or email
  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Handle text-to-speech
  const handleSpeak = () => {
    if (isSpeakingThisMessage && voice.isSpeaking) {
      voice.stopSpeaking();
      setIsSpeakingThisMessage(false);
    } else {
      // Remove markdown-style math notation for speech
      const textToSpeak = content.replace(/\$\$/g, "").replace(/\$/g, "");
      voice.speak(textToSpeak);
      setIsSpeakingThisMessage(true);
    }
  };

  // Handle when speech ends
  React.useEffect(() => {
    if (!voice.isSpeaking && isSpeakingThisMessage) {
      setIsSpeakingThisMessage(false);
    }
  }, [voice.isSpeaking, isSpeakingThisMessage]);

  return (
    <>
      <div
        className={`flex gap-3 mb-4 animate-fadeIn ${
          isUser ? "justify-end" : "justify-start"
        }`}
        onMouseEnter={() => setShowTimestamp(true)}
        onMouseLeave={() => setShowTimestamp(false)}
      >
        {/* Assistant Avatar */}
        {isAssistant && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Message Content */}
        <div
          className={`max-w-xs lg:max-w-md flex flex-col ${
            isUser ? "items-end" : "items-start"
          }`}
        >
          {/* Image/Whiteboard Message */}
          {(isImage || isWhiteboard) && isUser && (
            <div
              className={`relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group rounded-br-none mb-2 ${
                isWhiteboard
                  ? "bg-gradient-to-br from-blue-500 to-cyan-500 p-1"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 p-1"
              }`}
              onClick={() => setShowImageModal(true)}
            >
              {imageLoadError ? (
                <div className="h-40 w-40 bg-slate-600 rounded-xl flex flex-col items-center justify-center text-center p-4">
                  <div className="text-white text-sm">
                    {isWhiteboard
                      ? "Whiteboard unavailable"
                      : "Image unavailable"}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    {caption ||
                      (isWhiteboard ? "Drawing" : "Math problem image")}
                  </div>
                </div>
              ) : (
                <img
                  src={content}
                  alt={isWhiteboard ? "Whiteboard drawing" : "User uploaded"}
                  className="h-40 w-40 object-cover rounded-xl group-hover:opacity-80 transition-opacity"
                  onError={() => setImageLoadError(true)}
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors rounded-2xl">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100">
                  View Full
                </span>
              </div>
              {isWhiteboard && (
                <div className="absolute top-1 right-1 bg-blue-600/90 text-white text-xs px-2 py-1 rounded-md font-semibold">
                  Drawing
                </div>
              )}
            </div>
          )}

          {/* Text Message or Caption with Extracted Text*/}
          {(caption || extractedText) && (isImage || isWhiteboard) && (
            <div
              className={`px-4 py-2 rounded-2xl shadow-lg transition-all duration-200 mb-2 ${
                isUser
                  ? "bg-white text-slate-900 rounded-br-none"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-bl-none"
              }`}
            >
              {caption && (
                <div className="text-sm leading-relaxed italic text-opacity-80 mb-1">
                  {caption}
                </div>
              )}
              {extractedText && extractedText !== caption && (
                <div className="text-xs leading-relaxed opacity-75 border-t border-current pt-1">
                  <span className="font-semibold">Extracted: </span>
                  {extractedText}
                </div>
              )}
            </div>
          )}

          {/* Regular Text Message */}
          {!isImage && !isWhiteboard && (
            <div className="flex items-end gap-2">
              <div
                className={`px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 ${
                  isUser
                    ? "bg-white text-slate-900 rounded-br-none"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-bl-none"
                }`}
              >
                <div className="text-sm leading-relaxed">
                  <MathRenderer content={content} />
                </div>
              </div>

              {/* Speaker Button for Assistant Messages */}
              {isAssistant && voice.isSupported && (
                <button
                  onClick={handleSpeak}
                  title={isSpeakingThisMessage ? "Stop playing" : "Read aloud"}
                  className={`flex-shrink-0 mb-1 p-2 rounded-lg transition-colors duration-200 ${
                    isSpeakingThisMessage
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                  }`}
                >
                  {isSpeakingThisMessage ? (
                    <Square className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          )}

          {/* Timestamp - Always reserve space, show on hover */}
          <p
            className={`text-xs mt-1 h-4 transition-all duration-200 ${
              showTimestamp && timestamp
                ? "text-slate-400 opacity-100"
                : "text-transparent opacity-0"
            }`}
          >
            {timestamp ? formatTime(timestamp) : "00:00"}
          </p>
        </div>

        {/* User Avatar */}
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-xs font-semibold text-white">
              {getUserInitial()}
            </span>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (isImage || isWhiteboard) && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-2 text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            {imageLoadError ? (
              <div className="w-full h-[80vh] bg-slate-800 flex flex-col items-center justify-center">
                <div className="text-white text-lg">Image unavailable</div>
                <div className="text-slate-400 mt-2">
                  {caption || "This image could not be loaded"}
                </div>
              </div>
            ) : (
              <img
                src={content}
                alt="Full size"
                className="w-full h-full object-contain"
                onError={() => setImageLoadError(true)}
              />
            )}
            {(caption || extractedText) && (
              <div className="bg-slate-800 text-white p-3 text-sm space-y-2">
                {caption && (
                  <p>
                    <span className="font-semibold">Caption:</span> {caption}
                  </p>
                )}
                {extractedText && extractedText !== caption && (
                  <p>
                    <span className="font-semibold">Extracted Text:</span>{" "}
                    {extractedText}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
