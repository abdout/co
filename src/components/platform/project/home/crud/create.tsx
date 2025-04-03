"use client";
import { FC, FormEvent, useState, useEffect } from "react";
import { useProject } from "@/provider/project";
import { lv, mv, hv, ev, LvSwgr, HvSwgr, EvSwgr, LvTrafo, HvTrafo, EvTrafo, LvCable, HvCable, EvCable, LvRmu, HvRmu, EvRmu } from "@/constant/project/item";
import { useCreate } from "@/provider/create";
import { toast } from "sonner";
import General from "../step/general";
import ItemStep from "../step/item";
import MvStep from "../step/mv";
import LvStep from "../step/lv";
import HvStep from "../step/hv";
import EvStep from "../step/ev";
import { useStep } from "@/lib/step";
import Submit from "../../../../atom/button/submit";
import Indicator from "../step/indicator";
import PrevNextButtons from "../step/next";
import { DialogFooter } from "@/components/ui/dialog";
import { Project } from '@/components/platform/project/types';
import { createProject, updateProject } from "@/components/platform/project/actions";

interface CreateProps {
  projectToEdit?: Project | null;
  onSuccess?: () => void;
}

const Create: FC<CreateProps> = ({ projectToEdit, onSuccess }) => {
  const { fetchProjects } = useProject();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    customer, setCustomer, 
    location, setLocation, 
    consultant, setConsultant, 
    client, setClient, 
    voltages, setVoltages, 
    lvOptions, setLvOptions, 
    mvOptions, setMvOptions, 
    hvOptions, setHvOptions, 
    evOptions, setEvOptions, 
    lvSwgr, setLvSwgr, 
    lvTrafo, setLvTrafo, 
    lvRmu, setLvRmu, 
    lvCable, setLvCable, 
    mvSwgr, setMvSwgr, 
    mvTrafo, setMvTrafo, 
    mvRmu, setMvRmu, 
    mvCable, setMvCable, 
    hvSwgr, setHvSwgr, 
    hvTrafo, setHvTrafo, 
    hvRmu, setHvRmu, 
    hvCable, setHvCable, 
    evSwgr, setEvSwgr, 
    evTrafo, setEvTrafo, 
    evRmu, setEvRmu, 
    evCable, setEvCable 
  } = useCreate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const { step, nextStep, prevStep } = useStep(voltages, currentStep, setCurrentStep);

  // Load project data if editing
  useEffect(() => {
    if (projectToEdit) {
      // Populate form fields based on the project being edited
      if (projectToEdit.customer) {
        setCustomer(projectToEdit.customer);
      }
      if (projectToEdit.location) {
        setLocation(projectToEdit.location);
      }
      if (projectToEdit.consultant) {
        setConsultant(projectToEdit.consultant);
      }
      if (projectToEdit.client) {
        setClient(projectToEdit.client);
      }
      if (projectToEdit.voltages) {
        setVoltages(projectToEdit.voltages);
      }
      // Add more fields as needed
    }
  }, [projectToEdit, setCustomer, setLocation, setConsultant, setClient, setVoltages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const projectData = {
        customer,
        location,
        consultant,
        client,
        voltages,
        lvOptions: { lvSwgr, lvTrafo, lvCable, lvRmu },
        mvOptions: { mvSwgr, mvTrafo, mvCable, mvRmu },
        hvOptions: { hvSwgr, hvTrafo, hvCable, hvRmu },
        evOptions: { evSwgr, evTrafo, evCable, evRmu }
      };

      let result;
      
      if (projectToEdit && projectToEdit._id) {
        // Update existing project
        result = await updateProject(projectToEdit._id, projectData);
      } else {
        // Create new project
        result = await createProject(projectData);
      }

      if (result.success) {
        toast.success(projectToEdit ? "Project updated successfully" : "Project created successfully");
        
        // Refresh the project list
        await fetchProjects();
        
        // Call the success callback
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.message || "Failed to save project");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 2 + step.length; // 2 initial steps + selected voltage steps

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 h-full">
        <div className="flex-1">
          <div className="w-full">
            {currentStep === 1 && (
              <General
                customer={customer}
                setCustomer={setCustomer}
                location={location}
                setLocation={setLocation}
                consultant={consultant}
                setConsultant={setConsultant}
                client={client}
                setClient={setClient}
              />
            )}

            {currentStep === 2 && (
              <ItemStep
                voltages={voltages}
                setVoltages={setVoltages}
                lv={lv}
                setLvOptions={setLvOptions}
                mv={mv}
                setMvOptions={setMvOptions}
                hv={hv}
                setHvOptions={setHvOptions}
                ev={ev}
                setEvOptions={setEvOptions}
              />
            )}

            {step[currentStep - 3] === "LV" && (
              <LvStep
                lvOptions={lvOptions}
                LvSwgr={LvSwgr}
                setLvSwgr={setLvSwgr}
                LvTrafo={LvTrafo}
                setLvTrafo={setLvTrafo}
                LvCable={LvCable}
                setLvCable={setLvCable}
                LvRmu={LvRmu}
                setLvRmu={setLvRmu}
              />
            )}

            {step[currentStep - 3] === "MV" && (
              <MvStep
                mvOptions={mvOptions}
                setMvSwgr={setMvSwgr}
                setMvTrafo={setMvTrafo}
                setMvCable={setMvCable}
                setMvRmu={setMvRmu}
              />
            )}

            {step[currentStep - 3] === "HV" && (
              <HvStep
                hvOptions={hvOptions}
                HvSwgr={HvSwgr}
                setHvSwgr={setHvSwgr}
                HvTrafo={HvTrafo}
                setHvTrafo={setHvTrafo}
                HvCable={HvCable}
                setHvCable={setHvCable}
                HvRmu={HvRmu}
                setHvRmu={setHvRmu}
              />
            )}

            {step[currentStep - 3] === "EV" && (
              <EvStep
                evOptions={evOptions}
                EvSwgr={EvSwgr}
                setEvSwgr={setEvSwgr}
                EvTrafo={EvTrafo}
                setEvTrafo={setEvTrafo}
                EvCable={EvCable}
                setEvCable={setEvCable}
                EvRmu={EvRmu}
                setEvRmu={setEvRmu}
              />
            )}
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="w-full flex justify-center pb-6">
            <Indicator totalSteps={totalSteps} currentStep={currentStep} />
          </div>
          
          <DialogFooter className="flex items-center justify-between gap-4 border-t pt-4">
            <PrevNextButtons
              currentStep={currentStep}
              totalSteps={totalSteps}
              prevStep={prevStep}
              nextStep={nextStep}
            />
            
            {currentStep === totalSteps && (
              <Submit 
                label={projectToEdit ? "Update Project" : "Create Project"} 
                disabled={isSubmitting}
              />
            )}
          </DialogFooter>
        </div>
      </form>
    </div>
  );
};

export default Create;
