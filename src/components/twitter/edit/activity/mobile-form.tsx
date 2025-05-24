// 'use client';
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { activitySchema, ActivitySchema } from "./validation";
// import { useEffect, useRef, useState } from "react";
// import { useFormContext } from '@/components/onboarding/form-context';
// import { useTransition } from "react";
// import { submitActivityForm } from "./action";
// import { toast } from "sonner";
// import { useRouter, usePathname } from "next/navigation";
// import { getNextRoute } from '../utils';
// import { useActionState } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { MonthYearRangePicker } from "@/components/atom/month-year-range";
// import { AutoComplete, Option } from "@/components/atom/auto-complete";
// import ClubSelector from "./mobile-club-selector";
// import { Skills } from "./skills";
// import { Interests } from "./interests";

// interface ActivityFormProps {
//   user: {
//     id: string;
//     partyMember?: boolean;
//     partyName?: string | null;
//     partyStartDate?: Date | null;
//     partyEndDate?: Date | null;
//     unionMember?: boolean;
//     unionName?: string | null;
//     unionStartDate?: Date | null;
//     unionEndDate?: Date | null;
//     ngoMember?: boolean;
//     ngoName?: string | null;
//     ngoActivity?: string | null;
//     clubMember?: boolean;
//     clubName?: string | null;
//     clubType?: string | null;
//     voluntaryMember?: boolean;
//     voluntaryName?: string | null;
//     voluntaryRole?: string | null;
//     voluntaryStartDate?: Date | null;
//     voluntaryEndDate?: Date | null;
//     skills?: string[];
//     interests?: string[];
//   };
// }

// export default function ActivityForm({ user }: ActivityFormProps) {
//   const { formRef, setIsSubmitting, setCurrentFormId } = useFormContext();
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();
//   const pathname = usePathname();
  
//   // Initialize selectedActivities state from the default values
//   const {
//     watch,
//     setValue,
//     handleSubmit,
//   } = useForm<ActivitySchema>({
//     resolver: zodResolver(activitySchema),
//     defaultValues: {
//       selectedActivities: (() => {
//         const activities: string[] = [];
//         if (user.partyMember) activities.push("سياسي");
//         if (user.unionMember) activities.push("نقابي");
//         if (user.ngoMember) activities.push("اجتماعي");
//         if (user.clubMember) activities.push("شبابي");
//         if (user.voluntaryMember) activities.push("تطوعي");
//         return activities;
//       })(),
//       partyMember: user.partyMember || false,
//       partyName: user.partyName || '',
//       partyStartDate: user.partyStartDate?.toISOString().split('T')[0] || '',
//       partyEndDate: user.partyEndDate?.toISOString().split('T')[0] || '',
//       unionMember: user.unionMember || false,
//       unionName: user.unionName || '',
//       unionStartDate: user.unionStartDate?.toISOString().split('T')[0] || '',
//       unionEndDate: user.unionEndDate?.toISOString().split('T')[0] || '',
//       ngoMember: user.ngoMember || false,
//       ngoName: user.ngoName || '',
//       ngoActivity: user.ngoActivity || '',
//       clubMember: user.clubMember || false,
//       clubName: user.clubName || '',
//       clubType: user.clubType || '',
//       voluntaryMember: user.voluntaryMember || false,
//       voluntaryName: user.voluntaryName || '',
//       voluntaryRole: user.voluntaryRole || '',
//       voluntaryStartDate: user.voluntaryStartDate?.toISOString().split('T')[0] || '',
//       voluntaryEndDate: user.voluntaryEndDate?.toISOString().split('T')[0] || '',
//       skills: Array.isArray(user.skills) ? [...user.skills] : [],
//       interests: Array.isArray(user.interests) ? [...user.interests] : [],
//     }
//   });

//   // Set up useActionState like other working forms
//   const [state, formAction] = useActionState(
//     submitActivityForm,
//     {
//       success: false,
//       error: false
//     }
//   );

//   // Use the form's watched selectedActivities
//   const watchedSelectedActivities = watch("selectedActivities");
  
