const fs = require('fs');
const path = require('path');

// Define types
interface MosActivity {
  title: string;
  activities: string[];
}

interface MosCategory {
  title: string;
  category: string;
  activities: MosActivity[];
}

interface ItemData {
  [system: string]: MosCategory[];
}

// Data for MOS items
const systemData: string[] = [
  'lv-swgr',
  'mv-swgr',
  'hv-swgr',
  'dist-trafo',
  'power-trafo',
  'component',
  'relay',
  'rmu',
  'low-current'
];

// Activities for each system
const itemData: ItemData = {
  'lv-swgr': [
    { 
      title: 'ACB', 
      category: 'ACB',
      activities: [
        { title: 'Contact Resistance', activities: ['Contact Resist.', 'Point Check'] },
        { title: 'Timing', activities: ['Timing Open-Close', 'Closing Time', 'Opening Time'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Dielectric Test'] },
        { title: 'Trip Unit', activities: ['Trip Unit Cal.', 'Overcurrent Test', 'Short Circuit Test'] }
      ]
    },
    { 
      title: 'MCCB', 
      category: 'MCCB', 
      activities: [
        { title: 'Timing', activities: ['Timing Open-Close', 'Response Time'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Polarization Index'] },
        { title: 'Tripping', activities: ['Shunt Trip', 'UV Trip', 'Thermal Trip'] },
        { title: 'Mechanical', activities: ['Mech. Operation', 'Contact Wear', 'Contact Alignment'] }
      ]
    },
    {
      title: 'UPS',
      category: 'UPS',
      activities: [
        { title: 'Battery', activities: ['Battery Cal.', 'Battery Volt.', 'Cell Measurement'] },
        { title: 'Performance', activities: ['Backup Time', 'Efficiency', 'Load Test'] },
        { title: 'System', activities: ['Alarms', 'Controls', 'Display Test'] }
      ]
    },
    {
      title: 'Capacitor Bank',
      category: 'Capacitor Bank',
      activities: [
        { title: 'Capacitance', activities: ['Capacitance', 'Measurement', 'Unbalance'] },
        { title: 'Leakage', activities: ['Leakage Current', 'Insulation Test'] },
        { title: 'Voltage', activities: ['Voltage Cal.', 'Harmonics'] },
        { title: 'Control', activities: ['Auto PF Control', 'Step Response', 'Alarm System'] }
      ]
    },
    {
      title: 'Earth Fault',
      category: 'Earth Fault',
      activities: [
        { title: 'Tripping', activities: ['Tripping Time', 'Threshold Test'] },
        { title: 'Relay', activities: ['Relay Settings', 'Supervision'] },
        { title: 'Circuit', activities: ['Circuit Check', 'Continuity Test'] },
        { title: 'Indicator', activities: ['Indicator Test', 'Alarm Function'] }
      ]
    },
    {
      title: 'Distribution Board',
      category: 'Distribution Board',
      activities: [
        { title: 'Insulation', activities: ['Ins. Resist.', 'Phase-Phase Test', 'Phase-Earth Test'] },
        { title: 'Busbar', activities: ['Busbar Tightness', 'Connection Test', 'Thermal Scan'] },
        { title: 'Voltage', activities: ['Volt. Stability', 'Voltage Drop'] },
        { title: 'Verification', activities: ['Phase Seq. Verif.', 'Labeling Check'] },
        { title: 'Protection', activities: ['Func. Breaker-RCD Coord.', 'RCD Test Button', 'Earth Connection'] }
      ]
    },
    {
      title: 'Earthing System',
      category: 'Earthing System',
      activities: [
        { title: 'Resistance', activities: ['Earth Resist.', 'Soil Resistivity'] },
        { title: 'Connections', activities: ['Earth Tightness', 'Connection Audit', 'Bonding Test'] }
      ]
    },
    {
      title: 'Metering',
      category: 'Metering',
      activities: [
        { title: 'Energy', activities: ['Cal. kWh', 'Accuracy Test'] },
        { title: 'Power', activities: ['Cal. Power Factor', 'Cal. kVA', 'Verification'] }
      ]
    },
    {
      title: 'Motor Control Center',
      category: 'Motor Control Center',
      activities: [
        { title: 'Starters', activities: ['Starters Check', 'Contactor Test', 'Overload Test'] },
        { title: 'Control', activities: ['PLC I/O Cal.', 'HMI', 'Communication'] },
        { title: 'Sensors', activities: ['Temp Sensors', 'Feedback Signals'] }
      ]
    },
    {
      title: 'Surge Device',
      category: 'Surge Device',
      activities: [
        { title: 'Status', activities: ['Status Indicator', 'Visual Inspection'] },
        { title: 'Performance', activities: ['Response Time', 'Surge Capacity', 'Connections'] }
      ]
    }
  ],
  'mv-swgr': [
    {
      title: 'Vacuum CB',
      category: 'Vacuum CB',
      activities: [
        { title: 'Contact', activities: ['Contact Resist.', 'Dynamic Resistance'] },
        { title: 'Timing', activities: ['Timing Open-Close', 'Simultaneity'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Vacuum Integrity'] }
      ]
    },
    {
      title: 'Overcurrent',
      category: 'Overcurrent',
      activities: [
        { title: 'Pickup', activities: ['Pickup Test', 'Current Settings'] },
        { title: 'Timing', activities: ['Time Curve', 'Time Dial'] },
        { title: 'Communication', activities: ['Communication Test', 'Protocol Verification'] }
      ]
    },
    {
      title: 'Bus Section',
      category: 'Bus Section',
      activities: [
        { title: 'Interlock', activities: ['Interlock Check', 'Key System'] },
        { title: 'Busbar', activities: ['Busbar Tightness', 'Thermal Imaging'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Hi-Pot Test'] }
      ]
    },
    {
      title: 'VT',
      category: 'VT',
      activities: [
        { title: 'Ratio', activities: ['Ratio Test', 'Accuracy Test'] },
        { title: 'Polarity', activities: ['Polarity Check', 'Phase Angle'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Dielectric Strength'] }
      ]
    },
    {
      title: 'CT',
      category: 'CT',
      activities: [
        { title: 'Ratio', activities: ['Ratio Test', 'Error Test'] },
        { title: 'Polarity', activities: ['Polarity Check', 'Terminal Marking'] },
        { title: 'Burden', activities: ['Burden Test', 'Load Verification'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Secondary Circuit'] }
      ]
    }
  ],
  'hv-swgr': [
    {
      title: 'Distance',
      category: 'Distance',
      activities: [
        { title: 'Impedance', activities: ['Impedance Test', 'Reach Setting'] },
        { title: 'Zone Timing', activities: ['Zone 1 Time', 'Zone 2 Time', 'Zone 3 Time'] },
        { title: 'Directional', activities: ['Directional Test', 'Angle Settings'] },
        { title: 'Polarization', activities: ['Polarization Test', 'Memory Polarization'] }
      ]
    },
    {
      title: 'Earth Fault',
      category: 'Earth Fault',
      activities: [
        { title: 'Pickup', activities: ['Pickup Test', 'Threshold Setting'] },
        { title: 'Timing', activities: ['Time Delay', 'Curve Verification'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Ground Connection'] }
      ]
    },
    {
      title: 'SF6 CB',
      category: 'SF6 CB',
      activities: [
        { title: 'Gas', activities: ['SF6 Pressure', 'Gas Quality', 'Density Check'] },
        { title: 'Contact', activities: ['Contact Resist.', 'Main Contact Wear'] },
        { title: 'Timing', activities: ['Timing Open-Close', 'Simultaneity'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Dielectric Test'] }
      ]
    },
    {
      title: 'Disconnector',
      category: 'Disconnector',
      activities: [
        { title: 'Mechanical', activities: ['Contact Align.', 'Operation Test'] },
        { title: 'Safety', activities: ['Interlock Check', 'Position Indication'] },
        { title: 'Electrical', activities: ['Ins. Resist.', 'Contact Resistance'] }
      ]
    },
    {
      title: 'Earthing Switch',
      category: 'Earthing Switch',
      activities: [
        { title: 'Mechanical', activities: ['Contact Align.', 'Operation Test'] },
        { title: 'Safety', activities: ['Interlock Check', 'Position Indication'] },
        { title: 'Electrical', activities: ['Earth Resist.', 'Connection Test'] }
      ]
    },
    {
      title: 'CT-VT',
      category: 'CT-VT',
      activities: [
        { title: 'Ratio', activities: ['Ratio Test', 'Error Measurement'] },
        { title: 'Polarity', activities: ['Polarity Check', 'Phase Relationship'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Dielectric Test'] }
      ]
    },
    {
      title: 'Surge Arrester',
      category: 'Surge Arrester',
      activities: [
        { title: 'Leakage', activities: ['Leakage Current', 'Monitoring'] },
        { title: 'Counter', activities: ['Counter Check', 'Operation Count'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Ground Connection'] }
      ]
    }
  ],
  'dist-trafo': [
    {
      title: 'Winding',
      category: 'Winding',
      activities: [
        { title: 'Resistance', activities: ['Winding Resist.', 'Temperature Correction'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Polarization Index'] },
        { title: 'Ratio', activities: ['Turn Ratio', 'Phase Displacement'] },
        { title: 'Group', activities: ['Vector Group', 'Winding Configuration'] }
      ]
    },
    {
      title: 'Oil Test',
      category: 'Oil Test',
      activities: [
        { title: 'Electrical', activities: ['Dielectric Test', 'Breakdown Voltage'] },
        { title: 'Chemical', activities: ['Acidity Test', 'Moisture Content', 'Gas Analysis'] }
      ]
    },
    {
      title: 'Bushings',
      category: 'Bushings',
      activities: [
        { title: 'Visual', activities: ['Visual Inspect.', 'Oil Level Check'] },
        { title: 'Electrical', activities: ['Ins. Resist.', 'Power Factor Test'] },
        { title: 'Mechanical', activities: ['Tightness Check', 'Sealing Test'] }
      ]
    },
    {
      title: 'Cooling System',
      category: 'Cooling System',
      activities: [
        { title: 'Fans', activities: ['Fan Operation', 'Airflow Test'] },
        { title: 'Control', activities: ['Temperature Control', 'Startup Sequence'] },
        { title: 'Monitoring', activities: ['Alarm System', 'Sensor Verification'] }
      ]
    },
    {
      title: 'Tap Changer',
      category: 'Tap Changer',
      activities: [
        { title: 'Electrical', activities: ['Step Voltage', 'Contact Resistance'] },
        { title: 'Mechanical', activities: ['Mech. Operation', 'Transition Time'] },
        { title: 'Indication', activities: ['Position Indicator', 'Remote Signal'] }
      ]
    }
  ],
  'power-trafo': [
    {
      title: 'Winding Test',
      category: 'Winding Test',
      activities: [
        { title: 'Resistance', activities: ['Winding Resist.', 'Temperature Correction'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Polarization Index'] },
        { title: 'Ratio', activities: ['Turn Ratio', 'Phase Displacement'] },
        { title: 'Analysis', activities: ['Vector Group', 'SFRA', 'Frequency Response'] }
      ]
    },
    {
      title: 'Oil Analysis',
      category: 'Oil Analysis',
      activities: [
        { title: 'Gas', activities: ['DGA', 'Key Gas Method'] },
        { title: 'Chemical', activities: ['Acidity Test', 'Furan Analysis', 'PCB Test'] },
        { title: 'Physical', activities: ['Moisture Content', 'Interfacial Tension'] }
      ]
    },
    {
      title: 'Bushings HV',
      category: 'Bushings HV',
      activities: [
        { title: 'Electrical', activities: ['Tan Delta', 'Ins. Resist.'] },
        { title: 'Mechanical', activities: ['Oil Level', 'Visual Inspect.', 'Sealing'] }
      ]
    },
    {
      title: 'OLTC',
      category: 'OLTC',
      activities: [
        { title: 'Electrical', activities: ['Timing Test', 'Transition Resist.'] },
        { title: 'Mechanical', activities: ['Motor Drive', 'Operation Count'] },
        { title: 'Control', activities: ['Control System', 'Remote Operation'] }
      ]
    },
    {
      title: 'Cooling System',
      category: 'Cooling System',
      activities: [
        { title: 'Operation', activities: ['Fan/Pump Oper.', 'Flow Test'] },
        { title: 'Control', activities: ['Temperature Control', 'Stage Activation'] },
        { title: 'Monitoring', activities: ['Alarm System', 'Radiator Check', 'Efficiency'] }
      ]
    }
  ],
  'component': [
    {
      title: 'Motors',
      category: 'Motors',
      activities: [
        { title: 'Electrical', activities: ['Ins. Resist.', 'Winding Resist.', 'Current Test'] },
        { title: 'Mechanical', activities: ['Bearing Temp.', 'Vibration', 'Alignment'] }
      ]
    },
    {
      title: 'Batteries',
      category: 'Batteries',
      activities: [
        { title: 'Electrical', activities: ['Cell Voltage', 'Capacity Test', 'Discharge Test'] },
        { title: 'Maintenance', activities: ['Electrolyte Level', 'Terminal Tight.', 'Cleaning'] }
      ]
    },
    {
      title: 'Chargers',
      category: 'Chargers',
      activities: [
        { title: 'Electrical', activities: ['Output Voltage', 'Ripple Test', 'Load Test'] },
        { title: 'Functions', activities: ['Alarm System', 'Float/Boost Modes'] }
      ]
    },
    {
      title: 'Cables',
      category: 'Cables',
      activities: [
        { title: 'Insulation', activities: ['Ins. Resist.', 'Partial Discharge', 'VLF Test'] },
        { title: 'Mechanical', activities: ['Termination Check', 'Visual Inspection'] }
      ]
    },
    {
      title: 'Power Supplies',
      category: 'Power Supplies',
      activities: [
        { title: 'Electrical', activities: ['Output Voltage', 'Regulation', 'Ripple Test'] },
        { title: 'Performance', activities: ['Load Test', 'Efficiency Test'] }
      ]
    }
  ],
  'relay': [
    {
      title: 'Overcurrent',
      category: 'Overcurrent',
      activities: [
        { title: 'Pickup', activities: ['Pickup Test', 'Threshold Verification'] },
        { title: 'Curve', activities: ['Time Curve', 'Time Multiplier'] },
        { title: 'Communication', activities: ['Communication', 'Protocol Test'] },
        { title: 'Logging', activities: ['Event Record', 'Fault Playback'] }
      ]
    },
    {
      title: 'Differential',
      category: 'Differential',
      activities: [
        { title: 'Characteristic', activities: ['Slope Test', 'Threshold Test'] },
        { title: 'Stability', activities: ['Stability Test', 'Through Fault Test'] },
        { title: 'Current', activities: ['CT Balance', 'Current Matching'] },
        { title: 'Trip', activities: ['Trip Test', 'Trip Time'] }
      ]
    },
    {
      title: 'Distance',
      category: 'Distance',
      activities: [
        { title: 'Zone', activities: ['Zone Reach', 'Impedance Test'] },
        { title: 'Time', activities: ['Time Delay', 'Operation Time'] },
        { title: 'Direction', activities: ['Directional Test', 'Angle Check'] },
        { title: 'Stability', activities: ['Power Swing', 'Load Encroachment'] }
      ]
    },
    {
      title: 'Arc Flash',
      category: 'Arc Flash',
      activities: [
        { title: 'Detector', activities: ['Sensor Test', 'Sensitivity'] },
        { title: 'Trip', activities: ['Trip Time', 'Operation Time'] },
        { title: 'Light', activities: ['Light Intensity', 'Detection Range'] },
        { title: 'Backup', activities: ['Backup Function', 'Redundancy Test'] }
      ]
    },
    {
      title: 'Auxiliary',
      category: 'Auxiliary',
      activities: [
        { title: 'Contacts', activities: ['Contact Oper.', 'Contact Resistance'] },
        { title: 'Timing', activities: ['Timing Test', 'Latching Time'] },
        { title: 'Indication', activities: ['Flag Indicator', 'LED Test'] },
        { title: 'Coil', activities: ['Coil Voltage', 'Pickup Voltage'] }
      ]
    }
  ],
  'rmu': [
    {
      title: 'Load Break Switch',
      category: 'Load Break Switch',
      activities: [
        { title: 'Electrical', activities: ['Contact Resist.', 'Hi-Pot Test'] },
        { title: 'Mechanical', activities: ['Timing Oper.', 'Operating Force'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Dielectric Test'] },
        { title: 'Indication', activities: ['Mechanical Ind.', 'Position Check'] }
      ]
    },
    {
      title: 'Fuse Switch',
      category: 'Fuse Switch',
      activities: [
        { title: 'Fuses', activities: ['Fuse Rating', 'Continuity Test'] },
        { title: 'Trip', activities: ['Trip Function', 'Striker Pin Test'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Withstand Test'] },
        { title: 'Safety', activities: ['Interlock Check', 'Earth Function'] }
      ]
    },
    {
      title: 'Vacuum CB',
      category: 'Vacuum CB',
      activities: [
        { title: 'Electrical', activities: ['Contact Resist.', 'Hi-Pot Test'] },
        { title: 'Mechanical', activities: ['Timing Oper.', 'Travel Analysis'] },
        { title: 'Insulation', activities: ['Ins. Resist.', 'Vacuum Test'] },
        { title: 'Protection', activities: ['Trip Test', 'Relay Function'] }
      ]
    },
    {
      title: 'SF6 System',
      category: 'SF6 System',
      activities: [
        { title: 'Gas', activities: ['Gas Pressure', 'Leak Test', 'Gas Quality'] },
        { title: 'Monitoring', activities: ['Density Switch', 'Pressure Gauge'] },
        { title: 'Warning', activities: ['Alarm Function', 'Lockout Test'] }
      ]
    },
    {
      title: 'Earthing',
      category: 'Earthing',
      activities: [
        { title: 'Electrical', activities: ['Earth Resist.', 'Continuity Test'] },
        { title: 'Mechanical', activities: ['Interlock Check', 'Contact Align.'] }
      ]
    }
  ],
  'low-current': [
    {
      title: 'Fire Alarm',
      category: 'Fire Alarm',
      activities: [
        { title: 'Detection', activities: ['Detector Test', 'Sensitivity Test'] },
        { title: 'Control', activities: ['Panel Function', 'Zone Test'] },
        { title: 'Power', activities: ['Battery Backup', 'Power Supply'] },
        { title: 'Operation', activities: ['Alarm Test', 'Notification Devices'] }
      ]
    },
    {
      title: 'CCTV',
      category: 'CCTV',
      activities: [
        { title: 'Cameras', activities: ['Camera Func.', 'Focus/Zoom'] },
        { title: 'Storage', activities: ['Recording Test', 'Retention Period'] },
        { title: 'Software', activities: ['Motion Detection', 'Analytics'] },
        { title: 'Access', activities: ['Remote Access', 'User Permissions'] }
      ]
    },
    {
      title: 'PA System',
      category: 'PA System',
      activities: [
        { title: 'Audio', activities: ['Speaker Test', 'Audio Quality'] },
        { title: 'Areas', activities: ['Coverage Test', 'Zone Control'] },
        { title: 'Emergency', activities: ['Emergency Mode', 'Priority Override'] }
      ]
    },
    {
      title: 'Access Control',
      category: 'Access Control',
      activities: [
        { title: 'Readers', activities: ['Card Reader', 'Biometric Test'] },
        { title: 'Doors', activities: ['Electric Lock', 'Door Status'] },
        { title: 'Override', activities: ['Override Func.', 'Emergency Release'] },
        { title: 'Security', activities: ['Alarm Function', 'Anti-Passback'] }
      ]
    },
    {
      title: 'BMS',
      category: 'BMS',
      activities: [
        { title: 'Points', activities: ['Control Point', 'Field Device Test'] },
        { title: 'Sequences', activities: ['Automation Seq.', 'Schedule Test'] },
        { title: 'Monitoring', activities: ['Alarm Function', 'Trend Logs'] },
        { title: 'Network', activities: ['Communication', 'Protocol Test'] }
      ]
    }
  ]
};

// Function to create MDX files
function createMdxFile(system: string, item: MosCategory): void {
  const dirPath = path.join('content', 'mos', system);
  
  // Sanitize the filename to replace slashes, spaces, and special characters with hyphens
  const sanitizedTitle = item.title.toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // Replace any non-alphanumeric characters with hyphens
    .replace(/-+/g, '-')         // Replace multiple hyphens with a single hyphen
    .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens
  
  const filePath = path.join(dirPath, `${sanitizedTitle}.mdx`);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Create MDX content with all activities
  let activitiesContent = '';
  
  // Process each activities group
  item.activities.forEach((activityGroup) => {
    activitiesContent += `\n## ${activityGroup.title}\n\n`;
    
    // Add individual activities as a list within the group
    activityGroup.activities.forEach((activity) => {
      activitiesContent += `- ${activity}\n`;
    });
    
    activitiesContent += '\n';
  });
  
  // Create front matter
  const frontmatter = `---
title: "${item.title}"
system: "${system.toUpperCase().replace(/-/g, ' ')}"
category: "${item.category}"
description: "Maintenance activities for ${item.title} in ${system.toUpperCase().replace(/-/g, ' ')} system"
---

# ${item.title}

${activitiesContent}
`;
  
  // Write the file
  fs.writeFileSync(filePath, frontmatter);
  console.log(`Created ${filePath}`);
}

// Generate MDX files for all systems and items
function generateMosContent(): void {
  systemData.forEach((system: string) => {
    const items = itemData[system] || [];
    items.forEach((item: MosCategory) => {
      createMdxFile(system, item);
    });
  });
  
  console.log('MOS content generation complete!');
}

// Run the generation
generateMosContent(); 