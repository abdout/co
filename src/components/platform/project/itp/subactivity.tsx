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
import Table from "@/components/platform/project/itp/table";
import { Abb } from "@/constant/abb";

type OptionKey = 'evSwgr' | 'evTrafo' | 'evCable' | 'evRmu' | 'hvSwgr' | 'hvTrafo' | 'hvCable' | 'hvRmu' | 'mvSwgr' | 'mvTrafo' | 'mvCable' | 'mvRmu' | 'lvSwgr' | 'lvTrafo' | 'lvCable' | 'lvRmu';

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

interface IndexProps {
  option: OptionKey;
  systemName?: string;
  activities?: ProjectActivity[];
}

const SubActivity: React.FC<IndexProps> = ({ option, systemName, activities = [] }) => {
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

  // Fixed standard rows that always appear at the beginning
  const standardRows = [
    [
      '2', '2.1', 'Name plate details checks <br /> as per approved drawing', 'Visual <br /> inspection', 'Factory <br /> test report', 'Each item', 'Factory test report/ Rated <br /> name plate data/ MOS/', 'Vendor <br /> manual', 'Test <br /> report', 'H', 'w', 'w', 'R', ''
    ],
    [
      '', '2.2', 'Physical inspection test <br /> as per approved drawing', 'Visual <br /> inspection', 'Factory <br /> test report', 'Each item', 'Factory test report/ Rated <br /> name plate data/ MOS/', 'Vendor <br /> manual', 'Test <br /> report', 'H', 'w', 'w', 'R', ''
    ]
  ];

  // Filter activities for the current system
  const systemActivities = activities?.filter(act => act.system === systemName) || [];
  
  // If we have MongoDB activities for this system, use them
  if (systemActivities.length > 0) {
    const activityRows = systemActivities.map((item, index) => [
      "",
      `2.${index + 3 < 10 ? index + 3 : (index + 3).toString().padStart(2, "0")}`,
      `${item.category}: ${item.activity}`, // Display category and activity together
      "Test",
      "Factory <br /> test report",
      "Each item",
      "Factory test report/ Rated <br /> name plate data/ MOS/",
      "Vendor <br /> manual",
      "Test <br /> report",
      "H",
      "w",
      "w",
      "R",
      "",
    ]);
    
    return <Table data={[...standardRows, ...activityRows]} />;
  }
  
  // Fall back to default option arrays if no MongoDB data
  const defaultRows = optionArrays[option].map((item, index) => [
    "",
    `2.${index + 3 < 10 ? index + 3 : (index + 3).toString().padStart(2, "0")}`,
    Abb[item.label],
    "Test",
    "Factory <br /> test report",
    "Each item",
    "Factory test report/ Rated <br /> name plate data/ MOS/",
    "Vendor <br /> manual",
    "Test <br /> report",
    "H",
    "w",
    "w",
    "R",
    "",
  ]);

  return <Table data={[...standardRows, ...defaultRows]} />;
};

export default SubActivity;