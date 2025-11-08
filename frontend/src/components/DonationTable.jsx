import React from "react";

export default function DonationTable({ donations }) {
  return (
    <table className="donation-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Donor Name</th>
          <th>Email</th>
          <th>Amount</th>
          <th>Note</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
