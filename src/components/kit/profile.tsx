'use client';
import { FC, useState } from "react";

import { docs } from "@/constant/kit";

import { cn } from "@/lib/utils";
import { KitDetailProps } from "./types"; // Import the type from our types.ts file

const Profile: FC<KitDetailProps> = ({ kit }) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-5">
        
        <div className="items-start justify-start flex flex-col space-y-2">
          <h3 className="text-lg font-medium text-gray-800">{kit.name || kit.alt}</h3>
          <p className="text-base text-gray-600">ID: {kit.id}</p>
          {kit.under && <p className="text-base text-gray-600">Under: {kit.under}</p>}
          {kit.status && <p className="text-base text-gray-600">Status: {kit.status}</p>}
          {kit.location && <p className="text-base text-gray-600">Location: {kit.location}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 items-center">
        {docs.map((data, index) => (
          <div className="relative" onClick={() => setSelectedItem(selectedItem === index ? null : index)} key={index}>
            <div className={cn(
              "p-1.5 text-center transition-colors", 
              selectedItem === index ? 'bg-black text-[#fcfcfc]' : 'hover:bg-gray-100'
            )}>
              
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional kit details */}
      <div className="space-y-3">
        {kit.calibration && (
          <div className="flex justify-between">
            <span className="text-gray-600">Calibration:</span>
            <span className="font-medium">{kit.calibration}</span>
          </div>
        )}
        {kit.price && (
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">{kit.price}</span>
          </div>
        )}
        {(kit.datasheet || kit.manual) && (
          <div className="flex flex-col gap-2 mt-4">
            <h4 className="text-sm font-medium text-gray-700">Documentation</h4>
            {kit.datasheet && (
              <a href={kit.datasheet} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Datasheet
              </a>
            )}
            {kit.manual && (
              <a href={kit.manual} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Manual
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;