const fs = require('fs')
const path = require('path')

// This is a copy of the sidebar data structure to avoid import issues
const sidebarData = [
  {
    item: "Relay",
    subitems: [
      {
        name: "General",
        activities: [
          "Sec. Injection",
          "Pri. Injection",
          "Settings Verif.",
          "Communication",
          "Contact Resist.",
        ],
      },
      {
        name: "Overcurrent",
        activities: [
          "Pickup",
          "Timing",
          "Char. Curve",
          "Ins. Resist.",
          "Burden",
        ],
      },
      {
        name: "Differential",
        activities: [
          "Rat/Ph Angle",
          "Slope Char.",
          "Harm. Restr.",
          "Ins. Resist.",
          "Functional",
        ],
      },
      {
        name: "Distance",
        activities: ["Impedance", "Zone Timing", "Directional", "Polarization"],
      },
      {
        name: "Earth Fault",
        activities: ["Pickup", "Timing", "Ins. Resist."],
      },
      {
        name: "Directional OC",
        activities: ["Discrimination", "Pickup", "Timing"],
      },
      {
        name: "Underfreq.",
        activities: ["Pickup", "Timing", "Change Rate"],
      },
      {
        name: "Undervolt.",
        activities: ["Pickup", "Timing"],
      },
      {
        name: "Motor Prot.",
        activities: [
          "Starting Time",
          "Stall Prot.",
          "Thermal OL",
          "Unbal./Ph Loss",
        ],
      },
      {
        name: "Trafo Diff.",
        activities: ["CT Polarity", "Inrush Restraint", "Bias Charact."],
      },
      {
        name: "Gen. Prot.",
        activities: [
          "Exc. Loss",
          "Reverse Power",
          "Stator EF",
        ],
      },
      {
        name: "Recloser",
        activities: [
          "Reclose Interval",
          "No. of Reclose",
          "Lockout",
        ],
      },
      {
        name: "Synchronizing",
        activities: ["Volt. Matching", "Phase Angle", "Freq. Matching"],
      },
      {
        name: "Check",
        activities: ["Voltage Presence", "Synch. Check"],
      },
    ],
  },
  {
    item: "Component",
    subitems: [
      {
        name: "Circuit Breaker",
        activities: [
          "Contact Resist.",
          "Timing Open-Close",
          "Ins. Resist.",
          "Coil Pickup",
          "SF6 Gas Press.-Purity",
          "Vacuum Integrity",
          "Mech. Operation",
        ],
      },
      {
        name: "Lockout Relay",
        activities: [
          "Func. Trip-Reset",
          "Contact Resist.",
          "Coil Pickup",
        ],
      },
      {
        name: "Contactor",
        activities: [
          "Pickup-Dropout",
          "Contact Resist.",
          "Ins. Resist.",
          "Mech. Endurance",
        ],
      },
      {
        name: "MCB",
        activities: [
          "Trip Time SC-OL",
          "Ins. Resist.",
          "Mech. Operation",
        ],
      },
      {
        name: "Disconnect Switch",
        activities: [
          "Contact Resist.",
          "Ins. Resist.",
          "Mech. Interlock",
        ],
      },
      {
        name: "Current Transformer",
        activities: [
          "Ratio",
          "Polarity Verif.",
          "Burden",
          "Ins. Resist.",
          "Sat. Curve",
        ],
      },
      {
        name: "Voltage Transformer",
        activities: [
          "Ratio",
          "Polarity Verif.",
          "Burden",
          "Ins. Resist.",
          "Sat. Curve",
        ],
      },
      {
        name: "Metering Devices",
        activities: [
          "Acc. Calibration",
          "Func. Verif.",
        ],
      },
      {
        name: "Surge Arrester",
        activities: [
          "Ins. Resist.",
          "Leak. Current",
        ],
      },
    ],
  },
  {
    item: "Transformer",
    subitems: [
      {
        name: "Power Transformer",
        activities: [
          "Ins. Resist.",
          "Wind. Resist.",
          "Turns Ratio",
          "Mag. Current",
          "Dielec. Absorp.",
          "Diss. Gas Analysis",
          "Sweep Freq. Resp.",
        ],
      },
      {
        name: "Bushing",
        activities: [
          "Tan Delta",
          "Cap. Measurement",
          "Ins. Resist.",
        ],
      },
      {
        name: "Tap Changer (OLTC/De-Energized)",
        activities: [
          "Contact Resist.",
          "Timing Op.",
          "Func. Sequence",
          "Oil Quality",
        ],
      },
      {
        name: "Cooling System",
        activities: [
          "Pump-Fan Op.",
          "Oil Flow Verif.",
          "Temp. Control",
        ],
      },
      {
        name: "Protection Devices",
        activities: [
          "Buchholz Alarm",
          "Press. Relief ",
          "Wind. Temp. Alarm",
        ],
      },
      {
        name: "Neutral Grounding",
        activities: [
          "Ground Resist.",
          "Continuity",
        ],
      },
      {
        name: "Surge Arrester",
        activities: [
          "Leak. Current",
          "Ins. Resist.",
        ],
      },
      {
        name: "Control Panel",
        activities: [
          "Alarm Indic.",
          "Trip Circuit",
          "Volt. Regulation",
        ],
      },
      {
        name: "Oil Management",
        activities: [
          "Moist. Content",
          "Dielec. Strength",
          "Acidity",
        ],
      },
      {
        name: "General",
        activities: [
          "Visual Insp.",
          "Tight. Check",
          "Polarity Verif.",
        ],
      },
    ],
  },
  {
    item: "Low Voltage",
    subitems: [
      {
        name: "Distribution Panel",
        activities: [
          "Ins. Resist.",
          "Busbar Tightness",
          "Volt. Stability",
          "Phase Seq. Verif.",
          "Func. Breaker-RCD Coord.",
        ],
      },
      {
        name: "MCCB",
        activities: [
          "Trip Time SC-OL",
          "Ins. Resist.",
          "Contact Resist.",
          "Mech. Operation",
        ],
      },
      {
        name: "ACB",
        activities: [
          "Contact Resist.",
          "Timing Open-Close",
          "Ins. Resist.",
          "Trip Unit Cal.",
        ],
      },
      {
        name: "Capacitor Bank",
        activities: [
          "Cap. Measurement",
          "Harm. Dist. Analysis",
          "Switch. Transient",
          "Ins. Resist.",
        ],
      },
      {
        name: "UPS",
        activities: [
          "Battery Capacity",
          "Trans. Time Grid-Batt.",
          "Out. Volt. Stability",
          "Harm. Analysis",
        ],
      },
      {
        name: "Earth Fault",
        activities: [
          "Earth Fault Pickup",
          "Trip Timing",
          "Ins. Resist.",
        ],
      },
      {
        name: "Distribution Board",
        activities: [
          "Circuit ID",
          "Load Bal. Verif.",
          "Func. MCB-RCD Op.",
        ],
      },
      {
        name: "Motor Control Center",
        activities: [
          "Starter Cont. Op.",
          "OL Relay Cal.",
          "Phase Loss Det.",
        ],
      },
      {
        name: "Surge Device",
        activities: [
          "Leak. Current",
          "Ins. Resist.",
          "Func. Surge Suppr.",
        ],
      },
      {
        name: "Metering",
        activities: [
          "Acc. Cal.",
          "Func. V-I-PF Meas.",
        ],
      },
      {
        name: "Earthing System",
        activities: [
          "Ground Resist.",
          "Cont. Equip. Bonding",
        ],
      },
    ],
  },
  {
    item: "Other",
    subitems: [
      {
        name: "SCADA",
        activities: [
          "P2P Comm.",
          "Time Sync.",
          "Failover Redund.",
          "Alarm-Trip Integ.",
        ],
      },
      {
        name: "RMU (Ring Main Unit)",
        activities: [
          "Ins. Resist.",
          "Timing Open-Close",
          "Contact Resist.",
          "Gas Pressure (for SF6 RMUs)",
          "Func. Interlock",
        ],
      },
      {
        name: "Fault Recorder",
        activities: [
          "Time Sync",
          "Event Seq.",
          "Data Retr.",
          "Storage Cap.",
        ],
      },
      {
        name: "Battery Bank",
        activities: [
          "Cap. Discharge",
          "Volt. Stability",
          "Float-Ch. Eff.",
          "Gnd. Fault Det.",
        ],
      },
      {
        name: "DC-AC Charger",
        activities: [
          "Eff. Float-Boost",
          "Out. Volt. Stab.",
          "Harm. Dist.",
          "OL Prot.",
        ],
      },
      {
        name: "Cable",
        activities: [
          "Ins. Resist.",
          "Continuity",
          "Part. Discharge",
          "Therm. Imaging",
        ],
      },
    ],
  },
];

