'use client';

import Intro from '@/components/platform/project/mos/intro'
import React, { useEffect, useState } from 'react'
import Action from '@/components/platform/project/layout/action';
import { usePDF } from 'react-to-pdf';
import { Activity } from '@/components/platform/project/types';
import ActivityRenderer from '@/components/platform/project/mos/activity-renderer';
import GenerateNotice from '@/components/platform/project/mos/generate-notice';
import { checkMosContentExists, generateMosContent, loadMdxContent, normalizeForFile } from '@/components/platform/project/mos/actions';
import { useToast } from '@/components/ui/use-toast';
import { getProject } from '@/components/platform/project/actions';

// Define the ContentActivity type for Contentlayer
type ContentActivity = {
  title: string;
  system: string;
  category: string;
  description: string;
  body: {
    raw: string;
    code: string;
  };
  slug: string;
  url: string;
  _id: string;
  [key: string]: any; // Add index signature for additional properties
};

interface Params {
  id: string;
}

interface ProjectActivity {
  system: string;
  category: string;
  activity: string;
}

interface ActivityWithContent {
  projectActivity: ProjectActivity;
  contentActivity?: ContentActivity;
  categoryContent?: ContentActivity; // Store the category-level content
}

interface CategoryActivities {
  [category: string]: ActivityWithContent[];
}

interface GroupedActivities {
  [system: string]: CategoryActivities;
}

// Local utility function for client-side normalization
const normalizeString = (str: string): string => {
  return str.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[\.\/\\]/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .trim();
};

const MOS = ({ params }: { params: Params | Promise<Params> }) => {
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  const id = unwrappedParams.id;
  
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentExists, setContentExists] = useState(true);
  const [categoryContents, setCategoryContents] = useState<Record<string, ContentActivity>>({});
  const { toast } = useToast();
  
  // Check if MOS content exists
  useEffect(() => {
    const checkContent = async () => {
      const contentStatus = await checkMosContentExists();
      setContentExists(contentStatus.exists && contentStatus.count > 0);
    };
    
    checkContent();
  }, []);
  
  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const result = await getProject(id);
        if (result.success && result.project) {
          setProject(result.project);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to fetch project',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch project',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, toast]);
  
  // Load MDX content for all system/category combinations
  useEffect(() => {
    if (!project || !project.activities) return;
    
    // Track which system/category combinations we've already processed
    const processed = new Set<string>();
    const contents: Record<string, ContentActivity> = {};
    
    const loadContents = async () => {
      // Get unique system/category combinations
      for (const activity of project.activities) {
        const system = activity.system;
        const category = activity.category;
        
        // Use client-side normalization for the key
        const key = `${normalizeString(system)}/${normalizeString(category)}`;
        
        // Skip if we've already processed this combination
        if (processed.has(key)) continue;
        processed.add(key);
        
        // Load the content
        try {
          const result = await loadMdxContent(system, category);
          if (result.success && result.content) {
            contents[key] = result.content;
          }
        } catch (error) {
          console.error(`Failed to load content for ${system}/${category}:`, error);
        }
      }
      
      // Update state with all loaded contents
      setCategoryContents(contents);
    };
    
    loadContents();
  }, [project]);
  
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
  
  // Prepare project activities
  const getProjectActivitiesWithContent = (): ActivityWithContent[] => {
    if (!project || !project.activities || project.activities.length === 0) {
      return [];
    }
    
    // Return project activities and organize by system and category
    return project.activities.map((activity: ProjectActivity) => {
      // Get normalized system and category for file path using client-side function
      const normalizedSystem = normalizeString(activity.system);
      const normalizedCategory = normalizeString(activity.category);
      
      // Create a unique key for this system+category combination
      const categoryKey = `${normalizedSystem}/${normalizedCategory}`;
      
      // Get the category content from our state
      const categoryContent = categoryContents[categoryKey];
      
      return {
        projectActivity: activity,
        contentActivity: undefined,
        categoryContent: categoryContent
      };
    });
  };
  
  const activitiesWithContent = getProjectActivitiesWithContent();
  
  // Group activities by system and category
  const groupedActivities = activitiesWithContent.reduce((acc: GroupedActivities, { projectActivity, contentActivity, categoryContent }: ActivityWithContent) => {
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
      contentActivity,
      categoryContent
    });
    
    return acc;
  }, {} as GroupedActivities);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }
  
  return (
    <div className='flex flex-col gap-8 w-[60rem]'>
      <Action projectTitle={project.customer || ""} toPDF={toPDF} />
      
      {!contentExists && (
        <GenerateNotice onGenerate={handleGenerateContent} isGenerating={isGenerating} />
      )}
      
      <div ref={targetRef} className="space-y-8">
        <Intro project={project} />
        
        <div className="space-y-10">
          {Object.entries(groupedActivities).map(([systemType, categories]) => (
            <div key={systemType} className="space-y-6">
              <h2 className="text-2xl font-bold px-6">{systemType}</h2>
              {Object.entries(categories as CategoryActivities).map(([category, categoryActivities]) => {
                // Get the first entry to access the shared categoryContent
                const firstActivity = categoryActivities[0];
                const { categoryContent } = firstActivity || {};
                
                return (
                  <div key={category} className="space-y-4">
                    <h3 className="text-xl font-semibold px-6">{category}</h3>
                    
                    {/* If we have category content, display it using ActivityRenderer */}
                    {categoryContent ? (
                      <div className="px-8 mb-4">
                        <ActivityRenderer 
                          activity={{
                            system: systemType,
                            category: category,
                            activity: category
                          }}
                          contentActivity={categoryContent}
                        />
                      </div>
                    ) : (
                      // Otherwise, display activities individually
                      categoryActivities.map(({ projectActivity, contentActivity }: ActivityWithContent, index: number) => (
                        <div key={`${projectActivity.system}-${projectActivity.category}-${projectActivity.activity}-${index}`}>
                          <ActivityRenderer 
                            activity={projectActivity} 
                            contentActivity={contentActivity} 
                          />
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
          {activitiesWithContent.length === 0 && (
            <div className="px-8 py-4 bg-muted rounded-md">
              <p>No activities found for this project. Please add activities to see MOS content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MOS;