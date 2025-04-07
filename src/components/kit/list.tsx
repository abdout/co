'use client';

import React, { useState, useEffect, useCallback, useId, useRef, forwardRef, useImperativeHandle } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X as CloseIcon, Edit as EditIcon } from 'lucide-react';
import { getKits } from './actions';
import { Kit as KitType } from './types';
import Kit from './kit';
import KitForm from './form';
import DeleteKit from './delete';
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
export type KitListRefType = {
  refreshKits: () => Promise<void>;
};

// Convert KitList to use forwardRef
const KitList = forwardRef<KitListRefType, {}>((_props, ref) => {
  const [kits, setKits] = useState<KitType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState<KitType | null>(null);
  const [kitToEdit, setKitToEdit] = useState<KitType | null>(null);
  const id = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Fetch kits from the database
  const fetchKits = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getKits();
      
      if (Array.isArray(data)) {
        // Convert all null values to undefined to match our Kit interface
        const formattedData = data.map(kit => ({
          id: kit.id,
          name: kit.name || undefined,
          picture: kit.picture || undefined,
          images: Array.isArray(kit.images) ? kit.images : [],
          accessories: Array.isArray(kit.accessories) ? kit.accessories : [],
          calibration: kit.calibration || undefined,
          calibrationIssue: kit.calibrationIssue || undefined,
          calibrationDue: kit.calibrationDue ? new Date(kit.calibrationDue) : undefined,
          software: kit.software || undefined,
          datasheet: kit.datasheet || undefined,
          manual: kit.manual || undefined,
          status: kit.status || undefined,
          under: kit.under || undefined,
          location: kit.location || undefined,
          price: kit.price || undefined,
          createdAt: kit.createdAt ? new Date(kit.createdAt) : undefined,
          updatedAt: kit.updatedAt ? new Date(kit.updatedAt) : undefined,
        })) as KitType[];
        
        setKits(formattedData);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch kits');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Expose the refreshKits method through the ref
  useImperativeHandle(ref, () => ({
    refreshKits: fetchKits
  }));

  // Load kits when component mounts
  useEffect(() => {
    fetchKits();
  }, [fetchKits]);
  
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

  // Handle kit selection
  const handleSelect = useCallback((id: string) => {
    const selectedKit = kits.find((kit) => kit.id === id);
    if (selectedKit) {
      setActive(selectedKit);
    }
  }, [kits]);
  
  // Handle edit success
  const handleEditSuccess = useCallback(async () => {
    setKitToEdit(null);
    await fetchKits();
  }, [fetchKits]);

  // Use the outside click hook
  useOutsideClick(modalRef as React.RefObject<HTMLDivElement>, () => setActive(null));

  if (isLoading) {
    return <div className="flex justify-center items-center h-40">Loading kits...</div>;
  }

  if (kits.length === 0) {
    return <div className="flex justify-center items-center h-40">No kits found</div>;
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
                      {active.picture ? (
                        <img
                          src={active.picture}
                          alt={active.name || 'Kit'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                      {active.name || 'Unnamed Kit'}
                    </motion.h3>
                    <motion.p
                      layoutId={`status-${active.id}-${id}`}
                      className="text-muted-foreground text-base mt-1"
                    >
                      {active.status === 'Available' ? 'Available' : active.status || 'Unknown'}
                    </motion.p>
                    {active.price && (
                      <motion.p
                        layoutId={`price-${active.id}-${id}`}
                        className="text-muted-foreground text-base mt-1"
                      >
                        {active.price}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-2">
                <div className="grid grid-cols-5 gap-4">
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256"><path fill="currentColor" d="M240 108h-14.34l-36.49-36.49a11.93 11.93 0 0 0-8.48-3.51H136V36h28a4 4 0 0 0 0-8h-64a4 4 0 0 0 0 8h28v32H64a12 12 0 0 0-12 12v56H20v-28a4 4 0 0 0-8 0v64a4 4 0 0 0 8 0v-28h32v24.69a11.93 11.93 0 0 0 3.51 8.48l39.32 39.32a11.93 11.93 0 0 0 8.48 3.51h77.38a11.93 11.93 0 0 0 8.48-3.51L225.66 180H240a12 12 0 0 0 12-12v-48a12 12 0 0 0-12-12m4 60a4 4 0 0 1-4 4h-16a4 4 0 0 0-2.83 1.17l-37.66 37.66a4 4 0 0 1-2.82 1.17h-77.38a4 4 0 0 1-2.82-1.17l-39.32-39.32a4 4 0 0 1-1.17-2.82V80a4 4 0 0 1 4-4h116.69a4 4 0 0 1 2.82 1.17l37.66 37.66A4 4 0 0 0 224 116h16a4 4 0 0 1 4 4Z"/></svg>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M22.2 4.86L6.69 11.25V27C6.69 35.44 24 43.5 24 43.5S41.31 35.44 41.31 27V11.25L25.8 4.86a4.68 4.68 0 0 0-3.6 0M24 43.5v-39M6.69 24h34.62" stroke-width="1"/></svg>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M7 7h10M7 12h10M7 17h6"/></svg>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M8.4 6.5v35a2 2 0 0 0 2 2h2.33v-39H10.4a2 2 0 0 0-2 2m4.33-2v39H37.6a2 2 0 0 0 2-2v-35a2 2 0 0 0-2-2Z" stroke-width="1"/><ellipse cx="25.531" cy="33.668" fill="currentColor" rx=".823" ry=".75"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M18.301 20.049a6.43 6.43 0 0 1 1.959-4.763a7.27 7.27 0 0 1 5.224-1.786c3.918 0 7.183 2.977 7.183 6.549a6.43 6.43 0 0 1-1.959 4.762c-1.632 1.19-5.224 2.977-5.224 5.656" stroke-width="1"/></svg>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M39.5 15.5h-9a2 2 0 0 1-2-2v-9h-18a2 2 0 0 0-2 2v35a2 2 0 0 0 2 2h27a2 2 0 0 0 2-2zm-11-11l11 11" stroke-width="1"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M29.939 24.535h4.492m-4.492 4.482h2.931m-2.931-4.482V33.5m-16.369-.017v-8.966h3.017a3.009 3.009 0 0 1 .002 6.018h-3.02m8.185 2.965v-9h1.526a4.5 4.5 0 0 1 4.5 4.5h0a4.5 4.5 0 0 1-4.5 4.5z" stroke-width="1"/></svg>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256"><path fill="currentColor" d="M144 20h-32a60.07 60.07 0 0 0-60 60v96a60.07 60.07 0 0 0 60 60h32a60.07 60.07 0 0 0 60-60V80a60.07 60.07 0 0 0-60-60m52 60v28h-64V28h12a52.06 52.06 0 0 1 52 52m-84-52h12v80H60V80a52.06 52.06 0 0 1 52-52m32 200h-32a52.06 52.06 0 0 1-52-52v-60h136v60a52.06 52.06 0 0 1-52 52"/></svg>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256"><path fill="currentColor" d="M208 60h-29.87l-14.81-22.22A4 4 0 0 0 160 36H96a4 4 0 0 0-3.32 1.78L77.85 60H48a20 20 0 0 0-20 20v112a20 20 0 0 0 20 20h160a20 20 0 0 0 20-20V80a20 20 0 0 0-20-20m12 132a12 12 0 0 1-12 12H48a12 12 0 0 1-12-12V80a12 12 0 0 1 12-12h32a4 4 0 0 0 3.33-1.78L98.13 44h59.72l14.82 22.22A4 4 0 0 0 176 68h32a12 12 0 0 1 12 12ZM128 92a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 72a32 32 0 1 1 32-32a32 32 0 0 1-32 32"/></svg>
                  </div>
                </div>
              </div>

              <div className="px-6 pt-1 pb-4">
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-muted-foreground text-sm flex flex-col items-start gap-4"
                >
                  {/* Kit details */}
                  {active.calibration && (
                    <div className="flex flex-col gap-1">
                      <h4 className="font-medium text-foreground">Calibration</h4>
                      <p>{active.calibration}</p>
                      {active.calibrationIssue && <p>Issue: {active.calibrationIssue}</p>}
                      {active.calibrationDue && <p>Due: {new Date(active.calibrationDue).toLocaleDateString()}</p>}
                    </div>
                  )}
                  
                  {/* Software */}
                  {active.software && (
                    <div className="flex flex-col gap-1">
                      <h4 className="font-medium text-foreground">Software</h4>
                      <p>{active.software}</p>
                    </div>
                  )}
                  
                  {/* Accessories */}
                  {active.accessories && active.accessories.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <h4 className="font-medium text-foreground">Accessories</h4>
                      <ul className="list-disc ml-5">
                        {active.accessories.map((accessory, idx) => (
                          <li key={idx}>{accessory}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Location */}
                  {active.location && (
                    <div className="flex flex-col gap-1">
                      <h4 className="font-medium text-foreground">Location</h4>
                      <p>{active.location}</p>
                    </div>
                  )}
                  
                  {/* Documentation links */}
                  {(active.datasheet || active.manual) && (
                    <div className="flex flex-col gap-1">
                      <h4 className="font-medium text-foreground">Documentation</h4>
                      <div className="flex flex-col gap-2">
                        {active.datasheet && (
                          <a href={active.datasheet} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">
                            Datasheet
                          </a>
                        )}
                        {active.manual && (
                          <a href={active.manual} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">
                            Manual
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
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
                      setKitToEdit(active);
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
                  <DeleteKit 
                    id={active.id} 
                    name={active.name || 'Unnamed Kit'} 
                    onSuccess={async () => {
                      await fetchKits();
                    }}
                    onDelete={() => setActive(null)}
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
                      href={`/resource/kit/${active.id}`}
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
        {kits.map((kit) => (
          <div key={kit.id} className="aspect-square flex">
            <Kit
              id={id}
              name={kit.name}
              picture={kit.picture}
              status={kit.status}
              onSelect={handleSelect}
              kit={kit}
              onExpand={setActive}
            />
          </div>
        ))}
      </div>
      
      {kitToEdit && (
        <KitForm 
          kitToEdit={kitToEdit}
          onSuccess={handleEditSuccess}
          onClose={() => setKitToEdit(null)}
        />
      )}
    </>
  );
});

// Add display name for better debugging
KitList.displayName = 'KitList';

export default KitList;