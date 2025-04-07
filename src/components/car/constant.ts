import { Car } from "./types";

export const CARS: Car[] = [
  {
    id: "car1",
    name: "Accent",
    src: "/car/accentdark.png",
    alt: "Accent",
    sim: "abc",
    petrol: 700,
    oil: "Good",
    history: "Regular maintenance",
    status: "Ready",
    under: "Osman",
    km: 25875,
    width: 165,
    licence: "valid",
    penalty: "clear"
  },
  {
    id: "car2",
    name: "Accent",
    src: "/car/accentgray.png",
    alt: "Accent",
    sim: "abc",
    petrol: 700,
    oil: "Good",
    history: "Regular maintenance",
    status: "Ready",
    under: "Osman",
    km: 25875,
    width: 165,
    licence: "valid",
    penalty: "clear"
  },
  {
    id: "car3",
    name: "Accent",
    src: "/car/accentwhite.png",
    alt: "Accent",
    sim: "abc",
    petrol: 700,
    oil: "Good",
    history: "Regular maintenance",
    status: "Ready",
    under: "Osman",
    km: 25875,
    width: 140,
    licence: "valid",
    penalty: "clear"
  },
  {
    id: "car4",
    name: "Accent",
    src: "/car/accentwhite.png",
    alt: "Accent",
    sim: "abc",
    petrol: 700,
    oil: "Good",
    history: "Regular maintenance",
    status: "Ready",
    under: "Osman",
    km: 25875,
    width: 140,
    licence: "valid",
    penalty: "clear"
  },
  {
    id: "car5",
    name: "Sunny",
    src: "/car/sunny.png",
    alt: "Sunny",
    sim: "abc",
    petrol: 700,
    oil: "Good",
    history: "Regular maintenance",
    status: "Ready",
    under: "Osman",
    km: 25875,
    width: 140,
    licence: "valid",
    penalty: "clear"
  }
];

export const CAR_STATUS_OPTIONS = [
  { value: 'Ready', label: 'Ready' },
  { value: 'In Use', label: 'In Use' },
  { value: 'Maintenance', label: 'Under Maintenance' },
  { value: 'Repair', label: 'Under Repair' },
  { value: 'Unavailable', label: 'Unavailable' }
];

export const carDocuments = [
  { icon: "ph:file-text", label: "License" },
  { icon: "ph:clipboard-text", label: "History" },
  { icon: "ph:gas-pump", label: "Fuel" },
  { icon: "ph:oil-can", label: "Oil" },
  { icon: "ph:gauge", label: "Mileage" },
  { icon: "ph:car", label: "Insurance" },
  { icon: "ph:wrench", label: "Service" },
  { icon: "ph:warning", label: "Penalties" }
]; 