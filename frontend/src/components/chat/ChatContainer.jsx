import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import TypingIndicator from "./TypingIndicator";
import OCRConfirmation from "./OCRConfirmation";
import OCRError from "./OCRError";
import WhiteboardModal from "../whiteboard/WhiteboardModal";
import GeneratedProblems from "./GeneratedProblems";
import { useChatContext } from "../../contexts/ChatContext";

const ChatContainer = ({ sidebarRef }) => {
  const {
    messages,
    isLoading,
    sendMessage,
    error,
    ocrState,
    clearOCRState,
    sendConfirmedOCRText,
    processImageWithOCR,
    conversationId,
    problemGenerationState,
    generateProblems,
    clearProblems,
  } = useChatContext();

  const [showTypeManually, setShowTypeManually] = useState(false);

  // Refetch conversations when a new conversation is created
  useEffect(() => {
    if (conversationId && sidebarRef?.current) {
      sidebarRef.current.refetchConversations();
    }
  }, [conversationId, sidebarRef]);

  // Handle sending a message
  const handleSend = (userMessage) => {
    sendMessage(userMessage);
  };

  // Handle OCR confirmation
  const handleOCRConfirm = (confirmedText) => {
    if (ocrState.imageDataURL && confirmedText.trim()) {
      sendConfirmedOCRText(confirmedText, ocrState.imageDataURL);
    }
  };

  // Handle OCR re-upload
  const handleOCRReupload = () => {
    clearOCRState();
    setShowTypeManually(false);
  };

  // Handle OCR error - retry
  const handleOCRRetry = async () => {
    if (ocrState.originalImage) {
      await processImageWithOCR(ocrState.originalImage);
    }
  };

  // Handle OCR error - type manually
  const handleTypeManually = () => {
    setShowTypeManually(true);
  };

  // Handle cancel manual typing
  const handleCancelManual = () => {
    setShowTypeManually(false);
  };

  // Handle send manual text
  const handleSendManualText = (text) => {
    if (text.trim()) {
      sendConfirmedOCRText(text, ocrState.originalImage || "");
      setShowTypeManually(false);
    }
  };

  // Handle problem generation request
  const handleGenerateProblems = async (solvedProblem) => {
    await generateProblems(solvedProblem);
  };

  // Handle selecting a generated problem
  const handleSelectProblem = (problem) => {
    if (problem && problem.text) {
      clearProblems();
      sendMessage(problem.text);
    }
  };

  // Handle dismissing generated problems
  const handleDismissProblems = () => {
    clearProblems();
  };

  return (
    <div className="flex flex-col h-full bg-slate-800">
      {/* Error Alert */}
      {error && (
        <div className="px-4 pt-4">
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <MessageList
        messages={messages}
        onGenerateProblems={handleGenerateProblems}
      />

      {/* Generated Problems Container */}
      {(problemGenerationState.generatedProblems ||
        problemGenerationState.isProcessing ||
        problemGenerationState.error) && (
        <div className="px-4 pb-2">
          <GeneratedProblems
            problems={problemGenerationState.generatedProblems}
            onSelectProblem={handleSelectProblem}
            isLoading={problemGenerationState.isProcessing}
            error={problemGenerationState.error}
            onDismiss={handleDismissProblems}
          />
        </div>
      )}

      {/* Typing Indicator */}
      {isLoading && (
        <div className="px-4 pb-2">
          <TypingIndicator />
        </div>
      )}

      {/* Input Area */}
      <InputArea onSend={handleSend} disabled={isLoading} />

      {/* Whiteboard Modal */}
      <WhiteboardModal onSend={handleSend} />

      {/* OCR Processing Loading Modal */}
      {ocrState.isProcessing && !ocrState.extractedText && !ocrState.error && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg">
                Extracting Text
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 flex flex-col items-center">
              {/* Image Preview */}
              {ocrState.imageDataURL && (
                <img
                  src={ocrState.imageDataURL}
                  alt="Processing"
                  className="w-32 h-32 object-contain rounded-lg border border-slate-600 bg-slate-900"
                />
              )}

              {/* Loading Spinner */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-slate-600 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-300 text-sm text-center">
                  Please wait while we extract text from the{" "}
                  {ocrState.messageType === "whiteboard" ? "drawing" : "image"}
                  ...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OCR Confirmation Modal */}
      {ocrState.extractedText && !ocrState.error && (
        <OCRConfirmation
          imageDataURL={ocrState.imageDataURL}
          extractedText={ocrState.extractedText}
          confidence={ocrState.confidence}
          onConfirm={handleOCRConfirm}
          onEdit={() => {}} // Edit is handled in the component itself
          onReupload={handleOCRReupload}
          isLoading={isLoading}
        />
      )}

      {/* OCR Error Modal */}
      {ocrState.error && (
        <OCRError
          error={ocrState.error}
          imageDataURL={ocrState.originalImage}
          onRetry={handleOCRRetry}
          onTypeManually={handleTypeManually}
          onClose={clearOCRState}
          isLoading={ocrState.isProcessing}
        />
      )}

      {/* Manual Text Input Modal */}
      {showTypeManually && (
        <ManualTextInput
          onSend={handleSendManualText}
          onCancel={handleCancelManual}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

/**
 * ManualTextInput component - Fallback for when OCR fails
 */
const ManualTextInput = ({ onSend, onCancel, isLoading }) => {
  const [text, setText] = React.useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-white font-semibold text-lg">
            Type Problem Manually
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-slate-300 text-sm">
            Please type the math problem you'd like help with:
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: Solve 2x + 5 = 13"
            disabled={isLoading}
            className="w-full h-32 p-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none text-sm"
          />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || !text.trim()}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
