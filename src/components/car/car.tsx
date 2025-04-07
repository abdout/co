'use client';

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Car as CarType } from "./types";

interface CarProps {
  images?: string[];
  name?: string;
  id: string;
  status?: string;
  car?: CarType;
  onSelect?: (id: string) => void;
  onExpand?: (car: CarType) => void;
}

const Car = ({ 
  images, 
  name, 
  id, 
  status, 
  car, 
  onSelect, 
  onExpand 
}: CarProps) => {
  // Use the first image in the array or a placeholder
  const imageUrl = images && images.length > 0 ? images[0] : "/placeholder.jpg";
  
  const handleClick = () => {
    if (car && onExpand) {
      onExpand(car);
    } else if (onSelect && id) {
      onSelect(id);
    }
  };
  
  return (
    <motion.div 
      onClick={handleClick}
      layoutId={`card-${car?.id}-${id}`}
      className="group flex flex-col rounded-lg overflow-hidden transition duration-300 cursor-pointer border border-border h-full w-full bg-card"
    >
      <motion.div 
        layoutId={`image-${car?.id}-${id}`}
        className="relative h-3/5 w-full overflow-hidden flex justify-center items-center"
      >
        <Image
          src={imageUrl}
          alt={name || "Car image"}
          fill
          className="object-cover p-2"
        />
      </motion.div>
      <div className="p-4 flex-grow flex flex-col">
        <motion.h3 
          layoutId={`title-${car?.id}-${id}`}
          className="font-medium text-lg truncate"
        >
          {name || car?.name || "Unnamed Car"}
        </motion.h3>
        
        <motion.p
          layoutId={`status-${car?.id}-${id}`}
          className="text-muted-foreground text-sm mt-1"
        >
          {status || car?.status || "Unknown status"}
        </motion.p>
        
        <motion.p
          layoutId={`under-${car?.id}-${id}`}
          className="text-muted-foreground text-sm mt-1"
        >
          {car?.under ? `Assigned to: ${car.under}` : "Unassigned"}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Car;