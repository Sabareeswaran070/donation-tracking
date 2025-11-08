import React, { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DonationChart({ donations }) {
  const dailyTotals = useMemo(() => {
    const map = {};
    donations.forEach(d => {
      const date = new Date(d.date).toLocaleDateString();
      map[date] = (map[date] || 0) + d.amount;
    });
    return Object.entries(map).map(([date, total]) => ({ date, total }));
  }, [donations]);

  const data = {
    labels: dailyTotals.map(d => d.date),
    datasets: [
      {
        label: "Donations (₹)",
        data: dailyTotals.map(d => d.total),
        borderWidth: 1
      }
    ]
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px" }}>
      <h3>Donation Trend</h3>
      <Bar data={data} />
    </div>
  );
}
