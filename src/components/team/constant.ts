import { TeamMember } from "./types";

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "TM001",
    firstName: "John",
    lastName: "Doe",
    src: "/team/john-doe.jpg",
    alt: "John Doe",
    phone: "+1234567890",
    mail: "john.doe@company.com",
    location: "In RTCC",
    width: 105,
    height: 105,
    iqama: "/documents/iqama-john.pdf",
    eligible: ["Project Manager", "Manager", "Operations"]
  },
  {
    id: "TM002",
    firstName: "Jane",
    lastName: "Smith",
    src: "/team/jane-smith.jpg",
    alt: "Jane Smith",
    phone: "+1234567891",
    mail: "jane.smith@company.com",
    location: "Remote",
    width: 105,
    height: 105,
    iqama: "/documents/iqama-jane.pdf",
    eligible: ["Developer", "Backend", "DevOps"]
  },
  {
    id: "TM003",
    firstName: "Ahmed",
    lastName: "Hassan",
    src: "/team/ahmed-hassan.jpg",
    alt: "Ahmed Hassan",
    phone: "+1234567892",
    mail: "ahmed.hassan@company.com",
    location: "In RTCC",
    width: 105,
    height: 105,
    iqama: "/documents/iqama-ahmed.pdf",
    eligible: ["Designer", "UI/UX", "Frontend"]
  }
];

export const TEAM_SKILLS = [
  "Manager",
  "Developer",
  "Designer",
  "QA",
  "DevOps",
  "Data Scientist",
  "Product Manager",
  "Project Manager",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Legal",
  "Operations",
  "Customer Support",
  "Content Writer",
  "UI/UX",
  "Backend",
  "Frontend",
  "Full Stack"
];

export const TEAM_LOCATIONS = [
  { value: "In RTCC", label: "In RTCC" },
  { value: "Remote", label: "Remote" },
  { value: "Field Work", label: "Field Work" },
  { value: "On Leave", label: "On Leave" }
]; 