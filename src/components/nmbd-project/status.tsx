import { FC } from 'react';

interface StatusProps {
  value: string;
  onChange: (value: string) => void;
}

type Option = 'Neutral' | 'In Progress' | 'Completed' | 'Stopped';

const Status: FC<StatusProps> = ({ value, onChange }) => {
  const options: Option[] = ['Neutral', 'In Progress', 'Completed', 'Stopped'];
  const colors: Record<Option, string> = {
    'Neutral': 'bg-gray-400',
    'In Progress': 'bg-yellow-400',
    'Completed': 'bg-green-400',
    'Stopped': 'bg-red-400'
  };

  return (
    <div className="w-full p-2 border rounded-md">
      <div className="mb-2 text-sm text-muted-foreground">Status</div>
      <div className="space-y-2">
        {options.map((option) => (
          <div 
            key={option} 
            onClick={() => onChange(option)}
            className={`flex items-center cursor-pointer p-2 rounded-md hover:bg-slate-50 ${value === option ? 'bg-slate-100' : ''}`}
          >
            <span 
              className={`inline-block w-4 h-4 rounded-full mr-3 ${colors[option]}`}
            />
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Status;