//   // Sync the watched value with our state
//   const [selectedActivities, setSelectedActivities] = useState<string[]>(() => {
//     const activities: string[] = [];
//     if (user.partyMember) activities.push("سياسي");
//     if (user.unionMember) activities.push("نقابي");
//     if (user.ngoMember) activities.push("اجتماعي");
//     if (user.clubMember) activities.push("شبابي");
//     if (user.voluntaryMember) activities.push("تطوعي");
//     return activities;
//   });

//   useEffect(() => {
//     setSelectedActivities(watchedSelectedActivities);
//   }, [watchedSelectedActivities]);

//   // Refs for form context
//   const localFormRef = useRef<HTMLFormElement>(null);
//   const scrollAreaRef = useRef<HTMLDivElement>(null);

//   // Form field watches for auto-scroll logic
//   const watchedPartyName = watch("partyName");
//   const watchedPartyStartDate = watch("partyStartDate");
  
//   const watchedUnionName = watch("unionName");
//   const watchedUnionStartDate = watch("unionStartDate");
  
//   const watchedNgoName = watch("ngoName");
//   const watchedNgoActivity = watch("ngoActivity");
  
//   const watchedClubName = watch("clubName");
//   const watchedClubType = watch("clubType");
  
//   // Field completion state trackers
//   const [partyFieldsCompleted, setPartyFieldsCompleted] = useState(false);
//   const [unionFieldsCompleted, setUnionFieldsCompleted] = useState(false);
//   const [ngoFieldsCompleted, setNgoFieldsCompleted] = useState(false);
//   const [clubFieldsCompleted, setClubFieldsCompleted] = useState(false);
  
//   // Track if initial club selection scroll has happened
//   const [initialClubScrollDone, setInitialClubScrollDone] = useState(false);

//   // Function to scroll element to full top
//   const scrollToElement = (elementId: string) => {
//     if (scrollAreaRef.current) {
//       const element = document.getElementById(elementId);
//       const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      
//       if (element && scrollContainer) {
//         // Get the element's position relative to the scrollable container
//         const elementRect = element.getBoundingClientRect();
//         const containerRect = scrollContainer.getBoundingClientRect();
//         const relativeTop = elementRect.top - containerRect.top;
        
//         // Scroll to the element's position with no offset (full top)
//         scrollContainer.scrollTo({
//           top: scrollContainer.scrollTop + relativeTop,
//           behavior: 'smooth'
//         });
//       }
//     }
//   };

//   // Watch for club selection and scroll the club selector to the top
//   useEffect(() => {
//     // Only scroll on the first club selection, not on subsequent selections
//     if (selectedActivities.length > 0 && !initialClubScrollDone) {
//       // When user selects any club type, scroll the club selector to the top
//       setTimeout(() => {
//         scrollToElement('activity-section');
//         setInitialClubScrollDone(true);
//       }, 150);
//     }
//   }, [selectedActivities, initialClubScrollDone]);
  
//   // Reset the scroll state if all clubs are deselected
//   useEffect(() => {
//     if (selectedActivities.length === 0 && initialClubScrollDone) {
//       setInitialClubScrollDone(false);
//     }
//   }, [selectedActivities, initialClubScrollDone]);
  
//   // Watch for completion of party fields
//   useEffect(() => {
//     if (selectedActivities.includes("سياسي") && 
//         watchedPartyName && 
//         watchedPartyStartDate && 
//         !partyFieldsCompleted) {
//       setPartyFieldsCompleted(true);
      
//       // Find the next section to scroll to
//       const nextSectionId = selectedActivities.includes("نقابي") 
//         ? 'union-section' 
//         : selectedActivities.includes("اجتماعي") 
//           ? 'ngo-section' 
//           : selectedActivities.includes("شبابي") 
//             ? 'club-section' 
//             : selectedActivities.includes("تطوعي") 
//               ? 'voluntary-section' 
//               : null;
              
//       if (nextSectionId) {
//         setTimeout(() => scrollToElement(nextSectionId), 300);
//       }
//     }
//   }, [watchedPartyName, watchedPartyStartDate, partyFieldsCompleted, selectedActivities]);
  
//   // Watch for completion of union fields
//   useEffect(() => {
//     if (selectedActivities.includes("نقابي") && 
//         watchedUnionName && 
//         watchedUnionStartDate && 
//         !unionFieldsCompleted) {
//       setUnionFieldsCompleted(true);
      
