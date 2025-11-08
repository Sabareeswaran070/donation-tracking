import React, { useEffect, useState } from "react";
import API from "../api";
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
        <DonationTable donations={donations} />
      </section>
    </div>
  );
}
