'use client';
import { FC, useState } from "react";
import TextIcon from "../atom/icon/text";
import { docs } from "@/constant/car";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CarDetial {
  src: string,
  alt: string,
  id: string,
  sim: string,
  petrol: number,
  oil: string,
  history: string,
  status: string,
  under: string,
  km: number,
  width: number,
  licence: string,
  penalty: string,
}

interface Props {
  car: CarDetial;
}

const Profile: FC<Props> = ({ car }) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-5">
        <div className="relative w-[140px] h-[140px] overflow-hidden rounded-lg">
          <Image 
            src={car.src} 
            alt={car.alt} 
            fill
            className="object-cover"
            sizes="140px"
          />
        </div>
        <div className="items-start justify-start flex flex-col space-y-2">
          <h3 className="text-lg font-medium text-gray-800">{car.alt}</h3>
          <p className="text-base text-gray-600">ID: {car.id}</p>
          <p className="text-base text-gray-600">Under: {car.under}</p>
          <p className="text-base text-gray-600">Status: {car.status}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 items-center">
        {docs.map((data, index) => (
          <div className="relative" onClick={() => setSelectedItem(selectedItem === index ? null : index)} key={index}>
            <div className={cn(
              "p-1.5 text-center transition-colors", 
              selectedItem === index ? 'bg-black text-[#fcfcfc]' : 'hover:bg-gray-100'
            )}>
              <TextIcon icon={data.icon} label={data.label} iconSize={36} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;