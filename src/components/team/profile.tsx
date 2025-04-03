import { FC, useState } from "react";
import { Icon } from "@iconify/react";
import { docs } from "@/constant/team";
import TextIcon from "../atom/icon/text";
import XlIcon from "../atom/icon/xl";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TeamDetial {
  src: string;
  alt: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mail?: string;
  location?: string;
  width: number;
  height?: number;
  id?: string;
  iqama?: string;
  eligible?: string[]; // eligible is now optional
}

interface Props {
  team: TeamDetial;
  onClose?: () => void;
}

const Profile: FC<Props> = ({ team, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const fullName = team.alt;

  return (
    <div className="flex flex-col relative">
      {onClose && (
        <div className="absolute top-2 right-2 z-10">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>
      )}

      {team.iqama && (
        <div className="space-y-5 p-4 pt-5">
          <div className="flex items-center space-x-5">
            <XlIcon src={team.src} alt={team.alt} />
            <div className="items-start justify-start flex flex-col space-y-2">
              <h3 className="text-lg font-medium text-gray-800">{fullName}</h3>
              <p className="text-base text-gray-600">{team.phone}</p>
              <p className="text-base text-gray-600">{team.mail}</p>
              <p className="text-base text-gray-600">{team.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-4 items-center">
            {docs.map((data, index) => (
              <div className="relative" onClick={() => setSelectedItem(selectedItem === index ? null : index)} key={index}>
                <div className={cn(
                  "p-1.5 text-center transition-colors", 
                  selectedItem === index ? 'bg-black text-[#fcfcfc]' : 'hover:bg-gray-100'
                )}>
                  <TextIcon icon={data.icon} label={data.label} />
                </div>
                {selectedItem === index && (
                  <div className="absolute left-0 right-0 bg-black text-[#fcfcfc] pl-[13px] z-10 flex items-center">
                    <Icon icon='solar:arrow-right-broken' width={32}/>
                    <button 
                      className="p-1.5 hover:bg-gray-800 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (team.phone) window.location.href = `https://wa.me/${team.phone.replace(/\s+/g, '')}`;
                      }}
                    >
                      <Icon icon='ph:whatsapp-logo-thin' width={32}/>
                    </button>
                    <button 
                      className="p-1.5 hover:bg-gray-800 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (team.mail) window.location.href = `mailto:${team.mail}`;
                      }}
                    >
                      <Icon icon='circum:mail' width={32}/>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {team.eligible && (
        <div className='flex flex-col gap-3 p-4 pt-6 border-t'>
          <h3 className="text-base font-medium text-gray-800">Eligibility</h3>
          <div className='flex flex-wrap gap-x-4'>
            {team.eligible?.map((test, index) => (
              <h4 
                key={index} 
                className={cn(
                  "text-sm text-gray-600 whitespace-nowrap",
                  index !== (team.eligible?.length ?? 0) - 1 ? 'border-r border-gray-300 pr-2' : ''
                )}
              >
                {test}
              </h4>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;