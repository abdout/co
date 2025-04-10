'use client'
import React, { useRef, useEffect, useState } from 'react'

const page = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Handler for wheel events (mouse wheel)
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) { // Only if not zooming
        e.preventDefault();
        container.scrollBy({
          left: e.deltaY,
          behavior: 'smooth'
        });
      }
    };

    // Add touch-based scrolling for touchpads
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleTouchStart = (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleTouchEnd = () => {
      isDown = false;
      findActiveItem();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    // Track mousedown for better trackpad support
    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseUp = () => {
      isDown = false;
      findActiveItem();
    };

    const handleMouseLeave = () => {
      if (isDown) {
        isDown = false;
        findActiveItem();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    // Function to find active item
    const findActiveItem = () => {
      const items = Array.from(container.children);
      const containerCenter = container.offsetWidth / 2;
      const containerScrollLeft = container.scrollLeft;
      
      let minDistance = Infinity;
      let activeItemIndex = 0;
      
      items.forEach((item, index) => {
        const element = item as HTMLElement;
        const itemCenter = element.offsetLeft + (element.offsetWidth / 2) - containerScrollLeft;
        const distance = Math.abs(containerCenter - itemCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          activeItemIndex = index;
        }
      });
      
      setActiveIndex(activeItemIndex);
      
      // Smooth scroll to the active item
      const activeItem = items[activeItemIndex] as HTMLElement;
      if (activeItem) {
        const scrollTo = activeItem.offsetLeft - container.offsetWidth / 2 + activeItem.offsetWidth / 2;
        container.scrollTo({
          left: scrollTo,
          behavior: 'smooth'
        });
      }
    };

    // Add scroll end detection
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isDown) {
          findActiveItem();
        }
      }, 150);
    };

    // Add all event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('scroll', handleScroll);
    
    return () => {
      // Clean up all event listeners
      clearTimeout(scrollTimeout);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='h-screen w-screen items-center justify-center flex'>
        <div className='w-full max-w-screen-xl mx-auto'>
            <div 
              ref={scrollContainerRef}
              className='flex gap-4 overflow-x-auto pb-4 scroll-smooth' 
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                paddingLeft: '20px',
                paddingRight: '20px',
                cursor: 'grab'
              }}
            >
                {Array.from({ length: 12 }).map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-40 h-60 bg-transparent flex-shrink-0 transition-all duration-300 ease-out ${
                      activeIndex === index ? 'scale-105' : 'scale-100'
                    }`}
                  >
                    <div className={`w-full h-full transition-colors duration-300 ${
                      activeIndex === index ? 'bg-blue-900' : 'bg-black'
                    }`}>
                    </div>
                  </div>
                ))}
            </div>
            
            <style jsx global>{`
              /* Hide scrollbar for Chrome, Safari and Opera */
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
        </div>
    </div>
  )
}

export default page