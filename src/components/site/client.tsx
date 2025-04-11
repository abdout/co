'use client'
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const clients = [
  {
    name: "Saudi Aramco",
    logo: "/client/aramco.png",
    alt: "Saudi Aramco logo",
    height: "h-9"
  },
  {
    name: "SEC",
    logo: "/client/sec.png",
    alt: "SEC logo",
    height: "h-10"
  },
  {
    name: "Bahri",
    logo: "/client/bahri.png",
    alt: "Bahri logo",
    height: "h-14"
  },
  {
    name: "King",
    logo: "/client/king.png",
    alt: "King logo",
    height: "h-12"
  },
  {
    name: "ABB",
    logo: "/client/abb.svg",
    alt: "ABB logo",
    height: "h-8"
  },
  {
    name: "Savola",
    logo: "/client/savola.svg",
    alt: "Savola logo",
    height: "h-10"
  },
 
  {
    name: "logo",
    logo: "/client/logo.svg",
    alt: "Siemens logo",
    height: "h-9"
  },
  {
    name: "Siemens",
    logo: "/client/siemens.png",
    alt: "Siemens logo",
    height: "h-6"
  }
  
];

const ClientLogo = ({ logo, alt, height }: { logo: string; alt: string; height: string }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`relative ${height} w-full`}>
        <Image
          src={logo}
          alt={alt}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};

export function ClientSection() {
  return (
    <div className="relative">
      {/* White Section with Client Logos */}
      <div className="bg-primary py-16 ">
        <div className="container text-background mx-auto px-8">
          <div className=" my-10 ">
            <h4 className="text-muted">clients </h4>
            <h1 className=" font-bold -mt-2"> Trust us</h1>
            
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {clients.map((client) => (
              <ClientLogo 
                key={client.name} 
                logo={client.logo} 
                alt={client.alt}
                height={client.height}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Background Image Section with Inverted Mask */}
      <div className="relative h-[130vh] bg-[url('/room.png')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 mt-10 h-full flex flex-col items-center justify-center text-white">
          <h2 className="text-center text-background text-4xl md:text-5xl font-signifier mb-6 ">
           Rental Shop 
          </h2>

          <p className="text-lg text-background/80 mb-8 text-center">
            A wide range of professional testing equipment available for rent. <br/> Order online. receive at your doorstep. 
          </p>

          <Link
            href="/shop"
           
          >
            <Button variant='outline' size='lg' className=" h-12 text-lg flex gap-2 rounded-full text-primary ">
            Shop
            <ArrowRight className=" h-6 w-6 mt-[3px]" />
            </Button>
          </Link>
          </div>
        </div>
        {/* Inverted Angular Shape Divider */}
        
      </div>
    </div>
  );
}
