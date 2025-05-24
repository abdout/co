import { RefObject, useEffect, useCallback } from 'react';

interface UseDegreeScrollProps {
  degreeSelectorRef: RefObject<HTMLDivElement | null>;
  educationLevel: string;
  defaultLevel?: string;
}

export const useDegreeScroll = ({ 
  degreeSelectorRef, 
  educationLevel, 
  defaultLevel = 'student' 
}: UseDegreeScrollProps) => {
  // Create a memoized scroll function
  const scrollToNextSection = useCallback(() => {
    console.log('[ScrollDebug] Attempting scroll with:', {
      educationLevel,
      defaultLevel,
      hasRef: !!degreeSelectorRef.current
    });

    if (!degreeSelectorRef.current) {
      console.log('[ScrollDebug] No ref available');
      return;
    }

    // Find all possible scroll containers
    const scrollContainers: HTMLElement[] = [];
    let element: HTMLElement | null = degreeSelectorRef.current;
    
    while (element) {
      const style = window.getComputedStyle(element);
      if (style.overflow === 'auto' || style.overflow === 'scroll' || 
          style.overflowY === 'auto' || style.overflowY === 'scroll') {
        scrollContainers.push(element);
      }
      element = element.parentElement;
    }

    console.log('[ScrollDebug] Found scroll containers:', scrollContainers.length);

    // Get the next element to scroll to
    const nextElement = degreeSelectorRef.current.nextElementSibling as HTMLElement;
    if (!nextElement) {
      console.log('[ScrollDebug] No next element found');
      return;
    }

    // Try each scroll container
    for (const container of scrollContainers) {
      try {
        console.log('[ScrollDebug] Trying container:', container);
        const containerRect = container.getBoundingClientRect();
        const nextElementRect = nextElement.getBoundingClientRect();
        
        // Calculate relative position
        const relativeTop = nextElementRect.top - containerRect.top;
        const scrollTop = container.scrollTop + relativeTop;

        console.log('[ScrollDebug] Scroll calculations:', {
          containerTop: containerRect.top,
          elementTop: nextElementRect.top,
          relativeTop,
          currentScroll: container.scrollTop,
          targetScroll: scrollTop
        });

        // Try to scroll
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
        
        // Force reflow
        void container.offsetHeight;
        
        console.log('[ScrollDebug] Scroll attempted on container');
      } catch (error) {
        console.error('[ScrollDebug] Scroll failed for container:', error);
      }
    }

    // Fallback to direct scrollIntoView as last resort
    try {
      console.log('[ScrollDebug] Attempting direct scrollIntoView');
      nextElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } catch (error) {
      console.error('[ScrollDebug] Direct scroll failed:', error);
    }
  }, [degreeSelectorRef, educationLevel, defaultLevel]);

  // Effect to trigger scroll
  useEffect(() => {
    console.log('[ScrollDebug] Effect triggered:', {
      educationLevel,
      defaultLevel,
      hasRef: !!degreeSelectorRef.current
    });

    if (educationLevel && educationLevel !== defaultLevel) {
      // Try multiple times with increasing delays
      const delays = [0, 100, 300, 500];
      
      delays.forEach(delay => {
        const timer = setTimeout(() => {
          console.log(`[ScrollDebug] Attempting scroll after ${delay}ms`);
          scrollToNextSection();
        }, delay);

        return () => clearTimeout(timer);
      });
    }
  }, [educationLevel, defaultLevel, scrollToNextSection]);
}; 