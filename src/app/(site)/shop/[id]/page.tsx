"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface KitItem {
  name: string;
  price: string;
  imagePath: string;
  padding?: number; 
  description?: string;
  details?: string;
}

// Sample content for appendix items
const appendixContent = {
  datasheet: {
    title: "Datasheet",
    content: (pdfScale: number) => (
      <div className="w-full h-full bg-background/5 overflow-hidden">
        <div style={{ transform: `scale(${pdfScale})`, transformOrigin: 'center', width: '100%', height: '100%' }}>
          <iframe 
            src="/docs/fake.pdf#toolbar=0&navpanes=0&statusbar=0" 
            className="w-full h-full" 
            frameBorder="0"
          />
        </div>
      </div>
    )
  },
  manual: {
    title: "Manual",
    content: (pdfScale: number) => (
      <div className="w-full h-full bg-background/5 overflow-hidden">
        <div style={{ transform: `scale(${pdfScale})`, transformOrigin: 'center', width: '100%', height: '100%' }}>
          <iframe 
            src="/docs/fake.pdf#toolbar=0&navpanes=0&statusbar=0" 
            className="w-full h-full" 
            frameBorder="0"
          />
        </div>
      </div>
    )
  },
  calibration: {
    title: "Calibration",
    content: (pdfScale: number) => (
      <div className="w-full h-full bg-background/5 overflow-hidden">
        <div style={{ transform: `scale(${pdfScale})`, transformOrigin: 'center', width: '100%', height: '100%' }}>
          <iframe 
            src="/docs/fake.pdf#toolbar=0&navpanes=0&statusbar=0" 
            className="w-full h-full" 
            frameBorder="0"
          />
        </div>
      </div>
    )
  },
  awesome: {
    title: "Awesome",
    content: (pdfScale: number) => (
      <div className="w-full h-full bg-background/5 overflow-hidden">
        <div style={{ transform: `scale(${pdfScale})`, transformOrigin: 'center', width: '100%', height: '100%' }}>
          <iframe 
            src="/docs/fake.pdf#toolbar=0&navpanes=0&statusbar=0" 
            className="w-full h-full" 
            frameBorder="0"
          />
        </div>
      </div>
    )
  }
};

