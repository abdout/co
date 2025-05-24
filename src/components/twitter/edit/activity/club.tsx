'use client';

import { useEffect, useRef, useState } from 'react';
import { AutoComplete, Option } from "@/components/atom/auto-complete";
import { MonthYearRangePicker } from "@/components/atom/month-year-range";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { ActivitySchema } from "./validation";
import { 
  PARTY_OPTIONS,
  UNION_OPTIONS,
  NGO_OPTIONS,
  NGO_ACTIVITY_OPTIONS,
  CLUB_OPTIONS,
  CLUB_TYPE_OPTIONS,
  VOLUNTARY_OPTIONS,
} from './constant';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface ClubProps {
  watch: UseFormWatch<ActivitySchema>;
  setValue: UseFormSetValue<ActivitySchema>;
  getOptionByValue: (options: Option[], value: string | null | undefined) => Option | undefined;
  renderSchemaWarning: (field: string) => React.ReactNode;
  parseISODateToDate: (isoDate: string | null | undefined) => Date | undefined;
  handleDateRangeChange: (activityType: string, range: DateRange) => void;
  selectedActivities: string[];
  detailsSectionRef: React.RefObject<HTMLDivElement | null>;
  scrollToRef?: (ref: React.RefObject<HTMLDivElement | null>, sectionType: string) => void;
}

