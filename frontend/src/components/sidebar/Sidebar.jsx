import React, { useState } from "react";
import { Plus } from "lucide-react";
import ConversationList from "./ConversationList";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { createConversation } from "../../services/firestore";
import toast from "react-hot-toast";

/**
 * Sidebar component - displays conversation list
 * @param {Object} props - Component props
 * @param {boolean} props.isMobileOpen - Whether sidebar drawer is open on mobile
 * @param {Function} props.onMobileClose - Callback to close mobile drawer
 */
const Sidebar = ({ isMobileOpen = false, onMobileClose = () => {} }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Handle new conversation creation
   */
  const handleNewConversation = async () => {
    if (!user) {
      toast.error("Please sign in to create a conversation");
      return;
    }

    try {
      setIsCreating(true);
      const conversationId = await createConversation("New conversation");
      navigate(`/chat/${conversationId}`);
      onMobileClose(); // Close drawer on mobile
      toast.success("New conversation created!");
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to create conversation");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <aside
      className={`${
        isMobileOpen ? "block fixed inset-y-0 left-0 z-50" : "hidden md:block"
      } w-64 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 overflow-hidden flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Header - New Conversation Button */}
      <div className="flex-shrink-0 p-4 border-b border-slate-700">
        <button
          onClick={handleNewConversation}
          disabled={isCreating}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversation List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <ConversationList onSelectConversation={onMobileClose} />
      </div>
    </aside>
  );
};

export default Sidebar;