//       // Find the next section to scroll to
//       const nextSectionId = selectedActivities.includes("اجتماعي") 
//         ? 'ngo-section' 
//         : selectedActivities.includes("شبابي") 
//           ? 'club-section' 
//           : selectedActivities.includes("تطوعي") 
//             ? 'voluntary-section' 
//             : null;
            
//       if (nextSectionId) {
//         setTimeout(() => scrollToElement(nextSectionId), 300);
//       }
//     }
//   }, [watchedUnionName, watchedUnionStartDate, unionFieldsCompleted, selectedActivities]);
  
//   // Watch for completion of NGO fields
//   useEffect(() => {
//     if (selectedActivities.includes("اجتماعي") && 
//         watchedNgoName && 
//         watchedNgoActivity && 
//         !ngoFieldsCompleted) {
//       setNgoFieldsCompleted(true);
      
//       // Find the next section to scroll to
//       const nextSectionId = selectedActivities.includes("شبابي") 
//         ? 'club-section' 
//         : selectedActivities.includes("تطوعي") 
//           ? 'voluntary-section' 
//           : null;
          
//       if (nextSectionId) {
//         setTimeout(() => scrollToElement(nextSectionId), 300);
//       }
//     }
//   }, [watchedNgoName, watchedNgoActivity, ngoFieldsCompleted, selectedActivities]);
  
//   // Watch for completion of club fields
//   useEffect(() => {
//     if (selectedActivities.includes("شبابي") && 
//         watchedClubName && 
//         watchedClubType && 
//         !clubFieldsCompleted) {
//       setClubFieldsCompleted(true);
      
//       // Find the next section to scroll to
//       const nextSectionId = selectedActivities.includes("تطوعي") 
//         ? 'voluntary-section' 
//         : null;
          
//       if (nextSectionId) {
//         setTimeout(() => scrollToElement(nextSectionId), 300);
//       }
//     }
//   }, [watchedClubName, watchedClubType, clubFieldsCompleted, selectedActivities]);

//   useEffect(() => {
//     // Set form reference for ButtonNavigation
//     if (formRef && localFormRef.current) {
//       formRef.current = localFormRef.current;
//     }
//     setCurrentFormId('activity');
//   }, [formRef, setCurrentFormId]);

//   // Handle form submission following the pattern from other forms
//   const onSubmit = handleSubmit((data) => {
//     console.log("Form submission started with valid data:", JSON.stringify(data, null, 2));
//     setIsSubmitting(true);
    
//     // Ensure the data is properly formatted
//     const formattedData = {
//       ...data,
//       skills: Array.isArray(data.skills) ? data.skills : [],
//       interests: Array.isArray(data.interests) ? data.interests : [],
//       // Only use boolean for fields that exist in schema
//       partyMember: data.partyMember === true,
//       unionMember: data.unionMember === true,
//       ngoMember: data.ngoMember === true,
//       clubMember: data.clubMember === true,
//       // voluntaryMember is handled specially in the server action since it's not in the schema
//     };
    
//     // Use startTransition to call the server action
//     startTransition(() => {
//       formAction(formattedData);
//     });
//   });

//   // Handle form state changes
//   useEffect(() => {
//     console.log("Action state changed:", state);
    
//     if (state.success) {
//       console.log("Form submission successful");
//       toast.success("تم حفظ معلومات النشاطات بنجاح");
//       router.push(getNextRoute(pathname));
//     } else if (state.error) {
//       console.error("Form submission failed with error state", state.message || "Unknown error");
//       toast.error(state.message ? `خطأ: ${state.message}` : "حدث خطأ أثناء حفظ المعلومات");
//       setIsSubmitting(false);
//     }
//   }, [state, router, pathname, setIsSubmitting]);

//   const parseISODateToDate = (isoDate: string | null | undefined): Date | undefined => {
//     if (!isoDate) return undefined;
//     return new Date(isoDate);
//   };

//   const handleDateRangeChange = (activityType: string, range: { from?: Date, to?: Date }) => {
//     if (activityType === 'party') {
//       setValue('partyStartDate', range.from?.toISOString().split('T')[0] || '');
//       setValue('partyEndDate', range.to?.toISOString().split('T')[0] || '');
//     } else if (activityType === 'union') {
//       setValue('unionStartDate', range.from?.toISOString().split('T')[0] || '');
//       setValue('unionEndDate', range.to?.toISOString().split('T')[0] || '');
//     } else if (activityType === 'voluntary') {
//       setValue('voluntaryStartDate', range.from?.toISOString().split('T')[0] || '');
//       setValue('voluntaryEndDate', range.to?.toISOString().split('T')[0] || '');
//     }
//   };

