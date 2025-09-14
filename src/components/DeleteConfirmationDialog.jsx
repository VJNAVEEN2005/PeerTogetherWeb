import React from 'react';

/**
 * A simple confirmation dialog component using Tailwind CSS
 * 
 * @param {Object} props Component props
 * @param {boolean} props.isOpen Whether the modal is open
 * @param {Function} props.onClose Function to call when the modal is closed
 * @param {Function} props.onConfirm Function to call when the action is confirmed
 * @param {string} props.title The title of the modal
 * @param {string} props.message The message to display in the modal
 * @param {string} props.confirmText The text to display on the confirm button
 * @param {string} props.cancelText The text to display on the cancel button
 */
export default function DeleteConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Confirmation", 
  message = "Are you sure you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel"
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Transparent blurred backdrop */}
      <div 
        className="fixed inset-0 bg-white/10 backdrop-blur-md z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          <div className="relative transform overflow-hidden rounded-lg bg-white/80 backdrop-blur-md text-left shadow-2xl ring-1 ring-white/40 transition-all sm:my-8 sm:w-full sm:max-w-lg animate-slideIn">
            
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100/80 backdrop-blur-md shadow-inner shadow-red-500/30 sm:mx-0 sm:h-10 sm:w-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">{title}</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50/70 backdrop-blur-md px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-500/70 backdrop-blur-md px-4 py-2 text-base font-medium text-white shadow-lg hover:bg-red-600/80 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-200 bg-white/70 backdrop-blur-md px-4 py-2 text-base font-medium text-gray-700 shadow-md hover:bg-gray-50/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}