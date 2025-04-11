'use client';

import Image from 'next/image';

const teamMembers = [
  {
    id: 1,
    name: "James Wilson",
    rank: "CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    name: "Robert Thompson",
    rank: "COO",
    
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    name: "William Parker",
    rank: "CTO",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    name: "David Mitchell",
    rank: "CFO",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3"
  }
];

export function TeamPage() {
  return (
    <section className="py-24 bg-primary text-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Board</h2>
          <p className="text-background/70 max-w-2xl mx-auto">
            Meet the experts behind our success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-background">{member.rank}</h3>
              <p className=" text-background/70">{member.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
