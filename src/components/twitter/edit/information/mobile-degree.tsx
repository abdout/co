// 'use client';
// import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
// import { InformationSchema } from "./validation";
// import Student from "./mobile-student";
// import Diploma from "./mobile-diploma";
// import Bachelor from "./mobile-bachelor";
// import Master from "./mobile-master";
// import PhD from "./mobile-phd";
// import Professor from "./mobile-professor";
// import Occupation from "./occupation";
// import { useEffect, useRef, useState } from "react";

// interface DegreeProps {
//   register: UseFormRegister<InformationSchema>;
//   errors: FieldErrors<InformationSchema>;
//   setValue: UseFormSetValue<InformationSchema>;
//   educationLevel: string;
// }

// const Degree = ({
//   register,
//   errors,
//   setValue,
//   educationLevel
// }: DegreeProps) => {
//   // Ref to track content loaded state
//   const contentLoadedRef = useRef(false);
  
//   // Refs for each educational level component
//   const professorRef = useRef<HTMLDivElement>(null);
//   const phdRef = useRef<HTMLDivElement>(null);
//   const masterRef = useRef<HTMLDivElement>(null);
//   const bachelorRef = useRef<HTMLDivElement>(null);
//   const diplomaRef = useRef<HTMLDivElement>(null);
//   const studentRef = useRef<HTMLDivElement>(null);
  
//   // State to track completed sections
//   const [professorCompleted, setProfessorCompleted] = useState(false);
//   const [phdCompleted, setPhdCompleted] = useState(false);
//   const [masterCompleted, setMasterCompleted] = useState(false);
//   const [bachelorCompleted, setBachelorCompleted] = useState(false);
//   const [diplomaCompleted, setDiplomaCompleted] = useState(false);
//   const [studentCompleted, setStudentCompleted] = useState(false);

//   // Function to scroll to a sub-component with full top positioning
//   const scrollToSubComponent = (ref: React.RefObject<HTMLDivElement | null>) => {
//     if (ref.current) {
//       // Find the parent ScrollArea viewport
//       const scrollArea = ref.current.closest('[data-radix-scroll-area-viewport]');
      
//       if (scrollArea) {
//         // Get element and container positions
//         const elementRect = ref.current.getBoundingClientRect();
//         const containerRect = scrollArea.getBoundingClientRect();
        
//         // Calculate the relative position for full top alignment
//         const relativeTop = elementRect.top - containerRect.top + scrollArea.scrollTop;
        
//         // Set scroll position with no offset for full top alignment
//         scrollArea.scrollTo({
//           top: relativeTop, // no offset for full top positioning
//           behavior: 'smooth'
//         });
//       } else {
//         // Fallback to standard scrollIntoView with start alignment
//         ref.current.scrollIntoView({
//           behavior: 'smooth',
//           block: 'start'
//         });
//       }
//     }
//   };
  
//   // Signal when content has been fully rendered
//   useEffect(() => {
//     // Short delay to ensure DOM is updated
//     const timer = setTimeout(() => {
//       contentLoadedRef.current = true;
      
//       // Dispatch a custom event that the form can listen for
//       const event = new CustomEvent('degreeContentRendered', { 
//         detail: { educationLevel } 
//       });
//       document.dispatchEvent(event);
//     }, 50);
    
//     return () => clearTimeout(timer);
//   }, [educationLevel]);
  
//   // Listen for field completion events
//   useEffect(() => {
//     const handleFieldCompleted = (event: Event) => {
//       const customEvent = event as CustomEvent;
//       const { componentType, fieldType } = customEvent.detail || {};
      
//       // Only scroll when all fields are completed (fieldType === 'all')
//       if (componentType === 'professor' && fieldType === 'all' && !professorCompleted) {
//         setProfessorCompleted(true);
//         if (educationLevel === 'professor') {
//           // Scroll to PhD section with minimal delay
//           setTimeout(() => {
//             scrollToSubComponent(phdRef);
//           }, 150);
//         }
//       }
//       else if (componentType === 'phd' && fieldType === 'all' && !phdCompleted) {
//         setPhdCompleted(true);
//         // Scroll to Master section immediately
//         setTimeout(() => {
//           scrollToSubComponent(masterRef);
//         }, 150);
//       }
//       else if (componentType === 'master' && fieldType === 'all' && !masterCompleted) {
//         setMasterCompleted(true);
//         // Scroll to Bachelor section immediately
//         setTimeout(() => {
//           scrollToSubComponent(bachelorRef);
//         }, 150);
//       }
//       else if (componentType === 'bachelor' && fieldType === 'all' && !bachelorCompleted) {
//         setBachelorCompleted(true);
//       }
//       else if (componentType === 'diploma' && fieldType === 'all' && !diplomaCompleted) {
//         setDiplomaCompleted(true);
//       }
//       else if (componentType === 'student' && fieldType === 'all' && !studentCompleted) {
//         setStudentCompleted(true);
//       }
//     };

//     // Listen for the custom event from sub-components
//     document.addEventListener('educationFieldCompleted', handleFieldCompleted);
    
//     return () => {
//       document.removeEventListener('educationFieldCompleted', handleFieldCompleted);
//     };
//   }, [educationLevel, professorCompleted, phdCompleted, masterCompleted, bachelorCompleted, diplomaCompleted, studentCompleted]);

//   // Render educational components based on selected level
//   const renderEducationComponents = () => {
//     switch (educationLevel) {
//       case 'professor':
//         return (
//           <div className="space-y-6">
//             <div ref={professorRef}>
//               <Professor register={register} errors={errors} setValue={setValue} />
//             </div>
//             <div ref={phdRef}>
//               <PhD register={register} errors={errors} setValue={setValue} />
//             </div>
//             <div ref={masterRef}>
//               <Master register={register} errors={errors} setValue={setValue} />
//             </div>
//             <div ref={bachelorRef}>
//               <Bachelor register={register} errors={errors} setValue={setValue} />
//             </div>
//           </div>
//         );
//       case 'phd':
//         return (
//           <div className="space-y-6">
//             <div ref={phdRef}>
//               <PhD register={register} errors={errors} setValue={setValue} />
//             </div>
//             <div ref={masterRef}>
//               <Master register={register} errors={errors} setValue={setValue} />
//             </div>
//             <div ref={bachelorRef}>
//               <Bachelor register={register} errors={errors} setValue={setValue} />
//             </div>
//           </div>
//         );
//       case 'master':
//         return (
//           <div className="space-y-6">
//             <div ref={masterRef}>
//               <Master register={register} errors={errors} setValue={setValue} />
//             </div>
//             <div ref={bachelorRef}>
//               <Bachelor register={register} errors={errors} setValue={setValue} />
//             </div>
//           </div>
//         );
//       case 'bachelor':
//         return (
//           <div ref={bachelorRef}>
//             <Bachelor register={register} errors={errors} setValue={setValue} />
//           </div>
//         );
//       case 'diploma':
//         return (
//           <div ref={diplomaRef}>
//             <Diploma register={register} errors={errors} setValue={setValue} />
//           </div>
//         );
//       case 'student':
//         return (
//           <div ref={studentRef}>
//             <Student register={register} errors={errors} setValue={setValue} />
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {renderEducationComponents()}
//       {educationLevel !== 'student' && (
//         <Occupation 
//           register={register} 
//           errors={errors} 
//           educationLevel={educationLevel} 
//         />
//       )}
//     </div>
//   );
// };

// export default Degree; 