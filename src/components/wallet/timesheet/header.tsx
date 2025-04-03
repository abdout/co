'use client';
import React from "react";
import { Icon } from "@iconify/react";

const Header = () => {
  return (
    <div className=" rounded-lg ">
      <div className="flex  gap-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <Icon icon='ph:timer-thin' width={80} className="text-gray-600"/>
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Company</h2>
          <div className="space-y-1 text-gray-600">
            <p className="text-sm">Time Sheet for the month of <span className="font-medium">Feb 2024</span></p>
            <p className="text-sm">Project Manager: <span className="font-medium">Mahmoud Hamdi</span></p>
            <p className="text-sm">Engineer: <span className="font-medium">Osman Abdout</span>, Iqama no.: <span className="font-medium">2515334866</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
