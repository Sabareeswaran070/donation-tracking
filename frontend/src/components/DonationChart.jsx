import React, { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DonationChart({ donations }) {
  const dailyTotals = useMemo(() => {
    const map = {};
    if (!Array.isArray(donations)) return [];
    donations.forEach(d => {
      // defensive: ensure date and amount exist and are primitive values
      const dateKey = d && d.date ? new Date(d.date).toLocaleDateString() : "Unknown";
      const amount = d && typeof d.amount === 'number' ? d.amount : Number(d && d.amount) || 0;
      map[dateKey] = (map[dateKey] || 0) + amount;
    });
    return Object.entries(map).map(([date, total]) => ({ date: String(date), total: Number(total) }));
  }, [donations]);

  const data = {
    labels: dailyTotals.map(d => String(d.date)),
    datasets: [
      {
        label: "Donations (₹)",
        data: dailyTotals.map(d => Number(d.total) || 0),
        borderWidth: 1
      }
    ]
  };

  // If data is empty or invalid, render a helpful message instead of the chart
  const hasValidData = Array.isArray(data.datasets) && data.datasets[0].data.some(d => typeof d === 'number' && !isNaN(d));

  // Debugging: log incoming props and computed values so we can catch unexpected objects
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('DonationChart debug:', { donations, dailyTotals, data, hasValidData });
  }

  return (
    <div style={{ width: "100%", maxWidth: "800px" }}>
      <h3>Donation Trend</h3>
      {!hasValidData ? (
        <p>No donation data available to render the chart.</p>
      ) : (
        <Bar data={data} />
      )}
    </div>
  );
}
