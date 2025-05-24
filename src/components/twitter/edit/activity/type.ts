export interface ActivityUser {
  id: string;
  partyMember?: boolean;
  partyName?: string | null;
  partyStartDate?: Date | null;
  partyEndDate?: Date | null;
  unionMember?: boolean;
  unionName?: string | null;
  unionStartDate?: Date | null;
  unionEndDate?: Date | null;
  ngoMember?: boolean;
  ngoName?: string | null;
  ngoActivity?: string | null;
  clubMember?: boolean;
  clubName?: string | null;
  clubType?: string | null;
  voluntaryMember?: boolean;
  voluntaryName?: string | null;
  voluntaryRole?: string | null;
  voluntaryStartDate?: Date | null;
  voluntaryEndDate?: Date | null;
  skills?: string[];
  interests?: string[];
}

export interface ActivityFormProps {
  user: ActivityUser;
}

export interface Option {
  label: string;
  value: string;
}

export type DateRange = {
  from?: Date;
  to?: Date;
}; 