import React, { useEffect, useRef, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import EmptyChatState from "./EmptyChatState";
import MessageSkeletons from "./MessageSkeletons";
import { useChatContext } from "../../contexts/ChatContext";
import {
  saveScrollPosition,
  getScrollPosition,
  clearScrollPosition,
} from "../../utils/helpers";

const MessageList = ({ messages = [], onGenerateProblems }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const { conversationId, sendMessage, isLoading } = useChatContext();

  // Save scroll position when leaving conversation
  const handleSaveScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      saveScrollPosition(conversationId, scrollTop);
    }
  };

  // Scroll to bottom helper function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  // Auto-scroll to bottom on new messages (always scroll to latest message)
  useEffect(() => {
    if (messages.length > 0) {
      // Small delay to ensure DOM has rendered the new message
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, scrollToBottom]);

  // Restore scroll position when loading conversation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 0 && containerRef.current) {
        // Clear scroll and show empty state
        clearScrollPosition(conversationId);
        containerRef.current.scrollTop = 0;
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [messages.length, conversationId]);

  // Save scroll position before unmounting or switching conversations
  useEffect(() => {
    return () => {
      handleSaveScroll();
    };
  }, [conversationId]);

  /**
   * Handle example problem click - send as first message
   */
  const handleSendExample = (example) => {
    sendMessage(example);
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Chat messages"
      aria-live="polite"
      aria-atomic="false"
      className="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-gradient-to-b from-slate-900 to-slate-800"
    >
      {messages.length === 0 ? (
        <>
          {isLoading ? (
            <div className="px-4 py-6">
              <MessageSkeletons />
            </div>
          ) : (
            <EmptyChatState onSendExample={handleSendExample} />
          )}
        </>
      ) : (
        <>
          {messages.map((message, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <MessageBubble
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
                type={message.type || "text"}
                caption={message.caption}
                onGenerateProblems={onGenerateProblems}
                answerVerification={message.answerVerification}
              />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;