// Helper function to convert a string to a slug
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

// Create the content/docs directory if it doesn't exist
const docsDir = path.join(process.cwd(), 'content', 'docs')
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true })
}

// Create an index MDX file
const indexContent = `# Documentation

Welcome to the documentation. Please select a topic from the sidebar.

This documentation is organized by categories:

${sidebarData.map((item: any) => `- **${item.item}**: ${item.subitems.length} sections`).join('\n')}
`

fs.writeFileSync(path.join(docsDir, 'index.mdx'), indexContent)
console.log('Generated: index.mdx')

// Generate MDX files for each item, subitem, and activity
sidebarData.forEach((itemData: any) => {
  const itemSlug = toSlug(itemData.item)
  const itemDir = path.join(docsDir, itemSlug)
  
  // Create directory for the item if it doesn't exist
  if (!fs.existsSync(itemDir)) {
    fs.mkdirSync(itemDir, { recursive: true })
  }
  
  // Create MDX file for the item
  const itemContent = `# ${itemData.item}

This section covers information about ${itemData.item}.

## Sections

${itemData.subitems.map((subitem: any) => `- [${subitem.name}](/docs/${itemSlug}/${toSlug(subitem.name)})`).join('\n')}
`
  
  fs.writeFileSync(path.join(itemDir, 'index.mdx'), itemContent)
  console.log(`Generated: ${itemSlug}/index.mdx`)
  
  // Process each subitem
  itemData.subitems.forEach((subitem: any) => {
    const subitemSlug = toSlug(subitem.name)
    const subitemDir = path.join(itemDir, subitemSlug)
    
    // Create directory for the subitem if it doesn't exist
    if (!fs.existsSync(subitemDir)) {
      fs.mkdirSync(subitemDir, { recursive: true })
    }
    
    // Create MDX file for the subitem
    const subitemContent = `# ${subitem.name}

This section covers information about ${subitem.name} under ${itemData.item}.

## Activities

${subitem.activities.map((activity: string) => `- [${activity}](/docs/${itemSlug}/${subitemSlug}/${toSlug(activity)})`).join('\n')}
`
    
    fs.writeFileSync(path.join(subitemDir, 'index.mdx'), subitemContent)
    console.log(`Generated: ${itemSlug}/${subitemSlug}/index.mdx`)
    
    // Process each activity
    subitem.activities.forEach((activity: string) => {
      const activitySlug = toSlug(activity)
      const activityContent = `# ${activity}

This is detailed documentation about ${activity} in the ${subitem.name} section of ${itemData.item}.

## Overview

Add your documentation content here. This is a placeholder for the actual documentation.

## Examples

Example content can be added here.

\`\`\`typescript
// Example code
function example() {
  console.log("This is an example for ${activity}");
}
\`\`\`

## Related Activities

${subitem.activities
  .filter((a: string) => a !== activity)
  .map((a: string) => `- [${a}](/docs/${itemSlug}/${subitemSlug}/${toSlug(a)})`)
  .join('\n')}
`
      
      fs.writeFileSync(path.join(subitemDir, `${activitySlug}.mdx`), activityContent)
      console.log(`Generated: ${itemSlug}/${subitemSlug}/${activitySlug}.mdx`)
    })
  })
})

console.log('\nAll documentation files generated successfully!') 