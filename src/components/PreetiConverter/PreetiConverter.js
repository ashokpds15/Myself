import React from "react";
import "./PreetiConverter.css";

function PreetiConverter() {
  return (
    <main className="preeti-embed-page">
      <h1 className="visually-hidden">Unicode and Preeti converter</h1>
      <iframe
        className="preeti-embed-frame"
        title="Nepali Unicode and Preeti converter"
        src="https://uni-to-preeti.vercel.app/"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="clipboard-read; clipboard-write"
      />
    </main>
  );
}

export default PreetiConverter;
