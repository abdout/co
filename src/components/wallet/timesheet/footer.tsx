import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <div className="mt-8 rounded-lg  p-6">
      <div className="flex flex-col space-y-8">
        <div className="space-y-4 border-b pb-4">
          <div>
            <h4 className="text-sm text-gray-600">
              Total normal working hours: <span className="font-semibold text-gray-900">407 hr</span>
            </h4>
          </div>
          <div>
            <h4 className="text-sm text-gray-600">
              Total overtime working hours: <span className="font-semibold text-gray-900">28 hr</span>
            </h4>
          </div>
        </div>
        
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600">Project Manager</h4>
              <p className="text-base font-semibold text-gray-900">Mahmoud Hamdi</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600">Signature</h4>
              <div className="w-48 h-12 border-b-2 border-gray-300 mt-2"></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600">Engineer</h4>
              <p className="text-base font-semibold text-gray-900">Osman Abdout</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600">Signature</h4>
              <div className="w-48 h-12 mt-2 flex flex-col items-center">
                <div className="w-32 h-8 -mt-2 z-50">
                  <Image 
                    src="/sign.png" 
                    alt="Engineer Osman Signature"
                    width={128}
                    height={32}
                    className="object-contain z-50"
                  />
                </div>
                <div className="w-full border-b-2 border-gray-300 mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer