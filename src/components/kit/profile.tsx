'use client';
import { FC, useState } from "react";
import XlIcon from "../atom/icon/xl";
import { docs } from "@/constant/kit";
import TextIcon from "../atom/icon/text";
import { cn } from "@/lib/utils";

interface KitDetial {
  src: string,
  alt: string,
  id: number,
  bg?: string
  calibration?: string,
  datasheet?: string,
  manual?: string,
  price?: string,
  status?: string,
  under?: string,
  km?: number,
  width?: number,
  licence?: string,
  penalty?: string,
}

interface Props {
  kit: KitDetial;
}

const Profile: FC<Props> = ({ kit }) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-5">
        <XlIcon src={kit.src} alt={kit.alt} />
        <div className="items-start justify-start flex flex-col space-y-2">
          <h3 className="text-lg font-medium text-gray-800">{kit.alt}</h3>
          <p className="text-base text-gray-600">ID: {kit.id}</p>
          {kit.under && <p className="text-base text-gray-600">Under: {kit.under}</p>}
          {kit.status && <p className="text-base text-gray-600">Status: {kit.status}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 items-center">
        {docs.map((data, index) => (
          <div className="relative" onClick={() => setSelectedItem(selectedItem === index ? null : index)} key={index}>
            <div className={cn(
              "p-1.5 text-center transition-colors", 
              selectedItem === index ? 'bg-black text-[#fcfcfc]' : 'hover:bg-gray-100'
            )}>
              {data && <TextIcon icon={data.icon} label={data.label} iconSize={36} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;