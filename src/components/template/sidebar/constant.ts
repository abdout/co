export const sidebarData = [
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
