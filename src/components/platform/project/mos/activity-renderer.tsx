'use client';

import React from 'react';
import { MDXContent } from '@/components/mdx-content';
import { Activity } from '@/components/platform/project/types';

// Define the ContentActivity type
type ContentActivity = {
  _id: string;
  title: string;
  system: string;
  category: string;
  description: string;
  body: {
    raw: string;
    code: string | null;
  };
  slug: string;
  systemType?: string;
  subitem?: string;
  [key: string]: any;
};

interface ActivityRendererProps {
  activity: Activity;
  contentActivity?: ContentActivity;
}

export const ActivityRenderer: React.FC<ActivityRendererProps> = ({ 
  activity, 
  contentActivity: initialContentActivity 
}) => {
  const [contentActivity, setContentActivity] = React.useState<ContentActivity | undefined>(initialContentActivity);
  const [renderError, setRenderError] = React.useState<string | null>(null);
  
  // Render content from MDX
  const renderContent = () => {
    if (!contentActivity || !contentActivity.body) {
      return <p className="text-muted-foreground">Content is missing or invalid.</p>;
    }

    try {
      // If we have compiled MDX code, use MDXContent
      if (contentActivity.body.code) {
        return <MDXContent code={contentActivity.body.code} />;
      }
      
      // If we have raw content but no compiled code, render it as pre-formatted text
      if (contentActivity.body.raw) {
        // Try to format the Markdown in a simple way
        const sections = contentActivity.body.raw.split('\n\n');
        
        return (
          <div>
            {sections.map((section, index) => {
              // Check if this is a heading section (# or ##)
              if (section.startsWith('# ')) {
                const title = section.replace(/^# /, '').trim();
                return <h1 key={index} className="text-xl font-bold mt-4 mb-2">{title}</h1>;
              }
              
              if (section.startsWith('## ')) {
                const title = section.replace(/^## /, '').trim();
                return <h2 key={index} className="text-lg font-semibold mt-3 mb-2">{title}</h2>;
              }
              
              // Check if this is a list section
              if (section.includes('\n- ')) {
                const lines = section.split('\n');
                return (
                  <ul key={index} className="list-disc pl-5 space-y-1 my-2">
                    {lines.filter(line => line.startsWith('- ')).map((line, i) => (
                      <li key={i}>{line.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                );
              }
              
              // Default rendering for other sections
              return <p key={index} className="my-2">{section}</p>;
            })}
          </div>
        );
      }
      
      return <p className="text-muted-foreground">No content available to render.</p>;
    } catch (error) {
      console.error("Failed to render content:", error);
      setRenderError(error instanceof Error ? error.message : "Unknown rendering error");
      return (
        <div className="p-2 bg-destructive/10 text-destructive rounded">
          <p>Failed to render content. Please try another file or regenerate content.</p>
        </div>
      );
    }
  };

  // This component now renders content from the MDX file or placeholders
  if (contentActivity && contentActivity.body && (contentActivity.body.code || contentActivity.body.raw)) {
    // We have content, render it
    return (
      <div className="px-8 mb-4">
        {renderError && (
          <div className="p-2 bg-destructive/10 text-destructive rounded mb-3">
            <p className="text-sm">Error rendering content: {renderError}</p>
          </div>
        )}
        <div className="prose prose-sm max-w-none">
          {renderContent()}
        </div>
      </div>
    );
  }

  // No content available, render placeholder
  return (
    <div className="px-8 mb-6">
      <h4 className="text-lg font-medium mb-2">{activity.activity}</h4>
      <p className="text-sm text-muted-foreground mb-3">
        This activity provides maintenance procedures for {activity.system} {activity.category} {activity.activity}.
      </p>
      
      <div className="space-y-4">
        <div>
          <h5 className="font-medium text-sm mb-2">Equipment Specifications</h5>
          <p className="text-sm pl-2">Specify the required equipment and tools for this maintenance activity.</p>
        </div>
        
        <div>
          <h5 className="font-medium text-sm mb-2">Test Procedures</h5>
          <p className="text-sm pl-2">Document the step-by-step process for performing the maintenance tests.</p>
        </div>
        
        <div>
          <h5 className="font-medium text-sm mb-2">Acceptance Criteria</h5>
          <p className="text-sm pl-2">Define the standards and measurements that indicate successful maintenance.</p>
        </div>
        
        <div>
          <h5 className="font-medium text-sm mb-2">Safety Considerations</h5>
          <p className="text-sm pl-2">Outline safety protocols and precautions required for this activity.</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityRenderer; 