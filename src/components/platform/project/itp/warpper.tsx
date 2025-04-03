'use client';
import React from "react";
import Activity from "@/components/platform/project/itp/activity";

type OptionKey = 'evSwgr' | 'evTrafo' | 'evCable' | 'evRmu' | 'hvSwgr' | 'hvTrafo' | 'hvCable' | 'hvRmu' | 'mvSwgr' | 'mvTrafo' | 'mvCable' | 'mvRmu' | 'lvSwgr' | 'lvTrafo' | 'lvCable' | 'lvRmu';

// Map system names to option keys
const systemToOptionKey: Record<string, OptionKey> = {
  'EV SWITCHGEAR': 'evSwgr',
  'EV TRANSFORMER': 'evTrafo',
  'EV CABLE': 'evCable',
  'EV RMU': 'evRmu',
  'HV SWITCHGEAR': 'hvSwgr',
  'HV TRANSFORMER': 'hvTrafo',
  'HV CABLE': 'hvCable',
  'HV RMU': 'hvRmu',
  'MV SWITCHGEAR': 'mvSwgr',
  'MV TRANSFORMER': 'mvTrafo',
  'MV CABLE': 'mvCable',
  'MV RMU': 'mvRmu',
  'LV SWITCHGEAR': 'lvSwgr',
  'LV TRANSFORMER': 'lvTrafo',
  'LV CABLE': 'lvCable',
  'LV RMU': 'lvRmu'
};

// Define activity type based on MongoDB data
interface ProjectActivity {
  system: string;
  category: string;
  subcategory: string;
  activity: string;
  _id: {
    $oid: string;
  };
}

interface ActivityWrapperProps {
  systems?: string[];
  activities?: ProjectActivity[];
}

const ActivityWrapper: React.FC<ActivityWrapperProps> = ({ systems = [], activities = [] }) => {
  return (
    <>
      {systems.map((system, index) => {
        const optionKey = systemToOptionKey[system] || 'lvSwgr'; // Fallback to lvSwgr if mapping not found
        return (
          <Activity 
            key={`${system}-${index}`} 
            option={optionKey} 
            index={index + 1} 
            systemName={system}
            activities={activities}
          />
        );
      })}
    </>
  );
};

export default ActivityWrapper;