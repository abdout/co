"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface KitItem {
    name: string;
    price: string;
    imagePath: string;
    padding?: number; // Padding value in pixels
    description?: string;
    details?: string;
}

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

export default function Shop() {
    const [active, setActive] = useState<KitItem | null>(null);
    const id = useId();
    const ref = useRef<HTMLDivElement>(null);

    // Prefetch product pages when the shop component mounts
    useEffect(() => {
        kits.forEach(kit => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = `/shop/${kit.name}`;
            document.head.appendChild(link);
        });
    }, []);

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

    useOutsideClick(ref as React.RefObject<HTMLDivElement>, () => setActive(null));

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
                            key={`button-${active.name}-${id}`}
                            layout
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.05,
                                },
                            }}
                            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                            onClick={() => setActive(null)}
                        >
                            <CloseIcon />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${active.name}-${id}`}
                            ref={ref}
                            className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-primary"
                        >
                            <div className="p-6">
                                <div className="flex flex-row items-center">
                                    <motion.div 
                                        layoutId={`image-${active.name}-${id}`} 
                                        className="mr-6"
                                    >
                                        <img
                                            src={active.imagePath}
                                            alt={active.name}
                                            className="h-32 w-32 object-contain"
                                        />
                                    </motion.div>
                                    
                                    <div>
                                        <motion.h3
                                            layoutId={`title-${active.name}-${id}`}
                                            className="font-medium text-background text-xl"
                                        >
                                            {active.name}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.description}-${id}`}
                                            className="text-neutral-300 text-base mt-1"
                                        >
                                            {active.description}
                                        </motion.p>
                                        <motion.p
                                            layoutId={`price-${active.price}-${id}`}
                                            className="text-neutral-300 text-base mt-1"
                                        >
                                            {active.price}
                                        </motion.p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                <motion.div
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-neutral-300 text-sm flex flex-col items-start gap-6"
                                >
                                    <p>{active.details}</p>
                                </motion.div>
                            </div>
                            
                            <div className="mt-auto p-6 flex gap-6 justify-start">
                                <motion.a
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    href={`mailto:info@example.com?subject=Order Inquiry for ${active.name}`}
                                    className="px-4 py-3 text-sm rounded-full font-bold bg-background text-primary text-center w-28"
                                >
                                    Place Order
                                </motion.a>
                                <motion.div
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-28"
                                >
                                    <Link
                                        href={`/shop/${active.name}`}
                                        className="px-4 py-3 text-sm rounded-full font-bold border border-background text-background text-center inline-block w-full"
                                        onClick={() => setActive(null)}
                                        prefetch={true}
                                    >
                                        Learn More
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>

            <div className="container py-10 bg-primary">
                <div className="text-center my-12">
                    <h2 className="text-3xl md:text-5xl text-background font-signifier mb-6">
                        Professional Testing <br />
                        Equipment Rental
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Access high-quality testing and commissioning equipment for your projects with flexible rental options and expert technical support.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-20">
                    {kits.map((kit) => (
                        <motion.div
                            layoutId={`card-${kit.name}-${id}`}
                            key={kit.name}
                            onClick={() => setActive(kit)}
                            className="overflow-hidden cursor-pointer transition-transform"
                        >
                            <div className="py-4 text-center">
                                <motion.div 
                                    layoutId={`image-${kit.name}-${id}`}
                                    className="flex justify-center items-center" 
                                    style={{ height: '176px' }}
                                >
                                    <div style={{ padding: `${kit.padding || 15}px` }}>
                                        <img 
                                            src={kit.imagePath} 
                                            alt={`${kit.name} Kit`} 
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </motion.div>
                                <motion.h2 
                                    layoutId={`title-${kit.name}-${id}`}
                                    className="text-xl font-semibold mt-4 text-background"
                                >
                                    {kit.name}
                                </motion.h2>
                                <motion.p 
                                    layoutId={`description-${kit.description}-${id}`}
                                    className="text-neutral-300 text-sm"
                                >
                                    {kit.description}
                                </motion.p>
                                <motion.p 
                                    layoutId={`price-${kit.price}-${id}`}
                                    className="text-neutral-300 text-sm"
                                >
                                    {kit.price}
                                </motion.p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
}

const CloseIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-black"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </svg>
    );
};
