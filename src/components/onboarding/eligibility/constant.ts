export const eligibility = [
  // Protection Categories
  "Schema",
  "OC Relay",
  "Diff. Relay",
  "Distance Relay",
  "Direct. OC Relay",
  "Underfreq Relay",
  "Undervolt Relay",
  "Trafo Diff. Relay",
  "Recloser Relay",


  // Equipment Categories
  "VCB",
  "Lockout Relay",
  "Contactor",
  "Disconnect Switch",
  "CT",
  "PT",
  "Metering",
  "Surge Arrester",
  "Capacitor Bank",
  "UPS",
  "Distribution Board",
  "Earthing System",

  // Transformer Categories
  "Power Trafo",
  "Dist. Trafo",
  

  // Low Current Categories
  "SCADA",
  "Fault Recorder",
  "Battery Bank"
] as const;

export type Eligibility = typeof eligibility[number]; 