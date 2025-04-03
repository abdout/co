'use client';

import Intro from '@/components/platform/project/mos/intro'
import React, { useEffect, useRef, useState } from 'react'
import Action from '@/components/platform/project/layout/action';
import { useProject } from '@/provider/project';
import { usePDF } from 'react-to-pdf';
import { allActivities } from 'contentlayer/generated';
import type { Activity as ContentActivity } from 'contentlayer/generated';
import { Activity } from '@/components/platform/project/types';
import ActivityRenderer from '@/components/platform/project/mos/activity-renderer';
import { ActivityWrapper } from '@/components/platform/project/mos/warpper';
import GenerateNotice from '@/components/platform/project/mos/generate-notice';
import { checkMosContentExists, generateMosContent } from '@/components/platform/project/mos/actions';
import { useToast } from '@/components/ui/use-toast';

interface Params {
  id: string;
}

const MOS = ({ params }: { params: Params | Promise<Params> }) => {
  // Properly unwrap params using React.use() for Next.js 15
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  const id = unwrappedParams.id;
  
  const { project, fetchProject } = useProject();
  const loadedProjectId = useRef<string | null>(null);
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentExists, setContentExists] = useState(true);
  
  // Check if MOS content exists
  useEffect(() => {
    const checkContent = async () => {
      const contentStatus = await checkMosContentExists();
      setContentExists(contentStatus.exists && contentStatus.count > 0);
    };
    
    checkContent();
  }, []);
  
  useEffect(() => {
    // Prevent re-fetching if we already have the project data for this ID
    if (project && project._id === id && loadedProjectId.current === id) {
      return;
    }
    
    fetchProject(id);
    loadedProjectId.current = id;
  }, [id, fetchProject, project]);
  
  const { toPDF, targetRef } = usePDF({
    filename: `${project?.customer} MOS.pdf`,
  });
  
  // Handle content generation
  const handleGenerateContent = async () => {
    setIsGenerating(true);
    
    try {
      const result = await generateMosContent();
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'MOS content generated successfully. Reloading page...',
        });
        
        // Reload the page to get new content
        window.location.reload();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate MOS content',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Match project activities with content activities
  const getProjectActivitiesWithContent = () => {
    if (!project || !project.activities || project.activities.length === 0) {
      return [];
    }
    
    // Helper function to normalize strings for comparison
    const normalizeString = (str: string) => {
      if (!str) return '';
      return str.toLowerCase()
        .replace(/\./g, '') // Remove periods
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[\/\\]/g, '-') // Replace slashes with hyphens
        .trim();
    };
    
    return project.activities.map(activity => {
      // Find matching content activity with improved string normalization
      const match = allActivities.find(contentActivity => {
        const normalizedSystemType = normalizeString(contentActivity.systemType);
        const normalizedSubitem = normalizeString(contentActivity.subitem);
        const normalizedTitle = normalizeString(contentActivity.title);
        
        const normalizedActivitySystem = normalizeString(activity.system);
        const normalizedActivityCategory = normalizeString(activity.category);
        const normalizedActivityName = normalizeString(activity.activity);
        
        // First try exact match
        const exactMatch = 
          normalizedSystemType === normalizedActivitySystem &&
          normalizedSubitem === normalizedActivityCategory &&
          normalizedTitle === normalizedActivityName;
        
        if (exactMatch) return true;
        
        // Then try more flexible matching for title if system and category match
        const systemAndCategoryMatch = 
          normalizedSystemType === normalizedActivitySystem &&
          normalizedSubitem === normalizedActivityCategory;
          
        if (systemAndCategoryMatch) {
          // Check if title contains activity name or vice versa
          const titleContainsActivity = normalizedTitle.includes(normalizedActivityName);
          const activityContainsTitle = normalizedActivityName.includes(normalizedTitle);
          
          // Sometimes periods are kept in filenames as hyphens
          const titleWithDots = normalizedTitle.replace(/-/g, '.');
          const activityWithDots = normalizedActivityName.replace(/-/g, '.');
          const dotsMatch = titleWithDots === activityWithDots;
          
          return titleContainsActivity || activityContainsTitle || dotsMatch;
        }
        
        return false;
      });
      
      if (!match && activity.system && activity.category && activity.activity) {
        console.log(
          `No match found for: System=${activity.system}, Category=${activity.category}, Activity=${activity.activity}`
        );
        console.log(
          `Normalized: System=${normalizeString(activity.system)}, Category=${normalizeString(activity.category)}, Activity=${normalizeString(activity.activity)}`
        );
        
        // Log available activities for this system and category for debugging
        const potentialMatches = allActivities.filter(contentActivity => {
          const normalizedSystemType = normalizeString(contentActivity.systemType);
          const normalizedSubitem = normalizeString(contentActivity.subitem);
          
          const normalizedActivitySystem = normalizeString(activity.system);
          const normalizedActivityCategory = normalizeString(activity.category);
          
          return normalizedSystemType === normalizedActivitySystem &&
                 normalizedSubitem === normalizedActivityCategory;
        });
        
        if (potentialMatches.length > 0) {
          console.log('Potential matches found with same system and category:');
          potentialMatches.forEach(potential => {
            console.log(`- Title: ${potential.title} (normalized: ${normalizeString(potential.title)})`);
          });
        }
      }
      
      return {
        projectActivity: activity,
        contentActivity: match
      };
    });
  };
  
  const activitiesWithContent = getProjectActivitiesWithContent();
  
  // Group activities by system and category
  const groupedActivities = activitiesWithContent.reduce((acc, { projectActivity, contentActivity }) => {
    const system = projectActivity.system;
    const category = projectActivity.category;
    
    if (!acc[system]) {
      acc[system] = {};
    }
    
    if (!acc[system][category]) {
      acc[system][category] = [];
    }
    
    acc[system][category].push({ 
      projectActivity,
      contentActivity 
    });
    
    return acc;
  }, {} as Record<string, Record<string, Array<{
    projectActivity: Activity;
    contentActivity?: ContentActivity;
  }>>>);
  
  return (
    <div className='flex flex-col gap-6 w-[60rem]'>
      <Action projectTitle={project?.customer || ""} toPDF={toPDF} />
      
      {!contentExists && (
        <GenerateNotice onGenerate={handleGenerateContent} isGenerating={isGenerating} />
      )}
      
      <div ref={targetRef} className="space-y-6">
        <Intro />
        
        <ActivityWrapper activities={allActivities || []}>
          {Object.entries(groupedActivities).map(([systemType, categories]) => (
            <div key={systemType} className="space-y-4">
              <h2 className="text-2xl font-bold">{systemType}</h2>
              {Object.entries(categories).map(([category, activities]) => (
                <div key={category} className="ml-4 space-y-2">
                  <h3 className="text-xl font-semibold">{category}</h3>
                  {activities.map(({ projectActivity, contentActivity }, index) => (
                    <div key={`${projectActivity.system}-${projectActivity.category}-${projectActivity.activity}-${index}`} className="ml-4">
                      <ActivityRenderer 
                        activity={projectActivity} 
                        contentActivity={contentActivity} 
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          
          {activitiesWithContent.length === 0 && project && (
            <div className="p-4 border rounded-md bg-muted">
              <p>No activities found for this project. Please add activities to see MOS content.</p>
            </div>
          )}
        </ActivityWrapper>
      </div>
    </div>
  )
}

export default MOS