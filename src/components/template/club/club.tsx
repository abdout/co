import React from 'react';
import { club } from './constant';
import { ClubCard } from './card';
import Link from 'next/link';

const AllClub = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-2xl md:text-3xl">
          الامانات
        </h2>
        <p className="pb-7">
          سلطان العشق في الله ارضيك وين
        </p>

        <div className="w-full">
          <div className="items-center justify-center grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-5 gap-6">
            {club.map((club) => (
              <Link key={club.id} href={`/club/${club.id}`}>
                <ClubCard {...club} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllClub;