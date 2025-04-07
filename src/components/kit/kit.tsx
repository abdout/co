'use client';

import React from "react";
import Image from "next/image";
import { KitCardProps } from './types';
import { motion } from "framer-motion";

const Kit: React.FC<KitCardProps> = ({
  id,
  name,
  picture,
  status,
  onSelect,
  kit,
  onExpand
}) => {
  const statusColor = status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  const displayName = name || 'Unnamed Kit';
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      layoutId={`card-${kit.id}-${id}`}
      onClick={() => onExpand(kit)}
      className="group relative rounded-xl h-full w-full cursor-pointer flex flex-col items-center"
    >
      <motion.div 
        layoutId={`image-${kit.id}-${id}`} 
        className="h-32 md:h-44 w-5/6 mx-auto bg-primary rounded-lg md:rounded-2xl flex items-center justify-center overflow-hidden relative"
      >
        {kit.picture ? (
          <Image 
            src={kit.picture} 
            alt={kit.name || 'Kit'} 
            fill 
            className="object-cover transition duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-background/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </motion.div>
      <div className="pt-3 space-y-1 text-center">
        <motion.h3 
          layoutId={`title-${kit.id}-${id}`} 
          className="font-medium text-lg text-foreground line-clamp-1"
        >
          {kit.name || 'Unnamed Kit'}
        </motion.h3>
        <motion.p 
          layoutId={`status-${kit.id}-${id}`} 
          className="text-sm text-muted-foreground"
        >
          {kit.status === 'Available' ? 'Available' : kit.status || 'Unknown'}
        </motion.p>
        {kit.price && (
          <motion.p 
            layoutId={`price-${kit.id}-${id}`} 
            className="text-sm text-muted-foreground"
          >
            {kit.price}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default Kit;