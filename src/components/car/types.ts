export interface Car {
  id: string;
  name?: string | null;
  images?: string[];
  sim?: string | null;
  petrol?: number | null;
  oil?: string | null;
  history?: string | null;
  status?: string | null;
  under?: string | null;
  km?: number | null;
  licence?: string | null;
  penalty?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CarDetailProps {
  car: Car;
  onClose?: () => void;
}

export interface CarCardProps {
  id: string;
  name?: string;
  status?: string;
  images?: string[];
  onSelect?: (id: string) => void;
  car: Car;
  onExpand: (car: Car) => void;
}

export interface CarFormValues {
  id: string;
  name: string;
  images?: string[];
  sim?: string | null;
  petrol?: number | null;
  oil?: string | null;
  history?: string | null;
  status?: string | null;
  under?: string | null;
  km?: number | null;
  licence?: string | null;
  penalty?: string | null;
}

export interface CarFormProps {
  carToEdit?: Car | null;
  onSuccess?: () => Promise<void>;
  onClose?: () => void;
} 