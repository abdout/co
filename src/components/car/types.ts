export interface Car {
  id: string;
  name: string;
  src: string;
  alt: string;
  sim?: string;
  petrol?: number;
  oil?: string;
  history?: string;
  status?: string;
  under?: string;
  km?: number;
  width?: number;
  licence?: string;
  penalty?: string;
}

export interface CarDetailProps {
  car: Car;
  onClose?: () => void;
}

export interface CarCardProps {
  src: string;
  alt: string;
  width?: number;
  status?: number;
  id?: string;
  bg?: string;
  onSelect?: (id: string) => void;
}

export interface CarFormValues {
  id: string;
  name: string;
  src: string;
  alt: string;
  sim?: string;
  petrol?: number;
  oil?: string;
  history?: string;
  status?: string;
  under?: string;
  km?: number;
  width?: number;
  licence?: string;
  penalty?: string;
}

export interface CarFormProps {
  carToEdit?: Car | null;
  onSuccess?: () => Promise<void>;
  onClose?: () => void;
} 