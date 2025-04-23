// Simple standalone component for equipment images
// This is in .jsx format for better compatibility with MDX
export default function EquipmentImages() {
  const images = [
    { src: 'freja300.png', name: 'Freja 300' },
    { src: 'sverker750.png', name: 'Sverker 750' },
    { src: 'cmc356.png', name: 'CMC 356' },
    { src: 'dlro600.png', name: 'DLRO 600' }
  ];

  return (
    <div className="w-full overflow-x-auto whitespace-nowrap py-2" style={{ display: 'block' }}>
      {images.map((img, i) => (
        <span key={i} className="inline-block w-14 mx-1 text-center align-top">
          <img 
            src={`/kit/${img.src}`} 
            alt={img.name} 
            className="w-12 h-12 object-contain border rounded p-1 mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" 
          />
          <span className="text-xs block truncate">{img.name}</span>
        </span>
      ))}
    </div>
  );
} 