export default function Club({
  watch,
  setValue,
  getOptionByValue,
  // renderSchemaWarning,
  parseISODateToDate,
  handleDateRangeChange,
  selectedActivities,
  detailsSectionRef,
  scrollToRef
}: ClubProps) {
  // Create refs for each activity section
  const partySectionRef = useRef<HTMLDivElement>(null);
  const unionSectionRef = useRef<HTMLDivElement>(null);
  const ngoSectionRef = useRef<HTMLDivElement>(null);
  const clubSectionRef = useRef<HTMLDivElement>(null);
  const voluntarySectionRef = useRef<HTMLDivElement>(null);

  // Track completion state for each section
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({
    party: false,
    union: false,
    ngo: false,
    club: false,
    voluntary: false
  });
  
  // Track which fields have been explicitly modified by the user in this session
  const [userModifiedFields, setUserModifiedFields] = useState<Record<string, Set<string>>>({
    party: new Set<string>(),
    union: new Set<string>(),
    ngo: new Set<string>(),
    club: new Set<string>(),
    voluntary: new Set<string>()
  });
  
  // Helper function to mark a field as modified by the user
  const markFieldAsModified = (section: string, field: string) => {
    console.log(`🖊️ Marking field ${field} in section ${section} as user-modified`);
    setUserModifiedFields(prev => {
      const newSectionSet = new Set(prev[section]);
      newSectionSet.add(field);
      return { ...prev, [section]: newSectionSet };
    });
  };
  
  // Helper function to check if all required fields in a section were modified by the user
  const wereAllFieldsModifiedByUser = (section: string, fields: string[]): boolean => {
    if (!userModifiedFields[section]) return false;
    
    const allModified = fields.every(field => userModifiedFields[section].has(field));
    console.log(`🔍 Checking if all fields in ${section} were modified by user:`, {
      required: fields,
      modified: Array.from(userModifiedFields[section]),
      allModified
    });
    
    return allModified;
  };

  // Debug log current form state
  useEffect(() => {
    console.log("🔍 FORM STATE:", {
      partyName: watch("partyName"),
      partyStartDate: watch("partyStartDate"),
      partyEndDate: watch("partyEndDate"),
      completedSections,
      userModifiedFields
    });
  }, [watch("partyName"), watch("partyStartDate"), watch("partyEndDate"), completedSections, userModifiedFields]);

  // Function to scroll to a specific section - now enhanced with scrollToRef if available
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement | null>) => {
    console.log("📜 SCROLL FUNCTION CALLED with ref:", sectionRef);
    
    // Determine section type based on which ref we're scrolling to
    let sectionType = 'unknown';
    if (sectionRef === partySectionRef) sectionType = 'party';
    else if (sectionRef === unionSectionRef) sectionType = 'union';
    else if (sectionRef === ngoSectionRef) sectionType = 'ngo';
    else if (sectionRef === clubSectionRef) sectionType = 'club';
    else if (sectionRef === voluntarySectionRef) sectionType = 'voluntary';
    
    console.log(`📜 Determined section type: ${sectionType}`);
    
    // Use new scrollToRef if available (preferred method)
    if (scrollToRef && sectionRef.current) {
      console.log(`🚀 Using scrollToRef from useScroll hook for ${sectionType}`);
      scrollToRef(sectionRef, sectionType);
      return;
    }
    
    // Fallback to original implementation if scrollToRef not available
    if (sectionRef.current) {
      // Add a negative scroll margin to make it scroll higher
      sectionRef.current.style.scrollMarginTop = "-20px";
      console.log("🚀 SCROLLING TO SECTION - setting scrollMarginTop to -20px");
      console.log("📜 Section DOM element:", sectionRef.current);
      
      // Use a more reliable scrolling method with setTimeout to ensure DOM is ready
      setTimeout(() => {
        try {
          // First attempt: scrollIntoView
          sectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          console.log("🚀 SCROLL EXECUTED with scrollIntoView for", sectionRef.current);
          
          // Second attempt as fallback: direct DOM scrolling
          const parentScroller = sectionRef.current?.closest('.scroll-area-viewport');
          if (parentScroller) {
            const offsetTop = sectionRef.current?.offsetTop || 0;
            const scrollOffset = sectionType === 'party' ? 5 : 30;
            parentScroller.scrollTop = offsetTop - scrollOffset;
            console.log(`🚀 FALLBACK SCROLL with direct scrollTop: ${offsetTop - scrollOffset}`);
          }
        } catch (err) {
          console.error("❌ Scroll error:", err);
        }
      }, 100); // Short delay to ensure DOM is ready
    } else {
      console.error(`❌ SCROLL ERROR: ${sectionType} section ref is null, cannot scroll`);
    }
  };

  // Function to directly check if a section is complete and scroll if needed
  const checkAndScroll = (activityType: string, activityKey: string) => {
    console.log(`📋 CHECK & SCROLL called for ${activityType} (${activityKey})`);
    
    // Ensure all section refs are properly initialized
    if (activityType === 'union' && !unionSectionRef.current) {
      console.error("🔴 UNION section ref is null when trying to check scroll!");
      
      // Try to find the element directly as fallback
      const unionElement = document.querySelector('[data-section="union-section"]');
      if (unionElement && unionSectionRef) {
        console.log("🟢 Found union section via querySelector, updating ref");
        // This is a workaround and not ideal, but helps in emergency situations
        (unionSectionRef as React.MutableRefObject<HTMLDivElement>).current = unionElement as HTMLDivElement;
      }
    }
    
    // Check completion based on activity type, being extra strict about completion
    let isComplete = false;
    let requiredFields: string[] = [];
    
    if (activityType === 'party') {
      const partyName = watch("partyName");
      const partyStartDate = watch("partyStartDate");
      const partyEndDate = watch("partyEndDate");
      
      requiredFields = ["partyName", "partyStartDate", "partyEndDate"];
      
      // VERY strict: only consider complete when party name AND BOTH dates are filled
      isComplete = Boolean(partyName && partyName.trim() !== '' && 
                         partyStartDate && partyStartDate.trim() !== '' && 
                         partyEndDate && partyEndDate.trim() !== '');
      
      console.log("🔎 STRICT PARTY CHECK:", { 
        partyName, 
        partyStartDate, 
        partyEndDate, 
        isComplete,
        completedAlready: completedSections[activityType],
        userModified: Array.from(userModifiedFields.party || new Set())
      });
    }
    else if (activityType === 'union') {
      const unionName = watch("unionName");
      const unionStartDate = watch("unionStartDate"); 
      const unionEndDate = watch("unionEndDate");
      
      requiredFields = ["unionName", "unionStartDate", "unionEndDate"];
      
      // VERY strict: both dates required
      isComplete = Boolean(unionName && unionName.trim() !== '' && 
                        unionStartDate && unionStartDate.trim() !== '' && 
                        unionEndDate && unionEndDate.trim() !== '');
      
      console.log("🔎 STRICT UNION CHECK:", { 
        unionName, 
        unionStartDate, 
        unionEndDate, 
        isComplete,
        completedAlready: completedSections[activityType],
        userModified: Array.from(userModifiedFields.union || new Set())
      });
      
      // SPECIAL CASE FOR UNION: If the fields have values but weren't marked as modified,
      // we'll force mark them as modified to allow scrolling
      if (isComplete && !wereAllFieldsModifiedByUser(activityType, requiredFields)) {
        console.log("🔧 UNION SPECIAL CASE: Forcing fields to be marked as modified");
        requiredFields.forEach(field => markFieldAsModified('union', field));
        console.log("🔧 UNION FIELDS NOW MODIFIED:", Array.from(userModifiedFields.union || new Set()));
      }
    }
    else if (activityType === 'ngo') {
      const ngoName = watch("ngoName");
      const ngoActivity = watch("ngoActivity");
      
      requiredFields = ["ngoName", "ngoActivity"];
      
      // Both fields must be filled
      isComplete = Boolean(ngoName && ngoName.trim() !== '' && 
                        ngoActivity && ngoActivity.trim() !== '');
      
      console.log("🔎 STRICT NGO CHECK:", { 
        ngoName, 
        ngoActivity, 
        isComplete,
        completedAlready: completedSections[activityType],
        userModified: Array.from(userModifiedFields.ngo || new Set())
      });
    }
    else if (activityType === 'club') {
      const clubName = watch("clubName");
      const clubType = watch("clubType");
      
      requiredFields = ["clubName", "clubType"];
      
      // Both fields must be filled
      isComplete = Boolean(clubName && clubName.trim() !== '' && 
                        clubType && clubType.trim() !== '');
      
      console.log("🔎 STRICT CLUB CHECK:", { 
        clubName, 
        clubType, 
        isComplete,
        completedAlready: completedSections[activityType],
        userModified: Array.from(userModifiedFields.club || new Set())
      });
    }
    else if (activityType === 'voluntary') {
      const voluntaryName = watch("voluntaryName");
      const voluntaryStartDate = watch("voluntaryStartDate");
      const voluntaryEndDate = watch("voluntaryEndDate");
      
      requiredFields = ["voluntaryName", "voluntaryStartDate", "voluntaryEndDate"];
      
      // VERY strict: both dates required
      isComplete = Boolean(voluntaryName && voluntaryName.trim() !== '' && 
                        voluntaryStartDate && voluntaryStartDate.trim() !== '' && 
                        voluntaryEndDate && voluntaryEndDate.trim() !== '');
      
      console.log("🔎 STRICT VOLUNTARY CHECK:", { 
        voluntaryName, 
        voluntaryStartDate, 
        voluntaryEndDate, 
        isComplete,
        completedAlready: completedSections[activityType],
        userModified: Array.from(userModifiedFields.voluntary || new Set())
      });
    }
    
    // Check if all required fields were actually modified by the user in this session
    const allFieldsUserModified = wereAllFieldsModifiedByUser(activityType, requiredFields);
    
    // SPECIAL ADDITIONAL CHECK FOR UNION: handle case where it's complete but not all marked as modified
    if (activityType === 'union' && isComplete && !allFieldsUserModified) {
      console.log("🛠️ UNION: Field values complete but not all marked as modified, forcing scrolling anyway");
      forceScrollToNextSection('union', "نقابي");
      return; // Exit early since we're handling this case separately
    }
    
    // Only proceed if the section is both complete by value AND all fields were touched by the user
    if (isComplete && allFieldsUserModified && !completedSections[activityType]) {
      console.log(`✅ SECTION ${activityType} IS NOW FULLY COMPLETE AND USER-MODIFIED - will scroll to next`);
      
      // Update completion state
      setCompletedSections(prev => {
        const newState = { ...prev, [activityType]: true };
        console.log(`💾 UPDATING completedSections:`, newState);
        return newState;
      });
      
      // Find the next section to scroll to
      const nextSectionIndex = selectedActivities.indexOf(activityKey) + 1;
      
      // Scroll to the next section if one exists
      if (nextSectionIndex < selectedActivities.length) {
        const nextActivity = selectedActivities[nextSectionIndex];
        console.log(`🔜 PREPARING TO SCROLL to next activity: ${nextActivity} (index ${nextSectionIndex})`);
        
        // Special case for scrolling from party to union - use a different timing
        const timeoutDuration = activityType === 'party' ? 600 : 800;
        
        // Use a longer timeout to ensure the user has time to see what they're doing
        console.log(`⏱️ Setting scroll timeout (${timeoutDuration}ms) for ${nextActivity}`);
        setTimeout(() => {
          console.log(`⏰ TIMEOUT EXPIRED, now scrolling to ${nextActivity}`);
          
          if (nextActivity === "نقابي") {
            console.log("🎯 Target: UNION section");
            scrollToSection(unionSectionRef);
          } else if (nextActivity === "اجتماعي") {
            console.log("🎯 Target: NGO section");
            scrollToSection(ngoSectionRef);
          } else if (nextActivity === "شبابي") {
            console.log("🎯 Target: CLUB section");
            scrollToSection(clubSectionRef);
          } else if (nextActivity === "تطوعي") {
            console.log("🎯 Target: VOLUNTARY section");
            scrollToSection(voluntarySectionRef);
          }
        }, timeoutDuration); // Longer timeout to avoid feeling rushed
      } else {
        console.log("🛑 No next section to scroll to - this is the last section");
      }
    } else {
      if (isComplete && !allFieldsUserModified) {
        console.log(`⚠️ Section ${activityType} has complete values but not all were user-modified`);
      } else if (isComplete && completedSections[activityType]) {
        console.log(`⏭️ Section ${activityType} is complete but already marked as such - no scroll needed`);
      } else {
        console.log(`⏳ Section ${activityType} is NOT YET complete - waiting for more data`);
      }
    }
  };
  
  // Special function to force scroll to next section regardless of field modification status
  const forceScrollToNextSection = (activityType: string, activityKey: string) => {
    console.log(`🔨 FORCE SCROLL called for ${activityType} (${activityKey})`);
    
    // Mark the current section as complete
    setCompletedSections(prev => {
      const newState = { ...prev, [activityType]: true };
      console.log(`💾 FORCE UPDATING completedSections:`, newState);
      return newState;
    });
    
    // Find the next section to scroll to
    const nextSectionIndex = selectedActivities.indexOf(activityKey) + 1;
    
    // Scroll to the next section if one exists
    if (nextSectionIndex < selectedActivities.length) {
      const nextActivity = selectedActivities[nextSectionIndex];
      console.log(`🔜 FORCE SCROLL preparing to scroll to next activity: ${nextActivity}`);
      
      setTimeout(() => {
        console.log(`⏰ FORCE SCROLL timeout expired, now scrolling to ${nextActivity}`);
        
        if (nextActivity === "نقابي") {
          console.log("🎯 FORCE Target: UNION section");
          scrollToSection(unionSectionRef);
        } else if (nextActivity === "اجتماعي") {
          console.log("🎯 FORCE Target: NGO section");
          scrollToSection(ngoSectionRef);
        } else if (nextActivity === "شبابي") {
          console.log("🎯 FORCE Target: CLUB section");
          scrollToSection(clubSectionRef);
        } else if (nextActivity === "تطوعي") {
          console.log("🎯 FORCE Target: VOLUNTARY section");
          scrollToSection(voluntarySectionRef);
        }
      }, 500);
    }
  };

  // Extend the handleDateRangeChange function to directly check for completion
  const handleDateRangeChangeAndScroll = (activityType: string, range: DateRange) => {
    console.log(`📅 DATE RANGE CHANGE for ${activityType}:`, range);
    
    // Special logging for union section
    if (activityType === 'union') {
      console.log("🔍 UNION DATE RANGE CHANGE DEBUG:");
      console.log("📜 Range object:", range);
      console.log("📜 Union section ref:", unionSectionRef);
      console.log("📜 Union section DOM element exists?", unionSectionRef.current !== null);
    }
    
    // First call the original date change handler
    handleDateRangeChange(activityType, range);
    console.log(`📆 Called handleDateRangeChange for ${activityType}`);
    
    // Skip empty ranges completely - this happens when just clicking in the field
    if (!range) {
      console.log(`❌ No range data at all for ${activityType}, likely just clicked the field`);
      return;
    }
    
    // Extra safety check - range might exist but be empty objects
    if (typeof range.from === 'undefined' || range.from === null || 
        typeof range.to === 'undefined' || range.to === null) {
      console.log(`⚠️ Incomplete range for ${activityType} - likely just opened picker`, range);
      return;
    }
    
    // Super strict! Only proceed if both are ACTUALLY dates, not just objects
    const isValidDate = (date: Date | null | undefined): boolean => 
      date instanceof Date && !isNaN(date.getTime());
      
    if (!isValidDate(range.from) || !isValidDate(range.to)) {
      console.log(`⚠️ Invalid dates in range for ${activityType}:`, {
        fromIsValid: isValidDate(range.from),
        toIsValid: isValidDate(range.to)
      });
      return;
    }
    
    // Only if we have fully valid from AND to dates, then proceed
    console.log(`✓✓ VALID Date range FULLY filled for ${activityType} - from: ${range.from}, to: ${range.to}`);
    
    // Mark date fields as user-modified
    if (activityType === 'party') {
      markFieldAsModified('party', 'partyStartDate');
      markFieldAsModified('party', 'partyEndDate');
    }
    else if (activityType === 'union') {
      console.log("📝 Marking UNION date fields as modified");
      markFieldAsModified('union', 'unionStartDate');
      markFieldAsModified('union', 'unionEndDate');
      
      // Direct debug check for union section DOM element
      if (unionSectionRef.current) {
        console.log("📜 UNION section element found in date range handler:", unionSectionRef.current);
        // Try direct scroll to test if the element is scrollable
        try {
          unionSectionRef.current.style.scrollMarginTop = "-20px";
          console.log("📜 Applied scrollMarginTop to union section");
        } catch (e) {
          console.error("📜 Error applying style to union section:", e);
        }
      } else {
        console.warn("📜 UNION section element NOT FOUND in date range handler");
      }
    }
    else if (activityType === 'voluntary') {
      markFieldAsModified('voluntary', 'voluntaryStartDate');
      markFieldAsModified('voluntary', 'voluntaryEndDate');
    }
    
    // After a delay to ensure values are updated, check completion
    console.log(`⏱️ Setting completion check timeout (300ms) for ${activityType}`);
    setTimeout(() => {
      console.log(`⏰ TIMEOUT EXPIRED, now checking completion for ${activityType}`);
      
      const activityKey = activityType === 'party' ? "سياسي" 
                      : activityType === 'union' ? "نقابي"
                      : activityType === 'ngo' ? "اجتماعي"
                      : activityType === 'club' ? "شبابي"
                      : "تطوعي";
      
      checkAndScroll(activityType, activityKey);
    }, 300);
  };

  return (
    <div ref={detailsSectionRef} className="space-y-6 w-full">
      {/* Political Party Section */}
      {selectedActivities.includes("سياسي") && (
        <div ref={partySectionRef} className="flex flex-col gap-6 border-t pt-6  border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2  items-center gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                اسم الحزب
              </label>
              <AutoComplete
                options={PARTY_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر اسم الحزب"
                value={getOptionByValue(PARTY_OPTIONS, watch("partyName"))}
                onValueChange={(option) => {
                  console.log("🏛️ PARTY NAME SELECTED:", option.value);
                  setValue("partyName", option.value);
                  
                  // Mark as modified by user
                  markFieldAsModified('party', 'partyName');
                  
                  // Don't trigger scroll check immediately after name selection
                  // Only check if dates are also filled
                  const partyStartDate = watch("partyStartDate");
                  const partyEndDate = watch("partyEndDate");
                  
                  console.log("🏛️ PARTY DATES after name change:", { partyStartDate, partyEndDate });
                  
                  // Only if both dates are already filled, then check completion
                  if (partyStartDate && partyEndDate) {
                    console.log("⏱️ Both dates already filled, checking completion after delay");
                    setTimeout(() => checkAndScroll('party', "سياسي"), 300);
                  } else {
                    console.log("⏳ Dates not yet filled, waiting for user to fill dates");
                  }
                }}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                الفترة الزمنية
              </label>
              <MonthYearRangePicker
                value={{
                  from: parseISODateToDate(watch('partyStartDate')),
                  to: parseISODateToDate(watch('partyEndDate'))
                }}
                onChange={(range) => handleDateRangeChangeAndScroll('party', range)}
                placeholder="اختر فترة العضوية"
                className="month-year-range-picker"
              />
            </div>
          </div>
        </div>
      )}

      {/* Union Section */}
      {selectedActivities.includes("نقابي") && (
        <div 
          ref={unionSectionRef} 
          data-section="union-section" 
          className="flex flex-col gap-6 border-t pt-6 border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2  items-center gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                اسم النقابة
              </label>
              <AutoComplete
                options={UNION_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر اسم النقابة"
                value={getOptionByValue(UNION_OPTIONS, watch("unionName"))}
                onValueChange={(option) => {
                  console.log("🏢 UNION NAME SELECTED:", option.value);
                  console.log("📜 UNION NAME HANDLER - Union section element exists?", unionSectionRef.current !== null);
                  setValue("unionName", option.value);
                  
                  // Mark as modified by user
                  markFieldAsModified('union', 'unionName');
                  
                  // Try applying scroll margin directly
                  if (unionSectionRef.current) {
                    try {
                      unionSectionRef.current.style.scrollMarginTop = "-20px";
                      console.log("📜 UNION NAME - Applied scrollMarginTop directly");
                    } catch (e) {
                      console.error("📜 UNION NAME - Error applying scroll margin:", e);
                    }
                  }
                  
                  // Don't trigger scroll check immediately after name selection
                  // Only check if dates are also filled
                  const unionStartDate = watch("unionStartDate");
                  const unionEndDate = watch("unionEndDate");
                  
                  console.log("🏢 UNION DATES after name change:", { unionStartDate, unionEndDate });
                  
                  // Only if both dates are already filled, then check completion
                  if (unionStartDate && unionEndDate) {
                    console.log("⏱️ Both dates already filled, checking completion after delay");
                    console.log("📜 UNION NAME - Setting timeout for checkAndScroll");
                    setTimeout(() => {
                      console.log("📜 UNION NAME - Timeout executing checkAndScroll");
                      checkAndScroll('union', "نقابي");
                    }, 300);
                  } else {
                    console.log("⏳ Dates not yet filled, waiting for user to fill dates");
                  }
                }}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                الفترة الزمنية
              </label>
              <MonthYearRangePicker
                value={{
                  from: parseISODateToDate(watch('unionStartDate')),
                  to: parseISODateToDate(watch('unionEndDate'))
                }}
                onChange={(range) => {
                  console.log("📜 UNION DATE PICKER onChange executed");
                  console.log("📜 UNION DATE PICKER - Union section exists?", unionSectionRef.current !== null);
                  
                  // Try direct scroll before delegating to handler
                  if (unionSectionRef.current) {
                    try {
                      console.log("📜 UNION DATE PICKER - Setting margin and attempting direct scroll");
                      unionSectionRef.current.style.scrollMarginTop = "-20px";
                      // Don't actually scroll here, just testing if the element is accessible
                    } catch (e) {
                      console.error("📜 UNION DATE PICKER - Error setting style:", e);
                    }
                  }
                  
                  handleDateRangeChangeAndScroll('union', range);
                }}
                placeholder="اختر فترة العضوية"
                className="month-year-range-picker"
              />
            </div>
          </div>
        </div>
      )}

      {/* NGO Section */}
      {selectedActivities.includes("اجتماعي") && (
        <div ref={ngoSectionRef} className="flex flex-col gap-6 border-t pt-6 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2  items-center gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                اسم المنظمة
              </label>
              <AutoComplete
                options={NGO_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر اسم المنظمة"
                value={getOptionByValue(NGO_OPTIONS, watch("ngoName"))}
                onValueChange={(option) => {
                  console.log("🏥 NGO NAME SELECTED:", option.value);
                  setValue("ngoName", option.value);
                  
                  // Mark as modified by user
                  markFieldAsModified('ngo', 'ngoName');
                  
                  // For NGO, check if activity type is also filled
                  const ngoActivity = watch("ngoActivity");
                  console.log("🏥 NGO ACTIVITY after name change:", { ngoActivity });
                  
                  // Only if activity is already filled, then check completion
                  if (ngoActivity) {
                    console.log("⏱️ Activity already filled, checking completion after delay");
                    setTimeout(() => checkAndScroll('ngo', "اجتماعي"), 300);
                  } else {
                    console.log("⏳ Activity not yet filled, waiting for user to select activity");
                  }
                }}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                نوع النشاط
              </label>
              <AutoComplete
                options={NGO_ACTIVITY_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر نوع النشاط"
                value={getOptionByValue(NGO_ACTIVITY_OPTIONS, watch("ngoActivity"))}
                onValueChange={(option) => {
                  console.log("🏥 NGO ACTIVITY SELECTED:", option.value);
                  setValue("ngoActivity", option.value);
                  
                  // Mark as modified by user
                  markFieldAsModified('ngo', 'ngoActivity');
                  
                  // For NGO, check if name is also filled
                  const ngoName = watch("ngoName"); 
                  console.log("🏥 NGO NAME after activity change:", { ngoName });
                  
                  // Only if name is already filled, then check completion
                  if (ngoName) {
                    console.log("⏱️ Name already filled, checking completion after delay");
                    setTimeout(() => checkAndScroll('ngo', "اجتماعي"), 300);
                  } else {
                    console.log("⏳ Name not yet filled, waiting for user to select name");
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Youth Club Section */}
      {selectedActivities.includes("شبابي") && (
        <div ref={clubSectionRef} className="flex flex-col gap-6 border-t pt-6 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2  items-center gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                اسم النادي
              </label>
              <AutoComplete
                options={CLUB_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر اسم النادي"
                value={getOptionByValue(CLUB_OPTIONS, watch("clubName"))}
                onValueChange={(option) => {
                  console.log("🏆 CLUB NAME SELECTED:", option.value);
                  setValue("clubName", option.value);
                  
                  // Mark as modified by user
                  markFieldAsModified('club', 'clubName');
                  
                  // For Club, check if type is also filled
                  const clubType = watch("clubType");
                  console.log("🏆 CLUB TYPE after name change:", { clubType });
                  
                  // Only if type is already filled, then check completion
                  if (clubType) {
                    console.log("⏱️ Type already filled, checking completion after delay");
                    setTimeout(() => checkAndScroll('club', "شبابي"), 300);
                  } else {
                    console.log("⏳ Type not yet filled, waiting for user to select type");
                  }
                }}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                نوع النادي
              </label>
              <AutoComplete
                options={CLUB_TYPE_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر نوع النادي"
                value={getOptionByValue(CLUB_TYPE_OPTIONS, watch("clubType"))}
                onValueChange={(option) => {
                  console.log("🏆 CLUB TYPE SELECTED:", option.value);
                  setValue("clubType", option.value);
                  
                  // Mark as modified by user
                  markFieldAsModified('club', 'clubType');
                  
                  // For Club, check if name is also filled
                  const clubName = watch("clubName");
                  console.log("🏆 CLUB NAME after type change:", { clubName });
                  
                  // Only if name is already filled, then check completion
                  if (clubName) {
                    console.log("⏱️ Name already filled, checking completion after delay");
                    setTimeout(() => checkAndScroll('club', "شبابي"), 300);
                  } else {
                    console.log("⏳ Name not yet filled, waiting for user to select name");
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Voluntary Section */}
      {selectedActivities.includes("تطوعي") && (
        <div ref={voluntarySectionRef} className="flex flex-col gap-6 border-t pt-7 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2  items-center gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                اسم المبادرة
              </label>
              <AutoComplete
                options={VOLUNTARY_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر اسم المبادرة"
                value={getOptionByValue(VOLUNTARY_OPTIONS, watch("voluntaryName"))}
                onValueChange={(option) => {
                  console.log("🤝 VOLUNTARY NAME SELECTED:", option.value);
                  setValue("voluntaryName", option.value);
                  
                  // Mark as modified by user
                  markFieldAsModified('voluntary', 'voluntaryName');
                  
                  // Don't trigger scroll check immediately after name selection
                  // Only check if dates are also filled
                  const voluntaryStartDate = watch("voluntaryStartDate");
                  const voluntaryEndDate = watch("voluntaryEndDate");
                  
                  console.log("🤝 VOLUNTARY DATES after name change:", { voluntaryStartDate, voluntaryEndDate });
                  
                  // Only if both dates are already filled, then check completion
                  if (voluntaryStartDate && voluntaryEndDate) {
                    console.log("⏱️ Both dates already filled, checking completion after delay");
                    setTimeout(() => checkAndScroll('voluntary', "تطوعي"), 300);
                  } else {
                    console.log("⏳ Dates not yet filled, waiting for user to fill dates");
                  }
                }}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                الفترة الزمنية
              </label>
              <MonthYearRangePicker
                value={{
                  from: parseISODateToDate(watch('voluntaryStartDate')),
                  to: parseISODateToDate(watch('voluntaryEndDate'))
                }}
                onChange={(range) => handleDateRangeChangeAndScroll('voluntary', range)}
                placeholder="اختر فترة التطوع"
                className="month-year-range-picker"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 