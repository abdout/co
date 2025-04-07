'use client';

import React, { useState, useEffect, useCallback, useId, useRef, forwardRef, useImperativeHandle } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X as CloseIcon, Edit as EditIcon } from 'lucide-react';
import { getCars } from './actions';
import { Car as CarType } from './types';
import Car from './car';
import CarForm from './form';
import DeleteCar from './delete';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Helper hook for detecting clicks outside an element
const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

// Define the ref type
export type CarListRefType = {
  refreshCars: () => Promise<void>;
};

// Convert CarList to use forwardRef
const CarList = forwardRef<CarListRefType, {}>((_props, ref) => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState<CarType | null>(null);
  const [carToEdit, setCarToEdit] = useState<CarType | null>(null);
  const id = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Fetch cars from the database
  const fetchCars = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCars();
      
      if (Array.isArray(data)) {
        setCars(data);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch cars');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Expose the refreshCars method through the ref
  useImperativeHandle(ref, () => ({
    refreshCars: fetchCars
  }));

  // Load cars when component mounts
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);
  
  // Handle escape key and body scroll lock
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  // Handle car selection
  const handleSelect = useCallback((id: string) => {
    const selectedCar = cars.find((car) => car.id === id);
    if (selectedCar) {
      setActive(selectedCar);
    }
  }, [cars]);
  
  // Handle edit success
  const handleEditSuccess = useCallback(async () => {
    setCarToEdit(null);
    await fetchCars();
  }, [fetchCars]);

  // Use the outside click hook
  useOutsideClick(modalRef, () => setActive(null));

  if (isLoading) {
    return <div className="flex justify-center items-center h-40">Loading cars...</div>;
  }

  if (cars.length === 0) {
    return <div className="flex justify-center items-center h-40">No cars found</div>;
  }

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.05 },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon className="h-4 w-4" />
            </motion.button>
            
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={modalRef}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-card"
            >
              <div className="p-6">
                <div className="flex flex-row items-center">
                  <motion.div 
                    layoutId={`image-${active.id}-${id}`} 
                    className="mr-6"
                  >
                    <div className="h-24 w-24 overflow-hidden relative">
                      {active.images && active.images.length > 0 ? (
                        <img
                          src={active.images[0]}
                          alt={active.name || 'Car'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </motion.div>
                  
                  <div>
                    <motion.h3
                      layoutId={`title-${active.id}-${id}`}
                      className="font-medium text-xl"
                    >
                      {active.name}
                    </motion.h3>
                    <motion.p
                      layoutId={`status-${active.id}-${id}`}
                      className="text-muted-foreground text-base mt-1"
                    >
                      {active.status || 'Unknown'}
                    </motion.p>
                    <motion.p
                      layoutId={`under-${active.id}-${id}`}
                      className="text-muted-foreground text-base mt-1"
                    >
                      Assigned to: {active.under || 'Unassigned'}
                    </motion.p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-2">
                <div className="grid grid-cols-5 gap-4">
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256"><path fill="currentColor" d="M240 108h-14.34l-36.49-36.49a11.93 11.93 0 0 0-8.48-3.51H136V36h28a4 4 0 0 0 0-8h-64a4 4 0 0 0 0 8h28v32H64a12 12 0 0 0-12 12v56H20v-28a4 4 0 0 0-8 0v64a4 4 0 0 0 8 0v-28h32v24.69a11.93 11.93 0 0 0 3.51 8.48l39.32 39.32a11.93 11.93 0 0 0 8.48 3.51h77.38a11.93 11.93 0 0 0 8.48-3.51L225.66 180H240a12 12 0 0 0 12-12v-48a12 12 0 0 0-12-12m4 60a4 4 0 0 1-4 4h-16a4 4 0 0 0-2.83 1.17l-37.66 37.66a4 4 0 0 1-2.82 1.17h-77.38a4 4 0 0 1-2.82-1.17l-39.32-39.32a4 4 0 0 1-1.17-2.82V80a4 4 0 0 1 4-4h116.69a4 4 0 0 1 2.82 1.17l37.66 37.66A4 4 0 0 0 224 116h16a4 4 0 0 1 4 4Z"/></svg>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 512 512"><path fill="currentColor" d="M407.72 224c-3.4 0-14.79.1-18 .3l-64.9 1.7a1.83 1.83 0 0 1-1.69-1.3L303.24 165a1.65 1.65 0 0 0-1.5-1H213.5a1.73 1.73 0 0 0-1.69 1.3l-20.1 59.7a1.83 1.83 0 0 1-1.69 1.3l-64.9-1.7c-3.3-.2-14.69-.3-18.09-.3h-32a4 4 0 0 0-4 4v48a4 4 0 0 0 4 4h32c3.3 0 14.19.1 17.89.3l65.2 1.7a1.83 1.83 0 0 0 1.69-1.3l20.1-59.7a1.65 1.65 0 0 1 1.5-1h72.19a1.82 1.82 0 0 1 1.69 1.3l19.9 59.6a1.82 1.82 0 0 0 1.69 1.3l65.2-1.7c3.7-.1 14.59-.2 17.89-.2h32a4 4 0 0 0 4-4v-48a4 4 0 0 0-4-4Z"></path><path fill="currentColor" d="M472 144.77c-4 0-27.77.34-33 .34l-38.81-1.34a2.26 2.26 0 0 1-2.06-1.67L382.18 93.5a2.29 2.29 0 0 0-2.21-1.5h-101a2.24 2.24 0 0 0-2.06 1.56l-15.91 48.59a2.26 2.26 0 0 1-2.06 1.67L220.31 145c-5.06 0-29-.34-33-.34h-45.3a4 4 0 0 0-3.7 4v48a3.939 3.939 0 0 0 3.7 4H187c4 0 27.77-.34 33-.34l38.81 1.34a2.26 2.26 0 0 0 2.06-1.67l15.91-48.59a2.24 2.24 0 0 1 2.06-1.56h101a2.29 2.29 0 0 1 2.21 1.5l15.91 48.59a2.26 2.26 0 0 0 2.06 1.67l38.81-1.34c5.06 0 29 .34 33 .34h45.3a4 4 0 0 0 3.7-4v-48a3.939 3.939 0 0 0-3.7-4Z"></path><path fill="currentColor" d="M472 76.77c-4 0-27.77.33-33 .33l-38.81-1.33a2.26 2.26 0 0 1-2.06-1.67L382.18 25.5a2.29 2.29 0 0 0-2.21-1.5h-101a2.24 2.24 0 0 0-2.06 1.56L261 74.1a2.26 2.26 0 0 1-2.06 1.67L220.31 77c-5.06 0-29-.33-33-.33h-45.3a4 4 0 0 0-3.7 4v48a3.94 3.94 0 0 0 3.7 4H187c4 0 27.77-.33 33-.33l38.81 1.33a2.26 2.26 0 0 0 2.06-1.67l15.91-48.59a2.24 2.24 0 0 1 2.06-1.56h101a2.29 2.29 0 0 1 2.21 1.5l15.91 48.59a2.267 2.267 0 0 0 2.06 1.67l38.81-1.33c5.06 0 29 .33 33 .33h45.3a4 4 0 0 0 3.7-4v-48a3.94 3.94 0 0 0-3.7-4Z"></path><path fill="currentColor" d="M182 384a36 36 0 1 0 36 36a36 36 0 0 0-36-36zm124.14 39.97a7.404 7.404 0 0 0-3.96.16a11.501 11.501 0 0 1-8.65-1.1a10.863 10.863 0 0 1-5.43-7.43a8 8 0 0 0-7.72-6.6h-19.19a8 8 0 0 0-7.83 6.7a11.408 11.408 0 0 1-5.14 7.33a11.5 11.5 0 0 1-8.75 1.1a7.504 7.504 0 0 0-3.96-.16a7.997 7.997 0 0 0-6.11 5.29l-9.59 23.62a8 8 0 0 0 2.39 9.33a11.41 11.41 0 0 1 3.84 8.1a11.5 11.5 0 0 1-3.84 8.1a8 8 0 0 0-2.39 9.33l9.59 23.6a8 8 0 0 0 6.11 5.29a7.6 7.6 0 0 0 1.91.25a8.099 8.099 0 0 0 2.05-.29a11.501 11.501 0 0 1 8.75 1.1a11.408 11.408 0 0 1 5.14 7.33a8 8 0 0 0 7.83 6.7h19.19a8 8 0 0 0 7.72-6.6a10.863 10.863 0 0 1 5.43-7.43a11.501 11.501 0 0 1 8.65-1.1a7.65 7.65 0 0 0 2.05.29a8.099 8.099 0 0 0 1.91-.25a8 8 0 0 0 6.11-5.29l9.69-23.6a8 8 0 0 0-2.39-9.33a11.408 11.408 0 0 1-3.84-8.1a11.5 11.5 0 0 1 3.84-8.1a8 8 0 0 0 2.39-9.33l-9.69-23.62a8 8 0 0 0-6.11-5.29ZM330 384a36 36 0 1 0 36 36a36 36 0 0 0-36-36z"></path></svg>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M7 7h10M7 12h10M7 17h6"/></svg>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32"><path fill="currentColor" d="M30 8h-4.101c-.464-2.279-2.485-4-4.899-4s-4.436 1.721-4.899 4H2c-.553 0-1 .448-1 1s.447 1 1 1h14.101c.464 2.279 2.485 4 4.899 4s4.436-1.721 4.899-4H30c.553 0 1-.448 1-1s-.447-1-1-1zm-9 3c-1.654 0-3-1.346-3-3s1.346-3 3-3s3 1.346 3 3s-1.346 3-3 3zm9 5H16.101c-.464-2.279-2.485-4-4.899-4s-4.436 1.721-4.899 4H2c-.553 0-1 .448-1 1s.447 1 1 1h4.101c.464 2.279 2.485 4 4.899 4s4.436-1.721 4.899-4H30c.553 0 1-.448 1-1s-.447-1-1-1zm-23 3c-1.654 0-3-1.346-3-3s1.346-3 3-3s3 1.346 3 3s-1.346 3-3 3zm23 5h-4.101c-.464-2.279-2.485-4-4.899-4s-4.436 1.721-4.899 4H2c-.553 0-1 .448-1 1s.447 1 1 1h14.101c.464 2.279 2.485 4 4.899 4s4.436-1.721 4.899-4H30c.553 0 1-.448 1-1s-.447-1-1-1zm-9 3c-1.654 0-3-1.346-3-3s1.346-3 3-3s3 1.346 3 3s-1.346 3-3 3z"/></svg>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M39.5 15.5h-9a2 2 0 0 1-2-2v-9h-18a2 2 0 0 0-2 2v35a2 2 0 0 0 2 2h27a2 2 0 0 0 2-2zm-11-11l11 11" stroke-width="1"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M29.939 24.535h4.492m-4.492 4.482h2.931m-2.931-4.482V33.5m-16.369-.017v-8.966h3.017a3.009 3.009 0 0 1 .002 6.018h-3.02m8.185 2.965v-9h1.526a4.5 4.5 0 0 1 4.5 4.5h0a4.5 4.5 0 0 1-4.5 4.5z" stroke-width="1"/></svg>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"/><path stroke-linecap="round" d="M17 2v3m-5 0v3M7 2v3M2 8h11m9 0H16m0 7h2.5M16 9h2.5M16 6h2.5M6 12h5m-5 3h2.5M6 9h2.5M6 6h2.5m0 9H16"/></g></svg>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256"><path fill="currentColor" d="M208 60h-29.87l-14.81-22.22A4 4 0 0 0 160 36H96a4 4 0 0 0-3.32 1.78L77.85 60H48a20 20 0 0 0-20 20v112a20 20 0 0 0 20 20h160a20 20 0 0 0 20-20V80a20 20 0 0 0-20-20m12 132a12 12 0 0 1-12 12H48a12 12 0 0 1-12-12V80a12 12 0 0 1 12-12h32a4 4 0 0 0 3.33-1.78L98.13 44h59.72l14.82 22.22A4 4 0 0 0 176 68h32a12 12 0 0 1 12 12ZM128 92a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 72a32 32 0 1 1 32-32a32 32 0 0 1-32 32"/></svg>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto p-4 px-7 flex gap-3 justify-start">
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button 
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setCarToEdit(active);
                      setActive(null);
                    }}
                    className="rounded-full h-8 w-8 p-0"
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                </motion.div>

                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <DeleteCar 
                    id={active.id} 
                    name={active.name || 'Unnamed Car'} 
                    onSuccess={async () => {
                      await fetchCars();
                      setActive(null);
                    }}
                  />
                </motion.div>
                
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    asChild
                    variant="ghost"
                    className="rounded-full"
                  >
                    <Link
                      href={`/resource/car/${active.id}`}
                      onClick={() => setActive(null)}
                    >
                      See More
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cars.map((carItem) => (
          <div key={carItem.id} className="aspect-square flex">
            <Car
              id={id}
              name={carItem.name}
              images={carItem.images}
              status={carItem.status}
              onSelect={handleSelect}
              car={carItem}
              onExpand={setActive}
              />
            </div>
          ))}
        </div>
      
      {carToEdit && (
        <CarForm 
          carToEdit={carToEdit}
          onSuccess={handleEditSuccess}
          onClose={() => setCarToEdit(null)}
        />
      )}
    </>
  );
});

// Add display name for better debugging
CarList.displayName = 'CarList';

export default CarList;