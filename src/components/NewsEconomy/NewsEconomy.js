import React from "react";
import "./NewsEconomy.css";

function NewsEconomy() {
  return (
    <main className="news-economy-page">
      <h1 className="visually-hidden">News and Economy</h1>
      <div className="news-economy-frame">
        <iframe
          title="NepalOSINT News and Economy"
          src="https://nepalosint.com/"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <div className="news-economy-brand-mask" aria-hidden="true" />
        <div className="news-economy-tools-mask" aria-hidden="true" />
      </div>
    </main>
  );
}

export default NewsEconomy;
