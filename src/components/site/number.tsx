'use client'
import { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

interface CounterProps {
  end: number;
  title: string;
}

const Counter = ({ end, title }: CounterProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && nodeRef.current) {
      const node = nodeRef.current;

      const controls = animate(0, end, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          node.textContent = Math.round(value).toString();
        },
      });

      return () => controls.stop();
    }
  }, [end, isInView]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center"
    >
      <div className="text-6xl font-bold mb-2">
        <div ref={nodeRef}>0</div>
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        viewport={{ once: true }}
        className="uppercase text-sm tracking-wider text-muted-foreground"
      >
        {title}
      </motion.div>
    </motion.div>
  );
};

export function NumberSection() {
  return (
    <div className="relative">
      {/* Background Image Section with Mask */}
      <div className="relative h-[90vh] bg-[url('/switchgear.png')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-black/50">
          <div className="container mt-40 px-8 mx-auto  h-full flex flex-col justify-center text-accent">
          <h4 className="text-background/80">company </h4>
            <h1 className=" font-bold -mt-2">In numbers</h1>
          </div>
        </div>
        {/* Angular Shape Divider with Three Peaks */}
        
      </div>

      {/* Counters Section */}
      <div className="bg-background text-primary -mt-1 py-8">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <Counter end={120} title="PROJECT" />
            <Counter end={70} title="EXPERT" />
            <Counter end={14} title="AWARDS" />
            <Counter end={100} title="SATISFIED" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
