"use client";

import React, { useRef, useEffect, useState } from "react";
import { Content } from "./content";

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(10);
  const [boxStartTop, setBoxStartTop] = useState(10);
  const [scrollPercentage, setScrollPercentage] = useState(10);
  const [textSpeedFactor, setTextSpeedFactor] = useState(0.4);

  // Constants
  const initialBoxTop = -26;
  const scaleValue = 0.2;

  // Scroll the content based on a percentage (0-1)
  const scrollContentTo = (percentage: number) => {
    if (!rightContentRef.current || !leftContentRef.current) return;
    
    // Clamp percentage between 0 and 1
    const clampedPercentage = Math.max(0, Math.min(percentage, 1));
    
    // Update state
    setScrollPercentage(clampedPercentage);
    
    // Scroll the right content
    const rightContent = rightContentRef.current;
    const maxScroll = rightContent.scrollHeight - rightContent.clientHeight;
    const scrollPosition = maxScroll * clampedPercentage;
    rightContent.scrollTop = scrollPosition;
    
    // Move the small text
    if (leftContentRef.current) {
      const leftContent = leftContentRef.current;
      const leftContentHeight = leftContent.scrollHeight;
      const textPosition = leftContentHeight * clampedPercentage * textSpeedFactor;
      leftContent.style.transform = `scale(${scaleValue}) translateY(-${textPosition}px)`;
    }
    
    // Move the box
    if (boxRef.current && leftColumnRef.current) {
      const leftColumn = leftColumnRef.current;
      const boxRect = boxRef.current.getBoundingClientRect();
      const leftColumnRect = leftColumn.getBoundingClientRect();
      const maxBoxTravel = leftColumnRect.height - boxRect.height - Math.abs(initialBoxTop);
      
      // Calculate box position based on scroll percentage
      const boxPosition = maxBoxTravel * clampedPercentage;
      
      // Apply position, adding the initial offset
      boxRef.current.style.top = `${initialBoxTop + boxPosition}px`;
    }
  };

  useEffect(() => {
    // Check if an element is part of the header
    const isHeaderElement = (element: Element | null): boolean => {
      while (element) {
        if (element.tagName === 'NAV' && element.classList.contains('fixed')) {
          return true;
        }
        element = element.parentElement;
      }
      return false;
    };

    // Handle wheel events for custom scrolling
    const handleWheel = (e: WheelEvent) => {
      // Don't prevent default if interacting with the header
      if (isHeaderElement(e.target as Element)) {
        return;
      }
      
      // Check if the mouse is in the header area (top 80px of screen)
      if (e.clientY < 80) {
        return;
      }
      
      e.preventDefault();
      
      // Get the container
      if (!rightContentRef.current) return;
      
      // Calculate how much to scroll based on wheel delta
      const sensitivity = 0.003; // Lower value for slower scrolling, higher for faster
      const delta = e.deltaY * sensitivity;
      
      // Update the scroll percentage
      const newPercentage = scrollPercentage + delta;
      
      // Scroll all content
      scrollContentTo(newPercentage);
    };

    // Mouse event handlers for dragging the box
    const handleMouseDown = (e: MouseEvent) => {
      // Don't handle if interacting with the header
      if (isHeaderElement(e.target as Element) || e.clientY < 80) {
        return;
      }
      
      if (!boxRef.current) return;
      
      // Check if click is on the box
      const boxElem = boxRef.current;
      const boxRect = boxElem.getBoundingClientRect();
      
      if (
        e.clientX >= boxRect.left && 
        e.clientX <= boxRect.right && 
        e.clientY >= boxRect.top && 
        e.clientY <= boxRect.bottom
      ) {
        setIsDragging(true);
        setDragStartY(e.clientY);
        setBoxStartTop(parseFloat(boxElem.style.top || `${initialBoxTop}`));
        e.preventDefault();
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Don't handle if interacting with the header
      if (isHeaderElement(e.target as Element) || e.clientY < 80) {
        return;
      }
      
      if (!isDragging || !boxRef.current || !leftColumnRef.current) return;
      
      // Calculate new position
      const deltaY = e.clientY - dragStartY;
      let newTop = boxStartTop + deltaY;
      
      // Calculate bounds
      const leftColumnRect = leftColumnRef.current.getBoundingClientRect();
      const boxRect = boxRef.current.getBoundingClientRect();
      const maxBoxTravel = leftColumnRect.height - boxRect.height - Math.abs(initialBoxTop);
      
      // Ensure the box stays within bounds
      newTop = Math.max(initialBoxTop, Math.min(initialBoxTop + maxBoxTravel, newTop));
      
      // Set the new position
      boxRef.current.style.top = `${newTop}px`;
      
      // Calculate the new scroll percentage
      const boxPosition = newTop - initialBoxTop;
      const newPercentage = boxPosition / maxBoxTravel;
      
      // Scroll all content
      scrollContentTo(newPercentage);
      
      e.preventDefault();
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
    
    // Click handler for the left content area
    const handleLeftColumnClick = (e: MouseEvent) => {
      // Don't handle if interacting with the header
      if (isHeaderElement(e.target as Element) || e.clientY < 80) {
        return;
      }
      
      if (!leftColumnRef.current || !boxRef.current || isDragging) return;
      
      const leftColumn = leftColumnRef.current;
      const box = boxRef.current;
      
      const leftColumnRect = leftColumn.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      
      // Check if click is within the left column but not on the box
      if (
        e.clientX >= leftColumnRect.left && 
        e.clientX <= leftColumnRect.right && 
        e.clientY >= leftColumnRect.top && 
        e.clientY <= leftColumnRect.bottom &&
        !(
          e.clientX >= boxRect.left && 
          e.clientX <= boxRect.right && 
          e.clientY >= boxRect.top && 
          e.clientY <= boxRect.bottom
        )
      ) {
        // Calculate click position relative to the left column
        const clickY = e.clientY - leftColumnRect.top;
        
        // Calculate max box travel
        const maxBoxTravel = leftColumnRect.height - boxRect.height - Math.abs(initialBoxTop);
        
        // Calculate where the box center should be
        const boxCenterY = clickY - boxRect.height / 2;
        
        // Calculate the new box position, constrained to the valid range
        let newBoxPosition = Math.max(0, Math.min(boxCenterY, maxBoxTravel));
        
        // Calculate the new scroll percentage
        const newPercentage = newBoxPosition / maxBoxTravel;
        
        // Scroll all content
        scrollContentTo(newPercentage);
      }
    };
    
    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip keyboard shortcuts when focus is on input fields
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }
      
      // Page Up and Page Down for larger scrolling
      const largeDelta = 0.1;
      
      if (e.key === 'PageUp') {
        scrollContentTo(scrollPercentage - largeDelta);
        e.preventDefault();
      } else if (e.key === 'PageDown') {
        scrollContentTo(scrollPercentage + largeDelta);
        e.preventDefault();
      } 
      // Arrow keys for smaller scrolling
      else if (e.key === 'ArrowUp') {
        scrollContentTo(scrollPercentage - 0.02);
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        scrollContentTo(scrollPercentage + 0.02);
        e.preventDefault();
      }
      // Home and End to go to top or bottom
      else if (e.key === 'Home') {
        scrollContentTo(0);
        e.preventDefault();
      } else if (e.key === 'End') {
        scrollContentTo(1);
        e.preventDefault();
      }
      // - and + to decrease/increase text scroll speed
      else if (e.key === '-') {
        setTextSpeedFactor(prev => Math.max(0.05, prev - 0.05));
        // Re-apply scrolling to update
        scrollContentTo(scrollPercentage);
        e.preventDefault();
      } else if (e.key === '+' || e.key === '=') {
        setTextSpeedFactor(prev => prev + 0.05);
        // Re-apply scrolling to update
        scrollContentTo(scrollPercentage);
        e.preventDefault();
      }
    };
    
    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleLeftColumnClick);
    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent default browser scroll behavior
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleLeftColumnClick);
      window.removeEventListener('keydown', handleKeyDown);
      
      // Restore default browser scroll behavior
      document.body.style.overflow = '';
    };
  }, [isDragging, dragStartY, boxStartTop, scrollPercentage, textSpeedFactor]);

  return (
    <div ref={containerRef} className="container mx-auto px-14  bg-primary text-white">
      <div className="flex flex-col lg:flex-row h-[100vh]">
        {/* Left Column - Content at scale with custom scrollbar */}
        <div ref={leftColumnRef} className="w-full relative pt-36 pl-4 h-full">
          <div ref={leftContentRef} style={{ transform: `scale(${scaleValue})`, transformOrigin: 'top left' }}>
            <Content />
          </div>
          {/* Transparent tracker box - with cursor styling for drag */}
          <div 
            ref={boxRef}
            className="absolute w-40 h-24 mt-44 border border-muted-foreground hover:border-white hover:border-opacity-70 "
            style={{
              left: '-20px',
              top: `${initialBoxTop}px`,
              userSelect: 'none',
              zIndex: 10
            }}
          />
          {/* Clickable overlay for the entire left column */}
          <div 
            className="absolute inset-0"
            style={{ zIndex: 5 }}
          />
        </div>

        {/* Right Column - Content at normal scale with hidden scrollbar */}
        <div className="w-full -ml-40 h-full relative z-50 ">
          <div 
            ref={rightContentRef}
            className="h-full overflow-hidden"
          >
            <Content />
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default About;
