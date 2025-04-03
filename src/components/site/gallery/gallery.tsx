"use client";

import React, { useRef, useEffect } from "react";
import "./styles.css";

interface GalleryProps {
  images?: string[];
}

const defaultImages = [
  "https://images.unsplash.com/photo-1670510521052-9f29bce5bbfb",
  "https://images.unsplash.com/photo-1670431667395-93114aff8545",
  "https://images.unsplash.com/photo-1665680521183-1a77175d81dd",
  "https://images.unsplash.com/photo-1670510521081-fe2e687c3153",
  "https://images.unsplash.com/photo-1670510521081-fe2e687c3153",
  "https://images.unsplash.com/photo-1670510521047-da0e1e68524d",
  "https://images.unsplash.com/photo-1664575196412-ed801e8333a1",
  "https://images.unsplash.com/photo-1664575196412-ed801e8333a1",
];

export const Gallery = ({ images = defaultImages }: GalleryProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleMouseDown = (e: MouseEvent) => {
      const galleryRect = track.closest('.gallery-container')?.getBoundingClientRect();
      if (!galleryRect) return;
      
      if (
        e.clientY >= galleryRect.top &&
        e.clientY <= galleryRect.bottom &&
        e.clientX >= galleryRect.left &&
        e.clientX <= galleryRect.right
      ) {
        track.dataset.mouseDownAt = e.clientX.toString();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (track.dataset.mouseDownAt === "0") return;
      
      const mouseDelta = parseFloat(track.dataset.mouseDownAt || "0") - e.clientX;
      const maxDelta = window.innerWidth;
      
      let percentage = (mouseDelta / maxDelta) * -100;
      let nextPercentage = parseFloat(track.dataset.prevPercentage || "0") + percentage;

      // Reset position when scrolling too far in either direction
      if (nextPercentage > 0) {
        nextPercentage = -100;
        track.dataset.mouseDownAt = e.clientX.toString();
      } else if (nextPercentage < -100) {
        nextPercentage = 0;
        track.dataset.mouseDownAt = e.clientX.toString();
      }
      
      track.dataset.percentage = nextPercentage.toString();
      
      track.animate(
        {
          transform: `translate(${nextPercentage}%, -50%)`
        },
        { duration: 1200, fill: "forwards" }
      );
      
      const imageElements = track.getElementsByClassName("image");
      for (let i = 0; i < imageElements.length; i++) {
        const image = imageElements[i] as HTMLElement;
        image.animate(
          {
            objectPosition: `${nextPercentage + 100}% 50%`
          },
          { duration: 1200, fill: "forwards" }
        );
      }
    };
    
    const handleMouseUp = () => {
      track.dataset.mouseDownAt = "0";
      track.dataset.prevPercentage = track.dataset.percentage || "0";
    };
    
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = "0";
    track.style.transform = "translate(0%, -50%)";
    
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  
  return (
    <section id="gallery-section">
      <div className="gallery-container">
        <div
          id="image-track"
          ref={trackRef} 
          data-mouse-down-at="0"
          data-prev-percentage="0"
          style={{ left: '0%' }}
        >
          {images.map((src, index) => (
            <img
              key={index}
              className="image"
              src={src}
              alt={`Gallery image ${index + 1}`}
              draggable="false"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
