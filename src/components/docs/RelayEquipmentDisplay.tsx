// Simple component for displaying relay equipment
export function RelayEquipmentDisplay() {
  return (
    <div>
      <h2>Equipment Selection</h2>
      <div className="w-full overflow-x-auto whitespace-nowrap py-2" style={{ display: 'block' }}>
        {['freja300.png', 'sverker750.png', 'cmc356.png', 'dlro600.png'].map((img, i) => (
          <span key={i} className="inline-block w-14 mx-1 text-center align-top">
            <img 
              src={`/kit/${img}`} 
              alt={img.replace('.png', '')} 
              className="w-12 h-12 object-contain border rounded p-1 mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" 
            />
            <span className="text-xs block truncate">{img.replace('.png', '')}</span>
          </span>
        ))}
      </div>
      
      <h2>Model Selection</h2>
      <div className="flex flex-wrap gap-2 my-4">
        {[
          { name: 'ABB REF615', color: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50' },
          { name: 'Siemens 7SJ82', color: 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/50' },
          { name: 'SEL-751', color: 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-800/50' },
          { name: 'GE Multilin 750', color: 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/50' },
          { name: 'Schneider P14D', color: 'bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/50' },
          { name: 'Micom P122', color: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700/50' }
        ].map((badge, i) => (
          <span 
            key={i}
            className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold cursor-pointer ${badge.color}`}
          >
            {badge.name}
          </span>
        ))}
      </div>
    </div>
  );
} 