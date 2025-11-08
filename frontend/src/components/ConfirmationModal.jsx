import React from 'react';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="confirmation-modal" onClick={handleBackdropClick}>
      <div className="confirmation-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirmation-buttons">
          <button 
            className="cancel-btn" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            className="confirm-btn" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <span className="spinner"></span>}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}