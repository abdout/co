import React from "react";
import Image from "next/image";

interface CarProps {
  src: string;
  alt: string;
  width?: number;
  status?: number;
  id?: string;
  bg?: string;
  onSelect?: (id: string) => void;
}

const Car = ({ src, alt, width, status, id, bg, onSelect }: CarProps) => {
  return (
    <div 
      onClick={() => id && onSelect && onSelect(id)}
      className="group flex flex-col rounded-lg overflow-hidden transition duration-300 cursor-pointer border border-neutral-300 dark:border-neutral-900"
    >
      <div className="relative md:h-[10rem] h-[8rem] w-full overflow-hidden flex justify-center items-center  border-neutral-300 dark:border-neutral-900">
        <Image
          src={src}
          alt={alt}
          fill
          className="group-hover:scale-105 transition duration-300 p-5 "
        />
      </div>
      <div className="md:p-4 px-4 py-3 bg-neutral-300 dark:bg-neutral-900">
        <h3 className="text-xl font-bold mb-1">{alt}</h3>
        <h4 className="text-muted-foreground text-sm">{id}</h4>
        <h4 className="text-muted-foreground text-sm">Ready</h4>
        <h4 className="text-muted-foreground text-sm">In store</h4>
      </div>
    </div>
  );
};

export default Car;