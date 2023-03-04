import React from "react";
import "./About.css";
import Card from "./Card";

function About() {
  return (
    <div id="about-screen" className="fullscreen">
      <div className="fullscreen-blur">
        <div className="fullscreen-center" style={{ flexDirection: "row", gap: "16px" }}>
          <Card cardID={1} />
          <div id="about-container">With Cardify you can create and manage a business cards for your businesses. Other users will be able to see your business details and contact you with the contact ways you provide on your business cards.</div>
        </div>
      </div>
    </div>
  );
}

export default About;
