export interface Kit {
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

export interface KitDetailProps {
  kit: Kit;
  onClose?: () => void;
}

export interface KitCardProps {
  src: string;
  alt: string;
  width?: number;
  status?: number;
  id?: string;
  bg?: string;
  onSelect?: (id: string) => void;
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