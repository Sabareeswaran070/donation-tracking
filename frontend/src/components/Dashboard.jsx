import React, { useEffect, useState } from "react";
import API, { createDonation, deleteDonation } from "../api";
import DonationChart from "./DonationChart";
import DonationTable from "./DonationTable";
import RealTimeQuotes from "./RealTimeQuotes";

export default function Dashboard() {
  const [summary, setSummary] = useState({ total: 0, donorsCount: 0 });
  const [donations, setDonations] = useState([]);

  const fetchData = async () => {
    try {
      const [summaryRes, donationsRes] = await Promise.all([
        API.get("/donations/summary"),
        API.get("/donations")
      ]);
      setSummary(summaryRes.data);
      setDonations(donationsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <h3>Total Donations</h3>
          <p>₹ {summary.total}</p>
        </div>
        <div className="card">
          <h3>Number of Donors</h3>
          <p>{summary.donorsCount}</p>
        </div>
        <div className="card">
          <h3>Real-Time Quotes</h3>
          <RealTimeQuotes />
        </div>
      </div>

      <section className="charts">
        <DonationChart donations={donations} />
      </section>

      <section className="table-section">
        <h2>Recent Donations</h2>
        <div className="create-donation">
          <h3>Add Donation</h3>
          <CreateDonationForm onCreated={fetchData} />
        </div>

        <DonationTable donations={donations} onDelete={async (id) => {
          try {
            console.log('Attempting to delete donation with ID:', id);
            const response = await deleteDonation(id);
            console.log('Delete response:', response);
            fetchData();
            alert('Donation deleted successfully!');
          } catch (err) {
            console.error('Delete failed - Full error:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
            
            let errorMessage = 'Failed to delete donation';
            
            if (err.response?.status === 404) {
              errorMessage = 'This donation no longer exists (may have been deleted already)';
              fetchData();
            } else if (err.response?.status === 400) {
              errorMessage = 'Invalid donation ID';
            } else if (err.response?.data?.message) {
              errorMessage += `: ${err.response.data.message}`;
            } else if (err.response?.status) {
              errorMessage += ` (Status: ${err.response.status})`;
            } else if (err.message) {
              errorMessage += `: ${err.message}`;
            }
            
            alert(errorMessage);
          }
        }} />
      </section>
    </div>
  );
}

function CreateDonationForm({ onCreated }) {
  const [form, setForm] = useState({ donorName: '', amount: '', email: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.donorName.trim()) {
      newErrors.donorName = 'Donor name is required';
    }
    
    if (!form.amount || Number(form.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors below' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const payload = { ...form, amount: Number(form.amount) };
      await createDonation(payload);
      setForm({ donorName: '', amount: '', email: '', note: '' });
      setMessage({ type: 'success', text: 'Donation added successfully!' });
      if (onCreated) onCreated();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Create donation failed', err);
      setMessage({ type: 'error', text: 'Failed to create donation. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="create-donation-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="donorName">Donor Name *</label>
        <input
          id="donorName"
          name="donorName"
          type="text"
          placeholder="Enter donor name"
          value={form.donorName}
          onChange={handleChange}
          className={`form-input ${errors.donorName ? 'error' : form.donorName ? 'success' : ''}`}
        />
        {errors.donorName && <span className="error-text">{errors.donorName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount *</label>
        <input
          id="amount"
          name="amount"
          type="number"
          placeholder="Enter amount (₹)"
          value={form.amount}
          onChange={handleChange}
          className={`form-input ${errors.amount ? 'error' : form.amount && Number(form.amount) > 0 ? 'success' : ''}`}
        />
        {errors.amount && <span className="error-text">{errors.amount}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email (optional)"
          value={form.email}
          onChange={handleChange}
          className={`form-input ${errors.email ? 'error' : form.email && !errors.email ? 'success' : ''}`}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="note">Note</label>
        <input
          id="note"
          name="note"
          type="text"
          placeholder="Add a note (optional)"
          value={form.note}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading && <span className="btn-spinner"></span>}
        {loading ? 'Adding Donation...' : 'Add Donation'}
      </button>

      {message.text && (
        <div className={`form-message ${message.type}`}>
          {message.text}
        </div>
      )}
    </form>
  );
}