//   // Options for AutoComplete fields
//   const partyOptions: Option[] = [
//     { value: "حزب البعث العربي الاشتراكي", label: "حزب البعث العربي الاشتراكي" },
//     { value: "الحزب الشيوعي السوري", label: "الحزب الشيوعي السوري" },
//     { value: "حزب الاتحاد الاشتراكي العربي", label: "حزب الاتحاد الاشتراكي العربي" },
//     { value: "الحزب السوري القومي الاجتماعي", label: "الحزب السوري القومي الاجتماعي" },
//     { value: "الحزب الشيوعي السوري (المكتب السياسي)", label: "الحزب الشيوعي السوري (المكتب السياسي)" },
//     { value: "الحزب الديمقراطي السوري", label: "الحزب الديمقراطي السوري" },
//   ];

//   const unionOptions: Option[] = [
//     { value: "نقابة المعلمين", label: "نقابة المعلمين" },
//     { value: "نقابة المهندسين", label: "نقابة المهندسين" },
//     { value: "نقابة الأطباء", label: "نقابة الأطباء" },
//     { value: "نقابة المحامين", label: "نقابة المحامين" },
//     { value: "نقابة الصيادلة", label: "نقابة الصيادلة" },
//     { value: "نقابة الصحفيين", label: "نقابة الصحفيين" },
//     { value: "نقابة الفنانين", label: "نقابة الفنانين" },
//     { value: "نقابة العمال", label: "نقابة العمال" },
//   ];

//   const ngoOptions: Option[] = [
//     { value: "الهلال الأحمر السوري", label: "الهلال الأحمر السوري" },
//     { value: "جمعية البر والإحسان", label: "جمعية البر والإحسان" },
//     { value: "منظمة المرأة السورية", label: "منظمة المرأة السورية" },
//     { value: "جمعية رعاية الأيتام", label: "جمعية رعاية الأيتام" },
//     { value: "مؤسسة الشام الخيرية", label: "مؤسسة الشام الخيرية" },
//     { value: "جمعية حماية البيئة", label: "جمعية حماية البيئة" },
//   ];

//   const ngoActivityOptions: Option[] = [
//     { value: "تعليم", label: "تعليم" },
//     { value: "صحة", label: "صحة" },
//     { value: "إغاثة", label: "إغاثة" },
//     { value: "تنمية مجتمعية", label: "تنمية مجتمعية" },
//     { value: "دعم نفسي", label: "دعم نفسي" },
//     { value: "حماية البيئة", label: "حماية البيئة" },
//     { value: "ثقافة وفنون", label: "ثقافة وفنون" },
//     { value: "تمكين المرأة", label: "تمكين المرأة" },
//   ];

//   const clubOptions: Option[] = [
//     { value: "نادي الجلاء الرياضي", label: "نادي الجلاء الرياضي" },
//     { value: "نادي الوحدة", label: "نادي الوحدة" },
//     { value: "نادي تشرين", label: "نادي تشرين" },
//     { value: "نادي الكرامة", label: "نادي الكرامة" },
//     { value: "نادي الاتحاد", label: "نادي الاتحاد" },
//     { value: "نادي حطين", label: "نادي حطين" },
//   ];

//   const clubTypeOptions: Option[] = [
//     { value: "كرة قدم", label: "كرة قدم" },
//     { value: "كرة سلة", label: "كرة سلة" },
//     { value: "كرة طائرة", label: "كرة طائرة" },
//     { value: "سباحة", label: "سباحة" },
//     { value: "تنس", label: "تنس" },
//     { value: "كاراتيه", label: "كاراتيه" },
//     { value: "جودو", label: "جودو" },
//     { value: "مصارعة", label: "مصارعة" },
//   ];

//   const voluntaryOptions: Option[] = [
//     { value: "الهلال الأحمر", label: "الهلال الأحمر" },
//     { value: "كشافة", label: "كشافة" },
//     { value: "مبادرات تطوعية", label: "مبادرات تطوعية" },
//     { value: "قوافل إغاثة", label: "قوافل إغاثة" },
//     { value: "حملات تنظيف", label: "حملات تنظيف" },
//     { value: "تعليم وتدريب", label: "تعليم وتدريب" },
//   ];

