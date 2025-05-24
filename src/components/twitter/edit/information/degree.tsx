'use client';
import { useEffect, useCallback } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import Student from "./student";
import Diploma from "./diploma";
import Bachelor from "./bachelor";
import Master from "./master";
import PhD from "./phd";
import Professor from "./professor";
import Occupation from "./occupation";
import { useAutoScroll } from "./use-auto-scroll";

interface DegreeProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
  educationLevel: string;
}

const Degree = ({
  register,
  errors,
  setValue,
  educationLevel,
}: DegreeProps) => {
  const { scrollToNextRow } = useAutoScroll();
  
  // Define the sequence of degrees for auto-scrolling
  const degreeSequence = {
    'professor': 'phd',
    'phd': 'master',
    'master': 'bachelor',
    'bachelor': 'occupation',
    'diploma': 'occupation'
  };
  
  // Handle degree completion with improved logging
  const handleDegreeCompletion = useCallback((degreeType: string) => {
    console.log('🔍 DEBUG: Degree completion triggered for:', degreeType);
    
    // Get the next section to scroll to based on the degree sequence
    const nextDegree = degreeSequence[degreeType as keyof typeof degreeSequence];
    
    if (nextDegree) {
      // Create the section ID and verify it exists in the DOM
      const sectionId = `section-${nextDegree}`;
      const targetElement = document.getElementById(sectionId);
      
      console.log(`🔍 DEBUG: Next degree to scroll to: ${nextDegree}`);
      console.log(`🔍 DEBUG: Target section ID: ${sectionId}`);
      console.log(`🔍 DEBUG: Target element exists: ${!!targetElement}`);
      
      // If target exists, get its position info for debugging
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        console.log(`🔍 DEBUG: Target position - top: ${rect.top}, y: ${window.scrollY}`);
      }
      
      // Scroll with a small delay to ensure DOM updates are complete
      setTimeout(() => {
        console.log(`🔍 DEBUG: Attempting to scroll to ${sectionId} after delay`);
        scrollToNextRow(sectionId);
      }, 100);
    } else {
      console.log(`🔍 DEBUG: No next degree defined for ${degreeType}`);
    }
  }, [scrollToNextRow, degreeSequence]);

  // Render educational components based on selected level
  const renderEducationComponents = () => {
    switch (educationLevel) {
      case 'professor':
        return (
          <div className="space-y-6">
            <div id="section-professor">
              <Professor 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('professor')}
              />
            </div>
            <div className="space-y-4" id="section-phd">
              <PhD 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('phd')}
              />
            </div>
            <div id="section-master">
              <Master 
                register={register} 
                errors={errors} 
                setValue={setValue} 
                onComplete={() => handleDegreeCompletion('master')}
              />
            </div>
            <div id="section-bachelor">
              <Bachelor 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('bachelor')}
              />
            </div>
          </div>
        );
      case 'phd':
        return (
          <div className="space-y-6">
            <div className="space-y-4" id="section-phd">
              <PhD 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('phd')}
              />
            </div>
            <div id="section-master">
              <Master 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('master')}
              />
            </div>
            <div id="section-bachelor">
              <Bachelor 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('bachelor')}
              />
            </div>
          </div>
        );
      case 'master':
        return (
          <div className="space-y-6">
            <div id="section-master">
              <Master 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('master')}
              />
            </div>
            <div id="section-bachelor">
              <Bachelor 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('bachelor')}
              />
            </div>
          </div>
        );
      case 'bachelor':
        return (
          <div id="section-bachelor">
            <Bachelor 
              register={register} 
              errors={errors} 
              setValue={setValue}
              onComplete={() => handleDegreeCompletion('bachelor')}
            />
          </div>
        );
      case 'diploma':
        return (
          <div id="section-diploma">
            <Diploma 
              register={register} 
              errors={errors} 
              setValue={setValue}
              onComplete={() => handleDegreeCompletion('diploma')}
            />
          </div>
        );
      case 'student':
        return <Student register={register} errors={errors} setValue={setValue} />;
      default:
        return null;
    }
  };

  // Debug mounted sections
  useEffect(() => {
    console.log('🔍 DEBUG: Mounted degree components for level:', educationLevel);
    console.log('🔍 DEBUG: Available sections:', 
      ['section-professor', 'section-phd', 'section-master', 'section-bachelor', 'section-occupation']
        .map(id => ({ id, exists: !!document.getElementById(id) }))
    );
  }, [educationLevel]);

  return (
    <div className="space-y-6">
      {renderEducationComponents()}
      {educationLevel !== 'student' && (
        <div id="section-occupation">
          <Occupation 
            register={register} 
            errors={errors} 
            educationLevel={educationLevel} 
          />
        </div>
      )}
    </div>
  );
};

export default Degree; 