const kits: KitItem[] = [
  { name: 'CT', price: 'From 180 SAR', imagePath: '/kit/ct.png', padding: 20, description: 'Current Transformer Testing Kit', details: 'Professional CT testing equipment for electrical engineers. Tests ratio, polarity, and burden. Ideal for substation maintenance and commissioning.' },
  { name: 'B10E', price: 'From 160 SAR', imagePath: '/kit/b10e.png', padding: 20, description: 'Battery Testing System', details: 'Advanced battery testing system for voltage, impedance and capacity measurements. Perfect for UPS and backup power system maintenance.' },
  { name: 'Sverker750', price: 'From 300 SAR', imagePath: '/kit/sverker750.png', padding: 20, description: 'Relay Testing System', details: 'Comprehensive relay testing kit for protection system verification. Tests timing, pick-up and drop-out values with high precision.' },
  { name: 'MCF750', price: 'From 310 SAR', imagePath: '/kit/mcf750.png', padding: 22, description: 'Multi-Function Calibrator', details: 'High-precision calibration equipment for electrical parameters. Calibrates meters, transducers and protection devices with laboratory accuracy.' },
  { name: 'TTR330', price: 'From 250 SAR', imagePath: '/kit/ttr330.png', padding: 15, description: 'Three-Phase TTR Meter', details: 'Three-phase transformer turn ratio testing device. Measures ratio, phase displacement and excitation current for power transformers.' },
  { name: 'TTR300', price: 'From 220 SAR', imagePath: '/kit/ttr300.png', padding: 30, description: 'Transformer Turn Ratio Tester', details: 'Single-phase TTR meter with advanced features. Tests ratio accuracy and identifies winding problems in distribution transformers.' },
  { name: 'PDTD60', price: 'From 180 SAR', imagePath: '/kit/pdtd60.png', padding: 40, description: 'Partial Discharge Analyzer', details: 'Detection and measurement of partial discharges in high voltage equipment. Essential for preventive maintenance of cables and transformers.' },
  { name: 'OTS80PD', price: 'From 190 SAR', imagePath: '/kit/ots80pd.png', padding: 25, description: 'Oil Test System', details: 'Measures dielectric breakdown voltage of insulating oils. Ensures transformer oil meets safety and performance standards.' },
  { name: 'Oden', price: 'From 150 SAR', imagePath: '/kit/oden.png', padding: 50, description: 'Primary Current Injection Tester', details: 'High current testing system for circuit breakers and protection relays. Verifies operation at actual fault current levels.' },
  { name: 'MTO330', price: 'From 280 SAR', imagePath: '/kit/mto330.png', padding: 10, description: 'Transformer Ohmmeter', details: 'Precision winding resistance measurement for power transformers. Detects poor connections, broken strands and tap changer problems.' },
  { name: 'MOM600A', price: 'From 200 SAR', imagePath: '/kit/mom600a.png', padding: 15, description: 'Micro-Ohmmeter', details: 'Measures low resistances with high precision. Used for testing circuit breaker contacts, bus bar joints and other connections.' },
  { name: 'MIT525', price: 'From 270 SAR', imagePath: '/kit/mit525.png', padding: 20, description: 'Insulation Tester 5kV', details: 'Measures insulation resistance up to 5kV. Features multiple test modes including PI, DAR and dielectric discharge.' },
  { name: 'MIT300', price: 'From 220 SAR', imagePath: '/kit/mit300.png', padding: 10, description: 'Insulation and Continuity Tester', details: 'Handheld device for insulation resistance and continuity tests. Perfect for routine maintenance of electrical equipment.' },
  { name: 'MIT520', price: 'From 260 SAR', imagePath: '/kit/mit520.png', padding: 30, description: 'Diagnostic Insulation Tester', details: 'Advanced 5kV insulation analyzer with memory storage. Provides diagnostic testing for high voltage equipment health assessment.' },
  { name: 'LCR55A', price: 'From 170 SAR', imagePath: '/kit/lcr55a.png', padding: 20, description: 'LCR Meter', details: 'Measures inductance, capacitance and resistance. Essential for component testing and electrical equipment maintenance.' },
  { name: 'HVA60', price: 'From 240 SAR', imagePath: '/kit/hva60.png', padding: 40, description: 'High Voltage Test System', details: 'AC/DC high voltage testing equipment for cables and electrical installations. Tests withstand voltage up to 60kV.' },
  { name: 'HIPOT', price: 'From 150 SAR', imagePath: '/kit/hipot.png', padding: 60, description: 'High Potential Tester', details: 'Electrical safety tester for dielectric withstand testing. Verifies insulation integrity and electrical safety compliance.' },
  { name: 'FREJA300', price: 'From 280 SAR', imagePath: '/kit/freja300.png', padding: 10, description: 'Relay Test System', details: 'Comprehensive testing solution for protection relays. Tests complex protection schemes with high precision timing.' },
  { name: 'FRAX101', price: 'From 240 SAR', imagePath: '/kit/frax101.png', padding: 20, description: 'Frequency Response Analyzer', details: 'Transformer winding deformation analysis through frequency response. Detects mechanical problems in transformer active parts.' },
  { name: 'EGIL', price: 'From 210 SAR', imagePath: '/kit/egil.png', padding: 15, description: 'Circuit Breaker Analyzer', details: 'Timing and motion analysis for medium voltage circuit breakers. Verifies operation speed and synchronization between contacts.' },
  { name: 'DLRO600', price: 'From 220 SAR', imagePath: '/kit/dlro600.png', padding: 25, description: 'Digital Low Resistance Ohmmeter', details: 'High current micro-ohmmeter for precise resistance measurements. Features temperature compensation and data storage capabilities.' },
  { name: 'DELTA4000', price: 'From 290 SAR', imagePath: '/kit/delta4000.png', padding: 45, description: 'Power Factor Test System', details: 'Tests power factor and capacitance of high voltage equipment. Essential for assessing insulation condition in transformers and bushings.' },
];

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<KitItem | null>(null);
  const [activeAppendix, setActiveAppendix] = useState<string | null>(null);
  const [pdfScale, setPdfScale] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Function to handle zoom controls
  const zoomIn = () => {
    setPdfScale(prev => Math.min(prev + 0.1, 2)); // Maximum zoom: 2x
  };

  const zoomOut = () => {
    setPdfScale(prev => Math.max(prev - 0.1, 0.5)); // Minimum zoom: 0.5x
  };

  // Reset zoom level when closing or changing appendix
  useEffect(() => {
    if (activeAppendix) {
      setPdfScale(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeAppendix]);

  useEffect(() => {
    setLoading(true);
    
    if (params.id) {
      const foundKit = kits.find(kit => kit.name === params.id);
      if (foundKit) {
        setProduct(foundKit);
      }
    }
    
    // Short timeout to ensure a smooth transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [params.id]);

  // Function to close the appendix dialog
  const closeAppendixDialog = () => {
    setActiveAppendix(null);
  };

  if (loading) {
    return (
      <div className="container px-8 py-28 bg-primary min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-background/20 border-t-background rounded-full animate-spin mb-3"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 bg-primary min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl text-background">Product not found</h1>
          <Link href="/shop" className="text-background underline mt-4 block">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-8 py-28 bg-primary min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col justify-start items-start pt-0">
          <div style={{ padding: `${product.padding || 15}px` }}>
            <img
              src={product.imagePath}
              alt={product.name}
              className="w-full max-w-[250px] h-auto object-contain -m-4"
            />
          </div>
          
          <p className="text-xl text-neutral-300 mx-3 mt-6 mb-3">
            {product.price}
          </p>
          
          <div className="flex items-center gap-4 mx-2">
            <a
              href={`mailto:info@example.com?subject=Order Inquiry for ${product.name}`}
              className="px-6 py-3 text-sm rounded-full font-bold bg-background text-primary text-center inline-block"
            >
              Place Order
            </a>
            <span className="text-sm text-background font-medium">In Stock</span>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-background">{product.name}</h1>
          <h2 className="text-2xl text-neutral-300 mt-2">{product.description}</h2>
          
          <div className="mt-8 border-t border-background/20 pt-6">
            <h3 className="text-xl text-background font-semibold mb-3">Details</h3>
            <p className="text-neutral-300">{product.details}</p>
          </div>
          
          <div className="mt-8 border-t border-background/20 pt-6">
            <h3 className="text-xl text-background font-semibold mb-3">Features</h3>
            <ul className="text-neutral-300 list-disc ml-5 space-y-2">
              <li>High precision measurements</li>
              <li>Comprehensive testing capabilities</li>
              <li>User-friendly interface</li>
              <li>Portable and rugged design</li>
              <li>Compatible with industry standards</li>
            </ul>
          </div>
          
          <div className="mt-8 border-t border-background/20 pt-6">
            <h3 className="text-xl text-background font-semibold mb-3">Information</h3>
            <p className="text-neutral-300 mb-4">
              Rental includes calibration certificate, carrying case, and basic accessories. 
              Contact us for availability and custom rental periods.
            </p>
          </div>
          
          <div className="mt-8 border-t border-background/20 pt-6">
            <h3 className="text-xl text-background font-semibold mb-3">Appendix</h3>
            <p className="text-neutral-300 mb-4">
              Additional technical specifications and documentation are available upon request. 
              Our equipment meets international standards and is regularly calibrated to ensure accuracy.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <button 
                onClick={() => setActiveAppendix('datasheet')}
                className="border border-background/30 p-4 rounded-lg flex flex-col items-start text-left cursor-pointer hover:bg-background/5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-background mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <p className="text-background text-sm font-medium">Datasheet</p>
              </button>
              
              <button 
                onClick={() => setActiveAppendix('manual')}
                className="border border-background/30 p-4 rounded-lg flex flex-col items-start text-left cursor-pointer hover:bg-background/5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-background mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                <p className="text-background text-sm font-medium">Manual</p>
              </button>
              
              <button 
                onClick={() => setActiveAppendix('calibration')}
                className="border border-background/30 p-4 rounded-lg flex flex-col items-start text-left cursor-pointer hover:bg-background/5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-background mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
                <p className="text-background text-sm font-medium">Calibration</p>
              </button>
              
              <button 
                onClick={() => setActiveAppendix('awesome')}
                className="border border-background/30 p-4 rounded-lg flex flex-col items-start text-left cursor-pointer hover:bg-background/5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-background mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <p className="text-background text-sm font-medium">Awesome</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Appendix Dialog */}
      <AnimatePresence>
        {activeAppendix && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 h-full w-full z-[9000]"
              onClick={closeAppendixDialog}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9001] p-0"
              style={{ top: 0, left: 0 }}
            >
              <div className="bg-primary w-full h-full flex flex-col box-border">
                {/* Custom PDF header */}
                <div className="flex justify-between items-center py-3 px-5 border-b border-background/20 bg-background/5">
                  <div className="flex items-center">
                    <h3 className="text-base font-medium text-background">
                      {activeAppendix && appendixContent[activeAppendix as keyof typeof appendixContent].title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={zoomOut}
                      className="text-background hover:bg-background/10 rounded-full p-2 transition-colors w-8 h-8 flex items-center justify-center"
                      aria-label="Zoom Out"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                      </svg>
                    </button>
                    <button
                      onClick={zoomIn}
                      className="text-background hover:bg-background/10 rounded-full p-2 transition-colors w-8 h-8 flex items-center justify-center"
                      aria-label="Zoom In"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                    <a
                      href="/docs/fake.pdf"
                      download="document.pdf"
                      className="text-background hover:bg-background/10 rounded-full p-2 transition-colors w-8 h-8 flex items-center justify-center"
                      aria-label="Download"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </a>
                    <a
                      href={`mailto:?subject=${product.name} Document&body=Check out this document for ${product.name}.`}
                      className="text-background hover:bg-background/10 rounded-full p-2 transition-colors w-8 h-8 flex items-center justify-center"
                      aria-label="Share via Email"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </a>
                    <button 
                      onClick={closeAppendixDialog}
                      className="text-background hover:bg-background/10 rounded-full p-2 transition-colors w-8 h-8 flex items-center justify-center"
                      aria-label="Close"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  {activeAppendix && appendixContent[activeAppendix as keyof typeof appendixContent].content(pdfScale)}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
