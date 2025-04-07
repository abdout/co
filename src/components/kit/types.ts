export interface Kit {
  id: string;
  name?: string;
  picture?: string;
  images?: string[];
  accessories?: string[];
  calibration?: string;
  calibrationIssue?: string;
  calibrationDue?: Date;
  software?: string;
  datasheet?: string;
  manual?: string;
  status?: string;
  under?: string;
  location?: string;
  price?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface KitDetailProps {
  kit: Kit;
  onClose?: () => void;
}

export interface KitCardProps {
  id: string;
  name?: string;
  model?: string;
  status?: string;
  picture?: string;
  price?: string;
  onSelect?: (id: string) => void;
  kit: Kit;
  onExpand: (kit: Kit) => void;
}

export interface KitFormValues {
  id: string;
  name: string;
  src: string;
  alt: string;
  width?: number;
  bg?: string;
  calibration?: string;
  datasheet?: string;
  manual?: string;
  status?: string;
  under?: string;
  location?: string;
  price?: string;
}

export interface KitFormProps {
  kitToEdit?: Kit | null;
  onSuccess?: () => Promise<void>;
  onClose?: () => void;
} 