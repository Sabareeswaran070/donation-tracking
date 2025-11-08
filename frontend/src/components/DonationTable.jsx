import React, { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

export default function DonationTable({ donations, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const handleDeleteClick = (donation) => {
    setSelectedDonation(donation);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDonation) return;
    
    setDeletingId(selectedDonation._id);
    try {
      await onDelete(selectedDonation._id);
      setShowConfirmModal(false);
      setSelectedDonation(null);
    } catch (error) {
      console.error('Delete failed:', error);
      setShowConfirmModal(false);
      setSelectedDonation(null);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setSelectedDonation(null);
  };
  return (
    <div>
      <table className="donation-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Donor Name</th>
          <th>Email</th>
          <th>Amount</th>
          <th>Note</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {donations.map((donation) => (
          <tr key={donation._id}>
            <td>{new Date(donation.date).toLocaleDateString()}</td>
            <td>{donation.donorName}</td>
            <td>{donation.email}</td>
            <td>₹ {donation.amount}</td>
            <td>{donation.note || "-"}</td>
            <td>
              {onDelete ? (
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteClick(donation)}
                  disabled={deletingId === donation._id}
                >
                  {deletingId === donation._id && <span className="spinner"></span>}
                  {deletingId === donation._id ? 'Deleting...' : 'Delete'}
                </button>
              ) : (
                <em>—</em>
              )}
            </td>
          </tr>
        ))}
      </tbody>
      </table>
      
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Donation"
        message={`Are you sure you want to delete the donation from ${selectedDonation?.donorName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deletingId === selectedDonation?._id}
      />
    </div>
  );
}
