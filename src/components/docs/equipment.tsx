import React from 'react';

interface EquipmentProps {
  items: {
    image: string;
    name: string;
  }[];
}

export const Equipment: React.FC<EquipmentProps> = ({ items }) => {
  return (
    <div className="w-full overflow-x-auto py-1" style={{ display: 'block', whiteSpace: 'nowrap' }}>
      {items.map((item, index) => (
        <span key={index} className="inline-block w-12 mx-1 text-center align-top">
          <img 
            src={`/kit/${item.image}`} 
            alt={item.name} 
            className="w-10 h-10 object-contain border rounded p-0.5 mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" 
          />
          <span className="text-[10px] block truncate">{item.name}</span>
        </span>
      ))}
    </div>
  );
};

// Pre-defined equipment sets
export const relayTestEquipment = [
  { image: 'freja300.png', name: 'Freja 300' },
  { image: 'sverker750.png', name: 'Sverker 750' },
  { image: 'cmc356.png', name: 'CMC 356' },
  { image: 'dlro600.png', name: 'DLRO 600' },
];

export const transformerTestEquipment = [
  { image: 'ttr300.png', name: 'TTR 300' },
  { image: 'mit525.png', name: 'MIT 525' },
  { image: 'frax101.png', name: 'FRAX 101' },
  { image: 'mto330.png', name: 'MTO 330' },
];

export const breakerTestEquipment = [
  { image: 'egil.png', name: 'EGIL' },
  { image: 'oden.png', name: 'ODEN AT' },
  { image: 'b10e.png', name: 'B10E' },
  { image: 'ct.png', name: 'CT Analyzer' },
];

export default Equipment;
