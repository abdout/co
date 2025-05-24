import { useEffect, useRef, RefObject, useState, useCallback } from 'react';
import { UseFormWatch } from 'react-hook-form';
import { ActivitySchema } from './validation';

interface ScrollRefs {
  skillsSectionRef: RefObject<HTMLDivElement | null>;
  activitySectionRef: RefObject<HTMLDivElement | null>;
  detailsSectionRef: RefObject<HTMLDivElement | null>;
  scrollToRef: (ref: RefObject<HTMLDivElement | null>, sectionType?: string) => void;
}

export function useScroll(
  watch: UseFormWatch<ActivitySchema>,
  selectedActivities: string[]
): ScrollRefs {
  // Create refs for scroll sections
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const activitySectionRef = useRef<HTMLDivElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);
  
  // Track if this is the first club selection
  const [hasScrolledToClubSelector, setHasScrolledToClubSelector] = useState(false);

  // Reliable scroll method that can be reused
  const scrollToRef = useCallback((ref: RefObject<HTMLDivElement | null>, sectionType?: string) => {
    if (!ref.current) return;
    
    console.log(`🔍 useScroll.scrollToRef called for ${sectionType || 'unknown'} section`, ref.current);
    
    // Special case for party section - needs minimal scrolling
    if (sectionType === 'party') {
      console.log("🎯 Using MINIMAL scroll for party section");
      
      try {
        // For party, skip scrollIntoView and only use direct container scrolling
        // with a very small offset to avoid scrolling too far
        const scrollContainer = 
          ref.current.closest('.scroll-area-viewport') || 
          ref.current.closest('.ScrollArea-viewport') ||
          document.querySelector('.scroll-area-viewport');
          
        if (scrollContainer) {
          // Use getBoundingClientRect to get more precise positioning
          const rect = ref.current.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          
          // Calculate how far the element is from the container's top
          const relativeTop = rect.top - containerRect.top;
          
          // Check if the party section is already visible or nearly visible - if so, don't scroll at all
          if (relativeTop >= -100 && relativeTop <= 100) {
            console.log("👁️ Party section already visible or nearly visible, SKIPPING scroll entirely");
            return;
          }
          
          // Apply very minimal scroll adjustment
          const currentScroll = scrollContainer.scrollTop;
          const targetScroll = currentScroll + relativeTop - 50; // Increased from -5 to -50
          
          // Smooth scroll with requestAnimationFrame
          const startTime = performance.now();
          const duration = 100; // Reduced from 300ms to 100ms for less noticeable scrolling
          
          const smoothScroll = (timestamp: number) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic function for smooth deceleration
            const ease = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = currentScroll + (targetScroll - currentScroll) * ease;
            scrollContainer.scrollTop = currentValue;
            
            if (progress < 1) {
              requestAnimationFrame(smoothScroll);
            }
          };
          
          requestAnimationFrame(smoothScroll);
          console.log("🎯 Party precise scroll executed");
          return;
        }
      } catch (e) {
        console.error("❌ Party precise scroll error:", e);
      }
    }
    
    // Different scroll margin based on section type
    const scrollMargin = sectionType === 'party' ? "-50px" : "-40px"; 
    ref.current.style.scrollMarginTop = scrollMargin;
    
    // Different offset for different sections
    const scrollOffset = sectionType === 'party' ? -50 : 40;
    
    // Try multiple scroll methods for maximum compatibility
    try {
      // Primary method for non-party sections
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Find parent scrollable container as fallback
      setTimeout(() => {
        if (!ref.current) return;
        
        // Try finding scroll container
        const scrollContainer = 
          ref.current.closest('.scroll-area-viewport') || 
          ref.current.closest('.ScrollArea-viewport') ||
          document.querySelector('.scroll-area-viewport');
        
        if (scrollContainer) {
          const offsetTop = ref.current.offsetTop;
          scrollContainer.scrollTop = offsetTop - scrollOffset;
          console.log(`📜 Fallback scroll executed to: ${offsetTop - scrollOffset} for ${sectionType || 'unknown'}`);
        }
      }, 150);
    } catch (e) {
      console.error("❌ Error during scroll:", e);
    }
  }, []);

  // One-time scroll effect when the first club is selected
  useEffect(() => {
    // Only run this once when activities change from 0 to some value
    if (selectedActivities.length > 0 && !hasScrolledToClubSelector) {
      // Use a slightly longer timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        if (activitySectionRef.current) {
          scrollToRef(activitySectionRef, 'activity');
          setHasScrolledToClubSelector(true);
        }
      }, 500); // Increased timeout for reliability
      
      return () => clearTimeout(timer);
    }
  }, [selectedActivities, hasScrolledToClubSelector, scrollToRef]);

  // No automatic scrolling to details section - club selector stays at top

  return {
    skillsSectionRef,
    activitySectionRef,
    detailsSectionRef,
    scrollToRef
  };
} 