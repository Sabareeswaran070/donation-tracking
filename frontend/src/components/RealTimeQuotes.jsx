import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RealTimeQuotes() {
  const [quote, setQuote] = useState("Loading...");

  const fetchQuote = async () => {
    try {
      const res = await axios.get("https://api.quotable.io/random");
      setQuote(`"${res.data.content}" — ${res.data.author}`);
    } catch (err) {
      setQuote("Error fetching quote");
    }
  };

  useEffect(() => {
    fetchQuote();
    const interval = setInterval(fetchQuote, 60000); // update every 1 min
    return () => clearInterval(interval);
  }, []);

  return <p style={{ fontSize: "14px", lineHeight: "1.4em" }}>{quote}</p>;
}
