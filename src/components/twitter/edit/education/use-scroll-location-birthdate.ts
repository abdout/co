'use client';

import { useEffect, useRef, useState } from 'react';
import { InformationSchema } from './validation';
import { UseFormWatch } from 'react-hook-form';

interface UseScrollLocationBirthdateProps {
  watch: UseFormWatch<InformationSchema>;
  isPrefilledData: boolean;
}

export const useScrollLocationBirthdate = ({
  watch,
  isPrefilledData,
}: UseScrollLocationBirthdateProps) => {
  // Console log the initialization
  console.log('[ScrollDebug] Hook initialized with isPrefilledData:', isPrefilledData);
  
  const locationRef = useRef<HTMLDivElement | null>(null);
  const birthdateRef = useRef<HTMLDivElement | null>(null);
  
  // State to track if fields have been manually updated by user
  const [locationInteracted, setLocationInteracted] = useState(false);
  const [birthdateInteracted, setbirthdateInteracted] = useState(false);
  
  // State to track if fields are complete
  const [locationComplete, setLocationComplete] = useState(false);
  const [birthdateComplete, setBirthdateComplete] = useState(false);

  // Track focus states
  const [locationFocused, setLocationFocused] = useState(false);
  const [birthdateFocused, setBirthdateFocused] = useState(false);
  
  // Track if we've already scrolled on focus for each section
  const hasScrolledLocationOnFocus = useRef(false);
  const hasScrolledBirthdateOnFocus = useRef(false);

  // Track initial values of fields to detect real user changes
  const initialValues = useRef({
    location: {
      currentCountry: watch('currentCountry'),
      currentState: watch('currentState'),
      currentLocality: watch('currentLocality'),
      currentAdminUnit: watch('currentAdminUnit'),
      currentNeighborhood: watch('currentNeighborhood')
    },
    birthdate: {
      birthCountry: watch('birthCountry'),
      birthState: watch('birthState'),
      birthLocality: watch('birthLocality'),
      birthYear: watch('birthYear'),
      birthMonth: watch('birthMonth')
    }
  });
  
  // Flag to track if we have set the initial values
  const initialValuesSet = useRef(false);
  
  // Update initial values on first mount to ensure they're set correctly
  useEffect(() => {
    if (!initialValuesSet.current) {
      console.log('[ScrollDebug] Setting initial values on first mount');
      
      initialValues.current = {
        location: {
          currentCountry: watch('currentCountry'),
          currentState: watch('currentState'),
          currentLocality: watch('currentLocality'),
          currentAdminUnit: watch('currentAdminUnit'),
          currentNeighborhood: watch('currentNeighborhood')
        },
        birthdate: {
          birthCountry: watch('birthCountry'),
          birthState: watch('birthState'),
          birthLocality: watch('birthLocality'),
          birthYear: watch('birthYear'),
          birthMonth: watch('birthMonth')
        }
      };
      
      initialValuesSet.current = true;
      
      console.log('[ScrollDebug] Initial values set:', initialValues.current);
    }
  }, [watch]);

  // Track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Track if we've already scrolled for a specific section
  const hasScrolledLocation = useRef(false);
  const hasScrolledBirthdate = useRef(false);
  
  // Track if there's been real user interaction since load
  const [hasRealUserInteraction, setHasRealUserInteraction] = useState(false);

  // Console log the state changes
  useEffect(() => {
    console.log('[ScrollDebug] State changed:', { 
      locationInteracted, 
      birthdateInteracted, 
      locationComplete, 
      birthdateComplete,
      hasRealUserInteraction,
      isMobile,
      hasScrolledLocation: hasScrolledLocation.current,
      hasScrolledBirthdate: hasScrolledBirthdate.current,
      locationFocused,
      birthdateFocused,
      hasScrolledLocationOnFocus: hasScrolledLocationOnFocus.current,
      hasScrolledBirthdateOnFocus: hasScrolledBirthdateOnFocus.current
    });
  }, [
    locationInteracted, 
    birthdateInteracted, 
    locationComplete, 
    birthdateComplete, 
    hasRealUserInteraction, 
    isMobile,
    locationFocused,
    birthdateFocused
  ]);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Reset scroll status when mobile state changes
  useEffect(() => {
    hasScrolledLocation.current = false;
    hasScrolledBirthdate.current = false;
    hasScrolledLocationOnFocus.current = false;
    hasScrolledBirthdateOnFocus.current = false;
  }, [isMobile]);

  // Watch individual fields
  const currentCountry = watch('currentCountry');
  const currentState = watch('currentState');
  const currentLocality = watch('currentLocality');
  const currentAdminUnit = watch('currentAdminUnit');
  const currentNeighborhood = watch('currentNeighborhood');
  
  const birthCountry = watch('birthCountry');
  const birthState = watch('birthState');
  const birthLocality = watch('birthLocality');
  const birthYear = watch('birthYear');
  const birthMonth = watch('birthMonth');

  console.log('[ScrollDebug] Watch values:', {
    location: {
      currentCountry,
      currentState,
      currentLocality,
      currentAdminUnit,
      currentNeighborhood
    },
    birthdate: {
      birthCountry,
      birthState,
      birthLocality,
      birthYear,
      birthMonth
    }
  });

  // Check if any field value has changed from initial
  useEffect(() => {
    const initialLocationValues = initialValues.current.location;
    const initialBirthdateValues = initialValues.current.birthdate;
    
    // Helper function to safely compare values that might be undefined
    const valueChanged = (current: string | number | undefined | null, initial: string | number | undefined | null) => {
      // If both are undefined or null, no change
      if ((current === undefined || current === null) && (initial === undefined || initial === null)) {
        return false;
      }
      // If one is defined and the other isn't, there was a change
      if ((current === undefined || current === null) !== (initial === undefined || initial === null)) {
        return true;
      }
      // Otherwise compare the values
      return current !== initial;
    };
    
    // Log current and initial values to diagnose
    console.log('[ScrollDebug] Comparing values:', {
      current: {
        location: {
          currentCountry,
          currentState,
          currentLocality,
          currentAdminUnit,
          currentNeighborhood
        },
        birthdate: {
          birthCountry,
          birthState,
          birthLocality,
          birthYear,
          birthMonth
        }
      },
      initial: {
        location: initialLocationValues,
        birthdate: initialBirthdateValues
      }
    });
    
    const locationChanged = 
      valueChanged(currentCountry, initialLocationValues.currentCountry) ||
      valueChanged(currentState, initialLocationValues.currentState) ||
      valueChanged(currentLocality, initialLocationValues.currentLocality) ||
      valueChanged(currentAdminUnit, initialLocationValues.currentAdminUnit) ||
      valueChanged(currentNeighborhood, initialLocationValues.currentNeighborhood);
    
    const birthdateChanged =
      valueChanged(birthCountry, initialBirthdateValues.birthCountry) ||
      valueChanged(birthState, initialBirthdateValues.birthState) ||
      valueChanged(birthLocality, initialBirthdateValues.birthLocality) ||
      valueChanged(birthYear, initialBirthdateValues.birthYear) ||
      valueChanged(birthMonth, initialBirthdateValues.birthMonth);
    
    console.log('[ScrollDebug] Change detection:', { locationChanged, birthdateChanged });
    
    if (locationChanged || birthdateChanged) {
      console.log('[ScrollDebug] Real user interaction detected', { locationChanged, birthdateChanged });
      setHasRealUserInteraction(true);
    }
  }, [
    currentCountry, currentState, currentLocality, currentAdminUnit, currentNeighborhood,
    birthCountry, birthState, birthLocality, birthYear, birthMonth
  ]);
  
  // Check completion status whenever fields change
  useEffect(() => {
    const newLocationComplete = !!(
      currentCountry && 
      currentState && 
      currentLocality && 
      currentAdminUnit && 
      currentNeighborhood
    );
    console.log('[ScrollDebug] Location Fields:', {
      currentCountry,
      currentState,
      currentLocality,
      currentAdminUnit,
      currentNeighborhood,
      newLocationComplete
    });
    
    setLocationComplete(newLocationComplete);
    
    if (currentCountry || currentState || currentLocality || currentAdminUnit || currentNeighborhood) {
      setLocationInteracted(true);
    }
  }, [currentCountry, currentState, currentLocality, currentAdminUnit, currentNeighborhood]);

  useEffect(() => {
    const newBirthdateComplete = !!(
      birthCountry && 
      birthState && 
      birthLocality && 
      birthYear && 
      birthMonth
    );
    console.log('[ScrollDebug] Birthdate Fields:', {
      birthCountry,
      birthState,
      birthLocality,
      birthYear,
      birthMonth,
      newBirthdateComplete
    });
    
    setBirthdateComplete(newBirthdateComplete);
    
    if (birthCountry || birthState || birthLocality || birthYear || birthMonth) {
      setbirthdateInteracted(true);
    }
  }, [birthCountry, birthState, birthLocality, birthYear, birthMonth]);

  // Function to scroll an element smoothly out of view
  const scrollOutOfView = (element: HTMLElement | null) => {
    if (!element) {
      console.log('[ScrollDebug] No element to scroll');
      return;
    }
    
    console.log('[ScrollDebug] Element to scroll:', element.className);
    
    // Add a delay to make sure the DOM is fully updated
    setTimeout(() => {
      requestAnimationFrame(() => {
        // Check if using Radix UI ScrollArea
        const scrollArea = element.closest('[data-radix-scroll-area-viewport]') as HTMLElement;
        
        if (!scrollArea) {
          let scrollParent = null;
          let parent = element.parentElement;
          
          // Fallback to find scroll parent
          while (parent) {
            if (parent.hasAttribute('data-radix-scroll-area-viewport')) {
              scrollParent = parent;
              break;
            }
            parent = parent.parentElement;
          }
          
          if (!scrollParent) {
            console.log('[ScrollDebug] No scroll parent found');
            
            // Fallback to scrolling the closest scrollable parent
            let scrollableParent = element;
            while (scrollableParent && scrollableParent !== document.body) {
              const style = window.getComputedStyle(scrollableParent);
              const overflow = style.getPropertyValue('overflow');
              const overflowY = style.getPropertyValue('overflow-y');
              
              if (overflow === 'auto' || overflow === 'scroll' || 
                  overflowY === 'auto' || overflowY === 'scroll') {
                break;
              }
              
              scrollableParent = scrollableParent.parentElement as HTMLElement;
            }
            
            if (scrollableParent && scrollableParent !== document.body) {
              console.log('[ScrollDebug] Found scrollable parent:', scrollableParent.className);
              
              const elementRect = element.getBoundingClientRect();
              const parentRect = scrollableParent.getBoundingClientRect();
              // Removed offset to put element exactly at the top
              const scrollTop = elementRect.top - parentRect.top + scrollableParent.scrollTop;
              
              console.log('[ScrollDebug] Scrolling to:', scrollTop);
              
              scrollableParent.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
              });
            } else {
              // Last resort - scroll window
              console.log('[ScrollDebug] Using window.scrollTo as last resort');
              const elementRect = element.getBoundingClientRect();
              // Removed offset to put element exactly at the top
              const scrollTop = elementRect.top + window.pageYOffset;
              
              window.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
              });
            }
            
            return;
          }
          
          const targetElement = scrollParent as HTMLElement;
          console.log('[ScrollDebug] Found scroll parent:', targetElement.className);
          
          const elementRect = element.getBoundingClientRect();
          const scrollAreaRect = targetElement.getBoundingClientRect();
          // Removed offset to put element exactly at the top
          const scrollTop = elementRect.top - scrollAreaRect.top + targetElement.scrollTop;
          
          console.log('[ScrollDebug] Scrolling to:', scrollTop);
          
          targetElement.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        } else {
          console.log('[ScrollDebug] Found direct scroll area:', scrollArea.className);
          
          const elementRect = element.getBoundingClientRect();
          const scrollAreaRect = scrollArea.getBoundingClientRect();
          // Removed offset to put element exactly at the top
          const scrollTop = elementRect.top - scrollAreaRect.top + scrollArea.scrollTop;
          
          console.log('[ScrollDebug] Scrolling to:', scrollTop);
          
          scrollArea.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      });
    }, 300); // Delay of 300ms
  };

  // Override the isPrefilledData check for testing
  const forceScroll = false; // Change to false - we'll use hasRealUserInteraction instead
  
  // Setup focus detection on mount
  useEffect(() => {
    const detectFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if the focus event is from location section
      const isLocationFocus = target.closest('[data-location-field="true"]') || 
                              locationRef.current?.contains(target) ||
                              // Check if any hierarchical select component related to location is focused
                              (target.closest('.css-rek2z9') && 
                               !target.closest('[data-birthdate-field="true"]'));
      
      // Check if the focus event is from birthdate section
      const isBirthdateFocus = target.closest('[data-birthdate-field="true"]') || 
                               birthdateRef.current?.contains(target);
      
      console.log('[ScrollDebug] Focus detected:', { 
        target: target.tagName, 
        isLocationFocus, 
        isBirthdateFocus
      });
      
      if (isLocationFocus) {
        setLocationFocused(true);
        setBirthdateFocused(false);
      } else if (isBirthdateFocus) {
        setBirthdateFocused(true);
        setLocationFocused(false);
      }
    };
    
    // Add the focus event listener to the document
    document.addEventListener('focusin', detectFocus);
    
    // Also detect clicks to handle custom dropdowns that may not trigger focus events
    const detectClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if the click is on location section
      const isLocationClick = target.closest('[data-location-field="true"]') || 
                              locationRef.current?.contains(target) ||
                              // Check if any hierarchical select component related to location is clicked
                              (target.closest('.css-rek2z9') && 
                               !target.closest('[data-birthdate-field="true"]'));
      
      // Check if the click is on birthdate section
      const isBirthdateClick = target.closest('[data-birthdate-field="true"]') || 
                              birthdateRef.current?.contains(target);
      
      console.log('[ScrollDebug] Click detected:', { 
        target: target.tagName, 
        isLocationClick, 
        isBirthdateClick
      });
      
      if (isLocationClick) {
        setLocationFocused(true);
        setBirthdateFocused(false);
      } else if (isBirthdateClick) {
        setBirthdateFocused(true);
        setLocationFocused(false);
      }
    };
    
    document.addEventListener('click', detectClick);
    
    return () => {
      document.removeEventListener('focusin', detectFocus);
      document.removeEventListener('click', detectClick);
    };
  }, []);
  
  // Handle focus-based scrolling
  useEffect(() => {
    if (locationFocused && locationRef.current && !hasScrolledLocationOnFocus.current) {
      console.log('[ScrollDebug] Scrolling to location on focus');
      hasScrolledLocationOnFocus.current = true;
      scrollOutOfView(locationRef.current);
      
      // Reset the other section's focus scroll flag so it will scroll again when focused
      hasScrolledBirthdateOnFocus.current = false;
    }
  }, [locationFocused]);
  
  useEffect(() => {
    if (birthdateFocused && birthdateRef.current && !hasScrolledBirthdateOnFocus.current) {
      console.log('[ScrollDebug] Scrolling to birthdate on focus');
      hasScrolledBirthdateOnFocus.current = true;
      scrollOutOfView(birthdateRef.current);
      
      // Reset the other section's focus scroll flag so it will scroll again when focused
      hasScrolledLocationOnFocus.current = false;
    }
  }, [birthdateFocused]);

  // Handle scrolling based on completion and device
  useEffect(() => {
    // Simplify the logic - scroll if user has made real changes or it's a new form
    const shouldScroll = forceScroll || hasRealUserInteraction || !isPrefilledData;
    
    console.log('[ScrollDebug] Scroll check:', {
      forceScroll,
      isPrefilledData,
      hasRealUserInteraction,
      shouldScroll,
      isMobile,
      locationComplete,
      birthdateComplete,
      locationInteracted,
      birthdateInteracted,
      locationRef: !!locationRef.current,
      birthdateRef: !!birthdateRef.current,
      hasScrolledLocation: hasScrolledLocation.current,
      hasScrolledBirthdate: hasScrolledBirthdate.current
    });

    if (!shouldScroll) {
      console.log('[ScrollDebug] Skipping scroll');
      return;
    }
    
    if (isMobile) {
      // On mobile, location and birthdate are in separate rows
      if (locationComplete && locationInteracted && locationRef.current && !hasScrolledLocation.current) {
        console.log('[ScrollDebug] Attempting mobile location scroll');
        hasScrolledLocation.current = true;
        scrollOutOfView(locationRef.current);
      }
      
      // Scroll when birthdate is complete, but only after location
      if (birthdateComplete && birthdateInteracted && birthdateRef.current && 
          locationComplete && !hasScrolledBirthdate.current) {
        console.log('[ScrollDebug] Attempting mobile birthdate scroll');
        hasScrolledBirthdate.current = true;
        scrollOutOfView(birthdateRef.current);
      }
    } else {
      // On desktop, both are in the same row
      if (locationComplete && birthdateComplete && 
          locationInteracted && birthdateInteracted && 
          !hasScrolledLocation.current) {
        console.log('[ScrollDebug] Attempting desktop scroll');
        hasScrolledLocation.current = true;
        
        // Find the degree selector section directly
        const degreeSelector = document.querySelector('.pt-6'); // The degree selector has .pt-6 class
        if (degreeSelector) {
          console.log('[ScrollDebug] Found degree selector, scrolling to it');
          
          // Directly scroll the degree selector to the top of the viewport
          setTimeout(() => {
            const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
            
            if (scrollArea) {
              const degreeRect = degreeSelector.getBoundingClientRect();
              const scrollAreaRect = scrollArea.getBoundingClientRect();
              // Exact position to put degree selector at the top
              const scrollTop = degreeRect.top - scrollAreaRect.top + scrollArea.scrollTop;
              
              console.log('[ScrollDebug] Direct scroll to degree selector:', scrollTop);
              
              scrollArea.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
              });
            } else {
              // Fallback to regular scrollOutOfView
              scrollOutOfView(degreeSelector as HTMLElement);
            }
          }, 300);
        } else if (locationRef.current) {
          // Fallback to the location ref if we can't find the degree selector
          scrollOutOfView(locationRef.current);
        } else {
          console.log('[ScrollDebug] Could not find elements to scroll to');
        }
      }

    }
  }, [locationComplete, birthdateComplete, locationInteracted, birthdateInteracted, isMobile, isPrefilledData, hasRealUserInteraction]);

  // Reset scroll flags when user interaction is detected
  useEffect(() => {
    if (hasRealUserInteraction) {
      console.log('[ScrollDebug] Resetting scroll flags due to user interaction');
      hasScrolledLocation.current = false;
      hasScrolledBirthdate.current = false;
    }
  }, [hasRealUserInteraction]);

  return {
    locationRef,
    birthdateRef,
    locationComplete,
    birthdateComplete,
    isMobile
  };
}; 