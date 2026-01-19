import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Namaste Everyone, I am <span className="purple">Ashok Pudasaini </span>
            from <span className="purple"> Belkotgadhi-08, Nuwakot.</span>
            <br />
            I am currently employed as a Banker at Kamana Sewa Bikas Bank Limited.
            <br />

            <br />
            Apart from Banker, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Learning new technology
            </li>
            <li className="about-activity">
              <ImPointRight /> Writing Tech Blogs
            </li>
            <li className="about-activity">
              <ImPointRight /> photoshoot
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "गल्ति गर्नु प्रकृति हो‚
                 गल्ति स्वीकार्नु संकृति हो‚
                     गल्ति सुधार्नु प्रगति हो ।"{" "}
          </p>
          <footer className="blockquote-footer">अशोक पुडासैनी</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;