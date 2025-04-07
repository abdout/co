'use client';
import React from "react";
import {
  EvCable,
  EvRmu,
  EvSwgr,
  EvTrafo,
  HvCable,
  HvRmu,
  HvSwgr,
  HvTrafo,
  LvCable,
  LvRmu,
  LvSwgr,
  LvTrafo,
  MvCable,
  MvRmu,
  MvSwgr,
  MvTrafo,
} from "@/constant/project/item";

import { body } from "@/constant/project/mos/body";
import { Abb } from "@/constant/abb";

type OptionKey = 'evSwgr' | 'evTrafo' | 'evCable' | 'evRmu' | 'hvSwgr' | 'hvTrafo' | 'hvCable' | 'hvRmu' | 'mvSwgr' | 'mvTrafo' | 'mvCable' | 'mvRmu' | 'lvSwgr' | 'lvTrafo' | 'lvCable' | 'lvRmu';

interface IndexProps {
  params: Params | Promise<Params>;
  option: OptionKey;
  index: number;
  project: any;
}

interface Params {
  id: string;
}

interface Option {
  value: string;
}

const SubActivity: React.FC<IndexProps> = ({ params, option, index, project }) => {
  // Safety check for params
  if (!params) {
    return null;
  }
  
  // Properly unwrap params using React.use() for Next.js 15
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  
  // Safety check for unwrapped params
  if (!unwrappedParams || !unwrappedParams.id) {
    return null;
  }
  
  if (!project) {
    return null;
  }

  const optionArrays = {
    evSwgr: EvSwgr,
    evTrafo: EvTrafo,
    evCable: EvCable,
    evRmu: EvRmu,
    hvSwgr: HvSwgr,
    hvTrafo: HvTrafo,
    hvCable: HvCable,
    hvRmu: HvRmu,
    mvSwgr: MvSwgr,
    mvTrafo: MvTrafo,
    mvCable: MvCable,
    mvRmu: MvRmu,
    lvSwgr: LvSwgr,
    lvTrafo: LvTrafo,
    lvCable: LvCable,
    lvRmu: LvRmu,
  };

  const voltageType = option.substring(0, 2) + 'Options';
  
  // Safety check for options data
  if (!project[voltageType] || !project[voltageType][option]) {
    return null;
  }

  const selectedOptions = optionArrays[option].filter(item => 
    project[voltageType][option]?.some((opt: Option) => opt.value === item.value)
  );
  
  // Check if we have any selected options
  if (selectedOptions.length === 0) {
    return null;
  }
  
  const labels = selectedOptions.map((item, itemIndex) => {
    const Body = body[option]?.[item.label];
    
    if (!Body) {
      // Return placeholder instead of null for missing body components
      return (
        <div key={itemIndex}>
          <h4>{`${index}.${itemIndex + 1}. ${Abb[item.label] || item.label}`}</h4>
          <div className="mt-4 p-4 border rounded bg-muted">
            <p className="text-sm text-muted-foreground">No content available for this item.</p>
          </div>
        </div>
      );
    }
    
    return (
      <div key={itemIndex}>
        <h4>
          {`${index}.${itemIndex + 1}. ${Abb[item.label] || item.label}`}
        </h4>
        <div className="mt-4">
          <Body />
        </div>
      </div>
    );
  });
  
  if (labels.length === 0) {
    return null;
  }
  
  return <div>{labels}</div>;
};

export default SubActivity;