//   const voluntaryRoleOptions: Option[] = [
//     { value: "متطوع", label: "متطوع" },
//     { value: "منسق", label: "منسق" },
//     { value: "قائد فريق", label: "قائد فريق" },
//     { value: "مدرب", label: "مدرب" },
//     { value: "مساعد إداري", label: "مساعد إداري" },
//     { value: "مسؤول تواصل", label: "مسؤول تواصل" },
//   ];

//   // Helper function to find option by value string
//   const getOptionByValue = (options: Option[], value: string | null | undefined): Option | undefined => {
//     if (!value) return undefined;
//     return options.find(option => option.value === value);
//   };

//   // Verify CSS matches for both components
//   useEffect(() => {
//     // Set uniform heights for MonthYearRangePicker to match AutoComplete
//     const datePickers = document.querySelectorAll('.month-year-range-picker');
//     datePickers.forEach((picker) => {
//       if (picker instanceof HTMLElement) {
//         picker.style.height = '40px'; // Match AutoComplete height
//       }
//     });
//   }, [selectedActivities]);

//   // Add this function to the ActivityForm component
//   const renderSchemaWarning = (field: string) => {
//     if (field === 'voluntary') {
//       return (
//         <div className="text-xs text-amber-600 mt-1 flex items-center">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           ملاحظة: سيتم حفظ بيانات النشاط التطوعي كوصف عام في الملف الشخصي.
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <form
//       ref={localFormRef}
//       onSubmit={onSubmit}
//       className="w-full h-[22rem] flex flex-col -mt-2"
//       noValidate
//     >
//       <ScrollArea ref={scrollAreaRef} className="w-full pr-4">
//         <div dir="rtl" className="flex flex-col gap-6 w-full px-4">
//           <div id="skills-section" className="flex flex-col gap-4 ">
//             <Skills 
//               value={watch("skills")} 
//               onChange={(skills: string[]) => setValue("skills", skills)} 
//             />
            
//             <Interests
//               value={watch("interests")}
//               onChange={(interests: string[]) => setValue("interests", interests)}
//             />
//           </div>

//           <div id="activity-section" className="w-full">
//             <ClubSelector
//               setValue={setValue}
//               selectedTypes={selectedActivities}
//               setSelectedTypes={setSelectedActivities}
//             />
//           </div>

