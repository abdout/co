'use client';
import { FC, useState } from "react";
import TextIcon from "../atom/icon/text";
import { docs } from "@/constant/car";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarDetail {
  id: string,
  name: string,
  images?: string[],
  sim?: string,
  petrol?: number,
  oil?: string,
  history?: string,
  status?: string,
  under?: string,
  km?: number,
  licence?: string,
  penalty?: string,
}

interface Props {
  car: CarDetail;
  onClose?: () => void;
}

const Profile: FC<Props> = ({ car, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  
  // Use the first image in the array or a placeholder
  const imageUrl = car.images && car.images.length > 0 
    ? car.images[0] 
    : "/images/placeholder.jpg";

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">Car Details</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="relative w-full md:w-[200px] h-[200px] overflow-hidden rounded-lg">
            <Image 
              src={imageUrl} 
              alt={car.name || "Car image"} 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 200px"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <h3 className="text-2xl font-medium">{car.name}</h3>
            <p className="text-base text-muted-foreground">ID: {car.id}</p>
            <p className="text-base text-muted-foreground">Under: {car.under || 'N/A'}</p>
            <p className="text-base text-muted-foreground">Status: {car.status || 'N/A'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          {docs.map((data, index) => (
            <div className="relative" onClick={() => setSelectedItem(selectedItem === index ? null : index)} key={index}>
              <div className={cn(
                "p-3 text-center transition-colors rounded-lg", 
                selectedItem === index ? 'bg-black text-white' : 'hover:bg-gray-100'
              )}>
                <TextIcon icon={data.icon} label={data.label} iconSize={36} />
              </div>
            </div>
          ))}
        </div>
        
        {selectedItem !== null && (
          <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-medium mb-2">{docs[selectedItem].label} Details</h3>
            <p className="text-muted-foreground">
              {car[docs[selectedItem].label.toLowerCase() as keyof CarDetail] || 'No information available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;