"use client";

import React, { useRef, useEffect } from "react";
import "./styles.css";

interface GalleryProps {
  images?: string[];
}

const defaultImages = [
  "/gallery/1.png",
  "/gallery/2.jpg",
  "/gallery/3.jpg",
  "/gallery/4.png",
  "/gallery/5.png",
  "/gallery/6.png",
  "/gallery/7.png",
  "/gallery/8.png",
//   "/gallery/9.png",
  "/gallery/10.png",
  "/gallery/11.png",
  "/gallery/12.png",
  "/gallery/13.png",
  "/gallery/14.png",
  "/gallery/15.jpg",
  "/gallery/16.png",
  "/gallery/17.png",
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
      const maxDelta = window.innerWidth * 2;
      
      let percentage = (mouseDelta / maxDelta) * -100;
      let prevPercentage = parseFloat(track.dataset.prevPercentage || "0");
      let nextPercentage = prevPercentage + percentage;

      // Handle infinite loop
      if (nextPercentage > 0) {
        const excess = nextPercentage;
        nextPercentage = -100 + excess;
        track.dataset.mouseDownAt = e.clientX.toString();
        track.dataset.prevPercentage = nextPercentage.toString();
      } else if (nextPercentage < -100) {
        const excess = nextPercentage + 100;
        nextPercentage = excess;
        track.dataset.mouseDownAt = e.clientX.toString();
        track.dataset.prevPercentage = nextPercentage.toString();
      }
      
      track.dataset.percentage = nextPercentage.toString();
      track.style.transform = `translate(${nextPercentage}%, -50%)`;
      
      const imageElements = track.getElementsByClassName("image");
      for (let i = 0; i < imageElements.length; i++) {
        const image = imageElements[i] as HTMLElement;
        image.style.objectPosition = `${100 + nextPercentage}% 50%`;
      }
    };
    
    const handleMouseUp = () => {
      track.dataset.mouseDownAt = "0";
      track.dataset.prevPercentage = track.dataset.percentage;
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
  
  // Create a continuous array of images for seamless looping
  const displayImages = [...images, ...images, ...images];
  
  return (
    <section id="gallery-section ">
      <div className="gallery-container space-y-6 bg-primary">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 text-background">Moment</h2>
          <p className="text-background/70 max-w-2xl mx-auto">
            Image collection
          </p>
        </div>
        <div
          id="image-track"
          ref={trackRef} 
          data-mouse-down-at="0"
          data-prev-percentage="0"
          style={{ left: '0' }}
        >
          {displayImages.map((src, index) => (
            <img
              key={`${src}-${index}`}
              className="image"
              src={src}
              alt={`Gallery image ${(index % images.length) + 1}`}
              draggable="false"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
