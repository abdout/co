"use client";

import React from "react";
import { Content } from "./content";

const About = () => {
  return (
    <div className="container mx-auto px-14 pt-40 bg-primary text-white">
      <div className="flex flex-col lg:flex-row">
        {/* Left Column - Content at scale 0.8 */}
        <div className="w-full relative pl-4">
          <div style={{ transform: 'scale(0.2)', transformOrigin: 'top left' }}>
            <Content />
          </div>
          {/* Transparent tracker box */}
          <div 
            className="absolute w-40 h-24 border border-muted-foreground"
            style={{
              left: '-20px',
              top: '-26px',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* Right Column - Content at normal scale */}
        <div className="w-full -ml-40">
          <Content />
        </div>
      </div>
    </div>
  );
};

export default About;
