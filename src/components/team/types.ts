import { z } from "zod";
import { teamFormSchema } from "./validation";

export type TeamMember = {
  id: string;
  firstName: string;
  lastName: string;
  src: string;
  alt: string;
  phone?: string;
  mail?: string;
  location?: string;
  width: number;
  height: number;
  iqama?: string;
  eligible?: string[];
};

export interface TeamCardProps {
  member: TeamMember;
  onClick?: (member: TeamMember) => void;
  onRightClick?: (e: React.MouseEvent, id: string) => void;
  contextMenu?: {
    x: number;
    y: number;
    memberId: string | null;
  };
  onCloseContextMenu?: () => void;
  onMemberDeleted?: () => Promise<void>;
}

export interface TeamDetailProps {
  team: TeamMember;
  onClose?: () => void;
}

export interface TeamFormProps {
  memberToEdit?: TeamMember | null;
  onSuccess?: () => Promise<void>;
  onClose?: () => void;
}

export type TeamFormValues = z.infer<typeof teamFormSchema>;

export interface TeamListProps {
  onSelect?: (member: TeamMember) => void;
  showAddButton?: boolean;
  onAddSuccess?: () => Promise<void>;
} 