import React, { useEffect, useRef } from "react";
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

  // Restore scroll position when loading conversation or when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length > 0 && containerRef.current) {
        const savedPosition = getScrollPosition(conversationId);
        if (savedPosition > 0) {
          containerRef.current.scrollTop = savedPosition;
        } else {
          // Default: scroll to bottom for new messages
          messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }
      } else if (messages.length === 0 && containerRef.current) {
        // Clear scroll and show empty state
        clearScrollPosition(conversationId);
        containerRef.current.scrollTop = 0;
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [messages.length, conversationId]);

  // Auto-scroll to bottom on new messages (if user is at bottom)
  useEffect(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // Only auto-scroll if user is near the bottom
      if (scrollHeight - (scrollTop + clientHeight) < 100) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

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
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg"
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
