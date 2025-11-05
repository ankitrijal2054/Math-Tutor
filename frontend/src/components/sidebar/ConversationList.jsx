import React, {
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { loadUserConversations } from "../../services/firestore";
import { groupConversationsByDate } from "../../utils/helpers";
import ConversationItem from "./ConversationItem";
import EmptySidebarState from "./EmptySidebarState";
import toast from "react-hot-toast";

/**
 * ConversationList component - fetches and displays grouped conversations
 * @param {Function} onSelectConversation - Callback when conversation is selected (for mobile drawer close)
 * @param {string} searchQuery - Search query from parent component
 * @param {Function} onConversationsCountChange - Callback to notify parent of conversations count
 */
const ConversationListComponent = (
  {
    onSelectConversation = () => {},
    searchQuery = "",
    onConversationsCountChange = () => {},
  },
  ref
) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { conversationId: activeConvId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch conversations for current user
   */
  const fetchConversations = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const convos = await loadUserConversations(user.uid);
      setConversations(convos);

      // Notify parent of conversations count
      onConversationsCountChange(convos.length);
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError(err.message || "Failed to load conversations");
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [user, onConversationsCountChange]);

  // Expose fetchConversations via ref so it can be called from ChatContext
  useImperativeHandle(ref, () => ({
    refetchConversations: fetchConversations,
  }));

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  /**
   * Handle conversation deletion - update local state and navigate if needed
   */
  const handleConversationDeleted = (deletedConvId) => {
    setConversations((prev) =>
      prev.filter((convo) => convo.id !== deletedConvId)
    );

    // Get remaining conversations
    const convos = conversations.filter((c) => c.id !== deletedConvId);

    // Update parent with new count
    onConversationsCountChange(convos.length);

    // If the deleted conversation was active, navigate to the next one
    if (deletedConvId === activeConvId) {
      if (convos.length > 0) {
        // Navigate to the most recent conversation
        navigate(`/chat/${convos[0].id}`);
      } else {
        // No conversations left, go to create new
        navigate("/chat");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-2 space-y-2">
        {/* Skeleton loaders with shimmer animation */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-3 rounded-lg bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:1000px_100%] animate-shimmer"
          >
            <div className="space-y-2">
              <div className="h-4 bg-slate-700/50 rounded-full w-3/4"></div>
              <div className="h-3 bg-slate-700/50 rounded-full w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-red-400 mb-2">Error loading conversations</p>
        <p className="text-xs text-slate-400">{error}</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return <EmptySidebarState />;
  }

  // Filter conversations by search query
  const filteredConversations = searchQuery.trim()
    ? conversations.filter((conv) =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  // Group filtered conversations
  const displayGrouped = groupConversationsByDate(filteredConversations);

  // Render grouped conversations
  const groups = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "thisWeek", label: "This Week" },
    { key: "older", label: "Older" },
  ];

  return (
    <div className="p-2 space-y-1">
      {filteredConversations.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-slate-400">No conversations found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search
          </p>
        </div>
      ) : (
        groups.map(({ key }) => {
          const groupConvos = displayGrouped[key] || [];
          if (groupConvos.length === 0) return null;

          return (
            <div key={key} className="mb-4">
              {/* Section Header */}
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {"CONVERSATIONS"}
              </div>

              {/* Conversations in this group */}
              <div className="space-y-1">
                {groupConvos.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    onDeleted={() => handleConversationDeleted(conversation.id)}
                    onSelect={onSelectConversation}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default forwardRef(ConversationListComponent);
