import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { deleteConversation } from "../../services/firestore";
import { formatRelativeTime } from "../../utils/helpers";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

/**
 * ConversationItem component - single conversation in the list
 * @param {Object} props - Component props
 * @param {Object} props.conversation - Conversation object
 * @param {Function} props.onDeleted - Callback when conversation is deleted
 * @param {Function} props.onSelect - Callback when conversation is selected
 */
const ConversationItem = ({
  conversation,
  onDeleted = () => {},
  onSelect = () => {},
}) => {
  const navigate = useNavigate();
  const { conversationId: activeConvId } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const isActive = activeConvId === conversation.id;

  /**
   * Handle conversation selection
   */
  const handleSelect = () => {
    navigate(`/chat/${conversation.id}`);
    onSelect(); // Close drawer on mobile
  };

  /**
   * Handle conversation deletion
   */
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteConversation(conversation.id);
      setShowDeleteModal(false);
      onDeleted();
      toast.success("Conversation deleted");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className={`group relative rounded-lg transition-all duration-200 flex items-center gap-0 ${
          isActive
            ? "bg-indigo-600/20 border border-indigo-500/50 shadow-lg shadow-indigo-500/10"
            : "hover:bg-slate-700/50 hover:shadow-md"
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Main clickable area for conversation selection */}
        <button
          onClick={handleSelect}
          className="flex-1 text-left px-3 py-2.5 rounded-lg transition-colors duration-150"
          title={conversation.title}
        >
          {/* Conversation Title */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-100 truncate">
              {conversation.title}
            </p>
            {/* Relative Time */}
            <p className="text-xs text-slate-400 mt-0.5">
              {formatRelativeTime(conversation.updatedAt)}
            </p>
          </div>
        </button>

        {/* Delete Button - Show on hover or active (OUTSIDE main button) */}
        {(isHovering || isActive) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            disabled={isDeleting}
            className="flex-shrink-0 p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete conversation"
          >
            <Trash2 size={16} />
          </button>
        )}

        {/* Active Indicator - Left border */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-lg"></div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        conversationTitle={conversation.title}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ConversationItem;
