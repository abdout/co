import { useEffect, useRef } from 'react';

/**
 * A custom hook that provides auto-scrolling functionality for degree rows
 * @returns An object with scroll-related functions
 */
export const useAutoScroll = () => {
  const isScrollingRef = useRef(false);
  const lastScrolledRef = useRef('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find the primary scroll container (usually a Radix scroll area)
  const findScrollContainer = () => {
    // Try to find a Radix scroll viewport first
    const radixContainer = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    if (radixContainer) return radixContainer;
    
    // If no Radix container, look for other scrollable elements
    const scrollContainers = document.querySelectorAll('.scroll-container, .scrollable, [role="region"][tabindex]');
    if (scrollContainers.length > 0) return scrollContainers[0] as HTMLElement;
    
    // If all else fails, use document.documentElement
    return document.documentElement;
  };

  // Perform a single, clean scroll to the target element
  const scrollToElement = (element: HTMLElement, offset = 0) => {
    // Don't scroll if already scrolling or if we just scrolled to this element
    if (isScrollingRef.current || lastScrolledRef.current === element.id) {
      return;
    }
    
    // Set scrolling state
    isScrollingRef.current = true;
    lastScrolledRef.current = element.id;
    
    // Find the scroll container once
    const container = findScrollContainer();
    
    try {
      // Get element position
      const targetRect = element.getBoundingClientRect();
      
      if (container) {
        // Get the container's position
        const containerRect = container.getBoundingClientRect();
        
        // Calculate the scroll distance to bring the element to the top of the container
        let scrollTop;
        
        // If this is a Radix UI scroll area, use their specific calculation
        if (container.hasAttribute('data-radix-scroll-area-viewport')) {
          // For Radix, use their specific calculation
          scrollTop = container.scrollTop + (targetRect.top - containerRect.top) - offset;
        } else {
          // For regular containers, use this more reliable calculation
          const currentScrollTop = container.scrollTop;
          const elementRelativeTop = targetRect.top - containerRect.top;
          scrollTop = currentScrollTop + elementRelativeTop - 30; // 30px padding
        }
        
        // Apply the scroll with smooth behavior
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      } else {
        // If we couldn't find a container, fall back to scrollIntoView
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } catch (error) {
      console.error('Scroll error:', error);
      
      // Last resort - try the most basic approach
      try {
        window.scrollTo({
          top: element.offsetTop - 50,
          behavior: 'smooth'
        });
      } catch {
        // Silently fail
      }
    }
    
    // Reset scrolling state after animation completes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      
      // Reset the last scrolled element after a longer period
      setTimeout(() => {
        lastScrolledRef.current = '';
      }, 3000);
    }, 1000);
  };

  // Scroll to a section by ID
  const scrollToNextRow = (sectionId: string) => {
    // Use a short delay to ensure DOM is fully updated
    setTimeout(() => {
      // Find the element
      const section = document.getElementById(sectionId);
      
      if (section) {
        // Get the parent element to ensure we scroll to show the full section
        const parentElement = section.parentElement;
        
        // Scroll to the target element
        scrollToElement(section);
        
        // If that doesn't work well, try scrolling to the parent
        setTimeout(() => {
          if (parentElement && section.getBoundingClientRect().top < 0) {
            scrollToElement(parentElement);
          }
        }, 100);
      }
    }, 200);
  };

  // Hook for scrolling when degree selection changes
  const useDegreeChangeScroll = (educationLevel: string) => {
    const prevLevelRef = useRef<string | null>(null);
    
    useEffect(() => {
      // Only scroll when education level changes and it's a different value
      if (prevLevelRef.current !== educationLevel && educationLevel) {
        const sectionId = `section-${educationLevel}`;
        scrollToNextRow(sectionId);
        prevLevelRef.current = educationLevel;
      }
      
      // Cleanup function
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [educationLevel]);
  };
  
  return {
    scrollToNextRow,
    scrollToElement,
    useDegreeChangeScroll
  };
}; 