//           <div className="space-y-8 w-full">
//             {selectedActivities.includes("سياسي") && (
//               <div id="party-section" className="flex flex-col gap-6 border-b pb-7 border-gray-200">
//                 <div className="flex flex-col items-center gap-4">
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 pb-2">
//                       اسم الحزب
//                     </label>
//                     <AutoComplete
//                       options={partyOptions}
//                       emptyMessage="لا توجد نتائج"
//                       placeholder="اختر اسم الحزب"
//                       value={getOptionByValue(partyOptions, watch("partyName"))}
//                       onValueChange={(option) => setValue("partyName", option.value)}
//                     />
//                   </div>
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 pb-2">
//                       الفترة الزمنية
//                     </label>
//                     <MonthYearRangePicker
//                       value={{
//                         from: parseISODateToDate(watch('partyStartDate')),
//                         to: parseISODateToDate(watch('partyEndDate'))
//                       }}
//                       onChange={(range) => handleDateRangeChange('party', range)}
//                       placeholder="اختر فترة العضوية"
//                       className="month-year-range-picker"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {selectedActivities.includes("نقابي") && (
//               <div id="union-section" className="flex flex-col gap-6 border-b pb-7 border-gray-200">
//                 <div className="flex flex-col items-center gap-4">
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 pb-2">
//                       اسم النقابة
//                     </label>
//                     <AutoComplete
//                       options={unionOptions}
//                       emptyMessage="لا توجد نتائج"
//                       placeholder="اختر اسم النقابة"
//                       value={getOptionByValue(unionOptions, watch("unionName"))}
//                       onValueChange={(option) => setValue("unionName", option.value)}
//                     />
//                   </div>
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 pb-2">
//                       الفترة الزمنية
//                     </label>
//                     <MonthYearRangePicker
//                       value={{
//                         from: parseISODateToDate(watch('unionStartDate')),
//                         to: parseISODateToDate(watch('unionEndDate'))
//                       }}
//                       onChange={(range) => handleDateRangeChange('union', range)}
//                       placeholder="اختر فترة العضوية"
//                       className="month-year-range-picker"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {selectedActivities.includes("اجتماعي") && (  
//               <div id="ngo-section" className="flex flex-col gap-6 border-b pb-7 border-gray-200">
//                 <div className="flex flex-col items-center gap-4">
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 pb-2">
//                       اسم المنظمة
//                     </label>
//                     <AutoComplete
//                       options={ngoOptions}
//                       emptyMessage="لا توجد نتائج"
//                       placeholder="اختر اسم المنظمة"
//                       value={getOptionByValue(ngoOptions, watch("ngoName"))}
//                       onValueChange={(option) => setValue("ngoName", option.value)}
//                     />
//                   </div>
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 pb-2">
//                       نوع النشاط
//                     </label>
//                     <AutoComplete
//                       options={ngoActivityOptions}
//                       emptyMessage="لا توجد نتائج"
//                       placeholder="اختر نوع النشاط"
//                       value={getOptionByValue(ngoActivityOptions, watch("ngoActivity"))}
//                       onValueChange={(option) => setValue("ngoActivity", option.value)}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {selectedActivities.includes("شبابي") && (
//               <div id="club-section" className="flex flex-col gap-6 border-b pb-7 border-gray-200">
//                 <div className="flex flex-col items-center gap-4">
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 pb-2">
//                       اسم النادي
//                     </label>
//                     <AutoComplete
//                       options={clubOptions}
//                       emptyMessage="لا توجد نتائج"
//                       placeholder="اختر اسم النادي"
//                       value={getOptionByValue(clubOptions, watch("clubName"))}
//                       onValueChange={(option) => setValue("clubName", option.value)}
//                     />
//                   </div>
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 pb-2">
//                       نوع النشاط
//                     </label>
//                     <AutoComplete
//                       options={clubTypeOptions}
//                       emptyMessage="لا توجد نتائج"
//                       placeholder="اختر نوع النشاط"
//                       value={getOptionByValue(clubTypeOptions, watch("clubType"))}
//                       onValueChange={(option) => setValue("clubType", option.value)}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {selectedActivities.includes("تطوعي") && (
//               <div id="voluntary-section" className="flex flex-col gap-6">
//                 <div className="flex flex-col items-center gap-4">
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 pb-2">
//                       اسم الجهة التطوعية
//                     </label>
//                     <AutoComplete
//                       options={voluntaryOptions}
//                       emptyMessage="لا توجد نتائج"
//                       placeholder="اختر اسم الجهة التطوعية"
//                       value={getOptionByValue(voluntaryOptions, watch("voluntaryName") as string)}
//                       onValueChange={(option) => setValue("voluntaryName", option.value)}
//                     />
//                   </div>
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 pb-2">
//                       الدور التطوعي
//                     </label>
//                     <AutoComplete
//                       options={voluntaryRoleOptions}
//                       emptyMessage="لا توجد نتائج"
//                       placeholder="اختر الدور التطوعي"
//                       value={getOptionByValue(voluntaryRoleOptions, watch("voluntaryRole") as string)}
//                       onValueChange={(option) => setValue("voluntaryRole", option.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="flex flex-col items-center gap-4">
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 pb-2">
//                       الفترة الزمنية
//                     </label>
//                     <MonthYearRangePicker
//                       value={{
//                         from: parseISODateToDate(watch('voluntaryStartDate') as string),
//                         to: parseISODateToDate(watch('voluntaryEndDate') as string)
//                       }}
//                       onChange={(range) => handleDateRangeChange('voluntary', range)}
//                       placeholder="اختر فترة التطوع"
//                       className="month-year-range-picker"
//                     />
//                   </div>
//                 </div>
//                 {/* {renderSchemaWarning('voluntary')} */}
//               </div>
//             )}
//           </div>
//         </div>
//       </ScrollArea>

//       {/* Hidden submit button for form submission */}
//       <button
//         id="submit-activity"
//         type="submit"
//         style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
//       />
//     </form>
//   );
// } 