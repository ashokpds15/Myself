import React, { useEffect, useState } from "react";
import "./NEPSETicker.css";

const API_URL = "https://nepse-data-api.onrender.com/data/today";

const isValidStock = (stock) =>
  stock &&
  typeof stock.symbol === "string" &&
  Number.isFinite(Number(stock.ltp)) &&
  Number.isFinite(Number(stock.change)) &&
  Number.isFinite(Number(stock.perChange));

const NEPSETicker = () => {
  const [stocks, setStocks] = useState([]);
  const [status, setStatus] = useState({ text: "", class: "" });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Market data request failed (${response.status})`);
        }

        const data = await response.json();
        const validStocks = Array.isArray(data) ? data.filter(isValidStock) : [];
        setStocks(validStocks);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        console.error("Could not load market data:", error);
        setStocks([]);
      }
    }

    fetchData();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const tickStatus = () => {
      const now = new Date();
      const nepalTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })
      );
      const hour = nepalTime.getHours();
      const minute = nepalTime.getMinutes();
      const day = nepalTime.getDay();
      const isOpenDay = day >= 0 && day <= 4;
      const isOpenTime = hour >= 11 && (hour < 15 || (hour === 15 && minute === 0));
      const isOpen = isOpenDay && isOpenTime;

      setStatus({
        text: isOpen ? "🟢 Market Open" : "🔴 Market Closed",
        class: isOpen ? "status-open" : "status-closed",
      });
    };

    tickStatus();
    const interval = window.setInterval(tickStatus, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const renderStocks = (keyPrefix) =>
    stocks.map((stock, index) => (
      <div className="ticker-entry" key={`${keyPrefix}-${stock.symbol}-${index}`}>
        <span className="t-symbol">{stock.symbol}</span>
        <span className="t-ltp">Rs. {stock.ltp}</span>
        <span
          className={`t-change ${Number(stock.change) >= 0 ? "up" : "down"}`}
        >
          {Number(stock.change) >= 0 ? "▲" : "▼"} {stock.change} (
          {stock.perChange}%)
        </span>
      </div>
    ));

  return (
    <div>
      <div className={`market-status ${status.class}`} aria-live="polite">
        {status.text}
      </div>
      <section className="indices-marquee" aria-label="Nepal stock prices">
        {stocks.length === 0 ? (
          <p className="ticker-unavailable">Market quotes unavailable</p>
        ) : (
          <div className="indices-marquee-track">
            <div className="indices-marquee-group">{renderStocks("primary")}</div>
            <div
              className="indices-marquee-group"
              aria-hidden="true"
            >
              {renderStocks("duplicate")}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default NEPSETicker;
