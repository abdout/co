import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitProps {
  label: string;
}

const Submit: React.FC<SubmitProps> = ({ label }) => {
  return (
    <Button
      type="submit"
      className="tracking-widest"
    >
      {label}
    </Button>
  );
};

export default Submit;
