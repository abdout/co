import React from 'react';
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { InformationSchema } from "./validation";

interface BioProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
}

const Bio = ({ register, errors }: BioProps) => {
  return (
    <div className="flex flex-col mt-6">
      <Input
        id="bio"
        placeholder="Bio"
        {...register('bio')}
      />
      {errors.bio && (
        <span className="text-red-500 text-sm">{errors.bio.message}</span>
      )}
    </div>
  );
};

export default Bio; 