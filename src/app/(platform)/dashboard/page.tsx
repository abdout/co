'use client';
import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuickLinks from "@/components/platform/QuickLinks";
// import { useRouter } from 'next/navigation';

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  // const router = useRouter();
  // useEffect(() => {
  //   if (window.location.hash === '#_=_') {
  //       router.replace('/platform'); 
  //   }

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-8">Quick</h1>
      
      <QuickLinks />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[80%] md:max-w-[60%] pr-20" onInteractOutside={() => setIsDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle className='font-heading font-bold text-start text-3xl leading-normal sm:text-2xl md:text-3xl'>Welcome</DialogTitle>
            
          </DialogHeader>
          
          <div className='relative -mt-2 '>
            <p className='text-[16px] text-muted-foreground'>to company Platform</p>

            <p className='w-full md:w-4/5 pt-4'>Excellence through collaboration - With a commitment to quality and efficiency, this platform streamlines our testing and commissioning processes. Join us in creating a new standard of operational excellence and project management.</p>

            <div className='flex flex-col md:flex-row justify-between items-center mt-8'>
              <div>
                <p className='-mt-2 mb-4 text-sm'>Explore the links below for user guides and support center👇</p>
                <div className='flex gap-8 items-center'>
                  <Icon icon={"ph:book-fill"} height="60" className="opacity-80 hover:opacity-100 transition-opacity duration-200" />
                  <Icon icon={"ant-design:customer-service-filled"} height="60" className="opacity-80 hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}