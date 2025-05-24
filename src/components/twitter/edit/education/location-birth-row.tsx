import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import Location from "./location";
import BirthInfo from "./birthdate";

interface LocationBirthRowProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
}

const LocationBirthRow = ({
  register,
  errors,
  setValue
}: LocationBirthRowProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Location 
          register={register}
          errors={errors}
          setValue={setValue}
        />
      </div>
      <div>
        <BirthInfo
          register={register}
          errors={errors}
          setValue={setValue}
        />
      </div>
    </div>
  );
};

export default LocationBirthRow; 