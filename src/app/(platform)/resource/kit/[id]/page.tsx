'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { getKit } from "@/components/kit/actions";
import { Kit } from "@/components/kit/types";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import DeleteKit from "@/components/kit/delete";

export default function KitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [kit, setKit] = useState<Kit | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [activeDocument, setActiveDocument] = useState<string | null>(null);
  const [pdfScale, setPdfScale] = useState<number>(1);

  useEffect(() => {
    async function loadKit() {
      setLoading(true);
      
      if (params.id) {
        try {
          const result = await getKit(params.id as string);
          
          if (result.success && result.data) {
            // Transform the DB kit data to match the Kit type
            const kitData = result.data;
            const formattedKit: Kit = {
              id: kitData.id,
              name: kitData.name || undefined,
              picture: kitData.picture || undefined,
              images: Array.isArray(kitData.images) ? kitData.images : [],
              accessories: Array.isArray(kitData.accessories) ? kitData.accessories : [],
              calibration: kitData.calibration || undefined,
              calibrationIssue: kitData.calibrationIssue || undefined,
              calibrationDue: kitData.calibrationDue ? new Date(kitData.calibrationDue) : undefined,
              software: kitData.software || undefined,
              datasheet: kitData.datasheet || undefined,
              manual: kitData.manual || undefined,
              status: kitData.status || undefined,
              under: kitData.under || undefined,
              location: kitData.location || undefined,
              price: kitData.price || undefined,
              createdAt: kitData.createdAt ? new Date(kitData.createdAt) : undefined,
              updatedAt: kitData.updatedAt ? new Date(kitData.updatedAt) : undefined,
            };
            
            setKit(formattedKit);
          } else {
            toast.error(result.message || "Kit not found");
          }
        } catch (error) {
          console.error("Failed to load kit:", error);
          toast.error("Failed to load kit details");
        }
      }
      
      // Short timeout to ensure a smooth transition
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
    
    loadKit();
  }, [params.id]);

  // Function to handle zoom controls for PDF viewer
  const zoomIn = () => {
    setPdfScale(prev => Math.min(prev + 0.1, 2)); // Maximum zoom: 2x
  };

  const zoomOut = () => {
    setPdfScale(prev => Math.max(prev - 0.1, 0.5)); // Minimum zoom: 0.5x
  };

  // Reset zoom level when closing or changing document
  useEffect(() => {
    if (activeDocument) {
      setPdfScale(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeDocument]);

  const handleEditClick = () => {
    router.push(`/resource/kit/edit/${params.id}`);
  };

  // Function to close the document dialog
  const closeDocumentDialog = () => {
    setActiveDocument(null);
  };

  if (loading) {
    return (
      <div className="container py-10 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
          <p>Loading kit details...</p>
        </div>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="container py-10 min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Kit not found</h1>
          <p className="mb-6">The kit you are looking for does not exist or has been removed.</p>
          <Link href="/resource/kit" className="text-primary hover:underline">
            Return to kit management
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-10 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column with image and key info */}
        <div className="md:col-span-1">
          <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden">
            <AspectRatio ratio={16/9} className="bg-white">
              {kit.picture ? (
                <img
                  src={kit.picture}
                  alt={kit.name || "Kit image"}
                  className="object-contain w-full h-full p-4"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </AspectRatio>
          </div>
          
          <div className="mb-6">
            <div className="space-y-4">
              {kit.status && (
                <div className="flex justify-start items-center">
                  <span className="text-lg font-medium text-gray-700">
                    {kit.status === "Available" ? "Available" : kit.status}
                  </span>
                </div>
              )}
              
              {(kit.location || kit.price || kit.under) && (
                <div className="p-4 border border-gray-200 rounded-lg mt-2">
                  {kit.location && (
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">Location</span>
                      <span>{kit.location}</span>
                    </div>
                  )}
                  
                  {kit.price && (
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">Price</span>
                      <span className="font-medium">{kit.price}</span>
                    </div>
                  )}
                  
                  {kit.under && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Checked By</span>
                      <span>{kit.under}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 mb-6">
            <Button 
              variant="default"
              size="sm"
              onClick={handleEditClick}
              className="rounded-full h-8 w-8 p-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </Button>
            
            <DeleteKit 
              id={kit.id} 
              name={kit.name || 'Unnamed Kit'} 
              onSuccess={async () => {
                router.push('/resource/kit');
              }}
              onDelete={() => {}}
            />
          </div>
        </div>
        
        {/* Right column with detailed info */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-1">{kit.name || "Unnamed Kit"}</h1>
          <p className="text-gray-500 mb-6">ID: {kit.id}</p>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-3">Details</h3>
            {kit.software ? (
              <p className="text-gray-700 mb-4">{kit.software}</p>
            ) : (
              <p className="text-gray-500 italic mb-4">No additional details available</p>
            )}
          </div>
          
          {kit.accessories && kit.accessories.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold mb-3">Accessories ({kit.accessories?.length || 0})</h3>
              <ul className="text-gray-700 list-disc ml-5 space-y-2">
                {kit.accessories.map((accessory, index) => (
                  <li key={index}>{accessory}</li>
                ))}
              </ul>
            </div>
          )}
          
          {kit.calibration && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold mb-3">Calibration</h3>
              <div className="space-y-3">
                <p className="text-gray-700">{kit.calibration}</p>
                
                {kit.calibrationIssue && (
                  <div className="bg-red-50 p-3 rounded-md border border-red-100">
                    <p className="text-red-700 font-medium mb-1">Issue:</p>
                    <p className="text-red-600">{kit.calibrationIssue}</p>
                  </div>
                )}
                
                {kit.calibrationDue && (
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Due Date:</span>
                    <span className="font-medium">{new Date(kit.calibrationDue).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-3">Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-700 mb-1">Created</h4>
                <p className="text-gray-600">
                  {kit.createdAt ? new Date(kit.createdAt).toLocaleString() : 'Unknown'}
                </p>
              </div>
              
              <div className=" p-4 rounded-md">
                <h4 className="font-medium text-gray-700 mb-1">Last Updated</h4>
                <p className="text-gray-600">
                  {kit.updatedAt ? new Date(kit.updatedAt).toLocaleString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-3">Appendix</h3>
            <p className="text-gray-700 mb-4">
              Additional technical specifications and documentation are available below.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {kit.datasheet && (
                <button 
                  onClick={() => setActiveDocument('datasheet')}
                  className="border border-gray-300 p-4 rounded-lg flex flex-col items-start text-left cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <p className="text-gray-800 text-sm font-medium">Datasheet</p>
                </button>
              )}
              
              {kit.manual && (
                <button 
                  onClick={() => setActiveDocument('manual')}
                  className="border border-gray-300 p-4 rounded-lg flex flex-col items-start text-left cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  <p className="text-gray-800 text-sm font-medium">Manual</p>
                </button>
              )}
              
              {kit.calibration && (
                <button 
                  onClick={() => setActiveDocument('calibration')}
                  className="border border-gray-300 p-4 rounded-lg flex flex-col items-start text-left cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                  <p className="text-gray-800 text-sm font-medium">Calibration</p>
                </button>
              )}
              
              {kit.images && Array.isArray(kit.images) && kit.images.length > 0 && (
                <button 
                  onClick={() => setActiveDocument('images')}
                  className="border border-gray-300 p-4 rounded-lg flex flex-col items-start text-left cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <p className="text-gray-800 text-sm font-medium">Images ({kit.images?.length || 0})</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Dialog */}
      <AnimatePresence>
        {activeDocument && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 h-full w-full z-[9000]"
              onClick={closeDocumentDialog}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9001] p-0"
              style={{ top: 0, left: 0 }}
            >
              <div className=" w-full h-full flex flex-col box-border">
                {/* Custom header */}
                <div className="flex justify-between items-center py-3 px-5 border-b">
                  <div className="flex items-center">
                    <h3 className="text-base font-medium">
                      {activeDocument === 'datasheet' && 'Datasheet'}
                      {activeDocument === 'manual' && 'Manual'}
                      {activeDocument === 'calibration' && 'Calibration'}
                      {activeDocument === 'images' && 'Images'}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {activeDocument !== 'images' && (
                      <>
                        <button
                          onClick={zoomOut}
                          className="hover:bg-gray-100 rounded-full p-2 transition-colors w-8 h-8 flex items-center justify-center"
                          aria-label="Zoom Out"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                          </svg>
                        </button>
                        <button
                          onClick={zoomIn}
                          className="hover:bg-gray-100 rounded-full p-2 transition-colors w-8 h-8 flex items-center justify-center"
                          aria-label="Zoom In"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </>
                    )}
                    
                    {activeDocument === 'datasheet' && kit.datasheet && (
                      <a
                        href={kit.datasheet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:bg-gray-100 rounded-full p-2 transition-colors w-8 h-8 flex items-center justify-center"
                        aria-label="Open"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                    
                    {activeDocument === 'manual' && kit.manual && (
                      <a
                        href={kit.manual}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:bg-gray-100 rounded-full p-2 transition-colors w-8 h-8 flex items-center justify-center"
                        aria-label="Open"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                    
                    <button 
                      onClick={closeDocumentDialog}
                      className="hover:bg-gray-100 rounded-full p-2 transition-colors w-8 h-8 flex items-center justify-center"
                      aria-label="Close"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto">
                  {activeDocument === 'datasheet' && kit.datasheet && (
                    <div className="w-full h-full bg-gray-100">
                      <div style={{ transform: `scale(${pdfScale})`, transformOrigin: 'center', width: '100%', height: '100%' }}>
                        <iframe 
                          src={`${kit.datasheet}#toolbar=0&navpanes=0&statusbar=0`}
                          className="w-full h-full"
                          frameBorder="0"
                        />
                      </div>
                    </div>
                  )}
                  
                  {activeDocument === 'manual' && kit.manual && (
                    <div className="w-full h-full bg-gray-100">
                      <div style={{ transform: `scale(${pdfScale})`, transformOrigin: 'center', width: '100%', height: '100%' }}>
                        <iframe 
                          src={`${kit.manual}#toolbar=0&navpanes=0&statusbar=0`}
                          className="w-full h-full"
                          frameBorder="0"
                        />
                      </div>
                    </div>
                  )}
                  
                  {activeDocument === 'calibration' && kit.calibration && (
                    <div className="p-6">
                      <div className=" rounded-lg border p-6 max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold mb-4">Calibration Information</h2>
                        
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2">Status</h3>
                            <p>{kit.calibration}</p>
                          </div>
                          
                          {kit.calibrationDue && (
                            <div>
                              <h3 className="font-medium mb-2">Due Date</h3>
                              <p>{new Date(kit.calibrationDue).toLocaleDateString()}</p>
                            </div>
                          )}
                          
                          {kit.calibrationIssue && (
                            <div>
                              <h3 className="font-medium text-red-600 mb-2">Issues</h3>
                              <p className="text-red-600">{kit.calibrationIssue}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeDocument === 'images' && kit.images && Array.isArray(kit.images) && kit.images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                      {kit.images.map((image, index) => (
                        <div key={index} className=" border rounded-md overflow-hidden">
                          <a 
                            href={image} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <AspectRatio ratio={4/3}>
                              <img
                                src={image}
                                alt={`Kit image ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                            </AspectRatio>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
