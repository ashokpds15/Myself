import React, { useEffect, useState, useRef } from "react";
import "./NEPSETicker.css";

// NEPSE API
const API_URL = "https://nepse-data-api.onrender.com/data/today";

const NEPSETicker = () => {
  const [stocks, setStocks] = useState([]);
  const [status, setStatus] = useState({ text: "", class: "" });
  const trackRef = useRef(null);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setStocks(data);
      } catch {
        setStocks([
          { symbol: "NABIL", ltp: 420, change: 4, perChange: 0.98 },
          { symbol: "NRN", ltp: 755, change: -10, perChange: -1.3 },
        ]);
      }
    }

    fetchData();
  }, []);

  // Scroll animation
  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.innerHTML += trackRef.current.innerHTML;
    let pos = 0;
    const speed = 1;

    function animate() {
      pos -= speed;
      trackRef.current.style.transform = `translateX(${pos}px)`;

      if (Math.abs(pos) >= trackRef.current.scrollWidth / 2) {
        pos = 0;
      }
      requestAnimationFrame(animate);
    }
    animate();
  }, [stocks]);

  // Market status
  useEffect(() => {
    const tickStatus = () => {
      const now = new Date();
      const npt = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })
      );
      const h = npt.getHours();
      const m = npt.getMinutes();
      const d = npt.getDay();
      const isOpenDay = d >= 0 && d <= 4;
      const isOpenTime = h >= 11 && (h < 15 || (h === 15 && m === 0));

      setStatus({
        text: isOpenDay && isOpenTime ? "🟢 Market Open" : "🔴 Market Closed",
        class: isOpenDay && isOpenTime ? "status-open" : "status-closed",
      });
    };

    tickStatus();
    const interval = setInterval(tickStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className={`market-status ${status.class}`}>
        {status.text}
      </div>
      <section className="indices-marquee">
        <div
          className="indices-marquee-track"
          ref={trackRef}
        >
          {stocks.map((s) => (
            <div className="ticker-entry" key={s.symbol}>
              <span className="t-symbol">{s.symbol}</span>
              <span className="t-ltp">Rs. {s.ltp}</span>
              <span
                className={`t-change ${
                  parseFloat(s.change) >= 0 ? "up" : "down"
                }`}
              >
                {parseFloat(s.change) >= 0 ? "▲" : "▼"} {s.change} (
                {s.perChange}%)
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NEPSETicker;