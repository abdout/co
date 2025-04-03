'use client';

import React from 'react';
import { MDXContent } from '@/components/mdx-content';
import { Activity as ContentActivity } from 'contentlayer/generated';
import { Activity } from '@/components/platform/project/types';
import { allActivities } from 'contentlayer/generated';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

interface ActivityRendererProps {
  activity: Activity;
  contentActivity?: ContentActivity;
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

export const ActivityRenderer: React.FC<ActivityRendererProps> = ({ 
  activity, 
  contentActivity: initialContentActivity 
}) => {
  const [showDebug, setShowDebug] = React.useState(false);
  const [contentActivity, setContentActivity] = React.useState<ContentActivity | undefined>(initialContentActivity);
  const [possibleMatches, setPossibleMatches] = React.useState<Array<{
    contentActivity: ContentActivity;
    similarity: string;
  }>>([]);
  const [renderError, setRenderError] = React.useState<string | null>(null);
  
  // Try to find the content activity if it wasn't passed in
  React.useEffect(() => {
    if (!initialContentActivity) {
      // Filter by system first
      const systemMatches = allActivities.filter(contentAct => 
        normalizeString(contentAct.systemType) === normalizeString(activity.system)
      );
      
      // Then get matches by category
      const categoryMatches = systemMatches.filter(contentAct => 
        normalizeString(contentAct.subitem) === normalizeString(activity.category)
      );
      
      // Find activities that might be similar
      const potentialMatches = categoryMatches.map(match => {
        const normalizedTitle = normalizeString(match.title);
        const normalizedActivity = normalizeString(activity.activity);
        
        let similarity = "unknown";
        
        if (normalizedTitle === normalizedActivity) {
          similarity = "exact";
        } else if (normalizedTitle.includes(normalizedActivity)) {
          similarity = "title contains activity";
        } else if (normalizedActivity.includes(normalizedTitle)) {
          similarity = "activity contains title";
        } else {
          // Check edit distance or other similarity measures
          // (simplified version here)
          const titleWithDots = normalizedTitle.replace(/-/g, '.');
          const activityWithDots = normalizedActivity.replace(/-/g, '.');
          if (titleWithDots === activityWithDots) {
            similarity = "equivalent with dots";
          } else {
            similarity = "related";
          }
        }
        
        return { contentActivity: match, similarity };
      });
      
      setPossibleMatches(potentialMatches);
      
      if (potentialMatches.length > 0) {
        console.log(
          `Potential matches for ${activity.system}/${activity.category}/${activity.activity}:`, 
          potentialMatches.map(m => `${m.contentActivity.title} (${m.similarity})`)
        );
      }
    }
  }, [activity, initialContentActivity]);

  // Handle selecting a content activity from the dropdown
  const handleSelectContent = (value: string) => {
    const selected = allActivities.find(act => act._id === value);
    setContentActivity(selected);
    setRenderError(null); // Reset error state when selecting new content
  };

  // Safe rendering of MDX content with error boundaries
  const renderMDXContent = () => {
    if (!contentActivity || !contentActivity.body?.code) {
      return <p className="text-muted-foreground">Content is missing or invalid.</p>;
    }

    try {
      return <MDXContent code={contentActivity.body.code} />;
    } catch (error) {
      console.error("Failed to render MDX content:", error);
      setRenderError(error instanceof Error ? error.message : "Unknown rendering error");
      return (
        <div className="p-2 bg-destructive/10 text-destructive rounded">
          <p>Failed to render content. Please try another file or regenerate content.</p>
        </div>
      );
    }
  };

  if (!contentActivity) {
    return (
      <div className="p-4 border rounded-md bg-muted">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium">{activity.activity}</h4>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          No MOS content found for this activity.
        </p>
        
        {possibleMatches.length > 0 && (
          <div className="mb-3">
            <label className="text-sm font-medium">Select content manually:</label>
            <Select onValueChange={handleSelectContent}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Choose content..."/>
              </SelectTrigger>
              <SelectContent>
                {possibleMatches.map((match) => (
                  <SelectItem 
                    key={match.contentActivity._id} 
                    value={match.contentActivity._id}
                  >
                    {match.contentActivity.title} ({match.similarity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {showDebug && (
          <div className="mt-3 text-xs border-t pt-2 text-muted-foreground">
            <p><strong>Looking for:</strong></p>
            <pre className="bg-secondary p-2 mt-1 rounded overflow-x-auto">
              System: {activity.system} (normalized: {normalizeString(activity.system)})<br/>
              Category: {activity.category} (normalized: {normalizeString(activity.category)})<br/>
              Activity: {activity.activity} (normalized: {normalizeString(activity.activity)})
            </pre>
            
            {possibleMatches.length > 0 ? (
              <>
                <p className="mt-2"><strong>Possible matches found ({possibleMatches.length}):</strong></p>
                <div className="bg-secondary p-2 mt-1 rounded overflow-x-auto">
                  {possibleMatches.map((match, i) => (
                    <div key={i} className="border-b border-secondary-foreground/10 pb-1 mb-1 last:border-0 last:mb-0 last:pb-0">
                      <strong>{match.contentActivity.title}</strong> 
                      <small className="ml-1">({match.similarity})</small><br/>
                      <small>Path: {match.contentActivity.slug}</small>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-2 text-muted-foreground">No potential matches found in the content directory.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4 mb-4">
      <h4 className="text-lg font-medium">{contentActivity.title}</h4>
      {renderError && (
        <div className="p-2 bg-destructive/10 text-destructive rounded mb-3">
          <p className="text-sm">Error rendering content: {renderError}</p>
        </div>
      )}
      <div className="prose prose-sm max-w-none">
        {renderMDXContent()}
      </div>
    </div>
  );
};

export default ActivityRenderer; 