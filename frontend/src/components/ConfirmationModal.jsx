import React from "react";
import { AlertCircle, X } from "lucide-react";

/**
 * A reusable confirmation modal component for critical actions.
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {string} title - Title of the modal
 * @param {string} message - Main description/question for the user
 * @param {string} confirmText - Text for the primary action button
 * @param {string} cancelText - Text for the cancel button
 * @param {function} onConfirm - Callback when the primary action is clicked
 * @param {function} onCancel - Callback when the modal is closed or cancelled
 * @param {boolean} isDanger - If true, the primary action button will be red
 * @param {boolean} isLoading - If true, shows a spinner on the primary button
 */
const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDanger = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDanger ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
              <AlertCircle size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-slate-600 leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 bg-slate-50/50 border-t border-slate-50">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-[1.5] px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-100' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
