import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AlertTriangle } from "lucide-react";
import { Fragment } from "react";

/**
 * DeleteConfirmationModal - Modal for confirming conversation deletion
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {string} props.conversationTitle - Title of conversation to delete
 * @param {Function} props.onConfirm - Callback when confirmed
 * @param {Function} props.onCancel - Callback when cancelled
 * @param {boolean} props.isDeleting - Whether deletion is in progress
 */
const DeleteConfirmationModal = ({
  isOpen,
  conversationTitle,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* Modal Content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm rounded-lg bg-slate-800 border border-slate-700 shadow-xl">
                {/* Content */}
                <div className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 p-2 bg-red-500/10 rounded-lg">
                      <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Dialog.Title className="text-lg font-semibold text-white">
                        Delete Conversation?
                      </Dialog.Title>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-slate-300 mb-2">
                    Are you sure you want to delete this conversation?
                  </p>
                  <p className="text-sm text-slate-400 mb-6 line-clamp-2">
                    <span className="font-medium text-slate-300">
                      "{conversationTitle}"
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">
                    This action cannot be undone.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={onCancel}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 hover:shadow-md active:scale-95 text-slate-100 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onConfirm}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 active:scale-95 text-white font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isDeleting && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteConfirmationModal;
