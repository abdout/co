'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import GitHubContributionGraph from './contribution-graph';
import GitHubTimeline from './contribution-activity';
import { Repo, Paper } from '@/components/atom/icon';





export default function Issue() {
  // Calculate closed issues count
  
  
  // Calculate longest streak (we'll use a placeholder since the real data is in the GitHubContributionGraph component)
  const longestStreak = 6;
  
  // Calculate total contributions (we'll use a placeholder since the real data is in the GitHubContributionGraph component)
  const totalContributions = 28;

  return (
    <div className="space-y-6 py-4 pr-5" dir="rtl">
      {/* Contribution stats */}
      <h6 className="text-base font-medium mb-6 text-right" dir="rtl">مشارك </h6>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 max-w-xs md:max-w-none">
        <div className="border rounded-lg p-4 space-y-2">
          <p className="flex items-center gap-2"><Repo className="h-4 w-4 text-[#8B949E]" /> مستودع</p>
          <h6 className="text-base text-right">أتمتة الاعمال</h6>
        </div>
        
        <div className="border rounded-lg p-4 space-y-2">
          <p className="flex items-center gap-2"><Paper /> ورقة</p>
          <h6 className="text-base text-right">الاقتصاد التشاركي</h6>
        </div>
      </div>
      
      {/* GitHub Contribution Graph */}
      <Card className="mb-6 -mr-8 max-w-sm md:max-w-none">
        <CardContent className="pt-6">
          <GitHubContributionGraph />
        </CardContent>
      </Card>
      
      {/* GitHub Contribution Activity */}
      <Card className="mb-6 border-0 shadow-none">
        <CardContent className="pt-6">
        <h6 className="text-base font-medium mb-6 text-right -mr-4" dir="rtl">تفصيل المساهمات </h6>
          <div className="-mx-6 -mb-2">
            <GitHubTimeline />
          </div>
        </CardContent>
      </Card>
      
      
    </div>
  );
}
