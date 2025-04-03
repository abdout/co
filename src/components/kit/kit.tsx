import React from "react";
import Image from "next/image";
import Link from "next/link";

interface KitProps {
  src: string;
  alt: string;
  width?: number;
  status?: number;
  id?: string;
  bg?: string;
  onSelect?: (id: string) => void;
}

const Kit = ({ src, alt, width, status, id, bg, onSelect }: KitProps) => {
  return (
    <div 
    style={{ borderColor: bg }} 
      onClick={() => id && onSelect && onSelect(id)}
      className="group flex flex-col rounded-lg overflow-hidden cursor-pointer transition duration-300 border"
    >
      <div 
        
        className="relative h-[8rem] md:h-[10rem] w-full overflow-hidden "
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center group-hover:scale-105 transition duration-300 p-5"
        />
      </div>
      <div 
        style={{ backgroundColor: bg, borderColor: bg }} 
        className="md:p-4 px-4 py-3 border-b border-l border-r"
      >
        <h3 className="text-xl font-bold mb-1 ">{alt}</h3>
        <p className=" text-sm ">
          {status ? "Ready" : "Available"}
        </p>
      </div>
    </div>
  );
};

export default Kit;